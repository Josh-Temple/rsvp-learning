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

### 長い一覧・本文での操作

- RSVP/LEARNのコース一覧は初期状態で折りたたみ、コース名をタップして章一覧を開きます。Learnでは教材名の検索もできます。
- RSVPは選択済みの章とチャンク位置を端末内に保存し、再訪時に復元します。
- Learnのコース連続読み上げは、再生中の章・段落位置を端末内に保存します。Learn一覧の「続きから再開」から再開できます（完走後は表示しません）。
- Learn本文には見出しジャンプを置き、再生ボタンはスクロール中も画面上部に表示します。音声・速度の設定は「設定」に収納します。
- Listen一覧は最新日付を開き、過去の日付を折りたたみます。
- 再生位置はブラウザの localStorage に保存されます。端末間の同期・ブラウザデータ消去後の復元には対応しません。



## Learn 読み上げモード

RSVPと同じ教材群から、耳で連続して学ぶLearn版を試験導入しています。

完成条件を満たすLessonには `lessons/index.json` の `learn_path` からLearn HTMLを開けます。教材statusの正本と完成条件は `docs/LESSON_FORMAT.md` にあります。

- Learn本文は教材Markdownから音声向けの連続文章へ再構成します。
- 教材ごとの静的HTMLは `learn/` に置き、共通の読み上げJavaScript/CSSは `learn/learn.js` と `learn/learn.css` を使います。
- Web Speech APIによる再生 / 一時停止 / 停止 / 速度変更 / 日本語音声選択 / 段落ハイライトに対応します。
- RSVP画面のLearnリンクはカタログの `learn_path` を使います。

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
- 日次論文ワークフロー: `docs/DAILY_PAPER_LISTEN_WORKFLOW.md`
- 日次論文実行プロンプト: `prompts/daily-paper-listen.md`
- Huxe Project Instructions例: `prompts/huxe-project-instructions.md`
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
教材JSONとMarkdownを同期・validation
  ↓
完成条件を確認して `COMPLETE v0.1` に更新
  ↓
Courseへ登録
  ↓
Learn HTML生成
  ↓
Webプレイヤー
```

教材原稿の生成には `prompts/lesson-draft.md`、レビュー済み原稿のJSON化には `prompts/lesson-generation.md` を使います。

教材JSONの仕様は `schema/lesson.schema.json`、Lesson一覧とstatusの仕様は `schema/lesson-catalog.schema.json`、分割と完成条件は `docs/LESSON_FORMAT.md` を正本とします。

## ローカル実行

```bash
python -m http.server 8000
```

`http://localhost:8000` を開きます。Service WorkerはHTTPSまたはlocalhostで有効になります。

## 公開について

公開先は GitHub Pages の [RSVP Learning](https://josh-temple.github.io/rsvp-learning/) です。

- 公開元は `main` ブランチの `/(root)` です。
- 静的HTML・CSS・JavaScript・教材JSONをそのまま配信します。サーバー実行環境は不要です。
- リンク・PWAの起動URL・Service Workerキャッシュは公開先のサブパスに対応します。
- 更新前に `npm run check` でテストし、公開後は RSVP / Learn / Listen / PWA を実機確認します。
- 学習履歴と再生位置はブラウザの `localStorage` に保存しています。**VercelからGitHub Pagesへのドメイン変更では自動移行されず、移行先では初期状態になります。** 元のVercelサイトの履歴は、そのサイトのブラウザ保存領域に残ります（ブラウザデータを削除しない限り）。
- Web Speech APIによる音声読み上げはAndroid Chromeの前面利用を前提とし、バックグラウンドでの継続再生は保証しません。
