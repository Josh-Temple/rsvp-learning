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


---

## 6. 2026-10-09 JST — 独立品質検証・実利用QA Wave / Worker D 後続snapshot

**検証区分:** 本番デプロイAPI + 認可されたVercel連携のHTTP代理取得 + GitHub main静的コードレビュー。**本番GUIブラウザ操作・Android Chrome実機操作・実音声の聴取は未実施。**

**開始時点の確認（2026-10-09 07:50以降 JST）**

- 指示: Library `/RSVP Learning/Work Instructions/2026-10-09_security_learning_independent_validation_and_depth_expansion_wave_instructions.md` Section 6。
- GitHub: `Josh-Temple/rsvp-learning` private / default `main`、実行開始時main **`fd003b63b816799dd8f1f1eac0de4fd70db32da9`**（GitHubの直近コミット検索・当該refのファイル読取で照合）。
- Open PR: GitHub個別照会で旧Draft **#6**（head `889aa99005afceb0c0f69ceb212fa3090bfc08a1`、照会時base `b0b37d3f676b9cd7b17d29bc0d095b9f60c1f77f`）と別件 **#29**（head `fa846811d5e32cba9ab7e3a45e43f2cddf8a2bea`、照会時base `1fffa341f7b86e41050c192ffba7de2bdc008c8`）を確認。いずれも**範囲外・非変更**。検索APIによるopen PR一覧は空応答であり、一覧の網羅性は保証しない。前Waveの関連 #95〜#100 はclosed/統合記録と照合。今WaveのA/B/Cの新規作業は本Dの確定的な監査対象ではない。
- 配信先: Vercel project `rsvp-learning`、project ID `prj_7yYGl5D3Q7UwQgQuXaGmOYLkTzbu`。production deployment **`dpl_CYHqCXPTCoEqH3r9QDK66XLiy5fN`**、**READY**、metadataの `githubCommitSha=fd003b63b816799dd8f1f1eac0de4fd70db32da9`、production alias `rsvp-learning-kappa.vercel.app` が同deploymentに存在することをAPIで確認。今回の調査時点では**本番配信コードのGit SHAと開始main SHAが一致**する。
- Vercel project設定: `ssoProtection.enabled=true`, `deploymentType=all_except_custom_domains`。連携の取得成功を「匿名ユーザーが到達できる」と読み替えない。
- 旧snapshotのproduction SHA差、出典欠落、RSVP Pages workflowの記録は**当時の事実として維持**する。#99 の出典表示修正と `PUBLIC_LISTENING_BOUNDARY_2026-10-08.md` によるPages方針変更を反映した**新しい観測**を以下に記録する。

### 6.1 テスト環境・証拠の種類

| 種別 | 実行したこと | 実行していないこと |
|---|---|---|
| Vercel API | project/deployment/alias/READY/ソースSHA/保護設定の取得 | browser rendering / clicking / audio |
| Vercel HTTP代理取得 | 正規production URLのHTML/JS/JSON/代表Lesson HTMLのレスポンス本文とHTTP statusを確認 | 匿名の一般ブラウザでの通信・Cookie・操作の保証 |
| GitHub API | private main、#6/#29、既存QA/統合/公開境界、player/app/テスト/カタログの現行ファイル照合 | 全Action runの網羅的列挙、今回のnpmローカル実行 |
| ローカル環境 | Chromiumバイナリの存在を確認。productionホストのDNS解決を試みたが `gaierror: Temporary failure in name resolution` | productionへのChromium実アクセス、390px画面描画、実機・音声 |
| 汎用Webアクセス | productionトップと代表Learn URLを試したが「このツールではアクセス不能」 | この結果だけからSSO、公開範囲、恒常的障害の原因を断定 |

### 6.2 本番配信・静的整合性の測定

**base URL:** `https://rsvp-learning-kappa.vercel.app/`。各パスのHTTP 200はVercel連携経由の結果である。

| test_id | environment / device / browser | URL・操作・期待結果 | 実測・evidence | 判定 |
|---|---|---|---|---|
| D-20261009-01 | Vercel API / device N/A | production READY、alias、source SHA | READY、3 aliasのうち `rsvp-learning-kappa.vercel.app` が存在。source SHA=開始main SHA。deployment `dpl_CYHqCXPTCoEqH3r9QDK66XLiy5fN` | **PASS（APIのみ）** |
| D-20261009-02 | HTTP代理取得 / browser N/A | `/` にRSVP・Course Learn・章別出典のDOM | HTTP 200。RSVP速度 `#speed`、`#learn-course-player`、`#learn-course-sources`、単章出典 `#source-section` の存在 | **PASS（静的）** |
| D-20261009-03 | HTTP代理取得 / browser N/A | `/app.js`、`/learn/learn.js`、`/learn/course-player.js` が配信される | すべてHTTP 200。追加で `index.html` / `learn/learn.js` / `learn/course-player.js` は開始mainに固定したGitHub本文と**文字列全体一致** | **PASS（配信・3ファイル一致）** |
| D-20261009-04 | HTTP代理取得 / browser N/A | `/courses/index.json`、`/lessons/index.json` の取得と解析 | 双方HTTP 200、JSON解析可能。専門Course I〜IV `security-foundations-risk=7`、`security-threat-flow=7`、`security-identity-crypto=8`、`security-network-cloud=8` で**計30章**を確認（別の入門章を含めない） | **PASS（取得と一覧構造）** |
| D-20261009-05 | HTTP代理取得 / browser N/A | 既改稿8章の単章Learn HTMLに本文・操作・出典が存在 | **8/8 HTTP 200**、各HTMLに `#learn-article`、`#speech-play`、`section.sources`。HTML内のHTTP(S)出典リンク数は後述の順に **3 / 6 / 4 / 4 / 4 / 4 / 4 / 4** | **PASS（8章の静的構造）** |
| D-20261009-06 | 配信済みplayer JS + mainテスト / browser N/A | 連続再生で章別出典を本文とは別表示し、章切替で上書き・非表示にする | `parseArticle()` が `section.sources` を取得。`loadChapter()` が `sources.innerHTML = parsed.citations` と `sources.hidden = !parsed.citations.trim()` を実行。専用DOM `#learn-course-sources` と構造検査を確認。#99修正後のコードがproductionにある | **PASS（静的修正実装のみ）**。実画面の切替は **NOT_VERIFIED** |
| D-20261009-07 | 配信済みplayer JS / browser N/A | Course連続再生、章末自動切替、最後で停止、前後移動、戻り、速度・音声 | `SpeechSynthesisUtterance.onend` → `speakCurrent()` → `finishChapter()` → `loadChapter(next)` の実装あり。最終章は `completed=true` / `state=idle`、移動は `moveChapter()`。発火・音声・UI効果は未観測 | **PASS（静的な制御経路）** / **NOT_VERIFIED（動作）** |
| D-20261009-08 | 配信済みindex/app JS / browser N/A | RSVP単章・再生/一時停止/戻る/進む/速度の操作 | 対応するDOM、イベント登録・再生制御コードを確認。クリック、チャンク自然さ、再生中の速度変更効果は未観測 | **PASS（静的な操作経路）** / **NOT_VERIFIED（動作）** |
| D-20261009-09 | Chromium / desktop / ネットワーク不可 | production実アクセス、390px/desktop描画、コース選択→連続再生 | Chromiumは存在。ただしproductionのDNS解決不可。本番画面のスクリーンショットとユーザー操作が取得できない | **NOT_VERIFIED** |
| D-20261009-10 | Android実機 / Android Chrome / 未接続 | 390px相当、タップ、再生・停止、音声・速度、章遷移、出典 | Android端末にアクセスしていない。エミュレーター・HTTP・静的コードを実機確認としない | **NOT_VERIFIED** |
| D-20261009-11 | Android実機 / Web Speech API / 未接続 | ページ内音声合成で単章と通し再生、停止/速度/音声選択、実際の聴取 | 実音声・端末の音声エンジン・イベントを測定していない | **NOT_VERIFIED** |
| D-20261009-12 | Android実機 / Chrome標準機能 / 未接続 | Chromeメニュー「このページを読み上げ」から利用できるか | Chrome標準機能はアプリ内Web Speech APIと別。実機メニュー・読み上げを確認していない | **NOT_VERIFIED** |
| D-20261009-13 | Android実機 / 未接続 | 画面OFF・バックグラウンドで音声継続するか | 状態遷移・音声の実測なし。Wake Lockコードだけで継続可とは言わない | **NOT_VERIFIED** |
| D-20261009-14 | GitHub status / npm環境 | 当該mainのCIと `npm run check` | mainのcombined statusにはVercel successを確認。対象SHAのPR起動workflow一覧は空（ツールの検索範囲に制限）。既存統合記録の旧SHA `0a168c…` のTest成功は今のmainの新規Test証拠ではない。private repoのローカルcheckoutがないため `npm run check` は未実行 | **Test: NOT_VERIFIED / npm: NOT_RUN** |
| D-20261009-15 | GitHub private/public境界 | RSVP一般公開やInstant Radio自動同期が無断で起きないこと | GitHub privateを確認。公開方針の正本で「RSVP private／Instant Radio public・明示的公開のみ」を再確認。実際の匿名到達性・GitHub Pages Settings画面は未観測。設定変更は実施せず | **PASS（repository visibilityと方針）** / **NOT_VERIFIED（匿名アクセス・Pages設定）** |

静的に取得した**改稿済み8章と出典リンク数**（同じ順番で検査）：`security-risk-assessment`（3）、`security-sessions-federation-oauth-oidc-saml`（6）、`security-cloud-shared-responsibility-iam-config`（4）、`security-email-spf-dkim-dmarc`（4）、`security-social-engineering-bec-phishing`（4）、`security-malware-ransomware`（4）、`security-credential-session-attacks`（4）、`security-identity-proofing-authn-authz`（4）。**リンク数・取得成功はリンク先仕様の現行性・正確性を保証しない**（内容の独立審査はC）。

### 6.3 新旧不具合の境界・判定

