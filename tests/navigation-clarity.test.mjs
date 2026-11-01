import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { Script } from "node:vm";

const root = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");

test("RSVP player uses labeled destinations and opens the same catalog view", () => {
  const html = read("index.html");
  const app = read("app.js");
  for (const label of ["RSVP", "Learn", "Listen"]) {
    assert.match(html, new RegExp(">" + label + "<"));
  }
  assert.match(html, /id="library-open"[^>]*aria-label="RSVP教材一覧を開く"/);
  assert.match(html, /id="library-close"[^>]*aria-label="学習画面へ戻る"/);
  assert.match(html, /id="learn-course-back"[^>]*>← 一覧へ<\/button>/);
  assert.match(app, /els\.learnLink\.href = "\.\/index\.html\?library=learn"/);
  assert.match(app, /setLibraryView\("learn"\);\s*openLibrary\(\);/);
  assert.match(app, /setLibraryView\("listen"\);\s*openLibrary\(\);/);
});

test("single Learn articles have a clear return path", () => {
  const script = read("learn/learn.js");
  assert.match(script, /backLink\.href = "\.\.\/index\.html\?library=learn"/);
  assert.match(script, /backLink\.textContent = "← Learn一覧へ"/);
});

test("Listen list uses visible mode labels and articles load shared navigation", () => {
  const index = read("listen/index.html");
  assert.match(index, /class="icon-link mode-text-link is-active"[^>]*>Listen<\/a>/);
  const sharedScript = read("listen/article-nav.js");
  const sharedCss = read("listen/article-nav.css");
  assert.doesNotThrow(() => new Script(sharedScript, { filename: "listen/article-nav.js" }));
  assert.match(sharedScript, /back\.href = "\.\.\/index\.html"/);
  assert.match(sharedCss, /min-height: 44px/);
  const articleDirs = ["listen/research/", "listen/reports/"];
  let count = 0;
  for (const directory of articleDirs) {
    for (const filename of readdirSync(new URL(directory, root)).filter((name) => name.endsWith(".html"))) {
      const html = read(directory + filename);
      assert.match(html, /href="\.\.\/article-nav\.css"/, directory + filename);
      assert.match(html, /src="\.\.\/article-nav\.js"/, directory + filename);
      count += 1;
    }
  }
  assert.ok(count >= 31, "all currently shipped Listen articles checked");
});

test("mobile navigation keeps the RSVP label and Android history returns to the previous layer", () => {
  const css = read("styles.css");
  const app = read("app.js");
  const course = read("learn/course-player.js");
  assert.match(css, /@media \(max-width: 420px\) \{\s*\.primary-navigation \.brand-label \{ display: inline/);
  assert.match(css, /\.primary-navigation \.brand-mark \{ width: 18px/);
  assert.match(app, /function openLibrary\(\{ fromHistory = false \} = \{\}\)/);
  assert.match(app, /window\.history\.pushState/);
  assert.match(app, /window\.addEventListener\("popstate"/);
  assert.match(course, /window\.history\.back\(\)/);
  assert.match(course, /window\.addEventListener\("popstate"/);
});
