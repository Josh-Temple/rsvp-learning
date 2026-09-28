# Structured Output・Workflow・Human-in-the-loop

Status: COMPLETE v0.1
Created: 2026-09-27

## 学習目標

AI出力を業務処理へ安全につなぐための構造化出力、決定的処理、人間確認を学びます。

## 本文

1. 業務システムでは、自由文だけでは扱いにくい場合があります
2. Structured Outputは、出力形式をあらかじめ定める方法です
3. 例えば、項目名と値を持つJSONとして出力できます
4. 形式が決まると、後続処理へ渡しやすくなります
5. ただし、形式が正しくても内容が正しいとは限りません
6. AI判断と、通常のプログラム処理を分けることが重要です
7. 決定ルールが明確な部分は、プログラムで処理できます
8. 曖昧な分類や要約は、LLMが適する場合があります
9. Workflowは、複数の処理を決めた順序でつなぎます
10. 重要な判断には、人間確認を入れることがあります
11. これが、Human-in-the-loopです
12. 高リスクな処理ほど、人間確認の価値が高くなります
13. 人間確認の結果も、後から追えるようにします
14. AIと決定的処理と人間判断の境界を設計します
15. 申請書から氏名と期限を抽出し、定型の項目へ入れるとします。
16. 抽出結果が空欄や不正な日付なら、次の処理へ進めません。
17. 形式の検証に通っても、原本と異なる値は人が確認します。
18. 却下通知や外部送信の前には承認者と記録を定めます。
19. 機械が候補を作る工程と、人が責任を持って確定する工程を分けます。

## 注意

この章は基礎理解用です。
特定クラウド事業者、特定LLM、特定フレームワークの最新仕様を説明する教材ではありません。
製品固有の仕様や現在の制約は、利用時点の公式資料で確認します。

## 出典

- [NIST AI 600-1: Generative Artificial Intelligence Profile](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence)
- [OWASP GenAI LLM Top 10 2026](https://genai.owasp.org/resource/owasp-genai-llm-top-10-2026/)