- **旧P1「Course連続再生で出典欠落」**: 上の旧Section 3.1が示した失敗は、後続PR **#99** により静的な実装不備が修復され、その修正コードが本番HTTPで取得できた。今回のDでは**静的修正を確認した**と判定し、旧発見を消さない。**実際に章を変えた瞬間の画面表示・リンク操作は未検証**。古いFAILを現在も残存するバグと断定せず、実利用PASSにも昇格しない。
- **新しいP0・P1不具合**: 本Dで実測できたHTTP・コード・代表8章の構造の範囲では**新規の確証なし**。これは全操作/音声に不具合がないという意味ではない。
- **速度変更の注意点**: 単章/コースの速度スライダーは入力イベントで値を更新し、新規 `SpeechSynthesisUtterance` 作成時に `rate` を設定する実装。再生中の発話に即時反映されるとはコード上で証明できない。実聴取で確認する。
- **公開境界**: 過去snapshotのPages workflowや `/listen/chrome` スロットの記述を最新状態と混同しない。現行正本は `docs/PUBLIC_LISTENING_BOUNDARY_2026-10-08.md`。private教材のPages公開・100スロットの自動同期は行っていない。

### 6.4 実機操作の最小確認手順（利用者・Eへ）

1. Android Chrome（実機）で `https://rsvp-learning-kappa.vercel.app/` を開き、端末機種・Android/Chrome版、確認時刻、ログイン要否だけを個人情報なしで記録。390px相当の縦画面で、横スクロール・ボタンの重なり・出典の可読性を確認。
2. RSVPの `security-risk-assessment` で再生→一時停止→1チャンク戻る/進む→速度変更→停止。画面表示の自然さと選択した章の出典を目視確認。
3. 単章Learnを開き、`▶ / Ⅱ / ■`、速度、音声選択、実音声と画面のハイライトを確認。音が出ない/止まる場合は、その操作・再現条件だけ記録。
4. Learn一覧からCourse I `security-foundations-risk`、Course III `security-identity-crypto`、Course IV `security-network-cloud` の通し再生を開始し、**章末自動遷移、章別出典の更新、前後章、速度・音声切替、最終章停止、一覧へ戻る**を確認。各Courseの初章・中間・最終章で一度ずつ出典を確認し、前章の出典が残らないことを調べる。
5. Chromeブラウザメニュー内の**標準「このページを読み上げ」**の利用可否を、ページ内 `▶` と混同せず別に判定。画面OFF/バックグラウンドは試した場合のみ結果を記載。録音・端末内の個人情報・保存済み習熟度をGitHubへアップロードしない。

### 6.5 Worker Eへの引継ぎ／終了条件

**Worker D判定: `PARTIAL_WITH_GAPS`**。production API（READY/alias/SHA一致）、HTTPによる主要コード・カタログ・既改稿8章、#99修正後の章別出典の静的機構は**確認した範囲でPASS**。一方、**390pxとdesktopの本番実ブラウザ描画/クリック、Android Chrome、実音声、Chrome標準読み上げ、実際の章切替と出典更新はすべてNOT_VERIFIED**。今回のレポート完成は実機QAの合格ではない。

- **P1 / D+利用者 / 環境依存**: 上記6.4に沿ったAndroid実機の最小実測。合格には端末・URL・deployed SHA・操作・期待/実測・問題時の再現手順を残す。
- **P1 / E**: Dの静的PASSを実ブラウザPASSへ無条件に格上げしない。C・B/Aの新headが統合された場合は新SHA/production aliasを再確認し、出典DOMとchapter切替を回帰確認する。
- **P1 / E**: 現在mainのTestは今Dの取得経路では網羅的に検証していないため、必要なGitHub Actions run URL/commit conclusionを再取得。`npm run check`は適切なcheckout/CIで行う。
- **P0 / E**: RSVP privateとInstant Radio publicを維持。Pages設定・匿名アクセス・秘密情報露出は許可と証拠のないまま公開方向へ変更しない。
- **非所有**: AのMarkdown/RSVP、BのLearn HTML、Cの専門内容審査、Eのmerge・デプロイ、Course V実装は本Dで行わない。

**保存運用:** 本snapshotを旧QA報告に追記し、既存の当時の観測/判定を変更しない。対象PRの差分・head SHAと保存本文をreadbackしてEへ引き継ぐ。


---

## 7. 2026-10-09 JST — 4章品質是正・媒体横断審査Wave / Worker D 実利用QA後続snapshot

