import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";

test("registered Listen pages satisfy the minimum read-aloud contract", async () => {
  const index = JSON.parse(await fs.readFile("listen/index.json", "utf8"));
  assert.ok(Array.isArray(index.items));
  assert.ok(index.items.length >= 3);

  for (const item of index.items) {
    const file = path.join("listen", item.path.replace(/^\.\//, ""));
    const html = await fs.readFile(file, "utf8");

    assert.match(html, /<html lang="ja">/i, `${item.id}: lang=ja`);
    assert.match(html, /<article id="article">/i, `${item.id}: static article`);
    assert.match(html, /<p[ >]/i, `${item.id}: paragraph text`);
    assert.match(html, /speechSynthesis/, `${item.id}: Web Speech API`);
    assert.match(html, /SpeechSynthesisUtterance/, `${item.id}: utterance`);
    assert.match(html, /min="0\.7"/, `${item.id}: minimum rate`);
    assert.match(html, /max="4"/, `${item.id}: maximum rate`);
    assert.match(html, /index\.html\?library=listen/, `${item.id}: shared library return`);
    assert.match(html, /aria-label="出典"/, `${item.id}: sources section`);
  }
});
