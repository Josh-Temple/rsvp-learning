# 教材の内容拡充 — 2026-09-28

基点: main `8286763964b39b51b6e2462c737ab63308976727`。この記録はPR #32での教材拡充結果を示します。

## 現状と狙い

`COMPLETE v0.1` の60章は構造上の完成条件を満たしますが、本文は各14項目で約316〜446字です。定義と注意の列挙が中心で、例を使った因果関係や判断の説明は十分ではありません。Learnも原稿の知識範囲を保っているため、元の原稿が薄い章は同じ問題が残ります。

長さだけを合格条件にしません。各章の学習目標に合わせ、具体的な一件を追い、用語が何を区別するか、判断を誤る境界、前提と限界を説明します。数値や現在性が重要な主張は一次資料と照合します。元の出典だけで支えられない新しい主張を推測で補いません。

原稿本文、RSVP JSONのチャンク列、Learn HTMLを章ごとに同期し、具体例を加えました。

## 最初の着手範囲

- 代表値・ばらつき・分布: 五件の処理時間で平均と中央値の差を計算し、ばらつきと欠損を扱う。NIST資料を出典に追加。
- 正規化の基本: 注文・顧客・商品を使い、更新時の矛盾と第一〜第三正規形を追う。当時の配送先と現在住所を区別。
- 認証と認可: 申請APIで本人確認、対象ごとの権限確認、OAuthとAPIキーの違いを示す。

いずれも `COMPLETE v0.1` のstatusは維持します。この記録の「拡充済」は正式statusではなく、この作業における編集進捗です。Android実機での読みやすさは未確認です。

## 継続した作業

- 母集団・標本・バイアス: 市民アンケートで回答者の偏りと一般化の限界を示す。AAPORとStatistics Canadaを出典に追加。
- 推定と信頼区間: 処理時間の区間を仮例として用い、反復抽出での意味と個々の値の区間との違いを示す。
- 仮説検定・p値・効果量: 受付方法の比較でp値と実務上の差を分ける。ASAの重複出典を一つに整理。
- 相関・回帰・因果関係: 気温、飲料売上、熱中症搬送の例で第三の要因と予測・因果の区別を示す。

統計コースの5章を含め、全60章を拡充済みです。

## 章ごとの拡充結果

