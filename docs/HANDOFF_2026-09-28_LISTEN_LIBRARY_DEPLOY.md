# HANDOFF — RSVP / Listen / Learn / Vercel運用

作成日: 2026-09-28 JST  
対象Repository: `Josh-Temple/rsvp-learning`  
本資料作成直前にfresh readしたmain: `f557536d7399e0d3ae4b2b26010acace0f06b964`

> 重要: このSHAは引き継ぎ時点の記録であり、再開時の現在状態ではありません。作業開始時に必ずmain、関係ファイル、GitHub Actions、Vercel Productionをfresh readしてください。

## 1. 今回の目的と到達点

このセッションでは、主に次を進めた。

1. Vercel Productionの自動デプロイを安定化する。
2. デプロイ頻度を6時間ごとにする。
3. Listenモードを本番サイトから使えるようにする。
4. RSVPのLibrary一覧内からListen一覧へ切り替えられるようにする。
5. Listenの実コンテンツを初めて登録する。

Listenの入口・一覧・HTML仕様・読み上げ基盤・初回コンテンツ3本まで実装済み。  
GitHub Actionsのテストは、Listen実装後のcommit `c2123da2ef0ab8e9c81370bdc55b5f711f752acb` でPASS。  
その後、別作業でmainが `f557536...` まで進み、その最新mainのTestもPASSしている。

## 2. 正本・重要仕様

Listen / Learnの生成ルールはProject Sourceの次を正本とする。

- `Listen_Learn_HTML生成ルール_v0.1`
- Google Docs: https://docs.google.com/document/d/1JrAJtopsmhI5GagF4kzDaTLZHHdVAO4sPWmU_44xjoo

Repository内の実装仕様:

- `docs/LISTEN_HTML_FORMAT.md`
- `docs/LEARN_HTML_FORMAT.md`
- `docs/LESSON_FORMAT.md`
- `docs/LEARN_READALOUD_PILOT_20260927.md`

優先順位は、今回のユーザー個別指示 > Project Source > Repository内仕様。

## 3. Listen / Learn / RSVP の役割

- RSVP: 高速視覚学習。短い意味単位を順番に表示。
- Learn: 教材・概念解説を耳で体系的に学ぶ。COMPLETE教材から生成。
- Listen: ニュース、調査結果、レポート、作業結果、資料要約などを耳で追う。

Listen / Learnとも、現行の標準読み上げ経路はWeb Speech API。

- `window.speechSynthesis`
- `SpeechSynthesisUtterance`
- 再生 / 一時停止 / 停止
- 日本語音声選択
- 0.7〜4.0倍速
- 読み上げ位置ハイライト

Android Chrome前面利用では読み上げ可能。バックグラウンド再生は保証しない。

## 4. Listenの共通Library統合

今回、RSVPのLibraryオーバーレイ上部に、RSVP / Listenのモード切替を実装した。

主要commit:

- `92fa17d...` Add RSVP and Listen switch to library
- `0ef0808...` Render Listen catalog inside RSVP library
- `8944ab0...` Style Listen mode in library
- `a0ce2ee...` Return Listen page to shared library
- `c7ce119...` Refresh PWA cache for shared Listen library
- `74e11f1...` Test shared RSVP and Listen library navigation

主要ファイル:

- `index.html`
- `app.js`
- `styles.css`
- `listen/index.html`
- `listen/listen.js`
- `listen/listen.css`
- `listen/index.json`
- `sw.js`
- `tests/listen-library.test.mjs`

Libraryでは、文字を増やさず、RSVPマークとヘッドホンアイコンで切替する。

Listen側は `listen/index.json` を正本として日付順に表示する。  
Listen独立一覧 `/listen/` から戻る場合は、`../index.html?library=listen` で共通LibraryのListen状態へ戻る。

## 5. 現在のListenコンテンツ

`listen/index.json` には現在3件登録済み。

1. `2026-09-28-rsvp-learn-listen-roles`
   - タイトル: RSVP・Learn・Listenの役割分担
   - category: report
   - path: `./reports/2026-09-28-rsvp-learn-listen-roles.html`

