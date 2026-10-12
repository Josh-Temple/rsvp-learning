# RSVP Learning / Course V 先行2章 — Worker D 最終B-SHA非公開QA

- 実施: 2026-10-12 17:57 JST頃 / Worker D（独立した非公開候補QA）
- **D全体: `CANDIDATE_QA_WITH_GAPS`、release: `RELEASE_HOLD`**
- 対象教材: [Draft PR #136](https://github.com/Josh-Temple/rsvp-learning/pull/136) / **`2ceb3bae83dca17f00dcfb84cddfd726c20c92a0`**（40桁、B最終head）
- 参照main: `fa63f8f2571203539269a38d501d50d92cafc1d2`、#136の表示base: `74ebcac3587650ee83b95438629d1893ba8abfb4`（別物）
- 報告branch: `audit/course-v-b-final-d-private-qa-20261012`（この報告のcommit SHAは保存後に固定する。**教材headとは別**）
- Source: private GitHub **fixed-ref** 取得、Vercel project/deployments/aliases APIの**読取のみ**。独立Cの内容受入を代行しない。
- 過去のD予備QA [#140](https://github.com/Josh-Temple/rsvp-learning/pull/140) / [#143](https://github.com/Josh-Temple/rsvp-learning/pull/143) はB以前のA headを対象としていたため、本報告の実測として転載しない。

## 1. 開始条件・固定対象・CI

2026-10-12 17時台にGitHubを再取得し、#136は open / draft / unmerged、head `2ceb3bae83dca17f00dcfb84cddfd726c20c92a0`。開始時と報告branch作成直前に同SHAを再取得した。GitHub Actions [Test #38205273101](https://github.com/Josh-Temple/rsvp-learning/actions/runs/38205273101) はこのSHAで `completed/success`、job `114667262265` も `completed/success` を取得した。指示文記載のNode 68件／Python 50メソッドは制作者側検査の母数であり、Dがローカル再実行した件数は **0**。job successを実音声・QA・C内容受入の証拠にしない。

## 2. B最終headの実ファイルに対する静的検査（**ブラウザPASSではない**）

| 対象 | 固定ref取得したblob SHA | D新検査 |
| --- | --- | --- |
| V-1 Learn HTML `drafts/security-course-v/learn/security-secure-by-design-default.html` | `09cc63f5105a71576d64885e9bfeae1d3ed92908` | 構造・参照の静的PASS |
| V-2 Learn HTML `drafts/security-course-v/learn/security-input-output-injection.html` | `e109ff1d9d53bf8eb2f242f332b1401133913588` | 構造・参照の静的PASS |
| 共有 `learn/learn.js` | `22642c66e45a7bf85ea4fa6f0cfe9b10b4d7fd1e` | 読み上げ配線の静的PASS |
| 共有 `learn/learn.css` | `8e0a6f1a17e2de3774c88ea19dd4526e09340399` | レイアウト規則の静的確認のみ |
| V-1 MD / JSON | `5c54278cc69d91b64f4a5cdb88380584c442efe4` / `993f82861f14a10efb903ef4ab6a71ff9a384aed` | 番号順215・全文215/215一致 |
| V-2 MD / JSON | `a950ec7d1645fb471ea3a93106194aba2b2a49a7` / `96847f0dd2ea751b5d3a8c682f8350154576421d` | 番号順241・全文241/241一致 |

- HTML各2件に `lang=ja`、viewport、`<base href="../../../learn/">`、`./learn.css`、defer `./learn.js`、一意のID、1つの `article#learn-article` を確認。baseをファイルのdraft相対位置から解決すると `/learn/` に向き、既存共有CSS/JSを参照する構成。**実HTTP取得成功を示すものではない**。
- V-1 articleは見出しh1 1個／h2 9個、音声対象と同じ `h1,h2,h3,p` は31要素。V-2はh1 1個／h2 10個、33要素。本文以外の制作HOLD注記 `data-publication=HOLD`、制作過程説明、`section.sources` が `article` **外**にあることを両章で確認。本文を本文だけ読み上げるJS selectorの静的接続を確認したが、Chrome標準読み上げが注記・出典を含めるかは未実測。
- それぞれ `speech-play`、`speech-pause`、`speech-stop`、`speech-voice`、`speech-rate`、`speech-rate-label`、`speech-reader`、`speech-status` のDOM IDが存在。速度rangeは `0.7–4.0`、開始値1.0。JSには `SpeechSynthesisUtterance`、再生・一時停止・再開・停止、voice切替、rate代入、`pagehide`停止、Wake Lock失敗時の処理、API未対応時の操作不可表示がある。**存在確認であり、クリック成功・聴取PASSではない**。
- リンクにトップへ戻る経路、理解確認のdraft MD、出典・FORMAT_MAP、外部参考資料を確認。リンククリック、アンカー到達、404/200、フォーカス移動は未試験。未登録のdraftが通常のCatalogや正式Course Vに現れないことは意図したHOLDである。
- 2章のMD番号付き正文とJSON `chunks[].text` を文字列完全一致で照合: **215/215 + 241/241 = 456/456**、番号の連番を確認。JSONは各chunk **24文字以下（最大23文字、Unicode文字数）**。これはDによる補助的静的照合であり、Cの教材内容署名ではない。
- CSSは `width: min(760px, calc(100% - 32px))`、reader行の `flex-wrap: wrap` を確認。ただし390px実画面の折返し・フォーカス・横スクロール・コントラストを実証したわけではない。

**この静的射程内で、新規確定P0/P1=0（未発見）**。P0/P1不存在を証明しない。新規P2も確定なし。音声、実機、HTTPの未試験は独立したrelease blockerである。

## 3. Vercel候補Preview・production・アクセス保護

- Vercel project ID `prj_7yYGl5D3Q7UwQgQuXaGmOYLkTzbu`。project読取結果は `ssoProtection.enabled=true`、`deploymentType=all_except_custom_domains`。この設定は全URLの匿名拒否を立証しない。
- **対象B最終head `2ceb3bae83dca17f00dcfb84cddfd726c20c92a0` でdeployment一覧をSHA指定検索し、**該当0件**。保護された対象SHAのPreviewは取得できず、access可能なQA URLもなし。Previewを無断新規作成しない。
- production alias `rsvp-learning-kappa.vercel.app` → deployment `dpl_Ernw8TuvgPPXg1TBRLrJCgorNRBR`。状態 `READY` / target `production`、source **`fa63f8f2571203539269a38d501d50d92cafc1d2`（main）**。今回のCourse V B候補とは違う。production READYを本候補の配信検証へ転用しない。
- projectのdomains欄は `rsvp-learning-kappa.vercel.app` 等3件、domains APIで同aliasがverifiedと記載。特定aliasで `all_except_custom_domains` が実際にどの範囲へ適用されるか、匿名HTTPで拒否されるかは **NOT_VERIFIED**。
- alias設定に `scope=shareable-link` の例外エントリー1件が存在し、設定上の `expires` は **2026-10-12 19:31:32 JST**。本検証17時台では設定上未失効。ただし共有URLの匿名到達・具体的適用範囲・失効後の遮断は **NOT_VERIFIED**。秘密キー、shareable URL、Cookie、認証tokenは記録しない。
- 通常の未認証HTTP実測: この実行環境の `curl` は当該hostのDNS解決に失敗し、別の外部取得手段もURLへアクセスできなかった。**HTTP 401/403の証拠でも匿名到達可能の証拠でもない**。失効前後の比較は未実施。
- 既存productionであっても今回のprivate候補のQA経路として用いない。SSO、例外、alias、custom domain、部署間共有の設定は変更していない。

## 4. 実利用QA項目ごとの独立判定

| 検査項目 | 判定 | 実測範囲と理由 |
| --- | --- | --- |
| GitHub固定SHAからの2 HTML・CSS/JS/MD/JSON静的整合 | **PASS（静的限定）** | §2の読取と比較 |
| 同SHA保護付きVercel Preview上のDesktop描画・操作 | **UNTESTED** | 対象SHAのdeploymentなし |
| 同SHA隔離ローカルserver＋Chromium実ブラウザ | **UNTESTED** | 実行環境にChromiumは存在するが、GitHub private fixed-refの構成一式をローカル隔離serverへ安全に再現した状態は用意できず、レンダリングも未実施 |
| 幅390pxの見出し、長文、折返し、スクロール、フォーカス、脚注、リンク・章末 | **UNTESTED** | 実画面なし |
| 再生→一時停止→再開→停止、速度・声、ナビ・進捗の操作結果 | **UNTESTED** | コードの配線だけ確認 |
| Web Speech APIの実発話・聴取、1×/2×/4×、章末停止・読み上げ混入 | **UNTESTED** | 実音声なし |
| Android Chrome標準「このページを読み上げ」、画面消灯/背景化/復帰、章間移動 | **UNTESTED** | Android実機操作なし |
| project SSO設定・production alias/deployment/source・共有例外の設定値 | **PASS（読取限定）** | §3のVercel API metadata |
| Previewのアクセス保護、custom domain・shareable-linkの実効性、匿名HTTP・失効後 | **NOT_VERIFIED** | 実HTTPの信頼できる観測なし |
| 実受講者理解・採点者間一致 | **NOT_MEASURED** | 個人データを取得しない |

**D総合: `CANDIDATE_QA_WITH_GAPS`。** B最終SHAに対する静的検査は行ったが、ブラウザ、発話、Android、匿名遮断が必要なrelease判断に足りない。**`CANDIDATE_QA_PASS_SCOPED`ではない**。Cの同SHAでの両章独立受入も別途必要であり `RELEASE_HOLD` を維持。

## 5. Android手動チェック手順（実施記録欄、現時点はすべてUNTESTED）

**前提:** 別途承認・作成された **同じ40桁教材SHA** の認証保護付きQA URLがあり、正当なアクセス権で到達できること。共有URL・Cookie・例外キーを報告に貼らない。無断公開も行わない。

1. Android ChromeでV-1/V-2をそれぞれ開く。端末機種、Android/Chrome版、対象SHA、URL種別（protected Previewか隔離ローカルか）、日時を記録。本文h1、各h2、長い行、360–390px付近の折返し、横スクロール、出典・制作HOLD注記の位置を確認し、PASS/FAILと再現条件を記録。
2. **ページ内プレイヤー:** 1.0倍で再生→一時停止→再開→停止し、実際の発話と状態表示を確認。再生位置・ハイライト・速度2.0倍と4.0倍・音声選択・声変更中の挙動を個別記録。ブラウザが速度上限を内部制限した場合も、その観測を記録する。
3. **Chrome標準「このページを読み上げ」:** プレイヤーとは別に作動可否を記録。本文、制作HOLD注記、出典がどこまで読み上げられるか、英語専門語、長段落、章末の終了挙動を耳で検証。機能が提供されない場合はUNTESTED（利用不可）として理由を記載し、PASSとしない。
4. 画面消灯→復帰、ホームへ移動/背景化→復帰、画面回転・スクロール、V-1⇔V-2移動、最後の停止、ページ離脱後の音声停止を実操作で確認し、期待/観測を分離する。
5. 正当な権限がある検証担当が別途、ログアウト状態・共有例外なしでの通常URL到達、認証有り経路、例外有効時/失効後をHTTP status・レスポンスの保護画面/本文と共に検査する（秘密値を保存しない）。SSO設定だけで結果を代用しない。

**未実施の検査はすべて空欄ではなく `UNTESTED / NOT_VERIFIED` のまま扱う。** 実検査が終わっても、その結果をこの旧SHA以外へ転用しない。

## 6. 差戻し・保存・次担当への引渡し

- 現時点で静的検査由来の再現可能な新規P0/P1指摘なし。ただし、匿名公開や重大なUI/音声障害が後から実証された場合は直ちに `RELEASE_HOLD` を維持しA/BまたはVercel保護所管へ再現条件を渡す。
- Cの新SHA両章正式受入、保護された同SHA Previewもしくは隔離ローカル実ブラウザ、Android/Web Speech実聴取、SSO/custom domain/共有例外の匿名到達性が未確認。Eはこれらを成功として合算せず、`CONTENT_HOLD / RELEASE_HOLD` と区別して評価すること。
- **変更許可範囲:** 本報告専用の新branch/Draft PRへ文書1ファイルのみ。#136の候補、Catalog、Course V登録、`main`、既存#140/#143、C/E報告、production/Preview/alias/SSO、public Pagesやinstant-radioには書き込まない。
- 報告PRのhead full SHA / CI / fixed-ref readback /変更ファイル数は作成後に確認し、結果をPR本文またはGitHubコメントへ追記する。報告CIは教材候補CIとは別の対象である。

## 7. 追補: Vercel alias保護例外の取得間で状態変化（18:02 JST）

- **初回読取（17時台）**: `rsvp-learning-kappa.vercel.app` のalias metadataに `protectionBypass` 内の `scope=shareable-link` エントリー **1件**。設定上の `expires=2026-10-12 19:31:32 JST` を確認（本報告§3はこの取得時点の事実）。
- **再取得（18:02 JST）**: 同じaliasの `protectionBypass` はキーが存在するが **エントリー0件**。aliasの `updatedAt` は **2026-10-12 17:59:21.021 JST**。再取得でも0件。つまり**現時点で例外が残っているとは主張できない**。
- Dはalias、例外、SSOなどを書き換えておらず、差の理由（別セッションによる変更、API仕様、時刻処理等）は**未確認**。このAPI値だけで匿名遮断の実効性、既発行URLの失効、漏えい不存在を証明しない。未認証HTTPでの検証は依然 **NOT_VERIFIED**。production aliasの指すdeployment、READY、source `fa63f8f2571203539269a38d501d50d92cafc1d2` は再読時も一致。
- Eは初回の「1件」と再取得の「0件」を時系列の別観測として扱うこと。`RELEASE_HOLD` は不変。秘密キー・Cookie・共有URLを保存しない。

---

## 8. 2026-10-13 追補 — C受入済みB最終SHAの保護付きPreview作成とアクセス境界の再確認

**実行者:** GitHub/Vercel連携を用いたQA引継ぎ。**教材SHAは変更せず、既存の§1〜§7を履歴として維持**した。今回のVercel操作はproductionではなく、固定SHAの候補Preview作成1件。実HTTP・実ブラウザ・Android・実音声の成功を宣言するものではない。

### 8.1 新しい証拠

| 対象 | APIで確認した事実 | 判定の限界 |
| --- | --- | --- |
| 教材 #136 | open/draft、現head `2ceb3bae83dca17f00dcfb84cddfd726c20c92a0`。head固有Test #38205273101 は completed/success | 審査対象SHAの変更なし。CIのみで利用QAに合格しない |
| 独立内容受入 | C報告 #146 が同一教材SHAでV-1/V-2をともに `ACCEPTED_FOR_MERGE`、未解消P0/P1=0と判定。報告はmainへmerge済み。E統合§20もmainへ収録済み | 教材内容の受入であって、productionリリースや実音声の合格ではない |
| 新規候補Preview | Vercel project `rsvp-learning` にGitHubブランチ `content/security-course-v-pilot-20261011-sol` と**full SHAを指定して手動作成**。deployment ID `dpl_4myzXuZXtjdyRfhRbxJivUCtmQBy`。API再取得で `READY`、`meta.githubCommitSha`が教材SHAと一致、`target=null`（production指定なし）。URL: `https://rsvp-learning-16af5j843-josh-temples-projects.vercel.app` | READYはビルド配備の状態。HTTP応答、認証経路、ページ描画、音声のPASSではない |
| Previewエイリアス | deployment aliases取得で候補ブランチ用のエイリアス1件。production alias `rsvp-learning-kappa.vercel.app` は別deployment `dpl_F3SC9P4rvt8YUk3MvNSrbJF6MDMU` を指す | production配信先を変更していない |
| Vercel SSO | project setting `ssoProtection.enabled=true` / `deploymentType=all_except_custom_domains`。登録済みproject domainは `rsvp-learning-kappa.vercel.app` 1件 | 設定を確認しただけで、Previewや匿名アクセスの実効的な拒否（HTTP 401/403など）は未測定。今回のPreviewにはcustom domainを追加していない |
| production aliasの保護例外 | 今回の再取得時に `scope=shareable-link` の例外**1件**、設定上の期限 **2026-10-13 22:06:06 JST**。旧§7の18:02 JST時点「0件」とは**別の時点の観測** | 過去の例外の再使用か新設か、実際の匿名到達可否、失効処理は未確認。キー・秘密共有リンクは保存しない |
| リポジトリ設定 | 対象SHAの `vercel.json` に `git.deploymentEnabled=false` | 自動Git deployに依存せず、今回の候補deploymentはAPI手動作成 |

### 8.2 今回実際に検査した／できなかったこと

- **PASS（範囲限定）**：対象教材SHAとdeployment metadataの一致、Vercel `READY`、Previewエイリアスの存在、productionエイリアスが候補とは別deploymentを参照、SSO設定の読取、対象SHAのV-1/V-2 Learn HTMLと既存`learn/learn.js`のfixed-ref取得。2 Learn HTMLの既存blob SHA（V-1 `09cc63f5105a71576d64885e9bfeae1d3ed92908`、V-2 `e109ff1d9d53bf8eb2f242f332b1401133913588`）は前回§2の静的QA対象と一致。
- **UNTESTED**：Preview上の2章のHTTP 200/401/403、ログイン済み利用者の実描画、desktop/390pxレイアウト、再生/一時停止/停止、音声切替、速度1×/2×/4×、Web Speech実発話、Android Chrome標準「このページを読み上げ」、背景化・画面OFF、通常/匿名アクセス、例外リンク・失効後の到達性。今回の実行環境からホストへ接続できなかったため、実ブラウザPASSは出さない。
- **教材表示文言の新しい静的所見（低優先・非ブロッカー）**：候補Learn 2 HTMLには `DRAFT / HOLD。独立した新規内容審査前の未公開候補です。` と表示される。B候補作成当時の注記であり、C #146による内容受入後の現状説明としては古い。正式登録用の新PRで「内容審査済み・公開判定保留」に修正し、新SHAとして必要な受入・回帰を行う。内容のP0/P1とは認定しない。

### 8.3 正当なアクセス権のある担当による残りのQA（**未実施の手順**）

1. SSOで許可されたブラウザから、`https://rsvp-learning-16af5j843-josh-temples-projects.vercel.app/drafts/security-course-v/learn/security-secure-by-design-default.html` と `.../security-input-output-injection.html` を開く。候補SHA・URL・HTTP結果・本文とリンク、390px幅、フォーカス・スクロールを記録。エラーがあれば状態・再現手順を保存する。
2. 各章のプレイヤーで再生→一時停止→再開→停止、速度1×/2×/4×、声選択、ページ離脱後の停止を実操作し、**画面状態と実際に聞こえた発話を別々に記録**。発話を聞けなければ`UNTESTED`か`FAIL`の該当するものを選ぶ。
3. Android Chrome実機でページ表示と標準の「このページを読み上げ」（端末に機能がある場合）を確認し、画面OFF/背景/復帰、専門語、制作HOLD注記・出典が音声に混入するか、章末停止を記録する。テストできない環境をPASSにしない。
4. **権限のない通常ブラウザ/匿名HTTP**で両ページの保護を確認し、HTTP statusと本文が保護画面か教材本文かを区別。共有例外や認証情報を報告に貼らず、保護設定変更・例外リンク作成は行わない。custom domainや例外の適用は別に検証する。
5. 候補修正時はhead driftを検出し、#146の独立C署名やこのPreviewの結果を新SHAへ自動流用しない。

**結論**：C内容 `CONTENT_ACCEPTED_EXACT_SHA`、D候補QA `CANDIDATE_QA_WITH_GAPS`、release **`RELEASE_HOLD`** を維持。今回のPreview `READY` のみを理由に#136 main merge、Catalog登録、COMPLETE、production deploy/promotion、public Pages/instant-radio移管を実行しない。
