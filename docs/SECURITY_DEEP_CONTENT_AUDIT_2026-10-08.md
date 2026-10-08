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
