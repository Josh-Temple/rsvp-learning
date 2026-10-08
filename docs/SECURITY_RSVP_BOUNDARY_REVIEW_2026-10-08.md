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


## 2026-10-09 Worker A — 4章の深度改稿・RSVP同期（独立審査待ち）

- 指示: Library `/RSVP Learning/Work Instructions/2026-10-09_security_learning_independent_validation_and_depth_expansion_wave_instructions.md` のAのみ。
- 開始時GitHub main: `fd003b63b816799dd8f1f1eac0de4fd70db32da9`（2026-10-09 JST、fresh read）。open PRは旧Draft #6と別スコープ #29。GitHub Test [37783095016](https://github.com/Josh-Temple/rsvp-learning/actions/runs/37783095016) は開始時mainでsuccess。Scheduled Vercel deploy [37784613603](https://github.com/Josh-Temple/rsvp-learning/actions/runs/37784613603) はsuccess。これらは今回の変更後のCI結果ではない。
- 初期候補4章を維持。現行C監査のP1対象であり、前WaveのLearn改稿済み8章とは別。Lesson statusとCatalog、Learn HTML、Course順序、private公開境界は変更しない。

| Lesson | チャンク数（旧→新） | 追加した説明・架空ケース・検証 | 分類 |
|---|---:|---|---|
| `security-threat-modeling` | 55→55 | 範囲と信頼境界→架空の申請閲覧認可欠落→APIでの拒否試験・ログ→設計変更で再評価 | A原稿/JSON同期・C主張審査待ち |
| `security-mitre-attack-scenarios` | 59→56 | tactic/techniqueの違い→架空のメール・認証・権限・転送ログ→反証・観測欠落→防御の検証 | A原稿/JSON同期・C主張審査待ち |
| `security-password-mfa-phishing-resistant` | 50→59 | OTPと耐フィッシング認証の違い→高権限職員の架空例→認証器の回復・記録・検証→NISTの適用境界 | A原稿/JSON同期・C主張審査待ち |
| `security-firewall-proxy-waf-ids-ips` | 51→56 | 装置ごとの観測対象→WAFとアプリ認可の境界→架空データでの拒否試験→迂回・誤検知・運用 | A原稿/JSON同期・C主張審査待ち |

### 一次資料と限界（2026-10-09）

- `security-threat-modeling`: OWASP Threat Modeling Cheat Sheet（Overview、System Modeling、Threat Identification、Response and Mitigations、Review and Validation）を2026-10-09に取得。工程とモデル更新を照合。
- `security-mitre-attack-scenarios`: MITRE ATT&CK Enterprise Matrix（2026-10-09取得、tactics・techniques・対象platform）を照合。継続更新のため個別項目の版固定・完全性はCの審査待ち。
- `security-password-mfa-phishing-resistant`: NIST SP 800-63B-4（§2/§3.2.5/§4/§5/Appendix B、2026-10-09取得）を照合。適用は特定の米国行政向け枠組みに限定して説明。
- `security-firewall-proxy-waf-ids-ips`: NIST SP 800-41 Rev.1（2009、公式CSRC公開情報）、NIST SP 800-94（2007、公式CSRC公開情報）、CIS Controls v8.1公開ページを2026-10-09に確認。NISTの本文PDF各節・製品別挙動は未照合。

- 本文で扱う住民申請、行政サービス、職員用システム、WAF付きAPIは**全て教育用の架空ケース**。実システムの侵入や悪用の実演ではない。
- Aの同一JSONチャンクとMarkdown番号付き本文は一対一に生成した。各24文字以内・末尾を助詞のまま残さないこと・既存出典との同期を生成時に機械点検。検査は意味や学習効果を認定しない。
- 既知7件の境界を修正した他6章は今回編集しない。前Wave回帰試験を維持する。今回のFirewall旧文にあった `Cloud security group` / `も似た役割があります。` は、助詞単独の文節をなくす表現へ改稿した。英単語途中分割とは別の読みやすさの問題。
- GitHub Actionsの今回headに対する `npm run check`、手動自然さ、C独立審査、BのLearn HTML同期、Android実機・音声、学習者理解は**このA原稿の作成だけではPASSとしない**。
- **Bへの引継ぎ**: 上記4章のLearn HTMLは旧本文を対象としている可能性がある。Aの確定PR headを取得し、各架空ケース・否定/例外・検証方法を音声講義へ再構成すること。AはHTMLを変更しない。
- **Cへの引継ぎ**: 特に①OWASPの工程、②MITRE技法名と行動推定の境界、③WebAuthnの耐フィッシング性と復旧手順、④WAF/アプリ認可の区別を、新headで独立審査すること。NIST SP 800-41/94の未照合PDF本文を確認済み扱いしない。
