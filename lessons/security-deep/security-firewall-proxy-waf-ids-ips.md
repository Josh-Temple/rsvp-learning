# Firewall・Proxy・WAF・IDS/IPS

Status: COMPLETE v0.1
Created: 2026-10-08

## 学習目標

FirewallやWAFを置けば安全という発想から離れ、対象Protocol、Coverage、暗号化、誤検知、Bypass、運用を説明できるようにします。

## 本文

1. Firewallは通信を制御します。
2. Ruleに基づいて許可します。
3. 送信元を条件にできます。
4. 送信先も条件にできます。
5. ProtocolやPortも使えます。
6. Stateを追う方式もあります。
7. Network境界だけに置くとは限りません。
8. Host側にも置けます。
9. Cloud security group
10. も似た役割があります。
11. Proxyは通信を仲介します。
12. Forward proxyがあります。
13. Client側の通信を仲介します。
14. Reverse proxyもあります。
15. Server側の前段に置きます。
16. 認証や記録を追加できます。
17. Content制御にも使えます。
18. WAFはWeb trafficを対象にします。
19. HTTPの内容を見て判断します。
20. Application脆弱性の補完に使えます。
21. 根本修正の代替にはしません。
22. IDSは検知を目的にします。
23. IPSは遮断も行います。
24. Network型があります。
25. Host型もあります。
26. Signature検知があります。
27. Behavior検知もあります。
28. 誤検知があります。
29. 見逃しもあります。
30. 暗号化で見えにくくなる場合があります。
31. TLS終端位置が影響します。
32. Ruleの品質が重要です。
33. 不要な許可を減らします。
34. Any許可を放置しません。
35. 期限付きRuleを管理します。
36. 所有者を明確にします。
37. Change管理を行います。
38. Logを有効にします。
39. ただし全Logが同価値ではありません。
40. 重要Ruleを監視します。
41. 遮断イベントも調査します。
42. Bypass経路を探します。
43. 別Portを使える場合があります。
44. 直接接続できる場合もあります。
45. Cloud経路も確認します。
46. 装置自体も資産です。
47. 管理画面を強く守ります。
48. Firmware更新も必要です。
49. 設定Backupも守ります。
50. Fail open条件を理解します。
51. 役割と限界を組み合わせます。

## 注意

製品機能は差が大きいため、名称だけで能力を推測しません。実際の配置、Rule、Log、更新状態を確認します。

## 出典

- [NIST SP 800-41 Rev.1 Guidelines on Firewalls and Firewall Policy](https://csrc.nist.gov/pubs/sp/800/41/r1/final)
- [CIS Critical Security Controls v8.1](https://www.cisecurity.org/controls/v8-1)
- [IPA 新試験制度のシラバス案について](https://www.ipa.go.jp/shiken/syllabus/henkou/2026/20260630.html)
