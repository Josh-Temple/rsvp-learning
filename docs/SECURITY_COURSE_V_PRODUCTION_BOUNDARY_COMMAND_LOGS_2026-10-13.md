# Course V本番境界検証 — 実行コマンド・出力

ローカル隔離統合treeを対象とした新しい実測。Node 24.19.0 / Python 3.12.14。CIのNode 22とは別環境。

## npm run check

```json
{
  "command": [
    "npm",
    "run",
    "check"
  ],
  "cwd": "/workspace/scratch/37b8f142d34c/integration",
  "exit_code": 0,
  "duration_seconds": 2.838,
  "stdout_sha256": "87fa65913129315cf8a78d8053a522b1b25bc28ece6534567a5880afe05b5855",
  "stderr_sha256": "3e4dc9098e93243cae453c2a209caf47f6de19808fffe9b896c85598d97964f6"
}
```

### stdout

```text

> check
> npm run test && npm run validate


> test
> node --test tests/*.test.mjs

✔ newer course selection wins when chapter responses finish out of order (14.668263ms)
✔ failure from a stale request does not replace the current lesson with an error (4.480708ms)
Error: 教材一覧の取得に失敗しました: 500
    at loadCatalogs (app.js:696:11)
✔ a failed current course load leaves the previous course selection intact (5.788097ms)
✔ opening the library pauses playback and clears the scheduled timer (3.773319ms)
Error: コースがありません。
    at loadCatalogs (app.js:727:22)
✔ opening the library invalidates an in-flight autoplay chapter load (8.538757ms)
Error: コースがありません。
    at loadCatalogs (app.js:727:22)
✔ Learn link stays available and follows the selected lesson when possible (4.329517ms)
✔ lesson catalog requires and accepts current synchronized statuses (2.937006ms)
✔ complete requires a Learn path and unfinished states cannot declare one (0.232966ms)
✔ validator accepts a structurally valid fixture (271.844674ms)
✔ validator rejects duplicate lesson IDs (215.32548ms)
✔ validator rejects a course reference to an unregistered lesson (204.334653ms)
✔ validator rejects schema-invalid lesson data (223.506866ms)
✔ all COMPLETE catalog entries have static Learn HTML independent of RSVP chunk concatenation (194.233175ms)
✔ pilot coverage gates fail closed when essential explanations are absent (0.499493ms)
✔ review gates can require claim and limitation in the same paragraph (0.272097ms)
✔ expanded Learn coverage includes cases, limitations and verification gates (0.280564ms)
✔ shared Learn player exposes Web Speech API and preserves paused voice-change resume (1.658428ms)
✔ Learn library exposes course-level continuous playback without replacing single-chapter links (2.835041ms)
✔ authenticated mail heading does not imply authentication proves safety (1.022742ms)
✔ continuous Learn course shows current chapter sources outside the speech track (5.897567ms)
✔ four new security Learn lectures retain A-head cases, limits, and separate source sections (1.882641ms)
✔ P1-IP-01 Learn: three proofing steps, limitations, and regression counterexamples (2.834748ms)
✔ critical identity, federation and cloud conditions remain in their Learn lectures (2.3732ms)
✔ voice list refresh preserves a selected Japanese voice (11.510235ms)
✔ player reads DOM order and pause voice change resumes the same element with the new voice (5.888032ms)
✔ registered Listen pages satisfy the minimum read-aloud contract (44.714195ms)
✔ shared library exposes RSVP, Learn, and Listen modes (4.94267ms)
✔ rejects split Latin terms even when both chunks are under 24 characters (1.456428ms)
✔ accepts intact terminology and complete sentence boundaries (0.272582ms)
✔ possible Japanese particle splits are review findings, not automatic errors (0.796776ms)
✔ invalid chunks do not crash the boundary check (0.152353ms)
✔ security-deep catalog lessons contain no adjacent Latin-letter boundaries (31.560546ms)
✔ content validator rejects broken Latin words in new security-deep lessons (200.910369ms)
✔ compound particles and dangling predicates are review findings, not universal errors (0.80648ms)
✔ all 30 security-deep lessons have no undocumented Japanese boundary review findings (10.830116ms)
✔ 2026-10-09 A: four revised security lessons retain complete chunks and scenarios (1.930423ms)
✔ 2026-10-09 A: original claims are corrected and Markdown/RSVP stays aligned (8.805187ms)
✔ P1-IP-01: identity resolution, evidence validation, applicant verification and limits stay aligned (2.513307ms)
✔ security-secure-by-design-default: schema, exact text, sources, 24-character terms, mapped limitations and HOLD (10.783211ms)
✔ security-input-output-injection: schema, exact text, sources, 24-character terms, mapped limitations and HOLD (2.38331ms)
✔ primary source record distinguishes inaccessible CISA, SSDF draft and stable ASVS (0.934191ms)
✔ RSVP and human format map regenerate without changing reviewed artifacts (148.116569ms)
✔ candidate HTML uses balanced static DOM and resolves existing player/navigation assets (37.983051ms)
✔ unbalanced HTML mutation fails standard HTML parser inspection (50.109041ms)
✔ source section moved into speech article is rejected (3.799583ms)
✔ RSVP concatenation disguised as a lecture is rejected (2.412503ms)
✔ COMPLETE promotion and Catalog/Course registration fail the candidate-only gate (2.60334ms)
✔ a punctuation or negation change in JSON alone fails full text synchronization (2.874514ms)
✔ an English term split fails even when Markdown and JSON still concatenate identically (1.561671ms)
✔ the 24-character cap cannot be bypassed by changing both canonical forms (1.569627ms)
✔ design/default relation reversal fails despite synchronized text and surviving keywords (1.917552ms)
✔ public-resource exception negation cannot disappear from either canonical or Learn text (2.881135ms)
✔ removing the distributed-revocation limitation is detected in Learn (0.954574ms)
✔ textContent safety inversion for script/style is caught in both forms (2.100181ms)
✔ autoescape-as-SSTI-prevention inversion fails despite retained technical terms (2.2161ms)
✔ a parameterization claim must retain the correct driver API condition (2.584293ms)
✔ injection/authorization independence cannot be replaced with a universal safety claim (1.555828ms)
✔ the field-dependent normalization limitation is preserved (1.03025ms)
✔ ten judgement questions include two elements, 2/1/0 rubrics and condition changes (15.845635ms)
✔ safe local executable examples check authorization, SQLite values and ordinary HTML text (85.044446ms)
✔ F-01: missing-department denial and legitimate ownership stay explicit in three formats (3.429209ms)
✔ F-02: SQL concatenation before prepare is rejected by the regression anchors (3.045359ms)
✔ F-03: the OS argument condition retains its natural boundary and limitation (1.934527ms)
✔ F-04: attribute source encoding and direct DOM values remain separate (2.117638ms)
✔ F-04: V2-Q3 explicitly accepts the safe DOM alternative at full credit (2.123252ms)
✔ F-06: CSP introduction retains the sanitizer limitation (2.102493ms)
✔ F-07: production-review metadata stays outside speech, technical limitations remain inside (0.238747ms)
✔ F-08: synchronized teaching and V1-Q4 rubric retain positive and negative deadline cases (1.774902ms)
ℹ tests 68
ℹ suites 0
ℹ pass 68
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 1066.050152

> validate
> node scripts/validate-content.mjs && node scripts/validate-status-sync.mjs && python3 scripts/validate-learn-html.py

Lessons: 158
Courses: 24
Listen items: 28
Chunks: 8518
Lessons without sources: 50
Chunks over 24 chars (warning): 0

Content validation: PASS
Status/catalog validation: PASS (COMPLETE 141, DRAFT 0, SEED 17)
Learn HTML validation: PASS (141 pages; static DOM and balanced tags)
```

