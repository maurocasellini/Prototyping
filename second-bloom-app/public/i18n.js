/* Second Bloom – Übersetzung der Oberfläche. Deutsch ist die Quelle; für en/fr/es/pt wird jeder sichtbare Text
   über das Wörterbuch /i18n/<lang>.json ersetzt (auch später eingefügte Texte, per MutationObserver).
   Gespeicherte Daten bleiben deutsch, deshalb bleiben Auswertungen und Verlauf stabil. */
(function () {
  var html = document.documentElement, L = (html.getAttribute('data-lang') || 'de').slice(0, 2);
  var show = function () { html.classList.remove('i18n-wait'); };
  if (L === 'de') { show(); return; }
  setTimeout(show, 2500); // nie länger als 2,5 s verstecken
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
  function node(n) {
    if (n.nodeType === 3) { if (!skip(n.parentElement)) { var t = tr(n.nodeValue); if (t != null) n.nodeValue = t; } return; }
    if (n.nodeType !== 1 || skip(n)) return;
    for (var a = 0; a < ATTRS.length; a++) { var v = n.getAttribute(ATTRS[a]); if (v) { var t2 = tr(v); if (t2 != null) n.setAttribute(ATTRS[a], t2); } }
    if (n.tagName === 'INPUT' && (n.type === 'submit' || n.type === 'button') && n.value) { var t3 = tr(n.value); if (t3 != null) n.value = t3; }
    var w = document.createTreeWalker(n, 5 /* Element + Text */), c;
    while ((c = w.nextNode())) {
      if (c.nodeType === 3) { if (!skip(c.parentElement)) { var t4 = tr(c.nodeValue); if (t4 != null) c.nodeValue = t4; } }
      else if (!skip(c)) for (var b = 0; b < ATTRS.length; b++) { var v2 = c.getAttribute(ATTRS[b]); if (v2) { var t5 = tr(v2); if (t5 != null) c.setAttribute(ATTRS[b], t5); } }
    }
  }
  function run() {
    node(document.body);
    var tt = tr(document.title); if (tt != null) document.title = tt;
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
    if (document.body) run(); else document.addEventListener('DOMContentLoaded', run);
  }).catch(show);
})();
