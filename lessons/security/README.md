# 情報セキュリティ教材

Status: Draft v0.1  
作成日: 2026-09-27

RSVPで繰り返し読むことを前提にした、情報セキュリティの基礎教材です。

## 編集方針

- まず通常のMarkdown原稿を作り、内容をレビューする
- 正確性を優先し、専門用語は初出時に簡潔に説明する
- 一文に複数の論点を詰め込みすぎない
- 変化しにくい基礎概念と、年次で変化する脅威動向を分ける
- 公式資料・一次資料を優先して確認する
- 内容レビュー後にRSVP用JSONへ変換する
- JSON化後も、原稿Markdownを内容上の正本として残す

## 初版の章構成

1. 情報セキュリティの基本
2. 認証とアクセス制御
3. 主な攻撃手法と脆弱性
4. 暗号とデータ保護
5. ネットワーク・Web・システムの防御
6. 組織としてのセキュリティ運用
7. 2026年の脅威動向

第1〜6章は基礎教材として比較的長く使える内容を目指します。

第7章は時点依存の資料です。IPA「情報セキュリティ10大脅威」などの更新に合わせて見直します。

## 主な参照先

- IPA 情報セキュリティ: https://www.ipa.go.jp/security/
- IPA 情報セキュリティ10大脅威 2026: https://www.ipa.go.jp/security/10threats/10threats2026.html
- NIST Cybersecurity Framework 2.0: https://www.nist.gov/cyberframework
- NIST SP 800-63B-4: https://csrc.nist.gov/pubs/sp/800/63/b/4/final
- NIST FIPS 197 (AES): https://csrc.nist.gov/pubs/fips/197/final
- NIST SP 800-61 Rev. 3: https://csrc.nist.gov/pubs/sp/800/61/r3/final
- CISA cybersecurity guidance: https://www.cisa.gov/
- OWASP Top 10:2025: https://top10.owasp.org/2025/

## 次のレビューで確認すること

- 各章の射程が広すぎないか
- 初学者に誤解を生む単純化がないか
- 用語の定義が現在の公式資料と整合しているか
- 日本語がRSVP向けに短く切りやすいか
- 時点依存の記述が基礎章へ混入していないか
- 重要な例外や限界を落としていないか

この初版では、まだ教材JSONとCourse登録は行いません。
