# 情報セキュリティ本格学習 60章カバレッジ・前提関係確認（Worker D）

Date: 2026-10-08 JST  
Start main: `1d6017a098d8a22cd7dd3bb8763e86b9e84a4311`  
Status: **PARTIAL_WITH_GAPS（カリキュラム設計、未実装章の整備準備）**  
正本: [SECURITY_DEEP_CURRICULUM_2026-10-08.md](./SECURITY_DEEP_CURRICULUM_2026-10-08.md)

## 対象と判定の意味

今回のDは「Course V〜VIIIの差分と、V先行2章の制作準備」。Course I〜IVの本文品質監査はWorker C、RSVP分割はA、Learn生成・本文品質はBに属する。**既存30章の現行実装**と**未実装30章の制作計画**を混同しない。以下の参照資料は章内容を保証する出典ではなく、制作・レビュー時に照合すべき候補資料である。対応する版・節・主張の検証は章ごとに別途必要。

- 現行mainの本格系列: I=7、II=7、III=8、IV=8、計30章。各章がCatalog上で`COMPLETE v0.1`。この状態は専門教育の品質監査合格ではない。
- 計画上のV〜VIII: 9+8+7+6=30章。CatalogにもLearnにも**未登録**。
- 本文の再利用候補（Draft PR #6）は旧仕様のため、無条件に採用・mergeしない。
- IPAシラバスは2027年度新試験向けの**案**。こちらの行ごとの範囲対照は未完了のため、「完全網羅」とは言わない。

## 既存30章（mainでのLesson ID対応）

| Course / 順 | Lesson ID | 重点領域 | 現在の状態 |
|---|---|---|---|
| I-1 | `security-purpose-principles` | 基本原則 | main / COMPLETE v0.1、深度再監査待ち |
| I-2 | `security-assets-dependencies` | 資産と依存関係 | main / COMPLETE v0.1、深度再監査待ち |
| I-3 | `security-threats-vulnerabilities` | 脅威・脆弱性 | main / COMPLETE v0.1、深度再監査待ち |
| I-4 | `security-risk-assessment` | リスクアセスメント | main / COMPLETE v0.1、深度再監査待ち |
| I-5 | `security-risk-treatment` | リスク対応 | main / COMPLETE v0.1、深度再監査待ち |
| I-6 | `security-threat-modeling` | 脅威モデリング | main / COMPLETE v0.1、深度再監査待ち |
| I-7 | `security-defense-in-depth` | 多層防御 | main / COMPLETE v0.1、深度再監査待ち |
| II-1 | `security-adversaries-initial-access` | 攻撃者と初期アクセス | main / COMPLETE v0.1、深度再監査待ち |
| II-2 | `security-social-engineering-bec-phishing` | フィッシング・BEC | main / COMPLETE v0.1、深度再監査待ち |
| II-3 | `security-malware-ransomware` | マルウェア・ランサムウェア | main / COMPLETE v0.1、深度再監査待ち |
| II-4 | `security-credential-session-attacks` | 資格情報・セッション攻撃 | main / COMPLETE v0.1、深度再監査待ち |
| II-5 | `security-post-compromise-movement` | 侵害後の展開 | main / COMPLETE v0.1、深度再監査待ち |
| II-6 | `security-c2-exfiltration-stealth` | C2・持ち出し | main / COMPLETE v0.1、深度再監査待ち |
| II-7 | `security-mitre-attack-scenarios` | ATT&CKによる分析 | main / COMPLETE v0.1、深度再監査待ち |
| III-1 | `security-identity-proofing-authn-authz` | 本人確認・認証・認可 | main / COMPLETE v0.1、深度再監査待ち |
| III-2 | `security-password-mfa-phishing-resistant` | パスワード・MFA | main / COMPLETE v0.1、深度再監査待ち |
| III-3 | `security-sessions-federation-oauth-oidc-saml` | セッション・Federation | main / COMPLETE v0.1、深度再監査待ち |
| III-4 | `security-rbac-abac-privileged-access` | アクセス制御・特権 | main / COMPLETE v0.1、深度再監査待ち |
| III-5 | `security-symmetric-public-key-hash-mac` | 暗号・ハッシュ・MAC | main / COMPLETE v0.1、深度再監査待ち |
| III-6 | `security-signatures-pki-certificates` | 署名・証明書 | main / COMPLETE v0.1、深度再監査待ち |
| III-7 | `security-key-secret-credential-lifecycle` | 秘密情報管理 | main / COMPLETE v0.1、深度再監査待ち |
| III-8 | `security-data-classification-encryption-retention` | データ保護 | main / COMPLETE v0.1、深度再監査待ち |
| IV-1 | `security-communication-path-boundaries` | 通信境界 | main / COMPLETE v0.1、深度再監査待ち |
| IV-2 | `security-dns-tls-https` | DNS・TLS・HTTPS | main / COMPLETE v0.1、深度再監査待ち |
| IV-3 | `security-firewall-proxy-waf-ids-ips` | 境界防御と監視 | main / COMPLETE v0.1、深度再監査待ち |
| IV-4 | `security-segmentation-vpn-zero-trust` | 分離・VPN・Zero Trust | main / COMPLETE v0.1、深度再監査待ち |
| IV-5 | `security-email-spf-dkim-dmarc` | メール認証 | main / COMPLETE v0.1、深度再監査待ち |
| IV-6 | `security-endpoint-hardening-edr-mdm` | 端末防御 | main / COMPLETE v0.1、深度再監査待ち |
| IV-7 | `security-cloud-shared-responsibility-iam-config` | クラウド責任分界 | main / COMPLETE v0.1、深度再監査待ち |
| IV-8 | `security-container-serverless-saas-iot` | コンテナ等の責任分界 | main / COMPLETE v0.1、深度再監査待ち |

