# Course V Worker D — 非公開候補・公開境界QA（予備検証／正式QA BLOCKED）

- 記録日: 2026-10-12 JST
- Worker: D（静的構造・非公開実利用・公開境界。内容の独立C受入は担当外）
- 判定: **BLOCKED**（A/Bの最終候補full SHAおよびB引渡しが未成立。以下は予備的な静的検証のみ）
- Wave指示: `/RSVP Learning/Work Instructions/2026-10-12_security_course_v_f08_dst_repair_independent_reacceptance_and_release_readiness_wave_instructions.md`
- Repository: `Josh-Temple/rsvp-learning` (private)
- 開始時／書込み直前 main: `fa63f8f2571203539269a38d501d50d92cafc1d2`
- 開始時候補 #136 head: `0cff8396277cbc8f19cae32df6344ea4a138b2cf`
- 予備検証中に観測した候補head: `8dda9d7d0dc55a7f860a6bf5a9d953cd381bdb92`
- **B最終候補head: 未受領／NOT_VERIFIED**。この報告の静的観測をB最終候補のPASSへ繰り上げない。
- 対象PR: [#136](https://github.com/Josh-Temple/rsvp-learning/pull/136)。以前のC独立監査は[#139](https://github.com/Josh-Temple/rsvp-learning/pull/139)（旧headのF-08 P1、V-1/V-2ともNEEDS_REVISION）。
- 候補状態: **DRAFT / HOLD**。mainへの教材merge・Catalog登録・COMPLETE昇格・一般公開・production更新なし。

## 1. 開始条件・headの変化

D開始時、#136 headは旧 `0cff8396277cbc8f19cae32df6344ea4a138b2cf` だった。静的検査の途中で `8dda9d7d0dc55a7f860a6bf5a9d953cd381bdb92` へ進んだ。後者のcommit messageは `fix(course-v): compare support grant instants in UTC across DST fold`。GitHub差分として教育用認可コードの `now.astimezone(timezone.utc) < grant.expires_at.astimezone(timezone.utc)` を観測したが、DはF-08の実行反証を行っていない。これはAの途中コミットであり、B完了済みの証拠ではない。

mainは上記full SHAを確認。#136はopen / draft / unmerged。headは検証中に変わったため、**正式Dの対象full SHAは固定できていない**。Cの内容受入とAの修正判定をDが代行しない。

## 2. GitHub固定旧候補での静的検証（証拠範囲限定）

対象は `0cff8396277cbc8f19cae32df6344ea4a138b2cf` の
- `drafts/security-course-v/learn/security-secure-by-design-default.html`（Git blob `d5e00ef94c79605afb372d879e28f4c0f8e86bd0`）
- `drafts/security-course-v/learn/security-input-output-injection.html`（Git blob `e109ff1d9d53bf8eb2f242f332b1401133913588`）
- `learn/learn.js`（blob `22642c66e45a7bf85ea4fa6f0cfe9b10b4d7fd1e`）
- `learn/learn.css`（blob `8e0a6f1a17e2de3774c88ea19dd4526e09340399`）
- `courses/index.json`, `lessons/index.json`, `index.html`, 既存Learn 1章。

途中コミット `8dda9d7...` でも上記2 HTML・共有CSS/JSのGit blob SHAは**同一**と確認した。したがって旧headの静的観測はこれら4ファイルに限り途中コミットにも適用できる。ただし今後のB headへは無条件に引き継がない。

| 項目 | V-1 | V-2 | 範囲 |
|---|---:|---:|---|
| `<html lang="ja">`, viewport, `<main>`, `<article id="learn-article">` | あり | あり | GitHub HTML文字列 |
| article内の段落数（`<p>`） | 20 | 21 | 静的数え上げ |
| article内見出し（h1〜h3） | 11 | 12 | 開始/終了件数一致 |
| 主要タグの開閉数 | 不一致0 | 不一致0 | 正規表現による限定検査、完全なHTML parser検査ではない |
| ID重複 | 0 | 0 | HTML文字列の列挙 |
| HOLD注記・制作状況 | article外 | article外 | 朗読用本文と区別 |
| 出典 `section.sources` | article外 | article外 | 朗読用本文と区別 |
| `base href="../../../learn/"` | あり | あり | `/drafts/security-course-v/learn/...` 配下に置く想定 |
| ローカル相対参照 | 6/6が既知のGitHubパスへ正規化 | 6/6 | 実HTTPステータス・Content-Typeは未確認 |

ページがサイトrootの `/drafts/security-course-v/learn/` に配置される前提で、base解決先は `/learn/`。このとき `./learn.css` → `/learn/learn.css`、`./learn.js` → `/learn/learn.js`、`../index.html` → `/index.html`、`../drafts/security-course-v/{QUESTIONS,SOURCE_EVIDENCE,FORMAT_MAP}.md` → `/drafts/security-course-v/` 内の対応文書となる。GitHubでファイルの存在は確認したが、Markdownリンクが配信先で人間向けページとして読めるかは未検証。

既存 `learn/learn.js` にはplay/pause/stop/音声選択/rate input/Wake Lock/段落継続の制御コードが存在し、HTML側の必要IDもある。速度入力のHTML範囲は0.7〜4.0。これらは**配線とコードの存在**を確認しただけで、Web Speechの実際の発話・画面操作結果ではない。共通 `learn/learn.css` には `width: min(760px, calc(100% - 32px))`、`flex-wrap: wrap`、操作ボタン最小高さ42pxの設定があるが、幅390px実レンダリング・はみ出し・フォーカス・長文の視認性は未測定。

`courses/index.json` と `lessons/index.json` の両候補IDは不在。候補がCatalog/コース連続再生に現れないことは現段階の**意図されたHOLD**であり不具合としない。候補2章の章末遷移は本番Catalog経由で実測していない。

## 3. Vercel / 認証 / 公開境界

- Vercel project: `rsvp-learning` (`prj_7yYGl5D3Q7UwQgQuXaGmOYLkTzbu`)。設定上 `ssoProtection.enabled=true`, `deploymentType=all_except_custom_domains`; password protectionは無効と返った。**設定の読取値であり、全URLの実アクセスを検証した証拠ではない**。
- branch `content/security-course-v-pilot-20261011-sol`、旧候補SHA `0cff839...`、途中コミット `8dda9d7...` の各絞り込みで、Vercel list_deployments の結果は0件。候補専用の非公開Preview URLを得られなかった。存在しないことの普遍的証明ではない。
- 最新として取得したREADY productionデプロイ `dpl_Ernw8TuvgPPXg1TBRLrJCgorNRBR` は `target=production`, `githubCommitRef=main`, `githubCommitSha=fa63f8f2571203539269a38d501d50d92cafc1d2`。**候補#136のデプロイではない**。現状の本番アクセス試験は行わず、SSO変更、alias変更、promotionもしない。
- `docs/PUBLIC_LISTENING_BOUNDARY_2026-10-08.md` はRSVPをprivateな制作正本、public `instant-radio` を別の明示公開対象と定義。今検証で公開コピー／mirrorは実施せず、公開の許可もしていない。
- 無認証アクセスのHTTP検証、認証済みブラウザ、HTTP headers・Cookie設定の検証は**NOT_VERIFIED**。単にCatalogにない状態を「公開境界PASS」とは呼ばない。

## 4. 実利用・音声・端末の実測

| 試験項目 | 判定 | 理由 |
|---|---|---|
| 候補Previewのdesktop実操作 | BLOCKED | 対象SHAに対応するPreview URL未確認。ブラウザでのログイン・操作は未実行 |
| 幅390pxの描画・スクロール・入力 | UNTESTED | 実レンダリングなし。CSS静的条件とは区別 |
| 再生／一時停止／再開／停止・速度変更 | UNTESTED | DOM配線の静的確認のみ。Web Speech runtime未実行 |
| 長文朗読・段落移動・音声選択 | UNTESTED | Web Speech実音声未出力 |
| 章末遷移・コース連続再生 | UNTESTED / 未登録候補 | Catalog登録が意図的に保留されている |
| Android Chromeと標準「このページを読み上げ」 | UNTESTED | Android実機にアクセスしていない |
| 実受講者の理解・認知負荷 | NOT_MEASURED | 利用者調査未実施 |
| 公開境界／SSOの未認証実測 | NOT_VERIFIED | 認証解除やトークン使用をしていない |

ユーザーデータ、認証トークン、Cookie、学習履歴の収集や保存は行っていない。静的コード存在確認を実利用PASSにしない。

## 5. リスク、差戻しと正式D再開条件

現物の旧headに関する静的構造・相対リンク・HOLD表示でP0/P1の新たな不整合は発見していないが、この限定結果を候補全体のP0/P1ゼロ宣言やC内容合格へ拡大しない。公開準備と実機QAには重要な未検証が残る。

1. **A→B**: AのF-08修正ログ・CIを確認し、Bが教材3形式・採点整合の最終候補を保存してfull SHAを確定する。A/B同一branch同時変更は禁止。
2. **D再実行**: B最終full SHAをrefに、HTML、3形式の表示リンク、共有JS/CSS、相対パス、HOLD、デプロイ結び付け、Vercel Preview保護状態を再取得し、ここに記した旧head静的観測との一致・差分を明示する。
3. **実画面**: 認証された非公開Previewが存在しアクセス可能な場合にのみ、desktop・390px・連続操作・文章位置・章末動作を測定する。PreviewをDが勝手に作成／productionへ反映しない。
4. **実音声/Android**: 実際に操作可能な認証済み環境で端末・OS・Chrome版・速度・ケース・不具合を記録する。用意できなければUNTESTEDを維持。
5. **独立C/E**: Cは同一最終headの内容受入、EはC/Dの実際の証拠とSSO／公開条件を統合。C合格だけでリリースしない。

**D現在の提出判定: `BLOCKED`（前提B最終SHA未確定）。**
補助成果: **旧headの限定静的検査のみ完了**。正式D `CANDIDATE_QA_PASS_SCOPED` は発行しない。公開判断は `HOLD`、現Waveのmerge/Catalog/COMPLETE/production変更は禁止。

## 6. 記録の独立性と保存方法

この文書はD専用の記録であり、A/Bの実装、Cの独立報告PR #137/#139、教材#136、production、SSO、public instant-radioは**変更しない**。専用文書Draft PRだけに保存する。CIの成功は候補UIや実音声の代用ではない。

保存後の文書PR full SHA、CI・readback結果はGitHubの記録および最終の作業報告で追加確認する。