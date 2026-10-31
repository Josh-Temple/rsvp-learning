import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import test from "node:test";
const root=new URL("../",import.meta.url),read=p=>readFile(new URL(p,root),"utf8");
const ids=["descriptive-rates-normalization","descriptive-crosstabs-simpson","descriptive-time-patterns","descriptive-cohort-segmentation"];
test("revised descriptive course chapters retain content and catalogue invariants",async()=>{
 const cat=JSON.parse(await read("lessons/index.json")).lessons;
 const course=JSON.parse(await read("courses/index.json")).courses.find(x=>x.id==="data-analysis-descriptive");
 assert.deepEqual(course.chapters,["descriptive-aggregation-grouping","descriptive-distribution-outliers","descriptive-visualization-choices","descriptive-rates-normalization","descriptive-crosstabs-simpson","descriptive-time-patterns","descriptive-cohort-segmentation"]);
 for(const id of ids){
  const meta=cat.find(x=>x.id===id);assert.equal(meta?.status,"COMPLETE v0.1");
  const j=JSON.parse(await read(meta.path.slice(2)));
  const md=await read("lessons/statistics-data-analysis/"+id+".md");
  const sec=md.split("## 本文")[1].split("## 注意")[0].trim();
  const body=sec.split("\n").map(x=>x.trim()).filter(Boolean).map(x=>x.replace(/^\d+[.)、]\s*/,"")).join("");
  assert.equal(body,j.chunks.map(x=>x.text).join(""),id);
  assert.ok(j.chunks.every(x=>x.text.trim()&&[...x.text].length<=24),id);
  const src=[...md.split("## 出典")[1].matchAll(/-\s*\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g)].map(m=>({title:m[1],url:m[2]}));
  assert.deepEqual(src,j.sources);
  const html=await read(meta.learn_path.slice(2));
  assert.ok(html.includes('<article id="learn-article">')&&html.includes('id="speech-play"'));
  assert.ok(html.indexOf("</article>")<html.indexOf('<section class="sources"'));
  for(const source of j.sources)assert.ok(html.includes(source.url));
  for(const path of [meta.path,meta.learn_path])assert.ok(new URL(path,"https://example.github.io/rsvp-learning/").pathname.startsWith("/rsvp-learning/"));
 }
});
test("descriptive calculations and limitations survive conversion",async()=>{
 const check={
  "descriptive-rates-normalization":["八点二パーセント","三点四パーセント","標準化","因果効果"],
  "descriptive-crosstabs-simpson":["九十パーセント","四十四点五パーセント","七十五点五パーセント","シンプソン"],
  "descriptive-time-patterns":["三日平均","百二十","季節性","広告"],
  "descriptive-cohort-segmentation":["六十パーセント","五十パーセント","未観測","現在の有料会員"]
 };
 for(const [id,words] of Object.entries(check)){
  const html=await read("learn/"+id+".html"),art=html.split('<article id="learn-article">')[1]?.split("</article>")[0]||"";
  for(const word of words)assert.ok(art.includes(word),id+": "+word);
 }
});
