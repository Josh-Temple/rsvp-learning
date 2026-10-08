# 情報セキュリティ本格学習カリキュラム

Status: ACTIVE IMPLEMENTATION  
Created: 2026-10-08  
Base main: `919bfba37e5e51bf4c1736bcf2b28e875b31714a`

## 目的

現在の情報セキュリティCourseは、広く浅く体系を理解するための8章構成です。

本計画では、これを置き換える前提ではなく、より深く学べる本格学習系列を追加します。既存Courseは移行が完了するまで維持し、完成していない教材を既存利用体験へ混ぜません。

目標は用語暗記ではありません。システムや業務を見たときに、次の流れで判断できることを目指します。

1. 守る対象と依存関係を把握する
2. 脅威・脆弱性・攻撃経路を考える
3. リスクを評価する
4. 設計・実装・運用の対策を選ぶ
5. 対策が実際に機能するか確かめる
6. 検知・対応・復旧へつなげる
7. 組織・委託先・法務・経営の判断へ接続する

## 基準

試験対策専用にはしません。ただし知識の漏れ検出にはIPAのシラバスを使います。

2026-10-08時点では、2027年度から予定される新試験制度の「情報処理安全確保支援士試験 シラバス案 Ver.0.1」が公開されています。本教材では旧SG範囲だけではなく、この新しい専門知識・技能の範囲を優先して参照します。

主な基準:

- IPA 情報処理安全確保支援士試験 シラバス案 Ver.0.1
- NIST Cybersecurity Framework 2.0
- NIST SP 800-30 Rev.1
- NIST SP 800-61 Rev.3
- NIST SP 800-63 series
- NIST SP 800-207
- NIST SP 800-218
- CIS Critical Security Controls v8.1
- OWASP Top 10:2025
- OWASP API Security Top 10
- OWASP Threat Modeling
- 必要に応じてIPA、JPCERT/CC、NCO、個人情報保護委員会等の国内一次資料

特定製品の設定値、法令要件、暗号方式の推奨、脅威動向など現在性の高い内容は、教材更新時に一次資料をfresh確認します。

## 既存資産の扱い

Draft PR #6 `content/security-course-v0.1` には、16章構成の詳細原稿、IPA SGカバレッジ、レビュー記録、RSVP JSONがあります。

これは現在のmainより古く、そのままmergeしません。ただし次の内容は再利用候補として扱います。

- 認証・アクセス制御
- PKI・証明書
- ネットワーク・メール防御
- アプリケーション・DBセキュリティ
- 端末・クラウド・物理対策
- 脆弱性管理
- ISMS・ガバナンス
- インシデント・フォレンジックス
- 事業継続
- 法務・プライバシー
- 監査・内部統制

再利用時は現在のmain仕様へ合わせ、出典と現在性を再確認し、Markdown / RSVP JSON / Learn HTMLを新たに同期します。

## 最終構成

本格学習系列は、Libraryの見通しとLesson単位の習熟度を保つため、一つの60章Courseにはしません。

8つのCourseへ分け、合計60 Lessonを目標とします。

### Course I — 基礎・リスク・脅威（7）

1. セキュリティの目的と基本原則
2. 情報資産・依存関係・信頼境界
3. 脅威・脆弱性・露出・攻撃対象領域
4. リスクアセスメント
5. リスク対応・残存リスク・例外管理
6. 脅威モデリング
7. 多層防御と管理策の有効性確認

### Course II — 脅威主体・攻撃の流れ（7）

1. 攻撃者・動機・初期アクセス
2. ソーシャルエンジニアリング・BEC・フィッシング
3. マルウェア・ランサムウェア
4. 資格情報・セッションを狙う攻撃
5. 偵察・権限昇格・永続化・横展開
6. C2・持ち出し・痕跡
7. MITRE ATT&CKと攻撃シナリオ

### Course III — Identity・暗号・データ保護（8）

1. 識別・本人確認・認証・認可
2. パスワード・MFA・フィッシング耐性
3. セッション・SSO・OAuth/OIDC・SAML
4. RBAC・ABAC・最小権限・特権管理
5. 共通鍵・公開鍵・ハッシュ・MAC
6. デジタル署名・PKI・証明書
7. 鍵・Secret・Credentialのライフサイクル
8. データ分類・暗号化・保持・廃棄

