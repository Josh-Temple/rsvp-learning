# HANDOFF — 教材品質改善・未完成領域の拡充

作成日: 2026-09-29 JST  
対象Repository: `Josh-Temple/rsvp-learning`  
本資料作成直前にfresh readしたmain: `7efb7e0792133bc4b0f1c4206e407bb99219b29b`

> 重要: このSHAは引き継ぎ時点の記録です。再開時の現在状態として扱わず、作業開始時に必ずmain、対象ファイル、対象PR、GitHub Actionsをfresh readしてください。

## 1. このセッションの目的

主目的は、既存教材の「内容が薄い」という問題を改善し、その後に未完成領域を体系的に拡充することでした。

進め方は次の順序です。

1. 既存COMPLETE教材の内容品質基準を定義
2. 代表5章を深掘り
3. 残り55章へ同じ基準を展開
4. 60章全体の内容品質改稿を完了
5. SEEDだけの未完成領域を正式な複数章コースへ拡張
6. 最初の拡張対象として情報セキュリティを本編化
7. 次の対象としてAIガバナンスへ着手予定

## 2. 現在の教材数

本資料作成直前の `lessons/index.json`:

- `COMPLETE v0.1`: 67
- `SEED / 概要のみ`: 17
- statusなし: 2
- 合計: 86

statusなしの2件は既存の入口・使い方教材です。

## 3. 内容品質基準

正本:

- `docs/CONTENT_QUALITY_STANDARD.md`

方針は「文字数を増やす」ことではありません。

各章で必要に応じて次を確認します。

- 射程と学習目標
- 用語の定義
- なぜ必要か
- 仕組み・因果関係
- 具体例
- 境界・反例・失敗条件
- 関連概念との違い
- 前後章との接続
- 根拠と不確実性
- 現在性が重要な情報の再確認

長さの一律基準は置きません。

## 4. 既存60章の深掘り

### 第1弾

PR #35  
タイトル: `教材品質基準を追加し代表5章を深掘り`

代表5章:

1. 要件の検証とトレーサビリティ
2. トランザクションとインデックス
3. 認証と認可
4. RAGの基本
5. 仮説検定・p値・効果量

追加・更新:

- `docs/CONTENT_QUALITY_STANDARD.md`
- `prompts/lesson-draft.md`
- 対象5章のMarkdown
- 対象5章のRSVP JSON
- 対象5章のLearn HTML
- `docs/CONTENT_QUALITY_PASS_2026-09-28.md`

CI成功後にmerge済み。

### 第2弾

PR #36  
タイトル: `残り55章へ内容品質の深掘りを展開`

残り55章すべてについて:

- Markdown原稿: 55
- RSVP JSON: 55
- Learn HTML: 55

計165ファイルを同期更新。

主な改善軸:

- 定義だけでなく仕組み
- 正常系だけでなく境界・反例
- 一つの指標だけで判断しない条件
- 似た概念との違い
- 変更時・失敗時の影響
- 実務判断に必要な条件

記録:

- `docs/CONTENT_QUALITY_PASS_ALL_2026-09-28.md`

CI成功後にmerge済み。

## 5. 60章改稿後の判断

60章はすべて `COMPLETE v0.1` のまま、内容品質基準による深掘り対象になりました。

ただし、これは「教材全体が包括的に完成した」という意味ではありません。

既存60章の密度よりも、次はSEEDしかない分野の空白を埋める方が価値が高いと判断しています。

## 6. 未完成領域

本資料作成時点で、1章のSEEDしかない主なコース:

- 情報セキュリティ → 今回本編7章を追加済み
- AIガバナンス・リスク管理
- ネットワーク・OS・インフラ
- ITコンサルティング
- 公共DX・GovTech
- ヘルスケア・介護DX

既存の他コースにもoverview SEEDがありますが、本編5章が既にあるため優先度は低めです。

## 7. 情報セキュリティ拡張

PR #38  
タイトル: `情報セキュリティ本編7章を追加`

merge済み。

現在のmain:

