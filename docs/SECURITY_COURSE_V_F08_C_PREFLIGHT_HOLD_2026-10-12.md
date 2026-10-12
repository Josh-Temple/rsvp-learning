# Course V F-08 — Worker C independent acceptance preflight (gate HOLD)

**Date:** 2026-10-12 JST  
**Worker:** C, separate assessment of the evidence accessible at the time of this run  
**Conclusion:** `C_HOLD` — **`BLOCKED` before formal exact-head acceptance starts**. This is a gate-failure receipt, **not** the independent full audit requested for a later B-final SHA.  
**Release:** `RELEASE_HOLD` / Course V DRAFT / HOLD. No content acceptance, merge, Catalog registration or deployment is authorized.

## 1. Scope and reproducible identifiers

| Source | Identifier | Observation |
| --- | --- | --- |
| Repository | `Josh-Temple/rsvp-learning` | private |
| Main baseline | `fa63f8f2571203539269a38d501d50d92cafc1d2` | read via GitHub current `main` commit |
| Course V candidate PR | [#136](https://github.com/Josh-Temple/rsvp-learning/pull/136) | open / draft / unmerged |
| Current **A-only** candidate head | `57b0cc89931483115eec654be37e2bafbd2f18e3` | PR #136 current head at initial read and just before creating this receipt |
| A code/CI receipt | [F08_REPAIR_2026-10-12.md](https://github.com/Josh-Temple/rsvp-learning/blob/57b0cc89931483115eec654be37e2bafbd2f18e3/drafts/security-course-v/F08_REPAIR_2026-10-12.md) and [#136 A reconfirmation](https://github.com/Josh-Temple/rsvp-learning/pull/136#issuecomment-6117860596) | `A_TECHNICAL_HANDOFF_CONFIRMED`; explicitly notes **B has not yet finalized teaching material** |
| A candidate CI | [Actions run 38196790680](https://github.com/Josh-Temple/rsvp-learning/actions/runs/38196790680), [job 114641122879](https://github.com/Josh-Temple/rsvp-learning/actions/runs/38196790680/job/114641122879) | completed/success, Node **67 tests / 67 pass / 0 fail**. Python **50 unittest methods** run under one Node test; not 117 separate Node tests |
| Historical C report | [#137](https://github.com/Josh-Temple/rsvp-learning/pull/137) | older SHA, F-01–F-07; historical, not C acceptance of current candidate |
| Historical F-08 C report | [#139](https://github.com/Josh-Temple/rsvp-learning/pull/139) | tested `0cff8396277cbc8f19cae32df6344ea4a138b2cf`; 1,419 comparisons, 1,417 pass / 2 fail, both chapters NEEDS_REVISION **on old SHA only** |

The prerequisite for this Wave's Worker C is: B must finish all MD/RSVP JSON/Learn/quiz/source alignment on #136, commit the new **single full 40-character final candidate SHA**, provide full readback and completed successful **CI tied to that final SHA**, and A/B must stop changing the candidate branch. As of this preflight, GitHub PR #136 still points to **A-only** `57b0cc89931483115eec654be37e2bafbd2f18e3`. The #136 issue conversation contains A's initial and reconfirmed handoffs, not a B final receipt. Therefore **the required target object for C acceptance does not exist yet**. A's Green cannot be reclassified as post-B Green.

## 2. Limited fresh independent read (NOT execution-based acceptance)

Directly fetched at the current A-only 40-digit SHA:

- `drafts/security-course-v/examples/municipal_service.py` — blob `69bbf780df72c5cf50b7de860b290095d26a6e21`.
- `drafts/security-course-v/examples/test_f08_dst_expiry.py` — blob `6b260376c77990ea970215d549c651e36d271017`.
- `drafts/security-course-v/F08_REPAIR_2026-10-12.md` — blob `086f8c3f6b9d291272db5464248b3e7634eb5cac`.
- `drafts/security-course-v/README.md` — blob `f0755739b65ffb929f9d51a8b92d1c44352461f2`.
- `drafts/security-course-v/QUESTIONS.md` — blob `76544aa04c7a4c889cc85da75af1b25cc4bb2ecd`.
- V-1/V-2 lesson Markdown, both Learn HTML files, and `FORMAT_MAP.md` at the same head (limited line-level preflight; **not** full read-and-independent-acceptance of each).

The shared Python diagnostics branch visibly requires enabled support, active vendor, an approved grant, matching valid actor/application identifiers, an allowed diagnostic field, and aware `datetime` values. The time predicate is now:

```python
now.astimezone(timezone.utc) < grant.expires_at.astimezone(timezone.utc)
```

A's checked-in 9-method F-08 test source includes the two New York 2026-11-01 fold inversions, Berlin 2026-10-25, boundary ±1µs/equality, mixed offsets and invalid time inputs. These are **source-inspection observations**; C did **not** independently execute the Python implementation or recreate the 1,419-case oracle on this head. Author tests and CI must not stand in for C execution.

**Identified unfinished B-alignment material (not a new formal defect judgment):** At A-only head, README still describes the deadline as `now < expires_at` and does not explain why common-UTC-instant comparison is required when same `ZoneInfo` datetimes differ by `fold`. V1-Q4 still lists expiry-boundary tests but does not expressly require an **unexpired successful authorization** and the **same instant expressed with differing offsets** in its scoring elements. A's own reconfirmation identifies this unfinished alignment. These observations justify B's next step; they do not adjudicate an as-yet-unavailable B-final artifact.

## 3. Independent acceptance checklist and honest NOT_RUN accounting

| Required task | This preflight |
| --- | --- |
| Bind B's final full SHA; verify CI and A/B freeze; detect drift | **BLOCKED** (B final SHA absent; only A head exists) |
| Independently execute New York two opposite fold examples and verify UTC instants | **NOT_RUN** |
| Evaluate -1µs / equal / +1µs, equivalent offsets, Berlin, UTC relabeling false fix, naive/bad-offset | **NOT_RUN** |
| F-01 missing/empty departments, actor/target, support, grant, SQL and historical 12 conditions | **NOT_RUN** independently |
| Run old 1,419 comparisons on repaired post-B head + create additional independent cases | **NOT_RUN**; old 1,419 belongs only to #139's old SHA |
| Independently run full Python unittest and Node check on **B-final** head | **NOT_RUN** (A-head CI success recorded separately) |
| Full MD↔RSVP JSON per-chunk match, 24 chars, negatives, semantic and English boundaries | **NOT_RUN** on B-final SHA; no new chunk count claimed |
| Independently read both Learn lecture documents fully, review teaching conditions/source boundaries | **NOT_RUN** on B-final SHA |
| Re-evaluate 21 claims, 10 quiz questions (especially V1-Q4), 2/1/0 rubric and source version/sections | **NOT_RUN** on B-final SHA |
| Audio / Android / learner understanding | **UNTESTED / NOT_MEASURED**, outside C's content signature and subject to D/future real-use QA |

**Measured independent comparison cases: 0 performed in this preflight; no pass/fail numbers asserted.** No new P0/P1/P2 severity adjudication is made. The #139 F-08/P1 rejection remains a historical result for its old SHA. The B final SHA, CI and freeze are an unsatisfied *entry requirement*; a per-chapter `ACCEPTED_FOR_MERGE` or `NEEDS_REVISION` conclusion for the nonexistent final target would be misleading.

## 4. Per-chapter and release judgment

| Area | Status | Reason |
| --- | --- | --- |
| V-1 `security-secure-by-design-default` | **BLOCKED** for formal C acceptance | No B-final head/CI, rubric not yet aligned |
| V-2 `security-input-output-injection` | **BLOCKED** for formal C acceptance | Same shared code and single candidate SHA must be judged together; B final unavailable |
| P0/P1 at new target | **NOT_DETERMINED** | Cannot assert zero absent a completed independent audit |
| C overall | **`C_HOLD`** | Start gate unsatisfied; this report is preflight evidence only |
| D/device/audio/SSO | **NOT_ASSESSED** by C | Another sign-off; not inferred from CI |
| Release | **`RELEASE_HOLD`** | C acceptance absent and release requires separate authorization |

## 5. Exact handoff to the next C execution

1. Worker B: commit its final aligned MD/JSON/Learn/Questions/Sources to **#136** after A's `57b0cc…`, record full 40-character head, change paths, counts, readback and successful CI URL for **that SHA**; state A/B edit freeze. Do not silently retain the old C acceptance input.
2. Worker C (independent new execution): fetch the newly specified immutable SHA; independently execute actual candidate code with reproductions and new counterexamples (including the old 1,419 comparison suite when available), evaluate two chapters/formats/21 claims/10 questions and relevant read primary sources. If P0/P1 persists, return `C_HOLD` with specific reproducer rather than modifying #136.
3. Before claiming any acceptance, verify #136 current head still equals C's reviewed full SHA; otherwise repeat against the new head. Keep content acceptance separate from D's private QA and explicit human release approval.

## 6. Mutation boundaries

This C preflight uses a **dedicated report-only branch and Draft PR from main**. No changes to #136, #137, #139 or old audit history. No merge, Course/Catalog/COMPLETE updates, public copy, preview/production deployment, SSO change, secrets or learner data collection. The present receipt cannot be re-labeled as `C_ACCEPTED_EXACT_HEAD` by changing text after B finalizes; C must perform a full *new exact-SHA audit* and save a separate versioned receipt for it.
