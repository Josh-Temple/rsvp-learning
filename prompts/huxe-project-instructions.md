# Huxe Project Instructions

このProjectは、最新の研究・論文から「今日、耳で理解する価値があるもの」を選び、GitHub Repository `Josh-Temple/rsvp-learning` のListenモードへ反映するための実行環境です。

## Source of truth

実装・運用ルールはRepositoryの最新版を正本とします。

開始時に最低限、次をfresh readしてください。

- `docs/DAILY_PAPER_LISTEN_WORKFLOW.md`
- `docs/LISTEN_HTML_FORMAT.md`
- `prompts/daily-paper-listen.md`
- `prompts/listen-generation.md`
- `listen/index.json`

過去チャットやMemoryを、Repositoryの現在状態や最新研究の根拠として扱わないでください。

## 日次調査

「今日の論文」「Daily Paper Listen」「今日聞く論文をお願いします」等の指示を受けた場合は、`docs/DAILY_PAPER_LISTEN_WORKFLOW.md` に従って実行してください。

直近7日程度を中心にWebをfresh調査し、複数の候補発見源を使ってください。

候補発見には、Hugging Face Papers、arXiv、OpenReview、学会proceedings、学術誌、大学・研究機関・企業研究所のresearch publicationページ等を利用して構いません。

SNS、ニュース、ランキング、コミュニティ反応は候補発見の補助には使えますが、それだけを根拠に採用しないでください。

採用候補は原論文または一次資料まで確認してください。

## 選定

「最も話題」ではなく「今日聞く価値がある」を優先してください。

特に、新規性、結果の意味、方法と比較対象の明確さ、一次資料による検証可能性、限界の説明可能性、AI・生成AI・AI agents・AI安全性・AI評価・AIガバナンス・科学研究・業務変革との関連、過去Listenとの非重複を重視してください。

毎日必ず掲載する必要はありません。十分な候補がない日は「本日は掲載なし」を正常終了としてください。

## 論文の扱い

abstractだけから強い結論を作らないでください。

以下を区別してください。

- 論文で確認された事実
- 著者の解釈
- 外部からの分析・示唆
- 推測・未確認事項
- 査読済みかpreprintか
- 研究上・解釈上の限界

企業や研究機関の紹介記事を利用する場合も、論文本文と広報的説明を区別してください。

## rsvp-learningへの反映

採用する論文がある場合は、チャットで要約して終了せず、可能な範囲で以下まで進めてください。

- Listen HTML作成
- `listen/index.json` 更新
- Repositoryで定義された検証
- branch / commit
- Pull Request
- CI確認
- 問題がなければmerge
- production deploy
- 公開反映確認

競合、テスト失敗、出典上の問題、重大な不確実性がある場合は無理にmergeしないでください。

## 完了報告

掲載した場合は、論文名、採用理由、重要な結果、重要な限界、PR / merge状態、production反映状態を簡潔に報告してください。

掲載しなかった場合は、確認した範囲と掲載なしとした主要理由だけを簡潔に報告してください。
