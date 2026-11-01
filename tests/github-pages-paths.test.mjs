import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import vm from "node:vm";

const workerSource = readFileSync(new URL("../sw.js", import.meta.url), "utf8");
const appSource = readFileSync(new URL("../app.js", import.meta.url), "utf8");
const manifest = JSON.parse(readFileSync(new URL("../manifest.webmanifest", import.meta.url), "utf8"));

for (const prefix of ["/", "/rsvp-learning/"]) {
  test("PWA manifest stays inside deployment base " + prefix, () => {
    const manifestUrl = new URL("https://example.github.io" + prefix + "manifest.webmanifest");
    for (const asset of [manifest.id, manifest.start_url, manifest.scope, ...manifest.icons.map((icon) => icon.src)]) {
      assert.ok(new URL(asset, manifestUrl).pathname.startsWith(prefix), asset);
    }
  });

  test("Service Worker migrates offline lessons but refreshes core catalogs " + prefix, async () => {
    const events = new Map();
    const deleted = [];
    let added = [];
    const origin = "https://example.github.io";
    const lessonUrl = origin + prefix + "learn/statistics-descriptive-distributions.html";
    const oldUrl = origin + prefix + "lessons/statistics-data-analysis/statistics-descriptive-distributions.json";
    const listenArticleUrl = origin + prefix + "listen/research/example.html";
    const otherOrigin = "https://unrelated.example/" + prefix + "learn/x.html";
    const oldRequest = { url: lessonUrl, method: "GET" };
    const oldJsonRequest = { url: oldUrl, method: "GET" };
    const crossOriginRequest = { url: otherOrigin, method: "GET" };
    const oldCatalogRequest = { url: origin + prefix + "courses/index.json", method: "GET" };
    const oldResponse = (name) => ({ ok: true, name, clone() { return this; } });
    const oldStore = new Map([
      [lessonUrl, oldResponse("v9-learn")],
      [oldUrl, oldResponse("v9-json")],
      [listenArticleUrl, oldResponse("v10-listen")],
      [otherOrigin, oldResponse("outside-scope")],
      [oldCatalogRequest.url, oldResponse("stale-catalog")],
    ]);
    const earlierStore = new Map([[lessonUrl, oldResponse("v8-learn")]]);
    const newStore = new Map();
    const oldCache = (store) => ({
      keys: async () => [...store.keys()].map((url) => ({ url, method: "GET" })),
      match: async (request) => store.get(request.url),
    });
    const current = {
      addAll: async (urls) => {
        added = urls;
        for (const url of urls) newStore.set(url, oldResponse("fresh-core"));
      },
      match: async (request) => newStore.get(request.url),
      put: async (request, response) => { newStore.set(request.url, response); },
    };
    const named = new Map([
      ["rsvp-learning-pwa-v8", oldCache(earlierStore)],
      ["rsvp-learning-pwa-v9", oldCache(oldStore)],
      ["rsvp-learning-pwa-v10", oldCache(oldStore)],
      ["rsvp-learning-pwa-v11", current],
    ]);
    const caches = {
      open: async (name) => {
        assert.ok(named.has(name), "Unexpected cache " + name);
        return named.get(name);
      },
      keys: async () => ["unrelated-pwa", "rsvp-learning-pwa-v8", "rsvp-learning-pwa-v9", "rsvp-learning-pwa-v10", "rsvp-learning-pwa-v11"],
      delete: async (name) => { deleted.push(name); return true; },
      match: async () => undefined,
    };
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
    for (const url of added) assert.ok(url.startsWith(origin + prefix), url);
    assert.ok(added.includes(origin + prefix + "courses/index.json"));
    assert.ok(added.includes(origin + prefix + "listen/article-nav.js"));
    assert.ok(added.includes(origin + prefix + "listen/article-nav.css"));
    assert.equal(newStore.get(oldCatalogRequest.url)?.name, "fresh-core", "must never restore a stale catalog");
    assert.equal(newStore.get(lessonUrl)?.name, "v9-learn", "newest offline Learn page must survive update");
    assert.equal(newStore.get(oldUrl)?.name, "v9-json", "existing offline lesson JSON must survive update");
    assert.equal(newStore.get(listenArticleUrl)?.name, "v10-listen", "existing offline Listen article must survive update");
    assert.equal(newStore.has(otherOrigin), false, "never migrate unrelated origins");

    events.get("activate")({ waitUntil: (promise) => { task = promise; } });
    await task;
    assert.deepEqual(deleted, ["rsvp-learning-pwa-v8", "rsvp-learning-pwa-v9", "rsvp-learning-pwa-v10"]);
  });
}

test("live course and lesson catalogs bypass stale HTTP caches", () => {
  assert.match(appSource, /fetch\("\.\/lessons\/index\.json", \{ cache: "no-store" \}\)/);
  assert.match(appSource, /fetch\("\.\/courses\/index\.json", \{ cache: "no-store" \}\)/);
});
