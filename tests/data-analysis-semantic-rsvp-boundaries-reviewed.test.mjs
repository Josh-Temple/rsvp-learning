import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

const reviewed = [
  {
    id: "inference-sampling-error",
    chunkCount: 65,
    expectedDigest: "01da4d2bb1806c79",
    examples: new Map([
      [14, "標準誤差は、標本を取り直したときの"],
      [24, "母標準偏差÷√標本数 です。"],
      [58, "かもしれません。"],
    ]),
  },
  {
    id: "descriptive-crosstabs-simpson",
    chunkCount: 74,
    expectedDigest: "c977ba31c1eadbff",
    examples: new Map([
      [3, "簡単な相談と難しい相談に分けると"],
      [41, "解決した割合」と「解決した相談のうち"],
      [60, "解決しやすくなるか」は因果の問いです。"],
    ]),
  },
  {
    id: "modeling-quasi-experiments",
    chunkCount: 59,
    expectedDigest: "cfd9aa3ecad4d060",
    examples: new Map([
      [1, "無作為割当が難しくても、"],
      [5, "考える設計です。観察データへ特定の式を"],
      [46, "飛ばないと仮定します。"],
      [59, "一般化できる範囲を報告します。"],
    ]),
  },
];

function fnv64(text) {
  let value = 14695981039346656037n;
  for (const ch of text) {
    value ^= BigInt(ch.codePointAt(0));
    value = (value * 1099511628211n) & ((1n << 64n) - 1n);
  }
  return value.toString(16).padStart(16, "0");
}

for (const item of reviewed) {
  test(item.id + ": all source text and positions preserved after semantic resegmentation", async () => {
    const md = await read("lessons/statistics-data-analysis/" + item.id + ".md");
    const json = JSON.parse(await read("lessons/statistics-data-analysis/" + item.id + ".json"));
    const html = await read("learn/" + item.id + ".html");
    const body = md.split("## 本文")[1]?.split("## 注意")[0] ?? "";
    const lines = [...body.matchAll(/^(\d+)\. (.+)$/gm)];
    assert.equal(lines.length, item.chunkCount);
    assert.deepEqual(lines.map((m) => Number(m[1])), Array.from({length:item.chunkCount},(_,i)=>i+1));
    assert.equal(json.chunks.length, item.chunkCount);
    const continuous = json.chunks.map((chunk) => chunk.text).join("");
    assert.equal(continuous, lines.map((line) => line[2]).join(""));
    // Digest is over Unicode code points of the baseline main lesson's full continuous text.
    assert.equal(fnv64(continuous), item.expectedDigest);
    assert.ok(json.chunks.every((chunk) => chunk.text.trim() && [...chunk.text].length >= 4 && [...chunk.text].length <= 24));
    for (const [n, expected] of item.examples) assert.equal(json.chunks[n-1].text, expected, "incorrect meaning boundary " + n);
    const sources = [...(md.split("## 出典")[1] ?? "").matchAll(/-\s*\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g)]
      .map((m) => ({title: m[1], url: m[2]}));
    assert.deepEqual(json.sources, sources);
    for (const s of sources) assert.ok(html.includes(s.url));
    assert.match(html, /<article id="learn-article">/);
  });
}