`7efb7e0792133bc4b0f1c4206e407bb99219b29b`

情報セキュリティの章順:

1. `information-security-overview` — SEED
2. `security-cia-risk`
3. `security-cryptography-hash-signature`
4. `security-authentication-access-control`
5. `security-network-endpoint-defense`
6. `security-vulnerability-secure-development`
7. `security-incident-response-recovery`
8. `security-governance-supply-chain`

追加した7章はすべて `COMPLETE v0.1`。

各章に:

- Markdown
- RSVP JSON
- Learn HTML
- 出典
- カタログ登録
- course登録

を追加済み。

レビュー記録:

- `docs/INFORMATION_SECURITY_REVIEW_2026-09-28.md`

## 8. 情報セキュリティの設計方針

試験対策専用にはしていません。

目標は、広く浅く体系を理解し、次の概念を区別できることです。

- 機密性・完全性・可用性
- 脅威・脆弱性・影響・リスク
- 暗号化・ハッシュ・デジタル署名
- 認証・認可・最小権限
- 境界防御と多層防御
- 脆弱性修正と安全な開発
- 検知・対応・復旧
- 技術対策とガバナンス
- 自組織と供給網

参照した主な一次資料:

- NIST Cybersecurity Framework 2.0
- NIST SP 800-63B-4
- NIST SP 800-207
- NIST SP 800-218
- NIST SP 800-61 Rev.3
- NIST SP 1305
- NIST暗号関連標準
- OWASP Top 10:2025
- IPAの情報セキュリティ関連シラバス案内

再開時は、これらの最新版を必要に応じてfresh確認してください。

## 9. PR #38で起きたCI失敗と修正

最初のCIは失敗しました。

原因:

`tests/learn-html.test.mjs` がCOMPLETE教材数を固定値60としていたため、7章追加後の67件と一致しなかった。

失敗:

`67 !== 60`

教材内容の問題ではありませんでした。

修正:

固定値60を削除し、

- `status === "COMPLETE v0.1"` の件数
- `learn_path` を持つ件数

が一致することを動的に検証するよう変更。

修正commit:

`c0e25ca8b368a3478c7da488241ad565d4daca41`

修正後GitHub Actions Test: PASS。

今後教材数が増えても、この固定件数問題では壊れません。

## 10. 次に進める予定だった作業

次の優先対象は:

`AIガバナンス・リスク管理`

既存SEED:

- `lessons/ai-governance/ai-governance-overview.md`
- `lessons/ai-governance/ai-governance-overview.json`

作成済みbranch:

`ai-governance-course-2026-09-28`

このbranchは本資料作成時点ではmainと同じSHA:

`7efb7e0792133bc4b0f1c4206e407bb99219b29b`

つまり、branchだけ作成済みでAIガバナンス本文はまだ書き込んでいません。

## 11. AIガバナンスで想定していた章構成

既存overviewの「次に深掘りする項目」を基に、概ね次のような構成が自然です。

1. AIライフサイクルとリスク
2. データ・プライバシー・機密情報
3. AIセキュリティと周辺システム
4. バイアス・公平性・評価
5. 透明性・説明可能性・記録
6. Human Oversightと責任分界
7. 監査可能性・変更管理・インシデント対応

これはまだ正式確定していません。

再開時に最新の一次資料を確認し、必要なら章構成を調整してください。

## 12. AIガバナンスで使う候補資料

再開時に最新版をwebでfresh確認すること。

候補:

- 日本のAI事業者向けガイドライン
- NIST AI Risk Management Framework
- NIST Generative AI Profile
- OECD AI Principles
- 必要に応じてISO/IEC 42001等の公的説明資料
- 個人情報・セキュリティ関連の日本国内一次資料

注意:

- 現行版番号や公開日はfresh確認する
- 法令・制度要件を推測で書かない
- 海外ルールを日本国内の義務として扱わない
- 原則、概念理解を中心にし、変わりやすい具体値を教材へ埋め込みすぎない

## 13. 次のコース候補

AIガバナンス後の優先候補:

