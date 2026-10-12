# Worker C — Course V先行2章のB最終SHA独立再受入

実施日：2026-10-12（JST）。対象 private Repository: Josh-Temple/rsvp-learning。対象教材はDraft PR [#136](https://github.com/Josh-Temple/rsvp-learning/pull/136) の **full SHA 2ceb3bae83dca17f00dcfb84cddfd726c20c92a0**。報告保存前のmain: fa63f8f2571203539269a38d501d50d92cafc1d2、候補はopen / draft=true / merged=false。旧監査[#137](https://github.com/Josh-Temple/rsvp-learning/pull/137)、[#139](https://github.com/Josh-Temple/rsvp-learning/pull/139)、旧C preflight[#142](https://github.com/Josh-Temple/rsvp-learning/pull/142)、E[#144](https://github.com/Josh-Temple/rsvp-learning/pull/144)を別版の証拠として確認した。

## 判定

**V-1 ACCEPTED_FOR_MERGE / V-2 ACCEPTED_FOR_MERGE / 全体 C_ACCEPTED_EXACT_HEAD。** 教材内容の独立受入のみを意味し、実際のmain merge、Catalog/Course V登録、COMPLETE設定、Preview/production配信、一般公開の許可を含まない。**P0=0、P1=0、P2=1**。以下の不確実性・未検証範囲を明示したうえで、B最終headの内容を受入とする。教材は引き続き **DRAFT / HOLD** であり、Dの同SHA非公開QA、Eの統合と後続の人的承認が別途必要。

## 1. 固定SHAと独立コード反証

GitHubのB最終候補から municipal_service.py を固定refで取得。8,261 UTF-8バイトの取得ソースに対して、Git blob仕様（長さ付きblob header＋本文のSHA-1）を独立計算し、**69bbf780df72c5cf50b7de860b290095d26a6e21** と完全一致した。Python 3.13.5で同一バイトのソースを実行し、作者unittestとは別にfixtureとoracleを記述。作者・CIの成功値は独立試験の期待結果に利用していない。Python 3.12環境そのものは今回実行していない（仕様文書は別途参照）。

**独立1,371比較：PASS 1,371 / FAIL 0 / SKIP 0。** 内訳：

- 有効・無効の部署値24種類を職員・申請で総当たり、読取/審査の2操作：24×24×2＝**1,152比較**。双方の有効な同部署（架空台帳housing/welfare）のみ許可。None、空文字、空白・タブ、未登録、真偽値、大小文字違い、容器型などは拒否。
- **128比較**：New Yorkの2026-11-01午前1時台、およびBerlinの2026-10-25午前2時台で、現在と期限について fold=0/1 と分値05/10/30/50の全組合せ。期待値は双方の日時を独立にUTCへ変換して算出。
- **48比較**：期限の−1µs・一致・+1µsについて、現在と期限を各々UTC−12、UTC、UTC+09、UTC+14へ変換した全16組合せ。
- **43比較**：主事例のNY/Berlin逆転各2件、正規vendor診断許可、無効grant/actor/target/項目、naive・無効時刻、resident本人/他人、匿名案内、管理者、未知操作、SQL/LIKE、通常HTML表示、職員によるhousing検索など。内訳ログ上は最後の職員検索1件をdepartment_matrixに数えたため分類が department_matrix=1,153、fold_matrix=128、offset_boundaries=48、other=42となる（合計1,371）。
- **代表旧監査12条件を別途再構成：12/12 PASS。** 同部署成功、異部署拒否、None同士拒否、空文字同士拒否、本人許可・他人拒否、匿名案内、未知操作拒否、正規委託診断期限前許可、期限一致/後拒否、naive時刻拒否。これは母数が重なるため独立比較に加算しない。

### F-08の主反証

New York 2026-11-01 の現在01:10 fold=1（06:10Z）、期限01:50 fold=0（05:50Z）は**期限後なので拒否**。逆転した現在01:50 fold=0、期限01:10 fold=1は、他のgrant等の条件が適正なら**有効期限内として許可**。Berlin 2026-10-25の重複02時台も両方向の期待判定と一致。期限の1マイクロ秒前は許可、一致と後は拒否、同じ瞬間ならoffset表記を変えても同結果。実装は双方を astimezone(timezone.utc) で瞬間に変換して比較する。replace(tzinfo=timezone.utc) という時差ラベルの付替えではない。

最小再現コード。上記固定SHAにある municipal_service.py と同じディレクトリで実行する：

    from datetime import datetime, timezone, timedelta
    from zoneinfo import ZoneInfo
    from municipal_service import Actor, Application, Settings, SupportGrant, authorize

    ny = ZoneInfo("America/New_York")
    a = datetime(2026, 11, 1, 1, 50, tzinfo=ny, fold=0) # 05:50Z
    b = datetime(2026, 11, 1, 1, 10, tzinfo=ny, fold=1) # 06:10Z
    actor = Actor("vendor-a", "vendor")
    app = Application(1, "resident-a", "housing")
    def permit(now, expiry):
        grant = SupportGrant(actor.actor_id, 1, expiry, True)
        return authorize(actor, "diagnostics", app, "event_code",
                         settings=Settings(support_enabled=True),
                         grant=grant, now=now)
    assert permit(b, a) is False
    assert permit(a, b) is True
    assert permit(a, a) is False
    assert permit(a - timedelta(microseconds=1), a) is True
    assert permit(a + timedelta(microseconds=1), a) is False
    for h in (-12, 0, 9, 14):
        tz = timezone(timedelta(hours=h))
        assert permit(a.astimezone(tz), b) is True

本比較の実装手順：独立に24種類の部署値を定義して職員・申請の直積を実行する。期待値は「両者が厳密な文字列、台帳内、同一部署」であること。NY/Berlinでは各foldと分値からdatetimeを生成し、UTCの厳密な小なり比較でoracleを作成。期限境界は±1µsと4 offsetの組合せ。その他に、正当な引用符を含むSQLite検索、SQL風文字列が一つの値になる検索、固定ソートとLIKEのリテラル/ワイルドカード差、無効部署のSQL検索前拒否、HTMLParserでコメントが新しいタグを生成しないことを実行。全1,371件は今回**新規**の独立比較であり、旧#139の1,419 fixture全件は復元・再実行していない。旧1,417/1,419を今回の実測値としない。

## 2. F-01〜F-07と業務正規系

F-01：本人・対象部署の未登録、欠落、空文字、空白は必ず拒否、有効な同部署の閲覧・審査は許可。SQLの職員検索は無効な部署のとき接続実行前に拒否し、resident本人の閲覧は部署条件を課さず維持。委託先の診断について support_enabled、actor、grant承認、主体/対象ID、期限、診断項目を分離して試験し、必要条件が有効な正常診断を拒否していない。管理者の設定操作と本文の読取拒否、公開案内と機微申請の区別も確認。

F-02：SQLへの入力連結後にprepareしても命令・値の分離にならないという訂正を確認。F-03：OSコマンドの引数と危険なオプションの区別が残る。F-04：通常HTMLソース内の属性符号化と安全なDOM属性設定を区別し、URLスキームの許可を省かない。F-05：原因段階と修正位置、提供者/運用者の責任をLearnで分けて説明。F-06：CSPの名称・略称とサニタイズを代替しない限界が明記される。F-07：制作注記は読み上げarticleの外、技術・実装の制約はarticle内のまま。重要な意味逆転なし。これらは架空の**単体教育コードの範囲**であり、実サービスの本人認証や全経路統合の保証ではない。

## 3. MD / RSVP / Learn / 命題 / 採点の全数審査

| 項目 | V-1 | V-2 |
| --- | ---: | ---: |
| 番号付き本文・RSVP JSON | 215 / 215 | 241 / 241 |
| 全件の番号・本文・順序・句読点の不一致 | 0 | 0 |
| 24文字を超えるchunk | 0 | 0 |
| ASCII英字を途中で切る隣接境界 | 0 | 0 |
| 重要命題 | 9 | 12 |
| Learn article通読 | 実施 | 実施 |
| 設問と2/1/0採点 | 5 | 5 |

2章**456チャンク**の番号付きMarkdownとJSON chunks[].textは位置・全文とも完全一致。21重要命題のMarkdown参照表現は、複数chunkを跨ぐ文章もあるため、番号付き本文を順番に結合して検証した。全21件のMarkdown assertionとLearn assertionは該当内容と一致し、source-registryの参照IDが欠ける命題は0。対応表・出典の参照が存在することは**原典全文の独立検証を意味しない**。

Learn 2章は独立した講義としてarticle本文を全文読取した。V-1は安全な設計/初期状態、担当と対象、最小権限と正常業務、期限前許可/期限一致と後の拒否、foldの瞬間比較、分散失効は未確認という限界を記述。V-2はSQL固定構造と入力値、LIKE、HTML本文とDOM、URL、サニタイズ、テンプレート、OS引数、認可とInjectionの非代替性を記述。両方ともDRAFT/HOLD注記・出典はarticleの外。相対base、見出し、章末、出典リンクを静的確認したが、**実ブラウザと実発話は未実施**。

**10問、各2点、計20点。** 問題ごとに模範解答、二要素、2/1/0基準、条件変更を通読。特にV1-Q4では期限前の正規許可、期限一致/後の拒否、別offset同瞬間一致、実システムの失効伝播未検証が満点の必要条件。期限後拒否だけでは2点にできない。V2-Q3は適切に検証したURLを固定hrefへ安全なDOM APIで元値のまま設定する案を、他の要素も満たせば2点とし、HTMLソースへの符号化と混同しない。学習者回答、採点者間一致、学習効果はNOT_MEASURED。

## 4. 一次資料（今回独立に再参照した範囲）

- [Python 3.12 datetime](https://docs.python.org/3.12/library/datetime.html#datetime-objects)：aware値の比較、同一tzinfoでのfoldの扱い、astimezoneとreplaceの意味。
- [Python 3.12 zoneinfo](https://docs.python.org/3.12/library/zoneinfo.html#using-zoneinfo)：夏時間終了時のfold=0/1。
- [OWASP Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)、[SQL Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)、[XSS Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)：認可独立性、構文と値、HTML/DOM文脈。
- [OWASP Top 10:2025 Injection](https://top10.owasp.org/2025/A05_2025-Injection/)・[Insecure Design](https://top10.owasp.org/2025/A06_2025-Insecure_Design/)、[Input Validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)、[SSTI](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Template_Injection_Prevention_Cheat_Sheet.html)、[OS Command Injection](https://cheatsheetseries.owasp.org/cheatsheets/OS_Command_Injection_Defense_Cheat_Sheet.html)：主張に直結する区別と適用条件を再照合。
- [NIST SP 800-218 SSDF 1.1](https://csrc.nist.gov/pubs/sp/800/218/final)の公式公開情報、[共同Secure by Designガイド](https://www.cyber.gov.au/publication/shifting-the-balance-of-cyber-security-risk)の該当説明を限定照合。

**source-registryにある15資料の全節を今回読み直したのではない。** CISAの直接本文はnot_verified、SSDF 1.2草案本文はpartial、ASVS 5.0全条項とIPA原典PDFの全文は独立未確認。異なるPythonランタイム、実サービスの認証・分散失効・監査ログ・認証製品・教材学習効果も未確認。資料の作者側source_verifiedラベルをそのままC全面検証として転記しない。架空教育例から実システムの安全保証や規格適合を導かない。

## 5. 新規指摘 C-P2-01（非ブロッカー）

**現象**：独自tzinfoのutcoffset()が例外を投げると、認可関数のaware_datetime()もFalseではなくRuntimeErrorを送出する。固定SHAのコードから独立再現した。真の許可（True）を返す誤認可は観測されない。ネットワーク入力から任意のPython tzinfoオブジェクトが混入する機能はこの教育モデルにはないため、外部から悪用可能な欠陥と解釈してはならない。

最小再現（固定SHAのmoduleをimport）：

    from datetime import datetime, timezone, tzinfo
    from municipal_service import Actor, Application, Settings, SupportGrant, authorize
    class ExplodingOffset(tzinfo):
        def utcoffset(self, dt):
            raise RuntimeError("timezone validation failed")
    authorize(Actor("vendor-a", "vendor"), "diagnostics",
              Application(1, "resident-a", "housing"), "event_code",
              settings=Settings(support_enabled=True),
              grant=SupportGrant("vendor-a", 1, datetime(2026, 11, 3, tzinfo=timezone.utc), True),
              now=datetime(2026, 11, 1, tzinfo=ExplodingOffset()))
    # RuntimeError raised, not True authorization.

**重大度：P2**。Aの次回改善で、信頼できるtzinfoのみを入力契約で許すか異常offsetの例外処理を定める。今回のC内容署名は妨げない。V-1にだけP2=1、V-2にP2=0。

## 6. 次のゲートと禁止操作

両章の内容受入は**この候補 full SHA 2ceb3bae83dca17f00dcfb84cddfd726c20c92a0 に限る**。#136のheadが動けば旧署名は新headの受入に使えない。Dは同一SHAでprotected Preview、実ブラウザ、Android、Web Speech、匿名HTTPとSSO/shareable-link例外を独立検証し、未実施項目をPASSにしない。EはCの**教材対象head**とこの**報告専用PR自身のhead**を混同せず、Dの同SHA結果と統合する。

このC作業は候補#136、#137/#139/#142、main、Catalog、production、SSO、alias、public instant-radioを**変更しない**。報告1ファイルを新しいDraft PRとして保存し、保存後の報告head SHA・CI・全文readbackを別のPR本文またはコメントへ記録する。保存時点ではまだ成功していない検査を成功と先取りしない。実際のリリース操作はユーザーの別個の承認を必要とする。
