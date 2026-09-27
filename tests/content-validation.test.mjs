import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const validatorPath = path.join(repoRoot, "scripts/validate-content.mjs");
const schemaPath = path.join(repoRoot, "schema/lesson.schema.json");

function lesson(id = "lesson-a") {
  return {
    schema_version: 1,
    id,
    title: "Lesson A",
    topic: "Test",
    summary: "test",
    created_at: "2026-09-27",
    base_duration_ms: 650,
    sources: [{ title: "Test source", url: "https://example.com/source" }],
    chunks: [{ text: "短い意味単位", duration_multiplier: 1 }],
  };
}

async function makeFixture({
  lessons = [{ id: "lesson-a", title: "Lesson A", topic: "Test", path: "./lessons/test/lesson-a.json" }],
  courses = [{ id: "course-a", title: "Course A", chapters: ["lesson-a"] }],
  lessonFiles = { "lessons/test/lesson-a.json": lesson() },
} = {}) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "rsvp-validator-"));
  await fs.mkdir(path.join(root, "schema"), { recursive: true });
  await fs.mkdir(path.join(root, "lessons"), { recursive: true });
  await fs.mkdir(path.join(root, "courses"), { recursive: true });

  await fs.copyFile(schemaPath, path.join(root, "schema/lesson.schema.json"));
  await fs.writeFile(
    path.join(root, "lessons/index.json"),
    JSON.stringify({ lessons }, null, 2),
  );
  await fs.writeFile(
    path.join(root, "courses/index.json"),
    JSON.stringify({ courses }, null, 2),
  );

  for (const [relativePath, data] of Object.entries(lessonFiles)) {
    const target = path.join(root, relativePath);
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, JSON.stringify(data, null, 2));
  }

  return root;
}

function runValidator(root) {
  return spawnSync(process.execPath, [validatorPath], {
    cwd: root,
    encoding: "utf8",
  });
}

test("validator accepts a structurally valid fixture", async (t) => {
  const root = await makeFixture();
  t.after(() => fs.rm(root, { recursive: true, force: true }));

  const result = runValidator(root);

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Content validation: PASS/);
});

test("validator rejects duplicate lesson IDs", async (t) => {
  const root = await makeFixture({
    lessons: [
      { id: "lesson-a", title: "Lesson A", topic: "Test", path: "./lessons/test/lesson-a.json" },
      { id: "lesson-a", title: "Lesson A copy", topic: "Test", path: "./lessons/test/lesson-a-copy.json" },
    ],
    lessonFiles: {
      "lessons/test/lesson-a.json": lesson("lesson-a"),
      "lessons/test/lesson-a-copy.json": lesson("lesson-a"),
    },
  });
  t.after(() => fs.rm(root, { recursive: true, force: true }));

  const result = runValidator(root);

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Lesson IDが重複しています: lesson-a/);
});

test("validator rejects a course reference to an unregistered lesson", async (t) => {
  const root = await makeFixture({
    courses: [{ id: "course-a", title: "Course A", chapters: ["missing-lesson"] }],
  });
  t.after(() => fs.rm(root, { recursive: true, force: true }));

  const result = runValidator(root);

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /未登録Lessonを参照しています: missing-lesson/);
});

test("validator rejects schema-invalid lesson data", async (t) => {
  const invalid = lesson("lesson-a");
  invalid.base_duration_ms = 100;

  const root = await makeFixture({
    lessonFiles: { "lessons/test/lesson-a.json": invalid },
  });
  t.after(() => fs.rm(root, { recursive: true, force: true }));

  const result = runValidator(root);

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Schema不適合 lesson-a/);
});
