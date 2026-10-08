# 情報セキュリティ本格学習 Course II レビュー — 2026-10-08

Base main: `4d98661316c2eca0e56fb85efed9693f05f2e7c8`

## 目的

Course Iで資産・脅威・リスク・管理策を整理した後、Course IIでは攻撃を個別用語の一覧ではなく、侵入前の準備から初期アクセス、Identity侵害、権限拡大、横展開、外部制御、情報持ち出し、影響までの流れとして理解します。

攻撃手法を実行するための教材にはせず、防御側がどこで予防し、何を観測し、どう封じ込めるかを判断できることを目的とします。

## Source of Truth

2026-10-08にfresh確認:

- IPA 新試験制度のシラバス案
- MITRE ATT&CK Enterprise Tactics / Matrix
- IPA メール攻撃・BEC・ランサムウェア資料
- CISA #StopRansomware Guide
- CISA MFA guidance

旧Draft PR #6もfresh readしましたが、そのまま移植せず、現在のmain仕様と現在の一次資料に合わせて再構成しました。

## Course II

Course ID: `security-threat-flow`

1. `security-adversaries-initial-access` — 攻撃者・動機・初期アクセス
2. `security-social-engineering-bec-phishing` — ソーシャルエンジニアリング・BEC・フィッシング
3. `security-malware-ransomware` — マルウェア・ランサムウェア
4. `security-credential-session-attacks` — 資格情報・セッションを狙う攻撃
5. `security-post-compromise-movement` — 偵察・権限昇格・永続化・横展開
6. `security-c2-exfiltration-stealth` — C2・持ち出し・痕跡
7. `security-mitre-attack-scenarios` — MITRE ATT&CKと攻撃シナリオ

## 設計上の重点

- 攻撃者の帰属を安易に断定しない
- Initial Accessと侵害全体を分ける
- フィッシング/BECを利用者の注意力だけの問題にしない
- ランサムウェアを暗号化イベントだけでなく侵入型攻撃の後段として扱う
- Password/MFA/Session/Tokenを一つのIdentity攻撃面として扱う
- Discovery / Persistence / Privilege Escalation / Lateral Movementを侵入後の拡大として接続する
- Command and Control / Collection / Exfiltrationを観測可能性と結び付ける
- StealthとDefense Impairmentを防御側の観測欠損として扱う
- ATT&CKを固定的な攻撃順序やリスクランキングとして使わない

## 生成時QA

- security-adversaries-initial-access: chunks 50, max 21 chars
- security-social-engineering-bec-phishing: chunks 50, max 21 chars
- security-malware-ransomware: chunks 51, max 21 chars
- security-credential-session-attacks: chunks 49, max 23 chars
- security-post-compromise-movement: chunks 50, max 24 chars
- security-c2-exfiltration-stealth: chunks 50, max 21 chars
- security-mitre-attack-scenarios: chunks 59, max 23 chars

全Lesson:
- Markdown / RSVP JSON / Learn HTMLを同一変更で生成
- 24文字超chunk: 0
- LearnにMarkdown本文全項目の音声向け再確認を含める
- 実環境への侵入コマンド、マルウェア作成、回避手順は含めない

## 次

Course III「Identity・暗号・データ保護」へ進みます。
