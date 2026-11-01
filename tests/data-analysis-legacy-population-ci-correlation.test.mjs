import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

const cases = [
  {
    id: "statistics-population-sample-bias",
    previousChunks: 63,
    previousLast: "一般化できる範囲を明示します。",
    addedFirst: "構成の偏りを、架空の件数で比べます。",
    newChunks: 98,
    required: ["五十六パーセント", "七十四パーセント", "非回答者", "重み付け"],
    newSource: "https://www150.statcan.gc.ca/n1/pub/12-001-x/2016002/article/14677/02-eng.htm",
  },
  {
    id: "statistics-estimation-confidence-intervals",
    previousChunks: 66,
    previousLast: "推定条件を結果と一緒に示します。",
    addedFirst: "別の架空例で区間の幅を計算します。",
    newChunks: 102,
    required: ["〇点七八四分", "九点二二分", "十点七八分", "九点六一分", "十点三九分"],
    newSource: "https://www.itl.nist.gov/div898/handbook/prc/section1/prc14.htm",
  },
  {
    id: "statistics-correlation-regression-causality",
    previousChunks: 65,
    previousLast: "因果には追加の設計が必要です。",
    addedFirst: "架空の三週間を使って、数値も確かめます。",
    newChunks: 98,
    required: ["プラス一", "一万円", "十件", "外挿", "因果推論"],
    newSource: "https://www.itl.nist.gov/div898/software/dataplot/refman2/auxillar/correlat.htm",
  },
];

for (const config of cases) {
  test(config.id + " extends lesson without displacing its saved RSVP positions", async () => {
    const md = await read("lessons/statistics-data-analysis/" + config.id + ".md");
    const data = JSON.parse(await read("lessons/statistics-data-analysis/" + config.id + ".json"));
    const html = await read("learn/" + config.id + ".html");
    const body = md.split("## 本文")[1]?.split("## 注意")[0] ?? "";
    const numbered = [...body.matchAll(/^(\d+)\. (.+)$/gm)];
    assert.equal(numbered.length, 33 + config.newChunks - config.previousChunks);
    assert.deepEqual(numbered.map((m) => Number(m[1])), Array.from({ length: numbered.length }, (_, i) => i + 1));
    assert.equal(data.chunks.length, config.newChunks);
    assert.equal(data.chunks[config.previousChunks - 1].text, config.previousLast);
    assert.equal(data.chunks[config.previousChunks].text, config.addedFirst);
    assert.equal(numbered.map((m) => m[2]).join(""), data.chunks.map((c) => c.text).join(""));
    assert.ok(data.chunks.every((c) => c.text.trim() && [...c.text].length <= 24));
    const mdSources = [...(md.split("## 出典")[1] ?? "").matchAll(/-\s*\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g)]
      .map((m) => ({title:m[1],url:m[2]}));
    assert.deepEqual(mdSources, data.sources);
    assert.ok(data.sources.some((s) => s.url === config.newSource));
    const article = html.split('<article id="learn-article">')[1]?.split("</article>")[0] ?? "";
    assert.ok(article.length > 200);
    for (const term of config.required) assert.ok(article.includes(term), config.id + " missing " + term);
    for (const source of data.sources) assert.ok(html.includes(source.url));
    assert.ok(html.indexOf("</article>") < html.indexOf('<section class="sources"'));
  });
}

test("survey example separates unweighted response share from population composition adjustment", () => {
  const aPopulation = 8000, bPopulation = 2000;
  const aRespondents = 200, bRespondents = 800;
  const aSatisfied = 160, bSatisfied = 400;
  assert.equal((aSatisfied + bSatisfied)/(aRespondents+bRespondents),0.56);
  const adjusted = (aPopulation/(aPopulation+bPopulation))*(aSatisfied/aRespondents)
    + (bPopulation/(aPopulation+bPopulation))*(bSatisfied/bRespondents);
  assert.ok(Math.abs(adjusted-0.74)<1e-12);
});

test("known-sigma confidence interval calculations and width scaling are correct", () => {
  const sampleMean=10, populationSd=4, zCritical=1.96;
  const halfWidth100=zCritical*populationSd/Math.sqrt(100);
  const halfWidth400=zCritical*populationSd/Math.sqrt(400);
  assert.equal(halfWidth100,0.784);
  assert.equal(halfWidth400,0.392);
  assert.ok(Math.abs((sampleMean-halfWidth100)-9.216)<1e-12);
  assert.ok(Math.abs((sampleMean+halfWidth400)-10.392)<1e-12);
  assert.equal(halfWidth100/halfWidth400,2);
});

test("three observation correlation and regression example matches stated arithmetic", () => {
  const xs=[1,2,3], ys=[20,30,40];
  const mean=(a)=>a.reduce((s,x)=>s+x,0)/a.length;
  const mx=mean(xs),my=mean(ys);
  const centered=xs.map((x,i)=>({dx:x-mx,dy:ys[i]-my}));
  const cov=centered.reduce((s,p)=>s+p.dx*p.dy,0);
  const xx=centered.reduce((s,p)=>s+p.dx*p.dx,0);
  const yy=centered.reduce((s,p)=>s+p.dy*p.dy,0);
  assert.equal(cov/Math.sqrt(xx*yy),1);
  const slope=cov/xx,intercept=my-slope*mx;
  assert.equal(slope,10);
  assert.equal(intercept,10);
  assert.deepEqual(xs.map(x=>intercept+slope*x),ys);
});
