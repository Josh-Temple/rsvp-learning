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

- 指示: Library \`/RSVP Learning/Work Instructions/2026-10-09_security_learning_independent_validation_and_depth_expansion_wave_instructions.md\` Section 6。
- GitHub: \`Josh-Temple/rsvp-learning\` private / default \`main\`、実行開始時main **\`fd003b63b816799dd8f1f1eac0de4fd70db32da9\`**（GitHubの直近コミット検索・当該refのファイル読取で照合）。
- Open PR: GitHub個別照会で旧Draft **#6**（head \`889aa99005afceb0c0f69ceb212fa3090bfc08a1\`、照会時base \`b0b37d3f676b9cd7b17d29bc0d095b9f60c1f77f\`）と別件 **#29**（head \`fa846811d5e32cba9ab7e3a45e43f2cddf8a2bea\`、照会時base \`1fffa341f7b86e41050c192ffba7de2bdc008c8\`）を確認。いずれも**範囲外・非変更**。検索APIによるopen PR一覧は空応答であり、一覧の網羅性は保証しない。前Waveの関連 #95〜#100 はclosed/統合記録と照合。今WaveのA/B/Cの新規作業は本Dの確定的な監査対象ではない。
- 配信先: Vercel project \`rsvp-learning\`、project ID \`prj_7yYGl5D3Q7UwQgQuXaGmOYLkTzbu\`。production deployment **\`dpl_CYHqCXPTCoEqH3r9QDK66XLiy5fN\`**、**READY**、metadataの \`githubCommitSha=fd003b63b816799dd8f1f1eac0de4fd70db32da9\`、production alias \`rsvp-learning-kappa.vercel.app\` が同deploymentに存在することをAPIで確認。今回の調査時点では**本番配信コードのGit SHAと開始main SHAが一致**する。
- Vercel project設定: \`ssoProtection.enabled=true\`, \`deploymentType=all_except_custom_domains\`。連携の取得成功を「匿名ユーザーが到達できる」と読み替えない。
- 旧snapshotのproduction SHA差、出典欠落、RSVP Pages workflowの記録は**当時の事実として維持**する。#99 の出典表示修正と \`PUBLIC_LISTENING_BOUNDARY_2026-10-08.md\` によるPages方針変更を反映した**新しい観測**を以下に記録する。

### 6.1 テスト環境・証拠の種類

| 種別 | 実行したこと | 実行していないこと |
|---|---|---|
| Vercel API | project/deployment/alias/READY/ソースSHA/保護設定の取得 | browser rendering / clicking / audio |
| Vercel HTTP代理取得 | 正規production URLのHTML/JS/JSON/代表Lesson HTMLのレスポンス本文とHTTP statusを確認 | 匿名の一般ブラウザでの通信・Cookie・操作の保証 |
| GitHub API | private main、#6/#29、既存QA/統合/公開境界、player/app/テスト/カタログの現行ファイル照合 | 全Action runの網羅的列挙、今回のnpmローカル実行 |
| ローカル環境 | Chromiumバイナリの存在を確認。productionホストのDNS解決を試みたが \`gaierror: Temporary failure in name resolution\` | productionへのChromium実アクセス、390px画面描画、実機・音声 |
| 汎用Webアクセス | productionトップと代表Learn URLを試したが「このツールではアクセス不能」 | この結果だけからSSO、公開範囲、恒常的障害の原因を断定 |

### 6.2 本番配信・静的整合性の測定

**base URL:** \`https://rsvp-learning-kappa.vercel.app/\`。各パスのHTTP 200はVercel連携経由の結果である。

| test_id | environment / device / browser | URL・操作・期待結果 | 実測・evidence | 判定 |
|---|---|---|---|---|
| D-20261009-01 | Vercel API / device N/A | production READY、alias、source SHA | READY、3 aliasのうち \`rsvp-learning-kappa.vercel.app\` が存在。source SHA=開始main SHA。deployment \`dpl_CYHqCXPTCoEqH3r9QDK66XLiy5fN\` | **PASS（APIのみ）** |
| D-20261009-02 | HTTP代理取得 / browser N/A | \`/\` にRSVP・Course Learn・章別出典のDOM | HTTP 200。RSVP速度 \`#speed\`、\`#learn-course-player\`、\`#learn-course-sources\`、単章出典 \`#source-section\` の存在 | **PASS（静的）** |
| D-20261009-03 | HTTP代理取得 / browser N/A | \`/app.js\`、\`/learn/learn.js\`、\`/learn/course-player.js\` が配信される | すべてHTTP 200。追加で \`index.html\` / \`learn/learn.js\` / \`learn/course-player.js\` は開始mainに固定したGitHub本文と**文字列全体一致** | **PASS（配信・3ファイル一致）** |
| D-20261009-04 | HTTP代理取得 / browser N/A | \`/courses/index.json\`、\`/lessons/index.json\` の取得と解析 | 双方HTTP 200、JSON解析可能。専門Course I〜IV \`security-foundations-risk=7\`、\`security-threat-flow=7\`、\`security-identity-crypto=8\`、\`security-network-cloud=8\` で**計30章**を確認（別の入門章を含めない） | **PASS（取得と一覧構造）** |
| D-20261009-05 | HTTP代理取得 / browser N/A | 既改稿8章の単章Learn HTMLに本文・操作・出典が存在 | **8/8 HTTP 200**、各HTMLに \`#learn-article\`、\`#speech-play\`、\`section.sources\`。HTML内のHTTP(S)出典リンク数は後述の順に **3 / 6 / 4 / 4 / 4 / 4 / 4 / 4** | **PASS（8章の静的構造）** |
| D-20261009-06 | 配信済みplayer JS + mainテスト / browser N/A | 連続再生で章別出典を本文とは別表示し、章切替で上書き・非表示にする | \`parseArticle()\` が \`section.sources\` を取得。\`loadChapter()\` が \`sources.innerHTML = parsed.citations\` と \`sources.hidden = !parsed.citations.trim()\` を実行。専用DOM \`#learn-course-sources\` と構造検査を確認。#99修正後のコードがproductionにある | **PASS（静的修正実装のみ）**。実画面の切替は **NOT_VERIFIED** |
| D-20261009-07 | 配信済みplayer JS / browser N/A | Course連続再生、章末自動切替、最後で停止、前後移動、戻り、速度・音声 | \`SpeechSynthesisUtterance.onend\` → \`speakCurrent()\` → \`finishChapter()\` → \`loadChapter(next)\` の実装あり。最終章は \`completed=true\` / \`state=idle\`、移動は \`moveChapter()\`。発火・音声・UI効果は未観測 | **PASS（静的な制御経路）** / **NOT_VERIFIED（動作）** |
| D-20261009-08 | 配信済みindex/app JS / browser N/A | RSVP単章・再生/一時停止/戻る/進む/速度の操作 | 対応するDOM、イベント登録・再生制御コードを確認。クリック、チャンク自然さ、再生中の速度変更効果は未観測 | **PASS（静的な操作経路）** / **NOT_VERIFIED（動作）** |
| D-20261009-09 | Chromium / desktop / ネットワーク不可 | production実アクセス、390px/desktop描画、コース選択→連続再生 | Chromiumは存在。ただしproductionのDNS解決不可。本番画面のスクリーンショットとユーザー操作が取得できない | **NOT_VERIFIED** |
| D-20261009-10 | Android実機 / Android Chrome / 未接続 | 390px相当、タップ、再生・停止、音声・速度、章遷移、出典 | Android端末にアクセスしていない。エミュレーター・HTTP・静的コードを実機確認としない | **NOT_VERIFIED** |
| D-20261009-11 | Android実機 / Web Speech API / 未接続 | ページ内音声合成で単章と通し再生、停止/速度/音声選択、実際の聴取 | 実音声・端末の音声エンジン・イベントを測定していない | **NOT_VERIFIED** |
| D-20261009-12 | Android実機 / Chrome標準機能 / 未接続 | Chromeメニュー「このページを読み上げ」から利用できるか | Chrome標準機能はアプリ内Web Speech APIと別。実機メニュー・読み上げを確認していない | **NOT_VERIFIED** |
| D-20261009-13 | Android実機 / 未接続 | 画面OFF・バックグラウンドで音声継続するか | 状態遷移・音声の実測なし。Wake Lockコードだけで継続可とは言わない | **NOT_VERIFIED** |
| D-20261009-14 | GitHub status / npm環境 | 当該mainのCIと \`npm run check\` | mainのcombined statusにはVercel successを確認。対象SHAのPR起動workflow一覧は空（ツールの検索範囲に制限）。既存統合記録の旧SHA \`0a168c…\` のTest成功は今のmainの新規Test証拠ではない。private repoのローカルcheckoutがないため \`npm run check\` は未実行 | **Test: NOT_VERIFIED / npm: NOT_RUN** |
| D-20261009-15 | GitHub private/public境界 | RSVP一般公開やInstant Radio自動同期が無断で起きないこと | GitHub privateを確認。公開方針の正本で「RSVP private／Instant Radio public・明示的公開のみ」を再確認。実際の匿名到達性・GitHub Pages Settings画面は未観測。設定変更は実施せず | **PASS（repository visibilityと方針）** / **NOT_VERIFIED（匿名アクセス・Pages設定）** |

静的に取得した**改稿済み8章と出典リンク数**（同じ順番で検査）：\`security-risk-assessment\`（3）、\`security-sessions-federation-oauth-oidc-saml\`（6）、\`security-cloud-shared-responsibility-iam-config\`（4）、\`security-email-spf-dkim-dmarc\`（4）、\`security-social-engineering-bec-phishing\`（4）、\`security-malware-ransomware\`（4）、\`security-credential-session-attacks\`（4）、\`security-identity-proofing-authn-authz\`（4）。**リンク数・取得成功はリンク先仕様の現行性・正確性を保証しない**（内容の独立審査はC）。

### 6.3 新旧不具合の境界・判定

- **旧P1「Course連続再生で出典欠落」**: 上の旧Section 3.1が示した失敗は、後続PR **#99** により静的な実装不備が修復され、その修正コードが本番HTTPで取得できた。今回のDでは**静的修正を確認した**と判定し、旧発見を消さない。**実際に章を変えた瞬間の画面表示・リンク操作は未検証**。古いFAILを現在も残存するバグと断定せず、実利用PASSにも昇格しない。
- **新しいP0・P1不具合**: 本Dで実測できたHTTP・コード・代表8章の構造の範囲では**新規の確証なし**。これは全操作/音声に不具合がないという意味ではない。
- **速度変更の注意点**: 単章/コースの速度スライダーは入力イベントで値を更新し、新規 \`SpeechSynthesisUtterance\` 作成時に \`rate\` を設定する実装。再生中の発話に即時反映されるとはコード上で証明できない。実聴取で確認する。
- **公開境界**: 過去snapshotのPages workflowや \`/listen/chrome\` スロットの記述を最新状態と混同しない。現行正本は \`docs/PUBLIC_LISTENING_BOUNDARY_2026-10-08.md\`。private教材のPages公開・100スロットの自動同期は行っていない。

### 6.4 実機操作の最小確認手順（利用者・Eへ）

1. Android Chrome（実機）で \`https://rsvp-learning-kappa.vercel.app/\` を開き、端末機種・Android/Chrome版、確認時刻、ログイン要否だけを個人情報なしで記録。390px相当の縦画面で、横スクロール・ボタンの重なり・出典の可読性を確認。
2. RSVPの \`security-risk-assessment\` で再生→一時停止→1チャンク戻る/進む→速度変更→停止。画面表示の自然さと選択した章の出典を目視確認。
3. 単章Learnを開き、\`▶ / Ⅱ / ■\`、速度、音声選択、実音声と画面のハイライトを確認。音が出ない/止まる場合は、その操作・再現条件だけ記録。
4. Learn一覧からCourse I \`security-foundations-risk\`、Course III \`security-identity-crypto\`、Course IV \`security-network-cloud\` の通し再生を開始し、**章末自動遷移、章別出典の更新、前後章、速度・音声切替、最終章停止、一覧へ戻る**を確認。各Courseの初章・中間・最終章で一度ずつ出典を確認し、前章の出典が残らないことを調べる。
5. Chromeブラウザメニュー内の**標準「このページを読み上げ」**の利用可否を、ページ内 \`▶\` と混同せず別に判定。画面OFF/バックグラウンドは試した場合のみ結果を記載。録音・端末内の個人情報・保存済み習熟度をGitHubへアップロードしない。

### 6.5 Worker Eへの引継ぎ／終了条件

**Worker D判定: \`PARTIAL_WITH_GAPS\`**。production API（READY/alias/SHA一致）、HTTPによる主要コード・カタログ・既改稿8章、#99修正後の章別出典の静的機構は**確認した範囲でPASS**。一方、**390pxとdesktopの本番実ブラウザ描画/クリック、Android Chrome、実音声、Chrome標準読み上げ、実際の章切替と出典更新はすべてNOT_VERIFIED**。今回のレポート完成は実機QAの合格ではない。

- **P1 / D+利用者 / 環境依存**: 上記6.4に沿ったAndroid実機の最小実測。合格には端末・URL・deployed SHA・操作・期待/実測・問題時の再現手順を残す。
- **P1 / E**: Dの静的PASSを実ブラウザPASSへ無条件に格上げしない。C・B/Aの新headが統合された場合は新SHA/production aliasを再確認し、出典DOMとchapter切替を回帰確認する。
- **P1 / E**: 現在mainのTestは今Dの取得経路では網羅的に検証していないため、必要なGitHub Actions run URL/commit conclusionを再取得。\`npm run check\`は適切なcheckout/CIで行う。
- **P0 / E**: RSVP privateとInstant Radio publicを維持。Pages設定・匿名アクセス・秘密情報露出は許可と証拠のないまま公開方向へ変更しない。
- **非所有**: AのMarkdown/RSVP、BのLearn HTML、Cの専門内容審査、Eのmerge・デプロイ、Course V実装は本Dで行わない。

**保存運用:** 本snapshotを旧QA報告に追記し、既存の当時の観測/判定を変更しない。対象PRの差分・head SHAと保存本文をreadbackしてEへ引き継ぐ。
