import assert from "node:assert/strict";
import fs from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

test("web reader bookmarklet parses as standalone JavaScript", async () => {
  const source = await fs.readFile(
    new URL("../web-reader/bookmarklet.js", import.meta.url),
    "utf8",
  );

  assert.doesNotThrow(() => new vm.Script(source));
  assert.match(source, /rsvp-web-reader-host/);
  assert.match(source, /Intl\?\.Segmenter/);
  assert.doesNotMatch(source, /document\.createElement\(["']script["']\)/);
  assert.doesNotMatch(source, /fetch\s*\(/);
});

test("bookmarklet installer generates a javascript URL", async () => {
  const source = await fs.readFile(
    new URL("../web-reader/index.html", import.meta.url),
    "utf8",
  );

  assert.match(source, /javascript:\$\{oneLine\(source\)\}/);
  assert.match(source, /RSVP Reader/);
  assert.match(source, /bookmarklet\.js/);
});
