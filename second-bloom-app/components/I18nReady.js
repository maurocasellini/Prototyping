"use client";
import { useEffect } from "react";

// Meldet public/i18n.js, dass React die Seite übernommen hat. Erst danach werden Texte ersetzt,
// sonst passt das HTML nicht mehr zum Server-Rendering und React baut die Seite neu auf.
export default function I18nReady() {
  useEffect(() => { window.__sbHydrated = true; window.dispatchEvent(new Event("sb-hydrated")); }, []);
  return null;
}
