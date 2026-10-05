/* Second Bloom – Übersetzung der Oberfläche. Deutsch ist die Quelle; für en/fr/es/pt wird jeder sichtbare Text
   über das Wörterbuch /i18n/<lang>.json ersetzt (auch später eingefügte Texte, per MutationObserver).
   Gespeicherte Daten bleiben deutsch, deshalb bleiben Auswertungen und Verlauf stabil. */
(function () {
  var html = document.documentElement, L = (html.getAttribute('data-lang') || 'de').slice(0, 2);
  var show = function () { html.classList.remove('i18n-wait'); };
  if (L === 'de') { show(); return; }
  setTimeout(show, 3000); // nie länger als 3 s verstecken
  var EX = null, PATS = [], ATTRS = ['placeholder', 'aria-label', 'title', 'alt'];
  var esc = function (s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); };
  function tr(s) {
    if (!EX) return null;
    var m = s.match(/^(\s*)([\s\S]*?)(\s*)$/), core = m[2];
    if (!core || !/[A-Za-zÄÖÜäöüß]/.test(core)) return null;
    var t = EX[core];
    if (t == null) {
      var c = core.replace(/\s+/g, ' ');
      t = EX[c];
      for (var i = 0; t == null && i < PATS.length; i++) {
        var p = PATS[i], r = p[0].exec(c);
        if (r) t = p[1].replace(/\{(\d+)\}/g, function (_, n) { var v = r[+n + 1]; return v == null ? '' : (EX[v] != null ? EX[v] : v); });
      }
    }
    if (t == null) t = fallback(core.replace(/\s+/g, ' '));
    return t == null || t === core ? null : m[1] + t + m[3];
  }
  function one(s) { // exakt oder Muster, ohne weitere Zerlegung
    var t = EX[s];
    for (var i = 0; t == null && i < PATS.length; i++) {
      var p = PATS[i], r = p[0].exec(s);
      if (r) t = p[1].replace(/\{(\d+)\}/g, function (_, n) { var v = r[+n + 1]; return v == null ? '' : (EX[v] != null ? EX[v] : v); });
    }
    if (t == null && /[.:]$/.test(s)) { var b = one(s.slice(0, -1)); if (b != null) t = b + s.slice(-1); }
    return t;
  }
  // Zusammengesetzte Texte: «A · B», mehrere Sätze, «6 Stk», «2 Personen»
  function fallback(c) {
    var parts, out, ok, i, t;
    if (c.indexOf(' · ') > 0) {
      parts = c.split(' · '); ok = false;
      out = parts.map(function (p) { var x = one(p) || fallback(p); if (x != null) { ok = true; return x; } return p; });
      if (ok) return out.join(' · ');
    }
    parts = c.split(/(?<=[.!?])\s+(?=[A-ZÄÖÜ„])/);
    if (parts.length > 1) {
      ok = true; out = [];
      for (i = 0; i < parts.length; i++) { t = one(parts[i]); if (t == null) { ok = false; break; } out.push(t); }
      if (ok) return out.join(' ');
    }
    var n = c.match(/^([−+\-]?[\d.,]+(?:\s*[×x\/–-]\s*[\d.,]+)*\s*(?:\/\s*)?)(\S.*)$/);
    if (n) { t = one(n[2]); if (t != null) return n[1] + t; }
    return null;
  }
  window.SB_T = function (s) { var t = tr(String(s)); return t == null ? s : t; };
  window.SB_LANG = L;
  function skip(el) { return el && el.closest && el.closest('[translate="no"],script,style,textarea,code'); }
  function skipAttr(el) { return el && el.closest && el.closest('[translate="no"],script,style'); } // Platzhalter in Textfeldern übersetzen
  // Bereits übersetzte Texte nicht nochmals übersetzen (sonst kann ein Ergebnis, das zufällig ein deutscher Schlüssel ist, kippen)
  var DONE = new WeakMap();
  // Überschriften mit kursivem Teil («Konto <em>erstellen</em>») als Ganzes übersetzen, damit die Wortstellung stimmt
  function heading(n) {
    var h = n.parentElement; if (h && h.tagName === 'EM') h = h.parentElement;
    if (!h || !/^H[1-3]$/.test(h.tagName) || !h.querySelector('em') || h.children.length !== 1) return false;
    if (DONE.get(h) === h.innerHTML) return true;
    var t = EX[h.innerHTML.replace(/\s+/g, ' ').trim()];
    if (t == null) return false;
    h.innerHTML = t; DONE.set(h, h.innerHTML);
    return true;
  }
  function text(n) {
    if (DONE.get(n) === n.nodeValue || skip(n.parentElement)) return;
    if (heading(n)) return;
    var t = tr(n.nodeValue); if (t != null) { n.nodeValue = t; DONE.set(n, t); }
  }
  function attrs(el) {
    if (skipAttr(el)) return;
    var d = DONE.get(el) || {};
    for (var a = 0; a < ATTRS.length; a++) {
      var k = ATTRS[a], v = el.getAttribute(k);
      if (v && d[k] !== v) { var t = tr(v); if (t != null) { el.setAttribute(k, t); d[k] = t; } }
    }
    DONE.set(el, d);
  }
  function node(n) {
    if (n.nodeType === 3) { text(n); return; }
    if (n.nodeType !== 1 || skipAttr(n)) return;
    attrs(n);
    if (n.tagName === 'INPUT' && (n.type === 'submit' || n.type === 'button') && n.value) { var t3 = tr(n.value); if (t3 != null) n.value = t3; }
    // erst sammeln, dann ersetzen: das Ersetzen einer Überschrift würde den TreeWalker sonst abbrechen
    var w = document.createTreeWalker(n, 5 /* Element + Text */), c, all = [];
    while ((c = w.nextNode())) all.push(c);
    for (var i = 0; i < all.length; i++) { c = all[i]; if (c.nodeType === 3) { if (c.isConnected) text(c); } else attrs(c); }
  }
  function run() {
    node(document.body);
    var lastTitle = null;
    var title = function () { if (document.title === lastTitle) return; var tt = tr(document.title); if (tt != null) document.title = tt; lastTitle = document.title; };
    title(); new MutationObserver(title).observe(document.head, { subtree: true, childList: true, characterData: true });
    new MutationObserver(function (ms) {
      for (var i = 0; i < ms.length; i++) {
        var m = ms[i];
        if (m.type === 'characterData') node(m.target);
        else if (m.type === 'attributes') node(m.target);
        else for (var j = 0; j < m.addedNodes.length; j++) node(m.addedNodes[j]);
      }
    }).observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ATTRS });
    show();
  }
  fetch('/i18n/' + L + '.json?v=' + (html.getAttribute('data-i18n-v') || '1')).then(function (r) { return r.ok ? r.json() : {}; }).then(function (d) {
    EX = {};
    for (var k in d) if (d[k]) {
      if (/\{\d+\}/.test(k)) PATS.push([new RegExp('^' + esc(k).replace(/\\\{(\d+)\\\}/g, '(.*?)') + '$'), d[k]]);
      else EX[k] = d[k];
    }
    PATS.sort(function (a, b) { return b[0].source.length - a[0].source.length; }); // spezifischere Muster zuerst
    // erst nach der Übernahme durch React (components/I18nReady.js), spätestens nach 2 s
    var started = false, start = function () { if (!started) { started = true; run(); } };
    if (window.__sbHydrated) start(); else { window.addEventListener('sb-hydrated', start); setTimeout(start, 2000); }
  }).catch(show);
})();