**実施時刻:** 2026/10/9 12:42:34 JST（UTC 2026-10-09T03:42:34.480Z）  
**対象指示:** Library \`/RSVP Learning/Work Instructions/2026-10-09_security_learning_four_lesson_closure_and_real_use_validation_wave_instructions.md\` §6。  
**作業開始時main:** \`1bb69060843d8ddb7d7126f094e79a5670e64713\`。本記録はDの独立snapshotであり、以前の第1〜6節の当時の証拠・不具合発見を変更しない。  
**D総合:** **PARTIAL_WITH_GAPS**。静的配信・一部コード整合の証拠は取得できたが、デスクトップGUI、390px実画面、Android Chrome実機、Web Speech API実音声、Chrome標準読み上げ、画面OFFは**NOT_VERIFIED**。

### 7.1 Fresh read／配信版と公開境界

- GitHub \`Josh-Temple/rsvp-learning\`: private、default main \`1bb69060843d8ddb7d7126f094e79a5670e64713\`。開始時・文書作成前の再取得で同SHA。open PR: #102 Draft（head \`198df1210b176d880225b59e121c3953268f2b50\`、base \`fd003b63b816799dd8f1f1eac0de4fd70db32da9\`）、別件 #29、旧Draft #6。今回Dはいずれにも変更を加えない。**#102のA改稿4章は本番mainに未統合**。B新4章・Cの新版審査を本番PASSとして記録しない。
- GitHub Actions: \`Test\` [37858048812](https://github.com/Josh-Temple/rsvp-learning/actions/runs/37858048812) = **success** on \`1bb69060843d8ddb7d7126f094e79a5670e64713\`、\`Scheduled Vercel production deploy\` [37858892849](https://github.com/Josh-Temple/rsvp-learning/actions/runs/37858892849) = **success** on同SHA。これは今回のローカル \`npm run check\` 実行を意味しない（**NOT_RUN**）。
- Vercel project \`rsvp-learning\` / \`prj_7yYGl5D3Q7UwQgQuXaGmOYLkTzbu\`、production deployment \`dpl_DNLnA1qKULfgvJQbLyGXrGvFufFE\`。Vercel API: \`READY\`、\`target=production\`、\`meta.githubCommitSha=1bb69060843d8ddb7d7126f094e79a5670e64713\`。alias APIで \`rsvp-learning-kappa.vercel.app\` が同deployment IDに結び付くことを確認。現時点で配信ソースSHAとmainは一致。
- Project設定: \`ssoProtection.enabled=true\`、\`deploymentType=all_except_custom_domains\`。この設定と代理HTTP成功のみから、匿名利用者の到達性・認証経路を保証しない。変更していない。
- 公開境界の正本 \`docs/PUBLIC_LISTENING_BOUNDARY_2026-10-08.md\` を再取得。RSVP教材はprivate、public Chrome読み上げの100スロットは独立した \`Josh-Temple/instant-radio\`、公開は明示的な操作のみ。Pages再有効化、公開設定変更、データ同期なし。

### 7.2 テスト環境と実測マトリクス

**基準URL:** \`https://rsvp-learning-kappa.vercel.app/\`。以下のHTTP応答は**認可済みVercel連携による代理取得**であり、匿名デスクトップChrome/Android ChromeのHTTP観測ではない。端末・画面幅・Chrome版は本番GUI試験に使用できなかったためN/A。

| test_id | 環境・操作／期待 | 実測・証拠 | 判定 |
| --- | --- | --- | --- |
| D4-01 | GitHub/API・main/PR/CIをfresh read | main SHA、open #102/#29/#6、Test success、deploy workflow successを取得 | **PASS（APIメタデータ）** |
| D4-02 | Vercel API・production/alias/source/保護設定 | deployment READY・source SHA一致、alias割当て一致、既存SSO設定を確認 | **PASS（配信設定）** |
| D4-03 | HTTP代理・トップ \`/\` | **200**。RSVP UI、Learn導線、Course player関連要素の配信本文を取得 | **PASS（静的HTTP）** |
| D4-04 | HTTP代理・\`/app.js\`、\`/learn/learn.js\`、\`/learn/course-player.js\` | **3/3が200**。それぞれGitHub \`1bb69060843d8ddb7d7126f094e79a5670e64713\` のファイル本文と**全文一致** | **PASS（静的配信とソース一致）** |
| D4-05 | HTTP代理・\`/courses/index.json\`、\`/lessons/index.json\` | **2/2が200**、JSON parse成功（course catalog全体24コース、lesson catalog全体158件。全体件数と専門4コース30章を混同しない） | **PASS（静的取得・構文）** |
| D4-06 | HTTP代理・既改稿8章の単章Learn本文/音声操作UI/出典 | **8/8が200**、8/8で \`#learn-article\`、\`#speech-play\`、\`section.sources\` が存在。各HTMLの外部出典リンク数は3/6/4/4/4/4/4/4 | **PASS（8ページ静的構造）** |
| D4-07 | HTTP代理・\`/learn/security-threat-modeling.html\` | **200**、既存の単章HTML・出典要素を取得。ただし未統合のA #102に対応する新B講義とは認定しない | **PASS（配信）／新版の対応NOT_VERIFIED** |
| D4-08 | GitHub＋本番の連続再生ロジック | \`parseArticle()\` が \`section.sources\` を取得、\`loadChapter()\` が \`#learn-course-sources\` のHTMLを置換し、空ならhiddenにする。章末 \`finishChapter()\`、最終章 \`state=idle\`、前後章 \`moveChapter()\`、戻る・速度・音声変更用イベントを確認。本番JSはmainと一致 | **PASS（静的な実装経路）／操作はNOT_VERIFIED** |
| D4-09 | GitHub＋本番のRSVP単章制御 | \`app.js\` にチャンク進行、再生/一時停止、速度、章・出典描画の処理を確認。本番コードとmain一致 | **PASS（静的な実装経路）／クリックはNOT_VERIFIED** |
| D4-10 | ローカルChromiumで本番画面を操作（desktop/390px） | Chromiumバイナリ存在。しかしこの実行環境では本番ドメインのDNS解決に失敗し、画面描画・スクリーンショット・タップ/クリック試験に到達できなかった。汎用Webアクセスでも対象URLは利用不可 | **NOT_VERIFIED** |
| D4-11 | Android Chrome実機、画面幅・横はみ出し・タップ | Android端末へ接続していない。機種/OS/Chrome版、表示幅、実タップは未取得 | **NOT_VERIFIED** |
| D4-12 | Android Chrome Web Speech API（単章/コース通し・停止/速度/音声） | 音声エンジン、発話イベント、聞きやすさを聴取・記録していない。JSが存在するだけではPASSにしない | **NOT_VERIFIED** |
| D4-13 | Chrome標準「このページを読み上げ」、画面OFF/バックグラウンド | 実Chromeメニュー、画面OFF中の継続音声等を試していない。ページ内Web Speech APIと別軸 | **NOT_VERIFIED** |
| D4-14 | Course I/III/IVの章末自動遷移、出典更新、最終停止、戻る | JavaScriptに必要な制御経路が存在する。**実ブラウザでの操作・章遷移・出典リンククリックは未観測** | **NOT_VERIFIED（実操作）** |
| D4-15 | 公開境界 | private GitHubと正本方針を照合。Pages/Instant Radio自動同期の追加操作なし。匿名到達性の実測・Pages管理設定は未確認 | **PASS（設定変更なし・方針照合）／匿名アクセスNOT_VERIFIED** |

8件のLearn URLは順に \`security-risk-assessment\`（3）、\`security-sessions-federation-oauth-oidc-saml\`（6）、\`security-cloud-shared-responsibility-iam-config\`（4）、\`security-email-spf-dkim-dmarc\`（4）、\`security-social-engineering-bec-phishing\`（4）、\`security-malware-ransomware\`（4）、\`security-credential-session-attacks\`（4）、\`security-identity-proofing-authn-authz\`（4）で、すべて \`learn/<lesson-id>.html\`。リンク数は根拠の版・節・主張との一致を保証しない。

### 7.3 静的レビュー上の注意と再試験条件

- 旧P1「連続再生で出典が消える」は #99修正後の実装が本番で配信されることを今回再確認。**旧FAILを消さず、実操作での出典切替PASSにも昇格しない**。
- コース読み上げ速度は \`rateInput\` の値を**発話を新規作成したとき**に適用する構造。読み上げ中の現在発話への即時反映はこの観測だけでは確認できない。実機で途中変更した際の挙動を測ること。
- 現在の本番は #102 の新原稿や未完成の新B Learnを配信済みとは言えない。A/B/C依存がEにより統合され、新productionが作成された場合は、**新source SHA・aliasのfresh readから再試験**が必要。
- 新たなP0/P1ブラウザ不具合の確証は今回の静的取得範囲にはない。これは実ブラウザ、音声、操作に不具合がないという保証ではない。教材の原典・否定・条件の独立審査はCの責任範囲。

### 7.4 Android実機提供者への最小操作手順

1. Android Chromeで上記本番URLを開き、**JST時刻・端末機種・Android/Chromeバージョン・画面幅・アクセス可否**を記録。ログイン情報や認証トークンは記録・共有しない。横スクロールや操作ボタンの重なりも確認。
2. RSVP \`security-risk-assessment\` を選び、再生→一時停止→前/次チャンク→速度変更→停止→出典。期待と実測を操作別に書く。
3. 同章の単章Learnで ▶ / 一時停止 / 停止、速度/声の切替を試し、声が実際に聞こえたか・自然かを記録。Chrome標準「このページを読み上げ」は**別試験**にする。
4. Learn Course I \`security-foundations-risk\`、Course III \`security-identity-crypto\`、Course IV \`security-network-cloud\` の代表初章・中間・最終章で、通し再生→自動遷移→章別出典の入替→前後章→最終章停止→一覧戻りを確認。
5. 画面OFFとバックグラウンドの音声は試した場合のみ結果を記載。不具合は \`test_id / time JST / deployed SHA / URL / environment / device / browser version / operation / expected / observed / evidence / verdict\` で報告。録音、Cookie、学習履歴、個人情報、シークレットはGitHubへアップロードしない。

### 7.5 Eへの引継ぎ

- **D = PARTIAL_WITH_GAPS**。配信API・HTTP静的整合は限定PASS。実GUI/390px/Android Chrome/Web Speech API実音声/Chrome標準読み上げ/画面OFF・章末遷移はNOT_VERIFIED。
- **P1 / E**: 新A/B実装のC独立審査・CI合格・SHA固定統合の後、本番sourceとaliasを再取得。Dの旧ソースの静的PASSを新ソースのPASSとして流用しない。
- **P1 / D+実機提供者**: 7.4の端末試験で実測を埋める。特に出典切替と、読み上げ速度変更・連続再生最終停止を観測。実機なしならNOT_VERIFIED維持。
- **P0 / E**: Private RSVPとpublic Instant Radioの境界を維持。DはHTML/Markdown/JSON、localStorage、Pages、Vercel設定、他Worker成果物に変更を加えない。
- 本記録のGitHub PRは**Eが差分・CI・依存と競合を確認してから統合判定**する。静的PASSやPR提出だけでWave完了、ユーザー理解のPASSを宣言しない。

---

## 8. 2026-10-10 JST — 3章独立受入・本番実利用Wave / Worker D

**実行記録:** 2026-10-10 08:43:59 JST。Library指示 `/RSVP Learning/Work Instructions/2026-10-10_security_learning_three_lesson_independent_acceptance_release_and_real_use_wave_instructions.md` §6。**D判定 = PARTIAL_WITH_GAPS**。確認手段はGitHub・Vercelの認証済みAPIとHTTP応答本文。**desktop GUI、390px実描画、Android Chrome実機、Web Speechの実音声、Chrome標準「このページを読み上げ」、連続再生の実操作・受講者理解は未検証。**

### 8.1 fresh source / release boundary

- 着手時と保存直前のGitHub main = `d028fe12658423aa4408058048e2d6545ad78893`（private）。PR [#117](https://github.com/Josh-Temple/rsvp-learning/pull/117) は **open/Draft/unmerged**、head `2699e1171ed35ccc2c2e583271c8fba62e1e92d1`、比較時base_sha `07045f861e7e4dbc7e2adf03b03ef997b77939e3`（mainより古い）。差分12ファイルの教材改訂は本番mainに**未統合**。Cの独立受入なしにPRをmergeしない。本DはC署名を代行しない。
- [GitHub Test #37958465309](https://github.com/Josh-Temple/rsvp-learning/actions/runs/37958465309) は当該mainで **success**、[Scheduled Vercel production deploy #38000248879](https://github.com/Josh-Temple/rsvp-learning/actions/runs/38000248879) も同SHAで **success**（ローカル `npm run check` は **NOT_RUN**）。preview headの[Test #37957514039](https://github.com/Josh-Temple/rsvp-learning/actions/runs/37957514039) = **success**（別SHA・本番のTestとは区別）。
- production URL <https://rsvp-learning-kappa.vercel.app/>、deployment `dpl_Axx51igvTjRo5JsBYJJDPujV2sp1`、**READY / target=production / source SHA=d028fe12658423aa4408058048e2d6545ad78893**。Vercel alias APIは同deployment IDへ対応。前回記録の `dpl_GVcSNYX8JdzzvSdXPHTmP61154tE` を現在版としない。
- Vercel projectの **SSO Protection enabled=true, deploymentType=all_except_custom_domains**。設定変更なし。認証済みAPI代理のHTTP 200を「匿名ブラウザも到達可能」と扱わない。
- PR #117のpreview `dpl_ELSApq3He834BrS2E2FbYfpBUc3c` は**READY, target=null, source=2699e117…**。このHTMLを本番で配信済みとみなさない。
- GitHub private RSVP教材とpublic Instant Radioの公開境界は変更なし。Pages設定や外部同期を操作していない。

### 8.2 evidence matrix

以下のURLで先頭の `/` のみの行はproduction base <https://rsvp-learning-kappa.vercel.app/>、preview行はpreview専用base。日時はこのD記録時点の代表値。同じ行の複数URLは行中に個々の取得結果を示す。**判定はあくまで指定environmentについて**。

| test_id | date_time_JST | environment | device/browser_version | deployment_SHA/ID | URL | operation | expected | observed | evidence | PASS/FAIL/NOT_VERIFIED/BLOCKED |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| D5-01 | 2026-10-10 08:43:59 JST | GitHub API / browser N/A | N/A (static) / 未取得 (real GUI) | d028fe126584… / dpl_Axx51igvTjRo5JsBYJJDPujV2sp1 | https://github.com/Josh-Temple/rsvp-learning/tree/main | main・#117・CIを再取得 | 現行SHA・PR/CI状態を確認 | main=d028fe12658423aa4408058048e2d6545ad78893; #117 draft/open, head=2699e1171ed35ccc2c2e583271c8fba62e1e92d1, base_sha=07045f861e7e4dbc7e2adf03b03ef997b77939e3; Test #37958465309 success (same main); production deploy workflow #38000248879 success | GitHub branch, PR, Actions API | **PASS（API）** |
| D5-02 | 2026-10-10 08:43:59 JST | Vercel API / browser N/A | N/A (static) / 未取得 (real GUI) | d028fe126584… / dpl_Axx51igvTjRo5JsBYJJDPujV2sp1 | https://rsvp-learning-kappa.vercel.app/ | 本番source / alias / 保護設定 | READY / target=production / alias対応 | deployment=dpl_Axx51igvTjRo5JsBYJJDPujV2sp1, READY, target=production; alias API同ID; sourceはmain SHAと一致。project SSO enabled=true, deploymentType=all_except_custom_domains（設定変更なし） | Vercel deployment/alias/project API | **PASS（API）** |
| D5-03 | 2026-10-10 08:43:59 JST | 認可済みVercel連携HTTP / browser N/A | N/A (static) / 未取得 (real GUI) | d028fe126584… / dpl_Axx51igvTjRo5JsBYJJDPujV2sp1 | https://rsvp-learning-kappa.vercel.app/ | トップHTML取得 | HTTP 200 / playerと出典DOM | 200; #play-pause, #learn-course-player, #learn-course-sources を本文で確認 | Vercel web_fetch_vercel_url | **PASS（静的HTTP）** |
| D5-04 | 2026-10-10 08:43:59 JST | 認可済みVercel連携HTTP / browser N/A | N/A (static) / 未取得 (real GUI) | d028fe126584… / dpl_Axx51igvTjRo5JsBYJJDPujV2sp1 | /app.js /styles.css /learn/learn.js /learn/course-player.js /learn/learn.css | 主要JS/CSS取得 | 全URL 200 | 5/5 HTTP 200。index.html, app.js, learn/learn.js, learn/course-player.jsは同mainのGitHub本文と全文一致。 | Vercel HTTP + GitHub contents | **PASS（配信・部分ソース一致）** |
| D5-05 | 2026-10-10 08:43:59 JST | 認可済みVercel連携HTTP / browser N/A | N/A (static) / 未取得 (real GUI) | d028fe126584… / dpl_Axx51igvTjRo5JsBYJJDPujV2sp1 | /courses/index.json /lessons/index.json | catalog取得・JSON parse・main対照 | 200 / 構文・最新版一致 | 2/2 HTTP 200、JSON parse成功、GitHub mainと両方全文一致。24 courses, 158 lessons、専門Course I/II/III/IV=7/7/8/8計30章。 | Vercel HTTP + GitHub contents | **PASS（静的HTTP）** |
| D5-06 | 2026-10-10 08:43:59 JST | 認可済みVercel連携HTTP / browser N/A | N/A (static) / 未取得 (real GUI) | d028fe126584… / dpl_Axx51igvTjRo5JsBYJJDPujV2sp1 | /learn/security-email-spf-dkim-dmarc.html /learn/security-social-engineering-bec-phishing.html /learn/security-malware-ransomware.html /learn/security-credential-session-attacks.html | 既公開重点4章の単章Learnとsource構造 | 4/4 HTTP 200・article/speech/source節 | 4/4 HTTP 200、#learn-article, #speech-play, article外のsection.sources、各4件の外部出典リンク確認。本文内容の受入審査やリンク先の現行性は本Dの判定外。 | Vercel HTTP body / static DOM | **PASS（4章静的構造）** |
| D5-07 | 2026-10-10 08:43:59 JST | 認可済みVercel連携HTTP / browser N/A | N/A (static) / 未取得 (real GUI) | d028fe126584… / dpl_Axx51igvTjRo5JsBYJJDPujV2sp1 | /learn/security-identity-proofing-authn-authz.html /learn/security-sessions-federation-oauth-oidc-saml.html /learn/security-cloud-shared-responsibility-iam-config.html | 本番の既存3章を確認 | 個別HTTP status / 本番修正版区別 | 初回取得は3/3 HTTP 200、3/3でarticle/speech/article外source節あり。後続のidentity再取得はツール安全ブロック。3章の本番HTMLは修正PR #117のheadではない。 | Vercel HTTP; GitHub main vs PR #117 | **PARTIAL（最初の3/3確認・再取得制限）** |
| D5-08 | 2026-10-10 08:43:59 JST | 認可済みVercel連携HTTP / browser N/A | N/A (static) / 未取得 (real GUI) | 2699e117… / dpl_ELSApq3He834BrS2E2FbYfpBUc3c | https://rsvp-learning-i4mqtkb6y-josh-temples-projects.vercel.app/learn/{上記3章ID}.html | PR #117 previewの3章本文・音声UI・出典を取得 | 3/3 HTTP 200・記事と出典の分離 | 3/3 HTTP 200、#learn-article、#speech-play、article後のsection.sources。出典リンク数=identity 4 / federation 6 / cloud 5。preview=READY target=null, SHA=2699e117…; content独立受入や本番PASSではない。 | Vercel preview/deployment API + authenticated HTTP | **PASS（preview静的構造のみ）** |
| D5-09 | 2026-10-10 08:43:59 JST | 本番配信JS・静的review / browser N/A | N/A (static) / 未取得 (real GUI) | d028fe126584… / dpl_Axx51igvTjRo5JsBYJJDPujV2sp1 | /learn/course-player.js | 連続再生と章別出典の処理 | 出典抽出・入替・章末制御を実装 | parseArticle()でsection.sources抽出、learn-course-sourcesへ更新、finishChapter()経路あり。browserで再生・章末処理・最終停止・出典クリックを操作した証拠ではない。 | 本番course-player.js全文の静的判読 | **PASS（静的実装）/ NOT_VERIFIED（実動作）** |
| D5-10 | 2026-10-10 08:43:59 JST | desktop browser / 利用不能 | N/A (static) / 未取得 (real GUI) | d028fe126584… / dpl_Axx51igvTjRo5JsBYJJDPujV2sp1 | https://rsvp-learning-kappa.vercel.app/ | desktop GUI操作、390px描画・スクロール・戻り | 操作で確認 | 本D実行環境に接続済みGUI browser sessionがないため、実描画・click・スクロールは行っていない。 | 実ブラウザ実測なし | **NOT_VERIFIED** |
| D5-11 | 2026-10-10 08:43:59 JST | Android Chrome / 実機未接続 | N/A (static) / 未取得 (real GUI) | d028fe126584… / dpl_Axx51igvTjRo5JsBYJJDPujV2sp1 | https://rsvp-learning-kappa.vercel.app/ | RSVP前後チャンク・速度・Learn操作/横はみ出し | 実機で動作/表示を確認 | 端末モデル、Android/Chrome版、画面幅、操作、観測時刻を取得できていない。 | 実機証拠なし | **NOT_VERIFIED** |
| D5-12 | 2026-10-10 08:43:59 JST | Android Chrome / Web Speech API未接続 | N/A (static) / 未取得 (real GUI) | d028fe126584… / dpl_Axx51igvTjRo5JsBYJJDPujV2sp1 | 既存3章単章Learn・Course III/IV | 実音声・速度・声の切替・停止・章末遷移 | 実発話とUI状態を確認 | 音声エンジン、音声出力、onend、速度切替・章末自動遷移の実測なし。 | 実音声証拠なし | **NOT_VERIFIED** |
| D5-13 | 2026-10-10 08:43:59 JST | Android Chrome / 標準読み上げ未接続 | N/A (static) / 未取得 (real GUI) | d028fe126584… / dpl_Axx51igvTjRo5JsBYJJDPujV2sp1 | 同3章Learn / ブラウザメニュー | Chrome標準「このページを読み上げ」、画面OFF・バックグラウンド | Web Speechとは独立にテスト | 実Chromeメニューを操作していない。SSOとの相互作用も未測定。 | 実機証拠なし | **NOT_VERIFIED** |
| D5-14 | 2026-10-10 08:43:59 JST | desktop/Android browser / 実操作なし | N/A (static) / 未取得 (real GUI) | d028fe126584… / dpl_Axx51igvTjRo5JsBYJJDPujV2sp1 | Course I/III/IV・単章Learn | Course通し→自動遷移→出典更新→最終停止→一覧戻り | 全経路を実操作確認 | 静的JSに遷移制御はあるが実ブラウザを動かしておらず、章別出典の実表示/最終停止は未観測。 | 実GUI/音声証拠なし | **NOT_VERIFIED** |
| D5-15 | 2026-10-10 08:43:59 JST | 受講者テスト / 実施なし | N/A (static) / 未取得 (real GUI) | d028fe126584… / dpl_Axx51igvTjRo5JsBYJJDPujV2sp1 | 理解確認20問 | 実際の採点・誤答分布・理解度 | 受講データから学習効果を判断 | 被験者/回答結果を取得していない。Cによる設問監査と混同しない。 | 回答記録なし | **NOT_VERIFIED** |
| D5-16 | 2026-10-10 08:43:59 JST | 匿名ブラウザ / 未操作 | N/A (static) / 未取得 (real GUI) | d028fe126584… / dpl_Axx51igvTjRo5JsBYJJDPujV2sp1 | https://rsvp-learning-kappa.vercel.app/ | 未認証の到達可否と保護境界 | 保護方針どおりのアクセス制御 | Vercel projectではSSO有効。認証済み連携のHTTP 200は匿名ブラウザ到達可否の証拠ではない。保護設定を変更していない。 | Vercel settings APIのみ | **NOT_VERIFIED（匿名アクセス）** |

### 8.3 確認できたことと限界

- 同一mainに固定したGitHub contentsと認証済みproduction HTTPで **index.html、app.js、learn/learn.js、learn/course-player.js、courses/index.json、lessons/index.jsonの6ファイルが全文一致**。5つのJS/CSS資産も200。**本番で更新されたのは同mainの再配信**であり、未マージのPR #117の修正版3章ではない。
- 既公開の重点4章の静的URLは**4/4 HTTP 200**、記事・読み上げUI・article外出典を確認した。追加の `security-risk-assessment` 単章URLは取得ツールの安全性チェックによりブロックされ、**HTTP可否自体を判定しない**。URL側のFAILや機能障害と断定しない。
- 既存3章の本番URLは初回3/3 HTTP 200。identity URLの再取得はツール側がブロック。**初回HTTP取得証拠と再取得不可を併記**。preview 3/3 HTTP 200と出典節の構造は確認した。preview応答はデプロイfeedback scriptの注入を含むため、変換なしのGitHub原本との全文一致主張を避ける。
- 本番 `learn/course-player.js` は章末処理・source抽出と差替えコードを保持し、PR #99の旧「出典欠落」対処に相当する構造を継続している。ただし**初章→中間→最終章の画面表示、出典入替、最終停止は実機/GUIでNOT_VERIFIED**。
- 実機Android/Chromeのバージョン・幅・操作・聴取結果、画面OFF/バックグラウンド、Chrome標準読み上げ、Web Speechは**いずれも観測なし**。20問の受講者得点や学習効果は**NOT_VERIFIED**。現在の静的証拠で重大GUI P0/P1障害が「ない」とは断定しない。

### 8.4 Eへの引継ぎ・post-merge検証条件

1. **E/C依存・HOLD:** PR #117はCが最新headを真に独立受入してからEがSHA固定で統合判断する。現時点Dは**新3章の本番実操作をPASSと認めない**。
2. **新本番の再取得:** Eが新mainを配信した場合に限り、Dは**新main full SHA・Test・Vercel READY/target=production/source SHA/alias/保護設定**を再取得し、D5-03〜D5-09のHTTP・静的差分テストを再実行する。旧SHAのPASS転用を禁止。
3. **Android Chrome代表テスト:** <https://rsvp-learning-kappa.vercel.app/>を実機で開く。モデル・Android/Chrome版・画面幅・時刻、認証要否、横はみ出しを記録。RSVPの再生/一時停止/前後チャンク/速度/戻り、3章の単章Learnの音声・速度・停止・出典、Course III/IV（可能ならI）の**初章→中間→終章の自動遷移・章別出典更新・最後の停止**を操作して確認する。
4. **読み上げ区分:** ページ内Web Speech APIの実音声と、Chrome標準メニュー「このページを読み上げ」は別行に記録。画面OFF/バックグラウンドは試した場合のみ結論。匿名アクセス・保護されたページの標準読み上げ可否も別扱い。
5. 受講者理解確認20問の**問題の採点構造**はC/B、**実際の回答分布・学習効果**は新たな模擬受講データがなければ未検証。private教材、Cookie、トークン、個人の学習履歴・録音等は提出・公開しない。

**今回のDの終了条件:** 静的API/HTTP観測をappend-onlyで保存しreadback。post-merge本番・実GUI・Android・音声・受講効果は**NOT_VERIFIEDのまま**。D単独ではmain/本番/公開設定/教材内容を変更しない。


---

## 9. 2026-10-10 JST — identity-resolution P1 repair Wave / D baseline

**指示:** Library `/RSVP Learning/Work Instructions/2026-10-10_security_learning_identity_resolution_p1_repair_independent_reacceptance_and_controlled_release_wave_instructions.md` §8。**D判定 = PARTIAL_WITH_GAPS（旧productionの静的証拠に限定）**。観測時刻の範囲は2026-10-10 **11:13–11:19 JST**。GitHub/Vercel認証付き連携のHTTP取得であり、ブラウザGUI・実音声・Android実機を実行していない。検査対象に変更があればfresh readが必要。

### 9.1 開始時のfresh readと工程境界

- GitHub private `Josh-Temple/rsvp-learning` / `main = 23a007f343456ae2e6cca14d3ab849ed07b27deb`（GitHub `git/ref/heads/main` とcommit一覧で検証）。このmainの [GitHub Actions Test #38006381537](https://github.com/Josh-Temple/rsvp-learning/actions/runs/38006381537) は **completed/success**。本Dのローカル `npm run check` は **NOT_RUN**。
- 改訂対象の [Draft PR #117](https://github.com/Josh-Temple/rsvp-learning/pull/117) は **open/draft/unmerged**。着手時head `2699e1171ed35ccc2c2e583271c8fba62e1e92d1` から、作業中に **`a5ccc9a442c00b546f6f50f7549f812253b15b29`** へ進行。新headは12変更ファイルを持ち、[Test #38016442442](https://github.com/Josh-Temple/rsvp-learning/actions/runs/38016442442) **completed/success**（確認時）。**A/B/C/Eの新candidate合格もmerge済みも意味しない**。headが動いた以上、最終C受入は最新head固有に必要。
- Vercel project `rsvp-learning` / `prj_7yYGl5D3Q7UwQgQuXaGmOYLkTzbu`。本番alias `rsvp-learning-kappa.vercel.app` → `dpl_Axx51igvTjRo5JsBYJJDPujV2sp1`、**READY / target=production / `meta.githubCommitSha=d028fe12658423aa4408058048e2d6545ad78893`**。新#117を反映した新版production **ではない**。
- GitHub compare `d028fe12…23a007f3` は `ahead_by=3`、変更は `docs/SECURITY_DEEP_CONTENT_AUDIT_2026-10-08.md`、`docs/SECURITY_REAL_USE_QA_2026-10-08.md`、`docs/SECURITY_LEARNING_INTEGRATION_2026-10-08.md` の**文書3ファイルのみ**。mainとproductionのSHAが異なっても、今回の14個の公開配信ファイルはproduction sourceと文字列全文一致。
- Vercel projectの `ssoProtection.enabled=true` / `deploymentType=all_except_custom_domains`、passwordProtection `false`。保護設定は変更していない。HTTPの200は権限を持つ連携での取得であり、匿名アクセス確認ではない。
- `docs/PUBLIC_LISTENING_BOUNDARY_2026-10-08.md` を再読。RSVP private / public Instant Radio は別。private教材のPages公開やinstant-radio転写は本Dでは実施しない。既存QA §8、既存E §12、現行Test workflowも再読した。

### 9.2 旧productionのURL別静的HTTPテスト

**検証方法:** 各URLを権限のあるVercel連携で実取得し、同じパスのGitHub `ref=d028fe12658423aa4408058048e2d6545ad78893` のファイル正文と完全一致するか比較。トップ `/` だけGitHub `index.html` に対応。ファイルの単純な文字列全文一致であり、DOMレンダリング、操作、発話、APIの継続稼働保証ではない。以下の相対URLはすべて `https://rsvp-learning-kappa.vercel.app/` に連結して取得。

