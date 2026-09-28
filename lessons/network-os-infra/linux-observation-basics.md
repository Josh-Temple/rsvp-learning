# Linuxの基本操作とシステム観察

Status: COMPLETE v0.1
Created: 2026-09-29

## 学習目標

ShellとCommandの関係、Current Directory、PATH、標準入出力、Pipeline、Exit Status、Permissionを理解し、Process・Memory・Filesystem・Networkの状態を安全に観察する基本的な考え方を説明できるようにします。

## 本文

1. ShellはCommandを解釈します。
2. Bashは代表的なShellです。
3. ShellとTerminalは別物です。
4. Terminalは入出力の窓口です。
5. CommandはProgramの場合があります。
6. Shell組込みの場合もあります。
7. Current Directoryを意識します。
8. pwdで場所を確認できます。
9. cdで移動します。
10. lsで一覧を確認できます。
11. 絶対Pathと相対Pathがあります。
12. 相対Pathは現在地に依存します。
13. PATHはCommand探索に使われます。
14. 同名Commandでも場所を確認します。
15. File内容はcatなどで見られます。
16. 長文はlessが便利です。
17. grepで文字列を探せます。
18. Pipeで出力を次へ渡せます。
19. 標準入力をつなげます。
20. 標準出力をRedirectできます。
21. 標準Errorは別経路です。
22. Exit Statusで結果を判断できます。
23. 表示がなくても成功とは限りません。
24. ScriptではStatusを確認します。
25. Permissionは読書実行を制御します。
26. 所有者やGroupも関係します。
27. Root権限は影響が大きいです。
28. 必要以上に昇格しません。
29. psでProcessを見られます。
30. PIDとCommandを対応づけます。
31. /procでもProcessを観察できます。
32. Memory情報も確認できます。
33. dfでFilesystem容量を見られます。
34. duで使用量を調べられます。
35. 両者は見る対象が違います。
36. Network状態も観察します。
37. 利用可能なToolは環境で違います。
38. ssなどでSocketを見られます。
39. 名前解決も別に確認します。
40. Logの場所も環境で違います。
41. systemdではjournalも使います。
42. 一つのCommandだけで断定しません。
43. 時刻と対象をそろえて観察します。
44. 変更前に状態を記録します。
45. 変更後に差を確認します。
46. 読み取りから調査を始めます。
47. 破壊的Commandを急いで使いません。
48. 観察結果を層ごとに整理します。
49. ProcessとNetworkをつなげて見ます。
50. 基盤全体を小さく切り分けます。

## 注意

この章はLinux観察の入口です。利用可能なCommand、Option、Service管理、Log管理はDistributionや環境で異なります。変更系Commandは対象環境の手順を確認してから実行します。

## 出典

- [GNU Bash Reference Manual](https://www.gnu.org/software/bash/manual/bash.html)
- [GNU Coreutils Manual](https://www.gnu.org/software/coreutils/manual/coreutils.html)
- [The /proc Filesystem — Linux Kernel documentation](https://docs.kernel.org/filesystems/proc.html)
- [Filesystem Hierarchy Standard 3.0](https://specifications.freedesktop.org/fhs/latest/)
