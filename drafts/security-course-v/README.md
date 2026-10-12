# Course V先行2章：独立内容審査への候補

Status: DRAFT / HOLD — 2026-10-12（F-01〜F-08修正候補）

| 章 | 内容制作の自己判定 | 公開・登録 | 正本・同期版・連続講義 |
|---|---|---|---|
| V-1 `security-secure-by-design-default` | **READY_FOR_INDEPENDENT_REACCEPTANCE** | **HOLD** | [Markdown](lessons/security-secure-by-design-default.md) / [RSVP JSON](lessons/security-secure-by-design-default.json) / [Learn HTML](learn/security-secure-by-design-default.html) |
| V-2 `security-input-output-injection` | **READY_FOR_INDEPENDENT_REACCEPTANCE** | **HOLD** | [Markdown](lessons/security-input-output-injection.md) / [RSVP JSON](lessons/security-input-output-injection.json) / [Learn HTML](learn/security-input-output-injection.html) |

この判定は、確認できた一次資料の範囲で具体的な原稿・同期版・講義・問題・検査を用意したという著者の引渡し判断である。独立Worker Cの受入、実受講による評価、アプリの完成済みLesson、公開許可ではない。CISA直接サイトの取得不能など、残る留保も審査対象に含める。Draft PR本文に候補full SHA・GitHub Actions・readbackの確定記録を保存し、そのSHAを審査対象に固定する。

旧候補 `edc183742163cb3bc355b2ee4b6dd177366acc8f` は、独立監査 [PR #137](https://github.com/Josh-Temple/rsvp-learning/pull/137) の `2ef5ee94619a8faff0f60f9313e10b86af009a00` で両章 **NEEDS_REVISION** とされた。本改稿はF-01〜F-07修正後に、#139が発見したF-08（夏時間終了時の期限判定逆転）についても、Aの実装修正とBの教材・採点整合を反映した再提出候補である。F-08の実装修正根拠は[F08_REPAIR](F08_REPAIR_2026-10-12.md)を参照。監査報告を改変せず、新しい独立C受入も宣言しない。修正前後、Red→Green、再審査条件は [修正報告](REVISION_2026-10-12.md) を参照。

## 成果物

- [SOURCE_EVIDENCE.md](SOURCE_EVIDENCE.md)：一次資料15記録、重要命題21件の版・節・条件・限界。`source_verified / partial / not_verified` を区別。
- [source-registry.json](source-registry.json)：公式URL、確認版、固定コミット、Cheat Sheetのblob SHA。後日の再照合に使う。
- [FORMAT_MAP.md](FORMAT_MAP.md) / [claims.json](claims.json)：V-1の9命題、V-2の12命題を正文番号、JSON添字、Learn段落に対応させた自己査読記録。
- [QUESTIONS.md](QUESTIONS.md)：各章5問。二要素、模範解答、典型誤答、2・1・0点、条件変更と測定したい判断能力。
- [examples/municipal_service.py](examples/municipal_service.py) / [実行試験](examples/test_municipal_service.py)：外部接続のない架空認可、SQLite値バインド、通常HTML本文の教育用モデル。
- [VERIFICATION.md](VERIFICATION.md)：ローカル実行、件数、検証範囲、GitHubの検証記録の読み方。
- [監査12条件の再構成](examples/test_audit_conditions.py) / [入力契約の追加反例](examples/test_input_contract.py)：制作担当の回帰テスト。独立監査者の新しい受入とは区別する。
- [新規回帰検査](../../tests/security-course-v-candidates.test.mjs)：同期・意味の限定・HTML・HOLD・安全な実行例を通常の `npm run check` に接続する。

V-1は215チャンク、V-2は241チャンク、合計456チャンク。番号付き正文と `chunks[].text` は各位置で全文・順序・句読点・否定まで一致する。24文字上限と英語専門語の途中破断禁止を検査する。長さやチャンク件数を教材品質の指標にはしない。

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

## 入力契約と適用限界

dataclassの型注釈は実行時の検証ではない。本モデルでは、認可関数と検索関数が、操作に必要な値を使う前に確認する。型や識別子を暗黙に変換せず、不正な認可入力には `False`、検索権限の不正には `PermissionError` を返す。検索語・並び順等の不正なデータには `ValueError` を使う。

| 入力 | この教育用モデルが受け入れる値 | 条件と限界 |
|---|---|---|
| 職員・申請の部署 | 通常の `str` で、サーバ側の固定一覧 `DEPARTMENTS` にある `housing` または `welfare` への完全一致 | 読取・審査は主体側と対象側の双方を確認してから等値比較する。`None`、空文字、空白のみ、前後空白、未知名、型不一致は拒否。trimや大文字変換で補正しない。実際の所属・担当・情報の最新性の保証ではない。 |
| 職員の一覧検索 | 上と同じ有効な主体側部署 | 検査に成功した値だけで固定の部署scopeを作る。対象行はその識別子との完全一致で絞るので、欠落・空白・未知部署の行は職員scopeへ入らない。無効な主体側部署はSQL実行前に拒否する。 |
| 主体・所有者・grant主体の識別子 | 空でない通常の `str`、ASCII英数字・ハイフン・アンダースコアのみ | 同じ空値や数値同士の一致は本人一致としない。ここでの文字形式は架空IDの規則で、実在利用者の認証や本人性の証明ではない。所有者の確認は住民本人の操作に必要。 |
| 申請ID・grant対象ID | `bool` を除く正の `int` | `True == 1` のような一致を対象確認に使わない。実DBの参照整合性や全件の実在確認は別途必要。 |
| 認可取得・活動・支援有効・承認のflag | 通常のboolの `True` を明示した場合 | `1`、`"true"`、`"false"` 等を真偽値へ暗黙変換しない。匿名公開の案内は取得flagに依存しない別規則。 |
| 住民本人・設定管理者・委託先 | それぞれの役割、対象、項目、状態、期限の規則 | 部署依存でない操作に部署を要求しない。住民は本人の申請を読み、draftだけ編集。管理者は設定だけ。委託先は有効な承認の範囲内で診断メタデータだけ取得。 |
| 委託期限・現在時刻 | timezoneを持ち、UTC offsetが定義された `datetime` | 他の診断認可条件を満たす場合に限り、`now.astimezone(timezone.utc) < grant.expires_at.astimezone(timezone.utc)` のとき許可する。期限の1µs前は許可、ちょうどと期限後は拒否。同じ瞬間は異なるUTC offset表現でも同じ判断とし、夏時間終了時の同一タイムゾーンの`fold`による表示順逆転を避ける。`replace(tzinfo=timezone.utc)`で時刻のラベルだけを変えない。時計同期、全API・分散失効、実セッションの破棄は実装していない。 |
| 検索と通常コメント | 検索語は通常の `str`、80 Unicode code pointsまで。コメントは文字列、500まで。並び順は固定の二択、literal指定はbool | これはローカルの受入上限。実HTTPの解析資源、巨大DBの負荷、他DBやブラウザの挙動の保証ではない。 |

入力は現在の信頼できるサーバ側ストアから渡す前提を維持する。その前提は値の有効性を省略する理由にはならない。固定部署一覧・ID形式・flag規則は本教材の入力契約であり、OWASPが自治体の部署名やID形式を指定しているわけではない。DBの各行、利用者登録、属性の更新と失効、すべての取得経路を実環境で確認する工程は残る。

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
