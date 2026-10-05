"use client";
import { useEffect, useState } from "react";

// Registrierung: BMI live aus Grösse und Gewicht, nur als grober Indikator
const MUSCLE = "Bei viel Muskelmasse ist ein höherer BMI häufig unbedenklich. Aussagekräftiger ist der Taillenumfang.";
const HINT = "Nur ein grober Richtwert: Er unterscheidet nicht zwischen Muskeln und Fett. Ab der Lebensmitte sagt der Taillenumfang mehr aus.";
const whtrNote = (r) => r < 0.5 ? "günstig (Taille unter der halben Körpergrösse)" : r < 0.6 ? "erhöht (Richtwert unter 0,5)" : "deutlich erhöht (Richtwert unter 0,5)";
const note = (b) => b < 18.5 ? "unter dem Richtbereich (18,5–24,9)" : b < 25 ? "im Richtbereich (18,5–24,9)" : b < 30 ? "etwas über dem Richtbereich (18,5–24,9)" : "über dem Richtbereich (18,5–24,9)";
export default function BmiHint() {
  const [v, setV] = useState(null);
  useEffect(() => {
    const read = () => {
      const q = (n) => document.querySelector(`input[name="${n}"]`);
      const h = Number(q("height")?.value), w = Number(q("weight")?.value), wa = Number(q("waist")?.value);
      if (!(h >= 120 && h <= 220 && w >= 35 && w <= 250)) return setV(null);
      setV({ b: Math.round((w / (h / 100) ** 2) * 10) / 10, r: wa >= 50 && wa <= 160 ? Math.round((wa / h) * 100) / 100 : null, m: Boolean(q("muscular")?.checked) });
    };
    document.addEventListener("input", read); document.addEventListener("change", read);
    return () => { document.removeEventListener("input", read); document.removeEventListener("change", read); };
  }, []);
  if (!v) return null;
  const fmt = (x) => document.documentElement.dataset.lang === "en" ? String(x) : String(x).replace(".", ",");
  return (
    <p className="small muted">
      <span>{`BMI ${fmt(v.b)}:`}</span> <span>{note(v.b)}</span>. <span>{v.m && v.b >= 25 ? MUSCLE : HINT}</span>
      {v.r && <><br /><span>{`Taille zu Grösse ${fmt(v.r)}:`}</span> <span>{whtrNote(v.r)}</span>.</>}
    </p>
  );
}
