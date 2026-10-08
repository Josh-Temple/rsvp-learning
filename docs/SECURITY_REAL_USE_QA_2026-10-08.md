# 情報セキュリティ教材 — 実利用・配信状態QA（Worker D）

検証日: 2026-10-08 JST  
担当: Worker D（実利用・配信状態。教材内容の編集なし）  
指示書: Library `libfile_8eee5d908a7081919d89db9f30fc4df6` の Section 6  
GitHub repository: `Josh-Temple/rsvp-learning`（private）  
検証時のmain（full SHA）: `2eb12f4847f204816fd9aa9c2b1fdc512805e380`  
総合判定: **PARTIAL_WITH_GAPS**（公開成果物のHTTP・静的検査は一部PASS。実ブラウザ/Android/Chrome標準読み上げはNOT_VERIFIED。Course連続再生の出典欠落は静的FAIL）

## 1. 証拠・実行環境の境界

- GitHub連携で `main`、open PR、`.github/workflows/pages.yml`、`learn/course-player.js`、`learn/learn.js`、`README.md`、Pagesビルドスクリプトをfresh read。open PRは #6 と #29（本作業では変更・mergeしない）。
- Vercel連携によるproduction URLのHTTP取得（2026-10-08 JST）。実際のHTML、JavaScript、JSONの内容を受信し確認。ただし接続アプリの代理取得であり、匿名の一般利用者としての実ブラウザ表示・操作と同一視しない。
- 実ブラウザ: ローカルのChromium起動は可能だが、当該実行環境からproductionドメインをDNS解決できず、本番画面への実アクセスは不可。端末サイズ390pxでのレンダリング・タッチ操作・スクリーンショットは **NOT_VERIFIED**。Android端末の操作・音声を観測していない。
- GitHub Actions: commitのcombined status一覧は空、GitHub連携のworkflow-runs取得も空（後者はPR起動run中心の限定的な取得）。**空結果はTest/Pagesの成功も失敗も示さない**。最新mainの全workflow一覧・Pages設定画面の確認はNOT_VERIFIED。`npm run check`の今回ローカル実行なし。
- このレポートの `PASS` は「記載の観測範囲だけ」を意味する。シミュレーションをAndroid実機検証と呼ばない。

## 2. Vercel production とGitHub main

| 項目 | 検証時の実結果 | 判定 |
|---|---|---|
| main | `2eb12f4847f204816fd9aa9c2b1fdc512805e380` | 確認済み |
| Vercel project | `rsvp-learning` / `prj_7yYGl5D3Q7UwQgQuXaGmOYLkTzbu` | 確認済み |
| production deployment | `dpl_5oVKvs97YhJw9EdEpre3vNweWHQC` / `READY` | API確認PASS |
| productionのGit SHA | `f14612253794e58e3ca565aab52d2281a12d74fd` | mainとは不一致（更新反映未確認） |
| production alias | `rsvp-learning-kappa.vercel.app` を上記deploymentに割当て | API確認PASS |
| 本番トップHTML | `https://rsvp-learning-kappa.vercel.app/` を連携経由でHTTP 200取得。RSVPの再生・一時停止・速度/章操作、Learn一覧とCourse連続再生用DOMを確認 | 静的PASS / 操作NOT_VERIFIED |
| 本番JS | `/app.js`、`/learn/learn.js`、`/learn/course-player.js`を各HTTP 200で取得 | 配信PASS / 実行NOT_VERIFIED |
| 本番カタログ | `/lessons/index.json` HTTP 200・JSON解析成功。対象 `security-risk-assessment` に `learn_path` あり | 部分PASS |
| `/courses/index.json` | 連携の安全判定で取得拒否。GitHubソース側のコード構造のみ確認 | NOT_VERIFIED |
| Chrome読み上げスロット | `/listen/chrome/001.html` をHTTP 200で取得 | 配信PASS / Chrome標準読み上げNOT_VERIFIED |
| 一般の匿名ブラウザからの到達性 | 連携の代理取得では証明できない | NOT_VERIFIED |

Vercelのproject設定ではSSO protectionが一部環境に有効。アクセス制御による拒否とアプリ不具合は区別する。READYやHTTP 200だけでは学習者の操作成功・聞きやすさを意味しない。

## 3. 代表操作QA（期待と観測）

