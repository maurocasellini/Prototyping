"use client";
import { useEffect } from "react";

// Registrierung: Phase aus dem Geburtsdatum vorschlagen (Menopause im Mittel um 51), solange sie nicht selbst gewählt wurde
const phaseForAge = (a) => (a < 40 ? "unsure" : a < 50 ? "peri" : a < 53 ? "meno" : "post");
export default function AutoPhase() {
  useEffect(() => {
    let manual = false;
    const onChange = (e) => {
      const t = e.target;
      if (t.name === "phase" && e.isTrusted) manual = true;
      if (t.name !== "birth" || manual || !/^\d{4}-\d{2}-\d{2}$/.test(t.value)) return;
      const b = new Date(t.value + "T00:00:00Z"), n = new Date();
      let a = n.getUTCFullYear() - b.getUTCFullYear();
      if (n.getUTCMonth() < b.getUTCMonth() || (n.getUTCMonth() === b.getUTCMonth() && n.getUTCDate() < b.getUTCDate())) a--;
      if (a < 18 || a > 110) return;
      const r = document.querySelector(`input[name="phase"][value="${phaseForAge(a)}"]`);
      if (r) r.checked = true;
    };
    document.addEventListener("change", onChange);
    document.addEventListener("input", onChange);
    return () => { document.removeEventListener("change", onChange); document.removeEventListener("input", onChange); };
  }, []);
  return null;
}
