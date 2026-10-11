# Course V先行2章：検証記録と未検証事項

Status: DRAFT / HOLD — 2026-10-12 JST修正候補。新しい独立内容受入は未実施。

**以下の2026-10-11記録は修正前候補の制作履歴。** その後、独立監査PR #137は `edc183742163cb3bc355b2ee4b6dd177366acc8f` の両章をNEEDS_REVISIONとした。初回の17 Python、60 Node、427 chunks、独立審査未実施という記述を新候補の結果として流用しない。末尾の修正検証と [REVISION_2026-10-12.md](REVISION_2026-10-12.md) を現行の制作担当記録とする。

## 対象と基準

着手時のGitHub mainは `74ebcac3587650ee83b95438629d1893ba8abfb4`、treeは `3418c0e97759380639ecb767f3c3ef13dc2ba016`。#135は既存3章の統合・反映の記録であり、本候補の受入ではない。着手時のmain Actionsは [Test run 38088421490](https://github.com/Josh-Temple/rsvp-learning/actions/runs/38088421490) がsuccessだった。本候補のCI成功としては使わない。

本書の実行件数はローカル検証の記録。**候補full SHA、Draft PR URL、対象SHAに対応するGitHub Actions URL・結論、push後のreadback結果はDraft PR本文の検証記録へ確定値を保存する。** ローカル成功だけでGitHub ActionsをPASSとは記録しない。PRが更新されたら、そのhead SHAで再確認する。

## ローカルで実行した検査

環境：Node 24.19.0、Python 3.12.14。既存GitHub ActionsはNode 22を使うため、同一環境の結果としては扱わない。

| 実行 | 対象・結果 | 何を確認したか |
|---|---|---|
| 変更前 `npm run check` | **PASS**：Node 38 tests / 38 pass / 0 fail | main取得内容の基準。158 Catalog lessons、24 courses、141 Learn pages。 |
| `sync-rsvp.mjs --check` | **PASS**：V-1 201、V-2 226、合計427 chunks | 正文の位置ごとの全文・順序・句読点・否定とJSON生成の一致。 |
| `render-map.mjs --check` | **PASS**：21命題 | 対応表と自己査読したclaims.jsonの一致。内容の独立審査の代行ではない。 |
| `validate-candidates.mjs` | **PASS**：2章、427 chunks、21命題、HOLD | 現行Lesson schema、24文字、英語破断、3形式の出典、限定の明示箇所、未登録候補。 |
| `validate-html.py` | **PASS**：候補2 pages | 標準HTMLParserでタグ整合、静的article、段落ID、操作UI、共有素材と相対ナビゲーション解決。音声再生は実測していない。 |
| `node --test tests/security-course-v-candidates.test.mjs` | **PASS**：22 tests / 22 pass / 0 fail | 上の形式検査、後述する変異、10問の必要項目、安全な実行例への接続。 |
| `python3 -m unittest discover -s drafts/security-course-v/examples -v` | **PASS**：17 tests / 17 pass | 架空の許可／拒否、提出状態、担当変更、管理分離、認可情報不足、期限境界、SQLite値とLIKE、通常HTML本文。 |
| 変更後 `npm run check` | **PASS**：Node **60 tests / 60 pass / 0 fail** | 既存38＋新規22。新規の1件がPython17件を呼ぶので、60件に17件を足した件数とは表記しない。既存全体検証も実行。 |
| 既存content / status / Learn検証 | **PASS**：158 lessons、24 courses、8518公開側chunks、141 pages | CatalogはCOMPLETE 141 / DRAFT 0 / SEED 17のまま。off-Catalog候補2章はこの公開側集計に含まれず、別検査で確認。 |

既存の「出典なし」警告は変更前にも存在する。他分野の出典やvalidatorの強度は、この作業で変更しない。新規2章の出典は選んだ節と版を別途照合した。

## 意味の限定を落とす変異

新規テストは単語が残るだけでPASSにしないため、次の変更をメモリ内で作り、拒否されることを確認する。実際の原稿へ反例を混入させない。

- 安全な初期設定を「安全な設計と無関係」と逆転する。
- 匿名公開の別規則という限定を消し、全機能へのログイン強制とする。
- ローカル試験で分散した失効と競合まで検証したと逆転する。
- 通常要素のtextContentの安全性をscript / styleへ拡張する。
- HTML自動エスケープがSSTIを防ぐと逆転する。
- DBドライバAPIの正しい使用という条件を、名称だけで十分という主張へ変える。
- Injection対策が認可も済ませるとする。
- 項目の必要性による正規化を、全氏名の一律変換にする。
- JSONだけの否定変更、両形式での英語途中破断、24文字超過、RSVPの逐語講義化、出典のarticle内移動、HTML閉じタグ欠落、COMPLETE昇格・Catalog登録を試みる。

これらは明示した断片の回帰検査であり、一般的な意味推論器ではない。対応表・原典・正文・講義の因果が妥当かは人が査読する。

## 実行例の範囲

認可の純粋関数は、信頼できるサーバ側から現在の主体属性を受け取った前提で動く。認証、セッション、ネットワーク、分散キャッシュ、並行更新を実装していない。診断権限は定義したメタデータ項目だけを許し、実データの匿名化効果を実証していない。設定は教育用の値モデルで、実製品の初回導入・MFAの挙動ではない。

