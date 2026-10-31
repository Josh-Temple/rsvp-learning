const CACHE_PREFIX = "rsvp-learning-pwa-";
const CACHE_NAME = `${CACHE_PREFIX}v9`;
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

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_URLS))
      .then(() => self.skipWaiting()),
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
