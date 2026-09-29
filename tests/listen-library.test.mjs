import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";

test("shared library exposes RSVP, Learn, and Listen modes", async () => {
  const [html, app, listenHtml] = await Promise.all([
    fs.readFile("index.html", "utf8"),
    fs.readFile("app.js", "utf8"),
    fs.readFile("listen/index.html", "utf8"),
  ]);

  assert.match(html, /id="library-rsvp-mode"/);
  assert.match(html, /id="library-learn-mode"/);
  assert.match(html, /id="library-listen-mode"/);
  assert.match(html, /id="learn-link"[^>]*library=learn/);
  assert.match(app, /fetch\("\.\/listen\/index\.json"/);
  assert.match(app, /function renderLearnLibrary\(\)/);
  assert.match(app, /function renderListenLibrary\(\)/);
  assert.match(app, /setLibraryView\("learn"\)/);
  assert.match(app, /setLibraryView\("listen"\)/);
  assert.match(app, /library === "listen" \|\| library === "learn"/);
  assert.match(listenHtml, /\.\.\/index\.html\?library=learn/);
  assert.match(listenHtml, /\.\.\/index\.html\?library=listen/);
});
