# Course V先行2章：一次資料と重要命題の根拠

Status: DRAFT / HOLD — 2026-10-11 JST照合

CISA共同ガイドの主対象はソフトウェア提供者である。自治体の個別設定や契約への適用は、教材で条件を明示した設計判断として扱う。

確認対象は資料の実際の本文・該当節。リンクの存在、検索結果の題名、既存教材の引用だけでは `source_verified` にしない。本表は技術原則の照合記録であり、架空サービスの安全性、受講者の理解、独立C受入の証拠ではない。

## 判定の意味

| 判定 | 本記録での意味 |
|---|---|
| `source_verified` | 表示した版の該当節を読み、その範囲で命題を確認した。資料全体の正しさ・現行システムでの実装効果は認定しない。 |
| `partial` | 一部の内容や版は確認したが、最新版の網羅、直接配布元、個別製品への適用などに未確認部分がある。 |
| `not_verified` | 必要な本文・挙動・測定結果を確認していない。推測で補わない。 |

## 版、URL、確認範囲

| ID | 一次資料・参照URL | 版と読んだ箇所 | 判定・留保 |
|---|---|---|---|
| S01 | [CISAほか共同ガイド・ACSC公式HTML](https://www.cyber.gov.au/publication/shifting-the-balance-of-cyber-security-risk) | 2023年10月改訂。ページ公開2023-04-13、最終レビュー2023-10-17。Overview、Secure by design、Secure by default、Software product security principles、Secure by default practices / tactics、購入者への推奨。 | 当該共同ガイド本文 `source_verified`。CISA直接サイトの最新施策の網羅は `partial`。共同執筆機関の公式本文を代替一次資料にした。 |
| S01a | [CISA Secure by Designリソース](https://www.cisa.gov/resources-tools/resources/secure-by-design)、[CISA Secure by Design](https://www.cisa.gov/securebydesign) | この取得経路では両URLが403。本文未取得。 | `not_verified / ACCESS_UNAVAILABLE`。資料不存在とは判定しない。2023共同ガイド以後のCISA固有更新の有無は保留。共同ガイドのPDFリンクも取得失敗し、PDFを読んだとは記録しない。 |
| S02 | [NIST SP 800-218 Final](https://csrc.nist.gov/pubs/sp/800/218/final)、[公式PDF本文](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-218.pdf) | SSDF **1.1 Final、2022-02**。PW.1.1、PW.1.2（印刷p.11）、PW.2.1、PW.8.2（p.15）、PW.9.1、PW.9.2（p.16）。PDF本文を読んだ。 | 表示したタスク `source_verified`。推奨実践の枠組みであり、単一の製品仕様や適合認証ではない。PDF内の旧ASVS参照番号をASVS 5.0.0へ流用しない。 |
| S02a | [NIST SSDF公表一覧](https://csrc.nist.gov/projects/ssdf/publications)、[800-218r1 IPD](https://csrc.nist.gov/pubs/sp/800/218/r1/ipd) | **1.2 Initial Public Draft、2025-12-17**。コメント期限2026-01-30。作業時の公式一覧は1.2をDraft、1.1をFinalと表示。 | 公表状態 `source_verified`。1.2本文全体の要求対応は `not_verified`、本教材の確定基準には使わない。 |
| S03 | [OWASP Top 10:2025 A06 Insecure Design](https://top10.owasp.org/2025/A06_2025-Insecure_Design/) | 2025版 Description / What is the difference between insecure design and insecure implementation? / How to Prevent。 | `source_verified`。設計と実装の原因・修正の区別。Top 10は全脅威の網羅的検証基準ではない。 |
| S04 | [OWASP Top 10:2025 A05 Injection](https://top10.owasp.org/2025/A05_2025-Injection/) | 2025版 Description、How to Prevent。 | `source_verified`。命令とデータの分離、動的SQLを作る手続の例外。2021版のA03という番号を使わない。掲載統計を本ケースのリスク削減率へ転用しない。 |
| S05 | [SQL Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html) | Prepared Statements、Stored Procedures、Allow-list Input Validation、Escaping All User-Supplied Input、Least Privilege。 | `source_verified`。意味を持つ版番号はない。下記コミットに固定。DB・ドライバ固有の設定の実測は別。 |
| S06 | [Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Injection_Prevention_Cheat_Sheet.html) | Introduction、SQL InjectionのRemediation、Operating System CommandsのRemediation、Injection Prevention Rules。 | `source_verified`。複数の処理系を探す導入に使う。個別の出力文脈はS07等で詳しく照合した。 |
| S07 | [Cross Site Scripting Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html) | Framework Security、HTML / Attribute / URL Contexts、Dangerous Contexts、HTML Sanitization、Safe Sinks、Other Controls。 | `source_verified`。通常要素のtextContentは文字ノードを作り、HTML符号化するAPIではない。script / styleの非信頼内容へ安全性を拡張しない。 |
| S08 | [Input Validation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html) | Introduction、Input Validation Strategies、Implementing Input Validation（Parse Safely, Then Validate / Validate Structured Data / Validating Free-form Unicode Text）、Common Pitfalls。 | `source_verified`。業務形式とInjection防止を区別。全氏名への一律正規化・記号削除は導かれない。 |
| S09 | [Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html) | Least Privilege、Deny by Default、Validate Permissions on Every Request、Exit Safely When Authorization Checks Fail、Create Unit and Integration Test Cases。 | `source_verified`。認証と認可を区別し、保護対象は信頼できる側で検査。公開資源までログイン必須という意味ではない。 |
| S10 | [Server Side Template Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Template_Injection_Prevention_Cheat_Sheet.html) | Introduction、Prevention（Treat templates as code / Pass untrusted input only as data / Keep the render context minimal / Keep output escaping on）、User-Supplied Templates。 | `source_verified`。非信頼の雛形ソースと通常のデータ引数を区別。個別エンジンの推奨版・設定は教材で採用せず、実測もしていない。 |
| S11 | [OS Command Injection Defense Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/OS_Command_Injection_Defense_Cheat_Sheet.html) | Argument Injection、Avoid calling OS commands directly、Parameterization in conjunction with Input Validation。 | `source_verified`。シェルを避けても引数の意味は検証する。特定コマンドのオプションやOS間の互換性の実測ではない。 |
| S12 | [ASVS 5.0.0 stable V1](https://github.com/OWASP/ASVS/blob/v5.0.0_release/5.0/en/0x10-V1-Encoding-and-Sanitization.md)、[V2](https://github.com/OWASP/ASVS/blob/v5.0.0_release/5.0/en/0x11-V2-Validation-and-Business-Logic.md)、[V8](https://github.com/OWASP/ASVS/blob/v5.0.0_release/5.0/en/0x17-V8-Authorization.md) | **5.0.0、2025年5月公開の安定タグ `v5.0.0_release`**。下表のIDを本文で確認。タグのcommit `5cf9b032440be53ce345ab3c130fda46ba1ce7a2`。 | 選んだ要件 `source_verified`。GitHub `releases/latest` は開発中の生成物を返したため採用しない。部分的照合をASVS全体やLevel適合と呼ばない。8.3.2はLevel 3。遅延時の検知・取消だけでは情報漏えいを取り戻せない旨も確認。 |
| S13 | [IPA資料概要](https://www.ipa.go.jp/security/vuln/websecurity/about.html)、[1.1 SQL Injection](https://www.ipa.go.jp/security/vuln/websecurity/sql.html)、[1.5 XSS](https://www.ipa.go.jp/security/vuln/websecurity/cross-site-scripting.html) | **改訂第7版（2015-03-12）、第4刷（2021-03-31）**。公式抜粋1.1の1-(i)-a、1-(iv)、1.5.1の5-(i)・5-(ii)・5-(iii)、1.5.2の5-(vi)。 | 指定の基本対策 `source_verified`。全115ページPDFは未読。2014年までの統計、旧ブラウザ・旧APIの例は現在の保証に使わない。文脈の精密化は現行OWASPとASVSで補った。 |

S05〜S11は公式CheatSheetSeriesの可変HTML本文と、公式GitHub原稿を双方確認した。原稿はコミット **`cb9fe01e5ddf17b42513d2c53c4b86196c665c45`（2026-10-09T04:57:57Z）** に固定。恒久参照は `https://github.com/OWASP/CheatSheetSeries/blob/cb9fe01e5ddf17b42513d2c53c4b86196c665c45/cheatsheets/` にそれぞれの `*_Cheat_Sheet.md` を続ける。`source-registry.json` に各URLと照合したblob SHAを残す。可変ページが後で更新されても、今回読んだ原稿を特定できる。

## 重要命題と適用条件

表中の「確認した原則」と「本ケースへの適用」を分けて読む。原則に適合する案でも実装試験は別に必要。形式間の位置は [FORMAT_MAP.md](FORMAT_MAP.md) の同じ命題IDを参照。

| 命題ID | 確認した原則・版／節 | 本ケースへの適用条件 | 留保・一般化できない範囲 | 判定 |
|---|---|---|---|---|
| V1-01 | S01 Secure by design / default：初期状態の防御は設計の一部。顧客へ安全設定の負担を丸投げしない。 | 新規導入時に申請保管先と支援アクセスが保護されるかを見る。 | 「安全な設計なら欠陥ゼロ」、運用責任の消滅、全製品への一律設定値は導かれない。最新CISA固有更新は別途確認。 | `source_verified`（2023ガイド内） |
| V1-02 | S03 Description、S02 PW.1.1・1.2・2.1：必要な規則を定める設計と、それを実現する実装を区別する。 | 担当外閲覧の規則不存在／API検査漏れ／設定無効化で修正箇所を変える。 | 欠陥を常に一種類へ排他的分類する趣旨ではない。WAFや暗号化だけで認可設計は補えないという比較は教材の適用判断。 | `source_verified` |
| V1-03 | S12 8.1.1・8.1.2、8.2.1〜3、8.3.1、S09 Every Request：操作・対象・項目を信頼できる側で認可する。 | 一覧、詳細、添付、一括出力、提出前後、担当部署を含む規則を作る。要求の部署名や画面非表示を権限証拠にしない。 | 管理者が本文を読めない等の役割規則はケース前提。代理申請は別規則が必要。共通処理の存在だけで全経路適用は証明しない。 | `source_verified` |
| V1-04 | S09 Least Privilege、S05 Least Privilege、S12 8.3.3：最小権限と元の要求主体の認可。 | DBの広い管理権限を検索に与えない。共通DB接続でも住民単位の認可を別に行う。 | RBAC／属性の選択やDB行制御の採用は設計判断。主体伝達、接続再利用、正規業務の検証が必要で、導入名から保証しない。 | `source_verified` |
| V1-05 | S02 PW.9.1・9.2：安全な基準を定め、初期設定を実装し、設定と業務影響を記録する。 | 新規導入を手動修正前に試す。非公開保管、支援無効、管理登録の限定、管理MFA、必要な監査記録を候補とする。 | これらの組合せは架空案。実製品での初回登録・MFA・ログ保護は未実装。設定表と動作証拠は別。 | `source_verified` |
| V1-06 | S12 8.3.2：判断属性の変更を反映する。事後取消では情報漏えいを補えない。 | 異動後は現在の担当で拒否する。委託支援は承認対象と期限を限定し、終了後も検査。 | 即時失効は本ケース要件。純粋関数の試験は分散キャッシュ、長寿命資格情報、競合や全APIを証明しない。実環境相当の試験が残る。 | `source_verified` |
| V1-07 | S09 Deny by Default / Exit Safely：保護対象の未知条件や判断失敗を許可へ倒さない。 | 認可情報取得不能なら申請アクセスを拒否し、再試行・承認済み窓口で業務継続を設計。 | 公開案内の匿名閲覧は明示した別規則。全操作を拒否することを可用性の完成と呼ばない。 | `source_verified` |
| V1-08 | S01原則1〜3・購入者への推奨、S02 PW.1.2：提供者の改善、説明、意思決定と例外の記録。 | 提供者・自治体運用者・委託先で、作業、承認、証拠の担当を明示。非常時アクセスの理由と終了を残す。 | 個々の契約、法的責任配分、匿名化の十分性は未確認。本ケースへの責任表は教材の設計案である。 | 原則 `source_verified`、個別契約適用 `partial` |
| V1-09 | S02 PW.8.2、S09 Unit and Integration Test Cases：試験条件、結果、修正を記録する。 | 許可／拒否、状態変更、認可情報不足を対で試す。意図、コード、設定、実行結果、運用変更を区別。 | テスト合格は試した条件の証拠。実利用、学習効果、独立受入、全経路の網羅ではない。 | `source_verified` |
| V2-01 | S04 Description、S06 Introduction、S07出力規則：データが解釈系の構文へ入る境界を調べる。 | 入力→保存→検索→通常表示→通知等をたどり、保存済みデータも次の文脈で評価する。 | すべての保存データが悪意を持つという意味ではない。検証済みの境界と、次に必要な制御を分ける。 | `source_verified` |
| V2-02 | S08 Input Validation Strategies / Parse Safely, Then Validate、S12 2.2.1〜3：業務期待の型・範囲・整合は信頼できるサービス層で検証する。 | 正当な氏名の引用符は削らず、長さ・論理整合を確認。解析前のサイズ・資源制限も別に設計。 | 固定文字集合だけの特定フィールドは限定的に防御へ寄与するが、各解釈先の対策を一律に置換しない。ローカル例はHTTP解析資源を実測しない。 | `source_verified` |
| V2-03 | S12 1.1.1・1.1.2：期待したデコードは一度、検証前。符号化は対象の解釈系へ渡す最終段階で行う。 | 検証後の再デコードを避け、保存時の汎用エスケープを各出力先へ流用しない。 | 全氏名へのNFKC等の一律変換を要求しない。複数の正当なプロトコル層で必要な符号化まで禁止する意味ではない。 | `source_verified` |
| V2-04 | S05 Prepared Statements、S04 How to Prevent、S12 1.2.4、S13 1.1の1-(i)-a：固定SQLと値を正しいAPIで分離する。 | sqlite3の `execute(sql, parameters)` で引用符も値として扱う。 | 呼出前に値をSQLへ連結したら無効。DB側準備か適切なドライバ実装かは使用APIで確認する。他DB／文字コード／設定の実測へ一般化しない。 | `source_verified` |
| V2-05 | S05 Allow-list Input Validation、S12 V1.2の注記：列・表・並び順の構文を値バインドで代替しない。 | 並び順二択を固定構文へ対応。不明値は拒否。LIKEは文字どおり／任意一致という別の業務仕様を試す。 | LIKEの反例はSQLiteローカル教材の実行証拠で照合。方言の違い、件数制限・負荷・認可はパラメータ化だけでは解決しない。 | 原則 `source_verified`、他DBでの挙動 `not_verified` |
| V2-06 | S05 Stored Procedures / HQL、S04 How to Prevent：ORM名や手続名は安全性の証拠ではない。 | 生SQL、問い合わせ言語、手続内部の動的連結を点検する。 | 固定SQL・適切なパラメータの手続まで危険と一律判定しない。本例はORM／手続を実装しない。 | `source_verified` |
| V2-07 | S07 HTML Contexts / Safe Sinks / Dangerous Contexts、S12 1.2.1：通常文章は文字として出す。 | サーバのHTML本文符号化、または通常要素のtextContentに元の文字列を渡す。 | textContentはHTML符号化ではない。script / styleには一般化しない。HTMLParserで要素が増えない試験は全ブラウザの証明ではない。 | `source_verified` |
| V2-08 | S07 HTML Attribute / URL Contexts、S12 1.2.2、S13 1.5.1：属性、URL部品、URL全体の許可を区別。 | 固定した安全な引用付き属性、URL部品符号化、解析した方式の許可、必要な接続先検査。最後に属性文脈へ符号化。 | イベント属性・コード文脈は別。HTTPS限定はケース方針。URL符号化だけで実行URLや接続先問題を防げない。実装試験は未実施。 | `source_verified` |
| V2-09 | S07 HTML Sanitization / Other Controls、S12 1.3.1、S13 1.5.2：装飾を許すなら維持管理されたHTMLサニタイズを選ぶ。 | 通常コメントは文字表示。装飾付きお知らせは許す要素・属性を別定義。後続変更、再解釈、更新を確認。 | 正規表現削除やCSPだけでは置換しない。採用ライブラリ・版・許可規則・実ブラウザ試験は `not_verified`。自作サニタイザは実装しない。 | `source_verified` |
| V2-10 | S10 Treat templates as code / Pass untrusted input only as data / Keep output escaping on、S12 1.3.7：非信頼データを雛形ソースへ混ぜない。S07 Framework Security：出力自動処理には文脈と無効化の条件がある。 | 信頼した固定雛形と名前付きデータ、再評価なし。雛形名も固定対応。渡す機能・秘密を絞る。 | HTML自動エスケープはSSTI防止ではない。利用者作成雛形は別要件。隔離の名称だけで安全保証しない。エンジン実測なし。 | `source_verified` |
| V2-11 | S11 Argument Injection / Primary Defenses：OS呼出しを避け、必要なら命令・引数を分離し引数の意味も検証。 | 固定実行対象と引数規則を選ぶ。権限と専用ライブラリを比較。 | シェルなしでも危険なオプションは残る。万能エスケープ関数、全OS互換、特定コマンド安全性は示していない。外部コマンド実行なし。 | `source_verified` |
| V2-12 | S09 Every Request、S12 8.2.2・8.3.1：正しい構文で取得しても対象の認可が必要。 | 検索範囲と単体取得の双方で主体と申請を照合。許可と拒否を対で試す。 | 出力符号化は既に送った機密情報を回収しない。通知・添付・一括出力・CSV等の実装網羅、実受講者の理解は未検証。 | `source_verified` |

## 科学的・経験的な主張の境界

本教材は規範・技術的な原則を、条件付きの架空ケースとローカル実行例へ落としたもの。事故率の定量的低下、特定製品の優位性、受講後の技能改善を測定していない。Top 10の集計やIPAの過去届出割合を、因果的な対策効果や今日の普及率へ読み替えていない。作問、自己査読、機械検査を独立受入や学習効果の実測と混同しない。

## 残る確認

- CISA直接サイトの最新版・個別施策の本文再取得。共同ガイドの確認済み命題はその版に限定して審査へ提出する。
- 実装に採用するDB／ドライバ、URL処理、HTMLサニタイザ、雛形エンジン、OS／プロセスAPIの版と実設定。採用していない処理系を本候補のPASS対象へ含めない。
- 全取得経路、MFA、初回管理者登録、設定ドリフト、並行更新・分散失効、ログの権限・保持期間、業務継続の統合試験。
- 耳だけでの実受講、用語の音声、条件変更問題の採点一致、独立Worker Cの新規内容受入。公開時の実機確認は後続ゲート。
