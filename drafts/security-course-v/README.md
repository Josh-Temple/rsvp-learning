# Course V先行2章：独立内容審査への候補

Status: DRAFT / HOLD — 2026-10-11

| 章 | 内容制作の自己判定 | 公開・登録 | 正本・同期版・連続講義 |
|---|---|---|---|
| V-1 `security-secure-by-design-default` | **READY_FOR_INDEPENDENT_REVIEW** | **HOLD** | [Markdown](lessons/security-secure-by-design-default.md) / [RSVP JSON](lessons/security-secure-by-design-default.json) / [Learn HTML](learn/security-secure-by-design-default.html) |
| V-2 `security-input-output-injection` | **READY_FOR_INDEPENDENT_REVIEW** | **HOLD** | [Markdown](lessons/security-input-output-injection.md) / [RSVP JSON](lessons/security-input-output-injection.json) / [Learn HTML](learn/security-input-output-injection.html) |

この判定は、確認できた一次資料の範囲で具体的な原稿・同期版・講義・問題・検査を用意したという著者の引渡し判断である。独立Worker Cの受入、実受講による評価、アプリの完成済みLesson、公開許可ではない。CISA直接サイトの取得不能など、残る留保も審査対象に含める。Draft PR本文に候補full SHA・GitHub Actions・readbackの確定記録を保存し、そのSHAを審査対象に固定する。

## 成果物

- [SOURCE_EVIDENCE.md](SOURCE_EVIDENCE.md)：一次資料15記録、重要命題21件の版・節・条件・限界。`source_verified / partial / not_verified` を区別。
- [source-registry.json](source-registry.json)：公式URL、確認版、固定コミット、Cheat Sheetのblob SHA。後日の再照合に使う。
- [FORMAT_MAP.md](FORMAT_MAP.md) / [claims.json](claims.json)：V-1の9命題、V-2の12命題を正文番号、JSON添字、Learn段落に対応させた自己査読記録。
- [QUESTIONS.md](QUESTIONS.md)：各章5問。二要素、模範解答、典型誤答、2・1・0点、条件変更と測定したい判断能力。
- [examples/municipal_service.py](examples/municipal_service.py) / [実行試験](examples/test_municipal_service.py)：外部接続のない架空認可、SQLite値バインド、通常HTML本文の教育用モデル。
- [VERIFICATION.md](VERIFICATION.md)：ローカル実行、件数、検証範囲、GitHubの検証記録の読み方。
- [新規回帰検査](../../tests/security-course-v-candidates.test.mjs)：同期・意味の限定・HTML・HOLD・安全な実行例を通常の `npm run check` に接続する。

V-1は201チャンク、V-2は226チャンク。番号付き正文と `chunks[].text` は各位置で全文・順序・句読点・否定まで一致する。24文字上限と英語専門語の途中破断禁止を検査する。長さやチャンク件数を教材品質の指標にはしない。

## 架空サービスの責任と境界

| 主体 | 業務・許可範囲 | 境界と確認対象 |
|---|---|---|
| 住民 | 自分の申請の閲覧、提出前の修正 | 他人の申請と提出後修正は拒否。代理申請は未導入で、導入時は委任の規則が必要。 |
| 担当職員 | 現在担当する部署の申請の審査 | 現在の担当属性を信頼できる側で取得。一覧・詳細・添付・出力にも適用する設計が必要。 |
| 設定管理者 | 承認された設定管理 | 申請本文の閲覧を自動付与しない。兼務が必要なら根拠と範囲を明示。 |
| 委託事業者 | 承認対象の期限付き診断情報 | 初期状態は無効。氏名削除だけで十分とせず、再識別・秘密混入を確認。終了後の拒否まで設計。 |
| 自治体の運用責任者 | 業務規則、変更承認、代替窓口、設定維持 | 初期状態だけでなく運用変更、権限終了、復旧時の動作と証拠を管理。法的責任は本ケースでは判定しない。 |
| ソフトウェア提供者 | 安全な設計・実装・初期値、更新、説明 | 顧客へ設定負担を丸投げせず、検証可能な成果を作る。作業・証拠の担当は個別契約で明示する。 |

氏名、連絡先、申請理由、添付書類を保護対象とする。匿名公開の一般案内は別の明示規則。これらは教材の前提であり、実在の自治体の規則、法令や個別契約への適合、全システム共通の権限モデルではない。

## 実装位置と再現

現行仕様は完成済みCatalog教材をLearn化する。この作業はユーザーの個別指示に基づく未登録候補なので、`drafts/security-course-v/` に隔離した。`lessons/index.json`、`courses/index.json`、既存30章、学習履歴、プレイヤー、SSO、アクセス制御、Pages設定は変更しない。

Learn本文はJavaScript実行前から静的HTMLにある。出典は読み上げ対象articleの外。既存の `learn/learn.css` と `learn/learn.js` を再利用する。候補ページのbaseを `../../../learn/` に定め、共有プレイヤーの相対ナビゲーションと素材を正しい位置へ解決する。共有コードの複製・変更はしない。音声の実際の発音と実機動作は未検証。