## 計画30章（未実装）— 到達目標・前提・一次資料候補・重複境界

表の番号は正本のLesson順。資料IDは下記の出典表を参照する。

| Course / 順 | 計画名 | 到達目標（判断できること） | 前提 | 一次資料候補 | 欠落・重複防止／着手条件 |
|---|---|---|---|---|---|
| V-1 | Secure by Design / Secure by Default | 設計時点で危険な状態を作らず、安全な初期設定を選ぶ理由を説明する | I-6、I-7、IV-7 | S2,S7,S8 | Iの脅威モデリングをアプリの設計判断に具体化。pilot / HOLD |
| V-2 | 入力・出力・Injection | 入力検証と命令/データ分離、出力先に応じた符号化の違いを説明する | V-1、III-8 | S2,S4,S5,S6 | SQLインジェクションとXSSを同一の対策としない。pilot / HOLD |
| V-3 | XSS・CSRF・ブラウザ境界 | ブラウザの実行文脈、セッション、リクエストの区別から防御策を選ぶ | V-2、III-3、IV-2 | S2,S6 | XSSはV-2の補完。CSRF固有一次資料は要取得 |
| V-4 | Broken Access Control | サーバ側の利用者/資源/操作単位の認可検証を設計できる | III-1、III-4 | S2,S3 | ログイン済みと操作権限を混同しない |
| V-5 | 認証・Session・例外処理 | セッション固定、エラー処理、機密情報漏えいを分けて分析する | III-3、V-4 | S2,S13 | IIIは方式、Vはアプリ実装上の落とし穴 |
| V-6 | API Security | APIごとのオブジェクト認可、消費量、第三者連携を判断できる | V-4、V-5 | S3 | Web全般の問題とAPI固有の業務ロジックを対比 |
| V-7 | Secure SDLC・SSDF・Threat Modeling | 要件から保守まで検証証拠をつなげられる | I-6、V-1 | S7,S8 | SSDF 1.1最終版と1.2草案を混同しない |
| V-8 | SAST・DAST・SCA・Security Testing | 検査手法ごとの観測範囲と見逃しを比較する | V-2、V-7 | S7 | 製品別の検出率は未確認。各手法の限界に重点 |
| V-9 | Dependency・Build・CI/CD・SBOM | 依存物、ビルドの信頼、配布後の対応をつなぐ | V-7、V-8 | S2,S7 | VII-5の調達・委託判断と役割を分ける |
| VI-1 | Asset inventoryとAttack Surface Management | 見落としていた資産と公開面を発見する方法を整理する | I-2、IV-1 | S9 | V-9の依存ライブラリの範囲を超えた資産把握 |
| VI-2 | CVE・CVSS・EPSS・KEVと優先順位 | 単一のスコアだけに頼らない修正優先度を説明する | I-4、VI-1 | S11 | CVSS/EPSSの一次資料は制作時に要取得 |
| VI-3 | Patch・Configuration・Remediation | 変更・代替策・修正後の確認を条件で選べる | IV-6、IV-7、VI-2 | S9 | Vは作り込み、VIは配備済み環境の修復 |
| VI-4 | Logging・Telemetry・SIEM | 記録すべきイベント、保護、保持と可観測性を説明する | II-7、IV-6 | S9,S10 | 監視導入と検知性能を混同しない |
| VI-5 | Detection EngineeringとAlert triage | 検知条件の誤検知、見逃し、閾値の見直しを説明する | VI-4 | S9,S10 | ログ収集・検知ルール・対応を分離 |
| VI-6 | Incident Response | 判断権限、封じ込め、復旧、再発防止を適用する | VI-5、I-5 | S10 | 法的通知義務はVII-6へ |
| VI-7 | Digital Forensicsと証拠保全 | 証拠の取扱い、改変防止、外部専門家への引継ぎを説明する | VI-6 | S10 | 実環境への侵入手順は扱わない |
| VI-8 | Backup・DR・RTO/RPO・演習 | 復旧目標と演習結果から事業継続能力を評価する | VI-6、I-2 | S9,S10 | バックアップ保有だけで復旧可能とみなさない |
| VII-1 | Security Policy・標準・手順 | 方針と現場手順の統制上の役割を区別する | I-5 | S9 | 組織による適用差を残す |
| VII-2 | ISMS・NIST CSF・CIS Controls | フレームワークの目的と達成状況の証拠を選ぶ | I-7 | S9 | ISO/CIS原典の版と利用条件は制作時に要確認 |
| VII-3 | 組織・役割・CSIRT・SOC | 対応、運用、意思決定の責任分担を設計する | VI-6 | S9,S10 | SOCとCSIRTを同一視しない |
| VII-4 | Human Factors・内部不正・教育 | 人に依存しすぎない仕組みと教育を比較する | II-2、III-4 | S9 | 利用者の不注意のみに原因を帰さない |
| VII-5 | Supplier・委託・調達・Software Supply Chain | 契約前、納入、変更、事故時の責任を確認する | V-9、IV-7 | S7,S9 | V-9は製品ビルド、VII-5は調達・責任分界 |
| VII-6 | Privacy・個人情報・法令の読み方 | 事業者/行政機関等の適用範囲と業務判断を区別する | III-8、VII-1 | S17 | 法令の一般解説と組織への法的助言を分ける |
| VII-7 | Audit・内部統制・Metrics・Assurance | 対策の存在と有効性の証拠を比較する | I-7、VI-5 | S9 | 測定値の限界を明示 |
| VIII-1 | AIを悪用した攻撃と防御 | AIが攻撃・防御の業務を変える場面と不確実性を説明する | II-1、VII-4 | S14,S15 | 頻度や能力に関する未出典の断定を避ける |
| VIII-2 | Prompt Injection・Jailbreak・外部コンテンツ | 信頼境界の越境と指示優先順位の崩れを説明する | I-2、V-2 | S15,S16 | 一般のSQL Injectionと同一視しない |
| VIII-3 | RAG・Data・Model・Privacy | 検索結果、学習データ、表示権限の境界を見分ける | III-8、V-6 | S14,S15,S17 | 検索による根拠と情報の正確性は別 |
| VIII-4 | Tool Calling・Agent権限・Human Oversight | ツール実行権限・承認・監査可能性を設計できる | III-4、VIII-2 | S14,S16 | 人の確認があるだけで安全とみなさない |
| VIII-5 | AI Supply Chain・Evaluation・Monitoring | モデル更新、依存物、評価、事故対応を接続する | V-9、VI-5 | S14,S15,S16 | 性能評価と安全性保証を区別 |
| VIII-6 | 行政申請サービスの統合セキュリティケース | 資産・脅威・アクセス・委託・復旧を横断して判断する | I〜VIII前章 | S9,S10,S14,S17 | 架空事例とし、法的義務の断定は出典確認後 |

