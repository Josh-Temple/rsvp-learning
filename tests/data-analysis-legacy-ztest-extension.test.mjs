import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");
const id = "statistics-hypothesis-testing-effect-size";

function normalCdfPositive(z) {
  // Simpson integration of the standard normal density (no external dependency).
  const n = 400;
  const dx = z / n;
  const density = (x) => Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
  let sum = density(0) + density(z);
  for (let i = 1; i < n; i++) sum += (i % 2 ? 4 : 2) * density(i * dx);
  return 0.5 + (sum * dx) / 3;
}

test("legacy hypothesis lesson adds a worked Z example without shifting existing RSVP chunks", async () => {
  const md = await read("lessons/statistics-data-analysis/" + id + ".md");
  const json = JSON.parse(await read("lessons/statistics-data-analysis/" + id + ".json"));
  const html = await read("learn/" + id + ".html");
  const catalog = JSON.parse(await read("lessons/index.json")).lessons;
  const courses = JSON.parse(await read("courses/index.json")).courses;
  const lines = md.split("## 本文")[1]?.split("## 注意")[0] ?? "";
  const matches = [...lines.matchAll(/^(\d+)\. (.+)$/gm)];
  const numbered = matches.map((x) => x[2]);
  assert.equal(numbered.length, 70, "34 original chunks + 36 extension chunks");
  assert.deepEqual(matches.map((x) => Number(x[1])), Array.from({ length: 70 }, (_, i) => i + 1));
  assert.equal(json.chunks.length, 70);
  assert.equal(json.chunks[0].text, "新しい受付方法を比べるとします。");
  assert.equal(json.chunks[33].text, "再現するか別データでも確かめます。");
  assert.equal(json.chunks[34].text, "数式の意味を、架空の一標本で確かめます。");
  assert.equal(numbered.join(""), json.chunks.map((x) => x.text).join(""));
  assert.ok(json.chunks.every((x) => x.text.trim() && [...x.text].length <= 24));
  assert.match(md, /^Status: COMPLETE v0\.1$/m);
  assert.equal(catalog.find((x) => x.id === id)?.learn_path, "./learn/" + id + ".html");
  assert.deepEqual(courses.find((x) => x.id === "statistics-data-analysis")?.chapters, [
    "statistics-data-analysis-overview","statistics-descriptive-distributions",
    "statistics-population-sample-bias","statistics-estimation-confidence-intervals",
    "statistics-hypothesis-testing-effect-size","statistics-correlation-regression-causality"
  ]);
  const source = "https://www.itl.nist.gov/div898/handbook/prc/section2/prc22.htm";
  assert.ok(md.includes(source));
  assert.ok(json.sources.some((s) => s.url === source));
  assert.ok(html.includes(source));
  const article = html.split('<article id="learn-article">')[1]?.split("</article>")[0] ?? "";
  for (const term of ["帰無仮説", "母標準偏差", "〇点五分", "マイナス二", "〇点〇四五五",
                      "八点〇二分", "九点九八分", "因果効果", "比較条件"]) {
    assert.ok(article.includes(term), "missing Learn explanation: " + term);
  }
  assert.ok(html.indexOf("</article>") < html.indexOf('<section class="sources"'));
});

test("worked example numerics agree with one-sample known-sigma Z test", () => {
  const n = 64, sigma = 4, mean = 9, nullMean = 10;
  const se = sigma / Math.sqrt(n);
  const z = (mean - nullMean) / se;
  const pTwoSided = 2 * (1 - normalCdfPositive(Math.abs(z)));
  const ci = [mean - 1.96 * se, mean + 1.96 * se];
  assert.equal(se, 0.5);
  assert.equal(z, -2);
  assert.ok(Math.abs(pTwoSided - 0.04550026) < 0.000001);
  assert.ok(Math.abs(ci[0] - 8.02) < 0.000001);
  assert.ok(Math.abs(ci[1] - 9.98) < 0.000001);
});
