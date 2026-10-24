import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
if (process.argv.length !== 3 || !["--write", "--check"].includes(process.argv[2])) throw new Error("Usage: render-map.mjs --write|--check");
const mapping = JSON.parse(await fs.readFile(path.join(root, "claims.json"), "utf8"));
const introduction = `# Course V先行2章：重要命題の3形式対応\n\nStatus: DRAFT / HOLD — 2026-10-12（F-01〜F-08修正候補）\n\n著者による意味保持の自己査読用。独立C受入ではない。番号はMarkdown正文の1始まり、JSON添字は0始まり。Learnの段落IDは講義の意味のまとまりを指す。逐語転記を要求しない。根拠の版・節・適用条件は [SOURCE_EVIDENCE.md](SOURCE_EVIDENCE.md) の同じ命題IDを参照する。\n\nMarkdownの各番号付き文字列と同じ位置の 「chunks[].text」 は、全文・順序・句読点・否定まで一致させる。Learnは別に執筆し、主要原則・条件・反例・検証の限界を対応段落で保つ。自動検査は 「claims.json」 の明示した命題の断片を同じ意味範囲で確認する。検査対象の外にある意味、日本語の自然さ、実受講での聞き取りまで証明するものではない。\n\n| 命題 | 判断の核 | Markdown正文 | RSVP JSON | Learn段落 | 根拠ID |\n|---|---|---|---|---|---|\n`;
const rows = mapping.claims.map((claim) => {
  const ranges = claim.markdown_ranges.map(([a, b]) => `${a}–${b}`).join("、");
  const json = claim.markdown_ranges.map(([a, b]) => `chunks[${a - 1}…${b - 1}]`).join("、");
  const paragraphs = claim.learn_paragraphs.map((id) => `[${id}](learn/${claim.lesson_id}.html#${id})`).join("、");
  return `| ${claim.id} | ${claim.title} | [${ranges}](lessons/${claim.lesson_id}.md) | [${json}](lessons/${claim.lesson_id}.json) | ${paragraphs} | ${claim.source_ids.join("、")} |`;
});
const expected = introduction + rows.join("\n") + "\n\n理解確認10問の二要素、条件変更、重大な逆意味は [QUESTIONS.md](QUESTIONS.md) で別に管理する。HTML出典は両章とも読み上げ対象articleの外に置く。\n";
const target = path.join(root, "FORMAT_MAP.md");
if (process.argv[2] === "--write") await fs.writeFile(target, expected);
else if (await fs.readFile(target, "utf8") !== expected) throw new Error("FORMAT_MAP.md differs from reviewed claims.json");
console.log(`Format map: ${mapping.claims.length} claims ${process.argv[2]}`);
