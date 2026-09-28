# 情報セキュリティ 内容深掘りレビュー — 2026-09-29

基点: main `ff0748aff7bc0b8cb1dc78e2e9f595719ad9cf2a`

## 結論

2026-09-29の全COMPLETE教材レビューで、情報セキュリティ本編7章はLearn本文が約587〜698字に集中し、他の完成教材より系統的に短かった。

文字数を揃えること自体を目的にせず、`docs/CONTENT_QUALITY_STANDARD.md` に従い、仕組み、具体例、境界条件、関連概念、変更時の見直しを補強した。

## 対象7章

| lesson | Learn改稿前 | Learn改稿後 | RSVP chunks |
|---|---:|---:|---:|
| `security-cia-risk` | 698字 | 1228字 | 49 |
| `security-cryptography-hash-signature` | 697字 | 1175字 | 48 |
| `security-authentication-access-control` | 634字 | 1182字 | 48 |
| `security-network-endpoint-defense` | 587字 | 1150字 | 48 |
| `security-vulnerability-secure-development` | 618字 | 1266字 | 48 |
| `security-incident-response-recovery` | 672字 | 1106字 | 48 |
| `security-governance-supply-chain` | 645字 | 1069字 | 48 |

## 主な改善点

- CIAとリスク: 資産・依存関係、予防・検知・復旧、残存リスク、再評価を追加。
- 暗号: 共通鍵・公開鍵、パスワード保存、署名の境界、鍵ライフサイクルを追加。
- 認証・認可: 本人確認との区別、権限モデル、セッション、権限ライフサイクルを追加。
- ネットワーク・端末: 分離の目的、外向き通信、DNS、端末状態、持出し、封じ込めを追加。
- 安全な開発: 脅威モデリング、SAST・DAST・SCA、開発経路、優先順位、根本原因分析を追加。
- インシデント: 平時準備、分析、証拠保全、外部連絡、段階復旧、演習を追加。
- ガバナンス・供給網: 例外管理、指標、契約前確認、集中リスク、終了・移行、監査の限界を追加。

## 一次資料のfresh確認

2026-09-29時点でNIST CSF 2.0、NIST SP 800-63B-4、NIST SP 800-207、NIST SP 800-61 Rev. 3、NIST SP 1305、OWASP Top 10:2025、NIST SP 800-218 Version 1.1を再確認した。

NIST SP 800-218はVersion 1.1が最終版。Rev.1 / Version 1.2はInitial Public Draftのため、本文の正本根拠には最終版1.1を使用した。

## 同期検証

全7章について生成時に次を確認した。

- Markdown番号付き本文とRSVP JSON `chunks[].text` が一致
- MarkdownとJSONの出典が一致
- RSVPチャンクは24文字以内
- LearnはRSVPチャンクの単純連結ではなく、同じ知識範囲を音声向けに再構成
- Learn本文は初期DOMに存在
- 既存Web Speech APIプレイヤー構造を維持

各章のstatusは `COMPLETE v0.1` を維持する。
