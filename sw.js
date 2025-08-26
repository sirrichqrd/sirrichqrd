const CACHE_NAME = "richqrd-cache-v2"; // bump only if offline.html or core files change
const CORE_ASSETS = [
  "/",
  "/index.html",
  "/main.min.js",
  "/style.css",
  "/offline.html"
];

// Install: pre-cache core assets
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
    )
  );
  self.clients.claim();
});

// Fetch: network-first for CSS/JS, cache-first for others
self.addEventListener("fetch", event => {
  if (!event.request.url.startsWith("http")) return;

  // Network-first for styles and scripts
  if (event.request.destination === "style" || event.request.destination === "script") {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Default: cache-first for everything else
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request)
        .then(response => {
          if (response && response.status === 200 && response.type === "basic") {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => {
          if (event.request.mode === "navigate") {
            return caches.match("/offline.html");
          }
        });
    })
  );
});
// This code is for a service worker that implements caching strategies to improve performance and provide offline support for a web application. It pre-caches core assets during installation, cleans up old caches during activation, and uses different caching strategies for CSS/JS files (network-first) and other requests (cache-first). If a navigation request fails and the user is offline, it serves an offline fallback page.