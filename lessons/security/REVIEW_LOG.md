# 情報セキュリティ教材 レビューログ

このファイルは、教材本文とは分離して、精度レビューで確認した内容と未解決事項を記録します。

教材本文の内容上の正本は各Markdownファイルです。

## 2026-09-27 — 第1回精度レビュー

対象: Draft v0.1 → Draft v0.2

### 確認した主要資料

- IPA「情報セキュリティ10大脅威 2026」
  - https://www.ipa.go.jp/security/10threats/10threats2026.html
- IPA「情報セキュリティ10大脅威2026」解説書［組織編］
  - https://www.ipa.go.jp/security/10threats/omgdg50000008fi8-att/kaisetsu_2026_soshiki.pdf
- NIST Cybersecurity Framework 2.0
  - https://www.nist.gov/cyberframework
- NIST SP 800-63B-4
  - https://csrc.nist.gov/pubs/sp/800/63/b/4/final
- NIST SP 800-207 Zero Trust Architecture
  - https://csrc.nist.gov/pubs/sp/800/207/final
- NIST SP 800-61 Rev. 3
  - https://csrc.nist.gov/pubs/sp/800/61/r3/final
- NIST FIPS 197
  - https://csrc.nist.gov/pubs/fips/197/final
- NIST CSRC Glossary, Digital Signature
  - https://csrc.nist.gov/glossary/term/digital_signature
- CISA Implementing Phishing-Resistant MFA
  - https://www.cisa.gov/sites/default/files/2023-01/fact-sheet-implementing-phishing-resistant-mfa-508c.pdf
- OWASP Top 10:2025
  - https://top10.owasp.org/2025/

### 修正した点

1. CIAは情報セキュリティの代表的な三要素であり、すべてではないことを明記した。
2. リスクの説明へ発生可能性と影響の両方を入れた。
3. NIST CSF 2.0の六機能は時系列の六段階ではなく、同時並行・継続的に扱う機能であることを明記した。
4. NIST SP 800-63B-4の現行パスワード要件を、適用範囲を限定したうえで教材へ反映した。
5. MFAは方式によってフィッシング耐性が異なることを明記した。
6. SQLインジェクションの対策例が他のインジェクション全般にそのまま適用されるように読める表現を修正した。
7. DDoSを単に「多数の機器」と定義せず、分散した送信元からの攻撃として説明した。
8. 暗号学的ハッシュとデジタル署名の役割を区別した。
9. デジタル署名を単純に「データの作成者確認」とせず、出所の真正性、完全性、公開鍵の信頼まで説明した。
10. ゼロトラストを、ネットワーク位置や所有関係だけに基づく暗黙の信頼を与えない原則として説明した。
11. NIST SP 800-61 Rev. 3に合わせ、インシデント対応を単純な一本道の手順として扱わないよう補足した。
12. IPA 2026の組織向け順位と、順位が危険度や各組織の対策優先順位そのものではない点を明確にした。
13. IPA 2026のAI関連記述を、情報漏えい、生成結果の未検証、攻撃の容易化・巧妙化、AIシステムの脆弱性という観点に整理した。
14. 個人向け10大脅威は順位ではなく五十音順であることを明記した。

### 第2回レビュー候補

以下は重要そうだが、今回のレビューでは追加を確定していない。

- セキュリティとプライバシーの違い
- データ分類と取扱区分
- ソーシャルエンジニアリングをフィッシング以外まで広げるか
- パスキーとフィッシング耐性認証を独立した節にするか
- クラウドの責任分界
- エンドポイント防御
- 脆弱性管理の優先順位付け
- セキュア開発ライフサイクル
- メール、DNSなど基盤サービスのセキュリティ
- バックアップでRPO・RTOまで扱うか
- AIセキュリティを年次動向だけでなく独立章へ分離するか

これらは、教材の射程と総量を見て次回以降に判断する。

### RSVP化について

Draft v0.2の段階では、まだRSVP用JSONへ変換しない。

少なくとももう一度、章構成と重要概念の抜けをレビューしてからチャンク化する。


## 2026-09-27 — 第2回構成レビュー

