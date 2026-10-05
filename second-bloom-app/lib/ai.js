// KI über die Claude-API. Grundsatz: immer das einfachste Modell, das die Aufgabe sauber löst.
//   Text (Rezept aus Zutaten, Wochenplan, Tageseinordnung) → Claude Haiku 4.5, ohne Denkphase, kurze Antworten
//   Foto (Kühlschrank erkennen)                              → Claude Sonnet 5.5 mit Aufwand "low" (Bilder brauchen Genauigkeit)
// Kosten werden pro Monat mitgezählt; es gibt ein Monatslimit und ein Tageslimit pro Konto.
import Anthropic from "@anthropic-ai/sdk";
import { getSettings } from "./repo";
import { read, update } from "./store";
import { decrypt } from "./crypto";

export const MODELS = {
  "claude-haiku-4-5": { name: "Claude Haiku 4.5", price: [1, 5] },
  "claude-sonnet-5-5": { name: "Claude Sonnet 5.5", price: [2, 10] },
};
const TEXT_MODEL = "claude-haiku-4-5";
const VISION_MODEL = "claude-sonnet-5-5";
export const DEFAULT_CAP_USD = 10;
export const DAILY_CALLS_PER_USER = 30;
export const DAILY_CALLS_DEMO = 60;

export async function aiConfig() {
  const a = (await getSettings()).apps?.anthropic || {};
  let key = process.env.ANTHROPIC_API_KEY || "", source = key ? "env" : null;
  if (!key && a.apiKey) { try { key = decrypt(a.apiKey); source = "app"; } catch {} }
  const cap = Number.isFinite(Number(a.monthlyCapUsd)) && a.monthlyCapUsd !== null && a.monthlyCapUsd !== undefined ? Number(a.monthlyCapUsd) : DEFAULT_CAP_USD;
  return { key, source, monthlyCapUsd: cap, demoAi: a.demoAi !== false };
}
export async function aiReady() { return Boolean((await aiConfig()).key); }
const client = (key) => new Anthropic({ apiKey: key, ...(process.env.ANTHROPIC_BASE ? { baseURL: process.env.ANTHROPIC_BASE.replace(/\/v1\/?$/, "") } : {}) });

// ---------- Kosten & Limits ----------
const month = () => new Date().toISOString().slice(0, 7);
const day = () => new Date().toISOString().slice(0, 10);
export const getUsage = () => read("ai_usage.json", {});
function costOf(model, u) {
  const [pin, pout] = MODELS[model]?.price || [2, 10];
  const inTok = (u.input_tokens || 0) + (u.cache_creation_input_tokens || 0) * 1.25 + (u.cache_read_input_tokens || 0) * 0.1;
  return (inTok * pin + (u.output_tokens || 0) * pout) / 1e6;
}
async function track(kind, who, model, usage) {
  const usd = costOf(model, usage || {});
  await update("ai_usage.json", {}, (all) => {
    const m = (all[month()] ||= { usd: 0, calls: 0, input: 0, output: 0, kinds: {}, models: {} });
    m.usd += usd; m.calls++; m.input += usage?.input_tokens || 0; m.output += usage?.output_tokens || 0;
    const k = (m.kinds[kind] ||= { usd: 0, calls: 0 }); k.usd += usd; k.calls++;
    const mm = (m.models[model] ||= { usd: 0, calls: 0 }); mm.usd += usd; mm.calls++;
    return Object.fromEntries(Object.entries(all).sort((x, y) => (x[0] < y[0] ? 1 : -1)).slice(0, 12));
  });
}
// Zählt den Aufruf vorab (Tageslimit je Konto bzw. für die Demo insgesamt)
async function countCall(who) {
  const limit = who === "demo" ? DAILY_CALLS_DEMO : DAILY_CALLS_PER_USER;
  let over = false;
  await update("ai_daily.json", {}, (d) => {
    if (d.day !== day()) { d = { day: day(), n: {} }; }
    const n = (d.n[who] || 0) + 1;
    if (n > limit) { over = true; return d; }
    d.n[who] = n;
    return d;
  });
  if (over) throw new Error(who === "demo" ? "Die Demo hat ihr KI-Tageslimit erreicht. Morgen geht es wieder." : "Tageslimit für KI-Vorschläge erreicht. Morgen geht es wieder.");
}

export class AiError extends Error { constructor(msg, status = 400) { super(msg); this.status = status; } }

async function ask({ kind, who, system, content, vision = false, maxTokens = 900 }) {
  const cfg = await aiConfig();
  if (!cfg.key) throw new AiError("Die KI ist noch nicht eingerichtet.", 503);
  if (who === "demo" && !cfg.demoAi) throw new AiError("In der Demo ist die KI ausgeschaltet.", 503);
  const used = (await getUsage())[month()]?.usd || 0;
  if (cfg.monthlyCapUsd > 0 && used >= cfg.monthlyCapUsd) throw new AiError("Das KI-Monatslimit ist erreicht. Die App läuft ohne KI-Vorschläge weiter.", 429);
  await countCall(who);
  const model = vision ? VISION_MODEL : TEXT_MODEL;
  const c = client(cfg.key);
  const base = { model, max_tokens: maxTokens, system, messages: [{ role: "user", content }] };
  let res;
  try {
    if (vision) res = await c.beta.messages.create({ ...base, output_config: { effort: "low" }, betas: ["server-side-fallback-2026-07-01"], fallbacks: "default" });
    else res = await c.messages.create({ ...base, temperature: 0.4 });
  } catch (e) {
    if (e instanceof Anthropic.AuthenticationError) throw new AiError("Der API-Schlüssel für Claude wird abgelehnt.", 503);
    if (e instanceof Anthropic.RateLimitError) throw new AiError("Claude ist gerade ausgelastet. Bitte in einer Minute nochmals.", 429);
    if (e instanceof Anthropic.APIError) throw new AiError(`Claude-Fehler ${e.status ?? ""}. Bitte nochmals versuchen.`, 502);
    throw e;
  }
  await track(kind, who, res.model?.startsWith("claude-sonnet") ? VISION_MODEL : model, res.usage);
  if (res.stop_reason === "refusal") throw new AiError("Dazu gibt es keinen Vorschlag. Bitte etwas anderes versuchen.");
  if (res.stop_reason === "max_tokens") throw new AiError("Die Antwort wurde zu lang. Bitte nochmals versuchen.", 502);
  return res.content.filter((b) => b.type === "text").map((b) => b.text).join("");
}

