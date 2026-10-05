/* Startet die Web-Version: Service Worker + PDF-Engine (Web Worker) verbinden,
   dann die gleiche Oberfläche wie in der Mac-App laden. */
(async () => {
  const BASE = document.baseURI; // z. B. https://cmventures.xyz/pdf/
  const scope = new URL(BASE).pathname.replace(/\/$/, ''); // /pdf
  const loader = document.getElementById('engine');
  const loaderText = document.getElementById('engine-text');
  const fail = (text) => {
    loader.classList.add('failed');
    loaderText.textContent = text;
    loader.classList.remove('hidden');
  };

  if (!('serviceWorker' in navigator) || !window.WebAssembly) {
    fail('Dieser Browser wird nicht unterstützt. Bitte eine aktuelle Version von Safari, Chrome, Edge oder Firefox verwenden.');
    return;
  }

  // 1) PDF-Engine im Hintergrund starten (lädt beim ersten Besuch ca. 25 MB, danach aus dem Cache)
  const worker = new Worker(new URL('worker.js', BASE));
  let engineReady;
  const ready = new Promise((r) => { engineReady = r; });
  const pending = new Map();
  let id = 0;
  worker.onmessage = (e) => {
    const m = e.data;
    if (m.type === 'status') loaderText.textContent = m.text;
    else if (m.type === 'ready') { engineReady(); loader.classList.add('hidden'); document.body.classList.add('engine-ready'); }
    else if (m.type === 'failed') fail('Die PDF-Engine konnte nicht geladen werden: ' + m.text);
    else if (m.type === 'res') { const p = pending.get(m.id); pending.delete(m.id); if (p) p(m); }
  };
  const callEngine = (msg) => new Promise((resolve) => {
    const rid = ++id;
    pending.set(rid, resolve);
    const transfer = msg.body ? [msg.body.buffer] : [];
    worker.postMessage({ ...msg, type: 'req', id: rid }, transfer);
  });

  // 2) Anfragen des Service Workers an die Engine weiterreichen
  navigator.serviceWorker.addEventListener('message', async (e) => {
    if (!e.data || e.data.type !== 'api') return;
    const res = await callEngine(e.data);
    e.ports[0].postMessage({ status: res.status, headers: res.headers, body: res.body }, [res.body]);
  });
  navigator.serviceWorker.startMessages();

  // 3) Service Worker registrieren und warten, bis er diese Seite kontrolliert
  try {
    await navigator.serviceWorker.register(new URL('sw.js', BASE), { scope });
  } catch (err) {
    fail('Start fehlgeschlagen (Service Worker): ' + err.message);
    return;
  }
  if (!navigator.serviceWorker.controller) {
    await new Promise((r) => navigator.serviceWorker.addEventListener('controllerchange', r, { once: true }));
  }

  // 4) Oberfläche laden (gleiche Dateien wie die Mac-App)
  window.PDFW_WEB = true;
  window.PDFW_ENGINE = ready;
  for (const src of ['static/tools.js', 'web-tools.js', 'static/app.js', 'static/editor.js']) {
    await new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = new URL(src, BASE).href;
      s.onload = resolve;
      s.onerror = reject;
      document.body.append(s);
    });
  }
})();