対象: Draft v0.2 → Draft v0.3

### 目的

教材が情報セキュリティを包括的に理解するための構成になっているかを確認した。

試験合格を目的とはせず、IPA「情報セキュリティマネジメント試験 シラバス Ver.4.1」を知識の漏れ検出用チェックリストとして利用した。

### 確認した正本

- IPA「試験要綱・シラバスについて」
  - https://www.ipa.go.jp/shiken/syllabus/gaiyou.html
- IPA「情報セキュリティマネジメント試験 シラバス Ver.4.1」
  - https://www.ipa.go.jp/shiken/syllabus/nl10bi0000007tch-att/syllabus_sg_ver4_1.pdf
- IPA「新試験制度のシラバス案について」
  - https://www.ipa.go.jp/shiken/syllabus/henkou/2026/20260630.html

2026-09-27時点ではSG Ver.4.1が現行シラバスである。

2027年度から予定される新制度のSGシラバス案は、IPAの公開ページ上ではまだ準備中である。

### 結果

現在の7章は、次の骨格を既に持っている。

- セキュリティ基本概念
- 代表的な攻撃
- 認証とアクセス制御
- 暗号
- ネットワーク防御
- ログ、バックアップ、インシデント対応
- 年次脅威動向

一方、包括的理解には次の空白が大きい。

- PKIと証明書
- ネットワーク基礎
- 情報資産分類
- リスクアセスメントとリスク対応
- ISMSと情報セキュリティポリシー
- CVSS、脆弱性診断、ペネトレーションテスト
- EDR、DLP、SIEM、WAF、IDS/IPS、MDMなどの技術対策
- 物理的セキュリティ
- メール認証
- データベースとセキュア開発
- クラウド責任共有モデル
- デジタルフォレンジックス
- 事業継続、RTO、RPO
- 法律、プライバシー、コンプライアンス
- セキュリティ監査と内部統制

### 構成上の判断

SGシラバス全体をそのまま教材へ移すことはしない。

SGには一般的なプロジェクトマネジメント、システム企画、サービスマネジメントなども含まれるためである。

これらは、情報セキュリティに直接関係する部分だけを教材へ取り込む。

具体的には、セキュリティ要件、調達、供給者管理、変更管理、インシデント管理、サービス継続などを扱う。

### 作成した文書

- `IPA_SG_COVERAGE.md`
  - SG Ver.4.1との対応状況を「収録済み・一部収録・未収録・周辺分野」で管理する。
- `CURRICULUM.md`
  - 今後の16章構成を管理する。

### RSVP化について

まだRSVP用JSONへ変換しない。

不足領域の基礎原稿を追加し、少なくとももう一度横断的な精度レビューを行ってからチャンク化する。


## 2026-09-27 — 第3回カバレッジ拡張

対象: Draft v0.3 → Draft v0.4

### 目的

第2回構成レビューで特定した主要な未収録領域へ、通常文でレビュー可能なMarkdown原稿を追加した。

### 追加した原稿

- `network-internet-basics.md`
- `pki-certificates.md`
- `network-mail-defense.md`
- `application-database-security.md`
- `endpoint-cloud-physical-security.md`
- `vulnerability-management.md`
- `risk-management.md`
- `isms-governance.md`
- `incident-monitoring-forensics.md`
- `business-continuity-resilience.md`
- `law-privacy-compliance.md`
- `audit-internal-control.md`

### 今回の重要な精度上の判断

1. CVSS v4.0のBase Scoreは脆弱性の深刻度を表すもので、組織固有のリスク点数とは扱わない。
2. 脆弱性管理ではCVSSだけでなく、悪用実績、資産重要度、露出、緩和策などを組み合わせて優先順位を判断する。
3. DMARCは2026年5月公開のRFC 9989を現行仕様として扱い、RFC 7489を現行仕様として記載しない。
4. SPF、DKIM、DMARC、S/MIMEは役割を分けて説明する。
5. クラウドへ移行しても、組織のセキュリティ・プライバシー上の説明責任が消えるとは扱わない。
6. NIST SP 800-61 Rev. 3に合わせ、インシデント対応を日常のサイバーセキュリティリスク管理へ統合して説明する。
7. NIST SP 800-86は2006年の文書であり、ITインシデント対応へフォレンジック技術を統合する基礎資料として限定的に利用する。法的助言として扱わない。
8. RTOとRPOを明確に区別する。RTOは復旧までの時間目標、RPOは復旧するデータ時点の目標として説明する。
9. ISMSを認証取得そのものと同一視せず、組織がリスクに応じて継続的に情報セキュリティを管理する仕組みとして説明する。
10. 監査を「監査済みなら安全」という保証として扱わず、基準・証拠・独立性・改善という基本構造を説明する。