### A. ネットワーク・OS・インフラ

既存SEED:

- TCP/IP
- DNS
- HTTP/TLS
- Port
- Process
- Memory
- Filesystem
- Linux基礎

情報セキュリティと一部重複するので、セキュリティ教材の再説明ではなく「基盤がどう動くか」を中心にする。

### B. ITコンサルティング

候補:

- 課題設定
- 論点整理
- 仮説思考
- 施策比較
- ロードマップ
- ROI
- 提案書

### C. 公共DX・GovTech

候補:

- 行政サービス設計
- 調達
- 標準化
- データ連携
- クラウド
- アクセシビリティ
- 制度改正対応

制度の現在性が重要なので、デジタル庁・総務省等の一次資料をfresh確認する。

### D. ヘルスケア・介護DX

候補:

- 介護業務フロー
- 医療・介護データ
- 個人情報
- 標準化
- 業務システム
- AI利用
- 制度改正

制度や個人情報の扱いは変わりやすいため、必ず一次資料を確認する。

## 14. RSVP / Learnの同期ルール

正本:

- `docs/LESSON_FORMAT.md`
- `docs/LEARN_HTML_FORMAT.md`
- `docs/CONTENT_QUALITY_STANDARD.md`

COMPLETE教材を追加するときは、同じ変更で次をそろえる。

1. Markdown
2. RSVP JSON
3. Learn HTML
4. `lessons/index.json`
5. `courses/index.json`

Markdown本文の番号付き項目とRSVP JSONの `chunks[].text` は内容同期が必要。

既存検証ではRSVPチャンク24文字制限がある。

Learn HTMLはRSVPチャンクの単純連結ではなく、同じ知識範囲を音声で追える段落へ再構成する。

## 15. 作業時の重要ルール

- 過去チャットの件数・SHAを現在状態の根拠にしない
- 最初にmainをfresh read
- 対象SEEDとcourse/catalogをfresh read
- 現在性のある内容はwebで一次資料をfresh確認
- Markdown / JSON / Learnを同期
- statusを独自に増やさない
- COMPLETE条件を満たさない場合はDRAFTに置く
- 出典を架空で作らない
- 具体的な数値・制度要件・製品仕様を推測で埋めない
- PR作成後は必ずGitHub ActionsのTestを確認
- mainが並行更新された場合は変更ファイルを比較し、競合を推測で無視しない

## 16. 再開時の最初のプロンプト例

```text
Josh-Temple/rsvp-learning の教材拡充作業を続けてください。

最初に以下をfresh readしてください。

- docs/HANDOFF_2026-09-29_CONTENT_EXPANSION.md
- 現在のmain SHA
- docs/LESSON_FORMAT.md
- docs/LEARN_HTML_FORMAT.md
- docs/CONTENT_QUALITY_STANDARD.md
- lessons/index.json
- courses/index.json
- lessons/ai-governance/ai-governance-overview.md
- lessons/ai-governance/ai-governance-overview.json
- branch ai-governance-course-2026-09-28 の現在状態
- 最新のGitHub Actions Test

過去チャットや引き継ぎ資料内のSHA・件数を現在状態として扱わず、必ずfresh readしてください。

その後、AIガバナンス・リスク管理を、情報セキュリティと同じ方式で複数章のCOMPLETE教材へ拡張してください。

現在性が重要な内容は、日本国内の一次資料、NIST等の公式資料をwebでfresh確認してください。

各章についてMarkdown / RSVP JSON / Learn HTMLを同期し、courses/index.json と lessons/index.json へ登録してください。

CIが成功するまで修正し、問題がなければPRをmergeしてください。
```

## 17. 現時点の判断

既存60章の「薄さ」に対する第一段階の対処は完了しています。

次の改善効果が大きいのは、既存60章をさらに長くすることではなく、SEEDのみの分野を5〜7章程度の本編へ拡張して、教材全体の空白を埋めることです。

情報セキュリティはその第一弾として完了しました。

次はAIガバナンス、その後にネットワーク・OS・インフラへ進むのが自然です。
