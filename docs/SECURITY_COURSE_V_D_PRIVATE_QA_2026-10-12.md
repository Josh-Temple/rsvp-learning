# RSVP Learning — Course V F-08 Wave / Worker D 非公開候補QA記録（2026-10-12）

**担当・判定:** Worker D — **BLOCKED（正式な最終候補QAの開始条件未達）**。下記はA修正後headに限定した**静的事前検査**であり、`CANDIDATE_QA_PASS_SCOPED`でもリリース許可でもない。  
**指示:** Library `/RSVP Learning/Work Instructions/2026-10-12_security_course_v_f08_final_alignment_exact_sha_acceptance_private_qa_and_release_gate_wave_instructions.md` §6  
**対象:** private `Josh-Temple/rsvp-learning` / Course V-1 `security-secure-by-design-default`、V-2 `security-input-output-injection`  
**開始main:** `fa63f8f2571203539269a38d501d50d92cafc1d2`  
**事前検査の対象PR:** [#136](https://github.com/Josh-Temple/rsvp-learning/pull/136)、`open / draft / unmerged`。対象教材head **`57b0cc89931483115eec654be37e2bafbd2f18e3`**。これは**Aの修正証拠head**であって、Bの最終教材同期・引渡し済みheadではない。  
**過去のD予備監査:** [#140](https://github.com/Josh-Temple/rsvp-learning/pull/140)、旧時点限定。旧判定の転用なし。

## 1. 開始ゲートと全体評価

| ゲート | 実測・取得結果 | 判定 |
| --- | --- | --- |
| Bの最終40桁full SHA・教材同期のGitHub保存 | #136の開始・再読時headは上記A修正後head。B最終保存・正式引渡しの証拠は取得できず | **BLOCKED**（D正式開始条件） |
| 対象SHAに結び付くCI | [Actions Test #38196790680](https://github.com/Josh-Temple/rsvp-learning/actions/runs/38196790680) はA headの `completed/success`。A報告ではNode 67/67、内部から呼ぶPython unittest 50メソッド。Dによる再実行ではない | A headのみ **PASS（CI記録の読取）** |
| 対象SHAの保護Preview | Vercel project `rsvp-learning` のdeploymentを対象branchおよび上記40桁SHAで検索し、どちらも0件。別名・他経路の有無まで否定しない | **NOT_FOUND_IN_QUERIED_SCOPE** |
| 2 Learnの静的構造と読取 | GitHubから上記固定refで2 HTML、共通JS/CSSを取得し、後述の構造検査を実施 | **STATIC_CHECK_PASS_SCOPED** |
| 保護されたPreviewの描画・実ブラウザ操作 | 同じheadのアクセス可能なPreviewなし。隔離ローカルブラウザで同じファイル一式をレンダリングする実行環境も用意できず | **UNTESTED** |
| Web Speech / Android Chrome標準読み上げ / 4倍速の実音声 | 実操作・実発話は未実施。HTML入力に最大4.0倍の設定があることと実音声を混同しない | **UNTESTED** |
| productionと匿名アクセス | production alias/deployment/sourceとVercelの設定は読取。通常匿名アクセス、SSO共有例外経由、例外失効時のHTTP応答は未実測 | **NOT_VERIFIED** |
| 学習者理解・採点者間一致 | 受講者試験は実施せず、受講者情報を取得していない | **NOT_MEASURED** |

**総合:** 現段階は正式なD判定 `BLOCKED`。未検証の項目をPASSとしない。Contentの独立合否はWorker Cの領域でありDは署名しない。**RELEASE_HOLDを維持する。**

## 2. 固定SHAの静的検査（事前検査のみ）

GitHubの `57b0cc89931483115eec654be37e2bafbd2f18e3` から取得したファイルのblob SHA：

| 取得ファイル | Git blob SHA | 主な事前検査 |
| --- | --- | --- |
| `drafts/security-course-v/learn/security-secure-by-design-default.html` | `d5e00ef94c79605afb372d879e28f4c0f8e86bd0` | DOCTYPEあり、h1 1、article 1対、sources sectionはarticle外、HOLD注記はarticle前、重複ID 0（ID 30） |
| `drafts/security-course-v/learn/security-input-output-injection.html` | `e109ff1d9d53bf8eb2f242f332b1401133913588` | DOCTYPEあり、h1 1、article 1対、sources sectionはarticle外、HOLD注記はarticle前、重複ID 0（ID 31） |
| `learn/learn.js` | `22642c66e45a7bf85ea4fa6f0cfe9b10b4d7fd1e` | `speechSynthesis`、play/pause/resume/cancel、速度指定、音声の非対応時メッセージのコード上の存在 |
| `learn/learn.css` | `8e0a6f1a17e2de3774c88ea19dd4526e09340399` | focus-visible、モバイル向けCSSルールの存在 |

- 両HTMLは `<base href="../../../learn/">` を使用。このHTMLを想定通り `/drafts/security-course-v/learn/<slug>.html` に配置した場合、共通の `./learn.css`、`./learn.js` は `/learn/` 下を指す。相対リンク `../index.html` はトップ、`../drafts/security-course-v/QUESTIONS.md#v-1/v-2` およびSOURCE_EVIDENCE/FORMAT_MAPはdraft領域を指す、という**パス上の推定**に限る。実HTTPの200応答は未検証。
- 各HTMLの `#learn-article`、`#speech-play`、`#speech-pause`、`#speech-stop`、`#speech-voice`、`#speech-rate`、`#speech-rate-label`、`#speech-status`、`#speech-reader` はJSが参照するIDとして存在。重要な `article` / `section` / 見出し / `p` / `a` / `button` / `div` の開閉個数も一致。**DOM起動・実イベント・描画の検査ではない**。
- 両HTMLの `speech-rate` は `min=0.7 / max=4.0 / step=0.1`。上限がWeb Speech合成器の実発話速度を保証するわけではない。
- 制作HOLD注記は両章でarticle前、出典sectionはarticle後。引用先の外部到達性・対象節・朗読除外の実音声は未確認。
- このD作業ではMD/JSONの内容受入、21命題、10問、F-08反例実行、Node/Pythonの新規実行を行っていない。これらはB/Cの別ゲートである。

## 3. Vercelの現在状態（設定読取と匿名アクセスの区別）

- **Project:** `rsvp-learning`、SSO設定 `enabled=true / deploymentType=all_except_custom_domains`。この値は**設定の観測**であり実際の全URLでの匿名拒否を証明しない。
- **現在のproduction alias:** `rsvp-learning-kappa.vercel.app` → `dpl_Ernw8TuvgPPXg1TBRLrJCgorNRBR`、`READY / production`、source commit `fa63f8f2571203539269a38d501d50d92cafc1d2`。Course Vの候補 `57b0...` ではない。
- **shareable-link例外:** aliasの保護例外設定に `scope=shareable-link` のエントリー1件を確認。設定上の失効時刻は **2026-10-12 19:31:32 JST**。例外キー・共有URLなど秘密値はここには記録しない。適用ドメイン・具体的な到達可能性・失効の反映・通常匿名アクセスは **NOT_VERIFIED**。設定があるだけでは漏えいは確定しない。
- 未認証HTTP実測では、外部取得手段からaliasを取得できなかった。これは403/401確認でも、匿名到達成功でもなく、到達性判断の証拠に使わない。
- Vercelのdeploy、promote、alias、SSO、例外の作成・失効・設定変更は行っていない。

## 4. B完了後の再開と実利用検査

1. #136の最終full head SHA、Bの引渡し・CI・readbackを取得し、Cが審査するのと**同じ40桁SHA**に固定。Bの変更後に上記blob SHAを再確認し、同じでなければ再点検する。
2. 当該SHAを指す認証済みPreviewをVercelで検索。存在しなければ勝手にdeployせず、保護を保った隔離ローカル表示が可能な場合だけ「隔離ブラウザ」と明記して実測する。
3. 実ブラウザが使える場合、desktop・390px幅でV-1/V-2各ページの本文、見出し、スクロール、折返し、フォーカス、出典/章末、リンク到達、再生→一時停止→再開→停止、速度変更、長文を個別に確認し、期待/実測・操作順・head・環境・失敗条件を記録する。
4. **ユーザーのAndroid端末で行う確認:** 認証を保った候補ページをAndroid Chromeで開き、画面幅で本文と出典を確認。ページ内再生を開始→一時停止→再開→停止し、1.0倍・2.0倍・4.0倍について実際の発話と速度の変化を個別記録。続いてChrome標準の「このページを読み上げ」で同じ範囲を確認し、出典・候補注記の読み上げ混入、画面消灯・復帰、スクロール・章末動作を記録。端末名・OS・Chrome版・操作結果が未記録なら全てUNTESTEDとする。
5. 通常の未認証アクセス、共有リンク例外の適用範囲と失効後挙動は、アクセス権限を逸脱せず検証する。秘密のURL、token、Cookieをissue・PR・ログに転載しない。必要な安全なテスト手段がない場合は公開判断の blocker として残す。
6. ユーザーの別承認なしに `main` merge、Catalog/Course登録、`COMPLETE`、production deploy、public Pages化、public `instant-radio`への複製、学習履歴・受講者データ取得を行わない。

## 5. 再開条件・引渡し

**現時点のD提出：`BLOCKED`**。Bの最終候補SHA・実アクセス可能なPreview/隔離ブラウザ不足により、正式な `CANDIDATE_QA_PASS_SCOPED` または `CANDIDATE_QA_WITH_GAPS` の新SHA判定には未到達。B確定後に同一SHAで再実行する。Cの内容合否・CI・本番公開を代行しない。

**P0/P1の新規再現:** 静的事前検査の射程内では新規確定なし。ただし実動作や匿名アクセスの欠陥を「存在しない」と証明したものではない。**Release blocker:** B最終head未固定、C同head受入未確認、protected Preview未実測、実音声/Android未実測、通常匿名・shareable-link範囲未検証。

**保存範囲:** このD専用報告文書1件のみ。#136・過去#140、`main`の教材、Catalog、production/SSO/publicサイトの変更なし。報告PRのheadと**教材候補head**を別に記録し、CIと全文readbackが未完の場合もそのまま明記する。
