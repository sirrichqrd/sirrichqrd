self.addEventListener("install", event => {
  event.waitUntil(
    caches.open("richqrd-cache").then(cache => {
      return cache.addAll(["/", "/index.html", "/main.min.js", "/style.css"]);
    })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
