import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = (p) => readFile(new URL(p, root), "utf8");
const catalog = JSON.parse(await read("lessons/index.json"));
const courses = JSON.parse(await read("courses/index.json"));

test("the legacy statistics course keeps its existing IDs and saved resume target", () => {
  const priorChapters = [
    "statistics-data-analysis-overview",
    "statistics-descriptive-distributions",
    "statistics-population-sample-bias",
    "statistics-estimation-confidence-intervals",
    "statistics-hypothesis-testing-effect-size",
    "statistics-correlation-regression-causality",
  ];
  const oldCourse = courses.courses.find((course) => course.id === "statistics-data-analysis");
  assert.deepEqual(oldCourse?.chapters, priorChapters);
  const available = new Map(catalog.lessons.map((lesson) => [lesson.id, lesson]));
  const savedPosition = { courseId: oldCourse.id, lessonId: priorChapters[2], itemIndex: 4 };
  const playable = oldCourse.chapters.filter((id) => available.get(id)?.learn_path);
  assert.ok(playable.includes(savedPosition.lessonId), "existing Learn resume target disappeared");
  for (const id of priorChapters) assert.ok(available.has(id), `${id} disappeared`);
});

test("the KPI lesson preserves the measured quantities and limits in the spoken article", async () => {
  const meta = catalog.lessons.find((lesson) => lesson.id === "analysis-kpi-denominators");
  assert.ok(meta?.learn_path && meta.path);
  const html = await read(meta.learn_path.replace(/^\.\//, ""));
  const article = html.match(/<article\b[^>]*>([\s\S]*?)<\/article>/i)?.[1] ?? "";
  for (const terms of [
    ["百件", "三十件", "三十パーセント"],
    ["六十人", "二十人", "三十三パーセント"],
    ["三十件", "六十人", "零点五件"],
    ["七日", "観測", "再連絡なし"],
    ["分母が零", "計算できません"],
    ["連絡しにくく", "諦めた"],
    ["旧定義", "変更点", "系列"],
  ]) assert.ok(terms.every((term) => article.includes(term)), terms.join(" / "));
  assert.ok(article.includes("ケーピーアイ"), "first pronunciation is missing");
  assert.ok(html.indexOf("</article>") < html.indexOf('<section class="sources"'));
});

test("the practical lectures retain their key examples and limits", async () => {
  const gates = {
    "practical-pipelines-validation": [
      ["同じ版の入力", "処理規則"], ["入力漏れ", "再現"], ["受付アイディー", "一意"],
    ],
    "practical-privacy-ethics": [
      ["行政機関等編", "民間事業者"], ["匿名加工情報", "仮名加工情報"],
      ["再識別", "粒度"], ["集団", "不利益"],
    ],
    "practical-report-decisions": [
      ["八日", "六日", "完了"], ["信頼区間", "偏り"], ["因果効果", "読み取れません"],
    ],
    "practical-public-service-case": [
      ["架空", "実際の自治体の調査結果ではありません"],
      ["三百七十五を五百で割り", "七十五パーセント", "八十パーセント", "五パーセントポイント"],
      ["十四日間", "追跡", "分母"], ["因果効果", "特定できない"],
    ],
  };
  for (const [id, requirements] of Object.entries(gates)) {
    const meta = catalog.lessons.find((lesson) => lesson.id === id);
    const html = await read(meta.learn_path.replace(/^\.\//, ""));
    const article = html.match(/<article\b[^>]*>([\s\S]*?)<\/article>/i)?.[1] ?? "";
    for (const terms of requirements) assert.ok(terms.every((term) => article.includes(term)), `${id}: ${terms.join(" / ")}`);
    assert.ok(html.indexOf("</article>") < html.indexOf('<section class="sources"'));
  }
});

test("the new lesson paths stay under the GitHub Pages base path", async () => {
  const ids = ["analysis-kpi-denominators", "practical-pipelines-validation", "practical-privacy-ethics",
    "practical-report-decisions", "practical-public-service-case"];
  for (const id of ids) {
    const meta = catalog.lessons.find((lesson) => lesson.id === id);
    for (const path of [meta.path, meta.learn_path]) {
      const url = new URL(path, "https://example.github.io/rsvp-learning/");
      assert.ok(url.pathname.startsWith("/rsvp-learning/"));
      await read(path.replace(/^\.\//, ""));
    }
  }
});
