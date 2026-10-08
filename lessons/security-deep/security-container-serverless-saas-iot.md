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
23. 依存関係も供給網の一部です。
24. LogとTraceを集めます。
25. 短時間実行でも監視します。
26. SaaSの設定も攻撃面です。
27. Sharingを管理します。
28. OAuth app連携を管理します。
29. Admin roleを管理します。
30. Data exportも監視します。
31. Tenant設定を復元できるか確認します。
32. IoTは長いLifecycleがあります。
33. Device identityが必要です。
34. 安全な設定が必要です。
35. Data protectionも必要です。
36. Interface accessを制御します。
37. Software update能力が重要です。
38. 機器の安全状態を把握できると有用です。
39. 製造者Supportも確認します。
40. Support期間を調達時に見ます。
41. Default passwordを避けます。
42. Unique credentialを使います。
43. 不要Serviceを無効化します。
44. Network分離も使います。
45. 物理Accessも考えます。
46. 廃棄時にDataを消去します。
47. 更新できない機器はリスクになります。
48. Managedだから安全とは限りません。
49. IDと設定の管理を重視します。
50. ライフサイクルと供給網を確認します。

## 注意

Container orchestration、Serverless、SaaS、IoTは製品差が大きいため、共通原則を学んだ上で各Platformの公式Security guidanceを確認します。

## 出典

- [NIST SP 800-190 Application Container Security Guide](https://csrc.nist.gov/pubs/sp/800/190/final)
- [CISA Cloud Security Technical Reference Architecture v2](https://www.cisa.gov/topics/cybersecurity-best-practices/executive-order-improving-nations-cybersecurity)
- [NISTIR 8259 Series](https://www.nist.gov/itl/applied-cybersecurity/nist-cybersecurity-iot-program/nistir-8259-series)
- [IPA 新試験制度のシラバス案について](https://www.ipa.go.jp/shiken/syllabus/henkou/2026/20260630.html)
