# Course V — 独立Cloud Browser QAとE統合判定（2026-10-13）
実測時刻: 07:56–08:05 JST頃。Repository: Josh-Temple/rsvp-learning。
教材対象: PR #136 / 2ceb3bae83dca17f00dcfb84cddfd726c20c92a0。
開始時main: a5561275041d7e04278d51be5b0fdd924d13aae0。

## 判定
**C内容受入維持 / CANDIDATE_QA_WITH_GAPS / RELEASE_HOLD。**
#145の静的QA、#151のPreview作成記録を置換せず、今回初めて実施した実ブラウザ・匿名HTTPの証拠を追加する。教材head、SSO、alias、保護例外は変更せず、deploy/promotionも行っていない。報告の統合は教材のマージ許可ではない。

## fresh read
#136はopen/draft/unmerged、指定headと一致。headのTest run 38205273101はcompleted/success。
#146はmerged、同教材SHAで両章ACCEPTED_FOR_MERGE、P0/P1=0、非ブロッカーP2=1。
#145/#151はmerged、既存本文と追補を確認。root AGENTS.mdは404。
Vercel deployment dpl_4myzXuZXtjdyRfhRbxJivUCtmQByはREADY、target=null、githubCommitShaは教材SHAと一致。
この版同定はdeployment metadataに基づく。ブラウザ受信HTMLのバイトhashは未取得。

対象URLは指定Previewの以下2ページ。
- /drafts/security-course-v/learn/security-secure-by-design-default.html
- /drafts/security-course-v/learn/security-input-output-injection.html

## 実操作マトリクス
|項目|V-1|V-2|限界|
|---|---|---|---|
|Cloud Browserで本文・見出し・操作部品表示|PASS|PASS|SSO画面は出なかった。既存セッションの認証方式は未確認|
|PCスクリーンショットの冒頭表示|PASS|PASS|V-2実DOM viewport幅1348px、scrollWidth1348px。390pxではない|
|スクロール|PASS|PASS|V-1章末・出典をスクリーンショット確認、V-2中盤を確認。全位置の視覚QAではない|
|速度1/2/4倍の表示・値変更|PASS|PASS|実発声速度は未検証|
|各速度で再生ボタンをクリック|FAIL（環境で観測）|FAIL（環境で観測）|全6回で「読み上げを開始できませんでした」|
|一時停止・再開・停止|BLOCKED|BLOCKED|再生失敗後pause/stopはdisabled。成功したとは扱わない|
|音声選択|UNTESTED|UNTESTED|標準音声1件のみ。V-2選択部品をクリックしたが切替先なし|
|ページ離脱後の発声停止|UNTESTED|UNTESTED|離脱自体は実行。動作中音声がないため停止効果を証明できない|
|Web Speech実発声・聴取|UNTESTED|UNTESTED|音声を聴取できず、開始エラーも観測|
|390px表示|UNTESTED|UNTESTED|提供Cloud Browser APIにviewport変更操作がなく、実390px試験は未実施|
|Android実機|UNTESTED|UNTESTED|実機なし|
|リンク|PARTIAL|PARTIAL|hrefは実AXで確認。V-2 Learn一覧リンクはindex.html?library=learnへ遷移成功。全リンク開封ではない|

V-2「理解確認・採点基準」を実クリックしたところCloud BrowserのURL protocol policyで拒否された。UIはQUESTIONS.md#v-2を示していた。これはブラウザ側制約であり、教材404やリンク不良とは認定しない。迂回せず教材へ戻った。外部出典はhref確認のみ。