### 現在の残課題

主要領域には一通り原稿が存在するが、以下はまだ一部収録である。

- BEC、標的型攻撃、MITM、DNS攻撃、認証攻撃
- マルウェアの主要分類
- AI固有の攻撃と防御
- MAC、RSA、ハイブリッド暗号、暗号危殆化
- SSO、リスクベース認証、生体認証の評価指標
- NISC、JPCERT/CC、JVN、ISMAP等
- SSH、IPsec
- 一部のネットワーク防御
- メモリ安全性
- 営業秘密などの法務補足
- 標準・規格体系

### 次のレビュー

次は新規章の追加より、上記の残課題を既存章へ統合する。

同時に、全原稿を横断して以下を確認する。

- 同じ用語の定義が一致しているか
- 同じ内容を不必要に重複していないか
- 初学者向けの学習順序になっているか
- 個別製品名や一時的な流行へ寄り過ぎていないか
- 公式資料との整合が保たれているか
- RSVPで意味単位へ分割しやすい文章になっているか

この段階でも、まだRSVP用JSONへ変換しない。


## 2026-09-27 — 第4回残差統合

対象: Draft v0.4 → Draft v0.5

### 目的

第3回拡張後に `IPA_SG_COVERAGE.md` で一部収録となっていた主要概念を、新しい章を増やさず既存章へ統合した。

### 主な追加

- BEC、標的型攻撃
- ワーム、ボット、RAT、キーロガー
- Credential Stuffing、Password Spraying
- On-Path / MITM、DNS攻撃、ゼロデイ
- 生体認証の偽一致・偽非一致
- SSOと認証連携
- 状況ベースの追加認証
- パスキー、同期型認証器、リプレイ耐性
- ハイブリッド暗号、RSA、MAC/HMAC
- 暗号危殆化、Crypto Agility、CRYPTREC
- VLAN、ハニーポット、SSH、IPsec
- JVN、JVN iPedia、脆弱性情報の調整
- NCO、IPA、JPCERT/CC、ISMAP
- メモリ安全性、バッファオーバーフロー
- 営業秘密と秘密管理
- 生成AIアプリケーションのセキュリティ

### 現在性に関する修正

OWASP GenAI LLM Top 10は、2026年8月公開版が最新であることを確認した。

AIセキュリティ原稿の参照を2025版から2026版へ更新した。

NIST AI 100-2e2025を、敵対的機械学習の攻撃分類の主要資料として利用した。

NIST AI 600-1は生成AI固有・増幅リスクをリスク管理へ組み込む補助資料として利用した。

### カバレッジ上の判断

暗号、認証、生体認証、日本の主要制度、セキュアプロトコル、ネットワーク防御、アプリケーションセキュリティ、法務・標準の基礎は「収録済み」へ更新した。

脅威・マルウェア・AI固有リスク・人的対策は、分野が広く変化も速いため「一部収録」を維持した。

すべての語彙を列挙することを完成条件にはしない。

### 次の工程

次は全原稿の横断レビューを行う。

新しい知識を増やすのではなく、重複、矛盾、学習順序、説明粒度、RSVP適性を中心に整理する。

RSVP用JSONへの変換は、横断レビュー後に判断する。


## 2026-09-27 — 第5回横断レビュー

対象: Draft v0.5 → Draft v0.6

### 対象

教材本文19ファイルを横断して確認した。

管理文書は `README.md`、`CURRICULUM.md`、`IPA_SG_COVERAGE.md` で別管理する。

### 重複確認

