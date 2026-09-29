# HANDOFF — 教材拡充完了後の横断統合ケース

作成日: 2026-09-29 JST  
Repository: `Josh-Temple/rsvp-learning`

> 重要: 本資料に記載したSHA・件数は作成時点の記録です。再開時は必ず `main`、対象branch、catalog、GitHub Actionsをfresh readしてください。

## 1. 現在のmain

本資料作成時点の `main`:

`03c8b9e1d85d0469ee4da583b5946be9b3e31186`

このSHAに対する最新のGitHub Actions `Test`:

- run: `36538686910`
- status: completed
- conclusion: success

## 2. 現在の教材数

`main` の `lessons/index.json`:

- 総教材数: 121
- `COMPLETE v0.1`: 104
- `SEED / 概要のみ`: 17
- statusなし: 0
- course数: 19

SEED 17件は各分野のoverviewであり、「本編未作成」の残件ではない。

## 3. このセッションで完了した主な作業

### ITコンサルティング

PR #44  
`ITコンサルティング本編7章を追加`

merge commit:

`7812fe32082df760b5f8ddfe5488b83dac850ea7`

本編7章:

1. 課題設定とコンサルティングの問い
2. 論点整理と仮説思考
3. 事実・解釈・証拠の組み立て
4. 施策比較と意思決定
5. Business Case・ROI・価値実現
6. ロードマップ・優先順位・実行順序
7. 提案書・経営層説明・意思決定支援

レビュー記録:

`docs/IT_CONSULTING_REVIEW_2026-09-29.md`

### 公共DX・GovTech

PR #45  
`公共DX・GovTech本編7章を追加`

merge commit:

`702764095bf14bb247a58a72913be04dad0d9c3b`

本編7章:

1. 行政サービス設計と利用者中心
2. 行政IT調達と発注者・事業者の役割
3. 標準化・共通化と個別最適の境界
4. 行政データ連携と相互運用性
5. ガバメントクラウドと責任分界・運用
6. アクセシビリティとデジタル包摂
7. 制度・仕様変更と継続運用

レビュー記録:

`docs/PUBLIC_DX_GOVTECH_REVIEW_2026-09-29.md`

### ヘルスケア・介護DX

PR #46  
`ヘルスケア・介護DX本編7章を追加`

merge commit:

`dd1ce7cbe305de299f8d2e8cd7c0d77510b060ce`

本編7章:

1. 介護業務フローと記録・連携・請求
2. 医療・介護データ連携と介護情報基盤
3. 医療・介護データの個人情報と安全管理
4. 介護テクノロジー導入と現場定着
5. 介護現場のAI支援とHuman Oversight
6. 生産性向上とケア品質の同時評価
7. 制度・介護報酬改定とシステム変更

レビュー記録:

`docs/HEALTHCARE_CARE_DX_REVIEW_2026-09-29.md`

### Lesson statusの整合性

PR #47  
`教材statusを全件必須化`

merge commit:

`03c8b9e1d85d0469ee4da583b5946be9b3e31186`

対応:

- `requirements-basics`
  - 現行Markdown形式へ移行
  - RSVP 48 chunks
  - Learn HTML追加
  - `COMPLETE v0.1` 付与
- `rsvp-basics`
  - Markdown正本追加
  - Learn HTML追加
  - `COMPLETE v0.1` 付与
- `lesson-catalog.schema.json`
  - 各Lessonの `status` を必須化
- catalog test
  - statusなしentryをinvalidとする検証追加

レビュー記録:

`docs/LESSON_STATUS_CLEANUP_2026-09-29.md`

## 4. 教材全体の現在評価

本編が未作成だった主要6分野はすべて本編化済み。

- 情報セキュリティ
- AIガバナンス・リスク管理
- ネットワーク・OS・インフラ
- ITコンサルティング
- 公共DX・GovTech
- ヘルスケア・介護DX

既存の内容品質基準:

