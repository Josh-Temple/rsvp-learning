import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import vm from "node:vm";

const workerSource = readFileSync(new URL("../sw.js", import.meta.url), "utf8");
const manifest = JSON.parse(readFileSync(new URL("../manifest.webmanifest", import.meta.url), "utf8"));

for (const prefix of ["/", "/rsvp-learning/"]) {
  test("PWA manifest stays inside deployment base " + prefix, () => {
    const manifestUrl = new URL("https://example.github.io" + prefix + "manifest.webmanifest");
    for (const asset of [manifest.id, manifest.start_url, manifest.scope, ...manifest.icons.map((icon) => icon.src)]) {
      assert.ok(new URL(asset, manifestUrl).pathname.startsWith(prefix), asset);
    }
  });

  test("Service Worker precaches only within deployment base " + prefix, async () => {
    const events = new Map();
    let added = [];
    const deleted = [];
    const cache = { addAll: async (urls) => { added = urls; }, put: async () => {} };
    const caches = {
      open: async () => cache,
      keys: async () => ["unrelated-pwa", "rsvp-learning-pwa-v8", "rsvp-learning-pwa-v9"],
      delete: async (key) => { deleted.push(key); return true; },
      match: async () => undefined,
    };
    const origin = "https://example.github.io";
    const self = {
      location: { href: origin + prefix + "sw.js", origin },
      addEventListener: (type, listener) => events.set(type, listener),
      skipWaiting: async () => {},
      clients: { claim: async () => {} },
    };
    vm.runInNewContext(workerSource, { self, caches, URL, fetch: async () => { throw Error("unexpected"); }, Response: { error: () => {} } });
    let task;
    events.get("install")({ waitUntil: (promise) => { task = promise; } });
    await task;
    assert.ok(added.length > 10);
    for (const url of added) {
      assert.ok(url.startsWith(origin + prefix), "Unexpected precache URL: " + url);
    }
    assert.ok(added.includes(origin + prefix + "index.html"));
    events.get("activate")({ waitUntil: (promise) => { task = promise; } });
    await task;
    assert.deepEqual(deleted, ["rsvp-learning-pwa-v8"]);
  });
}
