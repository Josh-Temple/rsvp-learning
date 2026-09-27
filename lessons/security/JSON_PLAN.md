# 情報セキュリティ Course / Lesson 変換計画

Status: Implemented / final JSON QA complete  
更新日: 2026-09-27

## 方針

情報セキュリティ教材は、現在の16章構成をそのまま16個のLessonへ変換します。

このアプリではCourseの `chapters` がLesson IDの配列なので、1 Lesson = 1 Chapterとして扱います。

細かな節ごとにLessonを分割すると、Libraryが長くなり、習熟度も細分化されすぎます。

一方、長い章を一つの表示チャンクにするわけではありません。

Lesson内部は `docs/LESSON_FORMAT.md` に従い、4〜14文字程度を中心とする短い意味単位へ分割します。

そのため、Chapterとしてはまとまりを保ちつつ、高速表示では小さな単位で読めます。

## Course

Course ID:

`information-security`

タイトル:

`情報セキュリティ`

## Lesson

| # | Lesson ID | タイトル | 原稿 |
|---|---|---|---|
| 1 | security-fundamentals | 情報セキュリティの基本 | 01-security-fundamentals.md |
| 2 | security-threats-attacks | 脅威と攻撃 | 03-attacks-and-vulnerabilities.md |
| 3 | security-authentication-access | 認証とアクセス制御 | 02-authentication-and-access-control.md |
| 4 | security-cryptography-pki | 暗号・ハッシュ・PKI | 04-cryptography-and-data-protection.md + pki-certificates.md |
| 5 | security-network-basics | ネットワークとインターネットの基礎 | network-internet-basics.md |
| 6 | security-network-defense | ネットワーク・メール・Webの防御 | 05-network-web-and-system-defense.md + network-mail-defense.md |
| 7 | security-application-database-ai | アプリ・DB・生成AIのセキュリティ | application-database-security.md |
| 8 | security-endpoint-cloud-physical | 端末・クラウド・IoT・物理対策 | endpoint-cloud-physical-security.md |
| 9 | security-vulnerability-management | 脆弱性管理とセキュリティ評価 | vulnerability-management.md |
| 10 | security-risk-management | 情報資産とリスクマネジメント | risk-management.md |
| 11 | security-isms-governance | ポリシー・ISMS・ガバナンス | 06-security-operations-and-governance.md + isms-governance.md |
| 12 | security-incident-forensics | 監視・インシデント対応・フォレンジックス | incident-monitoring-forensics.md |
| 13 | security-business-continuity | 事業継続とレジリエンス | business-continuity-resilience.md |
| 14 | security-law-privacy | 法律・プライバシー・コンプライアンス | law-privacy-compliance.md |
| 15 | security-audit-control | 監査と内部統制 | audit-internal-control.md |
| 16 | security-threat-landscape-2026 | 2026年の脅威動向 | 07-threat-landscape-2026.md |

## Lesson結合時のルール

複数原稿を使うChapterでは、文章を単純連結しません。

### Chapter 4

`04-cryptography-and-data-protection.md` を基礎とします。

その後に `pki-certificates.md` のPKI詳細を配置します。

暗号化、公開鍵、デジタル署名など、両原稿で重なる説明は一度だけ残します。

### Chapter 6

`05-network-web-and-system-defense.md` は全体像として冒頭に使います。

`network-mail-defense.md` から個別技術の詳細を続けます。

全体像で既に説明したファイアウォール、分割、VPN、ゼロトラストは、詳細側へ入る際に同じ説明を繰り返さないよう編集します。

### Chapter 11

`06-security-operations-and-governance.md` のうち、組織運用、方針、責任、リスク基準の全体像を導入に使います。

その後に `isms-governance.md` の詳細を続けます。

監視、インシデント対応、復旧の詳細はChapter 12・13へ任せます。

## ランダム再生への対応

各Lessonは、単独で開始しても理解できるようにします。

例えばChapter 9で最初にCVSSが出る場合、Chapter 4を見たことを前提にしません。

