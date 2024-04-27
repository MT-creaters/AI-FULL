var CACHE_NAME = 'pwa-sample-caches';
var urlsToCache = [
    // 'mt-creaters.github.io/AI-FULL/',
    // 'mt-creaters.github.io/AI-FULL/app.js',
    '/',
    '/js/app.js',
];

self.addEventListener('install', function(event) {
    event.waitUntil(caches
        .open(CACHE_NAME)
        .then(function(cache) {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(caches
        .match(event.request)
        .then(function(response) {
            return response ? response : fetch(event.request);
        })
    );
});