# rsvp-learning

ChatGPT等で調査した内容を、RSVP（Rapid Serial Visual Presentation）向けの短い意味単位へ再構成し、ブラウザで順番に再生して学習するための個人用プロジェクトです。

## MVP

- 教材一覧から選択
- RSVP再生 / 一時停止
- 1チャンク・5チャンク戻る
- 1チャンク進む
- 再生速度 0.6〜2.0倍
- 教材ごとの表示時間調整
- 出典表示
- キーボード操作
- JSON Schemaによる教材仕様の固定

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

- `要件定義の基礎` — 最初の実用教材。業務要件、システム要件、機能・非機能要件、検証可能性、行政実務との共通点を扱います。
- `RSVP学習の使い方` — プレイヤー操作確認用の短いサンプル教材。

## ローカル実行

ブラウザの `file://` では教材JSONの `fetch` が制限されるため、簡単なHTTPサーバーを使います。

Pythonがある場合:

```bash
python -m http.server 8000
```

その後、ブラウザで `http://localhost:8000` を開きます。

## 教材の追加

1. `prompts/lesson-draft.md` で教材原稿を作成
2. 原稿の内容をレビュー
3. `prompts/lesson-generation.md` で RSVP JSON に変換
4. `lessons/<topic>/` に原稿とJSONを保存
5. `lessons/index.json` にJSONを登録
6. 実際に再生し、チャンク長と `duration_multiplier` を調整

## 公開について

教材には調査資料由来の情報が入るため、当面はprivate repositoryでの個人利用を前提とします。アプリ本体を将来公開する場合は、教材データと分離する構成を検討します。
