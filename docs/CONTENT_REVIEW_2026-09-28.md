# 教材の内容拡充 — 2026-09-28

基点: main `8286763964b39b51b6e2462c737ab63308976727`。この記録の件数・状態は基点時点のものです。次の作業ではmainとPRを再取得してください。

## 現状と狙い

`COMPLETE v0.1` の60章は構造上の完成条件を満たしますが、本文は各14項目で約316〜446字です。定義と注意の列挙が中心で、例を使った因果関係や判断の説明は十分ではありません。Learnも原稿の知識範囲を保っているため、元の原稿が薄い章は同じ問題が残ります。

長さだけを合格条件にしません。各章の学習目標に合わせ、具体的な一件を追い、用語が何を区別するか、判断を誤る境界、前提と限界を説明します。数値や現在性が重要な主張は一次資料と照合します。元の出典だけで支えられない新しい主張を推測で補いません。

原稿本文を変更したら、同じ変更でRSVP JSONのチャンク列と出典を同期し、Learn HTMLを文章として改稿します。単純なチャンク連結でLearnを作りません。全件の品質を未確認のまま一括更新しません。

## 今回の着手範囲

- 代表値・ばらつき・分布: 五件の処理時間で平均と中央値の差を計算し、ばらつきと欠損を扱う。NIST資料を出典に追加。
- 正規化の基本: 注文・顧客・商品を使い、更新時の矛盾と第一〜第三正規形を追う。当時の配送先と現在住所を区別。
- 認証と認可: 申請APIで本人確認、対象ごとの権限確認、OAuthとAPIキーの違いを示す。

いずれも `COMPLETE v0.1` のstatusは維持します。この記録の「拡充済」は正式statusではなく、この作業における編集進捗です。Android実機での読みやすさは未確認です。

## 章ごとの次の作業

