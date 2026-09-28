# 公共DX・GovTech 本編レビュー — 2026-09-29

基点: main `7812fe32082df760b5f8ddfe5488b83dac850ea7`

## 結論

既存の `public-dx-govtech-overview` は `SEED / 概要のみ` の入口として残し、本編7章を `COMPLETE v0.1` として追加した。

追加章:

1. `public-dx-service-design` — 行政サービス設計と利用者中心
2. `public-dx-procurement-vendor` — 行政IT調達と発注者・事業者の役割
3. `public-dx-standardization-commonization` — 標準化・共通化と個別最適の境界
4. `public-dx-data-interoperability` — 行政データ連携と相互運用性
5. `public-dx-cloud-operations` — ガバメントクラウドと責任分界・運用
6. `public-dx-accessibility-inclusion` — アクセシビリティとデジタル包摂
7. `public-dx-change-operations` — 制度・仕様変更と継続運用

## 章構成

公共DXを「行政サービスをオンライン化すること」に狭めず、利用者価値、行政固有の制度・調達、標準化、相互運用性、クラウド運用、アクセシビリティ、制度改正への追随を一連の運用能力として構成した。

1. 行政サービス設計と利用者中心
2. 行政IT調達と発注者・事業者の役割
3. 標準化・共通化と個別最適の境界
4. 行政データ連携と相互運用性
5. ガバメントクラウドと責任分界・運用
6. アクセシビリティとデジタル包摂
7. 制度・仕様変更と継続運用

## 一次資料・公式資料のfresh確認

2026-09-29時点で次を確認した。

- デジタル社会の実現に向けた重点計画
  - 2026-07-21閣議決定
- デジタル庁 サービスデザイン
  - 2026-07-09更新
- デジタル庁 調達手続マニュアル・雛形等
  - 2026-09-16更新
- デジタルマーケットプレイス（DMP）
  - 2026-07-08更新
- 地方公共団体の基幹業務システムの統一・標準化
  - 2026-08-20更新
- 政府相互運用性フレームワーク（GIF）
  - 2026-03-24更新
- 地方公共団体情報システムにおける文字の標準化
  - 2026-08-18更新
- デジタル社会推進標準ガイドライン
  - ページ最終更新 2026-09-01
  - DS-100 / DS-110 / DS-120 は2026-06-12改定版が掲載
- ウェブアクセシビリティ導入ガイドブック
  - 2025-10-16更新
- 地方公共団体の基幹業務等システムの統一・標準化に関する関係省庁会議（第6回）
  - 制度改正等に対応した標準仕様書改定を扱う

## 内容品質

既存のクラウド、情報セキュリティ、業務分析教材との重複を避け、公共領域固有の判断へ寄せた。

特に次の境界を明示した。

- 行政DX ≠ 申請画面のオンライン化
- 標準化 ≠ 画一化
- 標準準拠 ≠ 使いやすさ
- データ形式一致 ≠ 意味一致
- 技術的に連携可能 ≠ 法的・業務的に利用可能
- クラウド移行 ≠ 運用最適化
- 自動アクセシビリティ検査PASS ≠ 実利用可能
- 制度改正対応 ≠ システム改修だけ
- 施行日対応完了 ≠ 運用上の安定

## 同期検証

- `public-dx-service-design`: Learn 1083字 / RSVP 48 chunks / max 19文字
- `public-dx-procurement-vendor`: Learn 1140字 / RSVP 48 chunks / max 21文字
- `public-dx-standardization-commonization`: Learn 1029字 / RSVP 48 chunks / max 21文字
- `public-dx-data-interoperability`: Learn 1110字 / RSVP 48 chunks / max 20文字
- `public-dx-cloud-operations`: Learn 1095字 / RSVP 48 chunks / max 24文字
- `public-dx-accessibility-inclusion`: Learn 1137字 / RSVP 48 chunks / max 21文字
- `public-dx-change-operations`: Learn 1071字 / RSVP 48 chunks / max 19文字

生成時に全7章で次を確認した。

- Markdown番号付き本文とRSVP JSON `chunks[].text` が一致
- MarkdownとJSONの出典が一致
- RSVPチャンクは24文字以内
- LearnはRSVPチャンクの単純連結ではなく音声向けに再構成
- Learn本文は初期DOMに存在
- 既存Web Speech APIプレイヤー構造を維持

以上から本編7章を `COMPLETE v0.1` と判定する。
