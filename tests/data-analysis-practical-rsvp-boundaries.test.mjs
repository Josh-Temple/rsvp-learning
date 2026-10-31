import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const legacyIds = new Set([
  "statistics-data-analysis-overview", "statistics-descriptive-distributions",
  "statistics-population-sample-bias", "statistics-estimation-confidence-intervals",
  "statistics-hypothesis-testing-effect-size", "statistics-correlation-regression-causality",
  "analysis-overview-complete",
]);
const read = (path) => readFile(new URL(path, root), "utf8");

test("all 32 new data-analysis lessons avoid tiny RSVP fragments without content drift", async () => {
  const courses = JSON.parse(await read("courses/index.json")).courses;
  const ids = courses.filter((course) => course.id.startsWith("data-analysis-"))
    .flatMap((course) => course.chapters)
    .filter((id) => !legacyIds.has(id));
  assert.equal(ids.length, 32);
  assert.equal(new Set(ids).size, 32);

  for (const id of ids) {
    const base = "lessons/statistics-data-analysis/" + id;
    const json = JSON.parse(await read(base + ".json"));
    const md = await read(base + ".md");
    const body = md.split("## 本文")[1]?.split("## 注意")[0] ?? "";
    const parts = [...body.matchAll(/^\d+\. (.+)$/gm)].map((match) => match[1]);
    assert.ok(parts.length >= 10, id + ": incomplete Markdown body");
    assert.equal(parts.join(""), json.chunks.map((chunk) => chunk.text).join(""), id);
    for (const [i, chunk] of json.chunks.entries()) {
      const len = [...chunk.text].length;
      assert.ok(len >= 4 && len <= 24, id + ": fragmented chunk " + i + " (" + chunk.text + ")");
      assert.doesNotMatch(chunk.text, /^[。、！？.,]+$/, id + ": punctuation-only chunk " + i);
    }
  }
});
