import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");
const id = "statistics-descriptive-distributions";

test("descriptive statistics example preserves existing positions and aligns Markdown/JSON/Learn", async () => {
  const md = await read("lessons/statistics-data-analysis/" + id + ".md");
  const json = JSON.parse(await read("lessons/statistics-data-analysis/" + id + ".json"));
  const html = await read("learn/" + id + ".html");
  const body = md.split("## 本文")[1]?.split("## 注意")[0] ?? "";
  const numbered = [...body.matchAll(/^(\d+)\. (.+)$/gm)];
  assert.equal(numbered.length, 68);
  assert.deepEqual(numbered.map((m) => Number(m[1])), Array.from({ length: 68 }, (_, i) => i + 1));
  assert.equal(json.chunks.length, 101);
  assert.equal(json.chunks[0].text, "データ分析では、");
  assert.equal(json.chunks[67].text, "代表値だけで結論を出しません。");
  assert.equal(json.chunks[68].text, "さきほどの五件で、分散も計算してみます。");
  assert.equal(numbered.map((m) => m[2]).join(""), json.chunks.map((c) => c.text).join(""));
  assert.ok(json.chunks.every((c) => c.text.trim() && [...c.text].length <= 24));
  const sources = [...(md.split("## 出典")[1] ?? "").matchAll(/-\s*\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g)]
    .map((m) => ({title: m[1], url: m[2]}));
  assert.deepEqual(sources, json.sources);
  const url = "https://online.stat.psu.edu/stat500/Lesson01";
  assert.ok(json.sources.some((x) => x.url === url));
  assert.ok(html.includes(url));
  const article = html.split('<article id="learn-article">')[1]?.split("</article>")[0] ?? "";
  for (const word of ["母分散", "標本分散", "百八十二", "三十六点四", "四十五点五",
                      "六点〇三分", "六点七五分", "二十パーセント"]) {
    assert.ok(article.includes(word), "missing Learn teaching point: " + word);
  }
  assert.ok(html.indexOf("</article>") < html.indexOf('<section class="sources"'));
});

test("five-case population and sample dispersion examples are mathematically correct", () => {
  const times = [2, 3, 3, 4, 18];
  const mean = times.reduce((a, b) => a + b, 0) / times.length;
  const squared = times.reduce((a, b) => a + (b - mean) ** 2, 0);
  const populationVariance = squared / times.length;
  const sampleVariance = squared / (times.length - 1);
  assert.equal(mean, 6);
  assert.equal(squared, 182);
  assert.equal(populationVariance, 36.4);
  assert.equal(sampleVariance, 45.5);
  assert.ok(Math.abs(Math.sqrt(populationVariance) - 6.03) < 0.01);
  assert.ok(Math.abs(Math.sqrt(sampleVariance) - 6.75) < 0.01);
  assert.equal(times.filter((x) => x > 10).length / times.length, 0.2);
});
