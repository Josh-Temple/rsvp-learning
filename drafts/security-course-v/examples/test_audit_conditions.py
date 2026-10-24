"""Reconstruct C's 12 conditions; these are author regression tests, not C acceptance.

The first two also exist in the original test file as the Red-to-Green regressions.
Assertions reflect the report pinned at 2ef5ee94619a8faff0f60f9313e10b86af009a00.
"""

from dataclasses import replace
from datetime import datetime, timedelta, timezone
import unittest

from municipal_service import (Actor, Application, Settings, SupportGrant, authorize,
                               fictional_database, render_plain_comment,
                               search_applications)
from test_municipal_service import TextProbe


class AuditConditions(unittest.TestCase):
    def setUp(self):
        self.resident = Actor("resident-a", "resident")
        self.officer = Actor("officer-a", "officer", "housing")
        self.application = Application(1, "resident-a", "housing")
        self.vendor = Actor("vendor-a", "vendor")
        self.expiry = datetime(2026, 10, 11, 9, tzinfo=timezone.utc)
        self.grant = SupportGrant(self.vendor.actor_id, 1, self.expiry, True)
        self.support = dict(settings=Settings(support_enabled=True), grant=self.grant)
        self.connection = fictional_database()
        self.addCleanup(self.connection.close)

    def test_audit_01_missing_departments_deny(self):
        self.assertFalse(authorize(Actor("officer-c", "officer"), "read",
                                   Application(5, "resident-c", None), "comment"))

    def test_audit_02_empty_departments_deny(self):
        self.assertFalse(authorize(Actor("officer-c", "officer", ""), "review",
                                   Application(5, "resident-c", "", "submitted"), "decision"))

    def test_audit_03_same_and_other_valid_department(self):
        self.assertTrue(authorize(self.officer, "read", self.application, "comment"))
        self.assertFalse(authorize(self.officer, "read",
                                   replace(self.application, department="welfare"), "comment"))

    def test_audit_04_unavailable_attributes_deny(self):
        self.assertFalse(authorize(self.officer, "read", self.application, "comment",
                                   attributes_available=False))

    def test_audit_05_public_notice_survives_attribute_failure(self):
        self.assertTrue(authorize(None, "public_notice", attributes_available=False))
        self.assertFalse(authorize(None, "public_notice", self.application, "comment",
                                   attributes_available=False))

    def test_audit_06_unknown_operation_and_field_deny(self):
        self.assertFalse(authorize(self.resident, "erase", self.application, "comment"))
        self.assertFalse(authorize(self.resident, "read", self.application, "owner_id"))

    def test_audit_07_expiry_microsecond_and_timezone(self):
        self.assertTrue(authorize(self.vendor, "diagnostics", self.application, "event_code",
                                  now=self.expiry-timedelta(microseconds=1), **self.support))
        same_instant = self.expiry.astimezone(timezone(timedelta(hours=9)))
        self.assertFalse(authorize(self.vendor, "diagnostics", self.application, "event_code",
                                   now=same_instant, **self.support))
        self.assertFalse(authorize(self.vendor, "diagnostics", self.application, "event_code",
                                   now=self.expiry+timedelta(microseconds=1), **self.support))

    def test_audit_08_naive_time_and_other_grantee_deny(self):
        before = self.expiry-timedelta(microseconds=1)
        self.assertFalse(authorize(self.vendor, "diagnostics", self.application, "event_code",
                                   now=before.replace(tzinfo=None), **self.support))
        self.assertFalse(authorize(self.vendor, "diagnostics", self.application, "event_code",
                                   now=before, **(self.support | {
                                       "grant": replace(self.grant, actor_id="vendor-b")})))

    def test_audit_09_like_metacharacters_are_literal(self):
        for application_id, name, query in ((5, r"back\slash", "\\"),
                                             (6, "under_score", "_"),
                                             (7, "percent%mark", "%")):
            with self.subTest(query=query):
                self.connection.execute("INSERT INTO applications VALUES (?, ?, ?, ?, ?, ?, ?)",
                    (application_id, "resident-c", "housing", name, "架空", 1, 1))
                rows = search_applications(self.connection, self.officer, query, literal=True)
                expected = {2, 7} if query == "%" else {application_id}
                self.assertEqual({row[0] for row in rows}, expected)
                # Remove the baseline percent row to reproduce C's isolated extra row.
                if query == "%":
                    self.connection.execute("DELETE FROM applications WHERE id = ?", (2,))
                    self.assertEqual([row[0] for row in search_applications(
                        self.connection, self.officer, query)], [application_id])

    def test_audit_10_wildcard_keeps_scope_and_missing_officer_denies(self):
        self.assertEqual({row[0] for row in search_applications(
            self.connection, self.resident, "%", literal=False)}, {1, 2, 4})
        with self.assertRaises(PermissionError):
            search_applications(self.connection, replace(self.officer, department=None), "")

    def test_audit_11_unicode_length_boundaries(self):
        self.assertEqual(search_applications(self.connection, self.resident, "あ"*80), [])
        with self.assertRaises(ValueError):
            search_applications(self.connection, self.resident, "あ"*81)
        value = "あ"*500
        probe = TextProbe()
        probe.feed(render_plain_comment(value))
        self.assertEqual("".join(probe.text), value)
        with self.assertRaises(ValueError):
            render_plain_comment("あ"*501)

    def test_audit_12_entities_and_markup_remain_ordinary_text(self):
        value = '&lt;b&gt; &amp; <em>架空</em> "引用" \'単引用\''
        probe = TextProbe()
        probe.feed(render_plain_comment(value))
        self.assertEqual(probe.elements, [("p", [])])
        self.assertEqual("".join(probe.text), value)


if __name__ == "__main__":
    unittest.main()
