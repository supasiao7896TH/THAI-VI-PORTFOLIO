const CACHE_NAME = 'thai-vi-portfolio-v1.1.1';
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/pwa-live.js',
  '/icons/icon.svg',
  '/reports/00_Master_Portfolio_5M_Blueprint.html',
  '/reports/01_Energy_PTT_VI_Report.html',
  '/reports/02_Bank_BBL_vs_KTB_VI_Report.html',
  '/reports/03_Health_BDMS_vs_MEGA_VI_Report.html'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
          return null;
        })
      )
    )
  );
  self.clients.claim();
});

// Network-First strategy: Always fetch latest online version when connected, fallback to cache if offline
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  event.respondWith(
    fetch(req)
      .then((networkResp) => {
        if (networkResp && networkResp.status === 200) {
          const respClone = networkResp.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(req, respClone);
          });
        }
        return networkResp;
      })
      .catch(() => caches.match(req))
  );
});