## 一次資料対応（2026-10-08、文書または公式紹介ページの確認）

本表の「確認」は公式ページ・一覧を取得した事実であり、IPAシラバス案PDFや規格原典の全項目を精査した意味ではない。S9、その他一部の候補資料は正式な節レベルの確認が未実施。未確認資料は確証として教材本文へ採用しない。

| ID | 正式名称・版 | 原典URL | 確認状況・留意点 |
|---|---|---|---|
| S1 | IPA 新試験制度シラバス案（SC Ver.0.1、2026-08-31掲載） | https://www.ipa.go.jp/shiken/syllabus/henkou/2026/20260630.html | 概要ページを2026-10-08確認。個々の試験項目との厳密な行対応は未実施。案であり変更可能 |
| S2 | OWASP Top 10:2025 | https://top10.owasp.org/2025/0x00_2025-Introduction/ | 2026-10-08公式一覧確認。A05 Injection、A06 Insecure Design等 |
| S3 | OWASP API Security Top 10:2023 | https://api-security.owasp.org/editions/2023/en/0x11-t10/ | 2026-10-08公式一覧確認。API1/3など |
| S4 | OWASP Injection Prevention Cheat Sheet | https://cheatsheetseries.owasp.org/cheatsheets/Injection_Prevention_Cheat_Sheet.html | 2026-10-08公式ページ確認。安全なAPIと入力検証は別 |
| S5 | OWASP SQL Injection Prevention Cheat Sheet | https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html | 2026-10-08公式ページ確認。パラメータ化 |
| S6 | OWASP Cross Site Scripting Prevention Cheat Sheet | https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html | 2026-10-08公式ページ確認。出力先の文脈に応じた対策 |
| S7 | NIST SP 800-218 SSDF v1.1 Final | https://csrc.nist.gov/pubs/sp/800/218/final | 2026-10-08公式最終版ページ確認 |
| S8 | NIST SP 800-218 Rev.1 SSDF v1.2 Initial Public Draft | https://csrc.nist.gov/pubs/sp/800/218/r1/ipd | 2026-10-08草案ページ確認。最終版として扱わない |
| S9 | NIST Cybersecurity Framework 2.0 | https://www.nist.gov/cyberframework | 今回の個別節の対応付けは未監査。正式版参照先として予定 |
| S10 | NIST SP 800-61 Rev.3 Final（2025-04） | https://csrc.nist.gov/pubs/sp/800/61/r3/final | 2026-10-08公式ページ確認 |
| S11 | CISA Known Exploited Vulnerabilities Catalog | https://www.cisa.gov/known-exploited-vulnerabilities-catalog | 2026-10-08公式ページ確認。KEV掲載は優先順位判断の一入力 |
| S13 | IETF RFC 9700 OAuth 2.0 Security BCP（2025-01） | https://datatracker.ietf.org/doc/html/rfc9700/ | 2026-10-08原典確認 |
| S14 | NIST AI RMF / GenAI Profile NIST AI 600-1 | https://www.nist.gov/itl/ai-risk-management-framework | 2026-10-08公式概要確認。AI RMF改訂の進行に注意 |
| S15 | OWASP Top 10 for LLM Applications 2025 | https://genai.owasp.org/resource/owasp-top-10-for-llm-applications-2025/ | 2026-10-08原典紹介ページ確認 |
| S16 | OWASP Top 10 for Agentic Applications（2025-12発表） | https://genai.owasp.org/2025/12/09/owasp-top-10-for-agentic-applications-the-benchmark-for-agentic-security-in-the-age-of-autonomous-ai/ | 2026-10-08公式発表確認 |
| S17 | 個人情報保護委員会 行政機関等編（2026-07改正） | https://www.ppc.go.jp/personalinfo/legal/guidelines_administrative/ | 2026-10-08公式HTML確認。行政機関以外への適用を推定しない |

