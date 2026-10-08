# 情報セキュリティ本格学習 Course I〜IV — 内容品質監査（Worker C）

- 実施日: 2026-10-08 JST
- 対象リポジトリ: `Josh-Temple/rsvp-learning`
- 監査開始時の `main`: `1d6017a098d8a22cd7dd3bb8763e86b9e84a4311`
- 対象: 本格学習 Course I〜IV、全30 Lesson（7 / 7 / 8 / 8）
- 元指示: Library `/RSVP Learning/Work Instructions/2026-10-08_security_learning_content_quality_and_progression_wave_instructions.md` の Worker C
- 正本: [本格学習カリキュラム](SECURITY_DEEP_CURRICULUM_2026-10-08.md)、[内容品質基準](CONTENT_QUALITY_STANDARD.md)、[教材形式](LESSON_FORMAT.md)
- 変更の性質: **教材本文・Catalog・statusは変更しない監査PR**。Worker A/Bの修正と競合させない。

## 1. 監査の範囲と判定基準

`courses/index.json` にある本格学習4 Courseの全30 IDについて、`lessons/security-deep/<ID>.md` の学習目標・本文・注意・出典を読み、章の知識範囲、主張のつながり、誤解しやすい点、必要な具体例を確認した。代表的な3章の `learn/security-*.html` と2章の RSVP JSONを照合した。既存Course I〜IVのレビュー記録も読んだ。

**本文30/30の定性的監査**と、**全形式30/30の自動検査・完全な出典突合**は異なる。後者は未実施。全30のLearn全文・RSVP JSONは通読していない。Android Chrome・音声再生・`npm run check` も本C作業では実施していない。

採点観点は、①到達目標、②正確性、③仕組みと因果、④対比、⑤実際の判断に使う例、⑥限界・失敗条件、⑦効き目の確認方法、⑧学習順序、⑨出典・現在性、⑩RSVP/Learn表現。レビューの `NEEDS_REVISION` は**専門教育としての説明深度の改善が必要**という意味で、既存の `COMPLETE v0.1` スキーマ条件を満たさないと断定するものではない。出典URLの掲載だけを「全主張検証済み」とは扱わない。

全体の共通所見:

1. **目標・概念の広さ:** 30章とも学習目標と必要領域は概ね定義済み。注意事項と一次資料のリンクもある。入口として有用。
2. **判断練習の不足:** 本文は約50〜60個の短い説明文が中心。多くの章で「どのケースでどちらを採用するか」「条件を変えたらどうなるか」「何で確認するか」を一つの具体例で通し説明できていない。Course IIのATT&CKには仮想事例の素描があるが、観測証拠から判断・対策へ結ぶ演習は不足。
3. **反復と形式:** `security-risk-assessment`、`security-sessions-federation-oauth-oidc-saml`、`security-cloud-shared-responsibility-iam-config` のLearn HTMLを見た範囲では、「要点の再確認」でRSVP本文の短文が長く連続再掲される。Worker Bが生成仕様を修正するまでCは本文を一括変換しない。
4. **表示不良:** `security-cloud-shared-responsibility-iam-config` の `Infrastructure as Co` / `deも使えます。`、`security-email-spf-dkim-dmarc` の `Display name spoofin` / `gも残ります。`、`security-container-serverless-saas-iot` の `Attack surfa` / `ceです。`、`security-data-classification-encryption-retention` の `Cryptographic erasur` / `eもあります。` は意味単位の破断。Worker A/Bの優先課題。
5. **再掲の副作用:** Learnの例には `Identity Providerを。` / `強く守ります。` という不自然な文、`IaaS` が `アイアース` のみになる例があり、略語自体の可視性とTTS用読みを分ける必要がある。
6. **重要な重複:** リスク・残存リスク（I）、Identity侵害（II/III）、多層防御・監視（I/IV）、信頼境界（I/IV）を重複して扱うが、「先行章は何を教え、後続章は何を深めるか」が必ずしも明示されない。重複自体を削除せず、文脈別の役割を指定する。

## 2. 30章の個別監査

判定は全て **NEEDS_REVISION（専門学習の深度基準）**。全30章に重大な事実誤りがあるという意味ではない。優先度 P0 は既知の表示・語義破断、P1 は判断・仕組みの核心、P2 は次の改稿サイクル。具体例は新規の架空ケースとして明示し、事実の出典と混同しないこと。

| Course | Lesson ID | 優先 | 現状の強み | 主な改稿課題・評価方法 |
|---|---|---|---|---|
| I | `security-purpose-principles` | P2 | CIA以外の性質・設計原則、CSFの6機能 | 申請サービスで機密性と可用性が衝突する判断例。業務目的、妥協点、検証指標を示す |
| I | `security-assets-dependencies` | P1 | 台帳を業務・人・依存先・データフローへ拡張 | 架空の住民申請フロー図から最重要資産、依存障害、信頼境界を選ぶケース |
| I | `security-threats-vulnerabilities` | P1 | 脅威、脆弱性、露出、侵入経路を区別 | 同じ脆弱性でも公開範囲と既存管理策で優先度が変わる対比 |
| I | `security-risk-assessment` | P1 | 定量・定性評価、不確実性・再評価を区別 | 複数の仮想リスクの根拠・前提・幅を比較して優先順位と再評価条件を説明する。NIST 800-30の「準備→実施→維持」を接続 |
| I | `security-risk-treatment` | P1 | 回避・低減・共有・受容、期限付き例外を扱う | 選択肢の費用・副作用・決裁権限・残存リスクを比較する承認ケース |
| I | `security-threat-modeling` | P1 | STRIDE、フロー、信頼境界、更新を扱う | 同一データフローについて「脅威→対策→検証証拠」を1本完成させる |
| I | `security-defense-in-depth` | P1 | 多層防御を製品数で評価しない | MFA・ログ・復旧が同じIdentity障害に依存する例で共通原因故障を判定する |
| II | `security-adversaries-initial-access` | P2 | 帰属推定を避け行動と入口で見る | 同じ入口でも動機・権限・侵入後の選択肢で優先対応が異なる例 |
| II | `security-social-engineering-bec-phishing` | P1 | 正規アカウント悪用と送金手順を含む | 架空の振込先変更依頼を「別経路確認→保留→記録」まで判断。利用者の過失のみに帰さない |
| II | `security-malware-ransomware` | P1 | 侵入・持出し・暗号化・復旧を統合 | 暗号化未確認でも封じ込めが必要な証拠、バックアップ復元と再侵入の切り分け |
| II | `security-credential-session-attacks` | P1 | MFA疲労とトークン悪用の違いを扱う | パスワード変更だけでは閉じない侵害の調査順、Session失効の判定 |
| II | `security-post-compromise-movement` | P1 | Discovery/権限昇格/横展開をつなぐ | 権限追加・管理アクセス・通信先という仮想ログから影響範囲を判定 |
| II | `security-c2-exfiltration-stealth` | P1 | 通信・ログ欠損を単一指標にしない | 正規クラウド通信と異常送信を時系列で比較。誤検知・ログ欠損時の判断も説明 |
| II | `security-mitre-attack-scenarios` | P1 | ATT&CKを固定順序やリスク点数にしない | 既存の仮想シナリオへ観測点・検知失敗・防御策・改善証拠を対応させる |
| III | `security-identity-proofing-authn-authz` | P1 | 識別/本人確認/認証/認可を分ける | 登録時の成りすまし、ログイン成功後の越権、回復経路を別の失敗例で比較 |
| III | `security-password-mfa-phishing-resistant` | P1 | MFA方式・回復・可用性を評価 | OTP/Passkey/回復フローの脅威・利用条件を比較。NIST 800-63Bの適用対象を明示 |
| III | `security-sessions-federation-oauth-oidc-saml` | P0 | OAuthの認可とOIDCの認証を区別 | `Identity Providerを` の分割是正。Access TokenとID Tokenの受信先、Audience、Session/Logoutの非連動を仮想構成で示す |
| III | `security-rbac-abac-privileged-access` | P1 | 最小権限とRBAC/ABAC、非常時権限を扱う | 異動・所属属性遅延・緊急操作が衝突する権限決定のケース |
| III | `security-symmetric-public-key-hash-mac` | P0 | 暗号化・Hash・MAC・署名の目的を区別 | `Digital signatureとは` / `異なります。` などの破断修正。Hash単独と認証付き暗号の保証を対比 |
| III | `security-signatures-pki-certificates` | P1 | 信頼連鎖、証明書更新、署名の限界を説明 | 証明書期限切れ/名前不一致/漏えい鍵を分け、何を確認・失効すべきか判断 |
| III | `security-key-secret-credential-lifecycle` | P0 | 発行・配布・回転・失効を通して扱う | `Secret managerを` / `使う場合があります。` の不自然な連結。Secret流出時の依存先の失効順序 |
| III | `security-data-classification-encryption-retention` | P0 | 暗号化、権限、保持、廃棄を区別 | `Cryptographic erasur` / `e` の切断修正。バックアップと法的保全が衝突する保存/削除ケース |
| IV | `security-communication-path-boundaries` | P1 | DNS、Gateway、CDN、管理面を含む | 認証サービス障害・Proxy経路迂回という仮想通信図で失敗経路を確認 |
| IV | `security-dns-tls-https` | P1 | HTTPSがWebアプリの安全を保証しない点が明瞭 | TLS終端後の経路と名前検証のケース。DNSSECとTLSの守る対象を混同しない |
| IV | `security-firewall-proxy-waf-ids-ips` | P1 | 配置・TLS終端・誤検知・迂回を重視 | WAF導入下でも存在するアクセス制御不備を検証できるケース |
| IV | `security-segmentation-vpn-zero-trust` | P1 | VPN接続済み≠無条件信頼を説明 | 管理者VPN侵害時、端末状態・権限・セグメントによる影響範囲を比較 |
| IV | `security-email-spf-dkim-dmarc` | P0 | SPF/DKIM/DMARCの役割と限界を区別 | `Display name spoofin` / `g` の切断修正。SPFがpassでもDMARC失敗になる例と段階導入時の誤遮断の例 |
| IV | `security-endpoint-hardening-edr-mdm` | P0 | EDR Coverage、MDM、BYODの境界を扱う | `Managed dev` / `ice` の切断修正。管理済みと未管理端末のログ・隔離・プライバシーの差 |
| IV | `security-cloud-shared-responsibility-iam-config` | P0 | IaaS/PaaS/SaaS、IAM、ログ、復旧を扱う | `Infrastructure as Co` / `de` の切断修正。IaaS対SaaSで設定・鍵・監査・復旧の責任を表にする |
| IV | `security-container-serverless-saas-iot` | P0 | Container/Serverless/SaaS/IoTの共通リスク | `Attack surfa` / `ce` 等を修正。四技術の責任・検知・更新不能条件の対比 |

