/* Thabit service worker: offline page + push notifications.
   Deliberately does NOT cache the app files, so updates always arrive immediately. */
const VERSION = 'thabit-sw-2';
const OFFLINE = 'offline.html';
/* same public (anon) values the dashboard already uses: needed only to report "delivered" / "clicked" */
const SB = 'https://vkfexceitwjmxncwceqb.supabase.co';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrZmV4Y2VpdHdqbXhuY3djZXFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAzMzY5MTEsImV4cCI6MjEwNTkxMjkxMX0.6ArXtykrZhdNInphpg_LQTIvULkpwnnlzHA3dKhrNoI';

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll([OFFLINE, 'icons/icon-192.png'])).catch(() => {}).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

/* only page navigations: if the network is down show the offline page */
self.addEventListener('fetch', e => {
  if (e.request.mode !== 'navigate') return;
  e.respondWith(fetch(e.request).catch(() => caches.match(OFFLINE)));
});

/* tells Supabase what happened on this phone: 'delivered' | 'clicked' */
async function track(ev, nid) {
  try {
    const sub = await self.registration.pushManager.getSubscription(); if (!sub) return;
    await fetch(SB + '/rest/v1/rpc/push_event', {
      method: 'POST', keepalive: true,
      headers: { apikey: KEY, Authorization: 'Bearer ' + KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ p_endpoint: sub.endpoint, p_event: ev, p_nid: nid || null })
    });
  } catch (x) {}
}

/* push: { title, body, lang, nid, url }. Same tag every time = the new one REPLACES the old one, never a pile. */
self.addEventListener('push', e => {
  let d = {}; try { d = e.data ? e.data.json() : {}; } catch (x) {}
  e.waitUntil((async () => {
    /* iOS requires every push to show something, so when the app is open it still shows, just silently */
    const open = (await self.clients.matchAll({ type: 'window', includeUncontrolled: true })).some(c => c.visibilityState === 'visible');
    await self.registration.showNotification(d.title || 'Thabit', {
      body: d.body || '', tag: 'thabit', renotify: true, icon: 'icons/icon-192.png', badge: 'icons/icon-192.png',
      dir: d.lang && d.lang !== 'en' ? 'rtl' : 'ltr', lang: d.lang === 'en' ? 'en' : 'ar',
      silent: open, data: { url: d.url || './', nid: d.nid || null }
    });
    await track('delivered', d.nid);
  })());
});

/* tap: straight into the app, on the notifications (no cancel / mark-as-read needed) */
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const data = e.notification.data || {};
  const target = new URL(data.url || './', self.registration.scope); target.hash = 'th-feed';
  e.waitUntil((async () => {
    await track('clicked', data.nid);
    const all = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const c of all) {
      if (c.url.startsWith(self.registration.scope) && 'focus' in c) { await c.focus(); c.postMessage({ type: 'thabit-open-feed' }); return; }
    }
    return self.clients.openWindow(target.href);
  })());
});
