import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";

test("shared library exposes RSVP and Listen modes", async () => {
  const [html, app, listenHtml] = await Promise.all([
    fs.readFile("index.html", "utf8"),
    fs.readFile("app.js", "utf8"),
    fs.readFile("listen/index.html", "utf8"),
  ]);

  assert.match(html, /id="library-rsvp-mode"/);
  assert.match(html, /id="library-listen-mode"/);
  assert.match(app, /fetch\("\.\/listen\/index\.json"/);
  assert.match(app, /function renderListenLibrary\(\)/);
  assert.match(app, /setLibraryView\("listen"\)/);
  assert.match(app, /params\.get\("library"\) === "listen"/);
  assert.match(listenHtml, /\.\.\/index\.html\?library=listen/);
});