### 10観点での横断評価

| 観点 | 評価 | 監査で確認した事実・限界 |
|---|---|---|
| 到達目標 | おおむね成立 | 30 Markdownすべてに学習目標あり。ただし行動を採点できる状況設定は不足 |
| 正確性 | 一部のみ外部照合済み | 主要出典の規格番号は下記の範囲で照合。全ての主張の真偽は未検証 |
| 仕組み・因果 | 改善が必要 | 定義/注意は広いが、動作と失敗を一つの例で追う記述が乏しい |
| 対比 | 部分的に成立 | OAuth/OIDC、SPF/DKIM/DMARC、VPN/Zero Trust等は導入済み。判断条件を補う |
| 具体例 | 優先改善 | Course IIのATT&CKに架空シナリオがあるが、証拠→判断→代替策まで不十分 |
| 限界・失敗条件 | 入口として成立 | 各章に「注意」あり。具体的条件で本当に失敗するかを演習化する |
| 検証方法 | 改善が必要 | 「ログを見る」「試験する」はあるが、期待結果と失敗時対応が希薄 |
| 学習順序 | 概ね妥当 | I→II→III→IVは自然。ただし攻撃と認証、信頼境界、監視は重複の役割を整理 |
| 出典・現在性 | 限定確認 | 各Markdownに出典。下記の一次資料サンプルをfresh確認、逐語的な全主張検証は未実施 |
| RSVP/Learn形式 | 代表例で不合格 | 専門語の途中分割、無理な和英混在、Learn長文再掲を確認。全30形式の機械検査はA/B担当 |

## 3. 一次資料と現在性（2026-10-08に公式公開ページを確認）

次は**今回実際に確認した一次資料と一致事項**。この表にない各出典を今回再取得したと扱わない。