| test_id | date_time_JST | environment | deployment_SHA/ID | URL | operation | expected | observed | evidence | verdict |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| D6-01 | 2026-10-10 11:13–11:19 JST | Vercel authenticated HTTP, no GUI / browser N/A | `d028fe12658423aa4408058048e2d6545ad78893` / `dpl_Axx51igvTjRo5JsBYJJDPujV2sp1` | `/` | GET URL; read against GitHub production SHA | HTTP 200 and identical source bytes | HTTP **200**; GitHub source file text **exact match** | Vercel authorized fetch + GitHub `fetch_file(ref=d028fe12…)` | **PASS (HTTP/source only)** |
| D6-02 | 2026-10-10 11:13–11:19 JST | Vercel authenticated HTTP, no GUI / browser N/A | `d028fe12658423aa4408058048e2d6545ad78893` / `dpl_Axx51igvTjRo5JsBYJJDPujV2sp1` | `/app.js` | GET URL; read against GitHub production SHA | HTTP 200 and identical source bytes | HTTP **200**; GitHub source file text **exact match** | Vercel authorized fetch + GitHub `fetch_file(ref=d028fe12…)` | **PASS (HTTP/source only)** |
| D6-03 | 2026-10-10 11:13–11:19 JST | Vercel authenticated HTTP, no GUI / browser N/A | `d028fe12658423aa4408058048e2d6545ad78893` / `dpl_Axx51igvTjRo5JsBYJJDPujV2sp1` | `/learn/learn.js` | GET URL; read against GitHub production SHA | HTTP 200 and identical source bytes | HTTP **200**; GitHub source file text **exact match** | Vercel authorized fetch + GitHub `fetch_file(ref=d028fe12…)` | **PASS (HTTP/source only)** |
| D6-04 | 2026-10-10 11:13–11:19 JST | Vercel authenticated HTTP, no GUI / browser N/A | `d028fe12658423aa4408058048e2d6545ad78893` / `dpl_Axx51igvTjRo5JsBYJJDPujV2sp1` | `/learn/course-player.js` | GET URL; read against GitHub production SHA | HTTP 200 and identical source bytes | HTTP **200**; GitHub source file text **exact match** | Vercel authorized fetch + GitHub `fetch_file(ref=d028fe12…)` | **PASS (HTTP/source only)** |
| D6-05 | 2026-10-10 11:13–11:19 JST | Vercel authenticated HTTP, no GUI / browser N/A | `d028fe12658423aa4408058048e2d6545ad78893` / `dpl_Axx51igvTjRo5JsBYJJDPujV2sp1` | `/courses/index.json` | GET URL; read against GitHub production SHA | HTTP 200 and identical source bytes | HTTP **200**; GitHub source file text **exact match** | Vercel authorized fetch + GitHub `fetch_file(ref=d028fe12…)` | **PASS (HTTP/source only)** |
| D6-06 | 2026-10-10 11:13–11:19 JST | Vercel authenticated HTTP, no GUI / browser N/A | `d028fe12658423aa4408058048e2d6545ad78893` / `dpl_Axx51igvTjRo5JsBYJJDPujV2sp1` | `/lessons/index.json` | GET URL; read against GitHub production SHA | HTTP 200 and identical source bytes | HTTP **200**; GitHub source file text **exact match** | Vercel authorized fetch + GitHub `fetch_file(ref=d028fe12…)` | **PASS (HTTP/source only)** |
| D6-07 | 2026-10-10 11:13–11:19 JST | Vercel authenticated HTTP, no GUI / browser N/A | `d028fe12658423aa4408058048e2d6545ad78893` / `dpl_Axx51igvTjRo5JsBYJJDPujV2sp1` | `/learn/security-identity-proofing-authn-authz.html` | GET URL; read against GitHub production SHA | HTTP 200 and identical source bytes | HTTP **200**; GitHub source file text **exact match** | Vercel authorized fetch + GitHub `fetch_file(ref=d028fe12…)` | **PASS (HTTP/source only)** |
| D6-08 | 2026-10-10 11:13–11:19 JST | Vercel authenticated HTTP, no GUI / browser N/A | `d028fe12658423aa4408058048e2d6545ad78893` / `dpl_Axx51igvTjRo5JsBYJJDPujV2sp1` | `/learn/security-sessions-federation-oauth-oidc-saml.html` | GET URL; read against GitHub production SHA | HTTP 200 and identical source bytes | HTTP **200**; GitHub source file text **exact match** | Vercel authorized fetch + GitHub `fetch_file(ref=d028fe12…)` | **PASS (HTTP/source only)** |
| D6-09 | 2026-10-10 11:13–11:19 JST | Vercel authenticated HTTP, no GUI / browser N/A | `d028fe12658423aa4408058048e2d6545ad78893` / `dpl_Axx51igvTjRo5JsBYJJDPujV2sp1` | `/learn/security-cloud-shared-responsibility-iam-config.html` | GET URL; read against GitHub production SHA | HTTP 200 and identical source bytes | HTTP **200**; GitHub source file text **exact match** | Vercel authorized fetch + GitHub `fetch_file(ref=d028fe12…)` | **PASS (HTTP/source only)** |
| D6-10 | 2026-10-10 11:13–11:19 JST | Vercel authenticated HTTP, no GUI / browser N/A | `d028fe12658423aa4408058048e2d6545ad78893` / `dpl_Axx51igvTjRo5JsBYJJDPujV2sp1` | `/learn/security-risk-assessment.html` | GET URL; read against GitHub production SHA | HTTP 200 and identical source bytes | HTTP **200**; GitHub source file text **exact match** | Vercel authorized fetch + GitHub `fetch_file(ref=d028fe12…)` | **PASS (HTTP/source only)** |
| D6-11 | 2026-10-10 11:13–11:19 JST | Vercel authenticated HTTP, no GUI / browser N/A | `d028fe12658423aa4408058048e2d6545ad78893` / `dpl_Axx51igvTjRo5JsBYJJDPujV2sp1` | `/learn/security-email-spf-dkim-dmarc.html` | GET URL; read against GitHub production SHA | HTTP 200 and identical source bytes | HTTP **200**; GitHub source file text **exact match** | Vercel authorized fetch + GitHub `fetch_file(ref=d028fe12…)` | **PASS (HTTP/source only)** |
| D6-12 | 2026-10-10 11:13–11:19 JST | Vercel authenticated HTTP, no GUI / browser N/A | `d028fe12658423aa4408058048e2d6545ad78893` / `dpl_Axx51igvTjRo5JsBYJJDPujV2sp1` | `/learn/security-social-engineering-bec-phishing.html` | GET URL; read against GitHub production SHA | HTTP 200 and identical source bytes | HTTP **200**; GitHub source file text **exact match** | Vercel authorized fetch + GitHub `fetch_file(ref=d028fe12…)` | **PASS (HTTP/source only)** |
| D6-13 | 2026-10-10 11:13–11:19 JST | Vercel authenticated HTTP, no GUI / browser N/A | `d028fe12658423aa4408058048e2d6545ad78893` / `dpl_Axx51igvTjRo5JsBYJJDPujV2sp1` | `/learn/security-malware-ransomware.html` | GET URL; read against GitHub production SHA | HTTP 200 and identical source bytes | HTTP **200**; GitHub source file text **exact match** | Vercel authorized fetch + GitHub `fetch_file(ref=d028fe12…)` | **PASS (HTTP/source only)** |
| D6-14 | 2026-10-10 11:13–11:19 JST | Vercel authenticated HTTP, no GUI / browser N/A | `d028fe12658423aa4408058048e2d6545ad78893` / `dpl_Axx51igvTjRo5JsBYJJDPujV2sp1` | `/learn/security-credential-session-attacks.html` | GET URL; read against GitHub production SHA | HTTP 200 and identical source bytes | HTTP **200**; GitHub source file text **exact match** | Vercel authorized fetch + GitHub `fetch_file(ref=d028fe12…)` | **PASS (HTTP/source only)** |

