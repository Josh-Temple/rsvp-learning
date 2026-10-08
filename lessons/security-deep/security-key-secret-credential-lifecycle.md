# 鍵・Secret・Credentialのライフサイクル

Status: COMPLETE v0.1
Created: 2026-10-08

## 学習目標

Secretの種類ごとの影響とLifecycleを説明し、Hard coding、共有、過剰権限、回転不能などの設計問題を見つけられるようにします。

## 本文

1. Secretには複数の種類があります。
2. 暗号鍵があります。
3. Passwordがあります。
4. API keyがあります。
5. Tokenがあります。
6. Certificateの秘密鍵もあります。
7. Service credentialもあります。
8. 用途を明確にします。
9. 同じSecretを使い回しません。
10. 環境間で分離します。
11. 開発と本番を分けます。
12. Tenant間も必要に応じて分けます。
13. 生成方法が重要です。
14. 十分なRandomnessを使います。
15. 独自乱数を避けます。
16. 発行者を明確にします。
17. 所有者も明確にします。
18. 利用主体を限定します。
19. 権限を最小化します。
20. 保存場所を管理します。
21. Source codeへ埋め込みません。
22. Repositoryへ置きません。
23. 設定Fileにも注意します。
24. Secret managerも使えます。
25. Hardware保護も選択肢です。
26. 利用時の露出を減らします。
27. Logへ出力しません。
28. Error messageにも注意します。
29. Process環境も確認します。
30. Backup内のSecretも守ります。
31. Distributionを追跡します。
32. 誰へ渡したか把握します。
33. 自動配布を使う場合があります。
34. 短命Credentialも有効です。
35. 固定Secretを減らせます。
36. Rotationを設計します。
37. 更新可能性を事前に確認します。
38. 一斉失効へ備えます。
39. 古いSecretを残しません。
40. 侵害時は即時失効を考えます。
41. 依存Systemを把握します。
42. 交換順序も設計します。
43. 失効で障害を起こさないようにします。
44. 緊急時の鍵交換も演習します。
45. 利用状況を監視します。
46. 未使用Secretを検出します。
47. 期限切れを監視します。
48. 権限超過も見直します。
49. 破棄を確認します。
50. Lifecycle全体を自動化と監査で支えます。

## 注意

Rotation間隔などの固定値は用途ごとに異なります。自動化は目的ではなく、安全な更新と失効を確実にするために使います。

## 出典

- [NIST SP 800-57 Part 1 Rev.5 Key Management](https://csrc.nist.gov/pubs/sp/800/57/pt1/r5/final)
- [NIST SP 800-63B-4 Authentication and Authenticator Management](https://csrc.nist.gov/pubs/sp/800/63/b/4/final)
- [IPA 新試験制度のシラバス案について](https://www.ipa.go.jp/shiken/syllabus/henkou/2026/20260630.html)
