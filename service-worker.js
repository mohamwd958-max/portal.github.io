/* Thabit PWA service worker
 * Strategy: network-first for everything on the same origin (so every GitHub push
 * shows up immediately), falling back to the cache only when offline.
 * Cross-origin requests (Supabase, APIs, Google Fonts, CDNs) and all non-GET
 * requests are never touched, so login/data calls always go straight to the network.
 */
const CACHE = 'thabit-v1';
const SHELL = [
  './',
  './index.html',
  './offline.html',
  './Css/portal.css',
  './js/brand.js',
  './js/portal.js',
  './js/pwa.js',
  './assets/thabit-favicon.svg',
  './assets/thabit-ornament.png',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) =>
      // allSettled: one missing file must not break the install
      Promise.allSettled(SHELL.map((url) => cache.add(url)))
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // Supabase, fonts, CDNs: network only

  event.respondWith(
    fetch(req)
      .then((res) => {
        if (res && res.status === 200 && res.type === 'basic') {
          const copy = res.clone();
          caches.open(CACHE).then((cache) => cache.put(req, copy));
        }
        return res;
      })
      .catch(() =>
        caches.match(req).then((hit) => {
          if (hit) return hit;
          if (req.mode === 'navigate') return caches.match('./offline.html');
          return Response.error();
        })
      )
  );
});
