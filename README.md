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

## 設計

日本語の形態素解析はアプリ内で行いません。教材を作る段階で、意味のまとまりごとに `chunks` を確定します。

```
調査
  ↓
学習向けに再構成
  ↓
RSVPチャンク化
  ↓
教材JSON
  ↓
Webプレイヤー
```

教材JSONの仕様は `schema/lesson.schema.json`、作成ルールは `docs/LESSON_FORMAT.md` を参照してください。

## ローカル実行

ブラウザの `file://` では教材JSONの `fetch` が制限されるため、簡単なHTTPサーバーを使います。

Pythonがある場合:

```bash
python -m http.server 8000
```

その後、ブラウザで `http://localhost:8000` を開きます。

## 教材の追加

1. `prompts/lesson-generation.md` を使って教材JSONを作成
2. `lessons/<topic>/` に保存
3. `lessons/index.json` に登録
4. 実際に再生し、チャンク長と `duration_multiplier` を調整

## 公開について

教材には調査資料由来の情報が入るため、当面はprivate repositoryでの個人利用を前提とします。アプリ本体を将来公開する場合は、教材データと分離する構成を検討します。