SQLiteはメモリ内の架空4行だけを使用する。正当な引用符、命令のように見える文字列、並び順の固定対応、値としてのORDER BYの反例、LIKEの文字どおり／任意一致、独立した閲覧認可を試した。SQLite以外のDB／ドライバへ一般化しない。

HTMLは固定の通常p要素に文字を符号化し、HTMLParserで入力から要素が増えず元の文字が残るかを確認した。実JavaScript、ブラウザ、サニタイザ、雛形評価、OSコマンド、第三者システムへの試験は実行していない。

## 残る事項

| 対象 | 状態・次の検証 |
|---|---|
| CISA直接サイトの最新本文 | `not_verified / ACCESS_UNAVAILABLE`。2023共同ガイドの検証済み範囲とは分け、原文を再取得して変更有無を確認。 |
| URL、装飾HTML、雛形、OS、他DB | 未採用・未実装の処理系は `not_verified`。選ぶ版と設定を固定し、その境界で別試験。 |
| 全取得経路、MFA、初回登録、設定ドリフト、ログ保護 | 実サービスの統合試験は未実施。単体モデルの結果を転用しない。 |
| 分散失効、長寿命資格情報、競合 | 実環境相当の統合試験は未実施。機微情報の失効要件と反映証拠を確認。 |
| Learn実音声・Android実機 | 未実施。自然さの自己査読と静的DOMの成功を発音・聞き取り・実機PASSにしない。 |
| 実受講者の理解・採点一致・学習効果 | 未測定。問題と模範解答の存在は測定結果ではない。Quiz UIも未実装。 |
| 独立Worker C新規内容受入 | 未実施。両章ともREADY_FOR_INDEPENDENT_REVIEW / HOLD。著者確認とは別。 |
| 統合・公開・production QA | 今回の範囲外。merge、deploy、完成登録、public instant-radioコピーなし。 |

## 2026-10-12 JST：F-01〜F-07修正検証

監査正本は `2ef5ee94619a8faff0f60f9313e10b86af009a00` の [独立監査全文](https://github.com/Josh-Temple/rsvp-learning/blob/2ef5ee94619a8faff0f60f9313e10b86af009a00/docs/SECURITY_COURSE_V_INDEPENDENT_ACCEPTANCE_2026-10-11.md)。着手時mainは `fa63f8f2571203539269a38d501d50d92cafc1d2`。更新前候補・監査のfull SHA、新候補headのCIとreadbackはPR #136のreceiptに区別して保存する。

| 修正後の実行 | 結果・数え方 |
|---|---|
| F-01正式回帰2件のRed | 修正前コードへ追加した同じ19件中17成功・2失敗、exit 1。[失敗ログ](revision-evidence/f01-red.txt) |
| 同じ回帰のGreen | コード修正後19/19成功、exit 0。[成功ログ](revision-evidence/f01-green.txt) |
| Python全体 | 41/41成功。元17＋正式2＋監査条件再構成12＋追加10。[全文ログ](revision-evidence/python-final.txt) |
| 監査12条件の再構成 | 12/12成功。条件・fixture差・結果は修正記録に明記。独立Cの新しい受入ではない。 |
| npm run check全体 | Node67/67成功、content/status/Learnも成功。元38＋候補29。Node内で実行するPython41を加算しない。[全文ログ](revision-evidence/npm-check-final.txt) |
| sync / 候補 / 対応表 | V-1 209、V-2 241、合計450 chunks、21命題、2章HOLD。全文・順序・句読点・否定の一致、24文字、英語破断検査。 |
| Learn / 問題 | 候補2HTML成功。制作注記をarticle外へ移し技術境界を保持。10問、二要素2/1/0と20点を維持、安全なDOM別解を明記。 |
| 根拠の再照合 | 変更に関係するS05/07/08/09/11、S12 V1/V8、Python3.12 dataclassesの指定節。初回15記録の一括再確認ではない。 |

環境はNode24.19.0 / Python3.12.14。既存158教材、24コース、8518公開側chunks、141Learnページ、COMPLETE141/DRAFT0/SEED17は維持する。候補2章は公開側の集計外。

部署照合の欠落拒否に加え、検索の空文字・空白・未登録部署、本人IDの欠落一致、非boolフラグ等の前後比較を保存した。追加10試験は部署行列や複数assertionを含むが、subTestを件数に加算しない。コードと入力契約の範囲は修正記録・READMEを参照。

MD全文とLearn連続講義は制作担当が改訂後に通読した。機械検査は構造・特定断片を確認し、自然言語全体の意味保証ではない。実音声、Android実機、実受講者、採点者間一致、学習効果は未検証/未測定。実サービス全経路、分散失効、実DOM/URL/サニタイザ/CSP、他DB/ORM/手続、template/OS等の既存留保も維持する。

制作担当判定は **READY_FOR_INDEPENDENT_REACCEPTANCE / HOLD**。今回の制作確認範囲では、F-01〜07の未修正項目・新たに検出した未解消P0/P1/P2はない。重大度ゼロを独立保証せず、新しいfull SHAで独立Worker Cが章別に再判定する。main merge・公開・production deployは行わない。
