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

## 注意

この章は基礎理解用です。
特定クラウド事業者、特定LLM、特定フレームワークの最新仕様を説明する教材ではありません。
製品固有の仕様や現在の制約は、利用時点の公式資料で確認します。

## 出典

- [NIST AI 600-1: Generative Artificial Intelligence Profile](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence)
- [OWASP GenAI LLM Top 10 2026](https://genai.owasp.org/resource/owasp-genai-llm-top-10-2026/)
