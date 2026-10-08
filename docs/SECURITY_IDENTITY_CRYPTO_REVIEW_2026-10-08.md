# 情報セキュリティ本格学習 Course III レビュー — 2026-10-08

Base main: `7ec8b9cb673e13818d7db68f8ca48b435d725175`

## 目的

Identityと暗号を別々の用語集にせず、本人確認、認証、認可、Session、Federation、権限、Cryptographic primitive、PKI、Secret、Data lifecycleを一つの信頼設計として接続します。

## Fresh source review

NIST SP 800-63-4系列、IETF RFC 9700、OpenID Connect Core、OASIS SAML 2.0、NIST FIPS 197 / 180-4 / 186-5、NIST SP 800-57、CISA MFA guidance、IPA新シラバス案を2026-10-08にfresh確認しました。

## Course III

1. `security-identity-proofing-authn-authz` — 識別・本人確認・認証・認可
2. `security-password-mfa-phishing-resistant` — パスワード・MFA・フィッシング耐性
3. `security-sessions-federation-oauth-oidc-saml` — セッション・SSO・OAuth・OIDC・SAML
4. `security-rbac-abac-privileged-access` — RBAC・ABAC・最小権限・特権管理
5. `security-symmetric-public-key-hash-mac` — 共通鍵・公開鍵・ハッシュ・MAC
6. `security-signatures-pki-certificates` — デジタル署名・PKI・証明書
7. `security-key-secret-credential-lifecycle` — 鍵・Secret・Credentialのライフサイクル
8. `security-data-classification-encryption-retention` — データ分類・暗号化・保持・廃棄

## QA

- security-identity-proofing-authn-authz: chunks 51, max 24 chars
- security-password-mfa-phishing-resistant: chunks 50, max 23 chars
- security-sessions-federation-oauth-oidc-saml: chunks 51, max 24 chars
- security-rbac-abac-privileged-access: chunks 50, max 24 chars
- security-symmetric-public-key-hash-mac: chunks 51, max 22 chars
- security-signatures-pki-certificates: chunks 50, max 24 chars
- security-key-secret-credential-lifecycle: chunks 52, max 24 chars
- security-data-classification-encryption-retention: chunks 52, max 24 chars

全Lessonで24文字超chunkなし。Markdown / RSVP JSON / Learn HTMLを同一変更で生成し、LearnにはMarkdown本文全項目の音声向け再確認を含めます。

## 次

Course IV「Network・Endpoint・Cloud」へ進みます。
