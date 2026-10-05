"use client";
import { useEffect, useState } from "react";

// Hinweis beim ersten Besuch. Second Bloom setzt nur technisch notwendige Cookies, deshalb genügt ein Hinweis (keine Einwilligung).
// Die Einwilligungen zu Gesundheitsdaten und KI werden erst bei der Registrierung eingeholt.
export default function CookieNotice() {
  const [open, setOpen] = useState(false);
  useEffect(() => { setOpen(!document.cookie.split("; ").some((c) => c.startsWith("sb_cookie_ok="))); }, []);
  // Solange der Hinweis offen ist, unten Platz lassen, damit er keine Knöpfe verdeckt
  useEffect(() => { document.body.classList.toggle("cookie-open", open); }, [open]);
  if (!open) return null;
  const ok = () => {
    document.cookie = `sb_cookie_ok=1; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax${location.protocol === "https:" ? "; secure" : ""}`;
    setOpen(false);
  };
  return (
    <div className="cookie" role="region" aria-label="Cookie-Hinweis">
      <p className="small">Wir verwenden nur technisch notwendige Cookies: für die Anmeldung und die gewählte Sprache. Keine Werbung, kein Tracking. <a href="/datenschutz#cookies">Mehr erfahren</a></p>
      <button className="btn sm accent" type="button" onClick={ok}>Verstanden</button>
    </div>
  );
}
