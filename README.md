# rsvp-learning

ChatGPT等で調査した内容を、RSVP（Rapid Serial Visual Presentation）向けの短い意味単位へ再構成し、ブラウザで順番に再生して学習するための個人用プロジェクトです。

## App

- PWA対応（ホーム画面追加・standalone表示）
- オフライン時も直近の教材を再生可能
- ライト / ダークモード
- 教材選択
- RSVP再生 / 一時停止
- 1チャンク・5チャンク戻る
- 1チャンク進む
- 再生速度 0.6〜10.0倍
- 速度と直近教材を端末に保存
- JSON Schemaによる教材仕様の固定

UIは個人利用を前提に、説明文を画面から外し、教材・本文・進捗・操作だけを残しています。

## 教材生成フロー

日本語の形態素解析はアプリ内で行いません。教材を作る段階で、内容レビューとRSVP分割を分離します。

```
調査・学習テーマ
  ↓
人間が読める教材原稿
  ↓
内容レビュー
  ↓
RSVPチャンク化
  ↓
教材JSON
  ↓
Webプレイヤー
```

教材原稿の生成には `prompts/lesson-draft.md`、レビュー済み原稿のJSON化には `prompts/lesson-generation.md` を使います。

教材JSONの仕様は `schema/lesson.schema.json`、分割ルールは `docs/LESSON_FORMAT.md` を正本とします。

## 教材

- `要件定義の基礎`
- `RSVP学習の使い方`

## ローカル実行

```bash
python -m http.server 8000
```

`http://localhost:8000` を開きます。Service WorkerはHTTPSまたはlocalhostで有効になります。

## 教材の追加

1. `prompts/lesson-draft.md` で教材原稿を作成
2. 原稿の内容をレビュー
3. `prompts/lesson-generation.md` で RSVP JSON に変換
4. `lessons/<topic>/` に原稿とJSONを保存
5. `lessons/index.json` にJSONを登録
6. 実際に再生し、チャンク長と `duration_multiplier` を調整

## 公開について

教材には調査資料由来の情報が入るため、private repositoryでの個人利用を前提とします。