- 14/14 URLがHTTP 200、14/14ファイルが対応する**旧production sourceのGitHub内容と全文一致**。HTML `/` に `#play-pause`、`#learn-course-player`、`#learn-course-sources` があり、8件のLearn HTMLに `#learn-article`、`#speech-play`、`section.sources` があることを文字列ベースで確認。
- `/courses/index.json`、`/lessons/index.json` はJSON解析成功。`lessons`配列に158件あるが、新しい専門30章の受入や採点・実操作を意味しない。Course I〜IVの全遷移・旧入門8章の操作はこの実測範囲外。
- `learn/course-player.js` には `section.sources`、`learn-course-sources`、`finishChapter`、`loadChapter` の実装参照がある。**章ごとの出典差替えや最終停止が実動作した証拠はない**。
- 本番の本人確認・Federation・Cloudの3HTMLは**旧source**と一致。これらのHTTP 200を新#117候補の配信済み証拠にはしない。

### 9.3 本番実利用・GUI・音声（未試行は未試行）

| test_id | date_time_JST | environment / device/browser_version | deployment_SHA/ID | URL | operation | expected | observed | evidence | verdict |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| D6-15 | 2026-10-10 11:19 JST | Desktop GUI / desktop browser N/A | prod `d028fe12…` / `dpl_Axx…` | `https://rsvp-learning-kappa.vercel.app/` + relevant path | top → Course → RSVP/速度/停止 → Learn/source → 一覧 | GUI操作と描画が正しい | 実操作なし; DOM/JS静的照合のみ | no real-device/browser/learner evidence; test NOT_RUN | **NOT_VERIFIED** |
| D6-16 | 2026-10-10 11:19 JST | 390px GUI / mobile viewport/browser N/A | prod `d028fe12…` / `dpl_Axx…` | `https://rsvp-learning-kappa.vercel.app/` + relevant path | 390px幅で横はみ出し/タッチ/ボタン状態 | 表示と操作が正常 | レンダリング・スクリーンショットなし | no real-device/browser/learner evidence; test NOT_RUN | **NOT_VERIFIED** |
| D6-17 | 2026-10-10 11:19 JST | Course I/III/IV transitions / browser N/A | prod `d028fe12…` / `dpl_Axx…` | `https://rsvp-learning-kappa.vercel.app/` + relevant path | 初章→中章→終章の連続再生、章末自動切替、出典更新、最後で停止 | 章遷移と出典更新・最終停止 | JSに `finishChapter`・`loadChapter`・`section.sources` の文字列はあるが実動作なし | no real-device/browser/learner evidence; test NOT_RUN | **NOT_VERIFIED** |
| D6-18 | 2026-10-10 11:19 JST | Android Chrome / Android device N/A | prod `d028fe12…` / `dpl_Axx…` | `https://rsvp-learning-kappa.vercel.app/` + relevant path | モデル/OS/Chrome/表示幅/タップ/横はみ出し | 実機で操作が成立 | Android端末未接続; バージョン不明 | no real-device/browser/learner evidence; test NOT_RUN | **NOT_VERIFIED** |
| D6-19 | 2026-10-10 11:19 JST | Web Speech API / Android or desktop real audio N/A | prod `d028fe12…` / `dpl_Axx…` | `https://rsvp-learning-kappa.vercel.app/` + relevant path | 単章/コースの日本語発話、声/速度/停止/ハイライト | 実際に聴取できる | 発話・音声聴取なし | no real-device/browser/learner evidence; test NOT_RUN | **NOT_VERIFIED** |
| D6-20 | 2026-10-10 11:19 JST | Chrome Read Aloud / Android Chrome native feature N/A | prod `d028fe12…` / `dpl_Axx…` | `https://rsvp-learning-kappa.vercel.app/` + relevant path | Chromeメニュー「このページを読み上げ」 | 機能利用と音声確認 | Chrome標準読み上げの操作なし | no real-device/browser/learner evidence; test NOT_RUN | **NOT_VERIFIED** |
| D6-21 | 2026-10-10 11:19 JST | Screen-off/background / Android Chrome N/A | prod `d028fe12…` / `dpl_Axx…` | `https://rsvp-learning-kappa.vercel.app/` + relevant path | 画面OFF/バックグラウンドで音声継続 | 期待挙動を実測 | 画面状態・バックグラウンド試行なし | no real-device/browser/learner evidence; test NOT_RUN | **NOT_VERIFIED** |
| D6-22 | 2026-10-10 11:19 JST | Anonymous access / anonymous browser N/A | prod `d028fe12…` / `dpl_Axx…` | `https://rsvp-learning-kappa.vercel.app/` + relevant path | 未ログインでURLアクセス | 公開境界に沿うアクセス制御 | Vercel認証済み代理取得のみ。匿名ブラウザ未試行 | no real-device/browser/learner evidence; test NOT_RUN | **NOT_VERIFIED** |
| D6-23 | 2026-10-10 11:19 JST | Comprehension / real learners N/A | prod `d028fe12…` / `dpl_Axx…` | `https://rsvp-learning-kappa.vercel.app/` + relevant path | 20問の実回答・採点/分布 | 測定可能な回答結果 | ユーザー回答/音声学習結果を収集していない | no real-device/browser/learner evidence; test NOT_RUN | **NOT_VERIFIED** |

