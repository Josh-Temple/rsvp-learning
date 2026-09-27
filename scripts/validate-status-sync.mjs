import fs from "node:fs/promises";
import path from "node:path";
import Ajv2020 from "ajv/dist/2020.js";

const root = process.cwd();
const errors = [];
const readJson = async (file) => JSON.parse(await fs.readFile(path.join(root, file), "utf8"));
const schema = await readJson("schema/lesson-catalog.schema.json");
const catalog = await readJson("lessons/index.json");
const ajv = new Ajv2020({ allErrors: true, strict: false });
const validateCatalog = ajv.compile(schema);
if (!validateCatalog(catalog)) errors.push(ajv.errorsText(validateCatalog.errors, { separator: "; " }));

function section(markdown, name) {
  const lines = markdown.split(/\r?\n/);
  const start = lines.findIndex((line) => line === `## ${name}`);
  if (start < 0) return "";
  let end = start + 1;
  while (end < lines.length && !lines[end].startsWith("## ")) end += 1;
  return lines.slice(start + 1, end).join("\n").trim();
}
function numberedBody(markdown) {
  return section(markdown, "本文").split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
    .map((line) => line.replace(/^\d+[.)、]\s*/, "")).join("");
}
function markdownSources(markdown) {
  return [...section(markdown, "出典").matchAll(/-\s*\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g)]
    .map((match) => ({ title: match[1], url: match[2] }));
}

const learnPaths = new Set();
for (const meta of catalog.lessons ?? []) {
  const jsonPath = path.resolve(root, meta.path.replace(/^\.\//, ""));
  let lesson;
  try {
    lesson = JSON.parse(await fs.readFile(jsonPath, "utf8"));
  } catch (error) {
    errors.push(`Lesson ${meta.id} JSONを読めません: ${error.message}`);
    continue;
  }
  let markdown;
  try {
    markdown = await fs.readFile(jsonPath.replace(/\.json$/, ".md"), "utf8");
  } catch (error) {
    if (meta.status || meta.learn_path) errors.push(`Lesson ${meta.id} はstatus/learn_pathがありますがMarkdown原稿がありません`);
    continue;
  }

  const markdownStatus = markdown.match(/^Status:\s*(.+?)\s*$/m)?.[1] ?? null;
  const catalogStatus = meta.status ?? null;
  if (catalogStatus !== markdownStatus) errors.push(`status不一致 ${meta.id}: catalog=${catalogStatus ?? "(なし)"} / Markdown=${markdownStatus ?? "(なし)"}`);
  if (catalogStatus && !["SEED / 概要のみ", "DRAFT v0.1", "COMPLETE v0.1"].includes(catalogStatus)) {
    errors.push(`未知status ${meta.id}: ${catalogStatus}`);
  }
  if (catalogStatus === "COMPLETE v0.1") {
    if (lesson.id !== meta.id || lesson.title !== meta.title || lesson.topic !== meta.topic) errors.push(`metadata不一致 ${meta.id}: catalog / JSON`);
    const heading = markdown.match(/^#\s+(.+)$/m)?.[1]?.trim();
    if (heading !== lesson.title) errors.push(`タイトル不一致 ${meta.id}: Markdown / JSON`);
    const body = numberedBody(markdown);
    const chunks = (lesson.chunks ?? []).map((chunk) => chunk.text ?? "");
    if (body !== chunks.join("")) errors.push(`本文不一致 ${meta.id}: Markdown / RSVP JSON`);
    if (chunks.some((chunk) => !chunk.trim())) errors.push(`空チャンク ${meta.id}`);
    if (chunks.some((chunk) => [...chunk].length > 24)) errors.push(`24文字超チャンク ${meta.id}`);
    if (JSON.stringify(markdownSources(markdown)) !== JSON.stringify(lesson.sources ?? [])) errors.push(`出典不一致 ${meta.id}: Markdown / RSVP JSON`);
  }

  if (meta.status === "COMPLETE v0.1") {
    if (!meta.learn_path) errors.push(`COMPLETEにlearn_pathがありません: ${meta.id}`);
    else {
      const target = path.resolve(root, meta.learn_path.replace(/^\.\//, ""));
      learnPaths.add(path.relative(root, target));
      try { await fs.access(target); }
      catch { errors.push(`Learn HTMLがありません: ${meta.id} -> ${meta.learn_path}`); }
    }
  } else if (meta.learn_path) {
    errors.push(`未完成statusにlearn_pathがあります: ${meta.id}`);
  }
}
const htmlFiles = (await fs.readdir(path.join(root, "learn"))).filter((file) => file.endsWith(".html")).map((file) => path.join("learn", file));
for (const file of htmlFiles) if (!learnPaths.has(file)) errors.push(`カタログにないLearn HTMLです: ${file}`);
for (const file of learnPaths) if (!htmlFiles.includes(file)) errors.push(`カタログ参照先がlearn/にありません: ${file}`);

if (errors.length) {
  console.error("Status/catalog validation: FAIL");
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  const count = (status) => (catalog.lessons ?? []).filter((lesson) => lesson.status === status).length;
  console.log(`Status/catalog validation: PASS (COMPLETE ${count("COMPLETE v0.1")}, DRAFT ${count("DRAFT v0.1")}, SEED ${count("SEED / 概要のみ")})`);
}
