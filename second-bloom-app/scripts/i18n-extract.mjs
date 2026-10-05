// Sammelt alle sichtbaren deutschen Texte der App in i18n/de.json (Quelle für die Übersetzungen).
//   node scripts/i18n-extract.mjs
// Schlüssel = deutscher Text. Eingesetzte Werte werden zu {0}, {1} … (zur Laufzeit per Muster erkannt).
import { readFileSync, writeFileSync, readdirSync, statSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { parse } = require("next/dist/compiled/babel/parser");

const ROOT = new URL("..", import.meta.url).pathname;
const SKIP_FILES = [/datenschutz\/(de|en|fr|es|pt)\.js$/, /app\/admin\//, /scripts\//];
const keys = new Map(); // key -> Set(files)
const add = (k, f) => { if (!keys.has(k)) keys.set(k, new Set()); keys.get(k).add(f); };

const hasWord = (s) => /[A-Za-zÄÖÜäöüß]{2,}/.test(s.replace(/\{\d+\}/g, ""));
const codeLike = (s) =>
  /^[a-z0-9_\-:.\/#?=&%@]+$/.test(s) ||            // Bezeichner, Pfade, Klassen in Kleinbuchstaben
  /^[a-z][a-zA-Z0-9]*$/.test(s) ||                  // camelCase
  /^(https?:|\/|\.|#|data:|mailto:)/.test(s) ||
  /[{};=<>]|=>|\$\{|\bfunction\b/.test(s.replace(/\{\d+\}/g, "")) ||
  /^[A-Z0-9_]+$/.test(s) ||                         // KONSTANTEN
  /^[a-z-]+( [a-z-]+)+$/.test(s) && /\b(btn|sm|line|accent|ghost|block|flat|card|row|link|small|muted|tag|t-[a-z]+|on|li|grow)\b/.test(s); // Klassenlisten
const clean = (s) => s.replace(/&#10;|&#13;/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();

// Text aus HTML-artigem String (mit \u0000 als Platzhalter für ${…}) in Läufe zerlegen
function fromHtml(flat, file) {
  // Attribute mit sichtbarem Text
  for (const m of flat.matchAll(/\b(?:placeholder|aria-label|title|alt)="([^"]*)"/g)) emit(m[1], file, true);
  const isHtml = /<[a-z!\/]/i.test(flat);
  const text = flat.replace(/<!--[\s\S]*?-->/g, "\u0001").replace(/<[^>]*>/g, "\u0001");
  for (const run of text.split("\u0001")) emit(run, file, isHtml);
}
// Kleingeschriebene Einzelwörter (z. B. «leer», «kalt») sind oft sichtbar; Bezeichner mit - _ . / Ziffern nicht
const plainWord = (s) => /^[a-zäöüß]{3,}$/.test(s);
function emit(run, file, lenient = false) {
  const r = clean(run.replace(/&nbsp;/g, " "));
  if (!r || !hasWord(r)) return;
  if (lenient && !r.includes("\u0000") && !/=>|\$\{|^[{}();\s]*$/.test(r)) { add(r, file); return; }
  if (plainWord(r)) { add(r, file); return; }
  if (r.includes("\u0000")) {
    let i = 0; const key = r.replace(/\u0000/g, () => `{${i++}}`);
    if (!/^\{0\}$/.test(key) && !codeLike(key)) add(key, file);
    // Falls ein Platzhalter HTML einsetzt, entstehen im DOM getrennte Textknoten: Teilstücke auch erfassen
    for (const part of r.split("\u0000")) { const p = clean(part); if (p && hasWord(p) && !codeLike(p)) add(p.replace(/^[·,:;.]\s*/, "") || p, file); }
  } else if (!codeLike(r)) add(r, file);
}

function walk(node, file, visit) {
  if (!node || typeof node.type !== "string") return;
  visit(node);
  for (const k of Object.keys(node)) {
    if (k === "loc" || k === "start" || k === "end" || k === "extra" || k === "leadingComments" || k === "trailingComments") continue;
    const v = node[k];
    if (Array.isArray(v)) v.forEach((c) => c && typeof c.type === "string" && walk(c, file, visit));
    else if (v && typeof v.type === "string") walk(v, file, visit);
  }
}

function extract(file, { jsx }) {
  const src = readFileSync(file, "utf8");
  const ast = parse(src, { sourceType: "module", plugins: jsx ? ["jsx"] : [], errorRecovery: true });
  const rel = file.replace(ROOT, "");
  walk(ast.program, rel, (n) => {
    if (n.type === "StringLiteral") {
      if (n.value === "use server" || n.value === "use client") return;
      if (/[<>]/.test(n.value)) fromHtml(n.value, rel); else emit(n.value, rel);
    } else if (n.type === "TemplateLiteral") {
      const flat = n.quasis.map((q) => q.value.cooked ?? q.value.raw).join("\u0000");
      fromHtml(flat, rel);
    } else if (n.type === "JSXText") {
      emit(n.value, rel, true);
    } else if (n.type === "BinaryExpression" && n.operator === "+" && !n._inner) {
      // 'Heute Abend: ' + name  →  "Heute Abend: {0}"
      const parts = [];
      const flatten = (x) => { if (x.type === "BinaryExpression" && x.operator === "+") { x._inner = true; flatten(x.left); flatten(x.right); } else parts.push(x); };
      flatten(n);
      if (!parts.some((x) => x.type === "StringLiteral" || x.type === "TemplateLiteral")) return;
      const flat = parts.map((x) => x.type === "StringLiteral" ? x.value : x.type === "TemplateLiteral" ? x.quasis.map((q) => q.value.cooked ?? q.value.raw).join("\u0000") : "\u0000").join("");
      if (/[A-Za-zÄÖÜäöüß]{2,}/.test(flat.replace(/\u0000/g, ""))) fromHtml(flat, rel);
    }
  });
}

function files(dir, out = []) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) files(p, out); else if (p.endsWith(".js")) out.push(p);
  }
  return out;
}

extract(join(ROOT, "public/sb-app.js"), { jsx: false });
for (const f of [...files(join(ROOT, "app")), ...files(join(ROOT, "components"))]) if (!SKIP_FILES.some((r) => r.test(f))) extract(f, { jsx: true });
for (const f of ["profile.js", "wellness.js", "sync.js", "intervals.js", "boot.js"].map((x) => join(ROOT, "lib", x))) extract(f, { jsx: false });
// Aus lib/ai.js nur die Fehlermeldungen (die Prompts selbst sieht niemand)
for (const m of readFileSync(join(ROOT, "lib/ai.js"), "utf8").matchAll(/Error\("([^"]+)"/g)) emit(m[1], "lib/ai.js");

// Von Hand ergänzte Muster (z. B. Mengenangaben), siehe i18n/manual.json
try { for (const k of JSON.parse(readFileSync(join(ROOT, "i18n/manual.json"), "utf8"))) add(k, "i18n/manual.json"); } catch {}
const out = {};
for (const k of [...keys.keys()].sort((a, b) => a.localeCompare(b, "de"))) out[k] = "";
mkdirSync(join(ROOT, "i18n"), { recursive: true });
writeFileSync(join(ROOT, "i18n/de.json"), JSON.stringify(out, null, 1));
console.log(`${keys.size} Texte, ${[...keys.keys()].join("").length} Zeichen`);
