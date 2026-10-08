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
22. Application level暗号も
23. あります。
24. 用途に応じて選びます。
25. 鍵の所在を分けて考えます。
26. 暗号化と認可は別です。
27. 暗号化済みでも過剰権限は危険です。
28. Data minimizationも重要です。
29. 不要なDataを集めません。
30. 不要な複製を減らします。
31. Test環境へのCopyにも注意します。
32. Maskingを使う場合があります。
33. Tokenizationも選択肢です。
34. 匿名化とは目的が異なります。
35. BackupもDataの一部です。
36. 同じ分類で保護します。
37. 復元権限を管理します。
38. Archiveも忘れません。
39. 外部共有を追跡します。
40. 委託先の保護も確認します。
41. Cross borderも確認対象です。
42. Retention期限を決めます。
43. 理由なく永久保存しません。
44. Legal holdは別管理します。
45. 削除手順を設計します。
46. Replicaも考慮します。
47. Backupからの残存も考えます。
48. Cryptographic erasur
49. eもあります。
50. 廃棄証拠を残す場合があります。
51. Data flowを定期的に見直します。
52. 分類と保護をLifecycleで連動させます。

## 注意

法定保存期間や個人情報の具体的要件はData種別と法域で異なります。対象法令・契約・業界基準を個別に確認します。

## 出典

- [NIST SP 800-57 Part 1 Rev.5 Key Management](https://csrc.nist.gov/pubs/sp/800/57/pt1/r5/final)
- [NIST FIPS 197 Advanced Encryption Standard](https://csrc.nist.gov/pubs/fips/197/final)
- [IPA 新試験制度のシラバス案について](https://www.ipa.go.jp/shiken/syllabus/henkou/2026/20260630.html)
