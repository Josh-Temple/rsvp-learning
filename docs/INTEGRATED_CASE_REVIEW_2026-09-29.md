# 統合ケース教材レビュー 2026-09-29

## 目的

主要分野の本編整備後に残った構造上の弱点である「複数コースの知識を一つの案件でどう組み合わせて判断するか」を補うため、7章の連続ケースを追加した。

このケースは、紙・メール・表計算が混在する架空の申請・審査サービス刷新を最初から最後まで追う。新しい専門知識を増やすことではなく、既存教材の知識を意思決定の流れへ接続することが目的である。

特定の行政制度、企業、製品、法令要件をモデル化した教材ではない。

## 対象

1. `integrated-case-problem-framing` — 課題設定とAs-Is
2. `integrated-case-requirements-scope` — To-Be・要件・スコープ
3. `integrated-case-data-api-architecture` — データ・API・アーキテクチャ
4. `integrated-case-security-cloud` — Security・Cloud・復旧
5. `integrated-case-ai-governance` — 生成AIを入れるか
6. `integrated-case-delivery-change` — Delivery・CI/CD・移行
7. `integrated-case-outcomes-operations` — 効果測定・運用・改善

## 既存コースとの接続

- 第1章: ITコンサルティング、業務分析、統計
- 第2章: 要件定義、業務分析、システム開発
- 第3章: Database / SQL、API / Web、Software Architecture
- 第4章: 情報セキュリティ、Cloud、Network / Infra
- 第5章: 生成AI、AI評価・運用、AIガバナンス
- 第6章: Project Management、Git / GitHub / CI/CD、System Development
- 第7章: Statistics、AI / System Operations、Business Analysis、IT Consulting

## 内容レビュー

全章で同じ架空案件を継続している。

重要な境界条件も維持している。

- 解決策を先に固定しない。
- 実在制度の要件と架空ケースを混同しない。
- 第5章ではAI導入を前提にせず、導入しない選択肢を残す。
- 高影響判断をAIへ委ねることを推奨しない。
- 第7章では改善後の数値だけから因果を断定しない。
- 製品固有の設定値や現在性を持つ制度上の具体値は置かない。

## Markdown / RSVP 同期検証

全7章について、Markdownの番号付き本文とRSVP JSON `chunks[].text` の連結が完全一致した。

| lesson | chunks | 最大chunk長 |
|---|---:|---:|
| problem-framing | 48 | 20 |
| requirements-scope | 48 | 17 |
| data-api-architecture | 48 | 17 |
| security-cloud | 48 | 18 |
| ai-governance | 48 | 16 |
| delivery-change | 48 | 21 |
| outcomes-operations | 48 | 18 |

全章で空chunkは0。24文字超のchunkは0。

MarkdownのtitleとJSONのtitleは一致し、JSONのtopicは全章 `統合ケース`。Markdown statusは全章 `COMPLETE v0.1`。

## Learn検証

全7ページについて以下を確認した。

- `<html lang="ja">`
- 初期DOM内の `article#learn-article`
- 再生、一時停止、停止、音声選択、0.7〜4.0倍の速度UI
- 本文はRSVPの単純な無加工連結ではなく、見出し付きの連続文章として構成
- 架空ケースであること、または適用範囲・限界を本文末で明示

Learn本文長:

| lesson | 文字数 |
|---|---:|
| problem-framing | 876 |
| requirements-scope | 879 |
| data-api-architecture | 880 |
| security-cloud | 896 |
| ai-governance | 903 |
| delivery-change | 922 |
| outcomes-operations | 861 |

## Catalog / Course

`lessons/index.json` に7章を `COMPLETE v0.1` として登録し、各 `learn_path` を追加した。

`courses/index.json` に以下を追加した。

- id: `integrated-case`
- title: `統合ケース: 申請・審査サービス刷新`
- chapters: 7章を案件進行順に登録

このコースはdomain overviewではなく連続ケースであるため、別のSEED overviewは追加していない。

## 判定

7章は `docs/LESSON_FORMAT.md` の構造条件と `docs/CONTENT_QUALITY_STANDARD.md` の横断学習目的に整合する。

初版の統合ケースとして `COMPLETE v0.1` を維持してよい。
