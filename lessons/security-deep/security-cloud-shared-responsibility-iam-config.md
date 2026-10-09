# Cloud責任分界・IAM・設定

Status: COMPLETE v0.1
Created: 2026-10-08

## 学習目標

Providerが守る範囲と利用組織が設定・運用する範囲を説明し、Cloud misconfigurationやIdentity侵害を継続管理できるようにします。

## 本文

1. Cloudでも責任は残ります。
2. Providerと利用者で分担します。
3. 責任分界はServiceで変わります。
4. IaaSがあります。
5. PaaSがあります。
6. SaaSがあります。
7. 同じProviderでも差があります。
8. 契約内容も確認します。
9. IAMが中心になります。
10. Human identityがあります。
11. Workload identityもあります。
12. Root権限を日常利用しません。
13. 管理者権限を分けます。
14. MFAを使います。
15. Roleを使います。
16. 短命Credentialも検討します。
17. Access keyを減らします。
18. Unused identityを削除します。
19. Network設定も重要です。
20. Public exposureを把握します。
21. Storage公開設定も確認します。
22. Security groupも確認します。
23. Private endpointも使えます。
24. Data encryptionを管理します。
25. Key管理も責任範囲を確認します。
26. Secretを安全に保管します。
27. Loggingを有効にします。
28. Control plane logが重要です。
29. Data access logも検討します。
30. Logの改ざん耐性を高めます。
31. 別Accountへ保管する場合があります。
32. 設定のずれを継続監視します。
33. Infrastructure as Code
34. 構成をコードとして管理します。
35. Reviewを行います。
36. Policy as Codeも使えます。
37. Guardrailを設けます。
38. Multi-accountを使う場合があります。
39. 環境を分離できます。
40. 課金区分だけではありません。
41. 安全上の境界にもなります。
42. Break glassを設計します。
43. Provider障害も考えます。
44. Region障害も考えます。
45. Backupと復旧を確認します。
46. SaaSでも設定責任があります。
47. Sharing設定を確認します。
48. External app連携も確認します。
49. Audit logを確認します。
50. Provider更新も追います。
51. 責任分界を定期的に再確認します。
52. Cloud postureを継続管理します。

## 注意

責任分界はProviderとServiceごとに異なります。利用するCloudの契約・公式責任モデル・Service仕様を必ず確認します。

## 出典

- [AWS 責任共有モデル（AWSのサービス固有例）](https://aws.amazon.com/jp/compliance/shared-responsibility-model/)
- [NIST SP 800-207 Zero Trust Architecture](https://csrc.nist.gov/pubs/sp/800/207/final)
- [CIS Critical Security Controls v8.1](https://www.cisecurity.org/controls/v8-1)
- [IPA 新試験制度のシラバス案について](https://www.ipa.go.jp/shiken/syllabus/henkou/2026/20260630.html)
