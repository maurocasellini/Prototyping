// Sprache der Oberfläche: Cookie sb_lang (gesetzt über /api/lang, bei Registrierung und Anmeldung). Deutsch ist Hauptsprache.
import { cookies } from "next/headers";

export const LANGS = { de: "Deutsch", en: "English", fr: "Français", es: "Español", pt: "Português" };
export const HTML_LANG = { de: "de-CH", en: "en", fr: "fr", es: "es", pt: "pt-PT" };
export const I18N_VERSION = "4";
export const pickLang = (v) => (Object.hasOwn(LANGS, v) ? v : "de");

export async function getLang() {
  try { return pickLang((await cookies()).get("sb_lang")?.value); } catch { return "de"; }
}
export async function setLangCookie(lang) {
  (await cookies()).set("sb_lang", pickLang(lang), { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax", secure: process.env.NODE_ENV === "production" });
}
