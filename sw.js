// v2: bumping the name drops the old cache (it held Supabase API responses and an unpinned supabase-js)
const CACHE='repforge-static-v2';
const CDN_HOSTS=['cdnjs.cloudflare.com','fonts.googleapis.com','fonts.gstatic.com','cdn.jsdelivr.net'];
const PRECACHE=[
  './',
  './index.html',
  './manifest.webmanifest?v=2',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/react/18.3.1/umd/react.production.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.3.1/umd/react-dom.production.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.26.9/babel.min.js',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.117.3/dist/umd/supabase.min.js'
];

const put = (req, res) => caches.open(CACHE).then(c => c.put(req, res)).catch(err => console.warn('cache put falhou', req.url, err));

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE).map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return; // Cache API only stores GET
  const url = new URL(e.request.url);
  const isCDN = CDN_HOSTS.includes(url.hostname);
  // Supabase and any other API: straight to the network, never cached (stale user data must not come back offline)
  if (!isCDN && url.origin !== self.location.origin) return;

  if (isCDN) {
    e.respondWith(
      caches.match(e.request).then(cached => cached || fetch(e.request).then(r => {
        if (r.ok) put(e.request, r.clone());
        return r;
      }))
    );
  } else if (e.request.mode === 'navigate') {
    // App shell: open instantly from cache (weak gym signal can't hang the start) and refresh it in the
    // background; the page itself detects that it runs an old version and offers "Atualizar"
    const shell = caches.match('./');
    const net = fetch(e.request).then(async r => {
      if (r.ok) await caches.open(CACHE).then(c => c.put('./', r.clone()));
      return r;
    });
    e.waitUntil(net.catch(err => console.warn('atualização do app falhou', err)));
    e.respondWith(shell.then(cached => cached || net).catch(() => Response.error()));
  } else {
    e.respondWith(
      fetch(e.request).then(r => {
        if (r.ok) put(e.request, r.clone());
        return r;
      }).catch(() => caches.match(e.request, { ignoreSearch: true }).then(cached => {
        if (cached) return cached;
        if (e.request.mode === 'navigate') return caches.match('./');
        return Response.error();
      }))
    );
  }
});
