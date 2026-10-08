# Container・Serverless・SaaS・IoT

Status: COMPLETE v0.1
Created: 2026-10-08

## 学習目標

Serverを直接管理しない技術でもSecurity責任が残ることを説明し、Supply chain、Identity、Configuration、Telemetry、Lifecycleの管理点を選べるようにします。

## 本文

1. Managed技術でも責任は残ります。
2. 管理対象が変わるだけです。
3. ContainerはImageを使います。
4. Image sourceを管理します。
5. Base imageを把握します。
6. Dependencyも把握します。
7. 不要Packageを減らします。
8. Image scanを使えます。
9. 署名を使う場合があります。
10. Registry accessを管理します。
11. Runtime権限を絞ります。
12. Root実行を避けられる場合があります。
13. Hostとの境界を守ります。
14. SecretをImageへ埋め込みません。
15. Workload identityを使います。
16. Network policyも使えます。
17. Orchestrator APIを強く守ります。
18. Audit logを有効にします。
19. ServerlessもCodeと設定があります。
20. Function権限を最小化します。
21. Event sourceを検証します。
22. Secret管理も必要です。
23. Dependencyも
24. Supply chainです。
25. LogとTraceを集めます。
26. 短時間実行でも監視します。
27. SaaSは設定がAttack surfa
28. ceです。
29. Sharingを管理します。
30. OAuth app連携を管理します。
31. Admin roleを管理します。
32. Data exportも監視します。
33. Tenant設定をBackupで
34. きるか確認します。
35. IoTは長いLifecycleがあります。
36. Device identityが必要です。
37. Secure configuration
38. が必要です。
39. Data protectionも必要です。
40. Interface accessを制御します。
41. Software update能力が重要です。
42. Security stateを
43. 報告できると有用です。
44. 製造者Supportも確認します。
45. Support期間を調達時に見ます。
46. Default passwordを避けます。
47. Unique credentialを使います。
48. 不要Serviceを無効化します。
49. Network分離も使います。
50. 物理Accessも考えます。
51. 廃棄時にDataを消去します。
52. Update不能Deviceは
53. Riskになります。
54. Managedだから安全とは限りません。
55. IdentityとConfigurati
56. onを中心に見ます。
57. Lifecycleと
58. Supply chainまで追います。

## 注意

Container orchestration、Serverless、SaaS、IoTは製品差が大きいため、共通原則を学んだ上で各Platformの公式Security guidanceを確認します。

## 出典

- [NIST SP 800-190 Application Container Security Guide](https://csrc.nist.gov/pubs/sp/800/190/final)
- [CISA Cloud Security Technical Reference Architecture v2](https://www.cisa.gov/topics/cybersecurity-best-practices/executive-order-improving-nations-cybersecurity)
- [NISTIR 8259 Series](https://www.nist.gov/itl/applied-cybersecurity/nist-cybersecurity-iot-program/nistir-8259-series)
- [IPA 新試験制度のシラバス案について](https://www.ipa.go.jp/shiken/syllabus/henkou/2026/20260630.html)
