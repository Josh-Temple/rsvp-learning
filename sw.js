const CACHE_PREFIX = "rsvp-learning-pwa-";
const CACHE_NAME = `${CACHE_PREFIX}v10`;
// Resolves to / on Vercel and /rsvp-learning/ on GitHub Pages.
const APP_BASE = new URL("./", self.location.href);
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./learn/learn.css",
  "./learn/learn.js",
  "./learn/course-player.js",
  "./manifest.webmanifest",
  "./icon.svg",
  "./lessons/index.json",
  "./courses/index.json",
  "./listen/",
  "./listen/index.html",
  "./listen/index.json",
  "./listen/listen.css",
  "./listen/listen.js",
  "./lessons/requirements/requirements-basics.json",
  "./lessons/examples/rsvp-basics.json"
];
const CORE_URLS = CORE_ASSETS.map((path) => new URL(path, APP_BASE).href);

// Keep previously opened lesson pages available offline when a new PWA version installs.
// The core shell and catalogs are always freshly precached, never copied from old versions.
async function migrateOfflineLessons(current) {
  const names = (await caches.keys())
    .filter((name) => name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME)
    .sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));
  const lessonPath = new URL("./lessons/", APP_BASE).pathname;
  const learnPath = new URL("./learn/", APP_BASE).pathname;
  for (const name of names) {
    const older = await caches.open(name);
    for (const request of await older.keys()) {
      const url = new URL(request.url);
      const lessonAsset = url.origin === self.location.origin &&
        ((url.pathname.startsWith(lessonPath) && url.pathname.endsWith(".json")) ||
         (url.pathname.startsWith(learnPath) && url.pathname.endsWith(".html")));
      if (!lessonAsset || CORE_URLS.includes(url.href) || await current.match(request)) continue;
      const response = await older.match(request);
      if (!response?.ok) continue;
      try {
        await current.put(request, response.clone());
      } catch {
        // Storage limits must not prevent a new service worker from installing.
      }
    }
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(async (cache) => {
        await cache.addAll(CORE_URLS);
        try {
          await migrateOfflineLessons(cache);
        } catch {
          // If the old cache is inaccessible, install the fresh release anyway.
        }
        await self.skipWaiting();
      }),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin || !url.pathname.startsWith(APP_BASE.pathname)) return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      })
      .catch(async () => {
        const cached = await caches.match(request);
        if (cached) return cached;
        if (request.mode === "navigate") return caches.match(new URL("index.html", APP_BASE).href);
        return Response.error();
      }),
  );
});
