# Course V先行2章 独立技術・教材品質審査（Worker C）

審査日：2026-10-11 UTC。審査対象：[Draft PR #136](https://github.com/Josh-Temple/rsvp-learning/pull/136)。

**対象full SHA：edc183742163cb3bc355b2ee4b6dd177366acc8f**

**V-1：NEEDS_REVISION。V-2：NEEDS_REVISION。正式な内容受入は与えない。**

本報告は候補の本文、実行例、一次資料、採点基準、検査実装を審査者が読み、候補テストと追加反例を実行して作成した。著者の source_verified、自己査読、PR本文のPASS、過去のWorker C受入を今回の受入証拠に置き換えていない。

## 1. 判定と対象の固定

| 章 | 判定 | 判断理由 | 次工程 |
|---|---|---|---|
| V-1 Secure by Design / Secure by Default | NEEDS_REVISION | 原典に基づく説明・ケースの条件分けはおおむね妥当。ただし「担当を判断できない保護対象を拒否する」という核心を示す認可例が、部署欠落同士・空文字同士で許可する。F-01（P1）が残る。 | 制作担当によるコード・入力契約・試験の修正後、新しいfull SHAで独立再審査。HOLDを維持。 |
| V-2 入力・出力・Injection | NEEDS_REVISION | SQL値バインド、通常HTML本文、SSTI等の主要な技術条件は確認できた。しかしこの章にも共有実行例と「Injection対策と独立した認可」の検証が含まれ、F-01がその境界の内容受入を妨げる。加えて表現・文脈のP2がある。 | 共有例の修正をV-2の正常系・拒否系でも確認し、新しいfull SHAで再審査。HOLDを維持。 |

P0は発見していない。P1は共有の1件（F-01）、P2は6件（F-02〜07）。資料未取得だけを理由に両章をBLOCKEDにはしない。確認できた原則と、局所的な実装不整合を区別してNEEDS_REVISIONとした。

### GitHub fresh read

着手時と報告作成前にGitHubのmain、#136、変更ファイル、候補commit、Actionsを読み直した。報告作成前も候補headは指定SHAと一致した。別headの変更理由を調査する分岐は発生していない。本判定を将来のheadへ転用しない。

| 項目 | 審査者が再取得した値 |
|---|---|
| 最新main | 74ebcac3587650ee83b95438629d1893ba8abfb4 |
| main tree | 3418c0e97759380639ecb767f3c3ef13dc2ba016 |
| #136 | open / draft=true / merged=false、1 commit |
| head branch | content/security-course-v-pilot-20261011-sol |
| head / 審査対象 | edc183742163cb3bc355b2ee4b6dd177366acc8f |
| candidate tree | d31592cc4f69482b4921c06c45d88016b727c54d |
| candidate parent / PR base | 74ebcac3587650ee83b95438629d1893ba8abfb4 |
| 差分 | 21ファイル、4925追加行、削除0 |
| 候補CI | [Test run 38107539877](https://github.com/Josh-Temple/rsvp-learning/actions/runs/38107539877)、pull_request、head_sha一致、completed / success |
| 候補CI job | [test / 114376114629](https://github.com/Josh-Temple/rsvp-learning/actions/runs/38107539877/job/114376114629)、全ステップ成功。取得したログでもNode 22.23.3、60 tests / 60 pass / 0 failを確認。 |
| CI checkout | GitHub仮統合commit 91fbfa44574cd2c270a4004013e9c28f5022f2bc。Git APIでtreeがcandidate treeと同一、親がmainとcandidateであることを確認。実際のmain mergeではない。 |
| main CI | [Test run 38088421490](https://github.com/Josh-Temple/rsvp-learning/actions/runs/38088421490)、push / success。候補CIとは別。 |
| commit status | combined statusの個別statusesは空。Actionsのsuccessを確認したのであり、存在しないstatusをPASSにしていない。 |

候補の再帰treeから584個のblobを取得してローカルに再構成し、Git blob SHAとの一致を確認した。テスト・追加反例後にも既存584個の一致を確認した。mainの564 blobとの比較では、準備文書1件の追記と新規20件だけが変更され、他563件のmode・SHAは同じ。準備文書はmain本文の完全なprefixを保持する。候補の本文・テストは変更していない。

### 変更21ファイルの読取範囲

~~~text
docs/SECURITY_COURSE_V_PILOT_PREPARATION_2026-10-08.md
drafts/security-course-v/FORMAT_MAP.md
drafts/security-course-v/QUESTIONS.md
drafts/security-course-v/README.md
drafts/security-course-v/SOURCE_EVIDENCE.md
drafts/security-course-v/VERIFICATION.md
drafts/security-course-v/claims.json
drafts/security-course-v/examples/municipal_service.py
drafts/security-course-v/examples/test_municipal_service.py
drafts/security-course-v/learn/security-input-output-injection.html
drafts/security-course-v/learn/security-secure-by-design-default.html
drafts/security-course-v/lessons/security-input-output-injection.json
drafts/security-course-v/lessons/security-input-output-injection.md
drafts/security-course-v/lessons/security-secure-by-design-default.json
drafts/security-course-v/lessons/security-secure-by-design-default.md
drafts/security-course-v/render-map.mjs
drafts/security-course-v/source-registry.json
drafts/security-course-v/sync-rsvp.mjs
drafts/security-course-v/validate-candidates.mjs
drafts/security-course-v/validate-html.py
tests/security-course-v-candidates.test.mjs
~~~

### 審査用の位置表記と既存仕様

以下のMD番号は「本文」の1始まりチャンク番号、JSONは同じ番号から1を引いたchunks配列の位置、Learn位置は段落IDである。行番号は対象SHAのファイルに対する1始まりの物理行番号。

| 略称 | 対象ファイル |
|---|---|
| V1-MD | [drafts/security-course-v/lessons/security-secure-by-design-default.md](https://github.com/Josh-Temple/rsvp-learning/blob/edc183742163cb3bc355b2ee4b6dd177366acc8f/drafts/security-course-v/lessons/security-secure-by-design-default.md) |
| V1-JSON | [drafts/security-course-v/lessons/security-secure-by-design-default.json](https://github.com/Josh-Temple/rsvp-learning/blob/edc183742163cb3bc355b2ee4b6dd177366acc8f/drafts/security-course-v/lessons/security-secure-by-design-default.json) |
| V1-Learn | [drafts/security-course-v/learn/security-secure-by-design-default.html](https://github.com/Josh-Temple/rsvp-learning/blob/edc183742163cb3bc355b2ee4b6dd177366acc8f/drafts/security-course-v/learn/security-secure-by-design-default.html) |
| V2-MD | [drafts/security-course-v/lessons/security-input-output-injection.md](https://github.com/Josh-Temple/rsvp-learning/blob/edc183742163cb3bc355b2ee4b6dd177366acc8f/drafts/security-course-v/lessons/security-input-output-injection.md) |
| V2-JSON | [drafts/security-course-v/lessons/security-input-output-injection.json](https://github.com/Josh-Temple/rsvp-learning/blob/edc183742163cb3bc355b2ee4b6dd177366acc8f/drafts/security-course-v/lessons/security-input-output-injection.json) |
| V2-Learn | [drafts/security-course-v/learn/security-input-output-injection.html](https://github.com/Josh-Temple/rsvp-learning/blob/edc183742163cb3bc355b2ee4b6dd177366acc8f/drafts/security-course-v/learn/security-input-output-injection.html) |
| Example / Python tests | [municipal_service.py](https://github.com/Josh-Temple/rsvp-learning/blob/edc183742163cb3bc355b2ee4b6dd177366acc8f/drafts/security-course-v/examples/municipal_service.py) / [test_municipal_service.py](https://github.com/Josh-Temple/rsvp-learning/blob/edc183742163cb3bc355b2ee4b6dd177366acc8f/drafts/security-course-v/examples/test_municipal_service.py) |
| Questions | [QUESTIONS.md](https://github.com/Josh-Temple/rsvp-learning/blob/edc183742163cb3bc355b2ee4b6dd177366acc8f/drafts/security-course-v/QUESTIONS.md) |

既存の[カリキュラム](https://github.com/Josh-Temple/rsvp-learning/blob/edc183742163cb3bc355b2ee4b6dd177366acc8f/docs/SECURITY_DEEP_CURRICULUM_2026-10-08.md)、[Coverage](https://github.com/Josh-Temple/rsvp-learning/blob/edc183742163cb3bc355b2ee4b6dd177366acc8f/docs/SECURITY_DEEP_COVERAGE_2026-10-08.md)、[内容監査](https://github.com/Josh-Temple/rsvp-learning/blob/edc183742163cb3bc355b2ee4b6dd177366acc8f/docs/SECURITY_DEEP_CONTENT_AUDIT_2026-10-08.md)、[教材品質標準](https://github.com/Josh-Temple/rsvp-learning/blob/edc183742163cb3bc355b2ee4b6dd177366acc8f/docs/CONTENT_QUALITY_STANDARD.md)、[Lesson仕様](https://github.com/Josh-Temple/rsvp-learning/blob/edc183742163cb3bc355b2ee4b6dd177366acc8f/docs/LESSON_FORMAT.md)、[RSVP境界審査](https://github.com/Josh-Temple/rsvp-learning/blob/edc183742163cb3bc355b2ee4b6dd177366acc8f/docs/SECURITY_RSVP_BOUNDARY_REVIEW_2026-10-08.md)、[Learn HTML仕様](https://github.com/Josh-Temple/rsvp-learning/blob/edc183742163cb3bc355b2ee4b6dd177366acc8f/docs/LEARN_HTML_FORMAT.md)、[Learn生成指示](https://github.com/Josh-Temple/rsvp-learning/blob/edc183742163cb3bc355b2ee4b6dd177366acc8f/prompts/learn-generation.md)を参照した。既存章では認証・認可、RBAC/ABAC、脅威モデル、WAF、脆弱性管理・安全な開発など、接続先の正文も確認した。

現行Learnの公開対象が完成済みCatalog教材であることは認識している。今回は明示された未登録候補の審査であり、drafts配下のDRAFT / HOLDの講義候補を公開済みLearnとして扱わない。

## 2. 一次資料15記録の独立照合

[著者の原典記録](https://github.com/Josh-Temple/rsvp-learning/blob/edc183742163cb3bc355b2ee4b6dd177366acc8f/drafts/security-course-v/source-registry.json)と[根拠表](https://github.com/Josh-Temple/rsvp-learning/blob/edc183742163cb3bc355b2ee4b6dd177366acc8f/drafts/security-course-v/SOURCE_EVIDENCE.md)を索引にし、別途取得した原典本文を照合した。「確認」は表に記す選択節・版の確認であり、資料全文・規格全体の適合認定ではない。

| ID | 独立して取得した版・原典 | 実際に照合した本文・状態 | 受入への影響 |
|---|---|---|---|
| S01 | [ACSC公式のCISA等共同ガイド](https://www.cyber.gov.au/publication/shifting-the-balance-of-cyber-security-risk)、2023-10改訂。ページの公開日2023-04-13、reviewed 2023-10-17も確認。 | 設計とdefaultの定義・包含関係、提供者側の三原則、安全な標準の実践・変更時の説明、顧客側の役割をHTML本文で確認。PDF全文は未読。 | V1-01/05/08をこの2023共同ガイドの範囲で支持。CISA独自の最新施策の網羅は支持しない。 |
| S01a | [CISA resources](https://www.cisa.gov/resources-tools/resources/secure-by-design) / [securebydesign](https://www.cisa.gov/securebydesign) | 今回の取得経路ではInternal Errorで本文を取得できなかった。著者のHTTP 403を審査者が再現したとは記録しない。版・最新本文は未確認。 | S01で確認した定義は受入判断可能。最新CISA全般への拡張、未読直接ページ固有の主張には使用不可。核心の代替本文は取得できているため全章BLOCKEDにはしない。 |
| S02 | [NIST SP 800-218 Final](https://csrc.nist.gov/pubs/sp/800/218/final) / [SSDF 1.1 PDF](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-218.pdf)、2022-02 | PW.1.1/1.2、PW.2.1、PW.8.2、PW.9.1/9.2をPDF本文で照合。印刷頁11、12、15、16（PDF通し頁20、21、24、25）。設計・設計評価・実行試験・安全設定の文書化に対応。 | V1-02/05/08/09の推奨枠組みを支持。法的義務、全製品の一律値、SSDF認証取得とはしない。 |
| S02a | [NIST公式一覧](https://csrc.nist.gov/projects/ssdf/publications) / [1.2 IPD](https://csrc.nist.gov/pubs/sp/800/218/r1/ipd)、2025-12-17 | Initial Public Draftである公表状態と、コメント締切2026-01-30を確認。draft本文の全要件は未照合。 | 1.1 Finalと1.2 draftの区別だけを支持。1.2の要件をFinalの根拠に転用しない。 |
| S03 | [OWASP Top 10:2025 A06 Insecure Design](https://top10.owasp.org/2025/A06_2025-Insecure_Design/) | 設計と実装の欠陥の差、必要制御がない設計を正確な実装だけで補えないこと、予防の設計・脅威モデルを本文で確認。 | V1-02を支持。欠陥は常に一種類だけ、という排他的分類は導かれない。 |
| S04 | [OWASP Top 10:2025 A05 Injection](https://top10.owasp.org/2025/A05_2025-Injection/) | Descriptionと予防の記述、データと解釈の分離、パラメータ化しても手続内部の動的生成で問題が残る条件を確認。 | V2-01/04/06を支持。ツール名による包括的安全保証は支持しない。 |
| S05 | [SQL Injection Prevention](https://github.com/OWASP/CheatSheetSeries/blob/cb9fe01e5ddf17b42513d2c53c4b86196c665c45/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.md) | 固定版の値パラメータ化、手続の安全/危険な生成、値にできない識別子の固定対応、手作業エスケープの限界、DB最小権限を照合。 | V1-04、V2-04/05/06。値バインドと識別子、共通DB権限と要求主体の権限を区別する説明を支持。 |
| S06 | [Injection Prevention](https://github.com/OWASP/CheatSheetSeries/blob/cb9fe01e5ddf17b42513d2c53c4b86196c665c45/cheatsheets/Injection_Prevention_Cheat_Sheet.md) | 導入、SQL、OS、対策原則を照合。命令解釈先と入力位置で防御が異なる。 | V2-01/05/06/11。万能な「逃がし関数」は導かれない。 |
| S07 | [XSS Prevention](https://github.com/OWASP/CheatSheetSeries/blob/cb9fe01e5ddf17b42513d2c53c4b86196c665c45/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.md) | フレームワーク、HTML本文/属性/URL、危険文脈、サニタイズ、Safe Sinks、追加防御を照合。textContentは文字データのsink、維持されたサニタイザと後続変換の注意、CSPの補助的位置を確認。 | V2-01/07/08/09/10。HTMLソースへの属性符号化とDOMへの値設定の書分けにはF-04（P2）。 |
| S08 | [Input Validation](https://github.com/OWASP/CheatSheetSeries/blob/cb9fe01e5ddf17b42513d2c53c4b86196c665c45/cheatsheets/Input_Validation_Cheat_Sheet.md) | 構文/意味の検証、安全な解析と事前制限、構造化データ、Unicode自由文、典型的誤りを照合。 | V2-02/03。入力検証だけをSQL/XSS対策の主防御としない点、正当な氏名の保全を支持。 |
| S09 | [Authorization](https://github.com/OWASP/CheatSheetSeries/blob/cb9fe01e5ddf17b42513d2c53c4b86196c665c45/cheatsheets/Authorization_Cheat_Sheet.md) | 最小権限、既定拒否、要求ごとの検査、信頼側の位置、失敗時の安全な終了、ログ、正常/異常の単体・統合試験を照合。 | V1-03/04/06/07/08/09、V2-12の原則を支持。一方、例のmissing data denyとの整合はF-01で不適合。 |
| S10 | [SSTI Prevention](https://github.com/OWASP/CheatSheetSeries/blob/cb9fe01e5ddf17b42513d2c53c4b86196c665c45/cheatsheets/Server_Side_Template_Injection_Prevention_Cheat_Sheet.md) | 雛形をコードとして扱う、非信頼値はデータのみ、最小render context、自動処理、利用者作成雛形の高リスク条件を照合。 | V2-10。HTML出力のautoescapeと雛形ソースの評価は別段階。sandboxだけの保証は導かれない。 |
| S11 | [OS Command Injection Defense](https://github.com/OWASP/CheatSheetSeries/blob/cb9fe01e5ddf17b42513d2c53c4b86196c665c45/cheatsheets/OS_Command_Injection_Defense_Cheat_Sheet.md) | 引数注入、OS呼出しの回避、構造化引数と入力規則の併用を照合。 | V2-11。shell文字列を避けても危険なオプションまで消えない点を支持。実コマンドの安全性は未実測。 |
| S12 | [ASVS V1](https://github.com/OWASP/ASVS/blob/5cf9b032440be53ce345ab3c130fda46ba1ce7a2/5.0/en/0x10-V1-Encoding-and-Sanitization.md) / [V2](https://github.com/OWASP/ASVS/blob/5cf9b032440be53ce345ab3c130fda46ba1ce7a2/5.0/en/0x11-V2-Validation-and-Business-Logic.md) / [V8](https://github.com/OWASP/ASVS/blob/5cf9b032440be53ce345ab3c130fda46ba1ce7a2/5.0/en/0x17-V8-Authorization.md)、5.0.0安定版 | tag v5.0.0_releaseがcommit 5cf9b032440be53ce345ab3c130fda46ba1ce7a2を指すことを確認。1.1.1/2、1.2.1/2/4、1.3.1/7、2.2.1〜3、8.1.1/2、8.2.1〜3、8.3.1〜3の原文とLevel列を照合。 | 選択要件の根拠。8.3.2/3はL3、8.1.2や項目認可等にはL2の範囲がある。教材を全ASVS/Level適合と呼ばない。即時失効を本ケースが採用することと全業務への義務化を分ける。 |
| S13 | [IPA版情報](https://www.ipa.go.jp/security/vuln/websecurity/about.html) / [SQL](https://www.ipa.go.jp/security/vuln/websecurity/sql.html) / [XSS](https://www.ipa.go.jp/security/vuln/websecurity/cross-site-scripting.html)、改訂第7版・第4刷 | 2021-03-31第4刷を確認。HTML抜粋の1-(i)-a/1-(iv)、5-(i)/(ii)/(iii)、5-(vi)を照合。初版年月日の全履歴・115頁PDF全文は未検証。 | V2-04/08/09の補助根拠。静的/動的プレースホルダの区別を確認。古い統計や旧ブラウザ例を現代全環境へ一般化しない。 |

S05〜S11は可変の公開HTMLだけを根拠にせず、公式repositoryのcommit **cb9fe01e5ddf17b42513d2c53c4b86196c665c45**に固定して取得した。commit日時2026-10-09T04:57:57Zも再取得した。独立取得blob SHAは次のとおりで、著者の記録と一致する。

| ID | 原典blob SHA |
|---|---|
| S05 | 20499e640284b415d2a0c0cbfa29962c6a10beda |
| S06 | 887fa54b33373c6fb87ae7c8b53baf2ed02ce050 |
| S07 | 65c5a873c91f694e23ef3b927aa50759c4ba088a |
| S08 | eb7ed3acc6c8e9b73fe4ea2d1e2c3c5104e2e207 |
| S09 | 0147e8a8b90849403eb23c422a8a86f301ef5a80 |
| S10 | 4a4facecc876215b324e2814b44b784ca825b0e7 |
| S11 | 337e2ae1f2b4c6e97529ea6b824630ffb61e014f |
| S12 V1 | 2a85c331483ab8a17f184fe256fe6ef16ca10f43 |
| S12 V2 | 2b8bf8a6f0f61aae849f88fd8ba2eb5f996fde45 |
| S12 V8 | eef42095545b35a10c83b4dc2d20833c89daf618 |

審査者の追加照合：[SQLite公式LIKE仕様](https://sqlite.org/lang_expr.html)でワイルドカードとESCAPE、[Python 3.12 dataclasses仕様](https://docs.python.org/3.12/library/dataclasses.html)で型注釈が実行時の属性検証にならないことを確認した。これらは審査根拠であり、候補の15記録を増改訂していない。

### 根拠の種類

ASVSは選んだ版・Levelにおける検証要件。NIST SSDF、共同ガイド、OWASP Cheat Sheet/Top 10、IPAの推奨事項を同じ「法的必須」として扱わない。青波市の本人申請、現在部署、提出後の編集禁止、設定管理者の本文閲覧非付与、期限付き診断、HTTPS方針、DB追加行制御の採否は教材独自の業務前提・設計判断である。

8.3.2の原文には変更即時反映に加えて検出・取消の代替もあるが、開示済み情報を取り戻せない限定がある。機微情報を読む本ケースが旧部署閲覧の継続を許さないことは妥当な選択である。すべての業務へ一律の即時失効基準を課した記述にはなっていない。

## 3. 重要命題21件の根拠判定

「原典OK」は原則・技術条件の照合結果。「ケース」はその原則から自動的に規定されるものではない。「例P1」は原則の否定ではなく、教育用実行例との整合に修正が必要な状態。FORMAT_MAPやclaims.jsonの一致だけでこの判定を出していない。

| 命題 | 三形式の確認位置（MD番号 → 同位置JSON / Learn ID） | 原典・節 | 審査者の根拠判定と適用条件 |
|---|---|---|---|
| V1-01 設計とdefault | V1 1〜30 / v1-principles、v1-responsibility | S01 定義・安全な標準・顧客責任 | 原典OK。defaultは設計に含まれる。安全な設計でも欠陥はあり得る。2023ガイドの範囲で、追加設定負担の削減と無事故保証・運用責任消滅を区別。 |
| V1-02 設計/実装/設定 | V1 1〜30、153〜176 / v1-stages、v1-remedy | S03設計の説明、S02 PW.1.1/1.2/2.1 | 原典OK。規則不存在・検査適用漏れ・制御無効化で修正箇所が違う。WAF/暗号化で認可不足を直接修復しない比較はケースへの妥当な適用。複合原因を排除していない。 |
| V1-03 認可の主体/対象/操作/項目/状態 | V1 31〜79 / v1-case、v1-delegation、v1-authorization、v1-paths | S09要求ごとの認可、S12 8.1.1/2、8.2.1〜3、8.3.1 | 原典OK、例P1（F-01）。認証成功と認可は別。画面の部署、非表示ボタン、推測しにくい番号は認可証拠にならない。四役の権限は架空前提。 |
| V1-04 最小権限と正規業務 | V1 80〜105、167〜176 / v1-least-privilege、v1-models、v1-options | S09最小権限、S05 DB権限、S12 8.3.3 | 原典OK。必要業務の許可も試す。共通DB利用者の権限縮小は元主体の申請認可を代替しない。RBAC/属性/DB行制御は採用条件と主体伝達・接続再利用の設計を要する。 |
| V1-05 安全な初期状態 | V1 106〜126、147〜152 / v1-defaults、v1-setting-impact | S01 default、S02 PW.9.1/9.2 | 原典OK。追加手動変更前の新規環境が必要。非公開保管、支援無効等は本ケース設定案。MFA・初回登録・設定ドリフトの実製品動作は未実測と明示。 |
| V1-06 権限失効 | V1 127〜152 / v1-revocation、v1-support | S12 8.3.2（L3）、S09要求ごとの認可 | 原典OK。現在部署・承認対象・終了時刻を評価する。既開示情報は事後取消できない。純粋関数から分散キャッシュ、長寿命資格情報、競合を証明しない。 |
| V1-07 判断不能時の拒否 | V1 50〜79 / v1-paths、v1-failure | S09既定拒否・安全な終了 | 原典OK、例P1（F-01）。保護対象の必要属性を確認できない場合は許可しない。公開案内の匿名許可は明示した別規則。代替窓口・復旧・業務成功を別に設計し、全機能停止へ一般化しない。 |
| V1-08 責任と例外終了 | V1 1〜30、127〜152、192〜201 / v1-support、v1-responsibility | S01提供者/顧客、S02設定説明、S09最小権限 | 原典OK。提供者の安全設計・改善と運用者の規則/変更管理を区別。承認・期限・再識別確認・事後見直しはケース設計。法令・個別契約適合は未判定。 |
| V1-09 意図と実行証拠 | V1 177〜201 / v1-evidence、v1-limits | S02 PW.8.2/9、S09単体/統合試験・ログ | 原典OK、例の欠落入力試験はP1。設計意図、コード、実動作は別証拠。許可/拒否を対にする。候補17件PASSだけで「missing data deny」の全条件を支持できない。 |
| V2-01 保存後の解釈 | V2 1〜19 / v2-flow | S04説明、S06導入・原則、S07文脈 | 原典OK。DB保存は次段の安全を保証せず、SQL/HTML/雛形等を追う。入力由来文字列の命令/構文混入という共通機序と各処理系の差を保持。 |
| V2-02 業務入力と解析制限 | V2 20〜43 / v2-validation、v2-normalization | S08構文/意味・解析、S12 2.2.1〜3 | 原典OK。サーバ側の型/長さ/範囲/整合と解析前の資源制限を区別。ブラウザ検査は直接要求の保証ではない。引用符を含む氏名の破壊を避ける。 |
| V2-03 変換の順序 | V2 20〜43、93〜117 / v2-normalization、v2-html-text | S08 Unicode等、S12 1.1.1/1.1.2 | 原典OK。必要項目の期待したcanonical化を検証前、検証後再decodeを避け、符号化は解釈直前。全氏名の一律変換や保存時の万能符号化にしていない。 |
| V2-04 固定SQLと値 | V2 44〜65、199〜226 / v2-sql、v2-tests、v2-limits | S04予防、S05値パラメータ、S12 1.2.4、S13 1-(i)-a | 原典OK。正しいdriver APIが条件。先に入力を連結したSQLを後でprepareしても値との分離にならない。MD/JSONの時間順序表現にはF-02（P2）。sqlite3の範囲で実測。 |
| V2-05 識別子/LIKE | V2 66〜92 / v2-identifiers、v2-like | S05識別子の固定対応、S06、S12 1.2.4注記；追加SQLite LIKE仕様 | 原典OK。値のplaceholderは列名/方向ではない。LIKEの%/_は値バインドでも検索意味を持つ。literal/wildcardの業務仕様とInjection、取得認可・件数・負荷を分ける。 |
| V2-06 ORM/手続/動的SQL | V2 44〜65 / v2-orm | S04予防、S05手続・HQL、S06 SQL | 原典OK。raw queryや内部の動的生成を点検。正しい分離まで一律に危険とはしていない。実ORM/手続/他DBは未採用・未実測で、名称だけの保証を与えない。 |
| V2-07 HTML本文/textContent | V2 93〜117、199〜226 / v2-html-text、v2-tests | S07本文・Safe Sinks、S12 1.2.1 | 原典OK。HTMLソース本文の符号化と通常DOM要素の文字ノード生成は別。textContentへ元文字列を渡し、事前entity化を要求しない。script/styleへの非信頼内容とinnerHTMLへ一般化しない。Pythonの固定p解析だけ実測。 |
| V2-08 属性/URL/コード文脈 | V2 93〜147 / v2-html-attributes、v2-url | S07属性・URL・危険文脈、S12 1.2.2、S13 1.5.1 | 原典OK。安全で固定した属性、URL部品符号化、解析したscheme等の許可、HTMLソース属性の引用/符号化を区別。HTTPS限定はケース方針。DOM設定との書分けはF-04（P2）。JS/CSSへ本文escapeを流用しない。 |
| V2-09 装飾HTML/CSP | V2 118〜147 / v2-sanitization | S07サニタイズ・追加制御、S12 1.3.1、S13 1.5.2 | 原典OK。維持されたHTMLサニタイザ、要素/属性方針、後続変更・再解釈・更新が条件。regexタグ削除/CSP単独では代替しない。特定ライブラリの安全性は未検証であり、この原則の確認とは別。 |
| V2-10 autoescape/SSTI | V2 148〜174 / v2-template、v2-autoescape | S10コード/データ・context・利用者雛形、S07 framework、S12 1.3.7 | 原典OK。固定雛形/名前付き値、値の再評価回避、名/パスの許可を先に確認。後段HTML autoescapeは前段SSTIを防がない。利用者作成雛形は別の高リスク要件で、sandbox名だけの保証なし。 |
| V2-11 OS引数 | V2 175〜198 / v2-os | S11引数注入・回避・構造化/検証、S06 OS | 原典OK。専用libraryを先に検討。必要時は固定実行対象と引数を分け、危険オプション・権限を確認。引数分離だけの万能保証なし。MD/JSONの日本語境界はF-03（P2）。外部commandは未実行。 |
| V2-12 Injectionと認可/証拠 | V2 175〜226 / v2-authorization、v2-test-limits、v2-limits | S09認可・試験、S12 V8 | 原典OK、共有例P1（F-01）。値バインド/出力符号化は権限外閲覧を代替しない。送信済み情報は表示符号化で回収不能。版/経路/条件を限定し、エラー減少や単一payloadを全安全性の証拠にしない。 |

21件とも選択した原典の技術原則を独立して照合できた。これは21件の全実装条件がPASS、または両章がACCEPTEDという意味ではない。F-01はV1-03/07/09とV2-12の実行例の受入を妨げる。

## 4. 教材品質と三形式

### 章ごとの評価

| 評価軸 | V-1 | V-2 |
|---|---|---|
| 学習目標 | 原因区別、規則/初期状態、対策比較、証拠選択の4目標は観察可能。Q1〜5にも対応。 | 入力から解釈先を追う、対策を分ける、条件を選ぶ、証拠の範囲を判断する目標はQ1〜5に対応。 |
| 正確性 | defaultとdesign、認証と認可、設計/実装/設定/運用の説明は妥当。共有例の欠落入力がP1。 | 値/識別子、LIKE、通常文字/HTML構造、HTML/雛形の二段階、OS引数/認可は妥当。局所的表現P2と共有例P1。 |
| 仕組みと因果 | 認証済みでも担当外を止めない理由、添付経路の漏れ、現在部署と失効、DB権限だけの不足を説明。 | 構文と値の混在、保存後の再解釈、encode時点、LIKE意味、source評価がescape前に起きる理由を説明。 |
| 具体例/対比 | 四役・申請項目・状態・異動・期限・障害。仕様なし/検査漏れ/設定無効、画面/サーバ/DB行制御を比較。 | 正当な引用符、二択の並び順、%検索、文字コメント/リンク/装飾、固定雛形/入力sourceを比較。 |
| 反例/限界 | 代理申請、兼務、公開案内、業務停止、再識別、事後取消不能。仮想の行政規則と法的責任は区別。 | 記号削除のデータ破壊、prepare名称、raw ORM、実行URL、script/style、後続変換、sandboxの限界を保持。 |
| 確認方法 | 許可と拒否、初回設定前、異動・時刻境界、全取得経路を挙げる。入力完全性の反例は不足しF-01。 | SQL/HTML/認可の実測範囲と未採用処理系を明示。Python HTMLParserを実ブラウザやSSTI試験としていない。 |
| 既存章との接続 | Iの原則・脅威モデル、IIIの認証/認可・RBAC等、IVのWAFとの接続を実例に展開。既存用語の再定義だけで終わっていない。 | DB基礎とV-1を前提に、命令/データ/出力/認可を接続。V-3のセッション/CSRF等やV-4の詳細認可を完了したとはしていない。 |
| 重複・範囲 | V-4の認可やV-7の開発手順へ進む土台として範囲を限定。異動等は同一ケースの具体化として有用。 | 多数の処理系を扱う負荷はあるが、共通の「解釈する境界」を軸に進む。各処理系の実装保証まで完了する章ではない。 |

### MarkdownとRSVP JSON

全201＋226＝427チャンクの順序・全文・句読点・否定を照合し、一致を確認した。最大は両章とも23 Unicode code pointsで、24上限内。JSON schema、出典の順序、英語語中破断の検査も成功した。

その上で本文をチャンク順に通読し、日本語の意味の切れ目を確認した。一般に「条件→帰結」「原則→例外」「対比の前後」が近接している。24文字上限だけではF-02の時間順序誤記、F-03の不自然な読点を検出できない。427の一致を「全境界が良好」の判定にはしない。2形式を同時に同じ誤文へ変更した場合も同期検査は成功し得る。

### Learnを独立して通読した結果

Learn articleの正文をMDの結合結果とは別に通読した。両章とも導入→ケース/流れ→対策の理由→条件/反例→証拠→振り返りの連続講義を持ち、表・リンクや「下図」を見ないと成立しない説明ではない。出典はarticle外。V-1は兼務/代理/公開案内を段落で説明し、V-2はDOMを文書構造、ORM/手続を概略、SSTIを日本語名で導入している。すべての略語が唐突という評価ではない。

文章としての講義構成は妥当だが、73字のORM文に二つの定義と結論が集中し、V-1には67字の試験条件列挙がある（F-05）。CSPは機能の短い説明があるものの英語略称の音声上の導入は改善できる（F-06）。否定/例外ではscript/style、CSP、SSTI、公開案内の重要な限定が明示される。属性のAPI差はF-04、受入作業の説明の反復はF-07。

| 判定対象 | V-1 | V-2 | 根拠の範囲 |
|---|---|---|---|
| 字句・静的HTML構造/共有素材参照 | PASS | PASS | 既存検査と候補HTMLParser、正文の目視。 |
| 連続講義としての文章構成 | 妥当、P2改善あり | 妥当、P2改善あり | 耳だけで追うための文の構造を文字で審査した結果。 |
| 実音声の発音・速度・否定/例外の聞き取り | UNTESTED | UNTESTED | 音声を再生・聴取していない。PASSにしない。 |
| Android等の実端末での操作/再生 | UNTESTED | UNTESTED | 実機試験なし。 |
| 実受講者の理解・定着 | NOT_MEASURED | NOT_MEASURED | 問題の質と学習効果を区別。 |

## 5. 理解確認10問の独立採点監査

Questionsの行5/155にある「二要素」「重大な逆意味が最終判断を支配すると0点」「妥当な別解を認める」を適用した。以下は審査者が作った反例回答であり、受講者データでも自動採点実験でもない。10問すべてで測定能力とケース問題は一致する。特にQ2/Q4/Q5は正規業務・証拠の限界まで含み、用語の暗記だけを測っていない。

| 問/位置 | 測定能力と必要な二要素 | 監査判定 |
|---|---|---|
| V1-Q1 行11〜23 | 設計欠落/実装漏れの区別＋原因に合う修正と担当内外の試験 | 整合。複合原因・中央policyによる同等実装も許容できる。 |
| V1-Q2 行25〜37 | 必要権限へ絞り業務を保つ案＋成功/拒否とDB権限/主体認可の区別 | 整合。「最小権限＝全員停止」を0点にできる。 |
| V1-Q3 行39〜51 | 初期状態の不適合＋手動変更前の新規環境と業務影響の証拠 | 整合。文書の存在と動作を取り違えない。 |
| V1-Q4 行53〜65 | 現在属性・期限の拒否と事後取消の限界＋時刻境界/統合検証 | 整合。単体で分散失効を保証しない。 |
| V1-Q5 行67〜79 | 判断不能な保護対象の拒否＋代替/復旧/公開資源の検証 | 整合。公開資源の例外を任意の保護操作へ拡張できない。 |
| V2-Q1 行83〜95 | 正当データを保持する検証/固定SQL値引数＋正常/反例と実driver経路 | 整合。数値ID等の条件変更も扱える。 |
| V2-Q2 行97〜109 | 値/識別子の固定対応＋LIKEの意味と業務仕様 | 整合。多行だけでInjection成功と誤認しない。 |
| V2-Q3 行111〜123 | 文字/URL文脈の区別＋装飾のサニタイズ/後続変換 | 整合。安全なDOM属性設定の別解を明記すると採点差を減らせる（F-04）。 |
| V2-Q4 行125〜137 | 雛形sourceと後段HTMLの区別＋再評価/選択/設定/採用版試験 | 整合。autoescapeをSSTI対策としない。 |
| V2-Q5 行139〜151 | 現在担当の認可修正＋成功/拒否/版/経路/観測限界 | 整合。共有案件の正当許可と漏えいを分ける。 |

### 審査者が試した2点・1点・0点の境界

各行の「0点」は、正しい語を一部含めても後半の危険な判断がそれを覆す回答である。危険案を引用した上で明確に棄却する説明まで0点にする趣旨ではない。

| 問 | 模範解答以外の妥当な2点回答（要旨） | 1点回答 | 重大な逆意味を含む0点回答 |
|---|---|---|---|
| V1-Q1 | Aでは部署と対象の業務policyを決め、Bでは添付経路もそのpolicyを必須とする中央検査へ通す。担当内を許可、外を拒否し、一覧/添付の版・条件・結果を残す。 | 「Aは設計、Bは実装」。修正と動作証拠がない。 | 「A設計/B実装は分かるが、WAF設置後は添付の認可を省いてよい」。 |
| V1-Q2 | 設定管理と審査の権限を必要範囲で分け、検索接続からDDLを外す。各正規操作の成功と他部署/設定外操作の拒否を試す。DB接続の読取権限とは別に元主体を認可する。 | 「設定と閲覧を分離しDDLを外す」。試験・主体認可の説明がない。 | 「DDLは外す。読取専用DBなら全住民の申請を全員に見せてもよい」。 |
| V1-Q3 | 初期値を保護対象の非公開へ変え、未調整の新規導入で匿名拒否と本人/担当取得成功を試す。依存設定と提出/審査への影響を記録する。 | 「非公開を標準にする」。初回動作と業務の証拠がない。 | 「非公開が理想だが、手順書があるので匿名公開の初期値でも完成と判定する」。 |
| V1-Q4 | 毎要求で現在部署と承認対象/期限を評価するか、同じ要件を満たす失効通知方式を採る。異動前後・期限直前/一致/後を試す。開示済み情報は回収不能。通知遅延/資格情報/競合は統合試験で確認する。 | 「現在部署と期限を見て拒否」。事後取消/境界/統合の限界が不足。 | 「失効は必要だが、ログイン済みなら期限後も開示し、ログ確認後の取消で漏えいを元に戻せる」。 |
| V1-Q5 | Bを選ぶ。保護対象の拒否と漏れないエラー応答、承認済み代替手続の正規業務、復旧後の内外を試す。公開案内は独立した匿名許可規則で維持する。 | 「B。担当を証明できないから拒否」。代替/復旧の証拠がない。 | 「原則Bだが、障害中はログイン済み全員へ全申請を公開してよい」。 |
| V2-Q1 | 正当な引用符は保持しサーバで型/長さを確認。固定SQLの値引数に渡す。正当氏名と条件式に見える文字列をローカルで試し、生成経路/driver版を確かめる。 | 「値をバインドする」。業務入力・実行証拠が不足。 | 「バインドは良いが、引用符を消せば最終的にSQL連結でも必ず安全」。 |
| V2-Q2 | 二択を固定した列/方向へ対応させ不明値を拒否。%は値でもpatternなのでliteralならDB固有escapeを試す。wildcard仕様なら認可/件数/負荷を別に制限。 | 「並び順は固定対応」。LIKEへの回答がない。 | 「LIKEの%は残る。しかし列名もORDER BYの値バインドだけで自由に安全に指定できる」。 |
| V2-Q3 | 普通のdivは元値をtextContentへ。URLは解析した許可scheme/接続先方針を満たす値を通常HTMLの固定したa要素のhrefへDOM APIで設定するか、HTML生成時に引用/属性符号化。装飾は維持されたサニタイザと最終sinkまでの検査。 | 「divはtextContent、HTML生成リンクは許可URLを引用/符号化」。将来の装飾を答えていない。 | 「divはtextContent。リンクは符号化すればJavaScript方式を許しても安全」。 |
| V2-Q4 | templateを固定しデータだけ渡す。HTML autoescapeより前のsource評価がSSTIなので別制御。二段目評価・任意path・生出力を点検し、採用engine/版で試す。 | 「固定雛形へ値として渡す」。二段階/設定/実測の説明がない。 | 「固定雛形が望ましいが、autoescapeが有効なら利用者の雛形コードを評価しても安全」。 |
| V2-Q5 | 現在部署を信頼側で読み一覧scopeへ適用。担当内成功、旧担当/外部署拒否、異動反映を版/経路ごとに試す。error減少は漏えいの否定にならず、cache/全APIは統合で確認する。 | 「現在部署のscopeを入れる」。正規成功/拒否・範囲の証拠がない。 | 「部署確認は良いが、SQL Injectionがなければ旧部署閲覧も安全として受入できる」。 |

この**30回答**の2/1/0比較に加え、次の条件変更10回答も確認した。計40の審査者作成回答で、既存問題の二要素基準を使った。旧20問の総点へ加算する試行ではない。

### 条件を変えた場合の10回答

条件変更を明示した設問として評価する。元の機微申請ケースの条件を勝手に変えた回答へ満点を与えるものではない。

| 問 | 変更条件に対する回答と採点 |
|---|---|
| V1-Q1 | 規則と検査があり運用で無効化した場合：変更原因/承認/復元を調べ、復元後の許可/拒否を試す→2点。「必ず設計不足」と原因だけ断定する→満点不可。 |
| V1-Q2 | 管理者に限定的な審査兼務が必要：根拠/対象/期間を限定し、その審査と設定作業を許可、範囲外を拒否。検索DBのDDLと主体認可は分ける→2点。役割名だけで全件許可は0点。 |
| V1-Q3 | 保管物が公開目的の一般案内のみ：公開目的と内容を確認し、機密申請は混在させない。公開取得と保護対象拒否を別に試す→2点。匿名閲覧を一律不適合にすると要素A不足。 |
| V1-Q4 | 別業務で許容遅延を明示した場合：遅延の影響と境界を定義し、その要件で試す。開示情報を事後回収できるとはしない→変更設問では2点。本ケースへ無断で遅延を移す回答は認めない。 |
| V1-Q5 | 対象が公開案内：明示した匿名許可規則で提供し、保護対象/未知操作は拒否、復旧も確認→2点。公開例外を保護対象の全件許可へ拡張すると0点。 |
| V2-Q1 | 固定数値ID：整数/範囲検証は妥当。既に正しい固定SQL値引数なら、連結欠陥を捏造せず正規ID/範囲外/driver経路を確認する→2点。他の文字列も一律安全という回答は不可。 |
| V2-Q2 | wildcardを明示した仕様：%の広い一致は意図した動作として認め、並び順の固定対応、認可範囲、件数/負荷を別に試す→2点。他部署混入まで正常とするなら0点。 |
| V2-Q3 | 装飾を許さず全入力を文章表示：通常要素の文字sinkを選び、リンクは別のURL規則。タグ表現も文字として保つことを試す→2点。サニタイザを必須とする回答は変更後要素B不足。 |
| V2-Q4 | 初めから固定雛形のデータのみ、再評価なし：その事実だけでSSTI成立とせず、path/出力文脈/設定/採用版を確認→2点。XSSや認可まで不要とすると0点。 |
| V2-Q5 | 他人の申請が正当な共有案件：明示した現在権限と規則を確認し、共有の成功/非共有の拒否を試す。scope・cache/全経路の未検証は残す→2点。「他人＝必ず漏えい」の一律判断は満点不可。 |

現在の規則はこの反例群を一貫して採点できる。F-04のDOM属性別解は、表現一致を強制しない全体方針に従って2点として扱う必要がある。採点者間一致率、難易度、実受講者の誤答分布、学習効果、Quiz UIは未測定/未実装であり、本監査の問題品質判定からは導かれない。

## 6. 実行例と自動検査の独立確認

### 実施環境と結果

候補SHAの全文blob一致を確認したローカルsnapshotで実行した。Node 24.19.0、Python 3.12.14、SQLite runtime 3.53.1。GitHub ActionsのNode 22.23.3と同一環境とはしない。

| 審査者が実施/再取得した検査 | 結果 | 保証する範囲 |
|---|---|---|
| npm install --ignore-scripts | 成功 | テスト依存を導入。候補のファイル変更として保存していない。 |
| npm run check | exit 0、Node 60 tests / 60 pass / 0 fail | 既存38＋候補22、schema/content/status/Learn検査も成功。候補1 Node testがPython17件を実行するので、77 Node testsとは数えない。 |
| PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s drafts/security-course-v/examples -v | exit 0、17 tests / 17 pass | 候補の認可・状態・期限、メモリSQLite、固定HTML本文の、実装されたfixtureとassertion。 |
| 審査者追加のPython反例12件 | exit 1、10 pass / 2 fail | 欠落部署・空文字部署の許可を独立に検出。詳細は次表とF-01。 |
| 審査者追加のNodeメモリ変異2件 | 危険な追記をvalidateCandidateが受理、日本語語中分割をvalidateCoupledTextが受理 | 明示断片と同期検査の限界を実証。一般意味判定の成功とはしない。 |
| 候補CI jobログreadback | success、60/60、Node 22.23.3 | 固定候補と同一treeのCI実行。独立反例を含むCIではない。 |
| 原本blob確認 | 既存584個一致 | 審査で候補本文・テストを改変していない。 |

公開側の検査は158 lessons、24 courses、8518 chunks、141 Learn pages、COMPLETE 141 / DRAFT 0 / SEED 17。候補2章はこの公開側集計に入っていない。既存の出典なし警告50件は他教材の既存状態であり、本候補の出典検証成功へ置き換えず、本審査でも変更しない。

### 審査者追加Python12件

| 独立ケース | 入力/期待と観測 | 結果 |
|---|---|---|
| 欠落部署同士 | officer.department=None、application.department=None、read/comment。必要部署不明なのでFalseを期待、True。 | FAIL |
| 空文字部署同士 | officer.department=""、application.department=""、submitted/review/decision。部署未指定なのでFalseを期待、True。 | FAIL |
| 有効部署/別部署 | housing同士read=True、housing対welfare=False | PASS |
| 既知の取得失敗flag | 有効部署でもattributes_available=FalseでFalse | PASS |
| 公開案内 | actor=None、attributes_available=Falseでもpublic_notice=True | PASS |
| 未知操作/未知項目 | residentのeraseとowner_id読取を拒否 | PASS |
| 期限/時差 | 有効診断grantの1µs前は許可、同一瞬間をUTC+9で表す期限ちょうどは拒否 | PASS |
| naive時刻/別主体 | timezoneなしのnow、grant.actor_id不一致を拒否 | PASS |
| LIKEのliteral | 架空の追加名にbackslash・underscore・percentを含め、それぞれliteral検索でその行だけ取得 | PASS |
| wildcardと認可scope | resident-aの%任意一致でも{1,2,4}だけ。部署Noneの職員検索はPermissionError | PASS |
| Unicode長さ境界 | query80許可/81拒否、comment500許可/501拒否 | PASS |
| entityに見える通常文字 | &lt;b&gt;、&amp;、実タグに見える文字、引用符が復元文字データとして同一、固定p以外の要素は生じない | PASS |

### 安全性と一般化の範囲

ExampleにはHTTP通信、認証情報取得、シェル起動、template evalがない。データは架空、SQLiteはメモリ内。追加試験もローカルの文字値と純粋関数だけであり、第三者へ攻撃要求を送っていない。

SQLでは固定scope、固定SORTS、値引数をコードでも確認した。LIKE escapeはSQLite用で汎用SQL escapeではない。LIMIT 20は結果件数を抑えるが、巨大な実DBのCPU/検索負荷まで測定していない。SQLiteのcase folding、照合、Unicode挙動や他driverへの移植は別確認が必要。

HTMLは固定pにhtml.escapeで普通の文章を出す。Python HTMLParserで文字保全と新規要素非生成を確認しても、実DOM、URL、script/style、rich HTMLの安全性は証明しない。候補にはURL処理・サニタイザ・ORM・template engine・OS commandの実装がなく、未採用ライブラリの実測不足はV2-06/08/09/10/11の一般原則を不成立にしない。特定採用版の安全性を受入済みとするなら別途その実測が必要。

認可は現在の信頼された属性を入力する純粋モデルで、認証・セッション・分散cache・競合・全API・MFAを実装していない。この意図的省略とは別に、モデル自身が受け取れる欠落属性を等値一致だけで許す点がF-01である。

### 自動テストが保証しないことを試した結果

validateMeaning（validate-candidates.mjs 行69〜88付近）は選択した範囲内の文字断片の存在を確認する。書いた反転変異を検出する価値はあるが、自然言語の論理全体は解釈しない。

審査者はV1-Learnのv1-failure末尾へ「ただし障害中は全申請の取得を許可します。」をメモリ内で追加した。元の否定断片をすべて残すためvalidateCandidateは成功した。この逆意味を正式な内容受入に使うことはできない。著者も一般意味推論器ではないと記しており、無限定の意味保証を実装するよう求める指摘ではない。

またsource.verificationの文字列を確認する検査は、元資料を取得して本文を照合する検査ではない。本報告の一次資料確認はこのフラグ検査から独立して行った。

別のメモリ変異では「サーバ側で現在の権限を評価します。」を「サーバ側で現在の権限を評」＋「価します。」へ分割し、MDとJSONを同期させた。validateCoupledTextは成功した。日本語の意味の切れ目は独立した通読が必要である。これらの変異は原稿へ保存していない。

## 7. 指摘（P0/P1/P2）

分類：P0＝公開を急止すべき重大な危険/根本逆転。P1＝核心の説明・実行例・採点が重要条件を満たさず内容受入前に修正必須。P2＝局所的な精度・可読性・採点明確化。今回P0なし。P1が残るので、P2の有無にかかわらず受入不可。

### F-01 — P1：欠落した部署属性同士の一致で保護対象を許可する

- **ファイル/位置**：Example 行13〜26（dataclasses）、45〜82、特に47のmissing data deny、54のflag、77の部署等値比較。Python tests 行56〜60。関連正文はV1-MD 50〜79、V1-Learn v1-failure（行33）、V2-Learn v2-authorization / v2-test-limits（行52/56）。
- **問題となる主張**：「担当情報を取得できず認可を判断できない場合は、保護対象の要求を許可しません」、関数の「missing data deny」。必要属性の有効性を確かめず、None==Noneまたは""==""で担当一致と判定する。
- **独立再現**：部署省略のofficerに、部署Noneの申請のcomment読取を許す。空文字のofficerと申請にはsubmittedのdecision審査を許す。いずれもFalse期待に対しTrue。既存17件はattributes_available=Falseの明示flagを試すが、部署値自体の欠落は試していない。
- **原典**：S09の既定拒否・要求ごとの認可・失敗時の安全な終了、S12 8.2.2/8.2.3/8.3.1の信頼側の明示許可。Python3.12のdataclass型注釈は実行時検証を与えない。
- **前提の評価**：Application.departmentのNoneはstr注釈に反する入力だが、実際には生成できる。さらに空文字はstr型のまま再現する。信頼されたidentity store由来という前提は、必須部署が存在し業務上有効という入力契約を実装・証明したものではない。部署なし住民の本人取得まで一律拒否すべきという指摘ではない。
- **必要な修正**：職員の部署依存操作では、必要な主体/対象部署が業務上有効と確認できる場合だけ照合する。あるいは入力生成境界でその契約を強制し、欠落入力の安全な拒否を教材内で実証する。単に外部呼出側が必ずflagを下げるはず、という注記だけでmissing data denyの実証としない。認証システム全体の追加は不要。
- **再試験**：None/空文字/その他の未設定表現を契約に沿って拒否し、有効担当内は許可、担当外は拒否。本人の正規取得、公開案内、支援期限、SQLite/HTMLの既存正常系を維持する。独立再現の2件を失敗を検出できる回帰にして、全候補テストと審査者12条件を再実行する。
- **受入影響**：V1-03/07/09の認可モデルとV2-12の独立した認可境界。ローカル教材の重要な不整合として両章NEEDS_REVISION。本番の侵入や実データ漏えいを実証したという主張ではない。

再現用最小コード（対象SHAのrepository rootで実行）：

~~~python
import sys
sys.path.insert(0, "drafts/security-course-v/examples")
from municipal_service import Actor, Application, authorize

a = authorize(Actor("officer-c", "officer"), "read",
              Application(5, "resident-c", None), "comment")
b = authorize(Actor("officer-c", "officer", ""), "review",
              Application(5, "resident-c", "", "submitted"), "decision")
print(a, b)  # 対象SHAの実測: True True。必要部署が不明なら期待: False False
assert a is False
assert b is False
~~~

### F-02 — P2：SQL連結の時間順序がMD/JSONで誤記される

- **位置/引用**：V2-MD 行82〜83、本文51〜52 / V2-JSON chunks[50〜51]。「入力を受け取る前にSQLへ連結し、」「後で準備するだけでは分離できません。」
- **問題**：まだ受け取っていない入力を連結するという時間順序になり、prepare前に混ぜた値は後で分離されないという理由を曖昧にする。V2-Learn v2-sql 行30の「入力を既に連結したSQLを後で準備するだけでは分離できません。」は適切。
- **原典**：S05値パラメータ化、S04予防、S12 1.2.4。
- **修正/再試験**：入力をSQL構造へ先に連結し、その後prepareする順序と書き直す。24字内の自然なチャンクに切り、JSONを同期し、claimsの断片とLearnの意味を再照合。値としての引用符正常系と反例検索を再実行。
- **扱い**：局所的な記述修正。周囲は正しいバインドを指示しLearnも正しいため、これだけで核心根拠不足とは判定しない。次の正文改稿で解消する。

### F-03 — P2：OS引数の例外が不自然な日本語境界で切れる

- **位置/引用**：V2-MD 行226〜227、本文180〜181 / V2-JSON chunks[179〜180]。「ただし引数に危険なオプションが渡る、」「問題は残り得ます。」
- **問題**：「渡る問題」という修飾の間の読点で、何が残るのか一瞬取り直す必要がある。V2-Learn v2-os 行51には「引数として危険なオプションを渡せる問題は残り得ます」と自然な文がある。
- **原典**：S11引数注入、S06 OS。技術原則は正しい。
- **修正/再試験**：「引数として危険なオプションを」「渡せる問題は残り得ます。」等、例外の主語と述語を保って切る。MD/JSON同期と全文通読。音声化時には「引数を分けたら安全」と逆に聞こえないか実聴する。
- **扱い**：次改稿の境界修正。機械的文字数PASSを可読性PASSとしない。

### F-04 — P2：属性符号化の説明とQ3の別解に、HTML生成とDOM設定の区別を足す

- **位置/引用**：V2-MD 本文108〜112（行145〜149）/ JSON chunks[107〜111]、V2-Learn v2-html-attributes（行38）・v2-url（行41）、Questions V2-Q3要素A（行117）。「属性に入れる場合は…属性用の符号化と引用符を使います」。
- **問題**：HTMLソースへシリアライズする場合の要件が、DOM APIで安全な属性へ値を直接設定する場合にも手動entity化が必要と読める。URLの許可規則はどちらにも必要。HTML文字表示で適切に区別したtextContentと同じ精度に揃えるとよい。
- **原典**：S07の属性文脈とSafe Sinksは別の実装経路を示す。S12 1.2.2はURL許可等の確認を要する。unsafeな属性や実行schemeを許す根拠にはならない。
- **修正/再試験**：引用/属性符号化は「HTMLソースに出力するとき」と明示し、通常の安全なDOM属性設定では適切な元値を使う別解を説明。Q3は許可されたURLを安全なDOM属性へ設定し、装飾/後続処理も満たす回答を2点として明記する。DOM routeへの追加安全保証を出す場合は採用API/実ブラウザで別試験。
- **扱い**：現状のQ3全体方針は別解を許容し、危険schemeも明確に拒否するのでP2。手動符号化がないという理由だけで妥当な別解を減点しない。

### F-05 — P2：Learnの長い一文に複数定義・試験条件が集中する

- **位置/引用**：V2-Learn v2-orm 行31の最初の文「プログラムのオブジェクトとDBの対応を扱うORMや、DBに保存した手続であるストアドプロシージャを使うという名称だけでは安全性の証拠になりません。」（句点込み73 code points）。V1-Learn v1-evidence 行52の「担当部署の内外、提出前後、詳細と一覧、添付と一括出力、異動後と委託期限後、認可情報が取れない場合まで、規則に沿って期待結果を定めます。」（67）。
- **問題**：前者は二定義と否定結論、後者は六群の条件を一度で保持する負荷がある。字数が規格違反という判定ではなく、耳で理解する構成のP2。
- **根拠**：教材品質標準・Learn生成指示の連続講義、意味のまとまり。技術内容はS05/S09等と整合。
- **修正/再試験**：ORMと手続の定義を短い文に分けてから共通の結論を述べる。試験は「部署/状態」「取得経路」「変更/障害」等の目的を言葉で添えて複数文にする。V2-limits行61の69字列挙も同様に調整可能。独立通読後、実音声で否定の対象と列挙を一聴で追えるか確認。
- **扱い**：公開用音声QA前の改善。短文化して例外・正常系を消さない。

### F-06 — P2：CSPの略称を音声用に導入する

- **位置/引用**：V2-Learn v2-sanitization 行44。「ブラウザの読み込みや実行を制限するCSPは追加防御として使えますが…」。
- **問題**：機能説明はあるが英語略称の展開・呼び方がない。既存のRBACやSQLは前提章との接続を持つため同列の欠陥とはしない。CSPはこの講義での初出として音声導入を足せる。
- **原典**：S07追加制御。CSPをサニタイズの代替としない技術説明は正しい。
- **修正/再試験**：「コンテンツセキュリティポリシー、CSP」等の導入を短く添え、追加防御という限定を維持。実音声で略称の発音と前後の否定を聴く。
- **扱い**：音声工程で確認するP2。実聴前の発音PASSは付けない。

### F-07 — P2：講義末尾に制作・受入工程の説明が反復する

- **位置/引用**：V1-Learn v1-limits 行58「自己査読や問題の用意を、独立受入や実受講者の理解を測った結果とは呼びません」、V2-Learn v2-limits 行61「自己査読や理解確認問題は…独立内容審査も別に必要です」。
- **問題**：ローカル例/全サービス/学習効果の限界は有用だが、制作担当の査読と独立受入工程の説明を両講義で読むことは学習者の設計判断に直接必要でなく、制作メタ情報が反復する。
- **根拠**：Learnの読み上げ本文と説明・出典の分離、教材品質標準。技術原典との矛盾ではない。
- **修正/再試験**：受入状況・制作工程はarticle外の候補情報やVERIFICATIONへ置く。article内には教育用モデルの限界、未実装の境界、学習者が結論できる範囲を残す。移動後もHOLD表示と出典・静的articleの検査、独立通読を行う。
- **扱い**：公開講義として整える時のP2。測定限界そのものまで削らない。

## 8. 未検証事項と命題別の扱い

| 未検証事項 | 関係命題/品質 | 今回の受入への扱い・後続条件 |
|---|---|---|
| CISA直接ページの本文/最新固有更新 | V1-01/05/08 | 2023共同ガイドの確認範囲は成立。最新CISA全般を確認済みと書けない。CISA固有新要件を採用する場合は原文を追加確認。 |
| SSDF1.2 draft本文全体 | V1-02/05/08/09の版管理 | 1.1 Finalを基礎に判断可能。1.2をFinalとして受入しない。 |
| ASVS全体/Level適合 | V1-03/04/06、V2-02〜10/12 | 選択節の原則だけ。Level認証や全面適合の宣言不可。 |
| 実MFA/初回登録/設定ドリフト/ログ保護 | V1-05/08/09 | 設定モデルと設計説明は確認可能。実サービス導入・運用の合格証拠にはしない。 |
| 全API/添付/一括出力、主体伝達、分散失効/競合 | V1-03/04/06/09、V2-12 | 本モデルの外。採用サービスでは正規許可/拒否と変更伝播を実環境相当で試す。F-01の局所欠陥をこの一般留保へ吸収しない。 |
| 他DB/driver/ORM/ストアド手続 | V2-04/05/06 | sqlite3の確認を移植先のPASSへ転用しない。実採用版/API/生成経路を固定して別試験。 |
| 実DOM/URL/サニタイザ/CSP | V2-07/08/09 | 通常pとHTMLParserの局所結果のみ。特定sanitizer等の採用保証を主張する際は版/許可規則/後続変換/実ブラウザを確認。未採用であることだけで原則説明をBLOCKEDにはしない。 |
| template engine / OS command | V2-10/11 | 一次資料に基づく条件付き原則は確認。実行していない処理系のPASS不可。採用時は最小context、再評価、名前/path、危険オプション等を版ごとに試す。 |
| 実音声/Android実機 | 両章Learn | UNTESTED。内容修正後の音声公開QAで発音・速度・専門語・否定/例外・操作を実聴/実機で確認。静的PASSとは別。 |
| 実受講者/採点者間一致/学習効果 | 10問と両章 | NOT_MEASURED。問題の設計は独立監査済み、効果は別試行で測る。合格線・総点の勝手な変更をしない。 |

## 9. 再受入・統合・公開へ進む条件

1. 制作担当がF-01を修正し、入力契約と正常系/拒否系を示す。独立再現2件の拒否、有効部署の許可、公開案内・正規住民の維持を確認する。欠落入力を別途受け入れる業務なら、明示した業務規則と相応の検証が必要。
2. F-02/03/04を正文と採点上の精度改善として反映し、F-05〜07は公開講義の整備で処理する。P2を後続に残す場合は、対象と担当工程を明記する。
3. 更新されたfull SHAで原典/本文/JSON/Learn/コード/試験の差分を再照合し、P0/P1ゼロを確認して章別に再判定する。今回のNEEDS_REVISIONを新SHAの受入にも、候補CIの成功を独立受入にも転用しない。
4. 内容受入と、音声/端末QA・実サービス統合・公開承認を別記録にする。P2や限定未検証事項だけが残る段階では、対象を限定した内容受入は可能だが、未実施の工程をPASSと呼ばない。
5. 今回は報告保存用Draft PRまで。#136のmerge、Catalog/Course登録、COMPLETE昇格、production deploy、SSO/公開設定の変更、他教材変更、public Instant Radio反映は行わない。

本報告のGitHub保存用PRは最新mainを基点として**この新規報告1ファイルだけ**を含める。保存後は別途PR本文のreceiptと審査実行記録でPR URL、報告headのfull SHA、変更パス、CI、固定refでの全文readback一致を確認する。報告自身のcommit SHAを本文に埋め込んで自己更新を繰り返すことはしない。
