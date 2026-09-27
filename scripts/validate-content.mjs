import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const root = process.cwd();
const errors = [];
const warnings = [];

async function readJson(filePath) {
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw);
}

function duplicateIds(items, label) {
  const seen = new Set();
  for (const item of items) {
    if (!item?.id) continue;
    if (seen.has(item.id)) errors.push(`${label} IDが重複しています: ${item.id}`);
    seen.add(item.id);
  }
}

function hasEmbeddedMarkup(text) {
  return /https?:\/\/|www\.|\[[^\]]+\]\([^)]+\)|!\[[^\]]*\]\([^)]+\)|`[^\n]+`/.test(text);
}

const schema = await readJson(path.join(root, "schema/lesson.schema.json"));
const lessonIndex = await readJson(path.join(root, "lessons/index.json"));
const courseIndex = await readJson(path.join(root, "courses/index.json"));

const lessons = lessonIndex.lessons ?? [];
const courses = courseIndex.courses ?? [];

duplicateIds(lessons, "Lesson");
duplicateIds(courses, "Course");

const lessonIds = new Set(lessons.map((item) => item.id));
const ajv = new Ajv2020({ allErrors: true, strict: false });
addFormats(ajv);
const validate = ajv.compile(schema);

let chunkCount = 0;
let longChunkCount = 0;
let emptySourceLessons = 0;

for (const meta of lessons) {
  if (!meta?.path || typeof meta.path !== "string") {
    errors.push(`Lesson ${meta?.id ?? "(unknown)"} にpathがありません`);
    continue;
  }

  const filePath = path.resolve(root, meta.path.replace(/^\.\//, ""));
  let lesson;
  try {
    lesson = await readJson(filePath);
  } catch (error) {
    errors.push(`Lesson ${meta.id} のpathを読めません: ${meta.path} (${error.message})`);
    continue;
  }

  if (!validate(lesson)) {
    const detail = ajv.errorsText(validate.errors, { separator: "; " });
    errors.push(`Schema不適合 ${meta.id}: ${detail}`);
  }

  if (lesson.id !== meta.id) {
    errors.push(`Lesson ID不一致: catalog=${meta.id}, file=${lesson.id ?? "(missing)"}`);
  }

  if (!Array.isArray(lesson.sources) || lesson.sources.length === 0) {
    emptySourceLessons += 1;
    warnings.push(`出典なし: ${meta.id}`);
  }

  for (const [index, chunk] of (lesson.chunks ?? []).entries()) {
    chunkCount += 1;
    const text = chunk?.text;

    if (typeof text !== "string") continue;
    if (text.trim().length === 0) {
      errors.push(`空白だけのチャンク: ${meta.id} chunks[${index}]`);
    }
    if (hasEmbeddedMarkup(text)) {
      errors.push(`本文チャンクにURLまたはMarkdownらしき記法: ${meta.id} chunks[${index}] "${text}"`);
    }
    if ([...text].length > 24) {
      longChunkCount += 1;
      warnings.push(`24文字超: ${meta.id} chunks[${index}] (${[...text].length}文字) "${text}"`);
    }
  }
}

for (const course of courses) {
  if (!Array.isArray(course.chapters) || course.chapters.length === 0) {
    errors.push(`Course ${course.id} にchapterがありません`);
    continue;
  }

  const seen = new Set();
  for (const lessonId of course.chapters) {
    if (seen.has(lessonId)) {
      errors.push(`Course ${course.id} 内でchapter参照が重複しています: ${lessonId}`);
    }
    seen.add(lessonId);

    if (!lessonIds.has(lessonId)) {
      errors.push(`Course ${course.id} が未登録Lessonを参照しています: ${lessonId}`);
    }
  }
}

console.log(`Lessons: ${lessons.length}`);
console.log(`Courses: ${courses.length}`);
console.log(`Chunks: ${chunkCount}`);
console.log(`Lessons without sources: ${emptySourceLessons}`);
console.log(`Chunks over 24 chars (warning): ${longChunkCount}`);

if (warnings.length > 0) {
  console.warn("\nWarnings:");
  for (const warning of warnings) console.warn(`- ${warning}`);
}

if (errors.length > 0) {
  console.error("\nErrors:");
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log("\nContent validation: PASS");
}
