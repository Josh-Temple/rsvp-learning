# 情報セキュリティ本格学習 — 品質強化Wave 統合・公開判定（E）

Date: 2026-10-08 JST  
Repository: `Josh-Temple/rsvp-learning`  
Source instruction: Library `/RSVP Learning/Work Instructions/2026-10-08_security_learning_content_quality_and_progression_wave_instructions.md`  
Overall result: **PARTIAL_WITH_GAPS**（統合と自動検査は完了。教材の人手評価・実機検証・全30章の深度改善は未完了）

## 1. 実施とコミットの境界

- E開始時main: `2f4da8b15d2af1ef10f7d9dc650211482874015b`（2026-10-08 JST、GitHub API fresh read）。
- Worker CのPR [#90](https://github.com/Josh-Temple/rsvp-learning/pull/90)をコード競合なし・該当CI成功・文書1ファイルのみの差分を確認してsquash merge。
- C統合後main: `f14612253794e58e3ca565aab52d2281a12d74fd`。このSHAでGitHub Test成功とVercel production READYを確認。
- A [#93](https://github.com/Josh-Temple/rsvp-learning/pull/93)、B [#92](https://github.com/Josh-Temple/rsvp-learning/pull/92)、D [#91](https://github.com/Josh-Temple/rsvp-learning/pull/91)はE開始時に既にmainへmerge済み。再mergeしない。
- 旧Draft [#6](https://github.com/Josh-Temple/rsvp-learning/pull/6)と別件 [#29](https://github.com/Josh-Temple/rsvp-learning/pull/29)は未統合のまま。旧Draft教材を現行仕様に準拠した成果として流用しない。
- **この文書は統合時点の記録であり、過去のC/D監査を最新版教材の再監査として読み替えない。**

## 2. 統合した成果と残存問題

| 担当 | mainにある成果 | 確認できた範囲 | 未完了・限界 |
|---|---|---|---|
| A | `scripts/rsvp-chunk-boundaries.mjs`、validator、`tests/rsvp-chunk-quality.test.mjs`、5章のMarkdown・RSVP JSONの用語破断修正 | 30章の英字連続分断をエラーにする自動検査、24文字上限、同期バリデータがCI成功 | 助詞・述語をまたぐ不自然な切れ目は7例がREVIEW扱い。日本語の自然さを機械だけで保証しない |
| B | Learn 4章改稿、逐語再掲テストから概念対応・出典保全への変更、`docs/SECURITY_LEARN_PILOT_2026-10-08.md`、理解確認12問 | 4章の概念目印と出典、静的DOM・共通プレイヤーの回帰検査がCI成功 | 4章以外のLearn 26章は改稿対象外。対応表は文字列検査であり、概念理解・自然な音声・事実正確性の完全検査ではない |
| C | `docs/SECURITY_DEEP_CONTENT_AUDIT_2026-10-08.md`：30/30章の定性的監査と優先課題 | 本文を対象とした10観点のレビューと章別の改善案。PR #90をEでmerge | **全30章が専門学習の深度基準でNEEDS_REVISION**。CレビューはA/B統合前のsnapshotであるため、修正済み表示不良を現行の未修正欠陥と誤記しない |
| D | `docs/SECURITY_DEEP_COVERAGE_2026-10-08.md`：既存30+計画30、`docs/SECURITY_COURSE_V_PILOT_PREPARATION_2026-10-08.md`：Course V先行2章の講義案と問題 | 8 Course / 60 Lessonの設計対応と、Course V先行教材の品質ゲートを文書化 | V〜VIIIは未実装。2章も**講義案・制作準備のみ**で、Markdown/JSON/Learn/Catalogへの公開登録はHOLD。出典候補を主張ごとの確認済み根拠とみなさない |

旧欠陥と修復例:
- `Infrastructure as Co` / `deも使えます。` → `Infrastructure as Code` / `構成をコードとして管理します。`
- `Display name spoofin` / `gも残ります。` → `Display name spoofing` / `表示名の偽装も残ります。`
- `SaaSは設定がAttack surfa` / `ceです。` → `SaaSの設定も攻撃面です。`
- 新しい検証で隣接する英字断片をエラーとし、助詞による分割は人手レビュー候補として区別する。

## 3. 状態・テスト・公開は別々に判定する

| 項目 | 結果 / 根拠 |
|---|---|
| 現行カタログ | 新系列Course I〜IVは30 Lessonを `COMPLETE v0.1` として登録済み。旧入門8章は別系列。`COMPLETE v0.1`は**専門教育としての監査合格ではない** |
| 全系列計画 | I〜IV: 実装30 / V〜VIII: 計画のみ30。V先行2章も未実装 |
| CI | `f146122`のGitHub Actions `Test` **success**: [run 37761061872](https://github.com/Josh-Temple/rsvp-learning/actions/runs/37761061872)。内部の `npm run check` を含む。手元で独立したローカル実行を行ったとの意味ではない |
| GitHub Pages | `f146122`の[run 37761061890](https://github.com/Josh-Temple/rsvp-learning/actions/runs/37761061890) **failure**。直前の`2f4da8b` runでは`npm run check`と`npm run build:pages`が成功し、`actions/configure-pages@v5`がPages site `Not Found`で失敗。Pagesが有効化/設定されていない可能性が高い。Pages公開成功とは扱わない |
| Vercel production | Eが `f146122` を指定してdeployment `dpl_5oVKvs97YhJw9EdEpre3vNweWHQC`を作成。Vercel APIで`READY`、`target=production`、domain `rsvp-learning-kappa.vercel.app`へのaliasを確認。**build完了/aliasの証拠であり、実ブラウザでの操作検証ではない** |
| ブラウザ・Android Chrome | **NOT_VERIFIED**。本環境からproductionのHTML取得はできず、Chrome読み上げ、Web Speech API、再生中の章間移動、音声の自然さは実機未確認 |
| 外部一次資料 | A〜D文書に確認範囲と候補資料の記載あり。Eが全30章の原典URL・節・本文主張を網羅照合したとは主張しない |

残る具体的なRSVP文節REVIEW例: `Identity proofingに` / `も失敗があります。`、`Identity Providerを` / `強く守ります。`、`Digital signatureとは` / `異なります。`、`Secret managerを` / `使う場合があります。`、`Emergency rotationも` / `演習します。`、`Load balancerで` / `終端する場合もあります。`、`VPNとZero Trustを` / `対立概念にしません。`。CIの合格だけでこれらを適切な切れ目と確定しない。

## 4. 受け入れ条件の再判定

- **統合・自動検査: PASS**。Cの文書をmergeし、A/B/Dの変更と併せて `main` のTest成功を確認。
- **専門語の英字途中破断: 機械検査の対象範囲ではPASS**。英字以外の文節・助詞の自然な区切りは未解消。
- **パイロット4章: PARTIAL_WITH_GAPS**。HTML改稿・検証項目・理解確認問題案は成立。人による連続聴取、Markdown/JSON/HTMLの意味対応再審査、端末確認が不足。
- **30章品質監査: 作成済み / 改稿未完**。Cの監査結果は全30章NEEDS_REVISION。形式上のstatusを一律DRAFTへ戻す根拠ではない。
- **60章計画: 設計済み / 未実装30章**。Course V先行2章の公開実装は品質ゲート未通過のため見送り。
- **公開: Vercel deployment READY / 実ページ動作NOT_VERIFIED、GitHub Pages BLOCKED**。
- **Wave全体: PARTIAL_WITH_GAPS**。実際の専門学習の有効性まで証明していない。

## 5. 次の実行順

1. **4章の人手教材レビュー** — `security-risk-assessment`、`security-sessions-federation-oauth-oidc-saml`、`security-cloud-shared-responsibility-iam-config`、`security-email-spf-dkim-dmarc`を実際に読み/聴き、原稿・JSON・HTMLの内容対応と規格主張を確認。12問の誤答理由を含め理解可能性を記録。
2. **残る分割REVIEWの解消** — 上記7例を原稿・RSVP JSON同時改稿し、専門用語を崩さず意味単位を保つ。問題のある切断を新しいフィクスチャへ追加。英字連続以外は安易に全件ERRORへ格上げしない。
3. **Android Chromeとproductionの操作QA** — 390pxで4章の本文・リンク・RSVP・Learnの再生停止、速度/音声変更、Course I/III/IVの章間自動遷移、実際の聴こえ方を確認。Chrome標準読み上げとWeb Speech APIを区別し、画面OFF/バックグラウンド再生は実測前に保証しない。
4. **他26章への段階的なLearn改稿・30章内容深掘り** — C監査のP1を起点に、判断ケース、反例、証拠・検証方法を増やす。文字数や形式上のPASSだけで品質判定を行わない。
5. **Course V先行2章の受入審査** — Dの準備資料を出典節まで照合し、4章のパイロット品質が受入可能な場合だけMarkdown・RSVP JSON・Learn HTML・Catalogを一体で新設し、CIと実機確認を行う。
6. **GitHub Pages環境の設定確認** — GitHub repository Settings → PagesでActionsによるビルド/デプロイが有効か、private repositoryのPages条件と公開範囲を所有者が確認。機能を無断で一般公開しない。

## 6. 正本リンク

- [内容品質基準](CONTENT_QUALITY_STANDARD.md)
- [Course I〜IV監査](SECURITY_DEEP_CONTENT_AUDIT_2026-10-08.md)
- [RSVP分割品質点検](SECURITY_RSVP_BOUNDARY_REVIEW_2026-10-08.md)
- [Learnパイロット4章と12問](SECURITY_LEARN_PILOT_2026-10-08.md)
- [60章カバレッジ](SECURITY_DEEP_COVERAGE_2026-10-08.md)
- [Course V 2章の準備](SECURITY_COURSE_V_PILOT_PREPARATION_2026-10-08.md)
- [カリキュラム正本](SECURITY_DEEP_CURRICULUM_2026-10-08.md)


---

## 7. 第2Wave E統合・実質品質・配信判定（2026-10-08 JST、後続snapshot）

対象指示: Library `libfile_8eee5d908a7081919d89db9f30fc4df6` / `2026-10-08_security_learning_semantic_quality_and_field_validation_wave_instructions.md`。前節は当時の履歴として維持し、**この節以降の判定を後続snapshotに適用**する。

### 7.1 最新main・安全な取り込み

- E開始main（full SHA）: `2eb12f4847f204816fd9aa9c2b1fdc512805e380`。
- 教材・QA・プレイヤー統合後のmain: `0a168c7615b573620fd610a198f75453be4ed975`。本追記を入れるPRのmerge後SHAとは区別。
- [A #97](https://github.com/Josh-Temple/rsvp-learning/pull/97) → `425eb0d0f9e76b38a81616d5fe43c632cbc7a59e`。既知7候補の意味単位を6章のMarkdown/RSVP JSONで修正し、境界のレビュー検出と回帰検査を追加。Learnの音声品質は未認定。
- [C #95](https://github.com/Josh-Temple/rsvp-learning/pull/95) → `71d2d4da731d86f3b2508dd0eb011fd8ca302340`。既存30章・4章の主張・12問の再監査を文書へ追記。Cの観察はBの新規4章改稿を独立監査したものではない。
- [D #96](https://github.com/Josh-Temple/rsvp-learning/pull/96) → `14b48a1680c6954fb2668be190a25d72993d3249`。Android/公開の実施条件と未検証、連続再生で出典が落ちる静的不良を記録。D記録のPages構成・公開SHAは記録時点のsnapshot。
- [B #98](https://github.com/Josh-Temple/rsvp-learning/pull/98) → `aed193881e785cd340891d737ced952a62ec8a03`。4章の説明/反例を補強し、BEC・ランサムウェア・セッション攻撃・本人確認の4章にLearn改稿を展開。概念ゲートと問題案は学習者試験ではない。CがP0としたメール見出し「認証済みでも詐欺メールとは限らない」は、merge前に「認証済みでも安全とは限らない」へ修正し、回帰テスト追加・head `ca7712e9be1e96dcd9d3e13b6f6f73a2d457810a` のTest成功を確認。
- [E #99](https://github.com/Josh-Temple/rsvp-learning/pull/99) → `0a168c7615b573620fd610a198f75453be4ed975`。コース連続再生の章別出典を`#learn-course-article`とは別領域に表示し、章切替時にも更新/非表示を管理。4章の構造回帰テストを追加。最初のCI失敗はテストが`</article>`直後に改行を認めないためで、正規表現を修正。修正後head `4cb148218e8b45233b58bc7b67f8b190d6fc1901`とmerge後mainのTestがともに成功。実ブラウザでの表示・動作再現は未実施。
- #6（旧Draft）と#29（別案件）はmergeせず保持。A/Bは同一lessonのMarkdown/JSONとLearn HTMLの説明目的・用語を代表例で照合し、Catalog/status/旧入門Courseは今回変更していない。全30章の意味を完全に人手審査したという意味ではない。

### 7.2 検証・内容品質の受入（PASSの範囲を限定）

| 対象 | 実結果と境界 | 判定 |
|---|---|---|
| GitHub Test / npm run check | #97/95/96/98/99 headの成功を確認。統合main `0a168c7615b573620fd610a198f75453be4ed975` の [Test run 37782556943](https://github.com/Josh-Temple/rsvp-learning/actions/runs/37782556943) はsuccess。GitHub Actionsでの実行であり、Eがローカルnpmを別途動かしたものではない | 機械検査 **PASS** |
| RSVP既知7候補 | Aの6章のMarkdown/JSONを同期して修正、24文字制約・境界回帰ゲートをCIで通過 | 指定された機械・差分検査 **PASS** / 実機の自然さ **NOT_VERIFIED** |
| Learn最初の4章 | リスク評価、OAuth/OIDC/SAML、Cloud、メール認証の判断例・反例をBが追補。メール見出しP0は修正 | 改稿/静的ゲート **PASS** / 音声・学習者理解・網羅的主張審査 **NOT_VERIFIED** |
| Learn横展開4章 | BEC、ランサムウェア、資格情報・セッション、本人確認・認証・認可。12問に加えて各2問の案を記録 | 実装/静的ゲート **PASS** / Cの独立レビュー **NEEDS_REVISION** |
| 30章 | Cの第2巡で30/30 `NEEDS_REVISION`（専門教育の深度基準）。Aの境界修正/BのHTML横展開をこの判定へ無条件に横滑りさせない | **NEEDS_REVISION** |
| Learnコース連続再生での出典欠落 | E #99で静的実装の欠落を修正。ページの実ブラウザ操作と全章の出典の可視性は未確認 | 修正実装とテスト **PASS** / 実動作 **NOT_VERIFIED** |
| Android Chrome・390px・Web Speech API・Chrome標準読み上げ | Dが実機/操作を確認できず、Eも実端末や実音声を測定していない。画面OFF/バックグラウンドも未測定 | **NOT_VERIFIED** |
| Course V V-1 / V-2 | Secure by Design/Default、入力・出力・Injectionは講義案のみ。A/B/C/Dの品質・実利用ゲートがそろわず、原稿・JSON・Learn・Catalogの完成登録なし | **HOLD** |
| Course V〜VIII | 計画上の30章は未実装。I〜IVの30章と区別 | **NOT_IMPLEMENTED** |

一次資料: CはNIST、IETF、OIDC/OASIS、AWS等の指定主張の限られた節を照合。B横展開の全主張、全Lessonの出典、実地の音声・理解度は未照合。`COMPLETE v0.1`は既存の形式ステータスであり、専門教育としての監査合格とは扱わない。

### 7.3 productionと公開境界（最終確認の範囲）

- Vercel project: `rsvp-learning` / `prj_7yYGl5D3Q7UwQgQuXaGmOYLkTzbu`。E開始時、alias `rsvp-learning-kappa.vercel.app` は旧 `f14612253794e58e3ca565aab52d2281a12d74fd` のREADY deployment `dpl_5oVKvs97YhJw9EdEpre3vNweWHQC` に向いていた。
- EはCI成功を確認した統合main `0a168c7615b573620fd610a198f75453be4ed975` を指定してproduction deployment `dpl_6DLmNJXkTHyA63X6WWeshKzk4E4p` を作成。Vercel APIで **READY / target=production / meta.githubCommitSha一致** を確認。alias `rsvp-learning-kappa.vercel.app` も同deploymentへの割当てをAPIで確認。**これは配信設定とbuild完了の証拠であり、匿名ブラウザのHTML/操作・Android Chrome・音声の実測ではない。**
- 同日、別作業によるmain `2f25d4a1377d89e21cea6333b806ba2eac1b3c28` で公開方針が改定された。[`PUBLIC_LISTENING_BOUNDARY_2026-10-08.md`](PUBLIC_LISTENING_BOUNDARY_2026-10-08.md) に従い、**RSVP Learningはprivate維持、公開100スロットは独立した`Josh-Temple/instant-radio`へ**。一時的なRSVP用Pages workflow/スロットは削除。旧D報告に記載の`push(main)` Pages workflowを現在状態として扱わず、公開Pages再有効化をしない。

### 7.4 E最終判定と次Wave

**Wave全体 = `PARTIAL_WITH_GAPS`。** A〜DのPRとEのP1修正はCI成功の上でmainへ統合。4パイロット+4横展開の機械的な受入・出典表示のコード修正・Vercel READYとalias一致までは確認した。ただし内容の主張別の独立再監査、Android実機/音声、一般ブラウザでの実表示・操作、学習効果の検証を残す。**Course V V-1/V-2 = `HOLD`**、Course V〜VIIIの計画30章は実装済みとして登録しない。

次の実行順と終了条件:

1. **P0〜P1 実機・公開操作**（D/利用者、E）: production URL・Git SHAを記録し、390px Android Chromeでコース選択→単章→連続再生→出典→前後章→速度/音声→最終章停止を確認。ページ内Web Speech APIとChrome標準「読み上げ」は別々に記録。実音声の聴きやすさも評価し、確認できない項目はNOT_VERIFIED。
2. **P1 B改稿8章の独立内容審査**（C/B）: 4パイロットと追加4章の重要主張を一次資料の版/節で照合。Markdown/JSON/Learnの因果・否定・責任分界が矛盾しないことを確認。12+8問の模範解答、誤答が成立し得る条件、採点基準を再点検。資料がない主張は保留。
3. **P1 残り22章の優先改稿**（B/C）: 30章中で内容未改稿のLessonに、独立した架空ケース・判断条件・失敗・検証証拠を順次追加。1章ずつ専門教育深度ゲートで再判定。既存の旧入門Courseは保全。
4. **P2 Course Vの再判定**（E）: 上記内容・実機ゲート合格後のみV-1/V-2を安全な1 PRで追加。失敗ならHOLD継続。
5. **配信境界の維持**（E）: public Chrome読み上げの100スロットはInstant Radioへ委ね、private RSVPコンテンツを自動で一般公開しない。

更新履歴の確認はこの正本とGitHub PR/CI、Vercel APIの実際のsnapshotを優先する。旧節の時点情報や古いPR説明を現行の主張に用いない。


---

## 8. 第3Wave E統合・独立審査・本番配信の最終判定（2026-10-09 JST）

対象: Library `/RSVP Learning/Work Instructions/2026-10-09_security_learning_independent_validation_and_depth_expansion_wave_instructions.md` Section 7。過去の各節を改変せず、以下を後続snapshotとする。

**総合: PARTIAL_WITH_GAPS。** A〜Dの提出物を内容・CI・依存関係で分離判定し、審査記録・QA記録・Bの限定改稿・Eの限定修復を取り込んだ。本格的な専門学習の全章合格、Android実機、音声、学習効果は未達である。

### 8.1 fresh readとSHA固定統合

- E開始時にprivateリポジトリ `Josh-Temple/rsvp-learning` の `main` を再取得: **`fd003b63b816799dd8f1f1eac0de4fd70db32da9`**（2026-10-09 JST）。当時のA〜D PR #101〜#104はいずれもこのbase SHA。変更対象ファイルとdiff、独立監査、head CIを確認した。
- B [#101](https://github.com/Josh-Temple/rsvp-learning/pull/101): head `f8216e0bbb6fce7cd2155a00f28318b65ec989cc`、4ファイル、Test [37856323514](https://github.com/Josh-Temple/rsvp-learning/actions/runs/37856323514) success。既存8章のLearnうち2章を限定修正、20問の採点基準を補充。
- A [#102](https://github.com/Josh-Temple/rsvp-learning/pull/102): head `198df1210b176d880225b59e121c3953268f2b50`、10ファイル、Test [37856299497](https://github.com/Josh-Temple/rsvp-learning/actions/runs/37856299497) success。4章のMD/RSVP改稿。ただしdraft、Cの重要指摘、Bの新4章Learn欠落のため**非統合・HOLD**。
- C [#103](https://github.com/Josh-Temple/rsvp-learning/pull/103): head `a2e3a7f7f8c33c2f7cbc4336dee87521cea30b19`、監査文書1ファイル、Test [37856722397](https://github.com/Josh-Temple/rsvp-learning/actions/runs/37856722397) success。第9節で上記A/Bの実headを追補監査。
- D [#104](https://github.com/Josh-Temple/rsvp-learning/pull/104): head `7e5b1c11202dd9a6888530a6d9772f11f4610711`、QA文書1ファイル、Test [37856595983](https://github.com/Josh-Temple/rsvp-learning/actions/runs/37856595983) success。
- 安全な順序でC #103→D #104→B #101を、それぞれexpected head SHA固定でsquash merge。mainは順に `f14669f5320bc158616f21193e724dd28d310f52` → `f7eafda837dea3fb93d3dafdb6b8af9a90a5e552` → `779f0326b94eeb5978d0d2976400ccf17ff62c93`。各main Test [37857480951](https://github.com/Josh-Temple/rsvp-learning/actions/runs/37857480951)、[37857520874](https://github.com/Josh-Temple/rsvp-learning/actions/runs/37857520874)、[37857574445](https://github.com/Josh-Temple/rsvp-learning/actions/runs/37857574445) はsuccess。
- E限定修正 [#105](https://github.com/Josh-Temple/rsvp-learning/pull/105): head `0230f8be13a8f051b782e00cbb41b58d15ab9181`。`security-malware-ransomware.json`の「侵害の最終段階」とするsummaryをLearnと整合する条件付き表現へ変更。`docs/SECURITY_LEARN_PILOT_2026-10-08.md`のメールQ1をRFC5322.FromとDMARCドメインアライメントに限定し、模範解答も修正。2ファイルのみ、readback済み、head Test [37857648260](https://github.com/Josh-Temple/rsvp-learning/actions/runs/37857648260) success後にSHA固定merge。
- **検査・配信用main: `1142d8090dff27516fd73385770478e91b49412a`**。main Test [37857689589](https://github.com/Josh-Temple/rsvp-learning/actions/runs/37857689589) success。`.github/workflows/test.yml` の `npm run check`（test+validate）実行による結果。Eが別途ローカルnpmを実行した証拠ではない。
- この第8節を追加するE文書PRのmerge後main SHAとTestは別途確認する。後続文書コミットによりmainが進んでも、上記は配信コードのsource SHAとして記録する。

### 8.2 各Workerと教材品質の境界

| 区分 | 今回確認した範囲 | 判定と残件 |
| --- | --- | --- |
| A / 新優先4章 | `security-threat-modeling`、`security-mitre-attack-scenarios`、`security-password-mfa-phishing-resistant`、`security-firewall-proxy-waf-ids-ips` のMD/JSONをAが同期改稿。CがA headで55/56/59/56 chunksの番号・文章を照合 | **4/4 NEEDS_REVISION、#102 HOLD**。信頼境界の説明、耐フィッシング認証条件、個別原典、対応Learn 4章とC修正版独立審査が不足。mainには未反映 |
| B / 改稿済み8章 | 2章の限定HTML改善、20問の2/1/0点の採点案。E #105でsummaryとメールQ1を補修 | 変更箇所はC部分PASS、20/20問の採点基準の構造はC確認。ただし**8/8 NEEDS_REVISION**、学習者の理解・採点者間一致はNOT_VERIFIED。#105修正版の再独立審査も未了 |
| C / 30章 | 既存8章とA/B新headを区別して審査、30章残件表更新 | 8章は新規詳細審査、残22章は前回残件を継承。**30/30専門学習深度NEEDS_REVISION**から全合格へは昇格しない。source verificationは確認できた節に限りpartial |
| D / production QA | 旧fd003系productionについてVercel API、HTTP代理、8章HTML、JSとCatalog、章別出典の静的機構を確認 | 静的PASSと分離して、390px/desktopの実ブラウザ、Android Chrome、Web Speech API実音声、Chrome標準読み上げ、実際の章切替・出典更新・画面OFFはすべて**NOT_VERIFIED** |

重大な逆意味の新しい確証はC/Dが調べた範囲では未検出。ただしP1として `security-identity-proofing-authn-authz` の本人確認範囲、`security-sessions-federation-oauth-oidc-saml` のトークン・audience・失効の適用条件、`security-cloud-shared-responsibility-iam-config` の責任分界と出典の直結性などが残る。規格・勧告の一次資料は主張別に一部照合しただけで、全文の保証ではない。

### 8.3 Vercel実配信とprivate/public境界

- 対象 project `rsvp-learning` / `prj_7yYGl5D3Q7UwQgQuXaGmOYLkTzbu`。E開始時のproduction `dpl_CYHqCXPTCoEqH3r9QDK66XLiy5fN` はREADYでsource SHAは `fd003b63b816799dd8f1f1eac0de4fd70db32da9`。
- 上記検査済みmain `1142d8090dff27516fd73385770478e91b49412a`を明示してproduction Git deployment **`dpl_BMKjt1iTZN5EGxUJT8RJWpoe1VVf`** を作成。Vercel APIで **READY / target production / githubCommitSha一致**を確認。`get_deployment`でalias `rsvp-learning-kappa.vercel.app` を確認し、`get_alias` でこのhostnameが同deployment IDに割り当てられていることを再確認。
- 本番ビルドと配信先割当てのPASSは実ブラウザ画面・Android・音声のPASSではない。Dが旧sourceで実施したHTTP確認を新sourceの実操作検証へ流用しない。
- RSVP LearningのGitHub repositoryはprivate。公開Chrome標準読み上げ用100スロットは別public `Josh-Temple/instant-radio` 所管。RSVP GitHub Pages、公開同期、既存Vercelアクセス保護設定は変更していない。旧Draft #6・別件 #29はmergeしない。

### 8.4 Course V V-1/V-2と次Wave

- V-1 `security-secure-by-design-default` = **HOLD**。V-2 `security-input-output-injection` = **HOLD**。既存準備資料の講義試案・架空ケース・問題は未登録。MD/JSON/Learn/Catalogの一体実装・独立審査・ブラウザ品質のゲートを満たしていないため、DRAFT/COMPLETE/配信と申告しない。Course V〜VIIIは計画30章のまま。
- **P1 A→B→C / #102**: threat-modelingの本文9は権限だけに限定しない信頼境界へ、phishing-resistantの本文20はNIST SP 800-63B-4 §3.2.5のverifier binding等の条件へ修正しMD/JSON同期。MITRE手法と旧NISTガイドの個別出典を精査。確定A headからLearn新4章をBが制作しCがそのheadを独立再審査。ここまで#102はHOLD。
- **P1 B→C**: `security-identity-proofing-authn-authz`、`security-sessions-federation-oauth-oidc-saml`、`security-cloud-shared-responsibility-iam-config` の限定・根拠を追加レビュー。#105の変更後主張と問題もCが新mainで再審査。20問の学習者評価・採点再現性は実測するまでNOT_VERIFIED。
- **P1 D+利用者/E**: `https://rsvp-learning-kappa.vercel.app/` の新source `1142d80…` をAndroid Chrome実機でテスト。RSVP単章、Learn単章とCourse I/III/IV通し再生、章間遷移、章別出典、速度・音声切替、最終停止。ブラウザ内Web Speech APIとChrome標準読み上げ、画面OFFは試験ごとに区別。未実施はNOT_VERIFIED。
- **P2 E**: 合格範囲に限り30章残件表を更新。V-1/V-2は上記内容・動作ゲートがそろうまでHOLDを維持。既存入門8章、status、カタログ、個人localStorage、公開境界を保全。

**E最終判定: PARTIAL_WITH_GAPS。** CI success、内容部分PASS、静的HTTP PASS、deployment READYはそれぞれ根拠範囲を限定し、実機・学習効果への外挿をしない。


---

## 9. 第4Wave E統合・4章閉鎖ゲート・実利用検証判定（2026-10-09 JST、後続snapshot）

対象: Library `/RSVP Learning/Work Instructions/2026-10-09_security_learning_four_lesson_closure_and_real_use_validation_wave_instructions.md` §7。第8節以前は各当時の歴史的記録として保持する。今回の総合判定は **PARTIAL_WITH_GAPS**（2026-10-09 JST）。「4章完成」「音声での実利用PASS」「30章専門品質PASS」ではない。

### 9.1 E開始時の正本・PR head・安全な統合

- E開始時GitHub `Josh-Temple/rsvp-learning` (private)、main full SHA = `1bb69060843d8ddb7d7126f094e79a5670e64713`。open対象をfresh取得して確認。既統合 #101/#103/#104/#105/#106 を再mergeしていない。旧Draft #6 / 別案件 #29 も対象外。
- A [#102](https://github.com/Josh-Temple/rsvp-learning/pull/102): Draft/HOLD。最新head `1d7aaf0aa16733cd49b46ff503437d38efadffd4`、PR表示base `fd003b63b816799dd8f1f1eac0de4fd70db32da9`（E開始時mainと異なる）。[Test 37880535899](https://github.com/Josh-Temple/rsvp-learning/actions/runs/37880535899) = success。4章MD/JSONを修正、重要2表現は現headから直接取得（threat-modeling本文9「主体や管理領域をまたぐ境界」／phishing-resistant本文20「偽の検証者に秘密や有効な出力を渡しません」・22「認証先の名前と暗号的に結び付けます」）。RSVP 24字や内容の完全な意味保証をEが独立再監査したわけではない。
- B [#107](https://github.com/Josh-Temple/rsvp-learning/pull/107): Draft/HOLD。head `f21672b940af4f00a4bc352d7b884ed999096a7a`、base `1bb69060843d8ddb7d7126f094e79a5670e64713`、[Test 37880900728](https://github.com/Josh-Temple/rsvp-learning/actions/runs/37880900728) = success。A修正head `1d7aaf0...` を明示した新4章LearnのHTML 4件、既存3章のP1表現、fixture/テスト、8件の条件変更問題案を提出。4件のHTMLとA現headの該当MD/JSONをEが取得し、存在と重要2表現・出典節の構造を限定確認。**CによるB現headの独立意味審査は未実施**。
- C [#109](https://github.com/Josh-Temple/rsvp-learning/pull/109): head `15b03ea3469cb8fb964ab7308d91bda5eb4ca1b4`、[Test 37880543079](https://github.com/Josh-Temple/rsvp-learning/actions/runs/37880543079) = success。**C第10節はA旧head `198df1210b176d880225b59e121c3953268f2b50` の監査**であり、A修正head `1d7aaf0...` とB現head `f21672b...` の審査ではない。#105後mainのランサムsummary・メールQ1の局所PASS、旧A headの4章MD/JSON同期、既存20問の採点構造20/20 reviewed、30章の継続判定という明示的な範囲だけを受理。変更は既存監査文書への149行の追記のみ、削除0行。Eはheadを固定してsquash merge → main `328a76e5bc0b559e7082e0f07c27bab9498a4f95`。[main Test 37918446422](https://github.com/Josh-Temple/rsvp-learning/actions/runs/37918446422) = success。
- D [#108](https://github.com/Josh-Temple/rsvp-learning/pull/108): head `6766cc186eeefc6b46c51274d946db8714608da1`、[Test 37880520305](https://github.com/Josh-Temple/rsvp-learning/actions/runs/37880520305) = success。既存QA文書へ65行のみ追記、削除0行。文書限定と保全を確認後、Draftからレビュー可能へ変更してhead固定squash merge → main `ea0f20a9fd4618cd8e4b49c0e66914e2e314ca09`。[main Test 37918542679](https://github.com/Josh-Temple/rsvp-learning/actions/runs/37918542679) = success。
- **教材4章は一体統合用PRをまだ作成しない**。原因はC監査がA/B現headに追い付いていないこと。A単独またはB単独をmainへmergeするとMD/JSON/HTMLの改稿版が混在するため、両PRともDraft/HOLD。上記mainの進行は監査・QA記録のみであり、教材の新4章はmain/本番未反映。
- 今回Eのローカル `npm run check` は **NOT_RUN**。各head/mainのGitHub Test run URLと判定を別途記録した。テストsuccessから実際の学習効果・自然な音声・一次資料全件確認は推定しない。

### 9.2 媒体横断・専門品質の分離ゲート

| 対象 | 今回受け入れた証拠 | 判定・次の必須条件 |
|---|---|---|
| A新優先4章 | 旧Cの指摘2件に対し現A headのMD本文9/20/22が変更されたこと、現head CI成功、MD/JSON 4組の提出 | 修正実装 **あり**。Cによる `1d7aaf0...` の最新head主張・原典/版/節・条件・MD/JSON再審査が**未完了**。内容 **NEEDS_REVISION/HOLD** |
| B新優先4章Learn | 新HTML4件と出典節、fixture、A版固定の対照表、現B head CI成功 | **実装あり・横断内容PASS未認定**。Cによる `f21672b...` の新Learn全文とA現headとの意味・否定・例外・出典照合が必須 |
| 既改稿8章のP1 | Bは本人確認/SSO・OAuth・クラウドのLearn表現を補足。Cは旧mainの原稿と第105号修正、20問の採点構造を局所審査 | 現mainのMD/JSON: `security-identity-proofing-authn-authz` 本文8、`security-sessions-federation-oauth-oidc-saml` 本文11/23、`security-cloud-shared-responsibility-iam-config` のCISA参照先のずれが残る。3形式の修復、原典対照、C再審査が必要。**8/8 NEEDS_REVISION** |
| クイズ20問 / 新提案8問 | 20/20はCの採点構造reviewed。Bの4章追加8問は提案 | 学習者回答0・採点者間一致0。問題の形式審査と実学習 **NOT_VERIFIED** を区別。新8問は未正式実装 |
| 30章深度 | C第10.6節: 既存main8章の局所再確認、旧A Draft4章のレビュー、残18章の前回判定継続 | 30章すべての新規全文監査と誤称しない。形式上 `COMPLETE v0.1` でも専門内容 **30/30 NEEDS_REVISION** を維持 |

Aの重要表現・4章Learnの限られた取得は、一次資料原典に基づく全主張の `source_verified` でも、実音声による聴取PASSでもない。MITRE tactic/technique区別、NIST SP 800-63B-4 §3.2.5、OWASP trust boundary、旧NIST SP 800-41 Rev.1/800-94の現代機器への適用には、Cの版・節単位再判定が必要。現時点で新しい実証済P0逆意味の追加確定なし。ただし重大誤りが存在しないとの保証ではない。

### 9.3 本番・利用者環境・公開境界

- E確認のVercel production: `rsvp-learning`、deployment `dpl_DNLnA1qKULfgvJQbLyGXrGvFufFE`、**READY / target=production**、source `1bb69060843d8ddb7d7126f094e79a5670e64713`。alias一覧で `rsvp-learning-kappa.vercel.app` の同deploymentへの割当てを確認。Eのmain `328a76e...` / `ea0f20a...` は文書のみの変更であり、教材・コードを含む新productionは作成していない。
- D第7節の許可済みHTTP代理: JS 3/3本文一致、Catalog 2/2構文、既改稿Learn 8/8構造、トップ等は限定PASS。**現状本番はA/B新4章を配信していない**。改稿が将来配信された際には新SHAで再取得する。
- GUI desktop / 390px、Android Chrome実機、Web Speech APIの**実音声**、Chrome標準「このページを読み上げ」、画面OFF、Course I/III/IVの章移動・出典更新・最終停止の**実操作**、利用者の理解獲得は**すべてNOT_VERIFIED**。Vercel READY、HTTP 200、JSロジックの存在を実操作PASSにしない。
- private `rsvp-learning`、学習履歴/localStorage、Catalog/status、既存入門8章、公開境界 `docs/PUBLIC_LISTENING_BOUNDARY_2026-10-08.md` を維持。Chrome標準読み上げ用public 100スロットは別repo `instant-radio`。Pages再有効化・自動公開同期・認証設定変更なし。

### 9.4 Course Vと次Waveに引き継ぐブロッカー（受入条件）

- **V-1 `security-secure-by-design-default` = HOLD、V-2 `security-input-output-injection` = HOLD**。mainのCourse/Catalogに両IDは未登録、既存準備文書は制作案。A/Bの最新head独立審査、必要な実利用観測、両新LessonのMD/JSON/Learn/出典節/架空ケース/条件変更問題/CI/統合検査の全ゲートがそろうまで `IMPLEMENTED` にしない。Course V〜VIII計画30章も未実装。
- **P1 / C**: A #102 `1d7aaf0...` の重要修正とB #107 `f21672b...` の4章Learnを実headで独立審査し、主張ごと `source_verified/partial/not_verified`、LessonごとのP0/P1・否定・条件・実例を記録。C #109の旧head結論の機械的使い回しは禁止。
- **P1 / Aまたは原稿担当＋B＋C**: 既存8章のうち本人確認本文8・SSO/OAuth本文11/23・Cloud出典根拠をMD/JSON/HTMLで修正し、Cの最新版再審査を受ける。20問の構造と新8提案の根拠も条件付きで更新。
- **P1 / E**: C審査が新A/Bの具体的headに対して合格し、P0が解消した後のみ、最新mainをbaseに**A+Bを1統合PR**として作成（HTMLだけ/原稿だけの一時露出は禁止）。差分・24字・出典・否定・旧入門/学習履歴保全を検査、head Test success後SHA固定merge→新main Test再確認。必要なコード/教材配信変更が成立した場合に限り、CI済みSHAをVercel productionへ配信してREADY/source/aliasをreadback。
- **P1 / D＋Android実機提供者**: 本番SHA付き操作表で単章RSVP、Learn、Course I/III/IVの自動章移動・出典切替・最後の停止、Web Speech APIとChrome標準読み上げを**別試験**。端末情報・時刻・期待/実測と再現記録を取得し、未観測はNOT_VERIFIED。
- **P2 / C・教材担当**: 上記P1解消後、残18章を含む30章深度の未改稿部分を前提・反例・判断・観測証拠に基づき優先改稿。Course Vは独立ゲート合格後に再審査。

**E最終判定: `PARTIAL_WITH_GAPS`。** 今回安全にmainへ取り込んだのは#109監査記録と#108実利用QA記録のみ。内容完成や新4章本番配信の主張はしない。この第9節のE文書は別PRで審査・CI・readbackし、文書コミットによるmain進行と本番教材ソースSHAを区別して最終確認する。

---

## 10. 2026-10-09 E継続 — PR #111 最新head・原典再照合・統合前停止条件

**総合: PARTIAL_WITH_GAPS。** 第9節の後続snapshot。安全な本番mergeにはCのA/B統合後の最新headに対する、執筆とは独立した最終査読が必要。今回Eは原稿修復、静的形式検査、一次資料の個別照合とCIを実施したが、Cの独立判定、Android/実音声・受講効果は代替しない。

- 着手時最新main: `e9b3638b87ad6bc341ec35f7d60980a8caa42ec2`。PR [#111](https://github.com/Josh-Temple/rsvp-learning/pull/111) は Draft/open、統合元A [#102](https://github.com/Josh-Temple/rsvp-learning/pull/102) head `1d7aaf0aa16733cd49b46ff503437d38efadffd4`、B [#107](https://github.com/Josh-Temple/rsvp-learning/pull/107) head `f21672b940af4f00a4bc352d7b884ed999096a7a`。#102/#107単独mergeなし。
- Eの4章+既存3章の最新統合候補head: `061a85a4fcc604101c79b768ffd870147ec24bcd`。PR #111内の7章合計382 numbered Markdown paragraphs と対応RSVP JSON chunks の全文一致、各24字以内、duration倍率を別々に確認。MD出典URLのLearn `section.sources` 存在・読み上げarticle外配置も確認。4新Learn講義の正確な発話・Chrome読み上げ/Android操作はNOT_VERIFIED。
- 既存本人確認 `security-identity-proofing-authn-authz`: 初期補修の『証拠と申請者の結び付き』だけではNIST SP 800-63A-4 §2にある resolution / validation / verification の範囲を十分に示さないため、本文8〜11へ実在性・証拠真正性/属性・申請者との結び付きの区別を明記。Markdown/RSVPは51→54 chunksに同期拡充。`tests/rsvp-chunk-quality.test.mjs`に3段階の存在と同期の回帰を追加。
- 正本差分で見つかった初回CI failure [37933951489](https://github.com/Josh-Temple/rsvp-learning/actions/runs/37933951489) はMarkdown編集時に既存の `## 出典` sectionを欠落させていたことが原因。必須の出典節・注意書きを旧headからrestoreし、MD/JSON 54件を再照合。修正後の最新統合head [Test 37934076379](https://github.com/Josh-Temple/rsvp-learning/actions/runs/37934076379) は**success**。EのローカルnpmはNOT_RUN。失敗履歴を消さずに記録する。

### 10.1 Eの一次資料照合（合格範囲を限定）

| 論点 | 原典とE確認結果 | 判定境界 |
| --- | --- | --- |
| 信頼境界 | [OWASP Threat Modeling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html): trust boundaries / data flows / external entities等の対象を確認。新4章に権限の変化以外の主体と管理領域を追記 | 修正主張限定PASS。全手法の専門品質はpartial |
| 耐フィッシング | [NIST SP 800-63B-4 §3.2.5](https://pages.nist.gov/800-63-4/sp800-63b/authenticators/#phishing-resistance): 偽検証者への秘密・有効なauthenticator outputの開示防止、OTP手入力の非耐性、verifier name bindingを確認 | 限定PASS。AAL各構成/回復の全文監査は未了 |
| ATT&CK | [MITRE T1078](https://attack.mitre.org/techniques/T1078/): Valid Accountsがtechniqueであることを確認。成功ログは確証ではなく候補、Discovery等のtacticとの区別を維持 | T1078限定PASS。他techniqueと全体系はpartial |
| Firewall/IDS | [NIST SP 800-41 Rev.1](https://csrc.nist.gov/pubs/sp/800/41/r1/final)（2009）/ [SP 800-94](https://csrc.nist.gov/pubs/sp/800/94/final)（2007）の概要・版を再確認。SP800-94 Rev.1は草案が破棄されfinalではない | 出典の時点整合PASS。旧PDFの個別節と現代装置のTLS・障害挙動はpartial/not_verified |
| 本人確認 | [NIST SP 800-63A-4 §2](https://pages.nist.gov/800-63-4/sp800-63a/proofing/): resolution, validation, verificationを確認 | 新原稿の個別主張限定PASS。別Workerによる最終審査待ち |
| OAuth/OIDC | [RFC 10017 §1](https://www.rfc-editor.org/rfc/rfc10017.html) は組織が同一でもクライアントとサーバ役割を区別。[OIDC Core Errata2 §3.1.3.7](https://openid.net/specs/openid-connect-core-1_0-errata2.html) に沿いID tokenのaud/iss等の説明を比較 | 重要区別の限定PASS。RPごとの失効・全実装条件はpartial |
| Cloud | [AWS責任共有モデル](https://aws.amazon.com/jp/compliance/shared-responsibility-model/) は利用者の責任がAWSのサービスと設定に依存することを明記。MD/JSON/LearnにAWS固有の例として対応付け | 特定AWSの資料照合PASS。他事業者とCISA TRA本文はpartial |

### 10.2 残ゲート・次の行動（順序固定）

1. **C（Eとは別の査読）**: PR #111の `061a85a4fcc604101c79b768ffd870147ec24bcd` の4章+既存3章のMD/JSON/HTML、今回追加の本人確認3段階、クラウド出典、OAuth/SSO、全主要否定/例外をhead固定で再取得し、個別Lessonの `PASS/NEEDS_REVISION/BLOCKED` と source_verified/partial/not_verified、残P0/P1を記録する。少なくとも原稿編集者による自己検査のみを『独立C合格』と呼ばない。
2. **E**: Cに未解決P0/P1がなく受入可と判断された場合だけ、最新mainとPR #111のhead/base/diff・CIをfresh readし、元A/B二重merge禁止のまま単一統合PRとしてSHA固定merge。mainのTest success確認後にのみVercel productionを明示SHAで配信する。
3. **D/端末提供者**: 配信後のVercel deployment/alias SHAでHTTP・desktop GUI・390px・Android Chrome・Web Speech API実音声・Chrome標準読み上げ・コース通し/出典更新/最終停止を各別試験で記録。環境がなければNOT_VERIFIED。静的CIとREADYを実操作PASSにしない。
4. **Course V**: V-1 `security-secure-by-design-default`、V-2 `security-input-output-injection` は別ゲートが満たされるまで両方HOLD。30章の専門品質全合格を宣言しない。

**保全:** Private RSVP repo、旧入門8章、Catalog/status、学習履歴/localStorage、Public Instant Radioの分離を維持。今回Eは新教材をmainへmerge/production配信していない。


---

## 11. 2026-10-09 優先4章限定A/B同時統合・本番配信と残件（E追補）

**総合判定: PARTIAL_WITH_GAPS。優先4章のコード・静的本番配信は完了。** 既存3章の追加修正、30章全体の専門深度、実Android/音声/受講効果は未完了。この節は第9・10節の履歴を変更せず、後続の新たな配信事実を記録する。

### 11.1 正本・差分分離と単一統合

- 作業開始時main: `0c40044b3e87e02cbc3ba1c3d18a0f7bd8a2f5b3`。別担当前提の既存3章へのE追補と新4章が混在する[Draft #111](https://github.com/Josh-Temple/rsvp-learning/pull/111)は、そのままmainに入れない。
- [独立根拠・詳細追補 #114](https://github.com/Josh-Temple/rsvp-learning/pull/114)を先行merge: `1cb4b35f233bfcd9fd5dfe6a86bdf6e83ec849a5`、元A/Bの4章と既存3章の主張別出典照合、20問構造監査、レビュー担当の独立性の限界を監査文書第12節へ保存。CI [37947405445](https://github.com/Josh-Temple/rsvp-learning/actions/runs/37947405445) success。
- 4章だけの統合[PR #115](https://github.com/Josh-Temple/rsvp-learning/pull/115): A #102 head `1d7aaf0aa16733cd49b46ff503437d38efadffd4` のMD/JSON 4組、B #107 head `f21672b940af4f00a4bc352d7b884ed999096a7a` のLearn HTML 4件と限定回帰テスト/fixtureのみ。**15ファイル**。Eが既存3章で修正したMD/JSON、Bによる既存3章Learn、Catalog/status・学習履歴・localStorage・公開設定は**変更しない**。
- PR #115固定head `2b779bc4efc25e9506dbf976b47815872362336f`、[GitHub Test 37947836549](https://github.com/Josh-Temple/rsvp-learning/actions/runs/37947836549) **success**。内容監査上、重点4章のOWASP信頼境界、NISTフィッシング耐性、MITRE T1078、旧NIST装置資料の条件付き説明にP0/P1逆意味を認めない範囲で受入。専門的深度の完全PASSとは別。
- 2026-10-09 JST、PR #115をsquash merge。新main確定SHA: `0ebf6dd2b06b165c8f51c9ba4e465febd379b0a7`。mainの[GitHub Test 37948094690](https://github.com/Josh-Temple/rsvp-learning/actions/runs/37948094690) **success**（GitHub Actions側で `npm run check`）。Eローカルコマンドは**NOT_RUN**。

### 11.2 Vercel本番と静的QAの実測範囲

- CI成功済みの上記SHAを明示してVercel project `rsvp-learning` に**production**新規デプロイ。deployment `dpl_GVcSNYX8JdzzvSdXPHTmP61154tE`、target `production`、`READY`、source SHA `0ebf6dd2b06b165c8f51c9ba4e465febd379b0a7`。エイリアス `rsvp-learning-kappa.vercel.app` は当該deployment IDを参照し、配信側のデプロイ情報でもalias一致。
- 既存ProjectのVercel Authentication/SSO Protection は引き続き `enabled=true`（`all_except_custom_domains`）。EはProjectの保護・一般公開・GitHub Pages・Instant Radio同期を変更していない。
- 権限付きの静的取得で `learn/security-threat-modeling.html`、`learn/security-mitre-attack-scenarios.html`、`learn/security-password-mfa-phishing-resistant.html`、`learn/security-firewall-proxy-waf-ids-ips.html` は**4/4 HTTP 200**、静的articleと読み上げ外のsource sectionを確認。
- 同じ経路で `learn/learn.js`、`learn/course-player.js`、`courses/index.json`、`lessons/index.json` は**4/4 HTTP 200**、空応答や404でないことを確認。トップURLの静的リクエストはツールの安全チェックで拒否され、この回のHTTP成功は**未確認**。トップ動作/匿名アクセスのPASSに転用しない。
- **実GUI/390px、Android Chrome、ページ内Web Speech API発声、Chrome標準読み上げ、Course I/III/IVの自動章送り・出典切替・最終停止、画面OFF/学習効果はすべてNOT_VERIFIED**。HTTP 200/READYを実操作成功と混同しない。

### 11.3 次に残るE/C/Dのゲート

1. **既存3章**: [Draft #111](https://github.com/Josh-Temple/rsvp-learning/pull/111) には今回すでにmainへ入った4章と重複するファイルがある。**#111をそのまま再mergeしない。** E加筆した `security-identity-proofing-authn-authz`、`security-sessions-federation-oauth-oidc-saml`、`security-cloud-shared-responsibility-iam-config` のMD/JSONと対応Bの既存3章Learn/fixture/テストだけを、最新main上の重複しない新PRへ分離する。その後、実装者と別のCに最新head独立再審査を依頼し、P0/P1が残らない場合だけ統合する。
2. **D実利用**: 今回の新配信SHAとデプロイIDで、実GUI・Android Chrome・実音声・Chromeネイティブ読み上げを別々に試験。未アクセスはNOT_VERIFIED。保護ページのため匿名利用可能と断定しない。
3. **全30章**: 4章の重点是正を30/30専門品質PASSへ拡張しない。20問の採点表は文書上reviewed、実受講者効果は未測定。残22章/既存8章の深度拡充は引き続き段階実施。
4. **Course V**: V-1 `security-secure-by-design-default`、V-2 `security-input-output-injection` は双方 **HOLD**。必要な原典・ケース・実機・A/B/C/CIとCatalog受入がそろうまでIMPLEMENTEDにしない。

**公開境界:** Private RSVP学習repoとPublic Instant Radio（100スロット）は分離。内容の自動公開・複製は行わず、旧入門教材と個人の学習記録を保持する。
