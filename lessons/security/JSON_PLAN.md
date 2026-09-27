# 情報セキュリティ Course / Lesson 変換計画

Status: Draft  
更新日: 2026-09-27

## 方針

情報セキュリティ教材は、現在の16章構成をそのまま16個のLessonへ変換します。

このアプリではCourseの `chapters` がLesson IDの配列なので、1 Lesson = 1 Chapterとして扱います。

細かな節ごとにLessonを分割すると、Libraryが長くなり、習熟度も細分化されすぎます。

一方、長い章を一つの表示チャンクにするわけではありません。

Lesson内部は `docs/LESSON_FORMAT.md` に従い、4〜14文字程度を中心とする短い意味単位へ分割します。

そのため、Chapterとしてはまとまりを保ちつつ、高速表示では小さな単位で読めます。

## Course

予定Course ID:

`information-security`

予定タイトル:

`情報セキュリティ`

## 予定Lesson

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

次を満たしてから16 LessonをJSON化します。

- 16章すべてで初出略語を確認済み
- 一文が長すぎる主要箇所を修正済み
- 結合するChapter 4・6・11の重複整理方針が確定
- 時点依存情報に確認日または出典がある
- 原稿間で重大な定義矛盾がない
- ランダム開始しても冒頭だけで主題が分かる

JSON化後はSchema検証を行い、`lessons/index.json` と `courses/index.json` へ登録します。


## Chapter 1 JSONパイロット

2026-09-27に `security-fundamentals.json` を作成した。

現時点では `lessons/index.json` とCourseへは未登録である。

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

ただし、Course登録は残りの変換方針が安定してから行う。