2. `2026-09-28-rsvp-review-current-state`
   - タイトル: rsvp-learningレビューから見えた現在地
   - category: report
   - path: `./reports/2026-09-28-rsvp-review-current-state.html`

3. `2026-09-28-vercel-deploy-recovery`
   - タイトル: Vercel自動デプロイ障害の原因と復旧
   - category: report
   - path: `./reports/2026-09-28-vercel-deploy-recovery.html`

追加commit:

- `594fc05...` Add Listen report on RSVP Learn Listen roles
- `7b288f5...` Add Listen report on RSVP repository review
- `d345034...` Add Listen report on Vercel deploy recovery
- `fc233da...` Register first Listen reports
- `c2123da...` Validate registered Listen HTML pages

`tests/listen-html.test.mjs` で、登録済みListen HTMLについて最低限次を検査する。

- `lang="ja"`
- 初期HTMLにarticle / paragraph本文が存在
- Web Speech API
- `SpeechSynthesisUtterance`
- 速度0.7〜4.0
- 共通Libraryへの戻り
- 出典セクション

## 6. Vercel Production運用

Production URL:

- https://rsvp-learning-kappa.vercel.app/

Vercel Project:

- Project: `rsvp-learning`
- Project ID: `prj_7yYGl5D3Q7UwQgQuXaGmOYLkTzbu`
- Team ID: `team_imvRFeaSa1LmNpMJkFiMwNmB`
- Team slug: `josh-temples-projects`

GitHub Actions secret:

- `VERCEL_TOKEN`
- token値はチャットやリポジトリへ出さない。

### 自動デプロイworkflow

`.github/workflows/vercel-scheduled-deploy.yml`

現在のschedule:

```yaml
schedule:
  - cron: "0 */6 * * *"
workflow_dispatch:
```

UTC基準のため、JSTでは概ね:

- 03:00
- 09:00
- 15:00
- 21:00

6時間ごと。

### 自動デプロイの現在方式

Vercel CLIは使用しない。  
Vercel REST API `POST /v13/deployments` をGitHub Actionsから直接呼ぶ。

理由:

1. 初期workflowは `npm ci` を使っていたが、repositoryに `package-lock.json` がなく失敗。
2. `npm install --ignore-scripts` へ変更後、テストまでは通過。
3. Vercel CLIの `vercel pull` がProject Settings取得で失敗。
4. tokenをREST APIで検証すると対象ProjectへHTTP 200でアクセス可能だった。
5. CLIへscope / project IDを明示しても `User not found (404)`。
6. REST APIのDeployment作成へ切替。
7. 最初は `withLatestCommit` が不正でHTTP 400。
8. その項目を外し、Production deploymentの作成→READYまで成功。

workflowは以下を行う。

1. `vercel-production` tagと `GITHUB_SHA` を比較。
2. 同一ならデプロイしない。
3. `VERCEL_TOKEN` の存在確認。
4. Vercel Project APIへHTTP 200 preflight。
5. `npm install --ignore-scripts`
6. `npm run check`
7. Vercel REST APIでProduction deployment作成。
8. READYまでpoll。
9. 成功したcommitへ `vercel-production` tagをforce更新。

## 7. Productionで確認済みの事実

少なくとも手動相当のGitHub Actions実行からProduction deploymentがREADYになった実績がある。

成功した代表deployment:

- Deployment ID: `dpl_DjFa19eodkeg89aXq42N4WYoe8Dt`
- commit: `a052e733f252e989fe6868d59bf53dce06fb129a`
- target: production
- state: READY

その後、さらにProduction READY実績あり:

- Deployment ID: `dpl_4qoHUMFbzVjdmANDAHTQJHKvbJLz`
- commit: `b215e2c5ac31a1a78f5d89a1f91f6260237e933b`
- target: production
- state: READY

つまり、「自動化経路が一度もProductionへ到達していない」という状態からは脱している。

ただし、この引き継ぎ作成時点の最新main `f557536...` は上記Production commitより新しい。再開時は必ず最新Productionとmainの差をfresh readすること。

## 8. テスト状況

Listen実装時:

