'use strict';

// Static Files as version
var staticCache = 'v0.1.1';

// Files to cache
var files = [
  './',
  './index.html',
  './country_selector/css/intlTelInput.min.css',
  './country_selector/img/flags.png',
  './country_selector/img/flags@2x.png',
  './country_selector/js/intlTelInput.min.js',
  './country_selector/js/utils.js',
  './css/style.css',
  './images/fav.png',
  './images/logo-192.png',
  './images/logo-512.png',
  './images/logo.png',
  './js/script.js',
  './manifest.json',
  'https://fonts.googleapis.com/css?family=Ubuntu:300,400&display=swap',
  'https://use.fontawesome.com/releases/v5.6.3/css/all.css',
  'https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css',
  'https://cdn.jsdelivr.net/npm/toastify-js',
];

// Install
self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(staticCache).then(cache => {
      return cache
        .addAll(files)
        .then(() => console.log('App Version: ' + staticCache))
        .catch(err => console.error('Error adding files to cache', err));
    }),
  );
});

// Activate
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== staticCache) {
            console.info('Deleting Old Cache', cache);
            return caches.delete(cache);
          }
        }),
      );
    }),
  );
  return self.clients.claim();
});

// Fetch
self.addEventListener('fetch', e => {
  const req = e.request;
  const url = new URL(req.url);
  if (url.origin === location.origin) return e.respondWith(cacheFirst(req));
  else return e.respondWith(networkFirst(req));
});

async function cacheFirst(req) {
  let cacheRes = await caches.match(req);
  return cacheRes || fetch(req);
}

async function networkFirst(req) {
  const dynamicCache = await caches.open('dynamic');
  try {
    const networkResponse = await fetch(req);
    if (req.method !== 'POST') dynamicCache.put(req, networkResponse.clone());
    return networkResponse;
  } catch (err) {
    const cacheResponse = await caches.match(req);
    return cacheResponse;
  }
}
