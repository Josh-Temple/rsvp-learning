# AIガバナンス・リスク管理 本編レビュー

作成日: 2026-09-29 JST
対象: `AIガバナンス・リスク管理` コース

## 結論

既存のoverviewは `SEED / 概要のみ` のまま残し、本編7章を `COMPLETE v0.1` として追加した。

追加章:

1. `ai-governance-lifecycle-risk` — AIライフサイクルとリスク管理
2. `ai-governance-data-privacy` — データ・プライバシー・機密情報
3. `ai-governance-security-dependencies` — AIセキュリティと周辺システム
4. `ai-governance-fairness-evaluation` — バイアス・公平性・評価
5. `ai-governance-transparency-documentation` — 透明性・説明可能性・記録
6. `ai-governance-human-oversight-accountability` — Human Oversightと責任分界
7. `ai-governance-audit-change-incidents` — 監査可能性・変更管理・インシデント対応

各章について、Markdown原稿、RSVP JSON、Learn HTML、`lessons/index.json`、`courses/index.json` を同一変更で同期した。

## 参照した一次資料・公式資料

2026-09-29にfresh確認した。

- [経済産業省 AI事業者ガイドライン（第1.2版）](https://www.meti.go.jp/shingikai/mono_info_service/ai_shakai_jisso/20260331_report.html)
  - 2026年3月31日取りまとめ。経済産業省の掲載ページでは第1.2版が最新版として示されている。
- [NIST AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework)
  - AI RMF 1.0は現行の参照枠組みとして公開されている一方、2026年9月時点では改訂作業中と明記されている。
- [NIST AI RMF Generative AI Profile](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence)
  - 生成AI固有または増幅されるリスクと、ライフサイクル上の対策を確認した。
- [NIST SP 1270](https://www.nist.gov/publications/towards-standard-identifying-and-managing-bias-artificial-intelligence)
  - 偏りを統計・計算、人の認知、制度・社会まで広げて捉える整理を確認した。
- [OECD AI Principles](https://www.oecd.org/en/topics/ai-principles.html)
  - 2019年採択、2024年更新。公平性・プライバシー、透明性・説明可能性、安全性・セキュリティ、アカウンタビリティ、人による監督などを確認した。
- [個人情報保護委員会 生成AIサービスの利用に関する注意喚起等について](https://www.ppc.go.jp/news/careful_information/230602_AI_utilize_alert/)
  - 生成AI利用時の個人情報の取扱いを扱う国内一次資料として参照した。
- [ISO AI management systems: What businesses need to know](https://www.iso.org/artificial-intelligence/ai-management-systems)
  - ISO/IEC 42001のAIマネジメントシステムと継続的改善の考え方を確認した。

## 章構成の判断

既存教材との重複を避けるため、モデル技術そのものよりも次を中心にした。

- 利用目的・影響・責任から始めるリスク管理
- データ利用条件、プライバシー、機密性
- モデル外の周辺システムと供給網
- 公平性を文脈依存の評価課題として扱うこと
- 説明と記録を監査可能な証拠へつなげること
- Human Oversightを実効的な権限設計として扱うこと
- 変更、監視、インシデント、復旧、継続的改善

## 現在性と不確実性

- 日本国内の具体的な法的義務を本教材だけから断定しない。
- NIST AI RMFは改訂中であるため、固定的な将来仕様として扱わない。
- 海外の原則や標準を日本国内の法的義務として扱わない。
- 法令、契約、製品仕様、組織規程が関係する場面では最新の一次資料を確認する。

## COMPLETE判定

7章すべてについて次を確認した。

- 学習目標と本文の射程が一致している。
- 定義だけでなく、仕組み、境界、失敗条件、実務上の判断点を含む。
- Markdown本文の番号付き項目とRSVP JSONのチャンク本文が一致する。
- RSVPチャンクは24文字以内である。
- MarkdownとJSONの出典が一致する。
- Learn HTMLはRSVPの単純連結ではなく、同じ知識範囲を音声向けに再構成している。
- Learn HTMLは本文を初期DOMに保持し、既存のWeb Speech APIプレイヤー構造を継承している。

以上から、本編7章を `COMPLETE v0.1` と判定する。
