import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");
const normalize = (value) => value
  .replace(/<[^>]*>/g, "")
  .replace(/&[^;]{2,12};/g, "")
  .replace(/\s/g, "")
  .replace(/[「」『』（）()\[\]`]/g, "");

const criticalTerms = {
  "analysis-data-quality-missingness": [
    "MCAR",
    "MAR",
    "MNAR",
    "信頼区間ではありません",
    "観測データだけでMARかMNARかを確定できるとは限りません"
  ],
  "inference-ab-testing": [
    "無作為割当",
    "停止規則",
    "誤り率",
    "五パーセントポイント",
    "十分な標本数だと推奨するものではありません"
  ],
  "inference-power-multiple-testing": [
    "六十四点二パーセント",
    "〇点〇〇二五",
    "独立性",
    "探索"
  ],
  "descriptive-crosstabs-simpson": [
    "九十パーセント",
    "四十四点五パーセント",
    "七十五点五パーセント",
    "因果の問い"
  ],
  "modeling-quasi-experiments": [
    "平行トレンド",
    "マイナス二日",
    "境界付近",
    "一般化"
  ],
  "modeling-causal-confounding": [
    "交絡因子",
    "媒介変数",
    "コライダー",
    "未測定"
  ],
  "modeling-validation-leakage": [
    "予測する時点",
    "学習側",
    "テスト側",
    "因果効果"
  ],
  "practical-sql-grain-joins": [
    "COUNT(*)",
    "DISTINCT",
    "NULL",
    "左外部結合"
  ],
  "practical-python-pandas": [
    "dropna=False",
    "validate=",
    "欠損キー",
    "正式な部署"
  ],
  "practical-pipelines-validation": [
    "再現可能",
    "アサーション",
    "入力漏れ"
  ],
  "practical-privacy-ethics": [
    "行政機関等編",
    "匿名加工情報",
    "仮名加工情報",
    "再識別",
    "公平性"
  ],
  "practical-dashboard-kpi": [
    "パーセントポイント",
    "分子",
    "分母",
    "閾値",
    "統計学的有意性"
  ],
  "practical-public-service-case": [
    "架空",
    "三百七十五を五百で割り",
    "七十五パーセント",
    "五パーセントポイント",
    "因果効果を特定できない"
  ]
};

test("all 32 new Learn lectures retain most RSVP prose and critical teaching conditions", async () => {
  const courses = JSON.parse(await read("courses/index.json")).courses;
  const ids = courses.filter((course) => course.id.startsWith("data-analysis-"))
    .flatMap((course) => course.chapters);
  assert.equal(ids.length, 32);
  assert.equal(new Set(ids).size, 32);
  for (const id of ids) {
    const md = await read("lessons/statistics-data-analysis/" + id + ".md");
    const html = await read("learn/" + id + ".html");
    const section = md.split("## 本文")[1]?.split("## 注意")[0] ?? "";
    const sentence = [...section.matchAll(/^\d+\. (.+)$/gm)].map((match) => match[1]).join("");
    const article = html.match(/<article id="learn-article">([\s\S]*?)<\/article>/)?.[1];
    assert.ok(article, id + ": missing static spoken article");
    const sourceText = normalize(sentence);
    const spokenText = normalize(article);
    assert.ok(sourceText.length > 500, id + ": source missing teaching prose");
    let windows = 0, retained = 0;
    for (let i = 0; i + 12 < sourceText.length; i += 3) {
      windows++;
      if (spokenText.includes(sourceText.slice(i, i + 12))) retained++;
    }
    // This checks substantial omission, not semantic or numerical correctness.
    // The 10% leeway allows pronunciation expansion and small edits.
    assert.ok(retained / windows >= 0.90,
      id + ": low Learn prose retention (" + (100 * retained / windows).toFixed(1) + "%)");
    for (const term of criticalTerms[id] ?? []) {
      assert.ok(article.includes(term), id + ": missing critical condition or example: " + term);
    }
  }
});
