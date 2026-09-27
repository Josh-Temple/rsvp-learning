# rsvp-learning

ChatGPT等で調査した内容を、RSVP（Rapid Serial Visual Presentation）向けの短い意味単位へ再構成し、ブラウザで順番に再生して学習するための個人用プロジェクトです。

## App

- PWA対応（ホーム画面追加・standalone表示）
- ライト / ダークモード
- Course / Chapter 構造
- Chapter単独再生
- Course全部通し再生
- Chapter順のランダム再生
- 前後Chapter移動
- 3本バーによる4段階の習熟度（0〜3）
- 再生回数・完走回数・最終学習日時を端末内に保存
- RSVP再生 / 一時停止
- 1チャンク・5チャンク戻る
- 1チャンク進む
- 再生速度 0.6〜10.0倍
- 速度・直近教材を端末に保存
- JSON Schemaによる教材仕様の固定

UIは個人利用を前提に、Playerは本文・進捗・操作だけに絞り、教材選択と再生モードはLibraryへ分離しています。

## Learn 読み上げモード

RSVPと同じ教材群から、耳で連続して学ぶLearn版を試験導入しています。

現在のパイロット:
- `learn/api-authentication-authorization.html`
- RSVP の「認証と認可」チャプターから `LEARN` で遷移
- Web Speech APIによるページ内読み上げ
- 再生 / 一時停止 / 停止 / 速度変更 / 日本語音声選択
- 読み上げ中の段落ハイライト

Android実機ではページ内読み上げは動作しましたが、Chromeを前面で開いていないと停止します。Chrome標準の「このページを読み上げ」は同端末のWikipediaでは利用できる一方、このLearnページでは表示されなかったため、必須経路にはしていません。

検証結果と設計判断は `docs/LEARN_READALOUD_PILOT_20260927.md` に記録しています。

新しいLearn HTMLを生成するときは、次を正本として使います。

- 実装仕様: `docs/LEARN_HTML_FORMAT.md`
- 生成プロンプト: `prompts/learn-generation.md`
- 動作例: `learn/api-authentication-authorization.html`

## Listen モード

ニュース、調査結果、レポート、資料要約など、日常的に耳から取り入れる内容はListenとして分離します。

RSVP画面のヘッドホンアイコンから `listen/` の一覧へ移動します。Listen一覧は `listen/index.json` を日付降順で表示し、各項目から単一HTMLの読み上げページを開きます。

- 実装仕様: `docs/LISTEN_HTML_FORMAT.md`
- 生成プロンプト: `prompts/listen-generation.md`
- 一覧: `listen/index.json`
- 入口: `listen/index.html`

Listen HTMLはWeb Speech APIによる0.7〜4.0倍速の連続読み上げを基本とします。現行方式ではAndroid Chromeのバックグラウンド再生は保証しません。

## 教材構造

`lessons/index.json` がLessonのメタデータ、`courses/index.json` がCourseとChapter順を管理します。

CourseはLesson IDを並べるだけの薄い構造です。

```json
{
  "id": "requirements",
  "title": "要件定義",
  "chapters": [
    "requirements-basics",
    "as-is-to-be",
    "business-requirements"
  ]
}
```

ランダム再生はチャンクを崩さず、Chapter順だけを開始時にシャッフルします。

## 学習履歴

学習履歴は教材JSONから分離し、ブラウザの `localStorage` に保存します。

Lessonごとに次を保持します。

- `mastery`: 0〜3
- `plays`: 再生開始回数
- `completions`: 最後まで再生した回数
- `lastPlayedAt`: 最終学習日時

習熟度は自動判定せず、本人が3本バーで設定します。

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
Courseへ登録
  ↓
Webプレイヤー
```

教材原稿の生成には `prompts/lesson-draft.md`、レビュー済み原稿のJSON化には `prompts/lesson-generation.md` を使います。

教材JSONの仕様は `schema/lesson.schema.json`、分割ルールは `docs/LESSON_FORMAT.md` を正本とします。

## ローカル実行

```bash
python -m http.server 8000
```

`http://localhost:8000` を開きます。Service WorkerはHTTPSまたはlocalhostで有効になります。

## 公開について

教材には調査資料由来の情報が入るため、private repositoryでの個人利用を前提とします。
