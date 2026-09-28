# RAGの基本

Status: COMPLETE v0.1
Created: 2026-09-27

## 学習目標

外部資料を検索し、回答生成へ利用するRAGの構成と限界を学びます。

## 本文

1. RAGは、外部情報を検索して生成へ利用する方法です
2. Retrieval Augmented Generationの略です
3. 最初に、参照対象となる文書を準備します
4. 文書を検索しやすい単位へ分割します
5. 検索では、質問に関係する部分を探します
6. Embeddingを使った意味検索が使われることがあります
7. キーワード検索と組み合わせる方法もあります
8. 取得した文章を、LLMのコンテキストへ渡します
9. LLMは、その情報を使って回答を生成します
10. 検索に失敗すれば、生成も正確になりにくくなります
11. RAGは、モデルへ知識を完全に覚えさせる方法ではありません
12. 権限のない文書を検索対象へ入れないことが重要です
13. 引用や出典を返す設計も有効です
14. RAGでは、検索品質と生成品質を分けて確認します
15. 利用者が必要書類を尋ねたら、まず関連する手引きの箇所を検索します。
16. 見つけた文書が別の申請種別なら、もっともらしい回答でも誤りです。
17. 検索結果の適合性、版、日付を確認してから回答を作ります。
18. 根拠が不足すれば人へ引き継ぐ設計にします。
19. 誤答が出たときは検索、選択、生成のどこで失敗したか分けて調べます。

## 注意

この章は基礎理解用です。
特定クラウド事業者、特定LLM、特定フレームワークの最新仕様を説明する教材ではありません。
製品固有の仕様や現在の制約は、利用時点の公式資料で確認します。

## 出典

- [OWASP GenAI LLM Top 10 2026](https://genai.owasp.org/resource/owasp-genai-llm-top-10-2026/)
- [NIST AI 600-1: Generative Artificial Intelligence Profile](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence)
