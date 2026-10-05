/* Service Worker der PDF Werkstatt (Web).
   1) Fängt alle „api/…“-Anfragen ab, BEVOR sie das Netz erreichen, und beantwortet sie
      über die PDF-Engine im Browser-Tab. Es wird nie etwas an einen Server gesendet.
   2) Speichert die App im Cache, damit sie auch offline funktioniert. */
const VERSION = '__BUILD__';
const CACHE = 'pdfw-' + VERSION;
const SCOPE = new URL(self.registration.scope).pathname.replace(/\/?$/, '/'); // z. B. /pdf/
const API = SCOPE + 'api/';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k.startsWith('pdfw-') && k !== CACHE) await caches.delete(k);
    await self.clients.claim();
  })());
});

let seq = 0;
async function askClient(client, msg) {
  return new Promise((resolve) => {
    const ch = new MessageChannel();
    const timer = setTimeout(() => resolve(null), 10 * 60 * 1000);
    ch.port1.onmessage = (e) => { clearTimeout(timer); resolve(e.data); };
    client.postMessage(msg, [ch.port2]);
  });
}

async function apiResponse(event) {
  const req = event.request;
  const url = new URL(req.url);
  const msg = { type: 'api', id: ++seq, method: req.method, path: url.pathname.slice(SCOPE.length), search: url.search };
  if (req.method === 'POST') {
    if ((req.headers.get('Content-Type') || '').startsWith('multipart/form-data')) {
      const fd = await req.formData();
      msg.files = fd.getAll('files');
    } else {
      msg.body = new Uint8Array(await req.arrayBuffer());
    }
  }
  // Der Tab, der die Anfrage stellt – bei Downloads/neuen Tabs: alle offenen Tabs fragen
  const own = event.clientId ? await self.clients.get(event.clientId) : null;
  const candidates = own ? [own] : await self.clients.matchAll({ type: 'window' });
  for (const client of candidates) {
    const res = await askClient(client, msg);
    if (res && (res.status !== 404 || client === candidates[candidates.length - 1])) {
      return new Response(res.body, { status: res.status, headers: res.headers });
    }
  }
  return new Response(JSON.stringify({ error: 'PDF Werkstatt ist in keinem Tab geöffnet.' }),
    { status: 404, headers: { 'Content-Type': 'application/json' } });
}

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return; // fremde Adressen sind per CSP ohnehin gesperrt
  if (url.pathname.startsWith(API)) { event.respondWith(apiResponse(event)); return; }
  if (event.request.method !== 'GET' || !url.pathname.startsWith(SCOPE.replace(/\/$/, ''))) return;
  // Engine-Dateien (gross, versioniert): Cache zuerst. Rest: Netz zuerst, offline aus dem Cache.
  const vendor = url.pathname.includes('/vendor/') || url.pathname.includes('/pdf-fonts/') || url.pathname.includes('/fonts/');
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    if (vendor) {
      const hit = await cache.match(event.request);
      if (hit) return hit;
    }
    try {
      const res = await fetch(event.request);
      if (res.ok) cache.put(event.request, res.clone());
      return res;
    } catch (err) {
      const hit = await cache.match(event.request, { ignoreSearch: true });
      if (hit) return hit;
      throw err;
    }
  })());
});
