# 情報セキュリティ教材 RSVP分割品質の点検（Worker A）

確認日: 2026-10-08（JST）
開始時のmain: `1d6017a098d8a22cd7dd3bb8763e86b9e84a4311`

## 対象と結果

- Course I〜IVの30章のRSVP JSONを点検。
- 24文字制限内でも英語の専門用語が途中で切れていた境界を6件特定し、5章のMarkdownとJSONを同期修正。
- 誤読を招く助詞・述語の分割も、修正対象5章を中心に合わせて改善（合計21の置換箇所）。
- 新規の境界検査は英語の連続を`ERROR`、助詞末尾を`REVIEW`として区別。機械による全文の日本語品質保証ではない。

## 代表例

- `Infrastructure as Co` / `deも使えます。` → `Infrastructure as Code` / `構成をコードとして管理します。`
- `Display name spoofin` / `gも残ります。` → `Display name spoofing` / `表示名の偽装も残ります。`
- `SaaSは設定がAttack surfa` / `ceです。` → `SaaSの設定も攻撃面です。`
- `重要AccessをManaged dev` / `iceへ限定できます。` → `重要なアクセスを管理端末に限定できます。`

## 残る確認事項

- 文節分割の候補は、正確性と意味を保持する観点から引き続きB/Cでレビューする。
- 例えば `Identity Providerを` / `強く守ります。`、`VPNとZero Trustを` / `対立概念にしません。` は今後の改稿時に確認する。
- AではLearn HTMLの本文を変更しない。Bが音声講義の表現と専門用語の保持を検討する。
- Android Chrome実機の表示・再生・講義の聴取は未検証。


## 次Wave A: 意味単位の再点検と修正（2026-10-08 JST）

- 対象指示: Library `2026-10-08_security_learning_semantic_quality_and_field_validation_wave_instructions.md` / Worker A。
- 着手時main（fresh read）: `2eb12f4847f204816fd9aa9c2b1fdc512805e380`。
- 最新mainのCourse I〜IV、30章の全RSVP JSONを再走査。既知7件はすべて`unresolved`のまま残存していた。修正後は6章のJSON・番号付きMarkdownを同期し、各候補を`fixed`に再判定した。
- 24文字上限、変更6章のMarkdown/JSON連結一致、出典URLの保持を作業ブランチで個別確認。事実・推奨の新規主張は追加せず、元の説明を短い独立した意味単位へ再構成した。

| Lesson | 作業開始時の分割 | 修正後 | 再判定 |
|---|---|---|---|
| `security-identity-proofing-authn-authz` | `Identity proofingに` / `も失敗があります。` | `Identity proofingは本人確認。` / `本人確認でも誤認が起きます。` | fixed |
| `security-sessions-federation-oauth-oidc-saml` | `Identity Providerを` / `強く守ります。` | `Identity Providerを守ります。` | fixed |
| `security-symmetric-public-key-hash-mac` | `Digital signatureとは` / `異なります。` | `Digital signatureとは別です。` | fixed |
| `security-key-secret-credential-lifecycle` | `Secret managerを` / `使う場合があります。` | `Secret managerも使えます。` | fixed |
| `security-key-secret-credential-lifecycle` | `Emergency rotationも` / `演習します。` | `緊急時の秘密情報の更新も演習します。` | fixed（英文表現を日本語へ置換） |
| `security-dns-tls-https` | `Load balancerで` / `終端する場合もあります。` | `Load balancerでも終端可能です。` | fixed |
| `security-segmentation-vpn-zero-trust` | `VPNとZero Trustを` / `対立概念にしません。` | `VPNとZero Trustは対立しません。` | fixed |

- 修正後の対象6章には、現行の助詞終端・連続英字ルールで新たな`REVIEW`または`ERROR`は検出されていない。変更のない残る24章については、着手時の機械走査で当該ルールの指摘が0件だった。
- `POSSIBLE_COMPOUND_PARTICLE_SPLIT`（例: `登録に` / `も誤りがあります。`）を`REVIEW`で追加。正常な助詞境界を一律エラーにせず、30章の未説明`REVIEW`件数をテストで監視する。一般化した別例を回帰フィクスチャに追加。
- チャンクを統合した箇所は、従来2画面分の表示時間を保つように`duration_multiplier`を合算（最大3.0以内）。2画面のままの本人確認の説明は従来値を保持した。
- **限界:** 機械検査の合格は、全ての日本語境界・専門用語の正確性、実際の読解速度、Learn HTML・音声・Android Chromeでの自然さを保証しない。実機確認は`NOT_VERIFIED`。変更に伴う専門語の言い換え（特にEmergency rotation）はB/Cに意味の確認を依頼する。AはLearn HTMLを変更していない。
- 追加テストは修正より前にブランチへ保存。CI / `npm run check`の実行結果およびPRのmergeは、実際に確認できた状態に従い別途判定する。
