"""F-08 regression: diagnose expiry using actual instants, not wall-clock order.

The fictional model accepts aware datetimes including IANA ZoneInfo.  These tests
are author regressions, NOT an independent Worker C acceptance decision.
Run with: python3 -m unittest discover -s drafts/security-course-v/examples -v
ZoneInfo data is REQUIRED; missing tzdata is an environment failure, not a skip.
"""
from dataclasses import replace
from datetime import datetime, timedelta, timezone, tzinfo
from zoneinfo import ZoneInfo
import unittest

from municipal_service import Actor, Application, Settings, SupportGrant, authorize


class ZoneWithoutOffset(tzinfo):
    def utcoffset(self, dt):
        return None


class F08DeadlineTests(unittest.TestCase):
    def setUp(self):
        self.vendor = Actor("vendor-a", "vendor")
        self.target = Application(1, "resident-a", "housing")
        self.settings = Settings(support_enabled=True)
        self.ny = ZoneInfo("America/New_York")
        self.before_clock = datetime(2026, 11, 1, 1, 50, tzinfo=self.ny, fold=0)
        self.after_clock = datetime(2026, 11, 1, 1, 10, tzinfo=self.ny, fold=1)

    def decision(self, now, expiry, **overrides):
        args = dict(settings=self.settings,
                    grant=SupportGrant("vendor-a", 1, expiry, True))
        args.update(overrides)
        return authorize(self.vendor, "diagnostics", self.target,
                         "event_code", now=now, **args)

    def test_f08_red_a_expired_fall_back_denies(self):
        # 06:10Z is AFTER 05:50Z despite an earlier displayed wall time.
        self.assertEqual(self.after_clock.astimezone(timezone.utc).isoformat(),
                         "2026-11-01T06:10:00+00:00")
        self.assertEqual(self.before_clock.astimezone(timezone.utc).isoformat(),
                         "2026-11-01T05:50:00+00:00")
        self.assertFalse(self.decision(self.after_clock, self.before_clock))

    def test_f08_red_b_unexpired_fall_back_allows(self):
        # 05:50Z is BEFORE 06:10Z despite a later displayed wall time.
        self.assertTrue(self.decision(self.before_clock, self.after_clock))

    def test_identical_instants_in_utc_and_mixed_offsets(self):
        pairs = ((self.after_clock, self.before_clock, False),
                 (self.before_clock, self.after_clock, True))
        for now, expiry, expected in pairs:
            for now_view, expiry_view in ((now, expiry),
                    (now.astimezone(timezone.utc), expiry),
                    (now, expiry.astimezone(timezone.utc)),
                    (now.astimezone(timezone.utc), expiry.astimezone(timezone.utc)),
                    (now.astimezone(timezone(timedelta(hours=9))),
                     expiry.astimezone(timezone(timedelta(hours=-12))))):
                with self.subTest(now=now_view, expiry=expiry_view):
                    self.assertIs(self.decision(now_view, expiry_view), expected)

    def test_expiry_minus_equal_plus_one_microsecond(self):
        expiry = datetime(2026, 11, 1, 6, 0, tzinfo=timezone.utc)
        for micro, expected in ((-1, True), (0, False), (1, False)):
            now = expiry + timedelta(microseconds=micro)
            for offset in (-12, 0, 9, 14):
                with self.subTest(micro=micro, offset=offset):
                    view = now.astimezone(timezone(timedelta(hours=offset)))
                    self.assertIs(self.decision(view, expiry), expected)

    def test_new_york_fold_combinations_all_follow_utc(self):
        for fold_now in (0, 1):
            for fold_expiry in (0, 1):
                for minute_now in (10, 50):
                    for minute_expiry in (10, 50):
                        now = datetime(2026, 11, 1, 1, minute_now,
                                       tzinfo=self.ny, fold=fold_now)
                        expiry = datetime(2026, 11, 1, 1, minute_expiry,
                                          tzinfo=self.ny, fold=fold_expiry)
                        expected = now.astimezone(timezone.utc) < expiry.astimezone(timezone.utc)
                        with self.subTest(nf=fold_now, ef=fold_expiry,
                                          nm=minute_now, em=minute_expiry):
                            self.assertIs(self.decision(now, expiry), expected)

    def test_berlin_fall_back_handles_both_directions(self):
        berlin = ZoneInfo("Europe/Berlin")
        early = datetime(2026, 10, 25, 2, 50, tzinfo=berlin, fold=0)
        late = datetime(2026, 10, 25, 2, 10, tzinfo=berlin, fold=1)
        self.assertEqual(early.astimezone(timezone.utc).isoformat(),
                         "2026-10-25T00:50:00+00:00")
        self.assertEqual(late.astimezone(timezone.utc).isoformat(),
                         "2026-10-25T01:10:00+00:00")
        self.assertFalse(self.decision(late, early))
        self.assertTrue(self.decision(early, late))

    def test_same_instant_is_expired_regardless_of_display(self):
        expiry = self.after_clock
        for view in (expiry, expiry.astimezone(timezone.utc),
                     expiry.astimezone(timezone(timedelta(hours=14)))):
            with self.subTest(view=view):
                self.assertFalse(self.decision(view, expiry))

    def test_naive_or_undefined_offset_denies(self):
        good = self.after_clock
        for invalid in (good.replace(tzinfo=None), good.replace(tzinfo=ZoneWithoutOffset()),
                        None, "2026-11-01"):
            with self.subTest(invalid=invalid):
                self.assertFalse(self.decision(invalid, good))
                self.assertFalse(self.decision(good, invalid))

    def test_existing_permission_predicates_remain_enforced(self):
        now, expiry = self.before_clock, self.after_clock  # A valid authorization.
        self.assertTrue(self.decision(now, expiry))
        grant = SupportGrant("vendor-a", 1, expiry, True)
        for override in ({"settings": Settings(support_enabled=False)},
                         {"grant": replace(grant, approved=False)},
                         {"grant": replace(grant, actor_id="vendor-b")},
                         {"grant": replace(grant, application_id=2)}):
            with self.subTest(override=override):
                self.assertFalse(self.decision(now, expiry, **override))
        self.assertFalse(authorize(self.vendor, "diagnostics", self.target,
            "comment", now=now, settings=self.settings, grant=grant))
        self.assertFalse(authorize(replace(self.vendor, active=False),
            "diagnostics", self.target, "event_code", now=now,
            settings=self.settings, grant=grant))


if __name__ == "__main__":
    unittest.main()
