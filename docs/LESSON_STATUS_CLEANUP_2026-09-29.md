# Lesson status整合性レビュー — 2026-09-29

基点: main `dd1ce7cbe305de299f8d2e8cd7c0d77510b060ce`

## 目的

catalogでstatusが未設定だった `requirements-basics` と `rsvp-basics` を現行教材フォーマットへ移行し、今後statusなしLessonが追加されないようschemaを強化する。

## 対応

- `requirements-basics`
  - 現行の番号付きMarkdown本文へ再構成
  - RSVPを48 chunksへ整理
  - 最大17文字
  - 要件定義コースの入口として後続章との重複を抑えた
  - Learn HTMLを追加
  - `COMPLETE v0.1` を付与
- `rsvp-basics`
  - Markdown正本を新規追加
  - 既存15 chunksの知識範囲を維持
  - Learn HTMLを追加
  - `COMPLETE v0.1` を付与
- `lesson-catalog.schema.json`
  - 各Lessonで `status` を必須化
- catalog schema test
  - statusなしentryがinvalidになることを追加確認

## 結果

catalogは121件すべてstatus付きとなった。

- COMPLETE v0.1: 104
- SEED / 概要のみ: 17
- statusなし: 0

SEED 17件は各コースのoverviewであり、本編未作成を意味する残件ではない。
