const CACHE_NAME = 'bp-spa-v5';  // bump on every release
const FILES = [
  '/index.html',
  '/app.js',
  '/domestic.js',
  '/finance.js',
  '/housing.js',
  '/income.js',
  '/pets.js',
  '/social.js',
  '/transport.js',
  '/utilities.js',
  '/page.js',
  '/utils.js',
  '/styles.css',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

// Install: pre-cache
self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(FILES)));
});

// Activate: clean old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch: cache-first, fallback to network
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});

