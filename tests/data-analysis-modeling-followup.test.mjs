import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import test from "node:test";
const root=new URL("../",import.meta.url);
const read=p=>readFile(new URL(p,root),"utf8");
const ids=["modeling-classification-metrics","modeling-causal-confounding","modeling-quasi-experiments"];
test("accepted modeling chapters retain RSVP, HTML, sources, and course order",async()=>{
 const lessons=JSON.parse(await read("lessons/index.json")).lessons;
 const course=JSON.parse(await read("courses/index.json")).courses.find(c=>c.id==="data-analysis-modeling");
 assert.deepEqual(course.chapters,["modeling-linear-multiple-regression","modeling-regression-assumptions","modeling-classification-metrics","modeling-validation-leakage","modeling-time-series-forecasting","modeling-causal-confounding","modeling-quasi-experiments"]);
 for(const id of ids){
  const meta=lessons.find(l=>l.id===id);assert.equal(meta?.status,"COMPLETE v0.1");
  const json=JSON.parse(await read(meta.path.slice(2)));
  const md=await read("lessons/statistics-data-analysis/"+id+".md");
  const lines=md.split("## 本文")[1].split("## 注意")[0].split("\n").filter(x=>/^\d+\. /.test(x)).map(x=>x.replace(/^\d+\. /,""));
  assert.equal(lines.join(""),json.chunks.map(c=>c.text).join(""));
  assert.ok(json.chunks.every(c=>c.text.length<=24));
  const html=await read(meta.learn_path.slice(2));
  assert.ok(html.indexOf("</article>")<html.indexOf('<section class="sources"'));
  for(const s of json.sources)assert.ok(html.includes(s.url));
  for(const p of [meta.path,meta.learn_path])assert.ok(new URL(p,"https://example.github.io/rsvp-learning/").pathname.startsWith("/rsvp-learning/"));
 }
});
test("model assumptions, quantitative examples, and speech exclusions remain",async()=>{
 const cls=await read("learn/modeling-classification-metrics.html");
 const causal=await read("learn/modeling-causal-confounding.html");
 const quasi=await read("learn/modeling-quasi-experiments.html");
 const article=html=>html.split('<article id="learn-article">')[1].split("</article>")[0];
 for(const term of ["九十八パーセント","五十パーセント","七十五パーセント","不良","適合率","再現率"])assert.ok(article(cls).includes(term),term);
 assert.ok(!article(cls).includes("<table>"));
 for(const term of ["交絡","媒介変数","コライダー","研修","自信"])assert.ok(article(causal).includes(term),term);
 assert.ok(!article(causal).includes("flowchart TD"));
 for(const term of ["平行トレンド","マイナス二日","七十","境界","局所"])assert.ok(article(quasi).includes(term),term);
});
