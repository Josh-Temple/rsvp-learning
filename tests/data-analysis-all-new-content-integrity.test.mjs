import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");
const expectedCourses = {
  "data-analysis-foundations": 7,
  "data-analysis-descriptive": 8,
  "data-analysis-inference": 8,
  "data-analysis-modeling": 8,
  "data-analysis-practice": 7,
};
const nonNewIds = new Set(["analysis-overview-complete", "statistics-descriptive-distributions",
  "statistics-population-sample-bias", "statistics-estimation-confidence-intervals",
  "statistics-hypothesis-testing-effect-size", "statistics-correlation-regression-causality"]);
const legacy = [
  "statistics-data-analysis-overview",
  "statistics-descriptive-distributions",
  "statistics-population-sample-bias",
  "statistics-estimation-confidence-intervals",
  "statistics-hypothesis-testing-effect-size",
  "statistics-correlation-regression-causality",
];

test("all 32 new statistics lessons preserve source, chunks, Learn and Pages routing", async () => {
  const catalog = JSON.parse(await read("lessons/index.json")).lessons;
  const courses = JSON.parse(await read("courses/index.json")).courses;
  const old = courses.find((course) => course.id === "statistics-data-analysis");
  assert.deepEqual(old?.chapters, legacy, "do not change existing resume targets");
  const newChapters = [];
  for (const [courseId, count] of Object.entries(expectedCourses)) {
    const course = courses.find((entry) => entry.id === courseId);
    assert.equal(course?.chapters.length, count, courseId);
    newChapters.push(...course.chapters.filter((id) => !nonNewIds.has(id)));
  }
  assert.equal(newChapters.length, 32);
  assert.equal(new Set(newChapters).size, 32);
  for (const id of newChapters) {
    const item = catalog.find((entry) => entry.id === id);
    assert.ok(item, id + " is missing from catalog");
    assert.equal(item.status, "COMPLETE v0.1", id);
    assert.equal(item.path, "./lessons/statistics-data-analysis/" + id + ".json", id);
    assert.equal(item.learn_path, "./learn/" + id + ".html", id);
    const json = JSON.parse(await read(item.path.slice(2)));
    const md = await read("lessons/statistics-data-analysis/" + id + ".md");
    const html = await read(item.learn_path.slice(2));
    assert.equal(json.id, id);
    assert.match(md, /^Status: COMPLETE v0\.1$/m, id);
    const body = md.split("## 本文")[1]?.split("## 注意")[0] || "";
    const numbered = [...body.matchAll(/^\d+\. (.+)$/gm)].map((match) => match[1]);
    assert.ok(numbered.length >= 10, id + ": incomplete RSVP section");
    assert.equal(numbered.join(""), json.chunks.map((chunk) => chunk.text).join(""), id + ": Markdown/JSON drift");
    for (let i = 0; i < json.chunks.length; i++) {
      const chunk = json.chunks[i].text;
      assert.ok(chunk.trim() && [...chunk].length <= 24, id + ": invalid chunk " + i);
      assert.doesNotMatch(chunk, /^[。、！？.,]+$/, id + ": isolated punctuation " + i);
      const next = json.chunks[i + 1]?.text || "";
      assert.ok(!(/[A-Za-z]$/.test(chunk) && /^[A-Za-z]/.test(next)), id + ": English token split " + i);
    }
    const sourceLines = md.split("## 出典")[1] || "";
    const sources = [...sourceLines.matchAll(/-\s*\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g)]
      .map((match) => ({ title: match[1], url: match[2] }));
    assert.deepEqual(sources, json.sources, id + ": source drift");
    const article = html.match(/<article id="learn-article">([\s\S]*?)<\/article>/)?.[1] || "";
    assert.ok(article.includes("<h1>") && article.includes("<p"), id + ": no static article");
    assert.ok(html.includes('id="speech-play"') && html.includes('id="speech-pause"'), id);
    assert.ok(html.indexOf("</article>") < html.indexOf('<section class="sources"'), id + ": sources read aloud");
    for (const source of sources) assert.ok(html.includes(source.url), id + ": missing HTML source " + source.url);
    for (const path of [item.path, item.learn_path]) {
      const resolved = new URL(path, "https://example.github.io/rsvp-learning/");
      assert.ok(resolved.pathname.startsWith("/rsvp-learning/"), id + ": path escapes Pages base");
    }
  }
});