| 分野 | lesson id | 進捗 | 補う具体例・判断 |
|---|---|---|---|
| ai-evaluation-operations | ai-eval-goals-datasets | 未着手 | 申請回答AIの頻出例と重大な例外を分け、評価用データを作る。 |
| ai-evaluation-operations | ai-eval-human-judge | 未着手 | 同じ回答を人とモデルが採点し、不一致を調べる。 |
| ai-evaluation-operations | ai-eval-metrics-error-analysis | 未着手 | 正答率が同じ二つのモデルで、重大な誤答の内訳を比べる。 |
| ai-evaluation-operations | ai-ops-monitoring-drift-incidents | 未着手 | 導入後の誤答増加を検知し、調査と停止を判断する。 |
| ai-evaluation-operations | ai-ops-versioning-experiments-rollback | 未着手 | 新旧モデルを同一条件で比較し、戻す条件を決める。 |
| business-analysis | business-analysis-bottlenecks-waste | 未着手 | 申請処理の工程別件数・待ち時間から制約箇所を探す。 |
| business-analysis | business-analysis-kpi-automation-change | 未着手 | 自動化前後の処理時間と手戻り率を併記する。 |
| business-analysis | business-analysis-problem-value | 未着手 | 「電話が多い」を原因と解決目的へ分ける。 |
| business-analysis | business-analysis-process-mapping | 未着手 | 一件の申請が受付から決裁まで進む流れを描く。 |
| business-analysis | business-analysis-standardization-exceptions | 未着手 | 標準処理と例外処理の判断境界を示す。 |
| cloud | cloud-compute-serverless-containers | 未着手 | 同じ小規模APIを三方式で動かす場合の運用差を比べる。 |
| cloud | cloud-data-availability-observability | 未着手 | 障害時の復旧目標と監視対象を具体化する。 |
| cloud | cloud-iam | 未着手 | 一人の担当者が異動したときの権限変更を追う。 |
| cloud | cloud-networking | 未着手 | 外部からアプリ、データへ届く通信経路と遮断点を示す。 |
| cloud | cloud-service-models-responsibility | 未着手 | SaaSとIaaSで利用者が担う設定を同じ例で比べる。 |
| database-sql | database-normalization | 拡充済 | 原稿・JSON・Learnを同期 |
| database-sql | database-relational-model | 未着手 | 顧客・注文のキーと参照関係を小さな表で示す。 |
| database-sql | database-transaction-index | 未着手 | 振込の途中失敗と検索用索引を別の例で説明する。 |
| database-sql | sql-join-aggregation | 未着手 | 二つの小さな表を結び、結合後の行数と集計を示す。 |
| database-sql | sql-select-filter | 未着手 | 少数の行とクエリから、条件に残る行を追う。 |
| generative-ai | genai-cost-latency-security | 未着手 | 一つの応答で生じる費用・待ち時間・データ移動を追う。 |
| generative-ai | genai-llm-context | 未着手 | 同じ質問でも渡す資料によって回答が変わる例を示す。 |
| generative-ai | genai-rag | 未着手 | 質問から検索、根拠選択、生成、失敗分析まで追う。 |
| generative-ai | genai-structured-workflows-hitl | 未着手 | 抽出結果の検証と人間が承認する境界を示す。 |
| generative-ai | genai-tools-agents | 未着手 | ツール呼出しの成功・失敗・再試行を一件で追う。 |
| git-cicd | cicd-ci-tests-automation | 未着手 | 一つの変更がPRの検査を通過・失敗する流れを示す。 |
| git-cicd | cicd-deployment-environments-rollback | 未着手 | 本番反映後の異常検知から巻き戻しまで追う。 |
| git-cicd | git-branches-merges | 未着手 | 二つのブランチで同じ行を変える競合例を示す。 |
| git-cicd | git-commits-history | 未着手 | 小さな修正をコミットで分ける理由を例示する。 |
| git-cicd | github-pr-review-issues | 未着手 | IssueからPR、レビュー指摘、修正まで追う。 |
| project-management | pm-change-quality | 未着手 | 途中変更で期限・品質・試験がどう変わるか示す。 |
| project-management | pm-initiation-scope-wbs | 未着手 | 一つの案件を成果物と作業へ分解する。 |
| project-management | pm-issues-risks | 未着手 | 未発生のリスクと発生済み課題を同じ案件で比べる。 |
| project-management | pm-schedule-dependencies | 未着手 | 先行作業の遅延が後続へ波及する例を示す。 |
| project-management | pm-stakeholders-governance-pmo | 未着手 | 利用者、決裁者、運用者の意見が割れる場面を示す。 |
| requirements | requirements-as-is-to-be | 未着手 | 現行の申請受付と改善後の流れを一件で比べる。 |
| requirements | requirements-business-system | 未着手 | 業務目的から画面・通知・記録の要件へ落とす。 |
| requirements | requirements-functional-nonfunctional | 未着手 | 同じ申請機能に速度・権限・復旧条件を加える。 |
| requirements | requirements-stakeholders-scope | 未着手 | 要望の衝突と対象外の決め方を示す。 |
| requirements | requirements-validation-traceability | 未着手 | 一つの業務目的から要件と試験を対応させる。 |
| software-architecture | architecture-coupling-cohesion-dependencies | 未着手 | 変更が複数モジュールへ波及する例を示す。 |
| software-architecture | architecture-idempotency-retry-failures | 未着手 | 同じ申請を再送しても二重登録しない流れを追う。 |
| software-architecture | architecture-modules-interfaces | 未着手 | 受付と通知を分け、境界に渡すデータを示す。 |
| software-architecture | architecture-state-source-of-truth | 未着手 | 同じ状態が二か所で食い違うときの正本を示す。 |
| software-architecture | architecture-sync-async-events-queues | 未着手 | 通知処理を同期・非同期で比べ、失敗時を示す。 |
| statistics-data-analysis | statistics-correlation-regression-causality | 未着手 | 第三の要因がある小さな観測例で区別する。 |
| statistics-data-analysis | statistics-descriptive-distributions | 拡充済 | 原稿・JSON・Learnを同期 |
| statistics-data-analysis | statistics-estimation-confidence-intervals | 未着手 | 標本から区間を作る解釈と誤解を数値で示す。 |
| statistics-data-analysis | statistics-hypothesis-testing-effect-size | 未着手 | p値と効果の大きさが異なる判断を例示する。 |
| statistics-data-analysis | statistics-population-sample-bias | 未着手 | 回答者だけに偏った調査から一般化する危険を示す。 |
| system-development | system-development-design | 未着手 | 一つの要件を画面・データ・異常時の設計へ展開する。 |
| system-development | system-development-lifecycle | 未着手 | 小さな案件の企画から保守までを追う。 |
| system-development | system-development-migration-operations | 未着手 | 旧データ移行の失敗と切戻し条件を示す。 |
| system-development | system-development-testing | 未着手 | 単体・結合・受入で見つける不具合を比べる。 |
| system-development | system-development-waterfall-agile | 未着手 | 同じ変更要求を二つの進め方で扱う。 |
| web-api | api-authentication-authorization | 拡充済 | 原稿・JSON・Learnを同期 |
| web-api | api-errors-idempotency | 未着手 | タイムアウト後の再送で二重作成を防ぐ。 |
| web-api | api-rest-json | 未着手 | 一件の要求とJSON応答、状態コードを追う。 |
| web-api | api-webhook-async | 未着手 | 通知の重複・順序逆転・失敗時を示す。 |
| web-api | web-client-server-http | 未着手 | ブラウザからサーバーへの要求と応答を追う。 |

SEED 17章とstatus未設定の2章は、この60章の表へ含めません。情報セキュリティ本編は未マージのDraft PR #6にあり、mainの完成教材として数えません。

## 検証

- Markdown本文の番号付き項目とJSON `chunks[].text` の連結一致。
- 各チャンクは空でなく24文字以内。MarkdownとJSONの出典一致。
- Learn本文は初期DOMにあり、元原稿の例と留保を落とさない。
- `npm run check` と、Androidでの通常速度・高速度の確認。
