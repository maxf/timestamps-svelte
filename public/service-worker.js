const filesToCache = [
  'index.html', 'offline.html'
];

self.addEventListener('activate', function(evt) {
  evt.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(keyList.map(key => {
        if (key !== 'cache') {
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
    caches.open('cache').then(cache => {
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
        return caches.open('cache')
          .then(cache => {
            return cache.match('index.html');
          });
      })
  );
});
