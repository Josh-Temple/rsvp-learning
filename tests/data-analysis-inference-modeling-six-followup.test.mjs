import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
const root=new URL("../",import.meta.url),read=p=>readFile(new URL(p,root),"utf8");
const ids=["inference-probability-random-variables","inference-sampling-error","inference-power-multiple-testing","modeling-linear-multiple-regression","modeling-regression-assumptions","modeling-time-series-forecasting"];
test("new inference and modeling lessons are synchronized with their catalog and Pages paths",async()=>{
 const catalog=JSON.parse(await read("lessons/index.json")).lessons;
 const courses=JSON.parse(await read("courses/index.json")).courses;
 assert.deepEqual(courses.find(c=>c.id==="data-analysis-inference").chapters,["inference-probability-random-variables","inference-sampling-error","inference-power-multiple-testing","inference-randomized-experiments","inference-ab-testing"]);
 assert.deepEqual(courses.find(c=>c.id==="data-analysis-modeling").chapters,["modeling-linear-multiple-regression","modeling-regression-assumptions","modeling-classification-metrics","modeling-validation-leakage","modeling-time-series-forecasting","modeling-causal-confounding","modeling-quasi-experiments"]);
 assert.deepEqual(courses.find(c=>c.id==="statistics-data-analysis").chapters,["statistics-data-analysis-overview","statistics-descriptive-distributions","statistics-population-sample-bias","statistics-estimation-confidence-intervals","statistics-hypothesis-testing-effect-size","statistics-correlation-regression-causality"]);
 for(const id of ids){
  const meta=catalog.find(x=>x.id===id);assert.equal(meta?.status,"COMPLETE v0.1");
  const data=JSON.parse(await read(meta.path.slice(2)));
  const md=await read("lessons/statistics-data-analysis/"+id+".md");
  const source=md.split("## 本文")[1].split("## 注意")[0].trim().split("\n").map(s=>s.trim()).filter(Boolean).map(s=>s.replace(/^\d+[.)、]\s*/,"")).join("");
  assert.equal(source,data.chunks.map(c=>c.text).join(""),id);
  assert.ok(data.chunks.every(c=>c.text.trim()&&[...c.text].length<=24),id);
  const sourceLinks=[...md.split("## 出典")[1].matchAll(/-\s*\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g)].map(s=>({title:s[1],url:s[2]}));
  assert.deepEqual(sourceLinks,data.sources);
  const html=await read(meta.learn_path.slice(2));
  assert.ok(html.includes('<article id="learn-article">')&&html.includes('id="speech-play"'));
  assert.ok(html.indexOf("</article>")<html.indexOf('<section class="sources"'));
  for(const s of data.sources)assert.ok(html.includes(s.url));
  for(const p of [meta.path,meta.learn_path])assert.ok(new URL(p,"https://example.github.io/rsvp-learning/").pathname.startsWith("/rsvp-learning/"));
 }
});
test("sample formulas and uncertainty caveats survive into Learn",async()=>{
 const checks={
 "inference-probability-random-variables":["二十五パーセント","五十パーセント","〇点四八八","独立"],
 "inference-sampling-error":["一グラム","〇点五グラム","中心極限定理","偏り"],
 "inference-power-multiple-testing":["六十四点二パーセント","〇点〇〇二五","独立性","検出力"],
 "modeling-linear-multiple-regression":["二十六分","三十一分","因果"],
 "modeling-regression-assumptions":["プラス十分","残差","正規性"],
 "modeling-time-series-forecasting":["十三点三個","予測区間","因果"]
 };
 for(const [id,words] of Object.entries(checks)){
  const html=await read("learn/"+id+".html");
  const art=html.split('<article id="learn-article">')[1]?.split("</article>")[0]||"";
  for(const word of words)assert.ok(art.includes(word),id+" missing "+word);
 }
});
