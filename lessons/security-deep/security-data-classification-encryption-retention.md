# データ分類・暗号化・保持・廃棄

Status: COMPLETE v0.1
Created: 2026-10-08

## 学習目標

「全Dataを暗号化」だけで終わらず、必要性、Sensitivity、利用目的、保管期間、共有先、復旧要件を結び付けて保護策を設計できるようにします。

## 本文

1. DataにもLifecycleがあります。
2. 生成から廃棄まで追います。
3. まずDataを把握します。
4. 所在を把握します。
5. 所有者を決めます。
6. 利用目的を確認します。
7. Sensitivityを分類します。
8. 公開可能なDataがあります。
9. 内部限定Dataがあります。
10. 機密Dataもあります。
11. 分類は組織ごとに定義します。
12. Labelだけで終わりません。
13. 取扱規則へ結び付けます。
14. Access controlを変えます。
15. 共有方法を変えます。
16. Encryption要件も変えます。
17. Retentionも変えます。
18. 通信中のDataを守ります。
19. TLSなどを使います。
20. 保存中のDataも守ります。
21. Storage encryptionを使えます。
22. アプリ層での暗号化もあります。
23. 用途に応じて選びます。
24. 鍵の所在を分けて考えます。
25. 暗号化と認可は別です。
26. 暗号化済みでも過剰権限は危険です。
27. Data minimizationも重要です。
28. 不要なDataを集めません。
29. 不要な複製を減らします。
30. Test環境へのCopyにも注意します。
31. Maskingを使う場合があります。
32. Tokenizationも選択肢です。
33. 匿名化とは目的が異なります。
34. BackupもDataの一部です。
35. 同じ分類で保護します。
36. 復元権限を管理します。
37. Archiveも忘れません。
38. 外部共有を追跡します。
39. 委託先の保護も確認します。
40. Cross borderも確認対象です。
41. Retention期限を決めます。
42. 理由なく永久保存しません。
43. Legal holdは別管理します。
44. 削除手順を設計します。
45. Replicaも考慮します。
46. Backupからの残存も考えます。
47. Cryptographic erasure
48. 鍵の破棄による消去もあります。
49. 廃棄証拠を残す場合があります。
50. Data flowを定期的に見直します。
51. 分類と保護をLifecycleで連動させます。

## 注意

法定保存期間や個人情報の具体的要件はData種別と法域で異なります。対象法令・契約・業界基準を個別に確認します。

## 出典

- [NIST SP 800-57 Part 1 Rev.5 Key Management](https://csrc.nist.gov/pubs/sp/800/57/pt1/r5/final)
- [NIST FIPS 197 Advanced Encryption Standard](https://csrc.nist.gov/pubs/fips/197/final)
- [IPA 新試験制度のシラバス案について](https://www.ipa.go.jp/shiken/syllabus/henkou/2026/20260630.html)
