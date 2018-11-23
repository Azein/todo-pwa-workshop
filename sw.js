var CACHE_NAME = "my-site-cache-v1";
var urlsToCache = [
  "/",
  "/styles.css",
  "/script.js",
  "/img/feather-sprite.svg",
  "/icons/favicon.png",
  "register-sw.js",
  "https://unpkg.com/react@16/umd/react.development.js",
  "https://unpkg.com/react-dom@16/umd/react-dom.development.js",
  "https://unpkg.com/babel-standalone@latest/babel.min.js",
  "https://fonts.googleapis.com/css?family=Roboto"
];

self.addEventListener("install", function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      // Cache hit - return response
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});
