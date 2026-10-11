// Markdown is the canonical authoring source. This does not split or rewrite prose.
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const directory = path.dirname(fileURLToPath(import.meta.url));
const summaries = {
  "security-secure-by-design-default": "架空の自治体申請サービスで、設計・実装・安全な初期設定・運用を区別し、認可、最小権限、正規業務と検証証拠を判断します。",
  "security-input-output-injection": "架空の申請検索と表示から、入力検証、命令と値の分離、出力文脈、雛形の境界、独立した認可と検証限界を判断します。",
};
if (process.argv.length !== 3 || !["--write", "--check"].includes(process.argv[2])) {
  throw new Error("Usage: node drafts/security-course-v/sync-rsvp.mjs --write|--check");
}
for (const [id, summary] of Object.entries(summaries)) {
  const source = await fs.readFile(path.join(directory, "lessons", `${id}.md`), "utf8");
  const body = source.split("## 本文\n")[1]?.split("\n## ")[0];
  if (!body) throw new Error(`${id}: numbered body missing`);
  const matches = [...body.matchAll(/^(\d+)\. (.+)$/gm)];
  for (const [index, match] of matches.entries()) {
    if (Number(match[1]) !== index + 1) throw new Error(`${id}: numbering at ${index + 1}`);
    if ([...match[2]].length > 24) throw new Error(`${id}: chunk ${index + 1} exceeds 24`);
  }
  const sourceSection = source.split("## 出典\n")[1];
  const sources = [...sourceSection.matchAll(/^- \[([^\]]+)\]\(([^\s)]+)\)$/gm)]
    .map((match) => ({ title: match[1], url: match[2] }));
  const lesson = {
    schema_version: 1, id, title: source.match(/^# (.+)$/m)[1], topic: "情報セキュリティ",
    summary, created_at: source.match(/^Created: (\d{4}-\d{2}-\d{2})$/m)[1],
    base_duration_ms: 680, sources,
    chunks: matches.map((match) => ({ text: match[2], duration_multiplier: /。$/.test(match[2]) ? 1.15 : 1.0 })),
  };
  const expected = `${JSON.stringify(lesson, null, 2)}\n`;
  const target = path.join(directory, "lessons", `${id}.json`);
  if (process.argv[2] === "--write") await fs.writeFile(target, expected);
  else if (await fs.readFile(target, "utf8") !== expected) throw new Error(`${id}: JSON differs from Markdown generation`);
  console.log(`${id}: ${matches.length} chunks ${process.argv[2]}`);
}