未接続Androidの機種・OS/Chrome版を推測記入しない。録音、閲覧履歴、Cookie、トークン、学習者の回答等を採取していない。**実機のNOT_VERIFIEDは静的PASSを取り消さない一方、静的PASSから実操作PASSを推測しない。**

### 9.4 Dのリリース依存と追試

1. **新production検証は未着手（理由: E-2 release未実施）。** #117最新版のP1修正→BのLearn意味同期→E-1候補の固定→Cの候補head固有の独立受入→E-2期待head固定merge・新main Test成功→Vercel production/alias/source/SSOの読戻し、の後にのみDが新版を測定する。今回旧本番の検証が済んでもrelease gateは開かない。
2. **新本番が出た場合:** 本番の新 `main full SHA`・deployment ID・target・READY・alias・SSOと保護設定をfresh readし、D6-01〜14を**新production sourceに対し全URL再実行**。改訂3章でLearnの本文と出典が表示できることを個別に確認し、旧版PASSを継承しない。
3. **GUI操作の最小手順:** desktopと390pxでトップ→Course選択→RSVP再生/一時停止/前後・速度/停止→対象3章Learn単章→出典リンク→Course I/III/IVの初・中・終章の自動遷移・章別出典差替え→最終停止→一覧へ戻る。URLと時刻、source SHA、端末/ブラウザ版、期待・観測・スクリーンショット（機微情報除外）を別行記録。
4. **Android最小手順:** Android Chromeで表示幅・機種・OS/Chrome版を記録し、Web Speech APIの**実際の日本語発話・音声変更・速度変更・停止・ハイライト**とChrome標準「このページを読み上げ」を**別試験**。保護ページで標準読み上げが使えなければ、その状況をBLOCKED/NOT_VERIFIEDとして記載。画面OFF/バックグラウンド、横はみ出し、タッチ操作、出典・章末停止を実測したものだけ採用。
5. **20問・Course V:** 文書に20問と採点条件があることは受講効果ではない。実受講者の回答と成績はNOT_VERIFIED。Course V-1/V-2はHOLD、残27章の専門深度全数再監査なし。RSVP private / Instant Radio public境界は不変更。

**D最終引継ぎ: `PARTIAL_WITH_GAPS`。** 旧本番のVercel API・14静的URL/source一致だけ限定PASS。新#117改訂3章の本番配信、desktop/390px、Android、2種類の読み上げ、連続再生実動作、受講結果は未検証。**本文・player・Catalog・本番配信・公開設定にDは変更を加えない。** 本節はE統合前のbaselineであり、独立C受入・E releaseを代行しない。


---

## 10. 2026-10-10 JST — Learn alignment Wave / D current-production baseline

**担当・判定:** Library `/RSVP Learning/Work Instructions/2026-10-10_security_learning_learn_alignment_independent_acceptance_and_release_closure_wave_instructions.md` §8、Worker D。**`PARTIAL_WITH_GAPS`（旧本番静的QAに限定）**。新3章のrelease gateを開いたという意味ではない。今回の連携操作は2026-10-10 **20:06–20:13 JST**のセッション内。APIの個別リクエスト時刻は採取しておらず、表の時間帯は各リクエストの正確な送信時刻を意味しない。

