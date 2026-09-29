# ヘルスケア・介護DX 本編レビュー — 2026-09-29

基点: main `702764095bf14bb247a58a72913be04dad0d9c3b`

## 結論

既存の `healthcare-care-dx-overview` は `SEED / 概要のみ` の入口として残し、本編7章を `COMPLETE v0.1` として追加した。

追加章:

1. `healthcare-care-workflow-continuity` — 介護業務フローと記録・連携・請求
2. `healthcare-care-data-sharing` — 医療・介護データ連携と介護情報基盤
3. `healthcare-care-privacy-security` — 医療・介護データの個人情報と安全管理
4. `healthcare-care-technology-adoption` — 介護テクノロジー導入と現場定着
5. `healthcare-care-ai-oversight` — 介護現場のAI支援とHuman Oversight
6. `healthcare-care-productivity-quality` — 生産性向上とケア品質の同時評価
7. `healthcare-care-policy-fee-change` — 制度・介護報酬改定とシステム変更

## 章構成

医療・介護DXを一般的なIT導入論へせず、介護現場で制度・業務・データ・安全・テクノロジーをつなげて運用する構成にした。

1. 介護業務フローと記録・連携・請求
2. 医療・介護データ連携と介護情報基盤
3. 医療・介護データの個人情報と安全管理
4. 介護テクノロジー導入と現場定着
5. 介護現場のAI支援とHuman Oversight
6. 生産性向上とケア品質の同時評価
7. 制度・介護報酬改定とシステム変更

## 一次資料・公式資料のfresh確認

2026-09-29時点で次を確認した。

- 厚生労働省「介護情報基盤について」
  - 2026-08-31に介護保険資格確認等WEBサービス連携API標準仕様書 第1.0版を公開
  - 2026-04-01以降、標準化対応済み市町村から順次活用開始
  - 2028-04-01までに全市町村で活用開始を目指す
  - 介護事業所向け情報安全管理の手引きも公開
- 個人情報保護委員会・厚生労働省
  - 医療・介護関係事業者の個人情報取扱いガイダンスは2026-04改正
- 厚生労働省
  - 医療情報システムの安全管理に関するガイドライン 第7.0版（2026-06）
  - Q&Aは2026-09版
- 厚生労働省・経済産業省
  - 介護テクノロジー利用の重点分野は2025年度以降9分野16項目
- 厚生労働省
  - 2026年度も介護テクノロジー等による生産性向上の効果測定を実施
- 総務省・経済産業省
  - AI事業者ガイドライン 第1.2版（2026-03-31）
- 厚生労働省
  - 令和8年度介護報酬改定の告示・通知・様式・Q&Aを公開

## 内容品質

既存の情報セキュリティ、AIガバナンス、公共DXと重複しすぎないよう、介護現場固有の運用へ寄せた。

特に次の境界を明示した。

- 記録削減 ≠ 情報品質の低下
- データ連携可能 ≠ その目的で利用可能
- クラウド・委託利用 ≠ 安全管理責任の消滅
- 介護テクノロジー導入 ≠ 現場定着
- AI出力 ≠ 確認済み事実
- Human Oversight ≠ 形式的な人間承認
- 時間短縮 ≠ 生産性向上の完成
- 報酬改定対応 ≠ システム改修だけ
- 施行日到達 ≠ 改定対応の終了

## 同期検証

- `healthcare-care-workflow-continuity`: Learn 1050字 / RSVP 48 chunks / max 20文字
- `healthcare-care-data-sharing`: Learn 1024字 / RSVP 48 chunks / max 20文字
- `healthcare-care-privacy-security`: Learn 1066字 / RSVP 48 chunks / max 18文字
- `healthcare-care-technology-adoption`: Learn 1087字 / RSVP 48 chunks / max 17文字
- `healthcare-care-ai-oversight`: Learn 1035字 / RSVP 48 chunks / max 24文字
- `healthcare-care-productivity-quality`: Learn 973字 / RSVP 48 chunks / max 18文字
- `healthcare-care-policy-fee-change`: Learn 995字 / RSVP 48 chunks / max 18文字

生成時に全7章で次を確認した。

- Markdown番号付き本文とRSVP JSON `chunks[].text` が一致
- MarkdownとJSONの出典が一致
- RSVPチャンクは24文字以内
- LearnはRSVPチャンクの単純連結ではなく音声向けに再構成
- Learn本文は初期DOMに存在
- 既存Web Speech APIプレイヤー構造を維持

以上から本編7章を `COMPLETE v0.1` と判定する。
