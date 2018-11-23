importScripts("/lib/idb-keyval-iife.min.js");

var CACHE_NAME = "my-site-cache-v2";
const SERVER_URL =
  "https://www.jsonstore.io/12f7f255efc357bed42e794ed1ee252c3c66a28fdde99d1071125cdbdc79595a";

var urlsToCache = [
  "/",
  "/styles.css",
  "/script.js",
  "/img/feather-sprite.svg",
  "/icons/favicon.png",
  "/lib/idb-keyval-iife.min.js",
  "register-sw.js",
  "https://unpkg.com/react@16/umd/react.development.js",
  "https://unpkg.com/react-dom@16/umd/react-dom.development.js",
  "https://unpkg.com/babel-standalone@latest/babel.min.js",
  "https://fonts.googleapis.com/css?family=Roboto"
];

self.addEventListener("install", function(event) {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(function(cache) {
        console.log("Opened cache");
        return cache.addAll(urlsToCache);
      })
      .catch(console.error)
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

// background sync
self.addEventListener("sync", function(event) {
  if (event.tag === "sync") {
    event.waitUntil(
      idbKeyval.get("todos").then(todos => {
        return idbKeyval.get("login").then(login => {
          return fetch(SERVER_URL + "/todos/" + login, {
            method: "POST",
            headers: {
              "Content-Type": "application/json; charset=utf-8"
            },
            body: JSON.stringify(todos)
          })
            .then(() => {
              console.log("synced");
            })
            .catch(console.error);
        });
      })
    );
  }
});

// push notification
self.addEventListener("push", function(e) {
  let body = e.data ? e.data.text() : "Push message no payload";
  let options = {
    body: body,
    icon: "favicon.png"
  };
  e.waitUntil(self.registration.showNotification("Push Notification", options));
});

// deletes old caches
self.addEventListener("activate", function(event) {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
