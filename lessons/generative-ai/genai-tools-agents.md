# Tool CallingとAgent

Status: COMPLETE v0.1
Created: 2026-09-27

## 学習目標

LLMが外部ツールを使う仕組みと、複数ステップを進めるAgentの設計上の注意点を学びます。

## 本文

1. LLMは、文章を生成するだけでなく外部機能を呼び出せます
2. これを、Tool Callingとして扱います
3. 例えば、検索、計算、データ取得をツールへ任せられます
4. モデルは、用意されたツールの中から、呼び出すツール名と引数を応答として返します
5. 実際の処理は、呼び出し側のアプリがツール名と引数を確認して実行します
6. ツールの結果を、再びLLMへ返します
7. Agentでは、この判断と実行を複数回繰り返すことがあります
8. 複雑な仕事を、複数ステップへ分けられます
9. 一方で、実行回数が増えるほど失敗経路も増えます
10. 書込みや送信などの副作用には特に注意します
11. 権限を必要最小限にします
12. 重要な操作前に、人間承認を置くことがあります
13. 途中状態と実行履歴を記録すると復旧しやすくなります
14. Agentは、自律性より制御可能性を含めて設計します

## 注意

この章は基礎理解用です。
特定クラウド事業者、特定LLM、特定フレームワークの最新仕様を説明する教材ではありません。
製品固有の仕様や現在の制約は、利用時点の公式資料で確認します。

## 出典

- [OpenAI API: Function Calling](https://developers.openai.com/api/docs/guides/function-calling)
- [OpenAI API: Function Calling](https://platform.openai.com/docs/guides/function-calling)
- [OWASP GenAI LLM Top 10 2026](https://genai.owasp.org/resource/owasp-genai-llm-top-10-2026/)
- [NIST SP 800-53 Rev. 5 Update 1](https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final)