## 検出した主な差分（学習順序と実装方針）

1. **Secure by Design の内容が未実装。** I-6の脅威モデリングを説明し直すのではなく、V-1で危険な初期状態、変更不能な設計上の問題、責任分担、設計レビューの証拠へ落とす。IV-7はクラウド設定と責任分界を担当。
2. **入力と出力が混同されやすい。** V-2はSQL等の命令・データ分離、入力検証、出力文脈の違いを扱い、V-3はブラウザのXSS/CSRFに絞る。SQLのパラメータ化をHTMLの符号化で代替できると説明しない。
3. **認証と認可の復習範囲を分離。** III-3はOAuth/OIDC/SAMLの役割。V-4〜6はサーバによるリソース単位の認可、セッション実装、APIごとの業務上の制約を中心にする。
4. **依存関係・脆弱性対応・調達を分離。** V-9は依存物とビルド、VI-2〜3は実運用での優先順位・修正、VII-5は委託先と契約・証拠を扱う。
5. **AI Security固有の信頼境界を独立化。** VIII-2のPrompt Injectionは一般のInjectionと攻撃対象となる処理が違う。VIII-4は外部ツールの権限・承認・監査を独立して扱う。AI分野は資料改訂に伴う見直しが必須。
6. **設計計画に不足している横断テーマ。** 観測・ログの保持と個人情報保護の衝突、暗号鍵・バックアップの復旧演習、アクセシビリティを含む行政サービス可用性、ソフトウェア更新時の証跡を各章で扱う。これらは追加Lesson数を増やさず、既存計画の章でカバーする方針とする。
7. **資料の版と範囲の混同。** SSDF 1.1最終版を基本出典とし、SSDF 1.2は2025-12公開の初期草案として補足。OWASP Top 10:2025とAPI Top 10:2023を区別。IPA新試験シラバスは案であり改定可能。