必要な略語や前提概念は、そのChapter内で短く再定義します。

ただし、すでに別章で詳しく扱った内容を丸ごと再説明することは避けます。

「短い定義は再掲するが、詳細説明は重複させない」を基本にします。

## 習熟度との対応

習熟度はLesson単位で記録されます。

16 Lessonなら、習熟度は16の主要テーマに対応します。

細かな用語単位ではなく、「認証を一通り理解した」「リスク管理を一通り理解した」という粒度になります。

現在の3本バーによる4段階評価と相性がよい構成です。

## JSON化前の完了条件

16 LessonのJSON化前に、次の条件を確認しました。

- 16章すべてで初出略語を確認済み
- 一文が長すぎる主要箇所を修正済み
- 結合するChapter 4・6・11の重複整理方針が確定
- 時点依存情報に確認日または出典がある
- 原稿間で重大な定義矛盾がない
- ランダム開始しても冒頭だけで主題が分かる

16 LessonはJSON化・Schema検証を完了し、`lessons/index.json` と `courses/index.json` へ登録済みです。


## Chapter 1 JSONパイロット

2026-09-27に `security-fundamentals.json` を作成した。

パイロット作成時点では `lessons/index.json` とCourseへは未登録だった。

目的は、教材原稿からRSVP JSONへの変換品質を先に確認することにある。

### 検証結果

- Schema必須フィールド: PASS
- `base_duration_ms`: 680
- chunk数: 165
- chunk文字数中央値: 7
- chunk文字数90%点: 10
- 14文字超: 1 chunk
- 20文字超: 1 chunk
- 最長: `Cybersecurity Framework` 23文字
- `duration_multiplier` 範囲: PASS

最長チャンクは専門用語の固有名称であり、不自然に分割しない方針を優先して維持した。

### 内容保持

パイロットでは次をすべて残した。

- 情報セキュリティの目的
- 機密性・完全性・可用性
- CIAが代表的三要素であり全てではない点
- 複数要素のバランス
- 情報資産
- 脅威
- 脆弱性
- 発生可能性と影響によるリスク評価
- 対策コストとのバランス
- 継続的な管理
- NIST CSF 2.0の六機能
- 六機能が一方向の手順ではない点

### 現段階の判断

チャンク粒度は既存の `requirements-basics.json` と整合している。

Chapter 1のJSONは、残り15 Lessonを変換する際の参照例として使用できる。

その後、残り15 Lessonも同じ方針で変換し、16 LessonすべてをCourseへ登録した。

## 16 Lesson 最終QA

2026-09-27に16 Lessonをfresh readし、最終QAを実施しました。

確認結果:

- 16ファイルすべてJSON parse: PASS
- `schema_version=1`、Lesson ID、必須フィールド: PASS
- `base_duration_ms`、`sources`、chunk構造: PASS
- `duration_multiplier` 0.5〜3.0: PASS
- 空chunk: 0
- RSVP本文へのURL・Markdown混入: 0
- 24文字超chunk: 0
- 各Lessonのchunk文字数90%点: 10〜11文字
- 全Lesson中の最長chunk: 23文字

文節分割の最終目視で3箇所を個別修正しました。

- `Man-in-the-Middle / On-Path Attack`
- `Cross-Site Request Forgery`
- 助詞「も」の単独chunk

Chapter 2・7・11・16を抜き取り確認しました。Chapter 16では、IPA「情報セキュリティ10大脅威2026」の組織向け上位3項目が意味を壊さず表示単位へ分割されていることを確認しました。

最新mainの教材カタログとも統合し、情報セキュリティCourseはこの16 Lessonを参照します。初期SEEDの `information-security-overview` はファイルのみ参考用として残し、CourseとLessonカタログからは外します。

静的なアプリ実装では、Course通し再生、Chapter順ランダム再生、前後Chapter移動、Lesson単位の習熟度保存との対応を確認しました。

残る確認は実ブラウザでの表示・操作確認です。特に8倍前後で、略語の正式名称直後の短いchunkを含めて読みやすさを確認します。
