# コスト・速度・セキュリティ

Status: COMPLETE v0.1
Created: 2026-09-27

## 学習目標

生成AIアプリを実運用する際のコスト、レイテンシ、データ保護、障害時設計を学びます。

## 本文

1. 生成AIアプリでは、品質だけを見ても不十分です
2. 利用量が増えると、推論コストも増えることがあります
3. 不要に長い入力や出力は、コストへ影響します
4. 応答速度も、利用体験へ影響します
5. 複数のモデルやツールを呼ぶと、待ち時間が増えることがあります
6. 重要度に応じて、モデルや処理方法を選びます
7. 入力データには、個人情報や機密情報が含まれる場合があります
8. 送信してよい情報のルールを明確にします
9. 外部ツールへ渡すデータも確認します
10. Prompt Injectionなど、AI特有の攻撃も考慮します
11. 失敗時に、安全側へ倒れる設計が必要です
12. 外部サービス障害時の代替動作も考えます
13. ログには、必要な情報を残しつつ秘密情報を避けます
14. 実運用では、品質、費用、速度、安全性のバランスを取ります

## 注意

この章は基礎理解用です。
特定クラウド事業者、特定LLM、特定フレームワークの最新仕様を説明する教材ではありません。
製品固有の仕様や現在の制約は、利用時点の公式資料で確認します。

## 出典

- [NIST AI 600-1: Generative Artificial Intelligence Profile](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence)
- [OWASP GenAI LLM Top 10 2026](https://genai.owasp.org/resource/owasp-genai-llm-top-10-2026/)
