import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const ids = [
  "practical-sql-grain-joins",
  "practical-python-pandas",
  "practical-dashboard-kpi",
];
const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

test("reviewed practical RSVP chunks do not leave sentence endings as tiny fragments", async () => {
  for (const id of ids) {
    const base = "lessons/statistics-data-analysis/" + id;
    const json = JSON.parse(await read(base + ".json"));
    const md = await read(base + ".md");
    const body = md.split("## 本文")[1]?.split("## 注意")[0] ?? "";
    const parts = [...body.matchAll(/^\d+\. (.+)$/gm)].map((match) => match[1]);
    assert.equal(parts.length, json.chunks.length, id);
    assert.equal(parts.join(""), json.chunks.map((chunk) => chunk.text).join(""), id);
    for (const [i, chunk] of json.chunks.entries()) {
      const len = [...chunk.text].length;
      assert.ok(len >= 4 && len <= 24, id + ": visually fragmented chunk " + i + " (" + chunk.text + ")");
    }
  }
});
