# RSVP Learning — Course V All Deployments: Worker E証拠統合・リリースゲート判定（2026-10-14 JST）

**結論：`PARTIAL_WITH_GAPS / HOLD_NO_MERGE`。** Course V先行2章の**素材のみmain統合＝HOLD**、**Catalog正式登録・公開＝HOLD**。この報告専用PR自体は教材候補を含まず、正式リリース許可を意味しない。

## 1. 固定対象と照合（Worker EによるAPI fresh read）

- Repository: `Josh-Temple/rsvp-learning`; latest main: `79367aa5952b3ed187efd987e8d973eae14cef7e`。
- 教材Draft [PR #136](https://github.com/Josh-Temple/rsvp-learning/pull/136): open/draft/unmerged、head `2ceb3bae83dca17f00dcfb84cddfd726c20c92a0`、mergeable=true、mainに対しahead=7/behind=17、変更32ファイル。独立内容受入 [#146](https://github.com/Josh-Temple/rsvp-learning/pull/146) は同一候補full SHA、V-1/V-2双方受入。候補の [Actions Test run 38205273101](https://github.com/Josh-Temple/rsvp-learning/actions/runs/38205273101) はcompleted/success。同headの**新規**テスト実行ではなく既存Runの照合。
- 変更32件は`drafts/security-course-v/`、準備資料、専用テスト。GitHub変更一覧に`lessons/index.json`/`courses/index.json`/`learn/learn.js`/`listen/index.json`/`vercel.json`/`workflows`はない。mainの両CatalogをreadしV-1/V-2未登録確認。mainと候補の`listen/index.json`のblob差は存在するがPR差分には含まれない。3-way mergeの最終出力は未実行・未証明。
- Vercel project `prj_7yYGl5D3Q7UwQgQuXaGmOYLkTzbu`: `ssoProtection.enabled=true; deploymentType=all`。READY Production `dpl_rgs2CSAKzGFrYUVSWaFd3vthAx2v`、配信元 `79367aa5952b3ed187efd987e8d973eae14cef7e`、3 aliasの一致を管理APIで確認。READY固定Preview `dpl_4myzXuZXtjdyRfhRbxJivUCtmQBy`、配信元 `2ceb3bae83dca17f00dcfb84cddfd726c20c92a0`。ブラウザ認証後の利用可能性は管理APIでは確認できない。
- mainの6時間間隔workflow `cron: "17 */6 * * *"` は`main`からProduction Deployments APIを起動する。Git統合でCatalog登録されなくてもroot配信下のDraft直URLが将来のProduction更新時に配信対象となり得る。

## 2. A/B/C/Dの独立証拠の統合

- Worker C: Libraryの `C_anonymous_http_retest_evidence_2026-10-14.json` SHA-256 `12e81321fb586244cd80aa25d7cf493964faef5c28bf972f4da215df1b7a6abb`。26組のhost/path（Production 3 alias×8 path、Preview×2）、計52 GET・104 hopをEも構造再計算。無追跡26/26は302、追跡26/26は302→307→200、最終host `vercel.com`。最終200は認証ページであり教材本文のHTTP 200ではない。Cの記録上、教材本文取得0。Dは保存済みC証拠を独立検算して`PASS_STORED_JSON_RECALCULATED`。**Cの観測時刻における通常無認証経路限定の結果**。EとDは匿名HTTPを別途再実行せず、C記録にはレスポンス本文原文がないためその分類を独立再現していない。
- Worker B: `B_authenticated_browser_mobile_qa_report_2026-10-14.md`（SHA-256 `57029bb7ca7aa63aa38a9e7baf585cd06861a7614fb73a05145e7cee800eecd1`）。Chromium Playwrightで5画面×1280px/390pxの10遷移を試みたと報告するが、全件`net::ERR_BLOCKED_BY_ADMINISTRATOR`でSSO到達前に停止。正規認証済み画面、390px実DOM、タッチ、Web Speechの実測なし。ブラウザ・アプリ固有の不具合確定ではない。
- **B証拠JSONは指定Libraryフォルダに存在せず**、Dによる各試行原票の照合・SHA受入は未完了。Bの文章を実測原票としてPASSにしない。
- Worker D: `D_post_c_b_independent_reacceptance_report_2026-10-14.md`と`D_post_c_b_evidence_checks_2026-10-14.json`を読戻し、`D_PARTIAL_WITH_GAPS`を採用。旧Dの`NOT_VERIFIED`は旧時点の証拠不足、変更前PR #154の匿名本文HTTP 200はAll Deployments変更前の事実であり、現在のC遮断記録と混同しない。
- Android利用者のV-1/V-2実発声、一時停止・再開・停止、2×/4×の成功申告は`USER_DEVICE_AUDIO_PASS_REPORTED`として維持。独立Worker B/DのAndroid実機再測定ではない。旧#152のCloud Browser音声開始失敗は原因未確定、デスクトップ部分表示成功は歴史的観測。消灯・背景化復帰・ページ離脱停止・390px実描画などは未検証。
- 共有例外：Dは期限経過の`shareable-link`設定記録1件を報告。Eの最新get_project応答には例外の詳細フィールド自体が含まれない。**例外の現存・失効の実効性、例外による匿名到達は未検証**。例外リンク・キー・tokenは取得・使用・転載しない。

## 3. 必須ゲート

| ゲート | E判定 | 主要根拠・限界 |
|---|---|---|
| `CONTENT_ACCEPTANCE` | **PASS** | #146、候補`2ceb3bae83dca17f00dcfb84cddfd726c20c92a0`と一致 |
| `GIT_MERGE_READINESS` | **PARTIAL** | 32変更・mergeable=true・候補CI成功・Catalog未登録、ただし実mergeの3-way結果は未検証 |
| `PRODUCTION_AUTH_CONFIGURATION` | **PASS (configuration)** | Vercel管理API`enabled=true / all` |
| `PRODUCTION_ANONYMOUS_ACCESS` | **DENIED_OBSERVED_IN_C** | 26 URL / 52 GETの変更後通常匿名経路限定、D/Eは保存証拠の検算 |
| `AUTHENTICATED_BROWSING` | **BLOCKED_AUTH / NOT_VERIFIED** | Bはネットワーク管理制限でSSO手前停止 |
| `MOBILE_AND_AUDIO_QA` | **PARTIAL / UNTESTED_390PX** | Android利用者申告PASS_REPORTED、独立390px・各速度・タッチ・音声挙動未受入 |
| `BYPASS_EFFECT` | **NOT_VERIFIED** | 期限経過記録と使用可能性を区別 |
| `MATERIAL_ONLY_MERGE_READINESS` | **HOLD** | 現時点の正規ログイン後サイト機能を未証明、将来の配信境界も継続監視要 |
| `CATALOG_PUBLICATION_READINESS` | **HOLD** | Catalog未登録、正式公開は別PRと明示承認が必要 |
| `RELEASE_READINESS` | **PARTIAL_WITH_GAPS / HOLD_NO_MERGE** | B証拠JSON欠落、認証後・390px実動作とD受入の不足 |

## 4. 次の一手、変更境界

**次の最小作業はWorker Bの証拠補完と正規ログイン後QAの再試行**。欠けている10試行JSONを同WaveのLibraryへ原バイト・SHA読戻し付きで保存し、SSOへ正規アクセス可能な許可済み環境でProductionトップ/Learn/Listenと固定Preview両章をDesktop・390pxで表示し、幅・横スクロール・操作・音声を実測する。資格情報・共有例外リンクの提供、SSO設定緩和は不要。その後Worker Dが原票と実操作を再検収し、Eがゲートを更新する。

**この報告は#136のmain mergeを承認せず、ready化しない。** Catalog追加、Production Deploy、SSO/alias/shareable-link/Trusted Sources変更、教材コード修正、rollbackは実施しない。報告専用PRだけは差分・CI・固定readback・機密なしを確認した場合、元Wave§7の範囲でmain統合可能。