| 出典・URL | 対象Lesson | 確認できたこと / 注意 |
|---|---|---|
| [IPA 2027年度向け新試験シラバス案](https://www.ipa.go.jp/shiken/syllabus/henkou/2026/20260630.html) | 全30のカバレッジ補助 | 情報処理安全確保支援士シラバス案 Ver.0.1は8月31日掲載、9月30日更新履歴。**案であり改定の可能性がある** |
| [NIST CSF 2.0](https://www.nist.gov/publications/nist-cybersecurity-framework-csf-20) | I全般、IVの運用 | CSF 2.0はリスク管理の高水準な成果分類であり実装手順を規定しない |
| [NIST SP 800-30 Rev.1](https://www.nist.gov/publications/guide-conducting-risk-assessments) | リスク評価/脅威/リスク対応 | 準備・評価の実施・維持の三段階。教材には手順と判断例の接続が必要 |
| [NIST SP 800-63-4](https://csrc.nist.gov/pubs/sp/800/63/4/final)／[63B-4](https://pages.nist.gov/800-63-4/sp800-63b.html) | IIIの本人確認/MFA/Session | 2025年公開の正式版。NISTの米連邦向け要件を日本の全組織の法定義務と一般化しない |
| [IETF RFC 10017](https://www.rfc-editor.org/info/rfc10017/) | Session/OAuth/OIDC/SAML | 2026年8月発行のBrowser-Based Applications BCP。Authorization Code+PKCEの背景とWebアプリ構成別のリスクを扱う |
| [IETF RFC 9846](https://www.rfc-editor.org/info/rfc9846/) | DNS/TLS/HTTPS | 2026年7月公開。TLS 1.3のRFC 8446を廃止して置換 |
| [IETF RFC 9989](https://www.rfc-editor.org/info/rfc9989/) | SPF/DKIM/DMARC | 2026年5月公開。DMARCのRFC 7489/9091を置換 |
| [MITRE ATT&CK Enterprise tactics](https://attack.mitre.org/tactics/) | II全般 | 現行15 tactic。Stealth/Defense Impairmentを別に扱う。固定順序と誤解させない |
| [OWASP Top 10:2025](https://top10.owasp.org/2025/) | Iの脆弱性説明、後続Vの準備 | 2025版が公開中。Webアプリの一般リスク分類であり全システムの完全な脅威一覧ではない |

**保留事項:** NIST/CISA/CIS/OWASP/IETF/IPA等の各Markdown出典URLすべてのリンク到達性と版の再確認、引用した細目と各本文の行単位対応、SAML/OpenID仕様と各Cloud Provider公式責任分界の突合は未完了。これらの不足を理由にすぐ30章をDRAFTへ戻すのではなく、重大な誤りが実際に判明したものから `docs/LESSON_FORMAT.md` の手順で判断する。

## 4. 8 Course / 60 Lessonとの接続（実装と予定を分離）

| Course | 計画Lesson | 今回確認したmain上の実装 | カバレッジ・学習順序上の注意 |
|---|---:|---:|---|
| I 基礎・リスク・脅威 | 7 | 7 | リスク評価から判断例・有効性確認までを具体化 |
| II 脅威主体・攻撃の流れ | 7 | 7 | 攻撃手法の名称暗記でなく防御側の観測・封じ込めを教える |
| III Identity・暗号・データ保護 | 8 | 8 | 認証/認可、暗号/Hash/署名の使い分けを実例化 |
| IV Network・Endpoint・Cloud | 8 | 8 | 責任分界、観測、例外、マネージドサービスの限界を実例化 |
| V AppSec・API・Software Supply Chain | 9 | 0 | Injection、XSS/CSRF、認可不備、API、SSDF、CI/CD/SBOM。OWASP 2025等をD担当で対応 |
| VI Vulnerability・Detection・Incident・Resilience | 8 | 0 | 脆弱性優先順位、SIEM、検知、IR、証拠保全、DRは現30章では導入のみ |
| VII Governance・Privacy・Audit・Supply Chain | 7 | 0 | 法務、サプライヤー、内部統制、監査の体系化は今後。特定法令要件の現在性確認が必要 |
| VIII AI Security・統合ケース | 6 | 0 | Prompt Injection、RAG/Agent、評価、行政申請サービスの横断ケースは今後 |

Course V〜VIIIの計画上の30章は**未実装**。この表は既存カリキュラムの計画に対応した監査・引継ぎであり、Worker Dの60章×一次資料の詳細カバレッジ表の代替ではない。旧入門情報セキュリティCourse（8章）は別系列として維持。

### 教材改稿の受入条件（A/B/Dへ引継ぎ）

- 内容: 初出概念→仕組み→具体例→対比→失敗条件→判断/検証までを追えること。架空ケースは明記。出典確認が必要な主張はURL・文書版・確認日を記録。
- 学習: 章ごとに少なくとも1つの判断課題を設け、何を見たら結論が変わるかを説明。短い復習で置き換えて論点を削らない。
- 表示: RSVPの24文字上限と専門用語の意味単位を両立。例外は長さでなく自然な言い換えを検討。読み上げ表記と用語自体を分離。
- 形式: Markdown、RSVP JSON、Learn HTML、Catalogは内容を改めるとき同時更新し、現行statusの規則を維持する。
- 検証: `npm run check`、新しい退行テスト、サンプルの聴取・390px幅、Android Chromeの実機結果を**別々に**記録。CI成功は教材品質・音声品質の証明ではない。

## 5. 具体的な実行順と担当境界

1. **A/B（先行）:** P0の英語専門語分割、句の切断、Learnの無意味な逐語再掲を是正し、新しい自動試験を作る。修正前に既知例が失敗するテストを確認。
2. **B（先行）:** 指定4章（リスク評価、Federation、Cloud、Mail認証）で内容改善・聞き取り・理解問題の品質を検証。
3. **Cの次サイクル:** 上記4章の本文/JSON/Learnの差分を再監査、代表出典の行単位突合と判断課題の人手レビューを行う。成功後は I〜IVをP1順に展開。
4. **D:** 本監査の前提・重複/未収録項目を受け、Course V〜VIIIの一次資料カバレッジを確定。P0/P1が未収束なら新規章の大量追加を控える。
5. **統合:** 各PRを最新mainへ再照合し、変更とテストの結果を確認してからmerge判断。Cの文書PRだけで教材改稿や本番反映は完了しない。

## 6. 現在状態 / 未検証

- 開始main: `1d6017a098d8a22cd7dd3bb8763e86b9e84a4311`
- 旧Draft PR #6: open / draft / unmerged。古い教材案として参照のみ。そのままmergeしない。
- このCブランチ: 監査文書のみ追加。教材、Catalog、schema、Learn、テスト、deploymentの変更なし。
- `npm run check`: NOT_RUN（GitHub上の資料レビュー。実行環境なし）
- Android Chrome / Web Speech API / Chrome標準読み上げ: NOT_VERIFIED
- Production / Pagesの実ページ: NOT_VERIFIED
- 新しいPRのCI: PR作成後に確認。先行mainのVercel commit statusのsuccessは、実機/全文品質の検証ではない。
- ステータス: **PARTIAL_WITH_GAPS**（Cの30章の文書レビューは実施。全30形式の機械検査・全出典の行単位照合・4章改稿/人手聴取は未実施で、担当境界外も含む）


---

## 7. 現行main再判定（2026-10-08・Worker C 第2巡）

本節は初回監査を消さずに追記する**後続時点の判定**である。上記第2節のP0や表示破断は当時の所見であり、2026-10-08の下記snapshotで再評価した。「旧監査で指摘した」ことと「現在も未修正」を区別する。

- 指示: Library「情報セキュリティ教材の実質品質・利用環境検証・段階的拡充 Wave」Worker C。
- GitHub APIでfresh確認した開始main full SHA: \`2eb12f4847f204816fd9aa9c2b1fdc512805e380\`（2026-10-08 JST）。mainから分岐し、本節のみを変更する。
- GitHubのopen PRは旧Draft #6と別スコープ #29。A/B/DのこのWaveの新規成果は**このsnapshotのmainに含まれない**。他Workerの変更を監査済みとして先取りしない。
- mainの直近GitHub Actions \`Test\` はsuccess、\`Deploy GitHub Pages\` はfailure（いずれも \`2eb12f4\`）。CIの状態は**教材の意味・音声・公開の品質判定とは分離**。
- 2026-10-08の初回C開始main \`1d6017a...\` からこのmainまでのcommit比較、および下記対象ファイルの読み戻しを根拠とした。全30章のMarkdown本文は初回監査の対象だったが、**第2巡で全30章のLearn/RSVPを全文再通読したわけではない**。未照合範囲をPASSにしない。
- 判定語: \`PASS\` は**指定した狭い検証項目**で合格、\`NEEDS_REVISION\` は説明深度・表現・問題に改善が必要、\`BLOCKED\` は内容受入または拡張を止める未解決条件。これらはカタログ \`COMPLETE v0.1\` と独立した監査判定。

### 7.1 過去の表示破断を現在の欠陥と混同しない

| 初回指摘 | 2026-10-08現行mainでの確認 | 現行の意味単位判定 |
|---|---|---|
| Cloud \`Infrastructure as Co\` / \`de\` | \`security-cloud-shared-responsibility-iam-config.md\` の \`Infrastructure as Code\` /「構成をコードとして管理します。」に変更済み | 英字途中破断は \`PASS\`。新たな2行の読みやすさはAの境界監査と連携 |
| Mail \`Display name spoofin\` / \`g\` | \`security-email-spf-dkim-dmarc.md\` の \`Display name spoofing\` /「表示名の偽装も残ります。」に変更済み | 英字途中破断は \`PASS\` |
| Container \`Attack surfa\` / \`ce\` | \`security-container-serverless-saas-iot.md\` に当該英字途中破断なし | 当該破断は \`PASS\`。説明深度は未達 |
| Data \`Cryptographic erasur\` / \`e\` | \`security-data-classification-encryption-retention.md\` の \`Cryptographic erasure\` に修正済み | 当該破断は \`PASS\` |
| Endpoint \`Managed dev\` / \`ice\` | \`security-endpoint-hardening-edr-mdm.md\` に当該英字途中破断なし | 当該破断は \`PASS\` |

一方、以下のMarkdown上の意味単位の切れ目は現行mainでも確認した。これは字数制限への適合と**日本語の自然さを別判定する必要がある**例であり、Aの担当として改善後にCが意味を再照合する。

- \`security-identity-proofing-authn-authz\`: 「Identity proofingに」→「も失敗があります。」
- \`security-sessions-federation-oauth-oidc-saml\`: 「Identity Providerを」→「強く守ります。」
- \`security-symmetric-public-key-hash-mac\`: 「Digital signatureとは」→「異なります。」
- \`security-key-secret-credential-lifecycle\`: 「Secret managerを」→「使う場合があります。」、「Emergency rotationも」→「演習します。」
- \`security-segmentation-vpn-zero-trust\`: 「VPNとZero Trustを」→「対立概念にしません。」

初回に指摘したLoad balancerの例は、現行 \`security-communication-path-boundaries.md\` では「Load balancerも経路になります。」という完結した文へ変わっているため、旧境界を**現存欠陥と数えない**。上記は現行mainに残る**6境界**。Aによる以後の修正は再取得して判定し直す。

### 7.2 既存30章の現行監査（形式修正と説明深度を分離）

初回監査の30行について、現行mainの初回監査後の変更ファイル集合と代表本文を再突合した。Markdownの説明の深さを十分に改稿した証拠はなく、専門学習の受入は**30/30 \`NEEDS_REVISION\` のまま**。ただし修正済みの英字途中破断をP0の未解決事項として扱わない。

| Course | 対象Lesson ID（全30） | 第2巡の優先順位・必要作業 |
|---|---|---|
| I (7) | \`security-purpose-principles\`; \`security-assets-dependencies\`; \`security-threats-vulnerabilities\`; \`security-risk-assessment\`; \`security-risk-treatment\`; \`security-threat-modeling\`; \`security-defense-in-depth\` | \`purpose\` P2、その他P1。RiskのLearnは改善したが、Markdownに判断の具体的な通し例がなく、専門学習の深度は未達 |
| II (7) | \`security-adversaries-initial-access\`; \`security-social-engineering-bec-phishing\`; \`security-malware-ransomware\`; \`security-credential-session-attacks\`; \`security-post-compromise-movement\`; \`security-c2-exfiltration-stealth\`; \`security-mitre-attack-scenarios\` | \`adversaries\` P2、その他P1。観測証拠→判断→反証・検証までの安全な模擬ケースを追加 |
| III (8) | \`security-identity-proofing-authn-authz\`; \`security-password-mfa-phishing-resistant\`; \`security-sessions-federation-oauth-oidc-saml\`; \`security-rbac-abac-privileged-access\`; \`security-symmetric-public-key-hash-mac\`; \`security-signatures-pki-certificates\`; \`security-key-secret-credential-lifecycle\`; \`security-data-classification-encryption-retention\` | 全章P1。境界が残る \`identity-proofing\`, \`sessions\`, \`symmetric\`, \`key-secret\` はA優先。 \`data-classification\` の旧英字破断P0は解除 |
| IV (8) | \`security-communication-path-boundaries\`; \`security-dns-tls-https\`; \`security-firewall-proxy-waf-ids-ips\`; \`security-segmentation-vpn-zero-trust\`; \`security-email-spf-dkim-dmarc\`; \`security-endpoint-hardening-edr-mdm\`; \`security-cloud-shared-responsibility-iam-config\`; \`security-container-serverless-saas-iot\` | 全章P1。\`segmentation\` はAの境界修正、\`email\` はBのLearn見出し修正を優先。旧英字破断による \`endpoint\`・\`cloud\`・\`container\`・\`email\` のP0は解除 |

**P1としてBの横展開で先に扱う候補:** ①BEC/Phishing、②Ransomware、③Credential/Session attacks、④Identity proofing・Authentication・Authorization、⑤MITRE ATT&CK scenarios、⑥Firewall/Proxy/WAF/IDS/IPS。これらは単なる行数追加ではなく、各章で「観測事実、判断条件、反例、検証証拠」の欠落を解消する。Bの新しいHTMLや問題がmainに入るまでは監査未了とする。

Course間の役割は、I=守る対象・リスク判断、II=攻撃の観測と封じ込め、III=本人・認証情報・権限・暗号の保護、IV=通信と実行環境・管理責任、と区別する。リスクと権限、Identity攻撃、信頼境界の再登場は有用だが、後続章で何を深めるかを明示する必要がある。

### 7.3 パイロット4章：重要主張・出典・説明・検証

対象Markdown、現在のLearn HTML、\`docs/SECURITY_LEARN_PILOT_2026-10-08.md\` の12問を第2巡で照合。主張別一次資料は**下表の箇所を今回公式ページで再取得**。全節・全URLの網羅検証、実機音声と学習者テストは行っていない。

| Lesson | 主要主張と実際に照合した原典 | 内容・判断例・限界の評価 | 判定 |
|---|---|---|---|
| \`security-risk-assessment\` | NIST SP 800-30 Rev.1（2012、Guide for Conducting Risk Assessments：prepare → conduct → maintain、[NIST公式](https://csrc.nist.gov/pubs/sp/800/30/r1/final)） | Learnは架空の住民申請と集計ツール、入口から影響への因果、不確実性・対策の効き目・再評価を含む。Markdownの58短文には通しケースがなく、評価手順の3段階との明示的な接続も薄い。定量・定性の判断尺度は組織依存と明記しており、特定のリスク点数を断定しない | 原典に整合する主要説明は\`PASS\`。形式横断の深度は\`NEEDS_REVISION\` |
| \`security-sessions-federation-oauth-oidc-saml\` | [RFC 10017, §§1,4](https://www.rfc-editor.org/info/rfc10017)（Browser-based OAuthとCode+PKCE）、[OIDC Core §3.1.3.7](https://openid.net/specs/openid-connect-core-1_0-errata2.html)（ID Token検証・issuer/audience）、[NIST SP 800-63C-4 §4.7](https://pages.nist.gov/800-63-4/sp800-63c.html)（IdP/RPセッションの独立）、[OASIS SAML 2.0 Technical Overview](https://docs.oasis-open.org/security/saml/Post2.0/sstc-saml-tech-overview-2.0.html) | OAuthの認可/ID Tokenの認証、署名・相手先、logoutの非連動をLearnで区別。Markdownには不自然な\`Identity Providerを\`の断片が残る。SAML個別プロファイルや全トークン検証条件までは未網羅 | 抽出した主要主張は\`PASS\`。自然さと形式同期は\`NEEDS_REVISION\` |
| \`security-cloud-shared-responsibility-iam-config\` | [AWS責任共有モデル](https://aws.amazon.com/jp/compliance/shared-responsibility-model/)（サービスごとの利用者/事業者責任とEC2のゲストOS・設定例）。既存教材のCISA Cloud Security TRA v2リンクはCISAのEO一覧ページであり、引用箇所の節までは示していない | LearnはIaaS/PaaS/SaaS、SaaS外部共有、IAM、構成ドリフト、ログと復旧を説明。AWS例を全事業者共通の契約上の約束とはしない。事業者別の責任表、鍵・設定とアクセスログの試験証拠、CISA TRA v2の該当節は追加照合が必要 | 一般原則\`PASS\`、固有の責任分界と出典節の十分性\`NEEDS_REVISION\` |
| \`security-email-spf-dkim-dmarc\` | [RFC 9989 §§4.10, 5.3](https://www.rfc-editor.org/info/rfc9989)（SPF/DKIMのいずれかの成功とAuthor Domainとのalignment、受信側の判断）。2026-05刊、RFC 7489/9091をobsolete。SPF RFC 7208 / DKIM RFC 6376は今回**全文条項再照合をしていない** | LearnのSPFとDKIMの役割分担、DMARC alignment、正規転送・正規アカウント侵害への限界は概ね妥当。ただし見出し**「認証済みでも詐欺メールとは限らない」**は、意図した「認証済みでも安全とは限らない」と逆方向に読め、直後の本文と矛盾する。これは単なる字数問題ではない。Bに修正を依頼し、修正後の日本語・出典・問題を再審査する | RFC主張の限定確認\`PASS\`、Learn見出しの意味保持\`NEEDS_REVISION\`（優先P0・B修正依頼） |

**未照合**: RFC 9700全文、SAMLの具体的Assertionプロファイル、CISA Cloud TRA v2のPDF内該当節、各Cloud Provider契約/サービスごとの現在仕様、IPAシラバス案の全項目、各Lessonに列挙された全出典の節と全行。一般説明に無理にリンクを増やさず、版依存や重大な解釈に必要な節を優先する。IPAの案は正式決定版として扱わない。

### 7.4 理解確認12問のレビュー

\`docs/SECURITY_LEARN_PILOT_2026-10-08.md\` の各Course 3問、計12問は問い・模範解答・誤答例と理由・確認対象が**文書上そろっている（12/12、構造面のみPASS）**。判断条件を変えて考える問いも含み、単なる用語暗記だけではない。ただし学習者の解答や理解度は未収集であり、心理測定上の妥当性や学習効果は\`NOT_VERIFIED\`。

| 範囲 | 内容レビューと改善要求 | 判定 |
|---|---|---|
| Risk Q1〜Q3 | Q1は「中リスク」が同じでも優先順位が異なる条件を説明できる良い問い。Q2は対策の**導入と有効性**を区別できる。Q3は新委託先を追加しても接続・取り扱う情報が変わらないなどの条件を明示して、再評価の深さを採点できるようにする | \`NEEDS_REVISION\`（採点条件を追加） |
| Session/SSO/OAuth Q1〜Q3 | Q1のアクセストークン≠認証証拠は原則として妥当。Q2は**SSOとフェデレーションが重なり得るが同義ではない**実例を加える。Q3はアカウント停止後のRP側セッション独立を問え、63C-4に整合 | \`NEEDS_REVISION\`（Q2に条件付きの正答例） |
| Cloud Q1〜Q3 | SaaSの利用者側責任、暗号化で解決しない共有設定、IaCの設定ドリフトを区別できる。Q1は特定製品・契約で例外があることを採点基準に含める。Q3は現行設定の確認手段と許容される構成差分を記述できると望ましい | \`NEEDS_REVISION\`（具体的な採点基準） |
| Mail Q1〜Q3 | Q1の「Fromが正しい」は曖昧。**SPF/DKIM passとRFC5322.FromとのDMARC alignment**を明示して問う。Q2は受信側処理がローカルポリシーにも依存する点を加える。Q3はDMARC passと取引内容の正当性が異なることを測れる | \`NEEDS_REVISION\`（Q1の問いを明確化） |

模範解答と異なる理由付けでも根拠が妥当なら加点するルーブリック、誤答が成立する条件、提示する追加証拠を次のB改稿案に含める。**12問が存在することは12問の学習効果検証完了を意味しない**。

### 7.5 未解決事項・Eへの引渡し

| 重要度 | Lesson / 担当 | 残件・終了条件 | 現状 |
|---|---|---|---|
| P0 | Mail Learn / B→E | 「認証済みでも詐欺メールとは限らない」の意図を正し、見出しと説明が一致することをCが再読する。修正前に内容の受入を宣言しない | \`NEEDS_REVISION\` |
| P1 | Markdown/RSVP 6境界 / A→C→E | 上記7.1の現存6境界を自然な文節に改め、Markdown・JSON・Learn意味の一致と24字制約を再照合 | \`NEEDS_REVISION\` |
| P1 | 4章主要原典・問題 / B+C→E | 主張別の節、架空例、条件変更問題の採点基準を明示。Cloudは責任分界の具体的なプロバイダー資料を追加確認 | \`NEEDS_REVISION\` |
| P1 | 横展開4〜6章 / B→C | 新Learn原稿と理解確認問題を提出後、元Markdown/JSON・重要主張・一次資料を照合。未提出の版を監査済みと扱わない | \`BLOCKED\`（成果待ち） |
| P2 | 全30章の深度 / B+C→E | 優先Lessonを段階的に、原因・動作・検証・反例・ケース判断で改稿し、都度判定 | \`NEEDS_REVISION\` |
| 別所管 | Android Chrome / D、統合 / E | 音声自然さ、実利用、本番デプロイの成功はD/Eの証拠を要する | \`NOT_VERIFIED\`（Cは代替しない） |

**Cの結論: \`PARTIAL_WITH_GAPS\`。** 現行mainに対する30章の監査差分、4パイロットの限定的な主張別一次資料照合、12問の採点品質レビュー、A/B/Eへの個別引渡しは記録した。一方、30章全形式・全出典の網羅照合、新B横展開章、実際の読み上げ・学習者テストは未完了。ここでの \`PASS\` は主張または構造の限定検査に限られ、教材全体をCOMPLETEと再認定するものではない。既存の教材Markdown/JSON/HTML/Catalogと公開設定は本Cで変更しない。


---

## 8. 2026-10-09 Worker C — 8章・20問の独立レビューと30章の継続課題（後続snapshot）

**本節の適用基点**: 2026-10-09 JST、GitHub main full SHA **fd003b63b816799dd8f1f1eac0de4fd70db32da9**。この章は既存の第1・第2巡監査の後続記録であり、それらを書き換えない。作業開始時およびブランチ作成前のmain SHAは一致した。対象リポジトリはprivate、GitHub Pagesの再有効化は禁止。

- 開始時open PR：**#6（旧Draft）、#29（Android overlay別案件）**のみ。本Wave A/Bによる優先4章の新規headは開始時点で存在せず、**新4章の改稿後独立審査はNOT_VERIFIED**。
- GitHub Actions：main SHA fd003b63… の **Test run 37783095016** はsuccess、同SHAのschedule run 37784613603 もsuccess。URL: https://github.com/Josh-Temple/rsvp-learning/actions/runs/37783095016 。これは過去にmainで実行された自動検査の結果であり、本CブランチのCI成功、個別主張の真偽、音声品質の証拠ではない。
- production：前Wave Eの記録ではVercel productionの配信コード SHA **0a168c7615b573620fd610a198f75453be4ed975**、READY/alias一致。**このCではVercel APIと実ページを新規操作していないため、現在のdeploymentはNOT_VERIFIED**。D/Eの所管とする。
- 監査対象：既存改稿8章のMarkdown **8ファイル**、対応RSVP JSON **8ファイル**、Learn HTML **8ファイル**。JSONのchunksとMarkdown番号付き本文の文字列・順序を独立比較し、**8/8章で一致**（件数順: 58, 50, 52, 51, 50, 51, 49, 51）。ただしHTMLは逐語対応させる形式ではなく、ケースの扱い・概念・否定を定性的に突合した。
- 問題：docs/SECURITY_LEARN_PILOT_2026-10-08.md のパイロット12問＋横展開8問、計20問の**問題文・模範解答・誤答理由を再読**。クイズUIや学習者への提示・採点実験は行っていない。
- 変更の所有：**本監査文書のみ**。Worker AのMD/JSON、Worker BのHTML/問題集、Worker DのQA報告は編集しない。
- 判定語：本文の内容品質=PASS/NEEDS_REVISION/BLOCKED、出典=source_verified/partial/not_verified、問題=quiz_reviewed/not_verified、学習実測=user_learning_not_verified。**形式ステータス COMPLETE v0.1 を内容PASSと読み替えない**。

### 8.1 主張と原典：実際に再取得した範囲

以下は2026-10-09 JSTに**一次資料の公開本文を再取得**して照合した項目。リンクの掲載だけを確認済みとするものではない。節が限定される資料は、別の節・全版・各クラウド製品まで一般化しない。

| 原典・版・具体的箇所 | 照合した主張と対象 | 判定・限界 |
|---|---|---|
| [NIST SP 800-30 Rev.1（2012）](https://csrc.nist.gov/pubs/sp/800/30/r1/final)、Risk Assessmentのprepare/conduct/maintain | リスク評価の範囲、根拠、不確実性、再評価：risk-assessment | **partial**。方法論の一般原則に整合。本文58文節には一連の評価記録と意思決定ケースがない |
| [OpenID Connect Core 1.0, errata set 2 §3.1.3.7](https://openid.net/specs/openid-connect-core-1_0.html#IDTokenValidation) | ID Tokenは受信クライアントがiss、aud等を検証する：sessions-federation | **partial**。本文の認可/認証の区別は概ね正しいが、nonce・署名・各フローの成立条件まで網羅したとしない |
| [IETF RFC 9700（2025）§4.8](https://www.rfc-editor.org/rfc/rfc9700.html#section-4.8) | PKCEの前提を崩すと防御が失われ得る：sessions-federation | **partial**。一般論として「現在のBCP参照」は妥当。個別実装の正当性は検証していない |
| [NIST SP 800-63C-4（2025）、RPセッションとアサーションの有効性を分離する記述](https://pages.nist.gov/800-63-4/sp800-63c.html)／[SP 800-63B-4 Session Management](https://pages.nist.gov/800-63-4/sp800-63b/session/) | IdP停止とRP既存セッションの即時消滅は同義でない：sessions-federation / credential-session | **partial**。RP・IdP個別の有効期間、logout連携、失効実装を現場で試していない |
| [OASIS SAML 2.0 Technical Overview、Assertion Conditions/AudienceRestrictionの例](https://docs.oasis-open.org/security/saml/Post2.0/sstc-saml-tech-overview-2.0.html) | 発行者・対象者・受信者・有効期限・信頼設定を分ける：sessions-federation | **partial**。SAML Profiles・Bindings・署名要件の全組合せは未照合 |
| [AWS IAM Security「Shared responsibility」](https://docs.aws.amazon.com/IAM/latest/UserGuide/security.html) | 利用者責任は採用サービスに依存する：cloud-shared-responsibility | **partial**。AWS公式による一般原則のみ確認。**全SaaSや他社契約への普遍的な表ではない** |
| [IETF RFC 9989（2026-05）§4.4, §5.1, §5.3, §7, §11.4](https://www.rfc-editor.org/rfc/rfc9989.html) | SPF/DKIMの検査対象、Fromとのalignment、受信者判断、送信経路調査、表示名攻撃の限界：email-spf-dkim-dmarc | **partial**。RFC 7489と9091をobsoleteとする。送受信構成ごとの判定テストは未実施 |
| [IPA BEC対策特設ページ（2026-03-30更新）「対策」](https://www.ipa.go.jp/security/bec/about.html) | BECは人と業務手順を狙い、多層防御が必要：social-engineering-bec-phishing | **partial**。個々の決裁手順の効果は未実測 |
| [CISA #StopRansomware Guide Part 2](https://www.cisa.gov/stopransomware/ransomware-guide) | 被害範囲確認、隔離、証拠保全、復旧の検討：malware-ransomware | **partial**。架空ケースは妥当な教材例だが、現場での封じ込め順序は状況次第 |
| [MITRE ATT&CK T1110.003 Password Spraying](https://attack.mitre.org/techniques/T1110/003/) | 少数候補を複数IDへ試すパターン：credential-session-attacks | **partial**。ログ形状だけで特定攻撃と断定していない点は妥当 |
| [NIST SP 800-63A-4（2025）、Identity Proofing Overview](https://pages.nist.gov/800-63-4/sp800-63a.html) | 本人確認は単なる「実在」だけではなく、主張される本人と申請者の結び付きを検証する：identity-proofing-authn-authz | **partial**。本文8番「本人確認は実在性を確かめます」は範囲が狭く誤学習の余地 |

**重要な出典欠落**：cloud-shared-responsibilityのMarkdown/JSON/Learnに掲げる「CISA Cloud Security Technical Reference Architecture v2」のリンクはCISAの広域案内ページで、TRA v2の文書・節への直達出典になっていない。B/Aに真正な文書URLと節を示すか、根拠を限定するよう引渡し。既存出典の全リンク、SAML全プロファイル、SPF RFC 7208/DKIM RFC 6376の全仕様項目、サービスごとの契約は本Cではnot_verified。

### 8.2 既存改稿8章：内容・責任・否定・ケースの独立判定

| Lesson ID | 現行mainで確認した強み | **改善必須の箇所と条件** | 内容 / source / quiz |
|---|---|---|---|
| security-risk-assessment | Learnに架空の申請サービスと内部集計、点数が同じときの判断・再評価・MFA有効性確認あり | Markdown/JSONは58短文の概念列挙。ケースの観測事実→評価範囲→基準→代替案→再評価トリガーが追える同等の原稿へA/B調整。影響が異なるリスクの優先順位を唯一解にしない | **NEEDS_REVISION / partial / quiz_reviewed** |
| security-sessions-federation-oauth-oidc-saml | OAuth認可とOIDC認証、Access/ID Token、RPセッション独立、SAML検証の位置付けをLearnで区別 | Markdownの「SSOは一度の認証を共有」は単一セッション共有と誤読余地。SSOは再認証を減らす利用経験と限定する。OIDCの検証条件（issuer/audience/expiry、状況によりnonce/署名）とLogout連携条件を架空のIdP/RP表で補う。「第三者」だけがOAuthの唯一の利用形態とはしない | **NEEDS_REVISION / partial / quiz_reviewed** |
| security-cloud-shared-responsibility-iam-config | SaaSの外部共有、IaaS設定・IaC drift・ログと復元の反例をLearnへ導入 | CISA TRA v2の出典リンクが目的資料の節を指さない。具体的製品・契約で責任範囲を検証できる表（IAM/OS/暗号鍵/復旧/ログ等）と証拠不足時のHOLD判断を追加 | **NEEDS_REVISION / partial / quiz_reviewed** |
| security-email-spf-dkim-dmarc | **旧P0逆意味見出しは現行HTMLで「認証済みでも安全とは限らない」に修正済み**。DMARC alignment、受信側判断、BECの限界が説明されている | SPFのRFC5321.MailFrom/HELO、DKIMのd=、RFC5322.Fromの違いを一つの架空ヘッダで示す。受信側ローカルポリシーを加味する。問1「Fromが正しい」は曖昧なのでalignmentに限定 | **NEEDS_REVISION / partial / quiz_reviewed** |
| security-social-engineering-bec-phishing | 既知の別経路確認、処理保留、報告・承認の記録、教育だけに頼らない点がLearnで具体化 | 正規口座変更依頼が本物だった場合の適切な再開条件と決裁証拠を問題の採点へ追加。クリック率以外の業務防御指標を具体化 | **NEEDS_REVISION / partial / quiz_reviewed** |
| security-malware-ransomware | 暗号化の未確認時に観測を突合して封じ込めを判断、復元試験とログを区別 | JSON summaryとHTML導入にある「ランサムウェアを侵害の最終段階として見る」は**必ず最終段階という読みを誘う**。本文の「後半の場合がある」と整合する条件付き説明へ改稿。復旧試験の条件・依存先の可否をケースへ固定 | **NEEDS_REVISION / partial / quiz_reviewed** |
| security-credential-session-attacks | Password sprayingと他サイト漏えい再利用の対比、セッション侵害、失効と復旧経路点検がLearnにある | ログ分布だけで原因を一意に特定しない条件を採点に追加。パスワード変更で失効する/しないの差はサービス固有として試験証拠で判断 | **NEEDS_REVISION / partial / quiz_reviewed** |
| security-identity-proofing-authn-authz | ID登録、認証、対象ごとの認可、部署異動後の越権をLearnで区別 | Markdown/JSON本文8「本人確認は実在性を確かめます」はNIST上の本人と証拠の**結び付き確認**まで含む説明へ。認証は登録した認証器の制御確認であり、誰が目の前にいるかの確証と同一視しない。サーバ側の拒否試験を採点基準化 | **NEEDS_REVISION / partial / quiz_reviewed** |

**P0再判定**：この8章の確認範囲では、前Waveで修正済みのメール逆意味見出しに相当する**現在残存する逆意味のP0は未検出**。P1の曖昧さ・深度不足があるため、8章全体をPASSとはしない。他の22章・新しいA/B headについてP0不存在を保証しない。HTML講義の架空ケースは概ね「架空」と記載、Markdown/RSVPに同等の長いケースがないことは**仕様上の逐語不一致でなく深度不足**と判定する。

### 8.3 理解確認20問：別解・典型誤答・採点の独立レビュー

出典：docs/SECURITY_LEARN_PILOT_2026-10-08.md の「理解確認問題案」（12問）と「横展開4章の理解確認問題案」（8問）。以下の「合格条件」は**提案する採点ルーブリック**であり、Bの原稿・UIへ反映済みとは主張しない。各問とも **quiz_reviewed**、**user_learning_not_verified**。

| 問題・能力 | 正答の核、成立する別解・採点条件 | 典型誤答の評価・改善点 |
|---|---|---|
| Risk Q1 比較 | 同じ中リスクでも対象、期間、影響、代替手段と不確実性を照合できれば可。どちらを優先するかは追加条件次第 | 同点だから同優先は不可。採点は順位ではなく判断要素を評価 |
| Risk Q2 対策有効性 | MFA台帳に加え適用範囲・例外・設定と実測を確認。設定検査か模擬アカウント試験も妥当 | 導入登録＝有効と即断は不可。試験対象の範囲を明記 |
| Risk Q3 再評価 | 委託先追加でデータ/権限/露出/契約/依存が変わるか再確認。**変更なしを裏付ける差分評価**も可 | 「事故なしだから不要」は不可。「必ずリスク増大」も単純化 |
| Session Q1 Token用途 | Access Tokenだけを本人認証の証拠にできず、OIDC認証情報を適切に検証することを述べる | 「全Tokenは同等」が不可。トークンの種類・宛先・検証を区別 |
| Session Q2 SSO/連携 | SSOは利用者経験、Federationは信頼領域間の技術・契約。**併用は可能**との別解を認める | 「どちらも一度だけのログイン」が不十分。重なりを否定し過ぎない |
| Session Q3 停止後操作 | RPのセッション、Tokenの有効期限・失効、連携/ログを確認。**失効済みと実測した場合**は別原因の調査も可 | IdP停止で全RPが即失効とは断定しない |
| Cloud Q1 SaaS責任 | IAM、共有、保持、外部連携を例示し、提供者/契約による差を留保 | SaaS事業者がすべて管理は不可。サービス名不明で責任断定しない |
| Cloud Q2 暗号化/共有 | 正当に復号される利用者の共有権限不備が残ることを説明。鍵不正利用の可能性も可 | 暗号化すれば外部公開も安全、は不可 |
| Cloud Q3 IaCドリフト | 実環境の設定・変更履歴・承認例外とコードを突合。**意図的な差分**も評価対象 | コード承認だけで実環境と一致は不可 |
| Mail Q1 SPF/DKIM | SPFまたはDKIMの成功に**Fromドメインとのalignment**が必要と説明。両方成功でも不整合になり得る | 「Fromが正しい」の語は曖昧。**RFC5322.Fromとalignmentに設問を修正** |
| Mail Q2 DMARC移行 | 正規の送信経路、転送・署名、受信側処理、レポートの観測が必要 | いきなりrejectで害なしは不可。**受信側が常に同じ処理をするとは限らない** |
| Mail Q3 支払先変更 | DMARC passでも依頼内容の正当性は未確定。既知の別経路と承認手順で確認 | 認証＝取引承認は不可。業務判断とドメイン検査を区別 |
| BEC Q1 口座変更 | 保留→既知の別経路照会→承認・決裁記録。**独立確認後なら正当依頼として再開可能** | 差出人・過去の文脈が自然だから即実行は不可 |
| BEC Q2 模擬訓練 | クリック率以外に保留・報告・承認記録・侵害調査を確認。異なる指標を具体的に挙げれば可 | 教育だけで完成は不可。訓練参加者/ケースの母数も考慮 |
| Ransom Q1 暗号化未確認 | 正常作業の別解を残しつつログと端末を突合、状況に応じ封じ込め・証拠保全 | 暗号化まで無条件放置は不可。**隔離実施を唯一解にしない** |
| Ransom Q2 復旧可能性 | バックアップ成功に加えて隔離復元・整合・RTO/依存先/再侵害防止を確認 | 成功ログだけでは不可。RTOは業務要件に依存 |
| Credential Q1 パスワード変更後 | 既存セッション、API Token、端末、MFA/回復登録とログを調べる | 変更繰返しで必ず解決は不可。**サービスにより変更時に全Session失効する可能性も許容** |
| Credential Q2 多数IDへの少数候補 | Password sprayingを候補に挙げ、ログ分布・通常試行との比較を述べる | 単一ID総当たりと即断は不可。**候補であって確定攻撃とはしない** |
| Identity Q1 強い認証でも別人登録 | 登録時の本人確認、証拠の検証、回復経路を確認。**不正登録の他に権限付与の取り違え**も検討可 | ログイン時MFAだけ強めれば解消、は不可 |
| Identity Q2 異動後の旧部署閲覧 | 所属更新、サーバ側の対象ごとの認可、模擬拒否試験・ログを確認 | UI非表示だけでは不可。**猶予期間の承認済み権限が存在する場合は別途判定** |

**採点の共通条件**：①条件と証拠を少なくとも一つ示す、②管理策が防げない対象を区別する、③模範解答と異なるが安全で根拠ある対応は許容、④断定不能な点は未確定と記載、⑤危険な実システムでなく架空・許可されたテストに限定する。改善優先は **Mail Q1、Risk Q3、Session Q2、Ransom Q1、Credential Q2、Identity Q1**。Bは20問の問い自体と採点用資料を修正し、CはBの**新head SHA**で再審査する。

### 8.4 Course I〜IV 30章の残課題と再判定の確実性

**8章**は本節で現行Markdown/JSON/Learnを再読し、前節8.2に個別所見を更新した。**他の22章**は第1・第2巡の記録を継承するものであり、このCで全形式・全行をfresh通読していない。したがって「全30章を新たにPASS判定」ではない。以下の「継続」は**過去のNEEDS_REVISIONを解消する新たな証拠なし**の意味。A/Bの新改稿がmergeされれば独立のhead読み直しが必須。

| Course | Lesson ID | 今回の状態 | 主な次の受入証拠 |
|---|---|---|---|
| I | security-purpose-principles | 継続 NEEDS_REVISION | CIA等の衝突ケースと判断根拠 |
| I | security-assets-dependencies | 継続 NEEDS_REVISION | 資産依存・信頼境界の模擬フロー |
| I | security-threats-vulnerabilities | 継続 NEEDS_REVISION | 同弱点でも露出条件で優先度が変化 |
| I | security-risk-assessment | **再読 NEEDS_REVISION** | 評価基準・架空の全工程をMD/JSONに同期 |
| I | security-risk-treatment | 継続 NEEDS_REVISION | 費用・承認者・残存リスクの比較 |
| I | security-threat-modeling | 継続 NEEDS_REVISION（A候補） | 脅威→対策→証拠を1フローで再現 |
| I | security-defense-in-depth | 継続 NEEDS_REVISION | 共通原因故障と有効性テスト |
| II | security-adversaries-initial-access | 継続 NEEDS_REVISION | 入口ごとの観測と反証 |
| II | security-social-engineering-bec-phishing | **再読 NEEDS_REVISION** | BEC業務承認の分岐と採点 |
| II | security-malware-ransomware | **再読 NEEDS_REVISION** | 侵害段階の限定表現・復旧条件 |
| II | security-credential-session-attacks | **再読 NEEDS_REVISION** | Session失効を実証するケース |
| II | security-post-compromise-movement | 継続 NEEDS_REVISION | 模擬ログで権限と横展開を比較 |
| II | security-c2-exfiltration-stealth | 継続 NEEDS_REVISION | 正常通信との対比・偽陽性 |
| II | security-mitre-attack-scenarios | 継続 NEEDS_REVISION（A候補） | 手法・観測点・防御を連結 |
| III | security-identity-proofing-authn-authz | **再読 NEEDS_REVISION** | 本人確認の定義精密化と権限拒否試験 |
| III | security-password-mfa-phishing-resistant | 継続 NEEDS_REVISION（A候補） | OTP/Passkey/回復・失敗条件 |
| III | security-sessions-federation-oauth-oidc-saml | **再読 NEEDS_REVISION** | Audience、Session、SSOの境界をケース化 |
| III | security-rbac-abac-privileged-access | 継続 NEEDS_REVISION | 異動・ABAC遅延・非常権限 |
| III | security-symmetric-public-key-hash-mac | 継続 NEEDS_REVISION | Hash/MAC/署名の保証の対比 |
| III | security-signatures-pki-certificates | 継続 NEEDS_REVISION | 期限・検証・鍵流出の区別 |
| III | security-key-secret-credential-lifecycle | 継続 NEEDS_REVISION | 流出後の失効・依存先・順序 |
| III | security-data-classification-encryption-retention | 継続 NEEDS_REVISION | 廃棄・バックアップ・保存義務 |
| IV | security-communication-path-boundaries | 継続 NEEDS_REVISION | TLS終端/経路の信頼境界 |
| IV | security-dns-tls-https | 継続 NEEDS_REVISION | 名前検証と終端後区間 |
| IV | security-firewall-proxy-waf-ids-ips | 継続 NEEDS_REVISION（A候補） | WAFを通る権限外操作の拒否証拠 |
| IV | security-segmentation-vpn-zero-trust | 継続 NEEDS_REVISION | VPN侵害後の権限・端末状態 |
| IV | security-email-spf-dkim-dmarc | **再読 NEEDS_REVISION** | 3ドメインの検証・ヘッダ模擬例 |
| IV | security-endpoint-hardening-edr-mdm | 継続 NEEDS_REVISION | 管理外端末の証拠と限界 |
| IV | security-cloud-shared-responsibility-iam-config | **再読 NEEDS_REVISION** | サービス個別契約/設定/検証表 |
| IV | security-container-serverless-saas-iot | 継続 NEEDS_REVISION | 4方式の責任分界・検知・更新 |

**優先4章の推奨**：security-threat-modeling → security-mitre-attack-scenarios → security-password-mfa-phishing-resistant → security-firewall-proxy-waf-ids-ips。Aが現行の依存関係や重要度により選び直してよい。これらを仕上げたあと、security-assets-dependencies、security-risk-treatment等の未改稿章に進む。**優先4章は本C作成時点で新head未取得・独立再審査NOT_VERIFIED**。

### 8.5 引継ぎ・検証・変更しない範囲

| 優先・担当 | Lesson / 問題 | 問題の根拠と修正指針 | 再審査の受入条件 |
|---|---|---|---|
| P1 B→C→E | Email Mail Q1 | RFC 9989とのalignmentと「Fromが正しい」の語の曖昧さ | 問いをドメイン整合に絞り、別解・評価条件を明示 |
| P1 A/B→C | Identity 本文8とLearn | SP800-63A-4の実在性・検証・本人との結び付き | MD/JSONの意味を同期、Learnも本文と整合 |
| P1 A/B→C | Ransom summary/導入 | 常に「侵害の最終段階」と一般化しない | 段階が異なる反例とケース条件を追加 |
| P1 B→C | Cloud責任分界 | CISA TRA v2が直接資料リンクでない | 正しい文書/節・製品条件・契約上の留保を記録 |
| P1 B→C | Session Q2・Risk Q3ほか | 条件付きの別解と採点の曖昧さ | 20問すべての受入基準を問題文と併記 |
| P1 A/B→C→E | 新優先4章 | 現在のA/B新head未取得 | それぞれのhead SHAでMD/JSON/Learn/原典・問題を読み直し |
| 別所管 D/E | production/Android/実音声 | CI、静的検査、Vercel READYだけでは判定不可 | 実操作・実端末の試験IDと証拠 |

**このC時点の総合内容評価：PARTIAL_WITH_GAPS**。8章の主張について確認した節は限定的で、各章に深度と採点課題が残る（8/8 NEEDS_REVISION）。20問の問題案は**20/20 quiz_reviewed / 学習者実測0件（user_learning_not_verified）**。残り22章は過去の30/30 NEEDS_REVISIONから独立PASSへ昇格する新証拠なし（継続扱い）。**重大な逆意味P0は確認した8章で未検出**。原典未確認の断定やAndroid実機PASSは作らない。

ローカル npm run check：**NOT_RUN**（GitHub connectorによる読取・文書監査のみ）。このC PRでのGitHub Actions Test：**PR作成後に実際のrun IDと結論を追記するまでNOT_VERIFIED**。mainの過去CIとは分ける。Learn HTML、RSVP、Catalog、Course順序、個人学習履歴、private公開設定、本番deploymentは本Cでは変更しない。


#### 8.6 後続のproduction API fresh確認（同日・監査保存後）

本節8冒頭の「このCではVercel APIを新規操作していない」は**監査文書初回作成時の状態**。その後同日にVercel連携APIで同一project `prj_7yYGl5D3Q7UwQgQuXaGmOYLkTzbu` のproduction deployment一覧をfresh取得し、最新表示は `dpl_CYHqCXPTCoEqH3r9QDK66XLiy5fN`、`target=production`、`state=READY`、`meta.githubCommitSha=fd003b63b816799dd8f1f1eac0de4fd70db32da9` と確認した。inspector: https://vercel.com/josh-temples-projects/rsvp-learning/CYHqCXPTCoEqH3r9QDK66XLiy5fN 。前Waveの `0a168c…` はその時点の旧配信ソースにすぎない。**ドメインaliasの現割当て、アクセス保護、ページ取得・表示、再生、実音声、Android実機について本Cは確認していない（NOT_VERIFIED）**。D/Eの実利用ゲートを代替しない。