`docs/CONTENT_QUALITY_STANDARD.md`

現在の主要な構造上の弱点は、個別分野の教材不足よりも、

「複数コースの知識を、一つの案件でどう組み合わせて判断するか」

を学ぶ横断教材がないこと。

このため、次の改善として統合ケースを作成中。

## 5. 作業中の統合ケースbranch

branch:

`content/integrated-case-course-2026-09-29`

本資料作成時点のbranch HEAD:

`183ed29ad078876ddfd8a7347ce6d801795314f9`

baseとなるmain:

`03c8b9e1d85d0469ee4da583b5946be9b3e31186`

compare:

- branchはmainより2 commits ahead
- 0 commits behind
- 変更ファイル21件

重要:

このbranchはまだPR化・mergeしていない。

また、以下はまだ更新していない。

- `lessons/index.json`
- `courses/index.json`
- 統合ケースのレビュー記録

つまり7章のMarkdown / RSVP JSON / Learn HTMLのみがbranchに存在する状態。

## 6. 統合ケースの設計

架空の「紙・メール・表計算が混在する申請・審査サービス刷新」を一つの案件として、最初から最後まで追う。

目的は新しい知識を増やすことではなく、既存コースの知識を一つの意思決定系列へ接続すること。

作成済み7章:

1. `integrated-case-problem-framing`
   - 統合ケース1: 課題設定とAs-Is
2. `integrated-case-requirements-scope`
   - 統合ケース2: To-Be・要件・スコープ
3. `integrated-case-data-api-architecture`
   - 統合ケース3: データ・API・アーキテクチャ
4. `integrated-case-security-cloud`
   - 統合ケース4: Security・Cloud・復旧
5. `integrated-case-ai-governance`
   - 統合ケース5: 生成AIを入れるか
6. `integrated-case-delivery-change`
   - 統合ケース6: Delivery・CI/CD・移行
7. `integrated-case-outcomes-operations`
   - 統合ケース7: 効果測定・運用・改善

各章に存在:

- `lessons/integrated-case/<id>.md`
- `lessons/integrated-case/<id>.json`
- `learn/<id>.html`

## 7. 統合ケースの生成時検証

全7章:

- RSVP: 各48 chunks
- 最大chunk長: 21文字以下
- status: `COMPLETE v0.1`
- Learn本文: 約861〜922字
- 同じ架空案件を継続利用

生成時メトリクス:

- problem-framing: 48 / max 20 / Learn 876字
- requirements-scope: 48 / max 17 / Learn 879字
- data-api-architecture: 48 / max 17 / Learn 880字
- security-cloud: 48 / max 18 / Learn 896字
- ai-governance: 48 / max 16 / Learn 903字
- delivery-change: 48 / max 21 / Learn 922字
- outcomes-operations: 48 / max 18 / Learn 861字

ただし、まだGitHubから全7章をreadbackしてMarkdown/JSON同期・Learn構造を最終再検証していない。

## 8. 統合ケースで扱う接続

### 第1章

接続する主分野:

- ITコンサルティング
- 業務分析
- 統計

扱うこと:

- 解決策から問題へ戻す
- As-Is
- 症状と原因
- Baseline
- 制約と前提
- 成功条件

### 第2章

接続する主分野:

- 要件定義
- 業務分析
- システム開発

扱うこと:

- To-Be
- 業務要件とSystem要件
- 機能・非機能
- 標準と例外
- Scope
- 受入条件

### 第3章

接続する主分野:

- Database / SQL
- API / Web
- Software Architecture

扱うこと:

- Data model
- 正本と履歴
- API契約
- 同期・非同期
- Retry
- Idempotency
- 部分成功

### 第4章

接続する主分野:

- 情報セキュリティ
- Cloud
- Network / Infra

扱うこと:

- CIA
- 認証と認可
- IAM
- 責任分界
- Network
- Backup
- RTO / RPO
- Incident対応

### 第5章

接続する主分野:

- 生成AI
- AI評価・運用
- AIガバナンス

扱うこと:

- AIを入れる理由
- RAG
- 根拠不足
- Tool権限
- Privacy
- 評価
- Human Oversight
- 停止条件

### 第6章

接続する主分野:

- Project Management
- Git / GitHub / CI/CD
- System Development

扱うこと:

- WBS
- 依存関係
- Branch / Commit / PR
- CI
- 環境分離
- Data migration
- Rollback
- 運用引継ぎ

### 第7章

接続する主分野:

- Statistics
- AI / System Operations
- Business Analysis
- IT Consulting

扱うこと:

- Baseline比較
- 複数KPI
- 副作用
- 相関と因果
- Incident学習
- Roadmap更新

## 9. 再開時に最初に行うこと

過去チャットやこの文書のSHAを現在状態として扱わない。

最初にfresh read:

1. `main`
2. `content/integrated-case-course-2026-09-29`
3. 両者のcompare
4. `lessons/index.json`
5. `courses/index.json`
6. `docs/LESSON_FORMAT.md`
7. `docs/LEARN_HTML_FORMAT.md`
8. `docs/CONTENT_QUALITY_STANDARD.md`
9. 最新GitHub Actions Test
10. 統合ケース7章のMarkdown / JSON / Learn

## 10. 次の具体的な作業

### A. 全7章をreadback検証

各章について:

- Markdown番号付き本文とJSON `chunks[].text` の連結一致
- 各chunk 24文字以内
- Markdown / JSONのtitle・id・topic整合
- Learnに `article#learn-article` が初期DOMで存在
- Learn読み上げUIが存在
- Learnが知識範囲を落としていない
- 架空ケースとして事実と混同する表現がない

### B. catalog登録

`lessons/index.json` に7章追加。

想定topic:

`統合ケース`

status:

`COMPLETE v0.1`

learn_pathも付与する。

### C. course登録

`courses/index.json` に新コースを追加。

推奨:

- id: `integrated-case`
- title: `統合ケース: 申請・審査サービス刷新`
- chapters: 上記7章

このコースはdomain overviewではなく連続ケースなので、別のSEED overviewは追加しない方が重複が少ない。

### D. レビュー記録

推奨ファイル:

`docs/INTEGRATED_CASE_REVIEW_2026-09-29.md`

記録すること:

- なぜ横断ケースを追加したか
- 架空ケースであること
- 各章がどの既存コースを接続するか
- 新知識の追加ではなく知識統合が目的であること
- Markdown / RSVP / Learn同期
- chunk長
- Learn本文長
- catalog / course登録結果

### E. CIとmerge

1. 最新mainが変わっていないか再確認
2. PR作成
3. GitHub Actions `Test` を確認
4. PASSならexpected head SHAを固定してmerge
5. merge後mainのTestを確認
6. catalog件数をfresh read

現在121件なので、7章追加だけなら理論上128件になるが、現在状態は必ずfresh readして数える。

## 11. 注意点

- 統合ケースは実在の行政制度をモデル化したものではない。
- 法令・制度・製品仕様の現在性を持つ具体値は入れない。
- 既存教材の説明を長く再掲しない。
- 用語を一つの案件内で「いつ使うか」を示すことを優先する。
- 第5章は「AIを導入する」ことを前提にしない。
- 第7章は導入後の数字改善だけから因果を断定しない。
- Courseを追加するときも、既存のstatus体系を変更しない。
- `COMPLETE v0.1` の構造条件は `docs/LESSON_FORMAT.md` を正本とする。

## 12. 現時点の判断

教材の主要な分野空白を埋める作業は一段落している。

次に価値が高いのは、新しい分野を無制限に増やすことより、

1. 既存分野を横断して判断するケース
2. 実際に思い出せるかを確認する学習設計
3. Android RSVP / Learnでの実利用検証

へ進むこと。

現在着手中の統合ケースは、その1番目に対応する。