### stderr

```text
npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm.
npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm.
npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm.

Warnings:
- 出典なし: requirements-basics
- 出典なし: system-development-overview
- 出典なし: database-sql-overview
- 出典なし: web-api-overview
- 出典なし: information-security-overview
- 出典なし: cloud-overview
- 出典なし: project-management-overview
- 出典なし: business-analysis-overview
- 出典なし: generative-ai-overview
- 出典なし: ai-evaluation-operations-overview
- 出典なし: software-architecture-overview
- 出典なし: git-cicd-overview
- 出典なし: statistics-data-analysis-overview
- 出典なし: ai-governance-overview
- 出典なし: network-os-infra-overview
- 出典なし: it-consulting-overview
- 出典なし: public-dx-govtech-overview
- 出典なし: healthcare-care-dx-overview
- 出典なし: rsvp-basics
- 出典なし: requirements-as-is-to-be
- 出典なし: requirements-business-system
- 出典なし: requirements-stakeholders-scope
- 出典なし: requirements-validation-traceability
- 出典なし: system-development-lifecycle
- 出典なし: system-development-design
- 出典なし: cloud-compute-serverless-containers
- 出典なし: pm-initiation-scope-wbs
- 出典なし: pm-schedule-dependencies
- 出典なし: pm-issues-risks
- 出典なし: pm-change-quality
- 出典なし: pm-stakeholders-governance-pmo
- 出典なし: business-analysis-problem-value
- 出典なし: business-analysis-process-mapping
- 出典なし: business-analysis-bottlenecks-waste
- 出典なし: business-analysis-standardization-exceptions
- 出典なし: business-analysis-kpi-automation-change
- 出典なし: genai-llm-context
- 出典なし: ai-eval-goals-datasets
- 出典なし: ai-eval-metrics-error-analysis
- 出典なし: architecture-modules-interfaces
- 出典なし: architecture-coupling-cohesion-dependencies
- 出典なし: architecture-state-source-of-truth
- 出典なし: architecture-sync-async-events-queues
- 出典なし: integrated-case-problem-framing
- 出典なし: integrated-case-requirements-scope
- 出典なし: integrated-case-data-api-architecture
- 出典なし: integrated-case-security-cloud
- 出典なし: integrated-case-ai-governance
- 出典なし: integrated-case-delivery-change
- 出典なし: integrated-case-outcomes-operations
```

