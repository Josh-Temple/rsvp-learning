# 情報セキュリティ教材

Status: Draft v0.8 / JSON QA complete  
作成日: 2026-09-27

RSVPで繰り返し読むことを前提にした、情報セキュリティの基礎教材です。

## 編集方針

- まず通常のMarkdown原稿を作り、内容をレビューする
- 正確性を優先し、専門用語は初出時に簡潔に説明する
- 一文に複数の論点を詰め込みすぎない
- 変化しにくい基礎概念と、年次で変化する脅威動向を分ける
- 公式資料・一次資料を優先して確認する
- 内容レビュー後にRSVP用JSONへ変換する
- JSON化後も、原稿Markdownを内容上の正本として残す

## 現在の教材構成

初期の7原稿から拡張し、現在は16章の概念構成すべてに対応する基礎原稿があります。

一部の章は、既存原稿と補足原稿の複数ファイルで構成しています。

現在の学習順序と対応ファイルは `CURRICULUM.md` を正本とします。

IPA SG Ver.4.1との対応状況は `IPA_SG_COVERAGE.md` を正本とします。

「現在の脅威動向」は、年次更新を前提とする時点依存教材として分離しています。

それ以外の基礎章でも、法令、標準、RFC、組織名称、推奨事項など版管理が必要な事実はあります。

そのため各原稿に確認日と出典を残し、基礎概念と版依存情報を区別して見直します。

## 主な参照先

- IPA 情報セキュリティ: https://www.ipa.go.jp/security/
- IPA 情報セキュリティ10大脅威 2026: https://www.ipa.go.jp/security/10threats/10threats2026.html
- NIST Cybersecurity Framework 2.0: https://www.nist.gov/cyberframework
- NIST SP 800-63B-4: https://csrc.nist.gov/pubs/sp/800/63/b/4/final
- NIST FIPS 197 (AES): https://csrc.nist.gov/pubs/fips/197/final
- NIST SP 800-61 Rev. 3: https://csrc.nist.gov/pubs/sp/800/61/r3/final
- NIST SP 800-207 Zero Trust Architecture: https://csrc.nist.gov/pubs/sp/800/207/final
- CISA cybersecurity guidance: https://www.cisa.gov/
- OWASP Top 10:2025: https://top10.owasp.org/2025/
- OWASP GenAI LLM Top 10 2026: https://genai.owasp.org/resource/owasp-genai-llm-top-10-2026/
- NIST AI 100-2e2025: https://csrc.nist.gov/pubs/ai/100/2/e2025/final
- ISO/IEC 27001:2022: https://www.iso.org/standard/27001

## レビュー状況

第1回精度レビューを2026-09-27に実施し、Draft v0.2へ更新しました。

第2回構成レビューを同日に実施し、Draft v0.3へ更新しました。

第2回ではIPA SG Ver.4.1を漏れ検出用チェックリストとして利用し、試験対策に寄せすぎず、情報セキュリティの包括的理解に必要な領域を整理しました。

第3回拡張では、未収録だった主要領域の原稿を追加し、Draft v0.4へ更新しました。

追加領域は、ネットワーク基礎、PKI、メール認証、アプリ・DB、端末・クラウド・IoT・物理対策、脆弱性管理、リスク管理、ISMS、監視・フォレンジックス、事業継続、法務・プライバシー、監査・内部統制です。

第4回残差統合では、Draft v0.5として既存章を補強しました。

BEC、標的型攻撃、認証情報攻撃、MITM、DNS攻撃、ゼロデイ、マルウェア分類、パスキー、SSO、生体認証、MAC/HMAC、ハイブリッド暗号、CRYPTREC、SSH、IPsec、JVN、NCO、JPCERT/CC、ISMAP、メモリ安全性、営業秘密、生成AIアプリケーションのセキュリティなどを追加しました。

第5回横断レビューでは、Draft v0.6として全19原稿を横断確認しました。

旧第5章と旧第6章に集中していた重複を整理し、それぞれ「防御の全体像」「組織運用の全体像」として役割を限定しました。

詳細原稿との近似重複を減らし、現在のカリキュラム順序と旧ファイル名の番号を分離しました。

第6回RSVP可読性レビューでは、Draft v0.7としてランダム再生時の単独理解を確認しました。

長い一文を分割し、Lesson内で初めて出る主要略語を短く定義しました。

また、`docs/LESSON_FORMAT.md` に「1 Lesson = 1 Chapter」「ランダム再生でも破綻しない」という編集規則を追加しました。

16 Lessonへの変換計画は `JSON_PLAN.md` に固定しました。

主な修正は次のとおりです。

- CIAを「代表的な3要素」と明記し、情報セキュリティ全体と同一視しない
- リスクを影響だけでなく発生可能性も含めて説明する
- NIST CSF 2.0の六機能を、順番のある手順ではなく同時並行・継続的な機能として説明する
- NIST SP 800-63B-4の現行パスワード指針を反映する
- MFAの方式によってフィッシング耐性が異なることを明確化する
- デジタル署名を「作成者確認」と単純化せず、署名元の真正性と完全性を中心に説明する
- ゼロトラストを「ネットワーク位置だけで暗黙に信頼しない」という原則として補足する
- IPA「情報セキュリティ10大脅威 2026」の順位の意味と2026年の順位を明確化する

詳細は `lessons/security/REVIEW_LOG.md` に記録します。

追加した管理文書:

- `lessons/security/IPA_SG_COVERAGE.md`
- `lessons/security/CURRICULUM.md`
- `lessons/security/JSON_PLAN.md`

## 現在の実装状態

16 LessonすべてをRSVP用JSONへ変換し、`lessons/index.json` と `courses/index.json` へ登録しました。

最終のfresh readbackでは、16 LessonすべてでJSON parse、Schema必須項目、Lesson ID、`base_duration_ms`、`sources`、chunk構造、`duration_multiplier` を確認しました。

空chunk、URL・Markdownの本文混入、24文字を超えるchunkは検出されませんでした。chunk文字数の90%点は各Lessonで10〜11文字、最長は23文字でした。

文節分割の目視確認で、次の3箇所を個別修正しました。

- `Man-in-the-Middle / On-Path Attack` のハイフン単独chunk
- `Cross-Site Request Forgery` のハイフン単独chunk
- 「技術的に深刻な脆弱性で / も」の助詞単独chunk

Chapter 2・7・11・16を抜き取り確認し、Chapter 16のIPA「情報セキュリティ10大脅威2026」の上位3項目も名称が崩れていないことを確認しました。

最新mainにあった `information-security-overview` は初期SEEDとしてファイルを残しますが、本編完成に伴いCourseとLessonカタログから外しました。

## 次の作業

実ブラウザで、8倍前後のRSVP表示、CourseのALL / RND、前後Chapter移動、習熟度表示を確認します。

静的なコード・データ対応は確認済みです。Vercelのチェックは現在build rate limitで失敗しているため、実装不良とは切り分けて扱います。

実表示確認と利用可能なCI確認が終わるまでPR #6はDraftのまま維持します。
