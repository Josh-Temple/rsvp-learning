# セグメンテーション・VPN・Zero Trust

Status: COMPLETE v0.1
Created: 2026-10-08

## 学習目標

VPN接続を信頼完了とみなさず、侵害時のBlast radiusを抑える分割とResource単位の認可を設計できるようにします。

## 本文

1. 分割は影響範囲を抑えます。
2. 全端末を一つのNetworkに置きません。
3. 業務の必要性で区切ります。
4. Server群を分ける場合があります。
5. 管理Networkも分けます。
6. 開発と本番も分けます。
7. 利用者端末も分けられます。
8. VLANは分割手段の一つです。
9. Firewall Ruleと組み合わせます。
10. Cloud networkでも分割します。
11. Account分離も考えます。
12. 分割だけで認可は完了しません。
13. 横展開を難しくします。
14. Blast radiusを小さくします。
15. VPNは安全なTunnelを作ります。
16. Remote accessに使われます。
17. Site間接続にも使われます。
18. VPN接続済みでも無条件に信じません。
19. Credential侵害を考えます。
20. Client端末侵害も考えます。
21. MFAを組み合わせます。
22. 端末状態も評価できます。
23. 接続先を必要最小限にします。
24. Split tunnelingも評価します。
25. DNS経路も確認します。
26. Zero Trustは場所の信頼を減らします。
27. Resource保護を中心にします。
28. Identityを確認します。
29. Device状態も確認します。
30. Access対象も確認します。
31. Contextを使う場合があります。
32. 継続的な判断を行います。
33. 最小権限を適用します。
34. Microsegmentationも使えます。
35. Service間にも適用できます。
36. Policyを一元化する場合があります。
37. 判断点を明確にします。
38. Enforcement pointも必要です。
39. Logで判断を追跡します。
40. 例外経路を管理します。
41. Legacy systemも考慮します。
42. 段階的に移行します。
43. 重要Resourceから始められます。
44. 利用者体験も評価します。
45. 可用性も守ります。
46. Identity障害時を設計します。
47. 緊急Accessを管理します。
48. VPNとZero Trustは対立しません。
49. 目的に応じて組み合わせます。
50. 信頼を明示的に評価します。

## 注意

Zero Trustは特定製品名ではありません。既存環境を一度に置換するのではなく、重要ResourceとAccess pathから段階的に適用します。

## 出典

- [NIST SP 800-207 Zero Trust Architecture](https://csrc.nist.gov/pubs/sp/800/207/final)
- [CIS Critical Security Controls v8.1](https://www.cisecurity.org/controls/v8-1)
- [IPA 新試験制度のシラバス案について](https://www.ipa.go.jp/shiken/syllabus/henkou/2026/20260630.html)
