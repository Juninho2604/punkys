// Service worker mínimo para que la intranet sea instalable (PWA) y arranque
// rápido. Estrategia: network-first para la navegación (siempre datos frescos),
// con caché de respaldo del shell si no hay red. NO cachea /api (datos en vivo).

// Al subir esta versión, el handler de 'activate' borra los cachés viejos en
// TODOS los dispositivos al recargar (soluciona cachés obsoletos, p.ej. cuando
// "en el teléfono sí y en el PC no").
const CACHE = 'punky-shell-v2'
const SHELL = ['/', '/index.html', '/logo-isotipo.png', '/manifest.webmanifest']

// Precache resiliente: si un recurso falla (404), no tumba la instalación.
async function precache() {
  const c = await caches.open(CACHE)
  await Promise.allSettled(SHELL.map((u) => c.add(u)))
}

self.addEventListener('install', (e) => {
  e.waitUntil(precache().then(() => self.skipWaiting()))
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url)
  if (e.request.method !== 'GET' || url.pathname.startsWith('/api')) return // datos en vivo, sin caché
  if (e.request.mode === 'navigate') {
    // Network-first para la app; si no hay red, servir el shell cacheado
    e.respondWith(fetch(e.request).catch(() => caches.match('/index.html')))
    return
  }
  // Assets estáticos: cache-first con relleno
  e.respondWith(
    caches.match(e.request).then((hit) => hit || fetch(e.request).then((res) => {
      const copy = res.clone()
      caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {})
      return res
    }).catch(() => hit)),
  )
})
