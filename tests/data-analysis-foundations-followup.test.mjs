import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
const root=new URL("../",import.meta.url);
const read=p=>readFile(new URL(p,root),"utf8");
const ids=["analysis-data-types-grain","analysis-data-collection-provenance","analysis-cleaning-reproducibility"];
test("reviewed foundations source, RSVP and Learn stay synchronized",async()=>{
 const catalog=JSON.parse(await read("lessons/index.json"));
 const courses=JSON.parse(await read("courses/index.json"));
 const foundations=courses.courses.find(c=>c.id==="data-analysis-foundations");
 assert.deepEqual(foundations.chapters,["analysis-problem-framing","analysis-kpi-denominators","analysis-data-types-grain","analysis-data-collection-provenance","analysis-data-quality-missingness","analysis-cleaning-reproducibility"]);
 const old=courses.courses.find(c=>c.id==="statistics-data-analysis");
 assert.deepEqual(old.chapters,["statistics-data-analysis-overview","statistics-descriptive-distributions","statistics-population-sample-bias","statistics-estimation-confidence-intervals","statistics-hypothesis-testing-effect-size","statistics-correlation-regression-causality"]);
 for(const id of ids){
  const meta=catalog.lessons.find(l=>l.id===id);
  assert.equal(meta?.status,"COMPLETE v0.1");
  const md=await read("lessons/statistics-data-analysis/"+id+".md");
  const json=JSON.parse(await read(meta.path.slice(2)));
  const html=await read(meta.learn_path.slice(2));
  const section=md.split("## 本文")[1].split("## 注意")[0];
  const chunks=section.split("\n").filter(x=>/^\\d+\\. /.test(x)).map(x=>x.replace(/^\\d+\\. /,""));
  assert.equal(chunks.join(""),json.chunks.map(x=>x.text).join(""),id);
  assert.ok(json.chunks.every(x=>x.text.length>0&&x.text.length<=24),id);
  assert.equal(json.sources.length,(md.split("## 出典")[1].match(/^- \\[/gm)||[]).length);
  const article=html.split('<article id="learn-article">')[1]?.split("</article>")[0]||"";
  assert.ok(article.includes("<h2>")&&article.includes("<p>"));
  assert.ok(html.indexOf("</article>")<html.indexOf('<section class="sources"'));
  for(const src of json.sources)assert.ok(html.includes(src.url));
  for(const p of [meta.path,meta.learn_path])assert.ok(new URL(p,"https://example.github.io/rsvp-learning/").pathname.startsWith("/rsvp-learning/"));
 }
});
test("foundation lessons retain material reasoning boundaries",async()=>{
 const gates={
  "analysis-data-types-grain":["観測単位","明細","名義尺度","時点"],
  "analysis-data-collection-provenance":["自動受付メール","測定誤差","定義","メタデータ"],
  "analysis-cleaning-reproducibility":["返品","元データ","再現性","正しいとは限らない"]
 };
 for(const [id,terms] of Object.entries(gates)){
  const html=await read("learn/"+id+".html");
  const article=html.split('<article id="learn-article">')[1].split("</article>")[0];
  for(const term of terms)assert.ok(article.includes(term),id+" missing "+term);
 }
});
