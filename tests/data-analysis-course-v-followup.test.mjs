import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
const root=new URL("../",import.meta.url);
const read=p=>readFile(new URL(p,root),"utf8");
const ids=["practical-sql-grain-joins","practical-python-pandas","practical-dashboard-kpi"];
test("the three reviewed practical lessons are synchronized and reachable under GitHub Pages",async()=>{
  const catalog=JSON.parse(await read("lessons/index.json"));
  const courses=JSON.parse(await read("courses/index.json"));
  const practical=courses.courses.find(x=>x.id==="data-analysis-practice");
  assert.deepEqual(practical.chapters,["practical-sql-grain-joins","practical-python-pandas","practical-pipelines-validation","practical-privacy-ethics","practical-dashboard-kpi","practical-report-decisions","practical-public-service-case"]);
  for(const id of ids){
    const meta=catalog.lessons.find(x=>x.id===id);
    assert.equal(meta?.status,"COMPLETE v0.1");
    const json=JSON.parse(await read(meta.path.replace(/^\\.\\//,"")));
    const md=await read("lessons/statistics-data-analysis/"+id+".md");
    const html=await read(meta.learn_path.replace(/^\\.\\//,""));
    const section=md.split("## 本文")[1].split("## 注意")[0];
    const lines=[...section.matchAll(/^\\d+\\. (.+)$/gm)].map(x=>x[1]);
    assert.equal(lines.join(""),json.chunks.map(x=>x.text).join(""),id);
    assert.ok(json.chunks.every(x=>[...x.text].length<=24),id+" long chunk");
    assert.match(html,/<article id="learn-article">/);
    assert.ok(html.indexOf("</article>")<html.indexOf('<section class="sources"'));
    assert.ok(html.includes("再生")&&html.includes("一時停止"));
    for(const s of json.sources)assert.ok(html.includes(s.url),id+" "+s.url);
    for(const path of [meta.path,meta.learn_path])assert.ok(new URL(path,"https://example.github.io/rsvp-learning/").pathname.startsWith("/rsvp-learning/"));
  }
});
test("the course V factual examples and semantic caveats stay in Learn articles",async()=>{
 const checks={
  "practical-sql-grain-joins":["三件","六行","COUNT(*)","NULL","外部結合"],
  "practical-python-pandas":["四件","三件","dropna=False","merge","欠損"],
  "practical-dashboard-kpi":["二割","三割","パーセントポイント","分子","分母","原因"]
 };
 for(const [id,terms] of Object.entries(checks)){
  const html=await read("learn/"+id+".html");
  const article=html.split('<article id="learn-article">')[1]?.split("</article>")[0]||"";
  for(const term of terms)assert.ok(article.includes(term),id+" missing "+term);
 }
});