### 10.1 Fresh source / release boundary（同時実行によるSHA変化を分離）

- 着手時のGitHub `main` は `62b63da394ae7b60b234566331d8905dceac4e80`。確認途中に文書のみのPR [#126](https://github.com/Josh-Temple/rsvp-learning/pull/126)が取り込まれ、**20:13 JST頃の再読時 `main=c6869b0231f401a545b5bb551a38e98ef0a27fc3`**、[main Test #38047456642](https://github.com/Josh-Temple/rsvp-learning/actions/runs/38047456642)は `completed/success`。そのコミットの変更は `docs/SECURITY_LEARNING_INTEGRATION_2026-10-08.md` のみ。**mainのSHA進行を新教材の本番反映とはしない**。
- 対象Draft [PR #117](https://github.com/Josh-Temple/rsvp-learning/pull/117) は着手時head `a5ccc9a442c00b546f6f50f7549f812253b15b29`、後の再読では `af3249f19a79727c556945e7d53e6bcb837d8f05` に進行したが、`open/draft/unmerged`。最終candidate headの独立C受入やE-2の新production配信をDが確認したものではない。旧headへのC判断や旧runの成功を新headへ継承しない。
- **現行production** は Vercel project `rsvp-learning` / `prj_7yYGl5D3Q7UwQgQuXaGmOYLkTzbu`、alias `rsvp-learning-kappa.vercel.app` → `dpl_7bQrnHpAhNf4dhjLK54Qex5yxf6t`、`READY`、`target=production`、`meta.githubCommitSha=23a007f343456ae2e6cca14d3ab849ed07b27deb`。作業終盤のalias/project再読でも deployment ID は不変。SSO `enabled=true` / `deploymentType=all_except_custom_domains`、password protection disabled。設定は変更していない。
- 前回D §9の **14/14** は `d028fe12658423aa4408058048e2d6545ad78893` / `dpl_Axx51igvTjRo5JsBYJJDPujV2sp1` への限定結果。今回は異なる**旧本番source `23a007f3…`** を実測した。GitHub compare `23a007f3…62b63da3` は ahead 3、差分は3つの監査・統合・QA文書のみ。さらに `c6869b…` はE統合文書のみの変更。教材本体へのmergeはこの差に含まれない。
- `docs/PUBLIC_LISTENING_BOUNDARY_2026-10-08.md` をmainから確認。private RSVP / public Instant Radio分離を維持。今回の検証は保護されたVercel連携の一時的な認証経路を利用した取得であり、**匿名ブラウザのアクセス成立・ブラウザGUI動作を検証したものではない**。Cookie、トークン、回答、録音、履歴は保存していない。

### 10.2 URL別 static HTTP / GitHub source一致

**方法:** alias上の各URLをVercelの権限付き `web_fetch_vercel_url` で取得し、当該deploymentの **GitHub source SHA `23a007f3…`** に固定した `fetch_file` の文字列と照合した。表中の相対URLは `https://rsvp-learning-kappa.vercel.app` に連結。トップ `/` は `index.html` と比較。これはレスポンス文字列一致であり、レンダリング・操作・発声・匿名アクセスの合格ではない。ツールの安全審査によるブロックはHTTPの4xx/5xxではない。

| test_id | date_time_JST | environment | device/browser_version | deployment_SHA/ID | URL | operation | expected | observed | evidence | verdict |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| D7-01 | 2026-10-10 20:06–20:13 JST（個別時刻ログなし） | Vercel認証済みHTTP・GUIなし | N/A / N/A | `23a007f343456ae2e6cca14d3ab849ed07b27deb` / `dpl_7bQrnHpAhNf4dhjLK54Qex5yxf6t` | `/` | GETと同一production SHAのGitHub原文比較 | HTTP 200・全文一致 | HTTP 200。GitHub production source全文一致 | Vercel web_fetch連携、GitHub fetch_file(ref=23a007f3…) | **PASS (静的HTTP/sourceのみ)** |
| D7-02 | 2026-10-10 20:06–20:13 JST（個別時刻ログなし） | Vercel認証済みHTTP・GUIなし | N/A / N/A | `23a007f343456ae2e6cca14d3ab849ed07b27deb` / `dpl_7bQrnHpAhNf4dhjLK54Qex5yxf6t` | `/app.js` | GETと同一production SHAのGitHub原文比較 | HTTP 200・全文一致 | HTTP 200。GitHub production source全文一致 | Vercel web_fetch連携、GitHub fetch_file(ref=23a007f3…) | **PASS (静的HTTP/sourceのみ)** |
| D7-03 | 2026-10-10 20:06–20:13 JST（個別時刻ログなし） | Vercel認証済みHTTP・GUIなし | N/A / N/A | `23a007f343456ae2e6cca14d3ab849ed07b27deb` / `dpl_7bQrnHpAhNf4dhjLK54Qex5yxf6t` | `/learn/learn.js` | GETと同一production SHAのGitHub原文比較 | HTTP 200・全文一致 | HTTP 200。GitHub production source全文一致 | Vercel web_fetch連携、GitHub fetch_file(ref=23a007f3…) | **PASS (静的HTTP/sourceのみ)** |
| D7-04 | 2026-10-10 20:06–20:13 JST（個別時刻ログなし） | Vercel認証済みHTTP・GUIなし | N/A / N/A | `23a007f343456ae2e6cca14d3ab849ed07b27deb` / `dpl_7bQrnHpAhNf4dhjLK54Qex5yxf6t` | `/learn/course-player.js` | GETと同一production SHAのGitHub原文比較 | HTTP 200・全文一致 | HTTP 200。GitHub production source全文一致 | Vercel web_fetch連携、GitHub fetch_file(ref=23a007f3…) | **PASS (静的HTTP/sourceのみ)** |
| D7-05 | 2026-10-10 20:06–20:13 JST（個別時刻ログなし） | Vercel認証済みHTTP・GUIなし | N/A / N/A | `23a007f343456ae2e6cca14d3ab849ed07b27deb` / `dpl_7bQrnHpAhNf4dhjLK54Qex5yxf6t` | `/courses/index.json` | GETと同一production SHAのGitHub原文比較 | HTTP 200・全文一致 | HTTP 200。GitHub production source全文一致 | Vercel web_fetch連携、GitHub fetch_file(ref=23a007f3…) | **PASS (静的HTTP/sourceのみ)** |
| D7-06 | 2026-10-10 20:06–20:13 JST（個別時刻ログなし） | Vercel認証済みHTTP・GUIなし | N/A / N/A | `23a007f343456ae2e6cca14d3ab849ed07b27deb` / `dpl_7bQrnHpAhNf4dhjLK54Qex5yxf6t` | `/lessons/index.json` | GETと同一production SHAのGitHub原文比較 | HTTP 200・全文一致 | HTTP 200。GitHub production source全文一致 | Vercel web_fetch連携、GitHub fetch_file(ref=23a007f3…) | **PASS (静的HTTP/sourceのみ)** |
| D7-07 | 2026-10-10 20:06–20:13 JST（個別時刻ログなし） | Vercel認証済みHTTP・GUIなし | N/A / N/A | `23a007f343456ae2e6cca14d3ab849ed07b27deb` / `dpl_7bQrnHpAhNf4dhjLK54Qex5yxf6t` | `/learn/security-identity-proofing-authn-authz.html` | GETと同一production SHAのGitHub原文比較 | HTTP 200・全文一致 | HTTP 200。GitHub production source全文一致。出典 section は article 外 | Vercel web_fetch連携、GitHub fetch_file(ref=23a007f3…) | **PASS (静的HTTP/sourceのみ)** |
| D7-08 | 2026-10-10 20:06–20:13 JST（個別時刻ログなし） | Vercel認証済みHTTP・GUIなし | N/A / N/A | `23a007f343456ae2e6cca14d3ab849ed07b27deb` / `dpl_7bQrnHpAhNf4dhjLK54Qex5yxf6t` | `/learn/security-sessions-federation-oauth-oidc-saml.html` | GETと同一production SHAのGitHub原文比較 | HTTP 200・全文一致 | HTTP 200。GitHub production source全文一致。出典 section は article 外 | Vercel web_fetch連携、GitHub fetch_file(ref=23a007f3…) | **PASS (静的HTTP/sourceのみ)** |
| D7-09 | 2026-10-10 20:06–20:13 JST（個別時刻ログなし） | Vercel認証済みHTTP・GUIなし | N/A / N/A | `23a007f343456ae2e6cca14d3ab849ed07b27deb` / `dpl_7bQrnHpAhNf4dhjLK54Qex5yxf6t` | `/learn/security-cloud-shared-responsibility-iam-config.html` | GETと同一production SHAのGitHub原文比較 | HTTP 200・全文一致 | HTTP 200。GitHub production source全文一致。出典 section は article 外 | Vercel web_fetch連携、GitHub fetch_file(ref=23a007f3…) | **PASS (静的HTTP/sourceのみ)** |
| D7-10 | 2026-10-10 20:06–20:13 JST（個別時刻ログなし） | Vercel認証済みHTTP・GUIなし | N/A / N/A | `23a007f343456ae2e6cca14d3ab849ed07b27deb` / `dpl_7bQrnHpAhNf4dhjLK54Qex5yxf6t` | `/learn/security-risk-assessment.html` | GETと同一production SHAのGitHub原文比較 | HTTP 200・全文一致 | 連携呼出しがツールの安全性審査でブロック。HTTP応答自体は未観測 | Vercel web_fetch連携、GitHub fetch_file(ref=23a007f3…)。ツール安全性ブロック | **BLOCKED** |
| D7-11 | 2026-10-10 20:06–20:13 JST（個別時刻ログなし） | Vercel認証済みHTTP・GUIなし | N/A / N/A | `23a007f343456ae2e6cca14d3ab849ed07b27deb` / `dpl_7bQrnHpAhNf4dhjLK54Qex5yxf6t` | `/learn/security-email-spf-dkim-dmarc.html` | GETと同一production SHAのGitHub原文比較 | HTTP 200・全文一致 | HTTP 200。GitHub production source全文一致 | Vercel web_fetch連携、GitHub fetch_file(ref=23a007f3…) | **PASS (静的HTTP/sourceのみ)** |
| D7-12 | 2026-10-10 20:06–20:13 JST（個別時刻ログなし） | Vercel認証済みHTTP・GUIなし | N/A / N/A | `23a007f343456ae2e6cca14d3ab849ed07b27deb` / `dpl_7bQrnHpAhNf4dhjLK54Qex5yxf6t` | `/learn/security-social-engineering-bec-phishing.html` | GETと同一production SHAのGitHub原文比較 | HTTP 200・全文一致 | HTTP 200。GitHub production source全文一致 | Vercel web_fetch連携、GitHub fetch_file(ref=23a007f3…) | **PASS (静的HTTP/sourceのみ)** |
| D7-13 | 2026-10-10 20:06–20:13 JST（個別時刻ログなし） | Vercel認証済みHTTP・GUIなし | N/A / N/A | `23a007f343456ae2e6cca14d3ab849ed07b27deb` / `dpl_7bQrnHpAhNf4dhjLK54Qex5yxf6t` | `/learn/security-malware-ransomware.html` | GETと同一production SHAのGitHub原文比較 | HTTP 200・全文一致 | 連携呼出しがツールの安全性審査でブロック。HTTP応答自体は未観測 | Vercel web_fetch連携、GitHub fetch_file(ref=23a007f3…)。ツール安全性ブロック | **BLOCKED** |
| D7-14 | 2026-10-10 20:06–20:13 JST（個別時刻ログなし） | Vercel認証済みHTTP・GUIなし | N/A / N/A | `23a007f343456ae2e6cca14d3ab849ed07b27deb` / `dpl_7bQrnHpAhNf4dhjLK54Qex5yxf6t` | `/learn/security-credential-session-attacks.html` | GETと同一production SHAのGitHub原文比較 | HTTP 200・全文一致 | HTTP 200。GitHub production source全文一致 | Vercel web_fetch連携、GitHub fetch_file(ref=23a007f3…) | **PASS (静的HTTP/sourceのみ)** |
| D7-15 | 2026-10-10 20:06–20:13 JST（個別時刻ログなし） | Vercel認証済みHTTP・GUIなし | N/A / N/A | `23a007f343456ae2e6cca14d3ab849ed07b27deb` / `dpl_7bQrnHpAhNf4dhjLK54Qex5yxf6t` | `/styles.css` | GETと同一production SHAのGitHub原文比較 | HTTP 200・全文一致 | HTTP 200。GitHub production source全文一致 | Vercel web_fetch連携、GitHub fetch_file(ref=23a007f3…) | **PASS (静的HTTP/sourceのみ)** |
| D7-16 | 2026-10-10 20:06–20:13 JST（個別時刻ログなし） | Vercel認証済みHTTP・GUIなし | N/A / N/A | `23a007f343456ae2e6cca14d3ab849ed07b27deb` / `dpl_7bQrnHpAhNf4dhjLK54Qex5yxf6t` | `/learn/learn.css` | GETと同一production SHAのGitHub原文比較 | HTTP 200・全文一致 | HTTP 200。GitHub production source全文一致 | Vercel web_fetch連携、GitHub fetch_file(ref=23a007f3…) | **PASS (静的HTTP/sourceのみ)** |

**集計:** 16 URL中 **14 URLでHTTP 200かつsource全文一致**、2 URLはツールの安全性確認で取得がブロックされ**HTTP statusを観測できなかった**。新版3章の3つのLearn HTMLは **旧production版に対する3/3一致**で、3つとも出典sectionがarticle外にある静的構造を確認した。ただし、**PR #117の修正Learnの配信済み証拠ではない**。ブロックされた2 URLのサイト側可否や機能障害は判定しない。旧§9の14/14を今回の16件に加算しない。

### 10.3 実ブラウザ / Android / audio / learner outcomes

| test_id | date_time_JST | environment / device/browser_version | deployment_SHA/ID | URL | operation | expected | observed | evidence | verdict |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| D7-17 | 2026-10-10 20:13 JST（未実施確認時刻） | Desktop GUI / desktop browser 未接続 | `23a007f3…` / `dpl_7bQrn…`（旧本番） | `https://rsvp-learning-kappa.vercel.app/` と対応ページ | トップ→Course→RSVP・速度・前後・一時停止・停止→Learn→出典→一覧復帰 | 実操作・実観測による判定 | 実施なし | 実ブラウザ・端末・受講者証拠なし | **NOT_VERIFIED** |
| D7-18 | 2026-10-10 20:13 JST（未実施確認時刻） | 390px mobile viewport / browser 未接続 | `23a007f3…` / `dpl_7bQrn…`（旧本番） | `https://rsvp-learning-kappa.vercel.app/` と対応ページ | 横はみ出し・タッチ・画面遷移・コントロール状態 | 実操作・実観測による判定 | 実施なし | 実ブラウザ・端末・受講者証拠なし | **NOT_VERIFIED** |
| D7-19 | 2026-10-10 20:13 JST（未実施確認時刻） | Desktop/390px / browser 未接続 | `23a007f3…` / `dpl_7bQrn…`（旧本番） | `https://rsvp-learning-kappa.vercel.app/` と対応ページ | Course I/III/IV 初・中・終章連続再生、章毎の出典差替え、最終停止 | 実操作・実観測による判定 | 実施なし | 実ブラウザ・端末・受講者証拠なし | **NOT_VERIFIED** |
| D7-20 | 2026-10-10 20:13 JST（未実施確認時刻） | Android Chrome / 実機未接続（機種・OS・Chrome版不明） | `23a007f3…` / `dpl_7bQrn…`（旧本番） | `https://rsvp-learning-kappa.vercel.app/` と対応ページ | 表示幅・タッチ・横はみ出し・長時間章送り | 実操作・実観測による判定 | 実施なし | 実ブラウザ・端末・受講者証拠なし | **NOT_VERIFIED** |
| D7-21 | 2026-10-10 20:13 JST（未実施確認時刻） | Web Speech API / 実発話・聴取なし | `23a007f3…` / `dpl_7bQrn…`（旧本番） | `https://rsvp-learning-kappa.vercel.app/` と対応ページ | 日本語音声・voice・速度・一時停止・停止・ハイライト | 実操作・実観測による判定 | 実施なし | 実ブラウザ・端末・受講者証拠なし | **NOT_VERIFIED** |
| D7-22 | 2026-10-10 20:13 JST（未実施確認時刻） | Chrome標準読み上げ / 実機未接続 | `23a007f3…` / `dpl_7bQrn…`（旧本番） | `https://rsvp-learning-kappa.vercel.app/` と対応ページ | Chrome『このページを読み上げ』実操作・聴取 | 実操作・実観測による判定 | 実施なし | 実ブラウザ・端末・受講者証拠なし | **NOT_VERIFIED** |
| D7-23 | 2026-10-10 20:13 JST（未実施確認時刻） | Android Chrome / 画面OFF・背景化の操作なし | `23a007f3…` / `dpl_7bQrn…`（旧本番） | `https://rsvp-learning-kappa.vercel.app/` と対応ページ | 画面OFF/バックグラウンド時の音声継続と復帰 | 実操作・実観測による判定 | 実施なし | 実ブラウザ・端末・受講者証拠なし | **NOT_VERIFIED** |
| D7-24 | 2026-10-10 20:13 JST（未実施確認時刻） | 匿名ブラウザ / 未接続 | `23a007f3…` / `dpl_7bQrn…`（旧本番） | `https://rsvp-learning-kappa.vercel.app/` と対応ページ | SSO下の匿名アクセス可否 | 実操作・実観測による判定 | 実施なし | 実ブラウザ・端末・受講者証拠なし | **NOT_VERIFIED** |
| D7-25 | 2026-10-10 20:13 JST（未実施確認時刻） | 実受講者 / 回答データなし | `23a007f3…` / `dpl_7bQrn…`（旧本番） | `https://rsvp-learning-kappa.vercel.app/` と対応ページ | 既存20問の回答・採点分布・理解度 | 実操作・実観測による判定 | 実施なし | 実ブラウザ・端末・受講者証拠なし | **NOT_VERIFIED** |

**解釈:** URL/APIの静的PASSは上記実動作のPASSではない。実ブラウザとAndroid実機、Web Speech、Chrome標準の読み上げ、最終章停止、20問の実回答は今セッションでは実測していない。SSO配下で標準読み上げが利用可能かも未試行のため`NOT_VERIFIED`。HTTPを取得できたことから匿名利用可能と断定しない。

### 10.4 Eへのhandoffと再実行条件

1. **現時点の新production QAは条件不成立:** A/Bの意味同期、E-1の固定candidate、**同一head**へのC独立`ACCEPTED_FOR_MERGE`、E-2のexpected-head merge /新main head固有Test success /本番 `READY`・`target=production`・source/alias/SSO readbackが先行条件。新headが変われば旧C署名は使えない。
2. E-2が配信した場合に限り、Dは **新production deployment ID・source full SHA** を再取得し、上記 D7-01〜D7-16 を**新版sourceと照合して再実行**。2件の安全ツールブロックは再評価が必要だが、回避策としてSSO・サイト保護を無断変更しない。旧本番のHTTP成功を移植しない。
3. 実ブラウザが利用できる場合はdesktopおよび390pxでトップ→Course選択→RSVP再生/停止・速度・前後→Learn 3章/出典→Course I/III/IVの初・中・終章連続再生/出典差替え/最終停止→一覧復帰を操作し、URL・version・時刻・スクリーンショット（機微情報なし）を別行で記録。Androidは機種・Android/Chrome版・表示幅・タッチ・画面OFF・背景再生、Web Speech実発声とChrome標準読み上げを**別検査**として記録。
4. 20問のドキュメント・設問監査を実回答や学習効果と混同しない。Course V-1 / V-2は引き続きHOLD。RSVP private / public Instant Radioは不変更。

**D終了判定:** `PARTIAL_WITH_GAPS`（現行旧本番の静的HTTP/source 14 PASS + 2 BLOCKED、GUI/端末/音声/受講結果は NOT_VERIFIED）。**現行本番に新3章は未反映**。Dは教材・テスト・player・Catalog・localStorage・Vercelデプロイ・SSOを変更しない。本節はE/Cの受入・merge/deployを代行しない。
