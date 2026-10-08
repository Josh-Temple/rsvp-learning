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
