import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
const root=new URL("../",import.meta.url);
const read=p=>readFile(new URL(p,root),"utf8");
const ids=["descriptive-aggregation-grouping","descriptive-distribution-outliers","descriptive-visualization-choices"];
test("descriptive chapters remain synchronized and addressable under GitHub Pages",async()=>{
 const catalog=JSON.parse(await read("lessons/index.json"));
 const courses=JSON.parse(await read("courses/index.json"));
 const newCourse=courses.courses.find(c=>c.id==="data-analysis-descriptive");
 assert.deepEqual(newCourse.chapters,["statistics-descriptive-distributions",...ids,...["descriptive-rates-normalization","descriptive-crosstabs-simpson","descriptive-time-patterns","descriptive-cohort-segmentation"]]);
 const legacy=courses.courses.find(c=>c.id==="statistics-data-analysis");
 assert.deepEqual(legacy.chapters,["statistics-data-analysis-overview","statistics-descriptive-distributions","statistics-population-sample-bias","statistics-estimation-confidence-intervals","statistics-hypothesis-testing-effect-size","statistics-correlation-regression-causality"]);
 for(const id of ids){
  const meta=catalog.lessons.find(l=>l.id===id);assert.equal(meta?.status,"COMPLETE v0.1");
  const json=JSON.parse(await read(meta.path.slice(2)));
  const md=await read("lessons/statistics-data-analysis/"+id+".md");
  const html=await read(meta.learn_path.slice(2));
  const numberLines=md.split("## 本文")[1].split("## 注意")[0].split("\n").map(x=>x.trim()).filter(Boolean).map(x=>x.replace(/^\d+[.)、]\s*/,""));
  assert.equal(numberLines.join(""),json.chunks.map(x=>x.text).join(""),id);
  assert.ok(json.chunks.every(x=>x.text.trim()&&[...x.text].length<=24),id);
  const sourceLines=[...md.split("## 出典")[1].matchAll(/-\s*\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g)].map(m=>({title:m[1],url:m[2]}));
  assert.deepEqual(sourceLines,json.sources);
  assert.ok(html.includes('<article id="learn-article">')&&html.includes('id="speech-play"'));
  assert.ok(html.indexOf("</article>")<html.indexOf('<section class="sources"'));
  for(const src of json.sources)assert.ok(html.includes(src.url));
  for(const p of [meta.path,meta.learn_path])assert.ok(new URL(p,"https://example.github.io/rsvp-learning/").pathname.startsWith("/rsvp-learning/"));
 }
});
test("descriptive lectures retain key examples, assumptions, and limitations",async()=>{
 const checks={
  "descriptive-aggregation-grouping":["十人","九十人","九点二分","五十三パーセント","因果関係"],
  "descriptive-distribution-outliers":["千グラム","削除","探索","確証","仮説"],
  "descriptive-visualization-choices":["百件","百十件","九十件","軸","音声"]
 };
 for(const [id,words] of Object.entries(checks)){
  const html=await read("learn/"+id+".html");
  const article=html.split('<article id="learn-article">')[1]?.split("</article>")[0]||"";
  for(const word of words)assert.ok(article.includes(word),id+" missing "+word);
 }
});