## python3 -m unittest discover -s drafts/security-course-v/examples -p 'test_*.py' -v

```json
{
  "command": [
    "python3",
    "-m",
    "unittest",
    "discover",
    "-s",
    "drafts/security-course-v/examples",
    "-p",
    "test_*.py",
    "-v"
  ],
  "cwd": "/workspace/scratch/37b8f142d34c/integration",
  "exit_code": 0,
  "duration_seconds": 0.094,
  "stdout_sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "stderr_sha256": "d124850acabe33f77441fdb6627226b9339b5266c058f33cefce87128ccf4cfd"
}
```

### stdout

```text

```

### stderr

```text
test_audit_01_missing_departments_deny (test_audit_conditions.AuditConditions.test_audit_01_missing_departments_deny) ... ok
test_audit_02_empty_departments_deny (test_audit_conditions.AuditConditions.test_audit_02_empty_departments_deny) ... ok
test_audit_03_same_and_other_valid_department (test_audit_conditions.AuditConditions.test_audit_03_same_and_other_valid_department) ... ok
test_audit_04_unavailable_attributes_deny (test_audit_conditions.AuditConditions.test_audit_04_unavailable_attributes_deny) ... ok
test_audit_05_public_notice_survives_attribute_failure (test_audit_conditions.AuditConditions.test_audit_05_public_notice_survives_attribute_failure) ... ok
test_audit_06_unknown_operation_and_field_deny (test_audit_conditions.AuditConditions.test_audit_06_unknown_operation_and_field_deny) ... ok
test_audit_07_expiry_microsecond_and_timezone (test_audit_conditions.AuditConditions.test_audit_07_expiry_microsecond_and_timezone) ... ok
test_audit_08_naive_time_and_other_grantee_deny (test_audit_conditions.AuditConditions.test_audit_08_naive_time_and_other_grantee_deny) ... ok
test_audit_09_like_metacharacters_are_literal (test_audit_conditions.AuditConditions.test_audit_09_like_metacharacters_are_literal) ... ok
test_audit_10_wildcard_keeps_scope_and_missing_officer_denies (test_audit_conditions.AuditConditions.test_audit_10_wildcard_keeps_scope_and_missing_officer_denies) ... ok
test_audit_11_unicode_length_boundaries (test_audit_conditions.AuditConditions.test_audit_11_unicode_length_boundaries) ... ok
test_audit_12_entities_and_markup_remain_ordinary_text (test_audit_conditions.AuditConditions.test_audit_12_entities_and_markup_remain_ordinary_text) ... ok
test_berlin_fall_back_handles_both_directions (test_f08_dst_expiry.F08DeadlineTests.test_berlin_fall_back_handles_both_directions) ... ok
test_existing_permission_predicates_remain_enforced (test_f08_dst_expiry.F08DeadlineTests.test_existing_permission_predicates_remain_enforced) ... ok
test_expiry_minus_equal_plus_one_microsecond (test_f08_dst_expiry.F08DeadlineTests.test_expiry_minus_equal_plus_one_microsecond) ... ok
test_f08_red_a_expired_fall_back_denies (test_f08_dst_expiry.F08DeadlineTests.test_f08_red_a_expired_fall_back_denies) ... ok
test_f08_red_b_unexpired_fall_back_allows (test_f08_dst_expiry.F08DeadlineTests.test_f08_red_b_unexpired_fall_back_allows) ... ok
test_identical_instants_in_utc_and_mixed_offsets (test_f08_dst_expiry.F08DeadlineTests.test_identical_instants_in_utc_and_mixed_offsets) ... ok
test_naive_or_undefined_offset_denies (test_f08_dst_expiry.F08DeadlineTests.test_naive_or_undefined_offset_denies) ... ok
test_new_york_fold_combinations_all_follow_utc (test_f08_dst_expiry.F08DeadlineTests.test_new_york_fold_combinations_all_follow_utc) ... ok
test_same_instant_is_expired_regardless_of_display (test_f08_dst_expiry.F08DeadlineTests.test_same_instant_is_expired_regardless_of_display) ... ok
test_availability_and_active_flags_require_true (test_input_contract.InputContractTests.test_availability_and_active_flags_require_true) ... ok
test_department_matrix_for_read_and_review (test_input_contract.InputContractTests.test_department_matrix_for_read_and_review) ... ok
test_invalid_officer_search_scope_denies_before_sql (test_input_contract.InputContractTests.test_invalid_officer_search_scope_denies_before_sql) ... ok
test_malformed_protected_record_operation_and_field_deny (test_input_contract.InputContractTests.test_malformed_protected_record_operation_and_field_deny) ... ok
test_missing_and_wrong_type_identity_cannot_match (test_input_contract.InputContractTests.test_missing_and_wrong_type_identity_cannot_match) ... ok
test_missing_department_does_not_block_other_legitimate_roles (test_input_contract.InputContractTests.test_missing_department_does_not_block_other_legitimate_roles) ... ok
test_search_option_shapes_reject_ambiguous_values (test_input_contract.InputContractTests.test_search_option_shapes_reject_ambiguous_values) ... ok
test_support_flags_and_target_id_are_not_coerced (test_input_contract.InputContractTests.test_support_flags_and_target_id_are_not_coerced) ... ok
test_support_time_input_requires_aware_datetime (test_input_contract.InputContractTests.test_support_time_input_requires_aware_datetime) ... ok
test_valid_search_scope_excludes_invalid_department_rows (test_input_contract.InputContractTests.test_valid_search_scope_excludes_invalid_department_rows) ... ok
test_config_admin_is_not_application_reader (test_municipal_service.AuthorizationTests.test_config_admin_is_not_application_reader) ... ok
test_current_department_and_review_state (test_municipal_service.AuthorizationTests.test_current_department_and_review_state) ... ok
test_default_settings_do_not_enable_support_or_public_storage (test_municipal_service.AuthorizationTests.test_default_settings_do_not_enable_support_or_public_storage) ... ok
test_edit_depends_on_state_and_field (test_municipal_service.AuthorizationTests.test_edit_depends_on_state_and_field) ... ok
test_empty_departments_do_not_authorize_review (test_municipal_service.AuthorizationTests.test_empty_departments_do_not_authorize_review) ... ok
test_missing_attributes_and_unknown_protected_operation_deny (test_municipal_service.AuthorizationTests.test_missing_attributes_and_unknown_protected_operation_deny) ... ok
test_missing_departments_do_not_authorize_read (test_municipal_service.AuthorizationTests.test_missing_departments_do_not_authorize_read) ... ok
test_own_and_other_application_read_are_distinct (test_municipal_service.AuthorizationTests.test_own_and_other_application_read_are_distinct) ... ok
test_public_notice_is_an_explicit_separate_rule (test_municipal_service.AuthorizationTests.test_public_notice_is_an_explicit_separate_rule) ... ok
test_support_grant_scope_expiry_and_raw_data (test_municipal_service.AuthorizationTests.test_support_grant_scope_expiry_and_raw_data) ... ok
test_bound_order_value_is_not_a_column_identifier (test_municipal_service.DataBoundaryTests.test_bound_order_value_is_not_a_column_identifier) ... ok
test_command_looking_string_is_one_literal_value (test_municipal_service.DataBoundaryTests.test_command_looking_string_is_one_literal_value) ... ok
test_invalid_shape_and_missing_trusted_attributes_reject (test_municipal_service.DataBoundaryTests.test_invalid_shape_and_missing_trusted_attributes_reject) ... ok
test_legitimate_quote_is_preserved_and_searchable (test_municipal_service.DataBoundaryTests.test_legitimate_quote_is_preserved_and_searchable) ... ok
test_like_pattern_and_literal_have_different_expected_results (test_municipal_service.DataBoundaryTests.test_like_pattern_and_literal_have_different_expected_results) ... ok
test_markup_looking_text_is_inert_in_this_body_parser (test_municipal_service.DataBoundaryTests.test_markup_looking_text_is_inert_in_this_body_parser) ... ok
test_ordinary_html_text_preserves_data_without_extra_elements (test_municipal_service.DataBoundaryTests.test_ordinary_html_text_preserves_data_without_extra_elements) ... ok
test_parameterization_does_not_supply_authorization (test_municipal_service.DataBoundaryTests.test_parameterization_does_not_supply_authorization) ... ok
test_sort_is_a_fixed_choice_and_unknown_choice_denies (test_municipal_service.DataBoundaryTests.test_sort_is_a_fixed_choice_and_unknown_choice_denies) ... ok

----------------------------------------------------------------------
Ran 50 tests in 0.017s

OK
```

