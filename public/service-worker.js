const filesToCache = [
  'index.html', 'clock-icon-192.png', 'clock-icon-512.png', 'bundle.js', 'common.js', 'global.css', 'service-worker.js', 'bundle.css'
];

const cacheName = 'cache';

self.addEventListener('activate', function(evt) {
  evt.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(keyList.map(key => {
        if (key !== cacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
      self.clients.claim();
    })
  );
});

self.addEventListener('install', function(evt) {
  evt.waitUntil(
    caches.open(cacheName).then(cache => {
      console.log('[ServiceWorker] Pre-caching offline page');
      self.skipWaiting();
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('fetch', function(evt) {
  if (evt.request.mode !== 'navigate') {
    return;
  }
  evt.respondWith(
    fetch(evt.request)
      .catch(() => {
        return caches.open(cacheName)
          .then(cache => {
            return cache.match('index.html');
          });
      })
  );
});
