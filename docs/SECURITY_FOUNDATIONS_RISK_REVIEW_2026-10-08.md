# 情報セキュリティ本格学習 Course I レビュー — 2026-10-08

Base main: `919bfba37e5e51bf4c1736bcf2b28e875b31714a`

## 目的

既存の情報セキュリティCourseは、2026-09-28のレビューで「広く浅い体系理解」を目的として作成されました。

今回からは、用語を知るだけでなく、資産・脅威・リスク・管理策を結び付け、設計と運用の判断ができることを目標とする本格学習系列を追加します。

全体計画は `docs/SECURITY_DEEP_CURRICULUM_2026-10-08.md` を正本とします。最終目標は8 Course、合計60 Lessonです。

既存の `information-security` Courseは今回変更していません。移行途中でも既存の学習経路を壊さないためです。

## 過去資産の扱い

Draft PR #6 `content/security-course-v0.1` をfresh readしました。

同PRには16章の詳細原稿、IPA SGカバレッジ、レビュー記録、RSVP JSONがありますが、現在のmainより古く、競合もあるため、そのままmergeしていません。

内容は再利用候補として扱い、現在の教材仕様、現在の一次資料、今回の学習深度に合わせて必要部分だけを再構成します。

## 現在性と基準

今回の設計では、2026-10-08時点で確認した次の資料を主に参照しました。

- IPA 情報処理安全確保支援士試験 シラバス案 Ver.0.1
- NIST Cybersecurity Framework 2.0
- NIST SP 800-30 Rev.1
- NIST SP 800-39
- CIS Critical Security Controls v8.1
- OWASP Top 10:2025
- OWASP Threat Modeling Project / Cheat Sheet

IPAの2027年度向け情報処理安全確保支援士試験シラバス案では、CIA以外のセキュリティ特性、セキュリティバイデザイン、最小権限、多層防御、リスクマネジメント、脅威モデリングなどが専門知識・技能の範囲として整理されています。

## Course I

Course ID:

`security-foundations-risk`

Title:

`情報セキュリティ I：基礎・リスク・脅威`

Lesson:

1. `security-purpose-principles` — セキュリティの目的と基本原則
2. `security-assets-dependencies` — 情報資産・依存関係・信頼境界
3. `security-threats-vulnerabilities` — 脅威・脆弱性・露出・攻撃対象領域
4. `security-risk-assessment` — リスクアセスメント
5. `security-risk-treatment` — リスク対応・残存リスク・例外管理
6. `security-threat-modeling` — 脅威モデリング
7. `security-defense-in-depth` — 多層防御と管理策の有効性確認

各Lessonに次を追加しました。

- Markdown原稿
- RSVP JSON
- Learn HTML
- `lessons/index.json` 登録
- `courses/index.json` 登録

## 内容上の変更

従来の「CIA、脅威、脆弱性、リスクを短く説明する」粒度から、次の判断系列へ拡張しました。

1. 守る目的とセキュリティ特性を区別する
2. 資産、依存関係、データフロー、信頼境界を把握する
3. 脅威、脆弱性、露出、攻撃経路を分解する
4. 発生可能性、影響、既存対策、不確実性を評価する
5. リスク対応、残存リスク、例外を責任ある判断として管理する
6. 設計段階で脅威モデリングを行う
7. 管理策の存在ではなく、有効性の証拠まで確認する

## readback検証

GitHubへ書き込んだ後、全7 LessonのMarkdown / RSVP JSON / Learn HTMLをfresh readしました。

| Lesson | chunks | max chars | Markdown/JSON | sources | Learn |
|---|---:|---:|---|---|---|
| security-purpose-principles | 55 | 19 | PASS | PASS | PASS |
| security-assets-dependencies | 57 | 20 | PASS | PASS | PASS |
| security-threats-vulnerabilities | 57 | 18 | PASS | PASS | PASS |
| security-risk-assessment | 58 | 16 | PASS | PASS | PASS |
| security-risk-treatment | 57 | 17 | PASS | PASS | PASS |
| security-threat-modeling | 59 | 20 | PASS | PASS | PASS |
| security-defense-in-depth | 59 | 21 | PASS | PASS | PASS |

確認した条件:

- 全Markdown: `Status: COMPLETE v0.1`
- JSON parse: PASS
- Markdown番号付き本文とJSON `chunks[].text` の連結: 全件一致
- 24文字超chunk: 0
- MarkdownとJSONのsources: 全件一致
- Learn: `article#learn-article` 存在
- Learn: 再生、一時停止、停止、音声選択、速度UIあり

## 残る検証

リポジトリ全体のSchema・Catalog・LearnテストはPRのGitHub Actionsで確認します。

CIで問題が見つかった場合は、このbranchで修正してからmergeします。

## 次のWave

Course II「脅威主体・攻撃の流れ」を予定します。

主な範囲:

- 攻撃者・動機・初期アクセス
- ソーシャルエンジニアリング・BEC・フィッシング
- マルウェア・ランサムウェア
- 資格情報・セッションを狙う攻撃
- 偵察・権限昇格・永続化・横展開
- C2・持ち出し・痕跡
- MITRE ATT&CKと攻撃シナリオ
