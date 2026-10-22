import assert from "node:assert/strict";
import fs from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

async function read(relativePath) {
  return fs.readFile(new URL(relativePath, import.meta.url), "utf8");
}

test("full web reader bookmarklet parses as standalone JavaScript", async () => {
  const source = await read("../web-reader/bookmarklet.js");

  assert.doesNotThrow(() => new vm.Script(source));
  assert.match(source, /rsvp-web-reader-host/);
  assert.match(source, /Intl\?\.Segmenter/);
  assert.doesNotMatch(source, /document\.createElement\(["']script["']\)/);
  assert.doesNotMatch(source, /fetch\s*\(/);
});

test("Android probe is tiny and parses", async () => {
  const source = await read("../web-reader/probe.js");

  assert.doesNotThrow(() => new vm.Script(source));
  assert.match(source, /RSVP TEST OK/);
  assert.ok(source.length < 1000, `probe too large: ${source.length}`);
});

test("Android lite bookmarklet parses and stays below the diagnostic size target", async () => {
  const source = await read("../web-reader/bookmarklet-lite.js");

  assert.doesNotThrow(() => new vm.Script(source));
  assert.match(source, /rsvp-lite/);
  assert.match(source, /Intl\.Segmenter/);
  assert.doesNotMatch(source, /fetch\s*\(/);
  assert.ok(source.length < 6000, `lite bookmarklet too large: ${source.length}`);
});

test("bookmarklet installer exposes probe and lite javascript URLs", async () => {
  const source = await read("../web-reader/index.html");

  assert.match(source, /javascript:\$\{oneLine\(await response\.text\(\)\)\}/);
  assert.match(source, /RSVP TEST/);
  assert.match(source, /RSVP Reader/);
  assert.match(source, /probe\.js/);
  assert.match(source, /bookmarklet-lite\.js/);
});
