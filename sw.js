const CACHE_NAME = 'wildguard-v1';
const urlsToCache = [
    '/',
    '/static/css/style.css',
    '/static/lib/bootstrap/css/bootstrap.min.css',
    '/static/lib/leaflet/leaflet.css',
    '/static/lib/leaflet/leaflet.js',
    '/static/lib/chart.js/chart.umd.min.js',
    '/static/js/app.js',
    // ... other key files
];
self.addEventListener('install', event => {
    event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)));
});
self.addEventListener('fetch', event => {
    event.respondWith(caches.match(event.request).then(response => response || fetch(event.request)));
});