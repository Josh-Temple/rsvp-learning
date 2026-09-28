# Memory・Filesystem・Storageの基本

Status: COMPLETE v0.1
Created: 2026-09-29

## 学習目標

Processの仮想Memoryと物理Memory、Page、Swap、File、Directory、Filesystem、Mount、Cacheの役割を区別し、Memory不足とStorage不足を別々に診断できるようにします。

## 本文

1. Processは仮想Memoryを使います。
2. 各Processに独立した空間を見せます。
3. 物理RAMと同じではありません。
4. Page単位で管理されます。
5. 必要なPageを割り当てます。
6. 未使用Pageを回収します。
7. File内容をMemoryへMapできます。
8. 共有するPageもあります。
9. CacheにもRAMを使います。
10. 空きRAMが少ないだけで異常とは限りません。
11. 再利用可能なCacheもあります。
12. Memory不足時は回収が起きます。
13. Swapを使う構成もあります。
14. Storageへ一部を退避します。
15. SwapはRAMと同じ速度ではありません。
16. 過剰なSwapは遅延を生みます。
17. 不足が深刻なら終了処理もあり得ます。
18. FilesystemはFileを整理します。
19. Directoryで名前を階層化します。
20. 名前と実体は同じ概念ではありません。
21. 権限やMetadataも持ちます。
22. Fileの大きさだけが情報ではありません。
23. 複数FilesystemをMountできます。
24. 一つの木構造へ接続します。
25. 別Deviceでも同じ階層に見えます。
26. Mount先の違いを意識します。
27. 空き容量はFilesystemごとに見ます。
28. 一箇所不足でも全体は空いて見えます。
29. File削除と空き容量は直結しません。
30. 開いたProcessが保持する場合があります。
31. 書込みはCacheされる場合があります。
32. Application完了と永続化は別です。
33. 同期処理が必要な場合があります。
34. 障害耐性は構成で変わります。
35. Backupとも別の概念です。
36. 正常なFSでもBackupは必要です。
37. /procは通常Fileとは性質が違います。
38. Kernel情報を見せる擬似FSです。
39. Process情報も確認できます。
40. Memory使用量も観察できます。
41. Memory不足とDisk不足を分けます。
42. 症状は似る場合があります。
43. Process停止の原因を分解します。
44. 容量と性能も分けて見ます。
45. Cacheが性能を助けます。
46. ただし整合性との関係もあります。
47. 永続化の保証範囲を確認します。
48. 資源の層を分けて理解します。

## 注意

この章はOS資源管理の基礎です。Memory管理、Filesystem、書込み保証、Mount方式はOS・Filesystem・Storage装置ごとに異なります。具体的な耐障害性は利用環境で確認します。

## 出典

- [Memory Management — Linux Kernel documentation](https://docs.kernel.org/admin-guide/mm/)
- [The /proc Filesystem — Linux Kernel documentation](https://docs.kernel.org/filesystems/proc.html)
- [Filesystem Hierarchy Standard 3.0](https://specifications.freedesktop.org/fhs/latest/)
