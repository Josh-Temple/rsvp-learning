# Course V先行2章 — 本番公開境界、残余QA、統合準備（2026-10-13）

**結論：本番の主ドメインは匿名公開されている。PR #136は技術的には統合可能だが、現在の配信境界のままmainへマージしない。RELEASE_HOLDを維持する。**

これは教材内容の再審査ではない。#146の内容受入と#153のAndroid成功報告を維持し、本番HTTP、実ブラウザ、Git/Vercel、隔離統合回帰の新しい証拠を加えた。既存QA報告、教材固定SHA、Catalog、ホスティング設定は変更しない。報告専用PRの統合は教材の公開承認を含まない。

## 1. 対象と開始時のfresh read

| 対象 | 確認値 |
| --- | --- |
| Repository | private `Josh-Temple/rsvp-learning` |
| 最新main | `8d1164f577b32b575e4ef43291511b020b243e93` |
| 教材PR #136 | open / Draft / unmerged、head `2ceb3bae83dca17f00dcfb84cddfd726c20c92a0`、指定固定SHAと一致 |
| PRの表示base / merge base | `74ebcac3587650ee83b95438629d1893ba8abfb4`。現在のmainとは異なる |
| head CI | [Test #38205273101](https://github.com/Josh-Temple/rsvp-learning/actions/runs/38205273101)、completed / success |
| 変更 | 32ファイル、6,578追加、削除0。Draft配下30追加、候補用Nodeテスト1追加、準備文書1追記 |
| 内容受入 | merged [#146](https://github.com/Josh-Temple/rsvp-learning/pull/146)、両章ACCEPTED_FOR_MERGE、P0/P1=0、非ブロッカーP2=1、同一教材SHA |
| 既存QA | merged [#145](https://github.com/Josh-Temple/rsvp-learning/pull/145)、[#151](https://github.com/Josh-Temple/rsvp-learning/pull/151)、[#152](https://github.com/Josh-Temple/rsvp-learning/pull/152)、[#153](https://github.com/Josh-Temple/rsvp-learning/pull/153)。現在の報告全文を取得 |
| production | `dpl_4qF1Boso4eQCQLB3tD7jVgL3m6Pp`、READY / production、metadata source SHAは開始時mainと一致 |
| 教材Preview | `dpl_4myzXuZXtjdyRfhRbxJivUCtmQBy`、READY / target=null、metadata source SHAは教材固定SHAと一致 |

GitHubのPR、commit、tree、workflow、固定refファイルとVercel project、deployment、alias、domainを読み直した。GitHub CLIのclone経路は認証を利用できなかったため、接続済みGitHubのfixed-SHA取得を使った。認証秘密の取得・作成はしていない。

## 2. 最優先の匿名HTTP実測

Python urllibのGETを使い、Cookie jar、Authorization、SSO状態、共有queryを付与しない新しいopenerで実測した。各redirectでもCookieを引き継がず、保存したLocation情報は**ホストだけ**。実測時刻、Content-Type、本文長、SHA-256、Git blob SHA-1、各hopは添付JSONにある。

| ホスト / 経路 | 初期status | 転送先host | 最終status / 内容 | 教材本文 |
| --- | ---: | --- | --- | --- |
| `rsvp-learning-kappa.vercel.app/` | 200 | なし | 200 / サイト本文、text/html | RSVP本体 |
| 同 `/learn/security-authentication-access-control.html` | 200 | なし | 200 / 実Learn、text/html | **取得できる** |
| 同 `/learn/learn.js` | 200 | なし | 200 / application/javascript | 共有JSを取得 |
| 同 `/lessons/index.json` | 200 | なし | 200 / application/json | Catalogを取得 |
| 同 `/courses/index.json` | 200 | なし | 200 / application/json | Course一覧を取得 |
| 同 `/drafts/security-course-v/learn/security-secure-by-design-default.html` | 404 | なし | 404 / text/plain | 現在は存在しない |
| 同 `/drafts/security-course-v/learn/security-input-output-injection.html` | 404 | なし | 404 / text/plain | 現在は存在しない |
| `rsvp-learning-josh-temples-projects.vercel.app/` | 302 | vercel.com | 200 / Vercel login、text/html | なし |
| `rsvp-learning-git-main-josh-temples-projects.vercel.app/` | 302 | vercel.com | 200 / Vercel login、text/html | なし |
| 個別production `rsvp-learning-ga0ob6410-josh-temples-projects.vercel.app/` | 302 | vercel.com | 200 / Vercel login、text/html | なし |
| 指定教材Preview / V-1パス | 302 | vercel.com | 200 / Vercel login、text/html | なし |
| 指定教材Preview / V-2パス | 302 | vercel.com | 200 / Vercel login、text/html | なし |

本番の200応答5ファイルは、長さ付きGit blob hashを独立計算し、最新mainの対応blobと**5/5完全一致**した。productionの同定はVercel metadataだけに依存していない。Cloud Browserでも本番ルート・既存Learnを表示したが、既存認証セッションがあるため、これを独立した匿名ブラウザ証明にはしない。匿名の証拠は上記HTTPクライアントである。

**重要：現在のDraftパスの404は、ファイルがproductionにないことを示す。マージ後の非公開を保証しない。Previewの302も、本番主ドメインの保護を証明しない。**

## 3. Vercelの保護範囲と共有例外

- Project `prj_7yYGl5D3Q7UwQgQuXaGmOYLkTzbu`、team `team_imvRFeaSa1LmNpMJkFiMwNmB`。
- 設定APIは `ssoProtection.enabled=true / deploymentType=all_except_custom_domains`。DashboardのDeployment Protection実画面は **Standard Protection**。Billing実画面で **Hobby Plan** を確認した。正規化されたteam APIはbillingを返さず、プランの証拠はUIである。
- production aliasesは主ドメイン、team alias、git-main aliasの3つ。個別deployment URLも別に試した。登録project domainは主ドメイン1件。実custom domainは登録されておらず、その匿名挙動は試していない。
- 今回のproduction alias読取ではshareable-link型エントリー **1件**、`expires=1791896766`、**2026-10-13 22:06:06 JST**。取得時点では設定上の期限前であり、失効済みとは判定しない。過去の0件/1件と時点が異なる。作成理由、再発行の有無、実効範囲、期限後の拒否は**NOT_VERIFIED**。
- 共有秘密URLを使用せず、例外キー、Cookie、token、認証情報を保存しない。例外経路の権限・実効性を推測せず、設定の作成・変更・解除もしていない。
- 主ドメインの匿名200をshareable-linkの効果と断定しない。今回の要求に共有tokenはなく、Standard Protectionのproduction domain除外と整合する。他の保護URLが同じ公開境界を持つとも一般化しない。

**現在の仕様の確認**：Vercelは2026-09-09に、Vercel Authenticationの **All Deploymentsを全プランで追加料金なし**にしたと公式発表している。最新公式文書も、Standard Protectionはproduction domainを除外し、All Deploymentsはproduction domainと生成URLを含むと説明する。「Hobbyなので本番保護はできない」「必ず有料化が必要」という古い説明は今回採用しない。

- [最新Deployment Protection](https://vercel.com/docs/deployment-protection)（Last updated September 15, 2026、今回fresh open）
- [2026-09-09公式変更](https://vercel.com/changelog/protect-production-deployments-for-free-on-every-plan)
- [Shareable Links](https://vercel.com/docs/deployment-protection/methods-to-bypass-deployment-protection/sharable-links)

## 4. mainからproductionへの反映経路を特定

`vercel.json` の `git.deploymentEnabled=false` を固定mainで取得した。DashboardのGit画面では `Josh-Temple/rsvp-learning` が接続済み、Deploy Hooksは0件。Git連携が切断された状態ではない。

**別の自動反映経路が実在する**：`.github/workflows/vercel-scheduled-deploy.yml` はcron `17 */6 * * *`（UTCの6時間ごと）、workflow_dispatch、およびこのworkflow自体へのmain pushで起動する。mainが `vercel-production` tagから進んでいれば、`npm run check` 後、Vercelのdeployment APIへ `target=production / gitSource.ref=main` を送信し、READYを待ってtagを更新する。

これは可能性だけではない。[schedule run #38328288827](https://github.com/Josh-Temple/rsvp-learning/actions/runs/38328288827)、deploy job `115071973403` を取得し、source `8d1164f577b32b575e4ef43291511b020b243e93`、全deployステップsuccess、実ログの `Created deployment dpl_4qF1Boso4eQCQLB3tD7jVgL3m6Pp` と `Vercel deployment state: READY` を照合した。**現在のproductionを作った経路は、このscheduled GitHub Actions→Vercel APIと特定できた。** それ以外のmanual API/CLI経路の存在を否定する証拠ではない。

従って、#136をmainへマージしてGitの自動deploy無効設定だけに依存すると、次回のscheduled runがDraftを含むmainをproductionへ反映し得る。今回はworkflowを起動・変更せず、production作成・昇格も行っていない。公式[Git Configuration](https://vercel.com/docs/project-configuration/git-configuration)のGit連携停止と、この独立API経路を区別する。

## 5. 隔離統合と必要な回帰を実行

GitHub compareはahead=7 / behind=16 / diverged、merge baseは§1のbase。GitHubのmergeable=true / cleanを取得した。既存の仮merge ref `932ceae3be671707437e474b450c0b8e822db1e6` の親は旧main `e1d4d6372ea42a414d196b244645a104edaed747` と候補であり、これだけを最新main統合の証拠にはしなかった。

接続済みGitHubからbase・最新main・固定候補の全treeと必要blobを取得した。**609種類のblobを長さ付きGit SHA-1で全件検証**。復元したmain/candidate treeはそれぞれAPI commitの `6edb5f414e975b512906de96af617ee60682bb60` / `79b5296c6c92b14891d489e3acc7e46e01b96800` と一致した。tree snapshotをローカルGitの一時commitにし、同一baseから `git merge --no-commit --no-ff isolated-candidate` を実行した。

**ネイティブGitの三方マージ：exit 0、未解決エントリー0、変更32ファイル/6,578追加/削除0。** 統合treeは `2440df988f295c74e8896bbd78af90743f1a2155`。一時commit IDはローカルで構成したもので、remote履歴のcommit SHAとは異なる。remote branchの更新や教材のmergeではない。

| 検査 | 新しい実測結果 | 射程 |
| --- | --- | --- |
| `npm run check` | exit 0、Node **68/68 PASS** | 最新main＋固定候補の隔離統合tree |
| Python unittest discover | exit 0、**50/50 PASS** | 既存の候補回帰を独立コマンドで実行。Nodeの内側でも呼ばれるため件数を二重加算しない |
| Content/status | PASS、158 lessons、24 courses、28 Listen、8,518 chunks、COMPLETE141/DRAFT0/SEED17 | 既存カタログ範囲。既存の出典なし50件はwarningであり今回の新規不合格ではない |
| Learn検査 | 141ページの静的構造PASS | 音声の成功や390pxの証拠ではない |
| 主要11ファイル | mainとのblob **11/11不変** | Catalog、Course、app/index、共有Learn、Listen一覧、SW、Vercel設定、deploy workflow |
| 隔離loopback HTTP | 変更32パス **32/32 HTTP 200、本文byte一致** | ファイル存在と静的root配信。Vercel productionの公開試験には転用しない |

正式Catalog/Courseは未変更、2章は未登録のまま。Learn/Listen/既存教材へ通常の登録導線を加えない。しかし、**未登録と未公開は異なる**。30個のDraftファイルには2 Learn、MD/JSON本文、採点資料、原典対応、教育コード、制作証拠がある。現在の静的rootをそのままproductionへ送ると、少なくとも2章のLearn直接URLを含むDraft素材が匿名取得可能になると予測される。拡張子別のVercel実配信全件は未検証で、30個すべてのproduction HTTP 200を先取りしない。

`DRAFT / HOLD`、`data-publication=HOLD`、Catalogからの除外は注記・導線の制御であり、サーバのアクセス拒否ではない。新規テストファイルと既存準備文書の公開リスクも、配信対象をroot全体とする構成では別に考慮する。

## 6. 残余ブラウザQAとAndroid成功の維持

既存の正当なCloud Browserセッションから指定Previewの両章を表示した。今回の実DOMはdocument clientWidth **1348px**、scrollWidth **1348px**で、両章とも測定したPC幅では横あふれなし。読み上げ操作部品、速度slider、本文、Draft注記、リンクを確認。V-1は2.0×、V-2は4.0×への実操作と表示変化を確認した。V-1でsliderからTabにより次の出典リンクへ移動したが、全focus stylingの検査ではない。

**390pxはNOT_VERIFIED**。提供APIにviewport変更操作がなく、DevToolsを開くshortcutも幅を変えなかった。CSS静的確認、画像crop、PC表示を390pxのPASSにしない。タッチ操作、モバイルのfocus/リンク配置も未検証。現在のPreviewは固定候補であり、ローカル統合treeの新しいVercel Previewを作ったとは主張しない。

音声開始は両章で「読み上げを開始できませんでした」。さらに**既存production Learn「認証・認可・アクセス制御」でも同じ操作で同じエラー**を観測した。全ページの音声selectは標準音声1件。これによりCourse Vだけが壊れる仮説の支持は弱まったが、共有readerコードの問題とCloudのengine/device制約を完全には区別できない。具体的onerror code、live単体Web Speech対照は取得できず、原因は**UNKNOWN**。実発声を聴取したとは記録しない。根拠のないコード修正はしない。

**ANDROID_AUDIO：USER_DEVICE_AUDIO_PASS_REPORTEDを維持**。#153にある利用者のV-1/V-2日本語発声成功、一時停止・再開・停止、2倍・4倍成功を採用する。Workの独立音声測定とは別の証拠区分であり、今回未実施へ戻さない。章別全組合せ、390px、画面消灯、背景化、復帰、章末完走、ページ離脱後の停止は今回の2章では未確認。既存READMEにもAndroid背景再生は保証しない旨があるが、候補固有の新しい実機成功試験には転用しない。

両章の「独立した新規内容審査前」という注記が#146受入後の状態として古い点は、既存QAの非ブロッカー所見として維持する。将来、正式教材登録で注記を変える場合は別候補SHAとして扱う。

## 7. 個別判定

| 状態 | 判定 | 根拠 |
| --- | --- | --- |
| CONTENT_ACCEPTANCE | **PASS / CONTENT_ACCEPTED_EXACT_SHA** | #146、head一致、教材内容の再審査・改変なし |
| GIT_MERGE_READINESS | **PASS（技術的統合のみ）** | GitHub clean、最新main snapshotでnative merge、68 Node/50 Python、主要11ファイル不変。公開条件により実mergeはHOLD |
| BROWSER_QA | **PARTIAL** | PC表示/sliderは実測。390px・touch未検証。Cloud音声開始失敗を維持 |
| ANDROID_AUDIO | **PASS（利用者実機報告の範囲）** | #153の両章実発声と操作成功。独立測定・背景再生は未確認 |
| PRODUCTION_ACCESS_BOUNDARY | **FAIL（非公開要件に対して）** | 主ドメインから認証なしで本文/JS/Catalogの200を取得。5ファイルがmainとbyte一致 |
| RELEASE_READINESS | **RELEASE_HOLD** | 指示原則Aに該当。scheduled production反映により未承認Draftの直接URL公開リスクがある |

## 8. 阻害条件と最小の実行可能な変更

主要阻害条件は、内容受入やGit競合ではなく**本番主ドメインが公開され、scheduled workflowがmainをproductionへ送ること**。390px等の残余QAの扱いも明示的な判断が必要だが、現在の公開境界だけで#136の実mergeを止める十分な理由になる。

| 方針 | 必要な変更・実測 | 意味と残る承認 |
| --- | --- | --- |
| **本番全体を非公開にする（最小設定変更）** | 対象projectのVercel AuthenticationをStandard Protectionから **All Deployments**へ変更。主ドメイン、2 aliases、個別deployment、静的ファイルを匿名で再測定。共有例外の用途・扱いも承認範囲内で確認する | 教材本文を変えずに保護でき、Hobbyでも追加料金不要。既存Learn/Listenも認証必須になるためユーザー承認が必要。保護実測後も#136 mergeの別承認、正式登録の別承認を省略しない |
| **既存サイトの匿名公開を維持し、素材だけ統合** | 別の配信制御PRでproduction出力を明示し、`drafts/security-course-v/**` をproductionの配信対象から除外する。保護Previewは別出力/環境で保持。scheduled API経路にも適用し、受信本文がないことを実測する | Catalog未登録だけ、Git auto deploy=falseだけ、CLI upload専用ignoreだけに依存しない。配信制御の設計・実装・承認が別途必要。受入済み教材SHAは上書きしない |
| **正式教材として公開** | 公開承認後、別候補で古いDraft注記を訂正、正式Catalog/Courseへの登録と残余QAの受入条件を定めて検証する | 公開を意図したリリースとして扱う。今回の内容受入・音声成功は一般公開承認ではない |

素材統合と正式教材登録は分離できる。ただし現状では素材統合もproduction配信へつながるため、先に保護または出力除外が必要である。**今回、いずれの設定/実装変更も行わない。**

ユーザーの次の判断は、既存本番も認証必須にするか、匿名公開を維持してDraftを出力から除外するか、正式公開へ進むかである。個人用privateというREADMEの現在方針を維持するなら、All Deploymentsへの変更が最小である。今回の指示がSSO/例外/productionの無断変更を禁止しているため、その変更前には承認が必要。

## 9. 保存・実行範囲と再検証条件

実行したHTTP、UI操作、Git復元/merge、npm/Python回帰、loopback検証を新しい報告文書と証拠JSON・コマンドログへ保存する。教材#136、過去QA本文、Catalog、Vercel保護/例外/alias、productionは変更しない。報告専用PRのみCI成功・ファイル差分・全文readback後にmainへ統合し、#136へ判定と次操作をコメントする。**この本文作成時点では報告PRのCI/merge完了は未確定**であり、完了receiptはPR本文またはコメントに記録する。

報告PRのmain統合によって既存scheduled workflowが後に報告文書を配信する可能性はあるが、教材候補をmainへ含めず、production workflowの手動起動・新規deploy・promoteを行わない。#136やmainが今後変わった場合は、内容署名と統合検査の対象を区別して必要な範囲だけ再確認する。

添付：`SECURITY_COURSE_V_PRODUCTION_BOUNDARY_EVIDENCE_2026-10-13.json`、`SECURITY_COURSE_V_PRODUCTION_BOUNDARY_COMMAND_LOGS_2026-10-13.md`。HTTPの秘密Location、共有URL、Cookie、token、認証値、browser screenshotsは含めない。
