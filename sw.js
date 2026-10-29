// Vela · service worker
// Sube el número de VERSION cada vez que cambies archivos, para que los celulares descarguen la versión nueva.
const VERSION = 'vela-v2';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './lib/pdf.min.js',
  './lib/pdf.worker.min.js',
  './lib/jszip.min.js',
  './fonts/sora-latin-wght-normal.woff2',
  './fonts/literata-latin-wght-normal.woff2',
  './fonts/literata-latin-wght-italic.woff2',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/maskable-512.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;

  // Páginas: primero la red (para recibir actualizaciones), si no hay internet, la copia guardada.
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then(res => { const copy = res.clone(); caches.open(VERSION).then(c => c.put('./index.html', copy)); return res; })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Librerías, fuentes e íconos: primero la copia guardada.
  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
      return res;
    }))
  );
});
