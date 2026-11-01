import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");
const folder = "lessons/statistics-data-analysis/";
const legacy = new Set([
  "statistics-descriptive-distributions",
  "statistics-population-sample-bias",
  "statistics-estimation-confidence-intervals",
  "statistics-hypothesis-testing-effect-size",
  "statistics-correlation-regression-causality",
]);

const reviewed = [
  ["analysis-data-collection-provenance", 76, "9ebeb5cc5e9c7719", [[4,"現在は自動受付メールを初回応答として"],[5,"記録していました。"]]],
  ["analysis-cleaning-reproducibility", 76, "0820bbb0fc372525", [[54,"場合と、欠損のある行を落としてから"],[55,"集計する場合では、合計の対象が違い得ます。"]]],
  ["descriptive-visualization-choices", 73, "d421519379a09681", [[60,"説明のない色分けが比較を"],[61,"難しくしていないか点検します。"]]],
  ["inference-sampling-error", 65, "01da4d2bb1806c79", [[1,"同じ工場で、百個の製品を調べて平均重量を計算"],[3,"標本分布は、このように同じ手順で標本を"],[5,"どのように変わるかを表す分布です。"]]],
  ["inference-power-multiple-testing", 66, "ddf4a31cf75d7902", [[18,"同じ件数でも、小さい差や不安定な測定では"],[19,"見逃しやすくなります。"]]],
  ["modeling-linear-multiple-regression", 63, "2fd2d70844bd8f80", [[9,"一キロメートルにつき二分を加える」と"],[10,"表してみます。"]]],
  ["modeling-regression-assumptions", 63, "93b42428bdd96209", [[60,"多く説明した値があっても、その範囲で"],[61,"正しく使える保証にはなりません。"]]],
  ["modeling-causal-confounding", 60, "409f3eaeefd1e1f1", [[34,"研修の総効果、つまり自信を通る分も含めた"],[35,"変化を知りたいのに、自信を固定して比較すると、"]]],
  ["practical-sql-grain-joins", 66, "36361342f5a4bf58", [[12,"注文IDで内結合すると、注文情報が"],[13,"各明細へ繰り返され、結果は六行になります。"],[50,"その列がNULLでない行を数えます。"]]],
  ["practical-dashboard-kpi", 57, "80e25203892d9f6e", [[54,"ダッシュボードは「何が起きているか」の"],[55,"監視に役立ちますが、「なぜ起きたか」や"]]],
  ["practical-python-pandas", 74, "ddbc35f1bac2c0c8", [[57,"検査を通過しても、対応履歴の内容が"],[58,"現実を正しく表すとは限りません。"]]],
];

function fnv64(source) {
  let hash = 14695981039346656037n;
  for (const character of source) {
    hash ^= BigInt(character.codePointAt(0));
    hash = (hash * 1099511628211n) & ((1n << 64n) - 1n);
  }
  return hash.toString(16).padStart(16, "0");
}

test("new and legacy chapter catalog contains 38 unique lessons in 5 expected courses", async () => {
  const all = JSON.parse(await read("courses/index.json")).courses;
  const courses = all.filter((course) => course.id.startsWith("data-analysis-"));
  assert.equal(courses.length, 5);
  assert.deepEqual(courses.map((c) => c.chapters.length), [7,8,8,8,7]);
  const ids = courses.flatMap((c) => c.chapters);
  assert.equal(ids.length, 38);
  assert.equal(new Set(ids).size, 38);
  assert.ok(!ids.includes("statistics-data-analysis-overview"), "legacy seed remains in its own course");

  for (const id of ids) {
    const lesson = JSON.parse(await read(folder + id + ".json"));
    const markdown = await read(folder + id + ".md");
    const html = await read("learn/" + id + ".html");
    assert.equal(lesson.id, id);
    assert.ok(lesson.chunks.length >= 25, id + " missing lesson content");
    assert.ok(lesson.chunks.every((chunk) => typeof chunk.text === "string" && chunk.text.trim()), id);
    const body = markdown.split("## 本文")[1]?.split("## 注意")[0] ?? "";
    const numbered = [...body.matchAll(/^(\d+)\. (.+)$/gm)];
    assert.ok(numbered.length >= 1, id + " missing numbered manuscript");
    assert.deepEqual(numbered.map((m) => Number(m[1])), Array.from({length:numbered.length},(_,i)=>i+1),id);
    assert.equal(numbered.map((m) => m[2]).join(""), lesson.chunks.map((c) => c.text).join(""), id + " manuscript differs from RSVP narration");
    // Numbered manuscript paragraphs and RSVP chunks use different segmentation.
    // Preserve exact narrated text without assuming their counts are identical.
    const sources = [...(markdown.split("## 出典")[1] ?? "").matchAll(/-\s*\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g)]
      .map((m) => ({title:m[1],url:m[2]}));
    assert.deepEqual(sources,lesson.sources,id+" source metadata differs");
    assert.ok(html.includes('<article id="learn-article">'),id);
    for(const source of lesson.sources) {
      assert.ok(html.includes(source.url) || html.includes(source.url.replaceAll("&","&amp;")),id+" Learn HTML missing source "+source.url);
    }
  }
});

test("11 additional resegmented chapters preserve exact narration and stable indices", async () => {
  for (const [id, count, digest, samples] of reviewed) {
    const j=JSON.parse(await read(folder+id+".json"));
    assert.equal(j.chunks.length,count,id+" chunk count");
    const continuous=j.chunks.map(x=>x.text).join("");
    assert.equal(fnv64(continuous),digest,id+" continuous source text changed");
    assert.ok(j.chunks.every(x=>[...x.text].length<=24),id+" oversized chunk");
    for (const [index, expected] of samples) assert.equal(j.chunks[index-1].text,expected,id+": "+index);
  }
});