- `c2123da2ef0ab8e9c81370bdc55b5f711f752acb`
- GitHub Actions Test: PASS

本資料作成直前の最新main:

- `f557536d7399e0d3ae4b2b26010acace0f06b964`
- commit message: `Deepen representative lessons and add content quality standard`
- GitHub Actions Test run `36433869779`: PASS

この最新commitはListen作業後の別作業なので、Listen実装だけを現在状態として扱わず、必ず最新mainを読むこと。

## 9. 重要な運用上の注意

- Vercel側のGit push自動デプロイは `vercel.json` の `git.deploymentEnabled=false` で停止している前提だったが、再開時はファイルをfresh readして確認する。
- Production反映は6時間ごとのGitHub Actionsを基本とする。
- 「今すぐ反映」が必要なら `workflow_dispatch` を使う。
- Vercel画面のRedeployは古いcommitを再利用する可能性があるため、最新mainを出したい場合はGitHub Actions経路を優先する。
- tokenをチャットへ貼らせない。
- `vercel-production` tagは「最後に成功したProduction commit」を表す。
- Preview deploymentとProduction deploymentを混同しない。
- Listen HTML追加時は必ず `listen/index.json` へ登録し、validationを通す。

## 10. 次にやること

優先順:

### A. 最新Production反映確認

再開時に:

1. mainをfresh read。
2. 最新 `vercel-production` tagをfresh read。
3. Vercelの最新Production deploymentを確認。
4. mainとProductionが一致していなければ、次回scheduled実行を待つか、必要ならworkflow_dispatch。
5. Productionで共通Library→Listen→3件表示→各HTML表示を確認。

### B. Android実機でListenを使う

3本のうち少なくとも1本をAndroid Chromeで実際に聞き、次を確認する。

- 再生開始
- 一時停止 / 再開
- 停止
- 日本語音声切替
- 1倍前後と高速側
- 段落切替
- スクロール追従
- 一覧へ戻る
- 聞き取りやすさ
- 1本の長さ
- 出典部分が読み上げノイズになっていないか

Project Sourceでは、初期運用として数本をAndroid Chromeで実際に評価し、聞き取りやすさ、情報量、長さ、章切替、要約頻度、出典ノイズを確認することを求めている。

### C. Listen HTMLの重複コード整理

現在の初回3本は各HTML内に読み上げJS/CSSを持つ単一HTMLとして実装している。これはProject Sourceの「原則単一HTML」と整合する一方、同じプレイヤーコードが重複している。

実使用確認後、必要なら:

- 単一HTMLを維持する
- 共通CSS/JSへ寄せる

のどちらが運用上良いか判断する。先に複雑化しない。

### D. Listenコンテンツ拡充

今後、ニュース・調査結果・プロジェクトレビューなどをListen化する。  
新しいListen HTML生成時は必ずProject Sourceと `docs/LISTEN_HTML_FORMAT.md` を読む。

## 11. 再開時の最初のプロンプト例

```text
Josh-Temple/rsvp-learning の作業を続けてください。

最初に以下をfresh readしてください。

- docs/HANDOFF_2026-09-28_LISTEN_LIBRARY_DEPLOY.md
- 現在のmain SHA
- listen/index.json
- index.html
- app.js
- docs/LISTEN_HTML_FORMAT.md
- .github/workflows/vercel-scheduled-deploy.yml
- 最新のGitHub Actions Test
- 最新のVercel Production deployment

過去チャットや引き継ぎ資料内のSHAを現在状態として扱わず、必ずfresh readしてください。

その後、Listen共通Libraryと3本のListenコンテンツがProductionへ反映されているか確認し、未反映なら安全に反映してください。
```

## 12. 現時点の判断

Listenは「入口だけ」の状態を抜け、実コンテンツ3本まで登録済み。  
共通LibraryからRSVP / Listenを切り替えられる構造も実装済み。  
Vercel自動デプロイも、CLIではなくREST API経路でProduction READY実績ができた。

次の主要フェーズは、新規機能追加よりも、Production反映確認とAndroid実機でのListen使用感評価。その結果をもとに、Listen文章・プレイヤー・一覧UIを必要な範囲だけ調整する。
