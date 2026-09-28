# REST APIとJSON

Status: COMPLETE v0.1
Created: 2026-09-27

## 学習目標

REST APIの基本的な考え方と、データ交換形式JSONの読み方を学びます。

## 本文

1. 申請一覧を取得する要求を送ると、サーバーはJSONで申請IDと状態を返すとします。
2. 新規作成では必要な項目を送信し、成功時は作られた資源を示します。
3. APIは、ソフトウェア同士の接点です
4. RESTは、Web APIで広く使われる設計上の考え方です
5. 資源を、URLで表すことがあります
6. HTTPメソッドで、操作の種類を表します
7. 例えば、顧客一覧をGETで取得できます
8. 新しい顧客をPOSTで登録する設計もあります
9. URLとHTTPメソッドを使うだけで、RESTの原則をすべて満たすとは限りません
10. 名前より、一貫したAPI設計が重要です
11. JSONは、データ交換でよく使われる形式です
12. オブジェクトは、キーと値の組で表します
13. JSONの申請IDと状態を読めても、その要求が取得か作成かはHTTPの方法とURLで決まります。
14. 配列は、複数の値を順番に持ちます
15. 文字列、数値、真偽値、nullなどを扱えます
16. API仕様では、入力と出力の形を明確にします
17. エラー時の応答も、API仕様の一部です
18. 見つからないIDと権限のないIDは扱いが違います。
19. HTTPの方法、URL、状態コード、応答の形を合わせて確認します。
20. JSONの形だけで操作の意味は決まりません。
21. 応答の形と状態コードを合わせて読むと、成功と失敗を区別できます。

## 次に確認したいこと

この章は基礎理解用です。
具体的な製品仕様、組織固有の工程名、法令上の要件は、この章だけで確定しません。
必要に応じて公式資料・一次資料で確認します。

## 出典

- [Roy T. Fielding: REST Architectural Style](https://ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm)
- [RFC 8259: The JavaScript Object Notation (JSON) Data Interchange Format](https://www.rfc-editor.org/info/rfc8259)
- [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110)