## 制作前ゲート（Coordinator／A〜Cに依存）

- Aで少なくともパイロット4章の専門用語破断を防ぐ回帰検査と修正が確認される。
- BでLearnの逐語反復に依存しない検証が確立され、本文・RSVP・Learnが学習可能な品質でパイロット合格する。
- Cで30章監査表と重要欠落の判定、Course Vの前提知識に関する修正優先度が提示される。
- Vの先行2章の原稿を個別に監査し、出典の主張対応・自然な日本語・判断例・限界・検証方法・正答と誤答の理由を確認する。
- その後に初めて、Markdown / RSVP JSON / Learn HTML / Catalogを同一PRで作成・同期する。**今回DではCatalogもLesson statusも操作しない。**
- 実機Android Chrome、Course通し再生、productionは新Lesson未登録につき対象外。既存動作の変更なし。

## 次の実行順

1. Worker Cの30章レビューと合流し、本表の前提参照と優先順位を調整する。
2. A/Bの品質ゲート結果を受け、V-1とV-2の教材本文を完成レベルへ改稿。理解確認問題の人間レビューを実施する。
3. 出典ごとに節と主張の対応を精査し、SPA/サーバサイド/APIのケースを区別する。
4. 新2章のMarkdown → RSVP JSON → Learn HTMLを同期して検査し、Course登録・CI・本番での聴取を評価する。
5. その結果を根拠としてV-3以降を進める。VI〜VIIIの先取り登録はしない。
