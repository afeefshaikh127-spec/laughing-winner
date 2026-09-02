// FreshCart service worker — caches the app shell so it opens instantly
// and works offline for the static UI (Firebase data still needs a
// network connection, same as any online store).
const CACHE_NAME = 'freshcart-shell-v1';
const APP_SHELL = [
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Network-first for everything (so live product/order data is never
  // stale), falling back to the cached app shell only when offline.
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