## 再現証拠と所見
**QA-01: 音声開始不能（リリースの検証ブロッカー、製品重大度は未確定）**
対象SHAは上記固定教材SHA。両ページを開き、再生をクリック。速度を2、4へ変更して各再生をクリック。
期待: 発声開始後、pause/stop有効。観測: 「読み上げを開始できませんでした」、play有効、pause/stop無効。
V-2のread-only実DOM証拠:
```json
{"width":1348,"scrollWidth":1348,"article":5140,"voiceOptions":["端末の標準音声"],"buttons":[{"id":"speech-play","disabled":false},{"id":"speech-pause","disabled":true},{"id":"speech-stop","disabled":true}],"status":"読み上げを開始できませんでした"}
```
V-1 AXでも同じエラー、speed値2/4と表示2.0×/4.0×を確認。スクリーンショットは実行時ツール出力で観察したが、画像ファイルとして本PRには保存していない。
音声非搭載など実行環境原因の可能性があるが、原因は確定していない。今回の失敗を全端末の製品P1と断定しない。音声利用可能な環境で再試験するまで音声QAを受入にしない。
共有learn.jsでは非canceled/interruptedのutterance.onerrorがこの表示を設定する。ただし今回error code自体は収集できていない。
**QA-02: P2既知注記の実表示確認**: 両章の「独立した新規内容審査前」は#146受入後の状態説明として古い。#151既出であり新規欠陥として重複計上しない。

## 非認証HTTPと保護境界
Cookie・Authorization・秘密共有queryなしのPython urllibで各ページGET。redirectを追う観測と、追わない観測を別に実施。
|ページ|初期応答|Location host|転送後応答|教材article|
|---|---|---|---|---|
|V-1|302|vercel.com|200（Vercel login/SSO本文）|なし|
|V-2|302|vercel.com|200（Vercel login/SSO本文）|なし|
最終200を教材公開成功と解釈しない。秘密を含み得るLocation全文、Cookie、共有URLを保存していない。
今回2要求はSSO転送を確認したが、すべての経路の遮断や保護例外失効を保証しない。

fresh project設定: ssoProtection.enabled=true、deploymentType=all_except_custom_domains。
登録domainはrsvp-learning-kappa.vercel.appのみ。任意のcustom domain全般への保護をこの設定から主張できず、実custom domain試験はUNTESTED。
production aliasは今回dpl_G77NZRUcg9GsCDLQNevF6vRoHBWAを参照。#151の旧観測と時点が違う。今回変更していない。
production aliasのshareable-link例外は1件、expires=1791896766（2026-10-13 22:06:06 JST）。例外キーは保存せず、リンクを使用・作成・変更していない。共有例外経由/失効後の実効範囲はUNTESTED。通常の匿名転送結果と共有リンク例外の安全性は別問題。

## Android実機で必要な最小手順（未実施）
1. 許可されたSSOで両章を開く。端末/Chrome版と教材SHA、表示幅、本文・末尾・リンクの表示を記録する。
2. 各章を1/2/4倍で実発声。開始→pause→resume→stop、声が複数あれば切替、別ページへ移動して停止を聴取する。
3. 背景化/画面OFF/復帰、章末停止、SQL/HTTPS等の専門語、制作注記・出典がページ内読上げに混ざらないことを確認。
4. Chrome標準「このページを読み上げ」が利用可能なら別機能として試し、ページ内プレイヤーと結果を分ける。
5. Cookie・秘密queryなしの非認証環境でSSO表示を確認。認証情報や共有URLは記録しない。

## Worker E相当の統合
#136を妨げる条件は、内容受入不足ではなく以下の残存QAと別個の教材merge判断である。
- 音声が動作する環境で再生/pause/resume/stop、声切替、離脱停止、実発声を確認すること。
- 実390px表示とAndroid実機試験を完了、または担当者が未検証リスクの扱いを明示的に判断すること。
- 共有リンク型例外/失効とcustom domainの適用範囲を確認し、未確認の公開境界を承認済みにしないこと。
- 最新mainに対する統合影響と別個の教材merge/release承認を確認すること。vercel.jsonのgit.deploymentEnabled=falseのみで全production影響を保証しない。
今回#136は変更もmergeもしない。報告のみCIと全文readback確認後にmainへ統合する。**RELEASE_HOLD維持**。
