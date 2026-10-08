# セッション・SSO・OAuth・OIDC・SAML

Status: COMPLETE v0.1
Created: 2026-10-08

## 学習目標

認証、認可、Federation、Sessionの境界を説明し、TokenやAssertionの漏えい・過剰権限・Logout不整合などのリスクを判断できるようにします。

## 本文

1. 認証後にはセッションがあります。
2. 毎回パスワードを送るわけではありません。
3. セッション識別子を使う場合があります。
4. Tokenを使う場合もあります。
5. セッション自体を守ります。
6. 盗まれれば悪用される場合があります。
7. 有効期限を設けます。
8. 必要に応じて再認証します。
9. Logoutも設計します。
10. 失効も設計します。
11. SSOは一度の認証を共有します。
12. 利便性を高めます。
13. 集中管理にも役立ちます。
14. 一方で影響範囲も広がります。
15. Identity Providerを守ります。
16. Federationは信頼をまたぎます。
17. Assertionで情報を伝える場合があります。
18. 発行者を検証します。
19. 受け手も検証します。
20. 対象者も確認します。
21. 有効期限も確認します。
22. OAuthは認可の仕組みです。
23. 第三者へ限定アクセスを与えます。
24. 認証そのものと混同しません。
25. Access Tokenを使う場合があります。
26. Scopeで権限を限定します。
27. 必要以上のScopeを避けます。
28. Redirect処理も重要です。
29. 現在のSecurity BCPを参照します。
30. 古い実装慣行に依存しません。
31. OIDCはIdentity layerです。
32. OAuth 2.0の上に構築されます。
33. End Userの認証を扱います。
34. ID Tokenを使います。
35. Claimで属性を伝えます。
36. Tokenの用途を混同しません。
37. SAMLもFederationに使われます。
38. XMLベースのAssertionを扱います。
39. SSOで広く利用されています。
40. 署名検証が重要です。
41. Metadataの信頼も重要です。
42. Federationは信頼設定が核心です。
43. 登録済み相手だけを信頼します。
44. 鍵や証明書を管理します。
45. Token漏えいを監視します。
46. Session revocationも備えます。
47. アカウント停止と連動させます。
48. 権限変更とも連動させます。
49. 一つのLogoutで全て消えるとは限りません。
50. 実装境界を理解して設計します。

## 注意

各標準の実装詳細は公式仕様と利用するLibraryの現行ガイダンスを確認します。独自実装を推奨しません。

## 出典

- [IETF RFC 10017 OAuth 2.0 for Browser-Based Applications](https://datatracker.ietf.org/doc/html/rfc10017)
- [NIST SP 800-63C-4 Federation and Assertions](https://csrc.nist.gov/pubs/sp/800/63/c/4/final)
- [IETF RFC 9700 Best Current Practice for OAuth 2.0 Security](https://datatracker.ietf.org/doc/html/rfc9700/)
- [OpenID Connect Core 1.0 incorporating errata set 2](https://openid.net/specs/openid-connect-core-1_0-errata2.html)
- [OASIS SAML 2.0 Technical Overview](https://docs.oasis-open.org/security/saml/Post2.0/sstc-saml-tech-overview-2.0.html)
- [IPA 新試験制度のシラバス案について](https://www.ipa.go.jp/shiken/syllabus/henkou/2026/20260630.html)
