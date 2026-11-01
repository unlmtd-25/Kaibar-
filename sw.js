/* Kaibar Books service worker. Change CACHE when you upload a new version so phones refresh. */
const CACHE = 'kaibar-v1';
const SHELL = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png', './icon-maskable-512.png', './apple-touch-icon.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET') return;
  const url = new URL(req.url), same = url.origin === location.origin, font = /(^|\.)fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);
  if (!same && !font) return;
  e.respondWith(caches.match(req, { ignoreSearch: same }).then(hit => {
    const net = fetch(req).then(r => { if (r && (r.ok || r.type === 'opaque')) { const cp = r.clone(); caches.open(CACHE).then(c => c.put(req, cp)); } return r; }).catch(() => hit || (req.mode === 'navigate' ? caches.match('./index.html') : undefined));
    return hit || net;
  }));
});