```sh
npm install --ignore-scripts
node drafts/security-course-v/sync-rsvp.mjs --check
node drafts/security-course-v/render-map.mjs --check
node drafts/security-course-v/validate-candidates.mjs
python3 drafts/security-course-v/validate-html.py
python3 -m unittest discover -s drafts/security-course-v/examples -v
npm run check
```

Markdownを直した後は `sync-rsvp.mjs --write` でJSONを同期する。自動分割や本文の書換えはしない。重要命題を直したら `claims.json` の対応範囲と断片を内容レビューし、`render-map.mjs --write` で表示表を更新する。Learnは独立して執筆し直す。検査を通すために否定・限定を弱めない。

## 独立Cへの引渡し条件

1. Draft PRの候補full SHAを固定し、別のWorker Cが確認する。#132等の既存3章受入をCourse Vへ転用しない。
2. SOURCE_EVIDENCEの原則と架空ケースの適用を原典に再照合する。CISA直接取得不能は、確認済み2023共同ガイドの範囲と分けて判定する。
3. 各章の目的、前提、因果、技術条件、反例、業務副作用、検証証拠を査読する。形式対応表は著者の主張なので、表の存在だけで受入しない。
4. Learnを耳だけで追えるか、用語、長い段落、否定・条件・反例のつながりを別途確認する。自動検査に聞き取りを代行させない。
5. 条件変更を含む10問で、模範解答と採点の二要素が妥当かを見る。実受講と採点者間一致の測定は後続で行う。
6. CIとreadbackが対象SHAに対応するか確認する。問題があれば具体的な命題と修正理由を残し、著者が改稿して再審査へ戻す。

**V-1の残る条件：** 独立した設計・認可・責任分界の内容受入、Learn音声での追跡可能性。ローカル純粋関数は全経路、管理者初回登録、MFA、ログ保護、設定ドリフト、分散失効を証明しない。それらの実装ゲートは後続の統合設計で対象と証拠を定める。

**V-2の残る条件：** 独立したSQL／HTML／雛形の条件照合、Learn音声と設問の受入。実ブラウザDOM、URL処理、サニタイザ、雛形エンジン、OSコマンド、他DB／ドライバは未採用・未試験なので、実装対象を選ぶ際に版と設定を固定し、その条件で別に試験する。

独立内容受入後にも統合・公開ゲートが必要。今回はDraft PRまでとし、merge、production deploy、Course V完成登録、public instant-radioへのコピー・同期は行わない。

## 残り7章への改善案

| 後続章 | 今回から持ち越す改善 | 制作時に必要な確認 |
|---|---|---|
| V-3 XSS・CSRF・ブラウザ境界 | V-2での文字／URL／装飾の境界を引き継ぎ、CSRFは命令注入と別の原因としてケースを変える。 | ブラウザとセッションの条件、CSRF固有一次資料、実DOMと意図した要求の証拠。 |
| V-4 Broken Access Control | V-1の権限表を土台に、機能・対象・項目の条件変更と全取得経路の漏れを深める。 | 現行Top 10とASVS V8、API側の一覧・添付・出力、属性変更と競合の検証。 |
| V-5 認証・Session・例外処理 | 正規の復旧と安全側の拒否を対にし、認証方式の説明をIIIと重複させ過ぎない。 | 現行のセッション・エラー処理資料、失効・例外・秘密漏えいの適用条件。 |
| V-6 API Security | 一覧と単体取得の違い、元の要求主体、第三者連携、消費量を一つのデータ経路へ置く。 | API固有基準の現行版、オブジェクト／項目認可、資源制限、連携先の信頼境界。 |
| V-7 Secure SDLC・SSDF・Threat Modeling | 原則→設計判断→コード→設定→試験→変更記録を版付きでつなぐ。 | 制作時のSSDF Final／Draftを再確認。今回の1.1固定を将来へ自動流用しない。 |
| V-8 SAST・DAST・SCA・Security Testing | 適用条件を落とした変異と、正常業務を壊す反例で「検出した範囲」を示す。 | 手法の観測範囲、限界、製品・版。実測していない検出率や安全性を宣言しない。 |
| V-9 Dependency・Build・CI/CD・SBOM | GitHubのlatestと安定タグの差を実例に、入力版・配布物・証拠の同一性を扱う。 | 現行の依存物・ビルド・SBOM基準、成果物とコミットの対応、更新後の回帰。 |

共通して、出典の可変URLと読んだ版を先に記録し、正文の自己査読後にRSVPへ同期する。Learnは別の講義として書き、重要な限定を段落単位で照合する。理解確認では条件を一つ変えて結論がどう変わるかを入れる。これらは制作改善案であり、残り7章の完成、全60章の品質保証、学習効果の実証ではない。
