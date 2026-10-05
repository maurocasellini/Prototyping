// Sprache der Oberfläche: Cookie sb_lang (gesetzt über /api/lang, bei Registrierung und Anmeldung). Deutsch ist Hauptsprache.
import { cookies, headers } from "next/headers";

export const LANGS = { de: "Deutsch", en: "English", pt: "Português", es: "Español", fr: "Français" };
export const HTML_LANG = { de: "de-CH", en: "en", fr: "fr", es: "es", pt: "pt-PT" };
export const I18N_VERSION = "4";
export const pickLang = (v) => (Object.hasOwn(LANGS, v) ? v : "de");

// Browsersprache (Accept-Language), z. B. "fr-CH,fr;q=0.9,en;q=0.8" → "fr"; nur unterstützte Sprachen, sonst Deutsch
export function fromAcceptLanguage(h) {
  const list = String(h || "").split(",").map((part, i) => {
    const [tag, ...params] = part.trim().split(";");
    const q = Number((params.find((x) => x.trim().startsWith("q=")) || "q=1").trim().slice(2));
    return { lang: tag.trim().slice(0, 2).toLowerCase(), q: Number.isFinite(q) ? q : 0, i };
  }).filter((x) => x.lang && x.q > 0).sort((a, b) => b.q - a.q || a.i - b.i);
  return list.find((x) => Object.hasOwn(LANGS, x.lang))?.lang || "de";
}

// Gewählte Sprache (Cookie) hat Vorrang, sonst die Sprache des Browsers
export async function getLang() {
  try {
    const c = (await cookies()).get("sb_lang")?.value;
    if (c) return pickLang(c);
    return fromAcceptLanguage((await headers()).get("accept-language"));
  } catch { return "de"; }
}
export async function setLangCookie(lang) {
  (await cookies()).set("sb_lang", pickLang(lang), { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax", secure: process.env.NODE_ENV === "production" });
}
