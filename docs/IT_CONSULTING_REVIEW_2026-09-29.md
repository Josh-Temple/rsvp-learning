# ITコンサルティング 本編レビュー — 2026-09-29

基点: main `53bfa9cc1069be86f0cd6f2871da21ac5745f021`

## 結論

既存の `it-consulting-overview` は `SEED / 概要のみ` の入口として残し、本編7章を `COMPLETE v0.1` として追加した。

追加章:

1. `it-consulting-problem-framing` — 課題設定とコンサルティングの問い
2. `it-consulting-issue-hypothesis` — 論点整理と仮説思考
3. `it-consulting-evidence-analysis` — 事実・解釈・証拠の組み立て
4. `it-consulting-options-decision` — 施策比較と意思決定
5. `it-consulting-business-case-value` — Business Case・ROI・価値実現
6. `it-consulting-roadmap-sequencing` — ロードマップ・優先順位・実行順序
7. `it-consulting-proposal-executive` — 提案書・経営層説明・意思決定支援

## 章構成

既存の業務分析、要件定義、プロジェクト管理教材と重複しすぎないよう、ITコンサルティングを「意思決定支援の流れ」として構成した。

1. 課題設定とコンサルティングの問い
2. 論点整理と仮説思考
3. 事実・解釈・証拠の組み立て
4. 施策比較と意思決定
5. Business Case・ROI・価値実現
6. ロードマップ・優先順位・実行順序
7. 提案書・経営層説明・意思決定支援

## 一次資料・公式資料のfresh確認

2026-09-29時点で次を確認した。

- IIBA The Business Analysis Standard
  - Strategy Analysis
  - Elicitation and Collaboration
  - Define Design Options
  - Analyze Potential Value and Recommend Solution
  - Communicate Business Analysis Information
- GOV.UK Service Manual
  - How the discovery phase works
  - Plan user research for your service
  - Measuring the benefits of your service
  - Developing a roadmap
  - Planning in agile
  - Deciding on priorities
- PMI Benefits Realization Management Framework
- HM Treasury The Green Book (2026)

Green Bookは2026-02-05更新の2026年版を使用した。公共部門の価値判断では金銭的ROIだけで十分とはしない。

## 内容品質

既存教材との差を次のように置いた。

- 業務分析: 現状業務、ボトルネック、標準化、KPIを深掘り
- 要件定義: 業務要件・システム要件・スコープ・トレーサビリティを深掘り
- プロジェクト管理: WBS、スケジュール、課題・リスク、PMOを深掘り
- ITコンサルティング: 何を意思決定するかを定め、証拠と選択肢を組み立て、投資判断・ロードマップ・提案へつなげる

各章では次の境界を明示した。

- 依頼された解決策 ≠ 解くべき課題
- 仮説 ≠ 事実
- 情報量 ≠ 証拠の質
- 点数表 ≠ 意思決定そのもの
- 高ROI ≠ 自動的に採用すべき施策
- ロードマップ ≠ 固定日程
- 提案書 ≠ 情報の全量報告

## 同期検証

- `it-consulting-problem-framing`: Learn 1083字 / RSVP 48 chunks / max 19文字
- `it-consulting-issue-hypothesis`: Learn 921字 / RSVP 48 chunks / max 21文字
- `it-consulting-evidence-analysis`: Learn 1004字 / RSVP 48 chunks / max 19文字
- `it-consulting-options-decision`: Learn 941字 / RSVP 48 chunks / max 17文字
- `it-consulting-business-case-value`: Learn 1076字 / RSVP 48 chunks / max 24文字
- `it-consulting-roadmap-sequencing`: Learn 1084字 / RSVP 48 chunks / max 20文字
- `it-consulting-proposal-executive`: Learn 982字 / RSVP 48 chunks / max 18文字

生成時に全7章で次を確認した。

- Markdown番号付き本文とRSVP JSON `chunks[].text` が一致
- MarkdownとJSONの出典が一致
- RSVPチャンクは24文字以内
- LearnはRSVPチャンクの単純連結ではなく音声向けに再構成
- Learn本文は初期DOMに存在
- 既存Web Speech APIプレイヤー構造を維持

以上から本編7章を `COMPLETE v0.1` と判定する。