| 分野 | lesson id | 進捗 | 補う具体例・判断 |
|---|---|---|---|
| ai-evaluation-operations | ai-eval-goals-datasets | 拡充済 | 原稿・JSON・Learnを同期 |
| ai-evaluation-operations | ai-eval-human-judge | 拡充済 | 原稿・JSON・Learnを同期 |
| ai-evaluation-operations | ai-eval-metrics-error-analysis | 拡充済 | 原稿・JSON・Learnを同期 |
| ai-evaluation-operations | ai-ops-monitoring-drift-incidents | 拡充済 | 原稿・JSON・Learnを同期 |
| ai-evaluation-operations | ai-ops-versioning-experiments-rollback | 拡充済 | 原稿・JSON・Learnを同期 |
| business-analysis | business-analysis-bottlenecks-waste | 拡充済 | 原稿・JSON・Learnを同期 |
| business-analysis | business-analysis-kpi-automation-change | 拡充済 | 原稿・JSON・Learnを同期 |
| business-analysis | business-analysis-problem-value | 拡充済 | 原稿・JSON・Learnを同期 |
| business-analysis | business-analysis-process-mapping | 拡充済 | 原稿・JSON・Learnを同期 |
| business-analysis | business-analysis-standardization-exceptions | 拡充済 | 原稿・JSON・Learnを同期 |
| cloud | cloud-compute-serverless-containers | 拡充済 | 原稿・JSON・Learnを同期 |
| cloud | cloud-data-availability-observability | 拡充済 | 原稿・JSON・Learnを同期 |
| cloud | cloud-iam | 拡充済 | 原稿・JSON・Learnを同期 |
| cloud | cloud-networking | 拡充済 | 原稿・JSON・Learnを同期 |
| cloud | cloud-service-models-responsibility | 拡充済 | 原稿・JSON・Learnを同期 |
| database-sql | database-normalization | 拡充済 | 原稿・JSON・Learnを同期 |
| database-sql | database-relational-model | 拡充済 | 原稿・JSON・Learnを同期 |
| database-sql | database-transaction-index | 拡充済 | 原稿・JSON・Learnを同期 |
| database-sql | sql-join-aggregation | 拡充済 | 原稿・JSON・Learnを同期 |
| database-sql | sql-select-filter | 拡充済 | 原稿・JSON・Learnを同期 |
| generative-ai | genai-cost-latency-security | 拡充済 | 原稿・JSON・Learnを同期 |
| generative-ai | genai-llm-context | 拡充済 | 原稿・JSON・Learnを同期 |
| generative-ai | genai-rag | 拡充済 | 原稿・JSON・Learnを同期 |
| generative-ai | genai-structured-workflows-hitl | 拡充済 | 原稿・JSON・Learnを同期 |
| generative-ai | genai-tools-agents | 拡充済 | 原稿・JSON・Learnを同期 |
| git-cicd | cicd-ci-tests-automation | 拡充済 | 原稿・JSON・Learnを同期 |
| git-cicd | cicd-deployment-environments-rollback | 拡充済 | 原稿・JSON・Learnを同期 |
| git-cicd | git-branches-merges | 拡充済 | 原稿・JSON・Learnを同期 |
| git-cicd | git-commits-history | 拡充済 | 原稿・JSON・Learnを同期 |
| git-cicd | github-pr-review-issues | 拡充済 | 原稿・JSON・Learnを同期 |
| project-management | pm-change-quality | 拡充済 | 原稿・JSON・Learnを同期 |
| project-management | pm-initiation-scope-wbs | 拡充済 | 原稿・JSON・Learnを同期 |
| project-management | pm-issues-risks | 拡充済 | 原稿・JSON・Learnを同期 |
| project-management | pm-schedule-dependencies | 拡充済 | 原稿・JSON・Learnを同期 |
| project-management | pm-stakeholders-governance-pmo | 拡充済 | 原稿・JSON・Learnを同期 |
| requirements | requirements-as-is-to-be | 拡充済 | 原稿・JSON・Learnを同期 |
| requirements | requirements-business-system | 拡充済 | 原稿・JSON・Learnを同期 |
| requirements | requirements-functional-nonfunctional | 拡充済 | 原稿・JSON・Learnを同期 |
| requirements | requirements-stakeholders-scope | 拡充済 | 原稿・JSON・Learnを同期 |
| requirements | requirements-validation-traceability | 拡充済 | 原稿・JSON・Learnを同期 |
| software-architecture | architecture-coupling-cohesion-dependencies | 拡充済 | 原稿・JSON・Learnを同期 |
| software-architecture | architecture-idempotency-retry-failures | 拡充済 | 原稿・JSON・Learnを同期 |
| software-architecture | architecture-modules-interfaces | 拡充済 | 原稿・JSON・Learnを同期 |
| software-architecture | architecture-state-source-of-truth | 拡充済 | 原稿・JSON・Learnを同期 |
| software-architecture | architecture-sync-async-events-queues | 拡充済 | 原稿・JSON・Learnを同期 |
| statistics-data-analysis | statistics-correlation-regression-causality | 拡充済 | 原稿・JSON・Learnを同期 |
| statistics-data-analysis | statistics-descriptive-distributions | 拡充済 | 原稿・JSON・Learnを同期 |
| statistics-data-analysis | statistics-estimation-confidence-intervals | 拡充済 | 原稿・JSON・Learnを同期 |
| statistics-data-analysis | statistics-hypothesis-testing-effect-size | 拡充済 | 原稿・JSON・Learnを同期 |
| statistics-data-analysis | statistics-population-sample-bias | 拡充済 | 原稿・JSON・Learnを同期 |
| system-development | system-development-design | 拡充済 | 原稿・JSON・Learnを同期 |
| system-development | system-development-lifecycle | 拡充済 | 原稿・JSON・Learnを同期 |
| system-development | system-development-migration-operations | 拡充済 | 原稿・JSON・Learnを同期 |
| system-development | system-development-testing | 拡充済 | 原稿・JSON・Learnを同期 |
| system-development | system-development-waterfall-agile | 拡充済 | 原稿・JSON・Learnを同期 |
| web-api | api-authentication-authorization | 拡充済 | 原稿・JSON・Learnを同期 |
| web-api | api-errors-idempotency | 拡充済 | 原稿・JSON・Learnを同期 |
| web-api | api-rest-json | 拡充済 | 原稿・JSON・Learnを同期 |
| web-api | api-webhook-async | 拡充済 | 原稿・JSON・Learnを同期 |
| web-api | web-client-server-http | 拡充済 | 原稿・JSON・Learnを同期 |

SEED 17章とstatus未設定の2章は、この60章の表へ含めません。情報セキュリティ本編は未マージのDraft PR #6にあり、mainの完成教材として数えません。

## 検証

60章中60章を拡充しました。残り53章には章固有の具体例を本文とLearnに加えました。データベースの二章に対応するPostgreSQL公式出典を補正し、ツール・Agent章の重複出典を整理しました。

- Markdown本文の番号付き項目とJSON `chunks[].text` の連結一致。
- 各チャンクは空でなく24文字以内。MarkdownとJSONの出典一致。
- Learn本文は初期DOMにあり、元原稿の例と留保を落とさない。
- `npm run check`。Androidでの通常速度・高速度の確認は未実施。
