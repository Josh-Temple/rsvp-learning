import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { Script } from "node:vm";

const root = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");

test("compact navigation browser scripts parse", () => {
  for (const path of [
    "app.js",
    "learn/course-player.js",
    "learn/learn.js",
    "listen/listen.js",
    "sw.js",
  ]) {
    assert.doesNotThrow(() => new Script(read(path), { filename: path }), path);
  }
});

test("Learn resume uses the same storage key in library and course player", () => {
  const library = read("app.js");
  const player = read("learn/course-player.js");
  const key = "rsvp:learn-course-position:v1";
  assert.ok(library.includes(key));
  assert.ok(player.includes(key));
  assert.match(library, /dataset\.resume = "true"/);
  assert.match(player, /button\.dataset\.resume === "true"/);
  assert.match(player, /savePosition\(\)/);
});

test("the compact UI retains navigation, chapter links and accessible controls", () => {
  const library = read("app.js");
  const html = read("index.html");
  const coursePlayer = read("learn/course-player.js");
  const standaloneLearn = read("learn/learn.js");
  const listen = read("listen/listen.js");
  assert.match(library, /document\.createElement\("details"\)/);
  assert.match(library, /document\.createElement\("summary"\)/);
  assert.match(library, /search\.type = "search"/);
  assert.match(library, /row\.href = item\.learn_path/);
  assert.match(html, /class="learn-reader-options"/);
  assert.match(coursePlayer, /function renderHeadingNav\(\)/);
  assert.match(standaloneLearn, /headingNav\.className = "learn-heading-nav"/);
  assert.match(listen, /details\.open = date === items\[0\]\.date/);
  assert.match(read("styles.css"), /\.learn-course-reader \{\s*position: sticky/);
  assert.match(read("learn/learn.css"), /\.reader \{\s*position: sticky/);
});
