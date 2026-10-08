# 共通鍵・公開鍵・ハッシュ・MAC

Status: COMPLETE v0.1
Created: 2026-10-08

## 学習目標

暗号化、Hash、MAC、公開鍵暗号を同じものとして扱わず、それぞれが何を保証し、何を保証しないか説明できるようにします。

## 本文

1. 暗号技術は目的から選びます。
2. 秘密にする目的があります。
3. 改ざん検知の目的もあります。
4. 相手確認の目的もあります。
5. 共通鍵暗号があります。
6. 同じ秘密鍵を共有します。
7. 暗号化と復号に使います。
8. 高速に処理しやすい特徴があります。
9. 鍵共有が課題になります。
10. 公開鍵暗号があります。
11. 公開鍵と秘密鍵を使います。
12. 用途によって役割が異なります。
13. 大容量Dataを直接扱わない場合もあります。
14. Hybrid方式が一般的です。
15. 公開鍵技術で鍵を扱います。
16. 共通鍵でDataを暗号化します。
17. Hashは一方向の要約を作ります。
18. 復号するものではありません。
19. 同じ入力から同じDigestを作ります。
20. 変更検知に使えます。
21. Hashだけでは送信者を証明しません。
22. 攻撃者もHashを計算できるからです。
23. MACは秘密鍵を使います。
24. Messageの完全性を確認します。
25. 共有秘密の保有も確認できます。
26. Digital signatureとは別です。
27. 暗号化も完全性を自動保証しません。
28. Mode選択が重要です。
29. 認証付き暗号があります。
30. 機密性と完全性を組み合わせます。
31. NonceやIVが必要な方式があります。
32. 再利用が危険な方式もあります。
33. Libraryの規則に従います。
34. 独自の乱数設計を避けます。
35. 鍵長だけで安全性を決めません。
36. Algorithmの状態を確認します。
37. 実装も重要です。
38. 鍵管理も重要です。
39. Side channelも実装リスクです。
40. Protocol全体で安全性を見ます。
41. 暗号があっても認可は必要です。
42. 暗号があってもEndpointは守ります。
43. 暗号があってもBackupは必要です。
44. 古いAlgorithmから移行します。
45. Crypto agilityを考えます。
46. 置換可能な構成にします。
47. Data formatも移行に影響します。
48. 鍵の所在も把握します。
49. 目的とPrimitiveを対応させます。
50. 暗号を魔法の安全装置にしません。

## 注意

暗号アルゴリズムを独自実装しません。利用時点で承認されたAlgorithm、Mode、Library、Platform guidanceを確認します。

## 出典

- [NIST FIPS 197 Advanced Encryption Standard](https://csrc.nist.gov/pubs/fips/197/final)
- [NIST FIPS 180-4 Secure Hash Standard](https://csrc.nist.gov/pubs/fips/180-4/upd1/final)
- [NIST SP 800-57 Part 1 Rev.5 Key Management](https://csrc.nist.gov/pubs/sp/800/57/pt1/r5/final)
- [IPA 新試験制度のシラバス案について](https://www.ipa.go.jp/shiken/syllabus/henkou/2026/20260630.html)
