"""Additional counterexamples for required attributes and legitimate permissions."""

from dataclasses import replace
from datetime import datetime, timedelta, timezone, tzinfo
import unittest

from municipal_service import (Actor, Application, Settings, SupportGrant, authorize,
                               fictional_database, search_applications)


class StringSubclass(str):
    pass


class NaiveZone(tzinfo):
    def utcoffset(self, value):
        return None


INVALID_DEPARTMENTS = (None, "", " ", "\t\n", "\u3000", "\u00a0", "\u200b",
                       " housing", "housing ", "Housing", "unknown", 1, True,
                       [], {}, b"housing", StringSubclass("housing"))


class InputContractTests(unittest.TestCase):
    def setUp(self):
        self.officer = Actor("officer-a", "officer", "housing")
        self.resident = Actor("resident-a", "resident")
        self.application = Application(1, "resident-a", "housing", "submitted")
        self.connection = fictional_database()
        self.addCleanup(self.connection.close)

    def test_department_matrix_for_read_and_review(self):
        values = INVALID_DEPARTMENTS + ("housing", "welfare")
        for actor_department in values:
            for target_department in values:
                expected = (type(actor_department) is str and type(target_department) is str
                            and actor_department in {"housing", "welfare"}
                            and actor_department == target_department)
                actor = replace(self.officer, department=actor_department)
                target = replace(self.application, department=target_department)
                with self.subTest(actor=actor_department, target=target_department):
                    self.assertIs(authorize(actor, "read", target, "comment"), expected)
                    self.assertIs(authorize(actor, "review", target, "decision"), expected)

    def test_invalid_officer_search_scope_denies_before_sql(self):
        executed = []
        self.connection.set_trace_callback(executed.append)
        for department in INVALID_DEPARTMENTS:
            with self.subTest(department=department), self.assertRaises(PermissionError):
                search_applications(self.connection, replace(self.officer, department=department), "")
        self.assertEqual(executed, [])

    def test_valid_search_scope_excludes_invalid_department_rows(self):
        for application_id, department in enumerate((None, "", " ", "unknown", "housing "), 10):
            self.connection.execute("INSERT INTO applications VALUES (?, ?, ?, ?, ?, ?, ?)",
                (application_id, "resident-z", department, "架空", "架空", 1, 1))
        self.assertEqual({row[0] for row in search_applications(self.connection, self.officer, "")},
                         {1, 2, 4})
        welfare = replace(self.officer, department="welfare")
        self.assertEqual([row[0] for row in search_applications(self.connection, welfare, "")], [3])

    def test_missing_department_does_not_block_other_legitimate_roles(self):
        for department in INVALID_DEPARTMENTS:
            with self.subTest(department=department):
                resident = replace(self.resident, department=department)
                own = replace(self.application, department=department, state="draft")
                self.assertTrue(authorize(resident, "read", own, "comment"))
                self.assertTrue(authorize(resident, "edit", own, "comment"))
                self.assertFalse(authorize(resident, "read", replace(own, owner_id="resident-b"), "comment"))
                self.assertEqual({row[0] for row in search_applications(self.connection, resident, "")}, {1, 2, 4})
        admin = Actor("admin-a", "admin")
        self.assertTrue(authorize(admin, "configure"))
        self.assertFalse(authorize(admin, "read", self.application, "comment"))

    def test_missing_and_wrong_type_identity_cannot_match(self):
        for identity in (None, "", " ", "resident a", "\u200b", 1, True, [], {}, StringSubclass("resident-a")):
            actor = replace(self.resident, actor_id=identity)
            target = replace(self.application, owner_id=identity)
            with self.subTest(identity=identity):
                self.assertFalse(authorize(actor, "read", target, "comment"))
                self.assertFalse(authorize(self.resident, "read", target, "comment"))
                with self.assertRaises(PermissionError):
                    search_applications(self.connection, actor, "")

    def test_availability_and_active_flags_require_true(self):
        for flag in (False, None, "", "false", "true", 0, 1, [], {}):
            with self.subTest(flag=flag):
                self.assertFalse(authorize(self.officer, "read", self.application, "comment",
                                           attributes_available=flag))
                self.assertFalse(authorize(replace(self.officer, active=flag), "read", self.application, "comment"))
                with self.assertRaises(PermissionError):
                    search_applications(self.connection, self.officer, "", attributes_available=flag)
                with self.assertRaises(PermissionError):
                    search_applications(self.connection, replace(self.officer, active=flag), "")

    def test_support_flags_and_target_id_are_not_coerced(self):
        vendor = Actor("vendor-a", "vendor")
        expiry = datetime(2026, 10, 11, 9, tzinfo=timezone.utc)
        grant = SupportGrant(vendor.actor_id, 1, expiry, True)
        options = dict(settings=Settings(support_enabled=True), grant=grant,
                       now=expiry-timedelta(microseconds=1))
        self.assertTrue(authorize(vendor, "diagnostics", self.application, "event_code", **options))
        for flag in (None, "false", "true", 0, 1):
            with self.subTest(flag=flag):
                self.assertFalse(authorize(vendor, "diagnostics", self.application, "event_code",
                    **(options | {"grant": replace(grant, approved=flag)})))
                self.assertFalse(authorize(vendor, "diagnostics", self.application, "event_code",
                    **(options | {"settings": Settings(support_enabled=flag)})))
        self.assertFalse(authorize(vendor, "diagnostics", self.application, "event_code",
            **(options | {"grant": replace(grant, application_id=True)})))
        self.assertFalse(authorize(replace(vendor, actor_id=None), "diagnostics", self.application, "event_code",
            **(options | {"grant": replace(grant, actor_id=None)})))

    def test_malformed_protected_record_operation_and_field_deny(self):
        for actor in (None, {}, object(), replace(self.officer, role=[])):
            with self.subTest(actor=actor):
                self.assertFalse(authorize(actor, "read", self.application, "comment"))
        for target in (None, {}, object(), replace(self.application, application_id=True),
                       replace(self.application, application_id="1")):
            with self.subTest(target=target):
                self.assertFalse(authorize(self.officer, "read", target, "comment"))
        self.assertFalse(authorize(self.officer, [], self.application, "comment"))
        self.assertFalse(authorize(self.officer, "read", self.application, []))

    def test_support_time_input_requires_aware_datetime(self):
        vendor = Actor("vendor-a", "vendor")
        expiry = datetime(2026, 10, 11, 9, tzinfo=timezone.utc)
        grant = SupportGrant(vendor.actor_id, 1, expiry, True)
        for time_value in (None, "2026-10-11", expiry.replace(tzinfo=None),
                           expiry.replace(tzinfo=NaiveZone())):
            with self.subTest(time_value=time_value):
                self.assertFalse(authorize(vendor, "diagnostics", self.application, "event_code",
                    settings=Settings(support_enabled=True), grant=grant, now=time_value))
                self.assertFalse(authorize(vendor, "diagnostics", self.application, "event_code",
                    settings=Settings(support_enabled=True), grant=replace(grant, expires_at=time_value),
                    now=expiry-timedelta(microseconds=1)))

    def test_search_option_shapes_reject_ambiguous_values(self):
        for value in ([], {}, 1, None):
            with self.subTest(sort=value), self.assertRaises(ValueError):
                search_applications(self.connection, self.officer, "", sort=value)
        for value in (None, "false", 0, 1):
            with self.subTest(literal=value), self.assertRaises(ValueError):
                search_applications(self.connection, self.officer, "", literal=value)


if __name__ == "__main__":
    unittest.main()
