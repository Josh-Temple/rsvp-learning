# Course V先行2章：修正後の独立技術・教材品質再受入審査（Worker C）

審査日：2026-10-12 JST。正本：[Josh-Temple/rsvp-learning](https://github.com/Josh-Temple/rsvp-learning)。

**審査対象full SHA：`0cff8396277cbc8f19cae32df6344ea4a138b2cf`。V-1、V-2とも `NEEDS_REVISION`。**

F-01〜F-07は今回確認した範囲で解消した。旧監査の12条件を独立に再構成してすべて成功し、候補のNode 67件・Python 41件も審査環境で成功した。しかし独立した1,419ケースでは1,417成功・2失敗となった。期限付き診断が、夏時間終了時に期限後を許可し、期限前を拒否する欠陥F-08（P1）を再現した。旧SHAにも同じ欠陥があり、今回の修正が作り込んだ回帰とは判定しない。

制作担当のPASS・Red→Green履歴・source_verifiedを独立受入へ転用していない。判定は本文、実行例、入力契約、原典、独立反証に基づく。実音声・Android実機・実受講者による評価は実施していない。

## 1. 章別判定と審査対象

| 章 | 判定 | 受入を妨げる問題 | 確認できた品質 |
|---|---|---|---|
| V-1 Secure by Design / Secure by Default | **NEEDS_REVISION** | 共有認可例が、入力契約で受理する時差付きdatetimeについて委託期限を実際の時系列で評価できない。V1-06・V1-Q4の核心に反するF-08。 | 部署欠落・空文字・無効値の拒否、正常許可、原則説明、209チャンク、Learn本文、設問の基本構造。 |
| V-2 入力・出力・Injection | **NEEDS_REVISION** | V1を前提に引き継ぐ共有例・検証記録にF-08が残る。V2-12でInjectionとは独立して確認する認可モデルの受入を、SQL/HTML試験の成功で代用できない。今回の共有例を含む候補として受け入れない。 | Injectionの説明、SQLite値バインド・検索scope、通常HTML本文、241チャンク、DOM別解、設問の基本構造。 |

V-2のSQL・HTML・OSの原則そのものをF-08が反証したという判断ではない。共有実行例を含む現候補の受入判定である。P0は発見していない。旧P1のF-01は解消、新規発見のP1はF-08の1件。F-08の二つの失敗を別々の欠陥として数えない。旧P2のF-02〜F-07も本文品質として解消した。未実施の音声・実装統合工程は別に保持する。

### fresh readと固定

| 対象 | 確認値 |
|---|---|
| 着手時main | `fa63f8f2571203539269a38d501d50d92cafc1d2`、tree `b73cee0add50aaa308d0c13ea267ac02b85cd79e` |
| main CI | [Test 38135824613](https://github.com/Josh-Temple/rsvp-learning/actions/runs/38135824613)、push、head一致、completed / success |
| 候補PR | [#136](https://github.com/Josh-Temple/rsvp-learning/pull/136)、open / draft=true / merged=false |
| 候補head・審査対象 | `0cff8396277cbc8f19cae32df6344ea4a138b2cf` |
| 候補tree | `8abd62088c67177f74b6e2321fd40b51f4c0ef9d`、593 blob、取得と原バイトGit blob SHA照合に成功 |
| head branch | `content/security-course-v-pilot-20261011-sol` |
| PR base | `74ebcac3587650ee83b95438629d1893ba8abfb4`。最新mainと区別。 |
| 修正前候補 | `edc183742163cb3bc355b2ee4b6dd177366acc8f` |
| 旧独立報告 | [#137](https://github.com/Josh-Temple/rsvp-learning/pull/137)、head `2ef5ee94619a8faff0f60f9313e10b86af009a00`、open / draft=true / merged=false |
| 旧報告本文 | `docs/SECURITY_COURSE_V_INDEPENDENT_ACCEPTANCE_2026-10-11.md`、blob `73c620b50092c4c83cb262d5bb6c536060d5b91c`。全文取得し、旧判定の履歴として維持。 |
| 旧報告CI | [Test 38121110431](https://github.com/Josh-Temple/rsvp-learning/actions/runs/38121110431)、headは旧報告SHA、completed / success。新候補の内容受入ではない。 |
| 対象CI | [Test 38179274162](https://github.com/Josh-Temple/rsvp-learning/actions/runs/38179274162)、headは今回の固定SHA、completed / success |
| 対象CI job | `114588177295`、全ステップ成功。ログからNode 22.23.3、67 tests / 67 pass / 0 failを確認。 |
| CI実checkout | 仮統合commit `539e8cd92653e57282d7a73ace60b1aacfb7ccf1`。候補との差はListenの2パスのみ。mainへの実mergeではない。 |

CI仮統合treeを候補treeと比較した差は `listen/index.json` と `listen/research/2026-10-11-iris-intent-recovery-safety-evaluation.html`。Course Vの対象blobは同一。独立ローカル実行は仮統合treeではなく固定候補593 blobに対して行った。候補に追従して別SHAを受け入れた箇所はない。

### 変更30ファイルと修正27ファイル

PR全体は30ファイル。今回の修正前→後は**18変更＋9追加＝27ファイル**で、1追加commit。前回から存在する `sync-rsvp.mjs`、`validate-candidates.mjs`、`validate-html.py` はPR全体には含まれるが今回の27差分には含まれない。新旧の本文・コード・試験・対応表・出典記録・検証履歴を比較した。準備文書は追記である。

`REVISION_2026-10-12.md`、例と3本のPython試験、revision-evidenceの6ファイル、両MD/JSON/HTML、FORMAT_MAP、claims、QUESTIONS、SOURCE_EVIDENCE、source-registry、Node検証コードを原文確認した。旧監査全文と、現行のCONTENT_QUALITY_STANDARD、LESSON_FORMAT、LEARN_HTML_FORMAT、Learn生成指示、Course V準備・カリキュラム・Coverageも参照した。

## 2. F-01〜F-07の再判定

MD位置は本文の1始まりチャンク番号。JSONは対応番号−1。Learnは段落ID。以下は新SHAの位置であり、単語の存在検査だけで判断していない。

| 指摘 | 再判定 | 旧→新の現物と独立証拠 |
|---|---|---|
| F-01 / P1 | **RESOLVED** | `municipal_service.py`の部署検証と職員read/review両側照合、searchのSQL前拒否を確認。None同士read/comment、空文字同士submitted/review/decisionはともにFalse。23値×23値×2操作の1,058ケースと検索23ケースを独立実行。正規本人・職員・公開・管理者・診断の許可も維持。 |
| F-02 / P2 | **RESOLVED** | V2-MD 44〜66、特に51〜53 / Learn `v2-sql` / V2-Q1。入力をSQL構造へ連結した後にprepareしても値と命令を分離できない、と時間順序を正した。固定SQLと別値引数・使用APIの条件を保持。正当な引用符とSQLに見える文字列の検索も独立成功。 |
| F-03 / P2 | **RESOLVED** | V2-MD 185〜194、特に190→191。「危険なオプションを」から「渡せる問題は残り得ます」へ続き、不自然な修飾途中の読点を除去。固定実行対象・引数の分離だけでは引数の意味を保証しない条件、専用ライブラリ優先を保持。Learn `v2-os` とS11も整合。実音声は未確認。 |
| F-04 / P2 | **RESOLVED** | V2-MD 98〜138 / Learn `v2-html-text`、`v2-html-attributes`、`v2-url` / V2-Q3。HTMLソース生成時の引用・属性符号化と、通常の安全な固定DOM属性へ元値を渡す経路を分離。script/style、イベント属性、HTML解釈属性へ拡張せず、URL方式等の検査を両経路で維持。DOM別解＋装飾サニタイズ・後続検査は2点として明記。 |
| F-05 / P2 | **RESOLVED（本文）** | Learn `v2-orm` の二定義を別文にし、名称だけでは保証にならない結論へ続ける。安全な固定構造・値分離の手続まで一律に危険としない。`v1-evidence` は業務条件→取得経路→変更・障害を複数文で説明し、内外・状態・添付・出力・異動・期限・取得失敗を保持。`v2-limits` も文を分け、未採用処理系を削っていない。 |
| F-06 / P2 | **RESOLVED（本文）** | V2-MD 153〜157 / Learn `v2-sanitization`。日本語名称、CSP、読み「シー・エス・ピー」、ブラウザの読み込み・実行制限を導入。追加防御でありサニタイズを代替せず、危険な出力を残す理由にならない限定を保持。実際の発音PASSは付けない。 |
| F-07 / P2 | **RESOLVED** | 両Learnの制作・独立受入・実受講評価説明は `data-candidate-process="review"` のarticle外へ移動。article内の `v1-limits` / `v2-limits` には教育用モデル、全経路/MFA/分散失効/他DB/実DOM/URL/サニタイザ/雛形/OSの未検証範囲が残る。HOLD・静的本文・出典分離も維持。 |

F-01の解消は、今回の固定部署台帳・入力契約についての判断。台帳に載る文字列が実際の所属を証明する、型検査が本人認証になる、固定Actorが属性の最新性を保証する、とは判断しない。現在の信頼されたサーバ側属性を要求ごとに取得する前提と、値の有効性検証の責任を区別している。

住民本人に部署を要求しない扱いは意図した別規則であり、拒否漏れと扱わない。plain str/positive plain int、厳密なbool、固定役割の制約は架空モデルの明示契約である。実在住民の氏名文字集合や自治体共通規則へ拡張していない。修正による不必要な正常系拒否は、今回試した範囲では発見していない。ただし下記の期限前誤拒否は別の既存欠陥として残る。

## 3. 旧監査12条件の独立再構成

著者の `test_audit_conditions.py` は参照資料にとどめ、旧報告の期待動作から審査者のスクリプトを新規に作成した。著者の試験クラス・helperをimportしていない。条件単位では**12/12成功**。内部の個別入力・期待比較は35ケースで、35成功・0失敗。この35は下記1,419ケースの内数であり、別途加算しない。

| 条件 | 今回の入力・期待・観測 | 個別比較 |
|---|---|---:|
| 01 部署欠落 | officer-c / resident-c、双方None、read/comment → False | 1/1 |
| 02 空文字 | 双方空文字、submitted/review/decision → False | 1/1 |
| 03 有効部署 | housing同士 → True、主体welfare・対象housing → False | 2/2 |
| 04 属性取得失敗 | 有効主体・対象でもattributes_available=False → False | 1/1 |
| 05 匿名案内 | actor=None・属性取得失敗でもpublic_notice → True。applicationを付けるとFalse | 2/2 |
| 06 未知操作・項目 | resident-aのerase、owner_id読取 → False | 2/2 |
| 07 期限・時差 | UTCの期限に対し−1µs/同一瞬間/+1µsをUTC−12/UTC/UTC+9/UTC+14で表す → True/False/False | 12/12 |
| 08 naive・別主体 | timezoneなしnow、grant主体vendor-b → False | 2/2 |
| 09 LIKE literal | 独立したメモリDBにbackslash・underscore・percentを含む本人行、無関係行、別本人行。文字どおり検索は本人の対応行のみ | 3/3 |
| 10 検索scope | 元fixtureでresident-aの任意一致 → [1,2,4]。部署None職員 → PermissionError | 2/2 |
| 11 Unicode長さ | 絵文字query80許可/81拒否、comment500許可/501拒否。code point基準であり書記素数ではない | 4/4 |
| 12 HTML文字保全 | entityに見える文字、タグに見える文字、引用符、日本語、絵文字、結合文字を復元文字として保持。固定p以外の要素を作らない | 3/3 |

LIKE条件は初期fixtureの「達成率100%」と追加percent行の二重一致を誤失敗にしないため、独立した3行DBで検証した。命令と検索patternの意味、対象認可を分けた。HTMLParserでの文字保全は実ブラウザ全体の安全認定ではない。

### 追加反証と正常系

| 範囲 | 比較数 | 成功 | 失敗 | 具体的な条件 |
|---|---:|---:|---:|---|
| 旧12条件 | 35 | 35 | 0 | 上表 |
| 主体・対象の部署行列 | 1,058 | 1,058 | 0 | 23値×23値×read/review。有効な同部署の2組だけを許可 |
| SQL前拒否と対象行scope | 23 | 23 | 0 | 21無効主体値はPermissionError・execute呼出0。有効2部署は無効部署の対象行を除外 |
| 主体/所有者ID・対象ID・役割 | 122 | 122 | 0 | 同じ欠落値・型不整合同士でも本人一致にしない。bool対象ID、型違い役割も拒否 |
| flagの厳密性 | 42 | 42 | 0 | active/availability/support/approvedのFalse、None、0、1、文字列等を拒否。検索もSQL前拒否 |
| 正常権限・境界 | 124 | 124 | 0 | 住民の部署非依存read/edit、本人検索、他人/提出後拒否、職員、匿名、管理者設定、対象/期限/項目を満たす診断 |
| 検索入力と正当文字・並び順 | 9 | 9 | 0 | query/sort/literal不正はSQL前ValueError、O'Neil、SQL風文字列、受付順/更新順の正常結果 |
| 夏時間終了時と同一瞬間の別表現 | 6 | 4 | **2** | 同じZoneInfoの期限前後が逆転。nowのみUTC・両側UTCの対照4件は正常 |
| **合計** | **1,419** | **1,417** | **2** | 著者の41 test methodsやNode67へ加算しない |

部署の23値は `None`、空文字、半角空白、tab、newline、全角空白、前後空白、大小文字違い、unknown、42、0、True、False、1.0、bytes、list、dict、tuple、str派生型、および有効なhousing/welfare。入力の全列挙、ケース名、期待値、観測値、失敗は付録のコード・実行結果に保存する。大量の行列比較を41件のunittest test methodsと同じ単位で足し合わせない。

## 4. 新規指摘F-08 — P1：時差付きdatetimeでも期限を実時間順で判断できない

**位置：** `drafts/security-course-v/examples/municipal_service.py` 行43〜45（aware判定）、102〜112（diagnostics）、特に111の `now < grant.expires_at`。`README.md`「入力契約と適用限界」の期限行、`test_audit_conditions.py` の期限試験、V1-MD 134〜150・194、Learn `v1-support`、V1-Q4、および共有例を引き継ぐV2-12に関係する。

**入力契約：** timezoneとUTC offsetが定義されたdatetimeを受理する。UTCや固定offsetへの限定はない。`ZoneInfo`を持つ通常のdatetimeはこの契約を満たし、両側ともaware_datetime=Trueになる。実サービスや分散競合を必要とせず、純粋モデル内で再現する。

| 反例 | now（UTC） | expiry（UTC） | 期待 | 観測 |
|---|---|---|---|---|
| 期限後の誤許可 | 2026-11-01 01:10−05:00 / fold=1（06:10Z） | 01:50−04:00 / fold=0（05:50Z） | False：20分経過 | **True** |
| 期限前の誤拒否 | 01:50−04:00 / fold=0（05:50Z） | 01:10−05:00 / fold=1（06:10Z） | True：20分残る | **False** |

両側のtzinfoは同じ `ZoneInfo("America/New_York")`。承認、vendor主体ID、対象申請ID、support_enabled、診断項目event_codeはすべて有効。同じ瞬間をUTCで表すだけで正しいFalse/Trueへ変わる。時刻の表示形式で認可結果が変わることを確認した。

**原因：** Pythonのdatetimeは、同じtzinfoを持つaware datetime同士の順序比較でtzinfoとfoldを無視し、現地の時計表示を比べる。夏時間終了時に時計が戻る区間では、その表示順序が実時間の順序と一致しない。[Python 3.12公式datetimeの順序比較仕様](https://docs.python.org/3.12/library/datetime.html#datetime-objects)と[ZoneInfoのfoldの説明](https://docs.python.org/3.12/library/zoneinfo.html#using-zoneinfo)を独立に確認した。資料表示は3.12.15、実行は3.12.14。

**履歴：** 旧SHAのコードでも上の二入力で同じTrue/Falseを独立再現した。比較式は旧コードにも存在する。今回の改稿が新たに導入した回帰とする根拠はなく、旧審査の固定offsetだけの試験が検出していなかった潜在欠陥である。今回の1,419ケースで確認した入力検証追加の正常系回帰は、この既存欠陥と区別する。

**重要度の理由：** 期限後の許可は「承認された対象を必要な期間だけ許す」核心に反する。診断メタデータに限定され、申請本文漏えいや実サービス侵入を実証したものではないが、教育用例自体が約束した認可を破るためP1。期限前の拒否も正常業務の保存に失敗する。時差の情報が付いているだけで正しい期限比較になるという誤学習を許さない。

**必要な修正と再受入条件：**

1. 時差付き入力を引き続き受け入れるなら、検証後の双方をUTCへ実際に変換して比較するなど、同じ瞬間では同じ結果になる方式にする。単に `replace(tzinfo=UTC)` で表示ラベルを変える方法は採らない。
2. またはUTC/固定offsetだけという明示契約に変更し、その契約を実装境界で強制する。注記だけでZoneInfo入力を受け続けない。この選択なら既存の別時差受入仕様をどこまで保つか明示する。
3. 上の期限後/期限前、同一瞬間のUTC対照、−1µs/一致/+1µs、異なるoffset、対象/主体/承認不一致、naive拒否を正式回帰にする。拒否のみを成功とせず期限前正常許可も確認する。
4. READMEの期限契約、検証記録、必要な教材/問題説明を実測と整合させ、新full SHAで独立再審査する。今回の固定SHAへ受入を遡及しない。

この監査では候補へ修正を加えていない。P1は内容受入前の修正事項であり、実音声・本番QAへ先送りできない。

### 最小再現

固定候補rootで実行する。第三者への通信、実データ、外部コマンド起動を使わない。

```python
import sys
from datetime import datetime, timezone
from zoneinfo import ZoneInfo
sys.path.insert(0, 'drafts/security-course-v/examples')
from municipal_service import Actor, Application, Settings, SupportGrant, authorize
zone = ZoneInfo('America/New_York')
now = datetime(2026, 11, 1, 1, 10, tzinfo=zone, fold=1)
expiry = datetime(2026, 11, 1, 1, 50, tzinfo=zone, fold=0)
args = dict(settings=Settings(support_enabled=True),
            grant=SupportGrant('vendor-a', 1, expiry, True))
actor = Actor('vendor-a', 'vendor')
target = Application(1, 'resident-a', 'housing')
expected = now.astimezone(timezone.utc) < expiry.astimezone(timezone.utc)
actual = authorize(actor, 'diagnostics', target, 'event_code', now=now, **args)
print(expected, actual)  # False True
assert actual is expected  # FAIL
```

## 5. 450チャンクとLearnの全体品質

### Markdown・RSVP JSON

審査者が両MDの本文を番号順に全文通読した。各番号の文字列をJSONの同じ位置と独立に比較し、連番、全文、順序、句読点、否定を含めて一致した。両形式に同じ誤文を書いた可能性は同期だけで排除できないため、読み取った因果・例外をLearn・原典とも照合した。

| 項目 | V-1 | V-2 |
|---|---:|---:|
| チャンク数 | 209 | 241 |
| 番号・全文・順序・句読点の同期 | PASS | PASS |
| 最大Unicode code points | 23 | 23 |
| 24文字超過 | 0 | 0 |
| 隣接英字の語中破断 | 0 | 0 |
| 選択した専門語15語の語中破断 | 0 | 0 |
| 本文の意味単位通読 | 実施 | 実施 |
| 実音声・速読による理解の測定 | UNTESTED / NOT_MEASURED | UNTESTED / NOT_MEASURED |

15語はSecure by Design、Secure by Default、ストアドプロシージャ、コンテンツセキュリティポリシー、パラメータ化、サニタイズ、多要素認証、textContent、setAttribute、innerHTML、プレースホルダ、RBAC、ABAC、CSP、SSTI。実際の検査語リストは付録の監査コードが正本であり、語中破断なしを全日本語語彙への保証としない。

V1 50〜86は権限の要素→信頼側の検査→全経路→欠落拒否→本人/公開の別規則→業務継続へ順につながる。V1 134〜159は現在属性・分散失効の限界・委託終了・非常時・運用変更を保っている。V2 44〜93は値/構文/ORM・手続/LIKEを区別し、V2 94〜157はHTMLソース/DOM/属性/URL/装飾を分ける。V2 158〜194は雛形解釈と生成HTML、OS引数の残存条件を保つ。V2 195〜241は認可と検証範囲へ戻る。否定語だけの孤立、専門語の不自然な途中破断、修正で重要な限定を脱落した箇所は今回の通読では発見していない。

F-03の190→191は一文を二つの意味単位に分けたもの。単一チャンクとして完結していないこと自体を欠陥としない。F-08はこの本文の語句反転ではなく、本文が求める実行例との整合問題である。

### Learn HTML

両articleを独立に最初から最後まで通読した。V1は段階の違い→架空の役割→要求ごとの認可→正常業務→初期状態→変更/終了→証拠へ進む。代理申請、兼務、匿名案内、分散処理という条件変更が、直前の規則との関係で説明される。V2はデータの流れを軸に、入力検証・SQL・HTML・URL・装飾・雛形・OS・認可へ進み、同じ防御を万能視しない理由と実装の限界を明示する。

F-05の文分割で、担当内外、提出前後、詳細/一覧、添付/一括出力、異動/委託期限、取得失敗という六群を保持している。ORMと手続の二定義、正常な手続を一律危険としない例外、未採用処理系も残る。F-07の移動は制作管理情報に限られ、教育モデルの技術的限界はarticleに残る。出典と制作注記はarticle外にある。

これは**音声に適した文章構成の審査**である。実際の合成音声、速度変更、CSPやDOM API等の発音、Android端末の操作・連続再生・聞き取りは確認できていない。音声品質をPASSにしない。

## 6. 一次資料・版・適用条件

source-registryの15記録とSOURCE_EVIDENCEを索引として使い、原典を別途取得した。S05〜S11は公式repositoryの固定commit `cb9fe01e5ddf17b42513d2c53c4b86196c665c45`、ASVSは `5cf9b032440be53ce345ab3c130fda46ba1ce7a2` から全文を取得し、選択節を再照合した。下表の確認は資料全体の適合認定ではない。

| ID | 一次資料と独立確認範囲 | 版・留保 |
|---|---|---|
| S01 | [ACSC公開の共同ガイド](https://www.cyber.gov.au/publication/shifting-the-balance-of-cyber-security-risk)。design/default、提供者の三原則、安全な標準設定の実践を照合 | 2023-10改訂のHTML。共同ガイドのPDF全文とCISA固有最新施策の網羅は未確認 |
| S01a | [CISA直接ページ](https://www.cisa.gov/securebydesign)は今回の取得経路でInternal Errorとなり本文未取得 | 既存のnot_verified / ACCESS_UNAVAILABLEを保持。著者の403を今回再現したとはしない |
| S02 | [NIST SP 800-218 PDF](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-218.pdf)、PW.1.1/1.2、PW.2.1、PW.8.2、PW.9.1/9.2 | SSDF 1.1 Final。印刷頁11/12/15/16の選択タスク。推奨枠組みを法的義務や認証に変えない |
| S02a | [NIST公式一覧](https://csrc.nist.gov/projects/ssdf/publications)の公表状態をfresh read | 1.2は2025-12-17のDraft、1.1はFinalという表示を確認。1.2草案全文の要件照合は未実施 |
| S03 | [Top 10:2025 A06](https://top10.owasp.org/2025/A06_2025-Insecure_Design/)、Description、設計/実装の違い、How to Prevent | 可変公式HTML。全脅威や法令の網羅ではない |
| S04 | [Top 10:2025 A05](https://top10.owasp.org/2025/A05_2025-Injection/)、Description、How to Prevent | 値分離、動的生成を行う手続の条件。統計を本ケースの効果へ転用しない |
| S05 | [固定SQL原稿](https://github.com/OWASP/CheatSheetSeries/blob/cb9fe01e5ddf17b42513d2c53c4b86196c665c45/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.md)、Prepared Statements、手続、識別子allow-list、手作業escape、Least Privilege | 固定版。prepareの順序、正当入力、値/識別子、アプリ主体/DB接続権限の違いを確認 |
| S06 | 同固定commitのInjection Prevention、Introduction、SQL/OSと対策原則 | 解釈先ごとの境界。汎用escapeの保証には使わない |
| S07 | [固定XSS原稿](https://github.com/OWASP/CheatSheetSeries/blob/cb9fe01e5ddf17b42513d2c53c4b86196c665c45/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.md)、HTML本文/属性/URL、Safe Sinks、危険文脈、Sanitization、Other Controls | textContent/setAttributeの元値、イベント/srcdoc等の除外、URL規則、CSPの補助的位置を確認。実DOM/CSP実装試験ではない |
| S08 | 固定Input Validation、構文/意味、Parse Safely、構造化データ、Unicode自由文、Common Pitfalls | 固定部署/型検査と自由氏名の文字保全を区別。HTTP解析資源は未実装 |
| S09 | [固定Authorization原稿](https://github.com/OWASP/CheatSheetSeries/blob/cb9fe01e5ddf17b42513d2c53c4b86196c665c45/cheatsheets/Authorization_Cheat_Sheet.md)、最小権限、既定拒否、毎要求、信頼側、失敗終了、ログ、単体/統合試験 | 原則を支持。housing/welfare、架空ID形式はこの原典の指定ではない |
| S10 | 固定SSTI Prevention、templates as code、data only、最小render context、output escaping、利用者作成雛形 | 雛形sourceとHTML outputの二段階を確認。特定engine/推奨版を採用・実測していない |
| S11 | 固定OS Command Injection Defense、Argument Injection、OS呼出し回避、構造化引数と入力検証 | 引数分離後の意味条件を確認。特定コマンドや全OSの安全性は未実測 |
| S12 | [ASVS V1](https://github.com/OWASP/ASVS/blob/5cf9b032440be53ce345ab3c130fda46ba1ce7a2/5.0/en/0x10-V1-Encoding-and-Sanitization.md)、V2、[V8](https://github.com/OWASP/ASVS/blob/5cf9b032440be53ce345ab3c130fda46ba1ce7a2/5.0/en/0x17-V8-Authorization.md)の選択要件 | 安定tag v5.0.0_releaseが固定commitを指すことをfresh read。全ASVS/Level適合認定ではない |
| S13 | [IPA SQL](https://www.ipa.go.jp/security/vuln/websecurity/sql.html)、[XSS](https://www.ipa.go.jp/security/vuln/websecurity/cross-site-scripting.html)、[版情報](https://www.ipa.go.jp/security/vuln/websecurity/about.html)の公式HTML選択節 | 改訂第7版・第4刷。SQL 1-(i)-a/1-(iv)、XSS 5-(i)/(ii)/(iii)/(vi)。PDF全文、歴史統計・旧browser例の一般化は未確認 |

OWASP CheatSheetSeriesの可変masterもfresh readし、その時点で固定commitと一致した。ただし「最新」という語を将来へ持ち越さず、今回読んだ固定版を根拠とする。ASVSの安定tagと可変な開発側のlatestは混同しない。ASVSでは1.1.1/2、1.2.1/2/4、1.3.1/7、2.2.1〜3、8.1.1/2、8.2.1〜3、8.3.1〜3をLevel列と併せて照合した。8.3.2/3はL3であり、選択要件の教育利用をLevel適合と呼ばない。

追加の[Python dataclasses](https://docs.python.org/3.12/library/dataclasses.html)は注釈だけで実行時型検査にならないこと、datetime/ZoneInfoはF-08、[SQLite LIKE仕様](https://sqlite.org/lang_expr.html#the_like_glob_regexp_match_and_extract_operators)はワイルドカードとESCAPEの根拠として確認した。資料表示版とローカル実行版を区別する。candidateのsource-registryを監査者が編集したものではない。

### 21命題の独立再照合

各行はMD範囲、Learnの対応段落、原典条件を読んだ判断である。claimsやFORMAT_MAPの一致だけでは判定していない。「支持」は原則説明の根拠であり、実サービスの実装効果や学習効果ではない。

| 命題 | 原典・適用条件の判断 | 実行例・留保 |
|---|---|---|
| V1-01 設計と初期状態 | S01のdesign/defaultの関係を支持 | 無事故保証や運用者責任の消滅にしていない |
| V1-02 原因と修正 | S02 PW.1/PW.2、S03で設計と実装の区別を支持 | 設定/運用の複合原因を排除していない |
| V1-03 多要素の認可と全経路 | S09、S12 V8の主体/機能/対象/項目規則を支持 | F-01解消。全API/添付/一括出力の統合は未検証 |
| V1-04 最小権限・DB層 | S05/S09/S12で必要範囲と各層の検査を支持 | DB読取権限と元主体の認可を混同しない |
| V1-05 初期設定と業務影響 | S01、S02 PW.9.1/9.2を支持 | MFA・登録・ログ保護の動作は未実装 |
| V1-06 現在権限・終了 | S09、S12 8.3.2/3の条件を支持 | **期限付き実行例はF-08で不整合**。開示済み情報は回収できない限定を保持 |
| V1-07 判断不能・公開の別規則 | S09の既定拒否と信頼側判断を支持 | F-01の欠落拒否と匿名例外を独立確認 |
| V1-08 責任・例外の終了 | S01の提供者原則、S02 PW.1.2の記録を支持 | 個別契約・法的責任を一般化しない。終了の実行例にはF-08 |
| V1-09 意図と実測 | S02 PW.8.2、S09の正常/異常試験を支持 | 本報告の2失敗を隠さず、67/41成功を全認可保証へ転用しない |
| V2-01 保存後の解釈先 | S04/S06/S07で処理系の境界を支持 | 保存済みであることを安全保証にしない |
| V2-02 入力検証と解析資源 | S08、S12 2.2.1〜3で業務形式・信頼層・関連値を支持 | 自由な氏名の記号を保ち、HTTP解析資源は未実装 |
| V2-03 デコード/符号化の順序 | S12 1.1.1/2、S08で期待した変換と最終解釈先を支持 | 全氏名の一律変換やプロトコル各層の必要処理禁止にしていない |
| V2-04 SQLと値引数 | S04/S05、S12 1.2.4、IPA SQLを支持。F-02の時間順序も整合 | sqlite3の引用符/SQL風値を独立実行。他DB/driverの保証はなし |
| V2-05 識別子・LIKE | S05/S06、SQLite LIKEと値バインドの違いを支持 | 固定2並び順、literal/任意一致とscopeを独立確認。巨大DB負荷未測定 |
| V2-06 ORM・手続 | S04/S05/S06で動的生成の点検を支持 | 固定構造・値分離の手続まで一律危険としない。実ORM未採用 |
| V2-07 通常HTML/文字ノード | S07、S12 1.2.1で通常の文字表示を支持 | 元値の保持を独立確認。script/styleや全browserへ拡張しない |
| V2-08 属性・URLの二経路 | S07、S12 1.2.2、IPA XSSでF-04の区別を支持 | 両経路のURL規則、HTTPSはケース方針。実DOM/URL未試験 |
| V2-09 サニタイズ・CSP | S07、S12 1.3.1、IPA XSSで装飾条件と補助防御を支持 | F-06の名称/限定保持。ライブラリ・実CSP未採用 |
| V2-10 雛形の二段階 | S10、S12 1.3.7、S07の出力文脈を支持 | autoescapeをSSTI対策にしない。再評価・利用者雛形の条件と未実測を保持 |
| V2-11 OS引数 | S06/S11で回避・引数の意味検査を支持 | F-03の条件保持。外部コマンド未実行 |
| V2-12 認可の独立性・証拠 | S09、S12 V8で構文防御と対象認可の区別を支持 | 部署scope正常。**共有認可例のF-08を含む候補全体の受入は保留** |

## 7. 理解確認10問の採点監査

QUESTIONSを全文通読し、二要素をともに満たす2点、一要素を満たして重大な逆意味がない1点、重大な危険結論が判断を支配する0点を、審査者が作成した回答へ適用した。以下の各行は2/1/0の3回答と、設問側の条件を明示変更した1回答。計40回答の机上採点であり、実受講者データや別採点者との一致率ではない。危険案を引用して棄却する回答を、危険語の存在だけで0点にはしない。

| 問 | 妥当な別解：2点 | 一要素のみ：1点 | 重大な逆意味：0点 | 明示した条件変更への回答 |
|---|---|---|---|---|
| V1-Q1 | Aの主体/対象規則を先に設計し、Bの添付APIを認可共通処理へ接続。各経路で担当内成功・外拒否を版付きで示す | 原因は仕様不足と適用漏れ、とだけ分類 | 正しい原因を述べても、添付の認可はWAFが代行すると結論 | 検査が設定で無効なら変更承認・復元と許可/拒否も確認する→2点 |
| V1-Q2 | 設定操作と審査を必要範囲で分け、検索接続のDDLを外す。管理者の設定成功・本文拒否、担当職員の審査成功・範囲外拒否と元主体を検証 | 必要権限へ分離する案だけ | 全員拒否で業務も完成、またはSELECT権限があれば全住民へ全件表示できる | 審査兼務が承認済みなら対象・期間を限定して成功/拒否を試す→2点 |
| V1-Q3 | 初期非公開へ変え、未調整の新規環境で匿名拒否・本人/職員成功、提出/審査と設定依存を記録 | 初期値を非公開にする判断だけ | 文書や手動変更後の成功で初期状態も受入済みとする | 公開案内だけなら公開目的と内容、保護申請の混在防止を確認→2点 |
| V1-Q4 | 現在属性・承認対象・期限を要求時に適用。旧担当/期限後を拒否し、時刻境界と分散/競合を分ける。開示後の取消では情報を回収できない | 異動と期限を認可へ反映する方向だけ | ログに残せば期限後の取得を許しても情報を元に戻せる | 別業務に許容遅延が明示されるなら影響・境界を設計し、開示回収は保証しない→変更設問では2点 |
| V1-Q5 | Bを選び、取得成功flagと有効部署を区別。空文字一致は拒否、有効同部署は許可。代替窓口・復旧後の内外と公開/本人の別規則を試す | Bで保護対象を拒否する理由だけ。安全保証の追加なし | Bと言いつつ、取得flagが真で双方空文字なら担当一致として許可する | 公開案内の匿名提供を明示規則で維持し、保護操作へ拡張しない→2点 |
| V2-Q1 | 氏名の記号を保って業務型/長さを検証し、固定SQLの値引数へ渡す。引用符正常検索とSQL風文字列の範囲不拡大、生成経路を試す | 値バインドの指定だけ | 後でprepareするので先に氏名をSQLへ連結しても安全 | 固定数値IDなら型/範囲を検証。既存の正しいバインドを連結欠陥と誤認せず正常/範囲外を試す→2点 |
| V2-Q2 | 二択を固定列/方向へ対応。不明値拒否。%をliteral検索にするならSQLite ESCAPE等で確認し、任意一致とは区別する | 並び順の固定対応だけ | バインドで列名も自由選択でき、%のpattern機能も消える | 任意一致が仕様なら広い一致自体は正常とし、認可scope・件数/負荷を別確認→2点 |
| V2-Q3 | divは元値をtextContentへ。解析し許可したURLを固定a.hrefへDOM設定する。装飾は維持されたサニタイザと許可要素/属性、後続再解釈の試験 | divと安全なDOMリンクを説明するが装飾に回答しない | 正しいtextContentに言及しても、符号化済みなら実行URLやCSPだけの装飾処理を安全とする | 装飾なしならタグ表現も文字表示で保持。リンクは別URL規則。不要なサニタイズを必須にしない→2点 |
| V2-Q4 | 固定雛形へデータを渡し、雛形評価とHTML outputを分ける。再評価/任意path/生出力を点検、採用engine/版で別試験 | 固定雛形へ値を渡す案だけ | HTML autoescapeが有効なので利用者の雛形sourceを評価してよい | 固定雛形・再評価なしならそれだけでSSTI成立とは言わず、出力文脈/設定/認可を別に確認→2点 |
| V2-Q5 | 現在担当と有効部署を信頼側で確認して一覧scopeへ適用。内成功、旧/他/欠落/空白拒否、異動反映と未実施のcache/全経路を記録 | 現在部署のscopeを修正する方向だけ | SQL/HTML試験成功とエラー減少を根拠に旧部署一覧も安全と受入 | 正当な共有案件なら明示権限と現在属性で共有成功・非共有拒否を確認→2点 |

V1-Q5は空文字一致を0点へ落とし、有効部署・正常許可と代替/復旧を残す。V2-Q1は入力連結→prepareの誤順序を退ける。V2-Q3はDOM経路に手動entity化を強制せず、HTMLソース経路も許容する。V2-Q5は取得成功・エラー減少と、現在の対象権限の証拠を分離する。表現一致だけの採点にしていない。

新規P1のF-08はV1-Q4が要求する期限検証を共有コードが満たさない問題であり、Q4が期限後の許可を正解としている問題ではない。問題本文と2/1/0の原則は維持できる。修正担当には、夏時間/同一瞬間の表現差を期限回帰へ追加し、必要なら採点者向けの条件例も補うことを求める。Quiz UI、意味自動採点、実受講の難易度・成績・学習効果は未実装/未測定である。

## 8. 実行・CI・履歴証拠の区別

候補593 blobをGit SHAで確認したローカルsnapshotで実行した。環境はNode 24.19.0、Python 3.12.14、SQLite 3.53.1。CIのNode 22.23.3とは別環境。npm依存は `--ignore-scripts` で導入した。検査実行後も既存593 blobが同一であることを再確認し、候補本文・コード・試験は改変していない。

| 証拠 | 結果 | 範囲と数え方 |
|---|---|---|
| 審査者の `npm run check` | exit 0、**67 tests / 67 pass / 0 fail** | 候補を含む既存検査。1 Node testがPython41件を呼ぶため108件とは数えない |
| 審査者のPython候補試験 | exit 0、**41 tests / OK** | 元17＋正式回帰2＋著者再構成12＋著者追加10のtest methods。独立スクリプトとは別 |
| 審査者の独立反証 | exit 1、**1,419比較 / 1,417成功 / 2失敗** | 旧12条件の35比較を含む。著者test methods/Nodeへ加算しない |
| 対象CIのfresh readとjob全文 | completed / success、67/67 | 固定head、仮統合checkoutの対象blob同一性を確認。新規独立反証はこのCIに含まれない |
| content/status/Learn検査 | PASS、COMPLETE141 / DRAFT0 / SEED17、141 Learn | 公開側の既存集計。未登録候補2章を完成公開済みとしない。既存の出典なし警告は別教材の状態 |
| 提出済みRed→Green | Red 19件中2失敗、Green 19成功 | **制作担当の過去ログ**。欠落/空文字の正式回帰、旧/新コードとログのSHA-256・Git blobがmanifestと一致。今回の独立実行と区別 |

`revision-evidence/evidence-manifest.json` のbaseline_model/current_sources/logsを現物とhash照合し、相違なし。f01-redはTrueに対してFalse期待の2失敗、f01-greenは19件OK。ログが現物と一致することは履歴の確認であり、作成日時や制作作業全体の独立観測を証明するものではない。

Nodeの追加7検査は、欠落部署、SQL順序、OSの否定、DOM経路とQ3別解、CSPの限定、制作メタ移動の特定断片/構造を検査する。自然言語全体を判定する検査ではない。旧監査で示した「正しい断片を残した危険な追記」「MD/JSON双方で同じ語中分割」の限界を、67件成功で解消済みとはしない。今回の全文通読・原典照合が必要である。

## 9. 残存留保と後続工程

| 項目 | 状態 | 内容受入への影響・後続条件 |
|---|---|---|
| F-08の期限判定 | **P1 / 未解消** | 両章の共有例を含む内容受入を妨げる。修正と新SHAでの独立再審査が先 |
| 実音声、Android端末、速度、連続再生 | **UNTESTED** | 発音・否定/例外の聞き取り・操作を実聴/実機で確認。文章審査からPASSを転用しない |
| 実受講者・採点者間一致・学習効果 | **NOT_MEASURED** | 問題設計とは別に測定する。現候補の机上採点を結果としない |
| CISA直接最新本文 | **ACCESS_UNAVAILABLE / not_verified** | 2023共同ガイドで支持した範囲に限定する。未取得の固有更新を根拠にしない |
| SSDF1.2草案全体・ASVS全体/Level | **部分確認のみ** | 選択節の原則説明は判断可能。全文適合や認証は受け入れていない |
| 実MFA、初回登録、設定ドリフト、ログ保護 | **未実装・統合未実施** | 教育モデルの意図的範囲外。採用環境と証拠を定めて後工程で確認可能 |
| 全API/添付/一括出力、属性取得/更新、cache/失効/競合 | **未実装・統合未実施** | 現在属性という入力前提を実環境で満たすことが必要。純粋例から保証しない |
| 他DB/ORM/手続、実DOM/URL/サニタイザ/CSP、雛形/OS | **未採用・未試験** | 原則説明を否定する理由にはならない。選んだ処理系・版・設定で別試験 |
| merge、登録、COMPLETE、公開、本番QA | **本審査は承認しない** | 内容受入が将来成立しても別工程。今回NEEDS_REVISIONのまま |

既知の技術的未検証事項を理由なくP0/P1へ引き上げていない。意図的に未実装と説明した実環境の範囲は後工程で確認できる。一方、F-08は実装済み純粋モデル自身の契約違反なので、その留保で免除できない。

`ACCEPTED_FOR_MERGE` が将来付与されても指定SHAだけの内容品質受入であり、main merge、Catalog/Course登録、COMPLETE昇格、production deploy、SSO/公開設定、実音声/端末QAを自動承認しない。本報告作成ではそれらを実行していない。候補#136、旧報告#137、既存30章、public Instant Radioは変更していない。

## 10. 保存と再審査の引渡し

本報告だけを新規の専用Draft PRに保存する。baseはその保存直前に再取得したmain。旧#137は旧SHAの審査履歴として維持する。保存後のPR番号、head、変更1パス、CI、全文readback一致は新規PR本文のreceiptで記録し、本書へ自己参照SHAを追記するための再commitはしない。

制作担当はF-08の比較・入力契約・正式回帰・必要な説明を修正し、新full SHAを提示する。次のCは元のF-01二反例と12条件、今回の期限後/期限前/UTC対照、正常系、本文/設問への差分を独立に確認する。F-01〜F-07を一から未確認扱いへ戻す必要はないが、変更が影響する範囲は再検証する。今回の67/41成功やRESOLVEDを、新SHAの全体受入へ自動転用しない。

## 付録A. 独立反証コードと実測結果

以下のコードを固定候補の外に保存し、`python3 independent_reacceptance.py <候補root>` で実行する。標準ライブラリと候補モデルのみを使用する。IANAのAmerica/New_Yorkデータがない環境では、その実行環境不足を先に解決し、未実行をPASSへ置き換えない。候補の著者試験をimportしない。JSON結果のケースは一意の名前・期待/実測を持ち、subTest数を著者test methodsへ足さない。

コードと1,419ケースの実測JSON全体をこの報告内に保持する。JSONは可読本文を大きくしないためgzip＋Base64で格納し、復元hashを記す。解凍はデータ読取であり、候補やサービスへの書込は行わない。

### 認可・検索・期限の独立反証

```python
"""Independent reviewer probes; run from a fixed candidate repository root."""
import sys, json, sqlite3, platform, hashlib
from pathlib import Path
from datetime import datetime, timezone, timedelta
from zoneinfo import ZoneInfo
from html.parser import HTMLParser
from collections import Counter
ROOT = Path(sys.argv[1] if len(sys.argv) > 1 else '.').resolve()
sys.path.insert(0, str(ROOT / 'drafts/security-course-v/examples'))
import municipal_service as m
rows = []
def probe(group, name, expected, fn, inputs=None):
    try:
        actual = fn()
    except Exception as exc:
        actual = 'raises:' + type(exc).__name__
    rows.append(dict(group=group, name=name, inputs=inputs, expected=expected,
                     actual=actual, passed=type(actual) is type(expected) and actual == expected))
def ids(db, actor, q='', **kw):
    return sorted(r[0] for r in m.search_applications(db, actor, q, **kw))
a = m.Actor('officer-c', 'officer', 'housing')
p = m.Application(1, 'resident-a', 'housing', 'submitted')
r = m.Actor('resident-a', 'resident')
v = m.Actor('vendor-a', 'vendor')
end = datetime(2026, 10, 12, 3, tzinfo=timezone.utc)
s = m.Settings(support_enabled=True)
g = m.SupportGrant('vendor-a', 1, end, True)
def diagnostic(now, grant=g, actor=v, app=p, settings=s, field='event_code'):
    return m.authorize(actor, 'diagnostics', app, field, settings=settings, grant=grant, now=now)
# The prior report's twelve conditions, reconstructed without importing author tests.
probe('01', 'missing departments read', False,
      lambda: m.authorize(m.Actor('officer-c','officer',None),'read',m.Application(5,'resident-c',None),'comment'), {'actor_department':None,'target_department':None})
probe('02', 'empty departments review', False,
      lambda: m.authorize(m.Actor('officer-c','officer',''),'review',m.Application(5,'resident-c','','submitted'),'decision'), {'actor_department':'','target_department':''})
probe('03', 'valid same department', True, lambda:m.authorize(a,'read',p,'comment'))
probe('03', 'valid different department', False, lambda:m.authorize(m.Actor('officer-c','officer','welfare'),'read',p,'comment'))
probe('04', 'attribute retrieval fails', False, lambda:m.authorize(a,'read',p,'comment',attributes_available=False))
probe('05', 'anonymous public notice during outage', True, lambda:m.authorize(None,'public_notice',attributes_available=False))
probe('05', 'public notice cannot expose application', False, lambda:m.authorize(None,'public_notice',p,attributes_available=False))
probe('06', 'unknown operation', False, lambda:m.authorize(r,'erase',p,'name'))
probe('06', 'unknown field', False, lambda:m.authorize(r,'read',p,'owner_id'))
for delta, expected in [(-1,True),(0,False),(1,False)]:
    for hours in [-12,0,9,14]:
        now=(end+timedelta(microseconds=delta)).astimezone(timezone(timedelta(hours=hours)))
        probe('07', f'expiry delta={delta} offset={hours}', expected, lambda now=now:diagnostic(now), {'now':now.isoformat(),'expires':end.isoformat()})
probe('08', 'naive now', False, lambda:diagnostic(end.replace(tzinfo=None)))
probe('08', 'different grant subject', False, lambda:diagnostic(end-timedelta(seconds=1),m.SupportGrant('vendor-b',1,end,True)))
db=m.fictional_database()
# Isolate literal behavior so original fixture's existing percent is not an ambiguous oracle.
for index, (name,q) in enumerate([('path\\leaf','\\'),('under_score','_'),('per%cent','%')], 90):
    with sqlite3.connect(':memory:') as literal_db:
        literal_db.execute('CREATE TABLE applications(id INTEGER, owner_id TEXT, department TEXT, name TEXT, comment TEXT, received_at INTEGER, updated_at INTEGER)')
        literal_db.executemany('INSERT INTO applications VALUES(?,?,?,?,?,?,?)',[(index,'resident-a','housing',name,'x',1,1),(index+10,'resident-a','housing','unrelated','x',1,1),(index+20,'resident-b','welfare',name,'x',1,1)])
        probe('09',f'literal {q!r}',[index],lambda d=literal_db,q=q:ids(d,r,q), {'name':name,'query':q,'literal':True})
probe('10','resident wildcard scope',[1,2,4],lambda:ids(db,r,'%',literal=False))
probe('10','officer missing department search','raises:PermissionError',lambda:ids(db,m.Actor('officer-c','officer',None),'%',literal=False))
for size in [80,81]:
    probe('11',f'query Unicode {size}',[] if size==80 else 'raises:ValueError',lambda size=size:ids(db,r,'😀'*size))
for size in [500,501]:
    probe('11',f'comment Unicode {size}', '<p>'+('😀'*size)+'</p>' if size==500 else 'raises:ValueError',lambda size=size:m.render_plain_comment('😀'*size))
class TextParser(HTMLParser):
    def __init__(self):super().__init__(convert_charrefs=True);self.tags=[];self.text=[]
    def handle_starttag(self,t,a):self.tags.append((t,a))
    def handle_data(self,d):self.text.append(d)
def roundtrip(value):
    h=TextParser();h.feed(m.render_plain_comment(value));h.close()
    return (h.tags==[('p',[])] and ''.join(h.text)==value)
for value in ['&lt;b&gt; &amp; <b> " \'', '<img src=x onerror=alert(1)>', '日本語😀e\u0301\\_%']:
    probe('12',f'plain HTML {value!r}',True,lambda value=value:roundtrip(value),{'comment':value})
# Expanded independent input and permission probes.
class StringChild(str):pass
D=[None,'',' ','\t','\n','\u3000',' housing','housing ','HOUSING','Housing','unknown',42,0,True,False,1.0,b'housing',[],{},('housing',),StringChild('housing'),'housing','welfare']
for i, left in enumerate(D):
    for j, right in enumerate(D):
        expected=type(left) is str and type(right) is str and left in ('housing','welfare') and right in ('housing','welfare') and left==right
        for op,field in [('read','comment'),('review','decision')]:
            probe('13',f'departments {i}/{j} {op}',expected,
                  lambda left=left,right=right,op=op,field=field:m.authorize(m.Actor('officer-c','officer',left),op,m.Application(1,'resident-a',right,'submitted'),field),{'actor_department':repr(left),'actor_type':type(left).__name__,'target_department':repr(right),'target_type':type(right).__name__,'operation':op,'field':field})
class SQLSpy:
    def __init__(self):self.calls=0
    def execute(self,*args):self.calls+=1;raise AssertionError('SQL should not run')
def before_sql(actor, **kw):
    spy=SQLSpy()
    try:m.search_applications(spy,actor,kw.pop('query',''),**kw)
    except Exception as exc:return [type(exc).__name__,spy.calls]
    return ['returned',spy.calls]
for i,d in enumerate(D[:-2]):
    probe('14',f'invalid officer department search {i}',['PermissionError',0],lambda d=d:before_sql(m.Actor('officer-c','officer',d)),{'department':repr(d),'type':type(d).__name__})
for i,d in enumerate([None,'',' ','\u3000','unknown',42,b'housing']):
    db.execute('INSERT INTO applications VALUES(?,?,?,?,?,?,?)',(100+i,'resident-a',d,'scope-test','invalid department',1,1))
for d, expected in [('housing',[1,2,4]),('welfare',[3])]:
    probe('14',f'valid officer {d} excludes malformed target rows',expected,lambda d=d:ids(db,m.Actor('officer-c','officer',d)))
I=[None,'',' ',0,1,True,b'resident-a',StringChild('resident-a'),'住民','a/b']
for i,left in enumerate(I):
    for j,right in enumerate(I):
        probe('15',f'invalid subject/owner {i}/{j}',False,lambda left=left,right=right:m.authorize(m.Actor(left,'resident'),'read',m.Application(1,right,None),'name'),{'subject':repr(left),'owner':repr(right)})
for value in [None,0,-1,True,'1',1.0]:
    probe('15',f'invalid application id {value!r}:{type(value).__name__}',False,lambda value=value:m.authorize(r,'read',m.Application(value,'resident-a',None),'name'))
for value in [None,'',' ',42,True,b'officer',StringChild('officer'),'unknown']:
    probe('15',f'invalid role {value!r}:{type(value).__name__}',False,lambda value=value:m.authorize(m.Actor('officer-c',value,'housing'),'read',p,'name'))
    probe('15',f'invalid role search {value!r}:{type(value).__name__}',['PermissionError',0],lambda value=value:before_sql(m.Actor('officer-c',value,'housing')))
for value in [False,None,0,1,'true','false',[]]:
    probe('16',f'active flag {value!r}',False,lambda value=value:m.authorize(m.Actor('officer-c','officer','housing',value),'read',p,'name'))
    probe('16',f'attributes flag {value!r}',False,lambda value=value:m.authorize(a,'read',p,'name',attributes_available=value))
    probe('16',f'active search flag {value!r}',['PermissionError',0],lambda value=value:before_sql(m.Actor('officer-c','officer','housing',value)))
    probe('16',f'attributes search flag {value!r}',['PermissionError',0],lambda value=value:before_sql(a,attributes_available=value))
    probe('16',f'support enabled flag {value!r}',False,lambda value=value:diagnostic(end-timedelta(seconds=1),settings=m.Settings(support_enabled=value)))
    probe('16',f'grant approved flag {value!r}',False,lambda value=value:diagnostic(end-timedelta(seconds=1),m.SupportGrant('vendor-a',1,end,value)))
for op, field, expected in [('read','name',True),('read','comment',True),('read','state',True),('read','internal_note',False),('edit','comment',True)]:
    for d in D:
        probe('17',f'resident {op}/{field} irrelevant department {type(d).__name__}:{d!r}',expected,lambda d=d,op=op,field=field:m.authorize(m.Actor('resident-a','resident',d),op,m.Application(1,'resident-a',d,'draft'),field))
probe('17','resident other owner',False,lambda:m.authorize(r,'read',m.Application(1,'resident-b',None),'name'))
probe('17','resident submitted edit',False,lambda:m.authorize(r,'edit',p,'comment'))
probe('17','admin configure',True,lambda:m.authorize(m.Actor('admin-a','admin'),'configure'))
probe('17','admin cannot read application',False,lambda:m.authorize(m.Actor('admin-a','admin'),'read',p,'comment'))
probe('17','officer cannot configure',False,lambda:m.authorize(a,'configure'))
probe('17','vendor valid target before expiry',True,lambda:diagnostic(end-timedelta(seconds=1)))
probe('17','vendor mismatched target',False,lambda:diagnostic(end-timedelta(seconds=1),m.SupportGrant('vendor-a',2,end,True)))
probe('17','vendor cannot read raw comment',False,lambda:diagnostic(end-timedelta(seconds=1),field='comment'))
for bad, kw in [('query',{'query':None}),('long query',{'query':'x'*81}),('sort',{'sort':'received; DROP TABLE applications'}),('sort type',{'sort':True}),('literal type',{'literal':1})]:
    probe('18',f'invalid search contract {bad}',['ValueError',0],lambda kw=kw:before_sql(a,**kw))
probe('18','SQL-looking name literal',[4],lambda:ids(db,r,"' OR '1'='1"))
probe('18','apostrophe valid name',[1],lambda:ids(db,r,"O'Neil"))
for sort, expected in [('received',[2,1,4]),('updated',[4,2,1])]:
    probe('18',f'valid sort {sort}',expected,lambda sort=sort:[x[0] for x in m.search_applications(db,r,'',sort=sort) if x[0]<90])
# Time model regression: real standard-library tzinfo, valid aware datetimes.
z=ZoneInfo('America/New_York')
for name,n,e,expected in [
    ('expired grant accepted',datetime(2026,11,1,1,10,tzinfo=z,fold=1),datetime(2026,11,1,1,50,tzinfo=z,fold=0),False),
    ('unexpired grant rejected',datetime(2026,11,1,1,50,tzinfo=z,fold=0),datetime(2026,11,1,1,10,tzinfo=z,fold=1),True)]:
    for representation in ['same ZoneInfo','UTC now','UTC both']:
        now=n if representation=='same ZoneInfo' else n.astimezone(timezone.utc)
        expiry=e if representation!='UTC both' else e.astimezone(timezone.utc)
        grant=m.SupportGrant('vendor-a',1,expiry,True)
        probe('19',name+' / '+representation,expected,lambda now=now,grant=grant:diagnostic(now,grant),
              {'now':now.isoformat(),'now_fold':now.fold,'expires':expiry.isoformat(),'expires_fold':expiry.fold,'now_utc':now.astimezone(timezone.utc).isoformat(),'expiry_utc':expiry.astimezone(timezone.utc).isoformat()})
# A missing optional department must not block the resident search route.
probe('17','resident without department search',[1,2,4,100,101,102,103,104,105,106],lambda:ids(db,r))
db.close()
bygroup={k:{'cases':sum(x['group']==k for x in rows),'pass':sum(x['group']==k and x['passed'] for x in rows),'fail':sum(x['group']==k and not x['passed'] for x in rows)} for k in sorted(set(x['group'] for x in rows))}
summary={'python':platform.python_version(),'sqlite':sqlite3.sqlite_version,'candidate_module_sha256':hashlib.sha256(Path(m.__file__).read_bytes()).hexdigest(),'cases':len(rows),'pass':sum(x['passed'] for x in rows),'fail':sum(not x['passed'] for x in rows),'groups':bygroup,'failures':[x for x in rows if not x['passed']]}
output=Path('independent_results.json');output.write_text(json.dumps({'summary':summary,'cases':rows},ensure_ascii=False,indent=2));print(json.dumps(summary,ensure_ascii=False,indent=2));sys.exit(bool(summary['fail']))
```

コードSHA-256：`23fdafb1796318d55feacc8fda969309fba97108176e4ff15b5da3a79e5d1225`。

### 450チャンクの独立照合

```python
"""Read-only MD/JSON comparison independent of candidate validators."""
from pathlib import Path
import re, json, hashlib, sys
root=Path(sys.argv[1] if len(sys.argv)>1 else '.').resolve()
terms=['Secure by Design','Secure by Default','ストアドプロシージャ','コンテンツセキュリティポリシー','パラメータ化','サニタイズ','多要素認証','textContent','setAttribute','innerHTML','プレースホルダ','RBAC','ABAC','CSP','SSTI']
output=[]
for f in sorted((root/'drafts/security-course-v/lessons').glob('*.md')):
    numbered=re.findall(r'^(\d+)\. (.+)$',f.read_text(),re.M)
    chunks=[x[1] for x in numbered]
    texts=[c['text'] for c in json.loads(f.with_suffix('.json').read_text())['chunks']]
    joined=''.join(chunks);position=0;boundaries=[]
    for c in chunks[:-1]:position+=len(c);boundaries.append(position)
    breaks=[]
    for term in terms:
        for match in re.finditer(re.escape(term),joined):
            breaks.extend((term,b) for b in boundaries if match.start()<b<match.end())
    output.append(dict(lesson=f.stem,count=len(chunks),numbering=[int(x[0]) for x in numbered]==list(range(1,len(chunks)+1)),full_sync=chunks==texts,max_codepoints=max(map(len,chunks)),over24=[i+1 for i,c in enumerate(chunks) if len(c)>24],english_midword=[i+1 for i in range(len(chunks)-1) if re.search('[A-Za-z]$',chunks[i]) and re.match('[A-Za-z]',chunks[i+1])],specialized_term_breaks=breaks,md_sha256=hashlib.sha256(f.read_bytes()).hexdigest(),json_sha256=hashlib.sha256(f.with_suffix('.json').read_bytes()).hexdigest()))
print(json.dumps(output,ensure_ascii=False,indent=2))
assert sum(x['count'] for x in output)==450
assert all(x['numbering'] and x['full_sync'] and not x['over24'] and not x['english_midword'] and not x['specialized_term_breaks'] for x in output)
```

コードSHA-256：`d29dde1463849c24ce159aae39e55b8152812d1a4c8b99d53b2021fe84080884`。

### 独立実行summary（そのまま保存）

```json
{
  "python": "3.12.14",
  "sqlite": "3.53.1",
  "candidate_module_sha256": "d7afe38efa055b006b2420de2a6cdfd48b010c0303b4ce7d6a426ea3b2180b67",
  "cases": 1419,
  "pass": 1417,
  "fail": 2,
  "groups": {
    "01": {
      "cases": 1,
      "pass": 1,
      "fail": 0
    },
    "02": {
      "cases": 1,
      "pass": 1,
      "fail": 0
    },
    "03": {
      "cases": 2,
      "pass": 2,
      "fail": 0
    },
    "04": {
      "cases": 1,
      "pass": 1,
      "fail": 0
    },
    "05": {
      "cases": 2,
      "pass": 2,
      "fail": 0
    },
    "06": {
      "cases": 2,
      "pass": 2,
      "fail": 0
    },
    "07": {
      "cases": 12,
      "pass": 12,
      "fail": 0
    },
    "08": {
      "cases": 2,
      "pass": 2,
      "fail": 0
    },
    "09": {
      "cases": 3,
      "pass": 3,
      "fail": 0
    },
    "10": {
      "cases": 2,
      "pass": 2,
      "fail": 0
    },
    "11": {
      "cases": 4,
      "pass": 4,
      "fail": 0
    },
    "12": {
      "cases": 3,
      "pass": 3,
      "fail": 0
    },
    "13": {
      "cases": 1058,
      "pass": 1058,
      "fail": 0
    },
    "14": {
      "cases": 23,
      "pass": 23,
      "fail": 0
    },
    "15": {
      "cases": 122,
      "pass": 122,
      "fail": 0
    },
    "16": {
      "cases": 42,
      "pass": 42,
      "fail": 0
    },
    "17": {
      "cases": 124,
      "pass": 124,
      "fail": 0
    },
    "18": {
      "cases": 9,
      "pass": 9,
      "fail": 0
    },
    "19": {
      "cases": 6,
      "pass": 4,
      "fail": 2
    }
  },
  "failures": [
    {
      "group": "19",
      "name": "expired grant accepted / same ZoneInfo",
      "inputs": {
        "now": "2026-11-01T01:10:00-05:00",
        "now_fold": 1,
        "expires": "2026-11-01T01:50:00-04:00",
        "expires_fold": 0,
        "now_utc": "2026-11-01T06:10:00+00:00",
        "expiry_utc": "2026-11-01T05:50:00+00:00"
      },
      "expected": false,
      "actual": true,
      "passed": false
    },
    {
      "group": "19",
      "name": "unexpired grant rejected / same ZoneInfo",
      "inputs": {
        "now": "2026-11-01T01:50:00-04:00",
        "now_fold": 0,
        "expires": "2026-11-01T01:10:00-05:00",
        "expires_fold": 1,
        "now_utc": "2026-11-01T05:50:00+00:00",
        "expiry_utc": "2026-11-01T06:10:00+00:00"
      },
      "expected": true,
      "actual": false,
      "passed": false
    }
  ]
}
```

### チャンク照合の独立実行結果

```json
[
  {
    "lesson": "security-input-output-injection",
    "count": 241,
    "numbering": true,
    "full_sync": true,
    "max_codepoints": 23,
    "over24": [],
    "english_midword": [],
    "specialized_term_breaks": [],
    "md_sha256": "567031347fce11f6b35bf5292084c23a9f78c2fc924017f0a6833e0e56a620bc",
    "json_sha256": "9fa4bfa4e28e9826c3a0fdf814d5b4bfe4ad41fe6df2d40712c2895ca5873f7a"
  },
  {
    "lesson": "security-secure-by-design-default",
    "count": 209,
    "numbering": true,
    "full_sync": true,
    "max_codepoints": 23,
    "over24": [],
    "english_midword": [],
    "specialized_term_breaks": [],
    "md_sha256": "e672ad877ed38411e582b87f2a91295f8f08b322515e740eb6f181e115e88026",
    "json_sha256": "c5b981f3030aaa8d6c729ac084cddaaea86888b87ea1688059334b464aa10199"
  }
]
```

### 全ケース・候補再実行・対象CI jobの実測ログ

復元後UTF-8 JSON SHA-256：`14ca0d206679f293cae2b5d402e1c095709348487e1176e8cb0b3e06e59bd624`。原JSON 373677 bytes。個別1,419ケースと候補67/41実行ログ、fresh readしたCI job全文を保持する。

```base64
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
ZXaNa6A1rtyqcQ20xpVbNK6B1rhym8Y10BpXbs+4Blrjyu0Z10BrXLlV4xpojSs/jXENtMaVn8S4Blrjyq0b10BrXLld4xpqjWvD
9LBnX0Otfd0S5YK8TYShIB65JL6ZJIxajsBMDk4tR2gmB725DbXmdksUixY31Frc7Y5rUaTEUCQrdjfU2t1tcehNb6Q1vZtdxqYN
jrQ2WCfTBXkria4SeeQi+R1FYtQCBR0F4tQChR0FojfYkdZg62SyaLkjreXW9nKLsiVdZbNiyyOtLdfKRW/UY/3W26lseqzfgzuN
SY/1m3EnsuixflfuJAY91m/PncSex/p9ulOZ81i/YXdyax7rd+5Obcxj/RbeKW15rN/LO5kpT/SmvG0Tm2Y80Zvxh+JckLeN6CCM
Ry6Nby4No5YlMJeFU8sSmstCb7ITvcl+KI5Fc53ozfWOzmxRrKSDWFbMdKI30ztEojfRqd5Ey8pt2udUb5+3ZLkgbxVhKolHLopv
KAqjFiQwFIRTCxIaCkJvkFO9Qd6SxaI1TvXWeLv3WpQpMZXJih1O9XZ4Wx4KI5xNp+NiIO8D8uBXtK1Xaw8/6g7xHb1idqXu7rZW
YY/brhGNwFVztbG1Si/4xZW698lalbzPrtr7fekqnVXj3GJ3ldU154dNaz3y+WCdVBf0CK9rf7A6W2p7lvX2HFE8EOSWa13vg9VZ
UtuO+VzX3KRGS8rfXDTn7y+u2pu07bRBh4ptjfulQJt3lVqyAh1rt9Uo7YVPdk2iYa1HboRoJRUUUbzKvdE4u/Xae4GOpPt6LXPA
+mYB3Z+8JqVP075GlRE27kptNwSqF9NpNZt7eZndjPMhNRi3s6yc4+p2Vr2ir229KzfH+el7Ml1FDzvygbqs9+OTybOzG5MhsasX
U8MuK2FWejCz1X2ZS32XudNxmbVey8i7LLfSZbmtLstd6rLcnS7LrXVZTt5lLzDhhZV+S1nVw857sDbrPfiEEu3sxoR47OrL9PCr
amQ+Sz2asq4dXfpgdfb79AlF2t2pCSHZ2avpu4CsR95CS9+jqap52Jn31mS9H59Imp1dmAiDXb33mFXFq6ra3Xj5LM8lfugVs1k+
zl+hCGs36ra7YFcHPMpOL8i8jSD1fHZ1cXFyCbzTi9A8iXJqIUoXhFg+V3LiXrF2qfRpJVl/SuS0kqw9DHJiQVzBZu3NjpMJUpTz
q0CcWgJ2SgFww/eqOUJ8WiEO7TWQSyFZPFfq2YrTNQVuO19tvEFxMlnw+YirvWsuchHwLYgr+TjEyUSQzzlcbT31cDJp1vbhry5c
m2hPL8jaa5C0gjTvZTrhKOyXxZKvYCCE54QUVjwGIzlKR+Sw5DeY9BBrhsRAGHveg4Ew1hwIE1kcAsmaG7FfFkuexGEh2IllsOdP
GMhhx6XYL4g9r+JAg9h2LPaLY8u32C+FLfdivxQn8DD2C3QaJ8N8SnZCFmuuRj3P5m7sSOyTxJKbcVAEzwEZrLgYBlKUTkhhyb04
3DOsWY+DothzLQ6KYs2xOCyJM/BYcyr2SWLJpTgkAjupBPbciYNS2HEm9olhz5XY2xi2HYl9wthyI/bJYMuJ2CfDCVyIfeKcxoEw
nXYdkMSa8wAmPJ+V2fi6rN7ZiTgWw8pEpoPuhHVhPKekOeBinECe0jF5Drod9nuQgf2xLpSJK2JdKAOnxL5MDoJn4KjYlOmgy2Jb
GOaILCZujHV5jny4+50EMnFtrDaQuZNjU6zD7o5NaQ47Pjal6eQC2RSsqzN0qiWAUzIZOEhHkCkfFnNXqFwGstDvsZgK4TkhBfU+
i7kcpSNy0O+1GPcQG8EWU2Gs7LeYCmNjx8VYFodAsrHrYiAL/b6LoRDsxDJY2XsxlYN898VAECv7LyYNYnEHxkAcC3swBlJY2IUx
kMLuPoyBQNZ3YjpOyU7IYmM3pprf5TNP3W5O6tPUi5tJMYfSpPokdWXDSVF6g6ocFbeLGYVZbmrISvATpee4fu02iU7NTadtnSbK
vX1lr/JyWM08dcfoPJvd5mDV81E1yz0ovpjdEzRpU+ekqCfZfHCXtxVTKrgO4Cx77TVj8XhVJjseHFD3ZACA8xkU4/1yke9tz68e
/TwbL/KdN2Vsf/MucowrcEBcEaauZnNHxPDmh+6Vt4RPMc9n2di2OM/+6rPeuKpeonsqTzc2cuwTIVivNTCsKJtWMNlV07u8sTvy
8z218PVauGEtTdsirrN8kBev8r33RYsn/MmGNu0HHetaTIfZfH9VwRMoe6Phmg+0VaWrqqRVBpPZ3EozGORTnGEvvRoh+7Iq80/L
UbXxtAn4spBRMBH1OO8x/pzxK86uGOuxEP7GsqvX16NqDFXzJ00N9YMsocoSqCxNqiYbU2Us5oOtbJGq6U8ZW8t2vyNhqMpvEu57
bWVzopFfdm6snz3/0MNm2d9M28Kvmom530yHJizTZrqB9eLx22lTjzNpp0W52VKz/BtZZufRt9lHjLrV5oDdbC6ua66drXx/sF1/
o1/lbbXW3tG3p7nMxt+2+OfUUAeWw+bNZDD+3qKddg6kw+PPejvt8itfF3Pw2TedZ7mE2ruGgDk2eMIZgz8c/sCMy3z4g5+F8Cfa
WGMYJN4Q+WvQEFyMYYGT/3VZDfPrcXULQpfTifc6m5Xez1RM2cvLV41L5714dDefT3vTWfXm/sWjvvf8rqhBufHYq+fV1HtdzeRa
DNxP8Ng96CVzb5J9g95aPsM787xq5EH5/Rfli/KHHjhSg5f4A1Y5W0CmvJ57f/zHy9/lIgXEw+T2xEIppFTQJl6vJ4XCv+rLP+nj
v/3JNzWm/H/++X8GZb1Gv7dazGq883AM2GF5r4sSBLjLwQ2/y2BmmsEQqadVWePli0VZ1HcedgeotpoN4dvHST/00yTlk/oDVfAo
K8bgQXujWTXxMtAjG+dQCPhAIM2wgnKUczgdZ4NcqjVYzGYypJjXtRRhfudl0Ey4pPYeB30RJsxfVZDJKmDMtvkaJcYV+JvjPHsF
VWCx01n+qqgW9UMli3KOa//Hoh9GjMe+LFqu4K+8P/yz//IP//V//G//5d/+u//+f/j2t//z7//pf/77f/N33/72f/z9f/u//uGf
wQ/w/38j//4XV17I2IvSg/+yuaz9wwyUrW5r73E2nfa/qa+iFMYmXxX+7e/+t2///f/j29/9q29/+x99+9vfffu7/1CW9l99+7v/
9Nu//d3+smIRXwnRtEE1zUvsGKjnuLiZZbN7b5otECVo1/ubbPASmhCaCNpjppqjRu9/ge02LyaIXNhPQxanwbJhdxXa+E0Z3kWZ
Ycv1RuPi9g5WLgvooFDVsp/I5n/s98NY+Em4LPSzHLv+uChfYle4h1JeAXp4k6QUEGzguHrdSCgByofLjoDdEPyXusDUj3k/jnnA
18E6Wns2NQ5UItld0URLEdUarV52t/q+HNzNqrL4FYiKnG/Z7NCZeBAlabLUfFBNpuN8nq+V1rTGNJM9fOgtSjWmmoIgSRM7GeaD
cQaDCBY53mPWF74fJyugGkhgdLSy4TibLcCkgg85vm9cvVHxZo4j8TGPkn4K/TzaUYKaAWtvuFCRtrxti08/AqV4LPosESJI9mTN
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
```

復元例。報告のBase64 blockをデータとして抽出する。

```python
from pathlib import Path
import re, base64, gzip, hashlib, json
report = Path('docs/SECURITY_COURSE_V_REACCEPTANCE_2026-10-12.md').read_text()
block = re.search(r'```base64\n([\s\S]*?)\n```', report).group(1)
raw = gzip.decompress(base64.b64decode(block))
assert hashlib.sha256(raw).hexdigest() == '14ca0d206679f293cae2b5d402e1c095709348487e1176e8cb0b3e06e59bd624'
data = json.loads(raw)
assert len(data['independent_results']['cases']) == 1419
print(data['independent_results']['summary'])
```

## 付録B. 修正前→後の27変更パス

```text
modified docs/SECURITY_COURSE_V_PILOT_PREPARATION_2026-10-08.md
modified drafts/security-course-v/FORMAT_MAP.md
modified drafts/security-course-v/QUESTIONS.md
modified drafts/security-course-v/README.md
added drafts/security-course-v/REVISION_2026-10-12.md
modified drafts/security-course-v/SOURCE_EVIDENCE.md
modified drafts/security-course-v/VERIFICATION.md
modified drafts/security-course-v/claims.json
modified drafts/security-course-v/examples/municipal_service.py
added drafts/security-course-v/examples/test_audit_conditions.py
added drafts/security-course-v/examples/test_input_contract.py
modified drafts/security-course-v/examples/test_municipal_service.py
modified drafts/security-course-v/learn/security-input-output-injection.html
modified drafts/security-course-v/learn/security-secure-by-design-default.html
modified drafts/security-course-v/lessons/security-input-output-injection.json
modified drafts/security-course-v/lessons/security-input-output-injection.md
modified drafts/security-course-v/lessons/security-secure-by-design-default.json
modified drafts/security-course-v/lessons/security-secure-by-design-default.md
modified drafts/security-course-v/render-map.mjs
added drafts/security-course-v/revision-evidence/additional-counterexamples.json
added drafts/security-course-v/revision-evidence/evidence-manifest.json
added drafts/security-course-v/revision-evidence/f01-green.txt
added drafts/security-course-v/revision-evidence/f01-red.txt
added drafts/security-course-v/revision-evidence/npm-check-final.txt
added drafts/security-course-v/revision-evidence/python-final.txt
modified drafts/security-course-v/source-registry.json
modified tests/security-course-v-candidates.test.mjs
```
