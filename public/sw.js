// Relative URLs throughout so it works under any GitHub Pages sub-path. Bump CACHE to invalidate.
const CACHE = 'jutai-v1'
const PRECACHE = ['./', './manifest.json', './icon-192.png']

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()))
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  )
})

const store = (req, res) => {
  if (res && res.status === 200 && res.type === 'basic') {
    const copy = res.clone()
    caches.open(CACHE).then((c) => c.put(req, copy))
  }
  return res
}

self.addEventListener('fetch', (e) => {
  const req = e.request
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return
  if (req.mode === 'navigate') {
    // network-first so new deploys show up; cached page when offline
    e.respondWith(
      fetch(req).then((res) => store(req, res)).catch(() => caches.match(req).then((r) => r || caches.match('./'))),
    )
    return
  }
  // hashed build assets are immutable: cache-first
  e.respondWith(caches.match(req).then((r) => r || fetch(req).then((res) => store(req, res))))
})
