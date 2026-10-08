# メール・SPF・DKIM・DMARC

Status: COMPLETE v0.1
Created: 2026-10-08

## 学習目標

SPFを設定したからフィッシングが防げると誤解せず、認証結果、Alignment、Policy、Reportを運用へつなげられるようにします。

## 本文

1. Emailには複数のDomainがあります。
2. 利用者に見えるFromがあります。
3. 配送用のDomainもあります。
4. SPFは送信Hostを認可します。
5. Domainが許可した送信元を確認します。
6. DNSへPolicyを公開します。
7. SPFだけでは見えるFromを保証しません。
8. 転送で課題が出る場合があります。
9. DKIMはMessageへ署名します。
10. 送信Domainが署名します。
11. 公開鍵をDNSで取得します。
12. Message変更を検出できます。
13. 署名Domainを確認できます。
14. 見えるFromとは別の場合があります。
15. DMARCはAlignmentを使います。
16. 見えるFromとの整合を確認します。
17. SPFまたはDKIM結果を利用します。
18. Policyを公開できます。
19. 失敗Mailの扱いを示します。
20. Reportも受け取れます。
21. 2026年にRFC 9989が公開されました。
22. 旧RFC 7489を置き換えます。
23. いきなり強いPolicyにしません。
24. 正規送信元を棚卸しします。
25. Mail serviceを把握します。
26. Marketing serviceも確認します。
27. Ticket systemも確認します。
28. 委託先送信も確認します。
29. SPF recordを管理します。
30. DKIM keyも管理します。
31. Key rotationも行います。
32. Reportを分析します。
33. 誤設定を見つけます。
34. 不正送信の兆候も見ます。
35. DMARCは全Phishingを防ぎません。
36. 似たDomainは別問題です。
37. 侵害済み正規Accountも別問題です。
38. Display name spoofin
39. gも残ります。
40. Content検査も必要です。
41. 利用者報告も必要です。
42. URL防御も組み合わせます。
43. MFAも組み合わせます。
44. BEC対策は業務手順も必要です。
45. 送信側と受信側を分けて考えます。
46. Domain reputationも
47. 補助情報です。
48. Mail logを保持します。
49. 認証結果を観測します。
50. 変更時に再確認します。
51. Mail認証を継続運用します。

## 注意

DMARCは2026年5月のRFC 9989がRFC 7489を置き換えています。設定変更は正規送信経路の棚卸しと段階的なPolicy適用を前提にします。

## 出典

- [IETF RFC 7208 Sender Policy Framework](https://www.rfc-editor.org/info/rfc7208/)
- [IETF RFC 6376 DKIM Signatures](https://www.rfc-editor.org/info/rfc6376/)
- [IETF RFC 9989 DMARC](https://www.rfc-editor.org/info/rfc9989/)
- [IPA 新試験制度のシラバス案について](https://www.ipa.go.jp/shiken/syllabus/henkou/2026/20260630.html)