用語の出現だけではなく、文章単位の近似重複も確認した。

重複が集中していたのは、初期に作成した次の2原稿だった。

- `05-network-web-and-system-defense.md`
- `06-security-operations-and-governance.md`

後から詳細章を追加したため、ファイアウォール、ネットワーク分割、VPN、ゼロトラスト、ログ、バックアップ、インシデント対応などが二重に説明されていた。

### 修正

`05-network-web-and-system-defense.md` を「ネットワーク・Web・システム防御の全体像」へ再構成した。

個別技術の詳細は `network-mail-defense.md`、`application-database-security.md`、`endpoint-cloud-physical-security.md` に任せた。

`06-security-operations-and-governance.md` を「組織としてのセキュリティ運用の全体像」へ再構成した。

リスク、ISMS、監視・インシデント、事業継続の詳細は、それぞれの専門原稿に任せた。

再確認では、別ファイル間で高い類似度を持つ長文段落は検出されなかった。

### 学習順序

初期ファイル名の `01-` 〜 `07-` は作成当時の番号であり、現在の16章構成とは一致しない。

今後の学習順序は `CURRICULUM.md` の章番号を正本とする。

ファイル名はRSVP Lesson IDを確定する段階で必要に応じて整理する。

### 時点依存情報

「現在の脅威動向」は年次更新を前提とする。

一方、基礎章にも次のような版依存情報が存在する。

- NIST SP 800-63シリーズ
- DMARCのRFC
- CRYPTREC暗号リスト
- ISO/IEC 27001/27002
- NCOなど組織名称
- 法令・ガイドライン
- OWASP GenAI LLM Top 10

これらは基礎概念から切り離して確認日と出典を維持する。

### 現在の状態

主要領域の基礎原稿は一通り存在する。

IPA SGは引き続き漏れ検出に使うが、用語の完全列挙を目標にはしない。

次のレビューでは、教材の文章そのものをRSVPで理解しやすい形へ整える。

まだRSVP JSONは生成しない。


## 2026-09-27 — 第6回RSVP可読性レビュー

対象: Draft v0.6 → Draft v0.7

### 目的

各Chapterをランダム再生した場合でも、前のChapterへ戻らず主題を理解できるか確認した。

内容の追加より、文章とLesson境界を優先した。

### 長文

教材本文19ファイルを走査した。

長い一文として残っていたCSF 2.0、SQLインジェクション、SSDF、S/MIME、CSRF、法令説明などを短い文へ分割した。

修正後は、本文上の主要な長文は概ね解消した。

ファイル名を列挙する管理用の文章はRSVP本文へ入れないため対象外とした。

### 略語

ランダム再生では前章の定義を前提にできない。

そのため、Lesson内で初めて出る主要略語は短く定義する方針にした。

今回、主に次を補正した。

- VPN
- HTTP
- SMTP
- DNS
- TLS
- PKI
- CRL / OCSP
- S/MIME
- SSDF
- CSRF
- IoT
- CVE / CVSS
- WAF
- ISMS
- CSIRT / SOC

同じLesson内では、二回目以降の正式名称の繰り返しは避ける。

### Course / Chapter設計

アプリの現在の正本を再確認した。

`courses/index.json` の `chapters` はLesson IDの配列である。

したがって、情報セキュリティ教材は16概念章を16 Lessonとして実装する。

節単位で50〜70 Lessonへ細分化する案は採用しない。

理由は、Libraryの見通し、前後Chapter移動、ランダム再生、Lesson単位の習熟度との整合である。

詳細は `JSON_PLAN.md` に記録した。

### 共通フォーマット

`docs/LESSON_FORMAT.md` に次を追加した。

- 1 Lesson = 1 Chapter
- 文字数だけでChapterを細分化しない
- ランダム再生で単独開始しても理解できる導入を持つ
- 初出略語を短く説明する
- 前Lessonへの指示語依存を避ける
- JSON化前に原稿側の一文・列挙・版情報を確認する

### 次の工程

Chapter 1をJSON化し、RSVP変換のパイロットとする。

Schema、意味の保持、チャンク粒度、表示時間を確認した後、残り15 Lessonへ展開する。


