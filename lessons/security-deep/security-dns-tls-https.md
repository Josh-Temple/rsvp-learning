# DNS・TLS・HTTPS

Status: COMPLETE v0.1
Created: 2026-10-08

## 学習目標

HTTPS表示だけで安全と判断せず、接続先、証明書検証、TLS終端、DNS、Applicationの責任を区別できるようにします。

## 本文

1. DNSは名前解決を担います。
2. Domain名を接続先へ結びます。
3. DNSとTLSは別の仕組みです。
4. DNSが正しくても通信は暗号化されません。
5. TLSがあっても名前解決は別問題です。
6. DNS改ざんを考えます。
7. 偽の応答へ誘導される場合があります。
8. DNSSECは真正性確認を支えます。
9. DNSSECは通信暗号化ではありません。
10. TLSは通信を保護します。
11. 盗聴を防ぐ目的があります。
12. 改ざんを防ぐ目的もあります。
13. 相手認証も重要です。
14. TLS 1.3があります。
15. Handshakeで条件を合意します。
16. 鍵素材を確立します。
17. 証明書を検証する場合があります。
18. 名前の一致を確認します。
19. Trust chainも確認します。
20. 期限も確認します。
21. 警告を無視しません。
22. HTTPSはHTTPをTLSで保護します。
23. URL全体の意味も確認します。
24. 似たDomainに注意します。
25. 鍵の保護も必要です。
26. TLS終端位置を把握します。
27. CDNで終端する場合があります。
28. Load balancerでも終端可能です。
29. 内部で再暗号化する場合があります。
30. 終端後の経路も評価します。
31. TLSはApplication認可をしません。
32. SQL Injectionも防ぎません。
33. XSSも防ぎません。
34. 侵害済みEndpointも救えません。
35. Server側の弱点も残ります。
36. Client側の弱点も残ります。
37. Certificate更新を自動化できます。
38. 失効や鍵漏えいにも備えます。
39. Protocol downgradeを避けます。
40. 古いProtocolを管理します。
41. 監視も行います。
42. Certificate期限を監視します。
43. TLS errorも観測します。
44. DNS変化も監視対象です。
45. 名前解決と通信保護を結びます。
46. Application保護とも組み合わせます。
47. 複数層で接続の信頼を作ります。

## 注意

2026年時点のTLS 1.3仕様はRFC 9846です。製品のProtocol設定やCipher選択は利用環境の現行Security guidanceを確認します。

## 出典

- [IETF RFC 9846 TLS 1.3](https://www.rfc-editor.org/info/rfc9846/)
- [IETF RFC 4033 DNS Security Introduction and Requirements](https://www.rfc-editor.org/info/rfc4033/)
- [IPA 新試験制度のシラバス案について](https://www.ipa.go.jp/shiken/syllabus/henkou/2026/20260630.html)