### Course IV — Network・Endpoint・Cloud（8）

1. 通信経路とセキュリティ境界
2. DNS・TLS・HTTPS
3. Firewall・Proxy・WAF・IDS/IPS
4. セグメンテーション・VPN・Zero Trust
5. メール・SPF・DKIM・DMARC
6. Endpoint hardening・EDR・MDM
7. Cloud責任分界・IAM・設定
8. Container・Serverless・SaaS・IoT

### Course V — AppSec・API・Software Supply Chain（9）

1. Secure by Design / Secure by Default
2. 入力・出力・Injection
3. XSS・CSRF・ブラウザ境界
4. Broken Access Control
5. 認証・Session・例外処理
6. API Security
7. Secure SDLC・SSDF・Threat Modeling
8. SAST・DAST・SCA・Security Testing
9. Dependency・Build・CI/CD・SBOM

### Course VI — Vulnerability・Detection・Incident・Resilience（8）

1. Asset inventoryとAttack Surface Management
2. CVE・CVSS・EPSS・KEVと優先順位
3. Patch・Configuration・Remediation
4. Logging・Telemetry・SIEM
5. Detection EngineeringとAlert triage
6. Incident Response
7. Digital Forensicsと証拠保全
8. Backup・DR・RTO/RPO・演習

### Course VII — Governance・Privacy・Audit・Supply Chain（7）

1. Security Policy・標準・手順
2. ISMS・NIST CSF・CIS Controls
3. 組織・役割・CSIRT・SOC
4. Human Factors・内部不正・教育
5. Supplier・委託・調達・Software Supply Chain
6. Privacy・個人情報・法令の読み方
7. Audit・内部統制・Metrics・Assurance

### Course VIII — AI Security・統合ケース（6）

1. AIを悪用した攻撃と防御
2. Prompt Injection・Jailbreak・外部コンテンツ
3. RAG・Data・Model・Privacy
4. Tool Calling・Agent権限・Human Oversight
5. AI Supply Chain・Evaluation・Monitoring
6. 行政申請サービスの統合セキュリティケース

合計: 60 Lesson

## Lessonの品質基準

本格学習系列では、既存の `COMPLETE v0.1` 構造条件に加えて、次を満たすことを目標にします。

- 学習目標が判断可能な動詞で書かれている
- 定義だけでなく、仕組みと因果関係を説明する
- 似た概念を区別する
- 具体例またはケースを含む
- 典型的な失敗条件・誤解・限界を含む
- 他章との接続を示す
- 現在性がある主張は一次資料へ対応させる
- 「対策がある」ではなく、有効性の確認方法まで扱う
- 攻撃手法は防御・検知・設計判断を理解するために扱う
- 危険な実環境への侵入手順集にはしない

## 学習形式

同じ知識範囲を複数形式へ展開します。

- RSVP: 概念の反復と高速復習
- Learn: 因果・対比・具体例を音声で追う
- 理解確認: 後続Waveで選択式・短答式を追加
- ケース: 複数章の知識を一つの意思決定へ統合
- 安全な演習: ローカルまたは教育用環境を前提に追加

## 実装順序

1. Course Iを完成させ、教材粒度と深さの基準を確定する
2. Course II〜IIIで攻撃・Identity・暗号の中核を固める
3. Course IV〜VでNetwork / Cloud / AppSecへ進む
4. Course VI〜VIIで運用・ガバナンスまで接続する
5. Course VIIIでAI Securityと統合ケースを作る
6. 全60 Lessonのcoverage / overlap / source / Learn監査を行う
7. 旧8章Courseを残すか、入口Courseとして再定義するか最終判断する

## 実装状況

- Course I — 基礎・リスク・脅威: COMPLETE / main反映済み
- Course II — 脅威主体・攻撃の流れ: COMPLETE / main反映済み
- Course III — Identity・暗号・データ保護: COMPLETE / 2026-10-08実装
- Course IV以降: 未実装

Course IIでは、MITRE ATT&CKの現行Enterprise tactics、IPAの2027年度向け情報処理安全確保支援士試験シラバス案、IPAのメール攻撃・BEC・ランサムウェア資料、CISAのランサムウェア・MFAガイダンスをfresh確認しました。

攻撃手法は実行手順としてではなく、防御・検知・封じ込め・復旧へ結び付ける知識として扱います。