export function parseJson(text) {
  const s = String(text || ""), a = s.indexOf("{"), b = s.lastIndexOf("}");
  if (a < 0 || b <= a) throw new AiError("Die KI-Antwort war unvollständig. Bitte nochmals versuchen.", 502);
  try { return JSON.parse(s.slice(a, b + 1)); } catch { throw new AiError("Die KI-Antwort war unvollständig. Bitte nochmals versuchen.", 502); }
}

const STYLE = "Sprache: Deutsch mit Schweizer Rechtschreibung (ss statt ß). Kurze, klare Sätze, direkte Du-Anrede, keine Ausrufezeichen, keine Emojis.";
const DIETS = { all: "alles", pesc: "pescetarisch", veg: "vegetarisch" };

// ---------- Rezept aus Zutaten oder Foto ----------
const COOK_SYSTEM = `Du bist Ernährungscoach für Frauen in der Perimenopause und Menopause. ${STYLE}
Regeln für jedes Rezept: mindestens 25 g Protein pro Portion; hormonfreundlich (Ballaststoffe, wenn passend Phytoöstrogene wie Leinsamen, Soja oder Hülsenfrüchte, gesunde Fette, wenig Zucker, kein Alkohol). Nutze möglichst nur Vorhandenes; Öl, Salz, Pfeffer und Grundgewürze sind immer da. Fehlende Zutaten markierst du mit "have": false. Mengen gelten für alle Personen zusammen.
Antworte NUR mit JSON: {"title":"…","minutes":20,"proteinPerServing":30,"why":"1–2 Sätze, warum hormonfreundlich","detected":["…"],"ingredients":[{"item":"Eier","amount":"6 Stk","have":true}],"steps":["…"],"tip":"ein kurzer Tipp"}`;

export async function cookRecipe({ who, words, meal, time, servings, diet, image }) {
  const text = `Mahlzeit: ${meal}. Personen: ${servings}. Zeit: höchstens ${time} Minuten. Ernährungsweise: ${DIETS[diet] || "alles"}.
Vorhandene Zutaten: ${words || "keine Angabe"}.${image ? "\nDas Foto zeigt Kühlschrank oder Vorrat. Erkenne die Lebensmittel und nutze sie bevorzugt; trage sie unter detected ein." : ""}`;
  const content = image ? [{ type: "image", source: { type: "base64", media_type: "image/jpeg", data: image } }, { type: "text", text }] : text;
  return parseJson(await ask({ kind: image ? "cook_photo" : "cook", who, system: COOK_SYSTEM, content, vision: Boolean(image), maxTokens: 1200 }));
}

// ---------- Wochenplan aus der Rezeptbibliothek ----------
export async function weekPlan({ who, phase, household, diet, goal, wishes, recipes }) {
  const list = recipes.map((r) => `${r.id}|${r.type}|${r.n}|${r.p}g|${r.min}min|${r.tags.join(",")}`).join("\n");
  const system = `Du planst Essenswochen für Frauen in der ${phase}. ${STYLE}
Nutze ausschliesslich die gegebenen Rezept-IDs. B ist immer ein Frühstück (Typ B), L und D sind Hauptgerichte (Typ M). Kein Rezept zweimal am selben Tag, viel Abwechslung.
Antworte NUR mit JSON: {"days":[{"B":"id","L":"id","D":"id"} … genau 7 Einträge, Montag bis Sonntag],"note":"ein Satz, wie du die Wünsche umgesetzt hast"}`;
  const text = `Haushalt: ${household} Personen. Ernährungsweise: ${DIETS[diet] || "alles"}. Proteinziel: ${goal} g pro Tag.
Wünsche: ${wishes || "keine besonderen"}.
Rezepte (id|Typ|Titel|Protein|Zeit|Merkmale):
${list}`;
  return parseJson(await ask({ kind: "plan", who, system, content: text, maxTokens: 700 }));
}

// ---------- Tageseinordnung (ein kurzer Text pro Tag) ----------
export async function dayNote({ who, ctx }) {
  const system = `Du bist eine ruhige, kompetente Begleiterin für Frauen in der Perimenopause und Menopause. ${STYLE}
Schreibe 3 bis 4 Sätze: wie der Tag einzuordnen ist (Check-in und Gerätewerte zusammen), was heute am meisten hilft (Bewegung, Essen, Erholung, eine mentale Übung) und ein freundlicher Schlusssatz. Keine Diagnosen, keine Medikamente. Bei anhaltend sehr tiefer Stimmung den Hinweis auf ärztliche oder psychotherapeutische Hilfe geben. Nur Fliesstext, keine Überschriften, keine Listen.`;
  return (await ask({ kind: "day_note", who, system, content: JSON.stringify(ctx), maxTokens: 350 })).trim();
}
