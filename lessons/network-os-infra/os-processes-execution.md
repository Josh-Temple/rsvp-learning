# OS・Process・Threadとプログラム実行

Status: COMPLETE v0.1
Created: 2026-09-29

## 学習目標

プログラムとProcessを区別し、PID、Thread、仮想アドレス空間、File Descriptor、環境変数、親子関係、終了状態を、OSによる資源管理と結び付けて説明できるようにします。

## 本文

1. OSはハードウェア資源を管理します。
2. CPUやMemoryを割り当てます。
3. DeviceやFileも管理します。
4. アプリへ共通の仕組みを提供します。
5. Programは保存された命令です。
6. Processは実行中の状態です。
7. 同じProgramを複数実行できます。
8. ProcessごとにPIDがあります。
9. 実行状態もProcessごとです。
10. 仮想Address空間を持ちます。
11. 開いているFileも管理されます。
12. File Descriptorで参照します。
13. SocketもFDとして扱えます。
14. 環境変数もProcessへ渡せます。
15. Current Directoryも状態です。
16. 権限情報も実行へ影響します。
17. ThreadはProcess内で実行します。
18. 複数Threadを持てます。
19. 同じ資源を共有する部分があります。
20. 共有には競合も生じます。
21. OSはCPU時間を割り当てます。
22. すべてが同時実行とは限りません。
23. 待ち状態になる場合があります。
24. 入出力待ちもあります。
25. CPU使用率だけで判断しません。
26. Memory待ちやIOも見ます。
27. 親Processから子が生まれます。
28. Linuxではforkが使われます。
29. execで別Programを読み込めます。
30. 二つは別の操作です。
31. ShellもProcessを起動します。
32. Command実行後に待つ場合があります。
33. Background実行もあります。
34. Processは終了Statusを返せます。
35. 成功と失敗の判断に使えます。
36. 異常終了もあります。
37. Signalで通知を受ける場合があります。
38. 停止と強制終了は同じではありません。
39. ServiceもProcessとして動きます。
40. 監督機構が再起動する場合があります。
41. Processがあるだけで正常とは限りません。
42. 応答できるかも確認します。
43. PIDが変わる場合があります。
44. 再起動なら別Processです。
45. 状態を名前だけで追いません。
46. ログや資源使用量も見ます。
47. OSは隔離と共有を両立します。
48. Process単位で実行を捉えます。

## 注意

この章はOSとProcessの概念理解用です。fork/exec、Thread、Scheduler、Service管理の具体的挙動はOSや実装によって異なります。Linux固有の観察方法は後続章で扱います。

## 出典

- [The /proc Filesystem — Linux Kernel documentation](https://docs.kernel.org/filesystems/proc.html)
- [Memory Management — Linux Kernel documentation](https://docs.kernel.org/admin-guide/mm/)