| 確認操作 | 期待結果 | 実際に観測したこと | 判定 |
|---|---|---|---|
| Course選択、RSVP単章再生・一時停止・戻る/進む・速度変更 | 選択章の意味単位が順に表示され、状態と速度が反映される | トップHTMLに関連ボタン・速度スライダーのDOMあり、`/app.js` HTTP 200。クリック/視認性は未実施 | NOT_VERIFIED（静的構造PASS） |
| 候補7件を含む用語チャンク | 文字化け・不自然な境界がない | 現行GitHub JSONの `security-identity-proofing-authn-authz` に `Identity proofingに` → `も失敗があります。` が残存。画面表示の評価は未実施。他6件は本Dでは網羅再判定せずAへ委ねる | REVIEW |
| RSVPから単章Learnへ移動、本文/出典/戻り | 本文と出典が欠落せず、戻れる | 4パイロットのLearn HTMLを各HTTP 200取得。4/4で見出し・本文・出典リンク・RSVPへの戻りリンク・再生/一時停止/停止/速度/音声用DOMあり | 静的PASS / 操作NOT_VERIFIED |
| 単章Learn Web Speech API | 音声・速度を選べ、再生/一時停止/停止できる | `/learn/learn.js`配信200、DOMあり。音声出力イベントと実聴取なし | NOT_VERIFIED |
| Course I/III/IV 連続再生、章末→次章、最終章停止、前後移動、停止/速度変更後再開 | 音声状態・位置が正常に移り、最終章で停止する | `/learn/course-player.js`の該当処理を静的に確認。コース通し再生や実イベントは未操作 | NOT_VERIFIED |
| Course連続再生の出典表示 | 当該章の出典リンクを確認できる | **静的な欠落を確認**。後述 | FAIL（コード・DOM） |
| Android Chrome Web Speech API | 音声再生と制御 | 実機未接続 | **ANDROID_CHROME_NOT_VERIFIED** |
| Android Chrome標準「このページを読み上げ」 | Chrome機能から本文を読み上げられる | 実機未接続。Web Speech APIの結果と混同しない | NOT_VERIFIED |
| 390px / desktop / 画面OFF / バックグラウンド | 横欠け・操作重なりがなく、対応すると主張した動作が再現する | 対象本番ページへの実ブラウザアクセスなし | NOT_VERIFIED |

### 3.1 発見した静的FAIL: Course連続再生では出典が欠ける

4パイロットの各単章HTMLは `<article id="learn-article">` の **外側**に `<section class="sources">` を持つ。一方 `learn/course-player.js` の `parseArticle(html)` は `#learn-article` の `innerHTML` のみを返し、連続再生の `#learn-course-article` へ挿入する。この経路では出典セクションが転記されない。

- 4章の配信HTMLは各HTTP 200、出典リンク数は順に3/6/4/4。各章とも出典セクションはarticle外側。
- **確認したのはコード/HTML構造上の欠落**。実画面を操作して再現したと主張しない。
- 重大度: **P1**。利用者が音声連続再生中に主張の一次資料へ移れない。対処時は出典領域を安全に表示し、コース切替で前章の出典が残らないようにする。静的回帰テストとブラウザ検証が必要。
- DはEとの事前調整なしにA/B所有の教材、Learnテスト、playerコードを変更しない。独立したコード修正PRをEで割り当てる。

## 4. GitHub Pages: 状況変化・公開範囲の注意

- 現行 `.github/workflows/pages.yml` は **`push(main)` と `workflow_dispatch` の両方**で起動する。前Wave記録の「手動実行のみ」は**最新状態では誤り**。同workflowに `actions/configure-pages@v5` と `enablement: true` がある。
- GitHub repositoryはprivate。最新のPages設定画面・契約資格・public URLの匿名動作・直近Pages run成功は今回検証できていない。過去の `configure-pages` Not Foundを最新runの失敗として再利用しない。
- **公開対象の重要な範囲:** `scripts/build-github-pages.mjs` は100件のスロットだけでなく、`courses/`、`lessons/`、`learn/`、`listen/`を**ディレクトリごと**Pages成果物へコピーする。Pagesを一般公開する場合、これらも配信対象となり得る。現在のprivate repoの保護がPagesサイトにも自動的に及ぶと仮定しない。
- 新しい公開/自動デプロイの継続前に、所有者またはEは配信成果物の機密・個人情報レビュー、Pages可視性・資格、Settings → Pages、Actions source、直近run、匿名URLを確認する。本DはPages設定を変更しない。

## 5. 判定・Eへの引き継ぎ

**Worker D = PARTIAL_WITH_GAPS。** Vercel productionのREADY・alias・HTML/JS/一部JSONのHTTP配信と4章の静的構成は確認。連続Learnの出典欠落は**静的FAIL**。Android Chrome、Web Speech APIの実音声、Chrome標準読み上げ、390px実描画、Course I/III/IVの連続再生、GitHub Pagesの直近成功・匿名公開状態は**NOT_VERIFIED**。

推奨順序:

1. **P0 公開範囲:** Pagesが有効なら `dist-pages` に含まれる全ディレクトリの公開適否、Secrets/個人情報/非公開教材を検査し、所有者による公開範囲の承認を得る。自動workflowの変更は独立判断。
2. **P1 コース出典欠落:** Eが独立したコード修正の担当を決め、出典表示・章切替・回帰テストを追加する。教材本文/HTMLとの競合を避ける。
3. **P1 Android Chrome実機:** 390pxでCourse I/III/IV各代表章を単章/連続再生し、再生・停止・一時停止・前後章・速度/音声・最終章停止、戻り、出典を動画/メモ（個人情報なし）で記録。Chrome標準「このページを読み上げ」はWeb Speech APIと別試験。画面OFF/バックグラウンドは測定した場合のみ結論を出す。
4. **P1 配信一致:** 最新mainをproductionに反映する必要があるかEで判断し、デプロイSHA/alias/READY/HTTP/実操作を段階別に再確認。
5. **P2 GitHub Pages:** 直近workflow run、Settings → Pages、Private repoの資格、匿名URLを確認し、公開判定を更新する。

### 参照

- [Pages workflow](../.github/workflows/pages.yml)
- [Pages build](../scripts/build-github-pages.mjs)
- [Learn course player](../learn/course-player.js)
- [旧統合判定](SECURITY_LEARNING_INTEGRATION_2026-10-08.md)
- [旧Android / Learn読み上げパイロット](LEARN_READALOUD_PILOT_20260927.md)
