# Learn 読み上げパイロット — 2026-09-27

## 目的

RSVP教材と同じリポジトリから、Androidで耳から学べるLearn版を提供できるかを検証した。

対象チャプター:
- `api-authentication-authorization`
- Learnページ: `learn/api-authentication-authorization.html`

本番:
- `https://rsvp-learning-kappa.vercel.app/learn/api-authentication-authorization.html`

## 検証した方式

### 1. Chrome標準「このページを読み上げ」

最初に、通常の静的HTMLをHTTPSで公開し、Android Chromeの標準「このページを読み上げ」を使う方式を試した。

ページ側では次を満たした。

- HTTPSのProduction Domainで公開
- `lang="ja"`
- 本文はJavaScript生成ではなく通常のHTMLテキスト
- `main` / `article` / `h1` / `h2` / `p` を中心とした単純な構造
- 読み上げ対象本文を十分な連続文章として配置

同じAndroid ChromeではWikipediaに「このページを読み上げ」が表示されたが、RSVPのLearnページでは表示されなかった。

したがって、端末やChrome自体の機能不足ではなく、Chrome側のreadability判定に依存している可能性が高い。

### 結論

Chrome標準読み上げは、ページ側から確実に有効化できないため、Learn機能の中核にはしない。

補助的に使える場合は使ってよいが、必須経路にはしない。

## 2. Web Speech API

次に、Learnページ内へ独自の読み上げプレイヤーを実装した。

使用API:
- `window.speechSynthesis`
- `SpeechSynthesisUtterance`

現在の機能:
- 再生
- 一時停止
- 停止
- 0.7〜2.0倍速
- 利用可能な日本語音声の選択
- 見出し・段落単位の順次読み上げ
- 現在読み上げ中の要素をハイライト

本文は `h1`, `h2`, `p` を順番にキューへ送り、長い全文を一つのutteranceにしない。

## Android実機結果

Android Chromeでページ内読み上げは正常に動作した。

ただし、Chromeを前面で開いていない状態では読み上げが止まる。

現時点の評価:
- 前面利用: 実用上の及第点
- 画面OFF・他アプリ利用中の継続再生: 未達
- Huxeのような完全なバックグラウンド再生: 現方式だけでは実現していない

## 現時点の設計判断

Learnの読み上げは、当面Web Speech APIを標準経路とする。

Chrome標準「このページを読み上げ」は、利用可能なページでは補助的に使えるが、可用性を前提にしない。

RSVPとLearnは同じ教材群・同じリポジトリに置く。

- RSVP: 高速視覚学習
- Learn: 連続読み上げ向け文章
- 将来必要ならListen: ニュース・調査結果・資料要約の連続読み上げ

Learn本文はRSVPチャンクをそのまま読ませるのではなく、耳だけで理解できる連続文章へ再構成する。

## Learn文章の運用ルール

- 意図的な回答待ちや長いポーズを入れない
- 全体像から詳細へ進む
- 概念の後に具体例を置く
- 似た概念との違いを言葉で明示する
- 重要概念は別の文脈から自然に再登場させる
- 表や画面位置に依存した説明を避ける
- 英字略語は読み上げで不自然にならないよう配慮する
- 本文は静的HTMLとしても読める状態を維持する

## Vercel運用上の知見

検証にはPreview DeploymentではなくProduction Domainを使う。

Preview Deploymentは認証保護や `X-Robots-Tag: noindex` など、本番と異なる条件が入る場合があり、Chrome標準読み上げの検証対象として適切でない。

本番URL:
- `https://rsvp-learning-kappa.vercel.app/`

## 今後の検討

現状で前面利用は成立しているため、まずは実使用を優先する。

バックグラウンド再生が必要になった場合に、次を別途検討する。

- 音声ファイルを生成してHTML5 audioで再生する方式
- PWA / Media Sessionを含むバックグラウンド再生対応
- TTS生成サービスまたはサーバー側音声生成
- 再生位置の永続化
- Course単位のLearn連続再生

ただし、現時点では複雑化させず、Web Speech API版を使って利用感を確認する。
