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
24. Secret managerを
25. 使う場合があります。
26. Hardware保護も選択肢です。
27. 利用時の露出を減らします。
28. Logへ出力しません。
29. Error messageにも注意します。
30. Process環境も確認します。
31. Backup内のSecretも守ります。
32. Distributionを追跡します。
33. 誰へ渡したか把握します。
34. 自動配布を使う場合があります。
35. 短命Credentialも有効です。
36. 固定Secretを減らせます。
37. Rotationを設計します。
38. 更新可能性を事前に確認します。
39. 一斉失効へ備えます。
40. 古いSecretを残しません。
41. 侵害時は即時失効を考えます。
42. 依存Systemを把握します。
43. 交換順序も設計します。
44. 失効で障害を起こさないようにします。
45. Emergency rotationも
46. 演習します。
47. 利用状況を監視します。
48. 未使用Secretを検出します。
49. 期限切れを監視します。
50. 権限超過も見直します。
51. 破棄を確認します。
52. Lifecycle全体を自動化と監査で支えます。

## 注意

Rotation間隔などの固定値は用途ごとに異なります。自動化は目的ではなく、安全な更新と失効を確実にするために使います。

## 出典

- [NIST SP 800-57 Part 1 Rev.5 Key Management](https://csrc.nist.gov/pubs/sp/800/57/pt1/r5/final)
- [NIST SP 800-63B-4 Authentication and Authenticator Management](https://csrc.nist.gov/pubs/sp/800/63/b/4/final)
- [IPA 新試験制度のシラバス案について](https://www.ipa.go.jp/shiken/syllabus/henkou/2026/20260630.html)
