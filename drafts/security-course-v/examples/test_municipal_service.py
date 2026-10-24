"""Run with python3 -m unittest discover -s drafts/security-course-v/examples -v."""

from dataclasses import replace
from datetime import datetime, timedelta, timezone
from html.parser import HTMLParser
import unittest

from municipal_service import (Actor, Application, Settings, SupportGrant, authorize,
                               fictional_database, render_plain_comment,
                               search_applications)


class TextProbe(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.elements = []
        self.text = []

    def handle_starttag(self, tag, attrs):
        self.elements.append((tag, attrs))

    def handle_data(self, data):
        self.text.append(data)


class AuthorizationTests(unittest.TestCase):
    def setUp(self):
        self.resident = Actor("resident-a", "resident")
        self.officer = Actor("officer-a", "officer", "housing")
        self.application = Application(1, "resident-a", "housing")

    def test_own_and_other_application_read_are_distinct(self):
        self.assertTrue(authorize(self.resident, "read", self.application, "comment"))
        other = replace(self.application, owner_id="resident-b")
        self.assertFalse(authorize(self.resident, "read", other, "comment"))

    def test_edit_depends_on_state_and_field(self):
        self.assertTrue(authorize(self.resident, "edit", self.application, "comment"))
        self.assertFalse(authorize(self.resident, "edit", replace(self.application, state="submitted"), "comment"))
        self.assertFalse(authorize(self.resident, "edit", self.application, "internal_note"))
        self.assertFalse(authorize(self.resident, "read", self.application, "internal_note"))

    def test_current_department_and_review_state(self):
        self.assertTrue(authorize(self.officer, "read", self.application, "comment"))
        transferred = replace(self.officer, department="welfare")
        self.assertFalse(authorize(transferred, "read", self.application, "comment"))
        self.assertTrue(authorize(self.officer, "review", replace(self.application, state="submitted"), "decision"))
        self.assertFalse(authorize(self.officer, "review", self.application, "decision"))

    def test_missing_departments_do_not_authorize_read(self):
        # F-01: independent C counterexample at edc1837, True before repair.
        officer = Actor("officer-c", "officer")
        application = Application(5, "resident-c", None)
        self.assertFalse(authorize(officer, "read", application, "comment"))

    def test_empty_departments_do_not_authorize_review(self):
        # F-01: empty strings are str, but they identify no valid department.
        officer = Actor("officer-c", "officer", "")
        application = Application(5, "resident-c", "", "submitted")
        self.assertFalse(authorize(officer, "review", application, "decision"))

    def test_config_admin_is_not_application_reader(self):
        admin = Actor("admin-a", "admin")
        self.assertTrue(authorize(admin, "configure"))
        self.assertFalse(authorize(admin, "read", self.application, "comment"))
        self.assertFalse(authorize(self.officer, "configure"))

    def test_missing_attributes_and_unknown_protected_operation_deny(self):
        self.assertFalse(authorize(self.resident, "read", self.application, "comment", attributes_available=False))
        self.assertFalse(authorize(self.resident, "bulk_export", self.application, "comment"))
        self.assertFalse(authorize(None, "read", self.application, "comment"))
        self.assertFalse(authorize(replace(self.resident, active=False), "read", self.application, "comment"))

    def test_public_notice_is_an_explicit_separate_rule(self):
        self.assertTrue(authorize(None, "public_notice", attributes_available=False))
        self.assertFalse(authorize(None, "public_notice", self.application, "comment"))

    def test_default_settings_do_not_enable_support_or_public_storage(self):
        defaults = Settings()
        self.assertFalse(defaults.public_application_storage)
        self.assertFalse(defaults.support_enabled)
        self.assertTrue(defaults.audit_enabled)
        self.assertIsNone(defaults.shared_admin_password)

    def test_support_grant_scope_expiry_and_raw_data(self):
        vendor = Actor("vendor-a", "vendor")
        expiry = datetime(2026, 10, 11, 9, tzinfo=timezone.utc)
        grant = SupportGrant(vendor.actor_id, 1, expiry, True)
        options = dict(settings=Settings(support_enabled=True), grant=grant, now=expiry-timedelta(seconds=1))
        self.assertTrue(authorize(vendor, "diagnostics", self.application, "event_code", **options))
        for changed in ({"now": expiry}, {"now": expiry+timedelta(seconds=1)},
                        {"grant": replace(grant, approved=False)},
                        {"grant": replace(grant, application_id=2)},
                        {"settings": Settings()}):
            with self.subTest(changed=changed):
                self.assertFalse(authorize(vendor, "diagnostics", self.application, "event_code", **(options | changed)))
        self.assertFalse(authorize(vendor, "diagnostics", self.application, "comment", **options))
        self.assertFalse(authorize(vendor, "read", self.application, "comment", **options))


class DataBoundaryTests(unittest.TestCase):
    def setUp(self):
        self.connection = fictional_database()
        self.addCleanup(self.connection.close)
        self.resident = Actor("resident-a", "resident")
        self.officer = Actor("officer-a", "officer", "housing")

    def test_legitimate_quote_is_preserved_and_searchable(self):
        rows = search_applications(self.connection, self.resident, "O'Neil")
        self.assertEqual([(row[0], row[1]) for row in rows], [(1, "O'Neil")])

    def test_command_looking_string_is_one_literal_value(self):
        rows = search_applications(self.connection, self.resident, "引用符' OR '1'='1")
        self.assertEqual([row[0] for row in rows], [4])
        self.assertEqual(search_applications(self.connection, self.resident, "' OR 1=1 --"), [])
        self.assertEqual(self.connection.execute("SELECT COUNT(*) FROM applications").fetchone()[0], 4)

    def test_sort_is_a_fixed_choice_and_unknown_choice_denies(self):
        self.assertEqual([r[0] for r in search_applications(self.connection, self.officer, "", sort="received")], [2, 1, 4])
        self.assertEqual([r[0] for r in search_applications(self.connection, self.officer, "", sort="updated")], [4, 2, 1])
        with self.assertRaises(ValueError):
            search_applications(self.connection, self.officer, "", sort="name DESC")

    def test_bound_order_value_is_not_a_column_identifier(self):
        # Harmless SQLite counterexample: ? here orders by a constant string.
        bound = self.connection.execute("SELECT id FROM applications ORDER BY ?", ("received_at",)).fetchall()
        column = self.connection.execute("SELECT id FROM applications ORDER BY received_at ASC").fetchall()
        self.assertNotEqual(bound, column)
        self.assertEqual(column, [(2,), (3,), (1,), (4,)])

    def test_like_pattern_and_literal_have_different_expected_results(self):
        wildcard = search_applications(self.connection, self.resident, "%", literal=False)
        literal = search_applications(self.connection, self.resident, "%", literal=True)
        self.assertEqual([r[0] for r in wildcard], [2, 1, 4])
        self.assertEqual([r[0] for r in literal], [2])
        self.assertEqual(search_applications(self.connection, self.resident, "_", literal=True), [])

    def test_parameterization_does_not_supply_authorization(self):
        # A valid bound query can select another resident's fictional row.
        raw_row = self.connection.execute("SELECT id FROM applications WHERE id = ?", (3,)).fetchone()
        self.assertEqual(raw_row, (3,))
        self.assertFalse(authorize(self.resident, "read", Application(3, "resident-b", "welfare"), "comment"))
        self.assertEqual(search_applications(self.connection, self.resident, "別の住民"), [])
        self.assertEqual(search_applications(self.connection, self.officer, "別の住民"), [])
        self.assertEqual([r[0] for r in search_applications(self.connection, replace(self.officer, department="welfare"), "別の住民")], [3])
        self.assertEqual(search_applications(self.connection, replace(self.officer, department="welfare"), "O'Neil"), [])

    def test_invalid_shape_and_missing_trusted_attributes_reject(self):
        for value in (None, 12, "x" * 81):
            with self.subTest(value=value), self.assertRaises(ValueError):
                search_applications(self.connection, self.resident, value)
        with self.assertRaises(PermissionError):
            search_applications(self.connection, self.resident, "", attributes_available=False)
        with self.assertRaises(PermissionError):
            search_applications(self.connection, Actor("admin-a", "admin"), "")

    def test_ordinary_html_text_preserves_data_without_extra_elements(self):
        value = '<em data-note="架空">文章 & 引用符\'</em>'
        probe = TextProbe()
        probe.feed(render_plain_comment(value))
        self.assertEqual(probe.elements, [("p", [])])
        self.assertEqual("".join(probe.text), value)

    def test_markup_looking_text_is_inert_in_this_body_parser(self):
        value = '<script>教育用の文字</script><style>架空の文字</style>'
        probe = TextProbe()
        probe.feed(render_plain_comment(value))
        self.assertEqual(probe.elements, [("p", [])])
        self.assertEqual("".join(probe.text), value)
        # No JavaScript engine or browser execution: only ordinary HTML body parsing.


if __name__ == "__main__":
    unittest.main()