## 2026-09-27 — Chapter 1 RSVP JSONパイロット

`01-security-fundamentals.md` から `security-fundamentals.json` を作成した。

Schema検証に必要な必須項目、数値範囲、chunk構造をreadback後に確認した。

結果はPASSだった。

165 chunkで、文字数中央値は7、90%点は10だった。

14文字を超えたのは `Cybersecurity Framework` のみである。

専門用語の固有名称を不自然に分割しないという既存ルールに従い、このchunkは維持した。

Courseと `lessons/index.json` への登録はまだ行っていない。

残り15 Lessonを作成する前の変換基準として利用する。

## 2026-09-27 — 16 Lesson JSON化完了・最終QA

対象: Draft v0.7 → Draft v0.8

### 実装状態

Chapter 1のパイロットを基準として、残り15 LessonもRSVP用JSONへ変換した。

情報セキュリティCourseは、16の概念章を16 Lessonとして `courses/index.json` へ登録した。

`lessons/index.json` にも16 Lessonを登録し、Courseから一意に参照できることを確認した。

### 最終readback

16個の `lessons/security/security-*.json` をfresh readし、次を確認した。

- JSON parse: 全16 Lesson PASS
- `schema_version=1`: PASS
- Lesson IDとファイルの対応: PASS
- Schema必須フィールド: PASS
- `base_duration_ms`: PASS
- `sources`: PASS
- chunkの `text` と `duration_multiplier`: PASS
- 空chunk: 0
- URL・MarkdownのRSVP本文への混入: 0
- 24文字超chunk: 0

chunk文字数の90%点は各Lessonで10〜11文字だった。

全Lesson中の最長chunkは23文字で、固有名称を不自然に分割しない方針の範囲内だった。

### 文節分割の個別修正

機械的な再分割は行わず、実際に意味を壊していた3箇所だけを修正した。

1. `Man-in-the-Middle / On-Path Attack`
   - ハイフンが単独chunkになっていたため、固有名称単位へ統合した。
2. `Cross-Site Request Forgery`
   - ハイフンが単独chunkになっていたため、英語複合語のまとまりを維持した。
3. 「技術的に深刻な脆弱性で / も」
   - 助詞「も」が単独chunkになっていたため、直前語へ統合した。

「の略です」が単独chunkになる箇所は複数残っている。意味は成立しており、機械的に変更せず、8倍前後の実表示で読みやすさを確認する対象とした。

### 抜き取り確認

情報密度の高いChapter 2・7・11・16を複数位置で目視した。

重大な文節崩れは確認されなかった。

Chapter 16では、IPA「情報セキュリティ10大脅威2026」の組織向け上位3項目が、名称を壊さずRSVP表示単位へ分割されていることを確認した。

### 最新mainとの統合

作業中にmain側で他分野の教材群と `information-security-overview` が追加されていたため、最新mainをfresh readして統合した。

main側の `information-security-overview` は `SEED / 概要のみ` で、本編を別途拡張する前提だった。

本編完成後は16 Lessonを情報セキュリティCourseの正規構成とし、旧overviewは初期SEEDとしてファイルのみ残す。LessonカタログとCourseからは外した。

作業branchは最新mainを土台に載せ直し、mainに対するbehindを0にした。

### アプリ統合確認

`app.js` とカタログ構造を確認した。

- Course全通し再生
- Chapter順のランダム再生
- 前後Chapter移動
- Lesson単位の習熟度保存

は16 Lesson構成と整合している。

これは静的なコード・データ確認であり、実ブラウザでの操作確認とは区別する。

### 残る確認

実ブラウザで次を確認する。

- 8倍前後のRSVP表示
- `ALL` で16 Lessonを順番に移動できること
- `RND` でChapter順だけがランダム化されること
- 前後Chapter移動
- 習熟度の表示・保存
- 略語周辺の短いchunkの体感上の読みやすさ

Vercelの現在のチェック失敗はbuild rate limitによるもので、教材コードのテスト失敗とは扱わない。

実表示確認と利用可能なCI確認が終わるまでPR #6はDraftのまま維持する。
