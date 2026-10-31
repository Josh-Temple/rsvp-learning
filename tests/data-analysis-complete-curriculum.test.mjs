import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = (p) => readFile(new URL(p, root), "utf8");
const expected = {
 "data-analysis-foundations": [
  "analysis-overview-complete","analysis-problem-framing","analysis-kpi-denominators","analysis-data-types-grain",
  "analysis-data-collection-provenance","analysis-data-quality-missingness","analysis-cleaning-reproducibility"
 ],
 "data-analysis-descriptive": [
  "statistics-descriptive-distributions","descriptive-aggregation-grouping","descriptive-distribution-outliers",
  "descriptive-visualization-choices","descriptive-rates-normalization","descriptive-crosstabs-simpson",
  "descriptive-time-patterns","descriptive-cohort-segmentation"
 ],
 "data-analysis-inference": [
  "statistics-population-sample-bias","inference-probability-random-variables","inference-sampling-error",
  "statistics-estimation-confidence-intervals","statistics-hypothesis-testing-effect-size",
  "inference-power-multiple-testing","inference-randomized-experiments","inference-ab-testing"
 ],
 "data-analysis-modeling": [
  "statistics-correlation-regression-causality","modeling-linear-multiple-regression","modeling-regression-assumptions",
  "modeling-classification-metrics","modeling-validation-leakage","modeling-time-series-forecasting",
  "modeling-causal-confounding","modeling-quasi-experiments"
 ],
 "data-analysis-practice": [
  "practical-sql-grain-joins","practical-python-pandas","practical-pipelines-validation",
  "practical-privacy-ethics","practical-dashboard-kpi","practical-report-decisions","practical-public-service-case"
 ]
};
const legacy = [
 "statistics-data-analysis-overview","statistics-descriptive-distributions","statistics-population-sample-bias",
 "statistics-estimation-confidence-intervals","statistics-hypothesis-testing-effect-size",
 "statistics-correlation-regression-causality"
];

test("38 ordered complete chapters in five courses preserve the legacy six chapter course", async () => {
 const catalog = JSON.parse(await read("lessons/index.json")).lessons;
 const courses = JSON.parse(await read("courses/index.json")).courses;
 assert.deepEqual(courses.find(c => c.id === "statistics-data-analysis").chapters, legacy);
 const ids = [];
 for (const [id,chapters] of Object.entries(expected)) {
  const course = courses.find(c => c.id === id);
  assert.ok(course, id);
  assert.deepEqual(course.chapters, chapters, id);
  ids.push(...chapters);
 }
 assert.equal(ids.length, 38);
 assert.equal(new Set(ids).size, 38);
 for (const id of ids) {
  const entry = catalog.find(l => l.id === id);
  assert.ok(entry, id + " is absent");
  assert.equal(entry.status, "COMPLETE v0.1", id);
  assert.ok(entry.learn_path, id + " has no Learn article");
  const [json, html] = await Promise.all([read(entry.path.slice(2)), read(entry.learn_path.slice(2))]);
  assert.equal(JSON.parse(json).id, id);
  assert.match(html, /<article id="learn-article">/);
 }
 const legacyOverview = catalog.find(l => l.id === legacy[0]);
 assert.equal(legacyOverview.status, "SEED / 概要のみ", "legacy progress target must be preserved");
 assert.equal(legacyOverview.learn_path, undefined);
 const newIntro = catalog.find(l => l.id === "analysis-overview-complete");
 assert.notEqual(newIntro.id, legacyOverview.id);
 assert.notEqual(newIntro.path, legacyOverview.path);
});

test("new overview source, RSVP and Learn preserve approved introductory argument", async () => {
 const md = await read("lessons/statistics-data-analysis/analysis-overview-complete.md");
 const lesson = JSON.parse(await read("lessons/statistics-data-analysis/analysis-overview-complete.json"));
 const html = await read("learn/analysis-overview-complete.html");
 const section = md.split("## 本文")[1]?.split("## 注意")[0] ?? "";
 const chunks = [...section.matchAll(/^\\d+\\. (.+)$/gm)].map(x => x[1]);
 assert.equal(chunks.join(""), lesson.chunks.map(x => x.text).join(""));
 assert.ok(chunks.length > 30);
 assert.ok(lesson.chunks.every(x => [...x.text].length >= 4 && [...x.text].length <= 24));
 const article = html.split('<article id="learn-article">')[1]?.split("</article>")[0] || "";
 for (const item of ["記述の問い","推測の問い","予測の問い","因果の問い","未完了","天候","判断"]) {
  assert.ok(article.includes(item), "missing core distinction: " + item);
 }
 assert.ok(html.indexOf("</article>") < html.indexOf('<section class="sources"'));
 for (const source of lesson.sources) assert.ok(html.includes(source.url));
});
