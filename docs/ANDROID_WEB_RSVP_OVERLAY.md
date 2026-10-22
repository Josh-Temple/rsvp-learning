# Android Web RSVP Overlay — proof of concept

## Purpose

Android Chromeで通常のWebページを閲覧したまま、そのページの下部にRSVPプレイヤーを重ねて表示できるかを実機検証する。

教材JSONを使う既存RSVPプレイヤーとは分離する。任意Webページの本文抽出・自動分割は、レビュー済み教材のチャンク品質とは別物として扱う。

## Baseline

- base branch: `main`
- baseline SHA: `1fffa341f7b86e41050c192ffba7de2bdc008c8c`
- existing RSVP app: curated lesson JSONを読み、事前に作成済みのchunksを表示する
- existing content rule: 教材生成時に意味単位へ分割し、アプリ内では日本語形態素解析を行わない

今回のWeb Readerはこの原則を変更しない。Web Readerだけが、任意ページ向けのbest-effortな自動分割を行う。

## Chosen experiment

最初の実験はChrome拡張ではなく、自己完結型のbookmarkletとする。

理由:

1. Android版Chrome自体は通常のChrome拡張機能を利用する前提ではない。
2. bookmarkletなら現在のページDOMへ直接アクセスでき、元ページを離れずに固定パネルを挿入できる。
3. 外部スクリプトを読み込まない自己完結型にすれば、外部script読み込みを禁止するCSPの影響を減らせる。
4. 成立しなかった場合でも、Web Readerの本文抽出・分割・プレイヤーUIの知見はuserscriptやAndroidアプリへ移植できる。

Android Chromeでのbookmarklet起動方法は正式な主要UIとして保証されていないため、現段階では実験扱いとする。

## Files

- `web-reader/bookmarklet.js`
  - 現在ページで実行する自己完結型スクリプト
  - ページ下部にShadow DOMでRSVPパネルを挿入
- `web-reader/index.html`
  - bookmarkletコードをコピーするための導入ページ
  - Android Chrome向け手順を表示

## Text acquisition

優先順位:

1. 現在の選択テキストが20文字以上なら、その選択範囲
2. `article`
3. `main`
4. `[role=main]`
5. `body`

本文候補は主に次の要素から取得する。

- h1
- h2
- h3
- p
- blockquote
- li

`nav`、`header`、`footer`、`aside`、`form`、`dialog`、`aria-hidden=true` 配下は除外する。

これはReadability相当の厳密な本文抽出ではない。最初の実機検証でWikipedia・ニュース記事・GitHub README等の誤抽出を確認し、その後に抽出方法を強化する。

## Chunking

任意Webページには事前レビュー済みのchunksがないため、Web Readerではbest-effortな自動分割を行う。

処理:

1. 改行と文末記号で文へ分割
2. 読点等で節へ分割
3. `Intl.Segmenter("ja", { granularity: "word" })` が使える場合は語境界を利用
4. 9文字前後を目安にまとめ、原則14文字程度までに抑える
5. 長い語句は完全には保証せず、必要時のみ追加分割

この出力を「教材として意味単位レビュー済み」とは扱わない。

## Player behavior

- ページ下部へ固定表示
- Shadow DOMで元ページCSSとの衝突を抑制
- 再生 / 一時停止
- 1チャンク戻る / 進む
- 0.6〜10.0倍
- 進捗表示
- 閉じる
- 再度bookmarkletを起動した場合は既存パネルを閉じる
- target pageのlocalStorageへは書き込まない
- 外部通信を行わない

## Security / privacy boundary

bookmarkletは実行したページのDOMへアクセスできる。したがって、ログイン後の画面や個人情報を含むページで実行すれば、その表示テキストへアクセス可能である。

このPoCは取得テキストを外部送信しない。ネットワークAPI、analytics、外部script、外部fontを使用しない。

本番化する場合も、「ページ本文を外部へ送る機能」を追加する場合は別途明示的な設計判断と利用者確認を必要とする。

## Android device test

最低限、次をAndroid Chrome実機で確認する。

### A. 起動

- [ ] `web-reader/` でbookmarklet文字列をコピーできる
- [ ] Android ChromeのブックマークURLへ保存できる
- [ ] 閲覧中ページのアドレスバーからbookmark名を検索して実行できる
- [ ] 実行後も元ページから遷移しない

### B. Wikipedia

- [ ] 記事本文が取得される
- [ ] Wikipediaのナビゲーションやフッターが大量に混入しない
- [ ] 下部パネルがスクリーンショットで確認したようにページ上へ重なる
- [ ] ページ自体はスクロール可能
- [ ] RSVP再生中もパネルが下部に固定される

### C. selected text

- [ ] ページ内で文章を選択してから起動すると選択範囲だけが対象になる

### D. playback

- [ ] play / pause
- [ ] ← / →
- [ ] 0.6倍
- [ ] 1倍
- [ ] 8倍前後
- [ ] 10倍
- [ ] 最終チャンクで停止
- [ ] close後に元ページ操作へ戻れる

### E. failure cases

- [ ] SPA
- [ ] GitHub README
- [ ] ニュース記事
- [ ] 非日本語ページ
- [ ] 本文がほぼないページ
- [ ] CSPが厳しいページ

## Decision after device test

### Continue with bookmarklet

次を満たす場合:

- Android Chromeで安定して起動できる
- 主要な閲覧ページで本文抽出が実用範囲
- bookmarkletサイズが保存・実行上の問題にならない
- UI操作が既存RSVPと大きく乖離しない

### Move to another delivery mechanism

次のどれかが主要障害なら、Web Readerロジックを維持して配布方式のみ変更する。

- bookmarklet起動手順が不安定
- URL長や保存制限
- CSP等で実行不能なサイトが多い
- より自然なワンタップ起動が必要

候補:

- userscript対応ブラウザ
- 拡張機能対応Androidブラウザ
- Androidネイティブアプリ / overlay
- share target + PWA（同一ページ上overlayが不要な場合）

## Non-goals for this PoC

- 教材JSONへWebページを保存する
- AIによる意味単位分割
- Webページ内容の外部送信
- 学習履歴への統合
- Learn / Listenとの統合
- Chrome拡張版の実装
- Readability等の外部ライブラリ導入
