// Angaben bei der Registrierung. Gleiche Schlüssel wie in der App (public/sb-app.js), damit das Onboarding entfällt.
export const PHASE_OPTS = [
  ["peri", "Perimenopause", "Zyklus wird unregelmässig, erste Beschwerden"],
  ["meno", "Menopause", "Seit bis zu 12 Monaten keine Periode"],
  ["post", "Postmenopause", "Letzte Periode liegt über ein Jahr zurück"],
  ["unsure", "Noch unsicher", "Ich möchte es herausfinden"],
];
export const GOAL_OPTS = ["Mehr Energie", "Besser schlafen", "Stimmung stabilisieren", "Muskeln & Knochen stärken", "Gewicht halten", "Konzentration im Job", "Hitzewallungen lindern", "Hormone verstehen"];
export const DIET_OPTS = [["all", "Alles"], ["pesc", "Pescetarisch"], ["veg", "Vegetarisch"]];
export const INTOL_OPTS = [["laktose", "Laktose"], ["gluten", "Gluten"], ["nuesse", "Nüsse"], ["soja", "Soja"], ["ei", "Ei"], ["fisch", "Fisch & Meeresfrüchte"], ["sesam", "Sesam"], ["huelsen", "Hülsenfrüchte"], ["histamin", "Histamin"]];
export const COUNTRY_OPTS = [["CH", "Schweiz"], ["LI", "Liechtenstein"], ["DE", "Deutschland"], ["AT", "Österreich"], ["other", "Anderes Land"]];
export const LANG_OPTS = [["de", "Deutsch"], ["en", "English"], ["pt", "Português"], ["es", "Español"], ["fr", "Français"]];

export function ageOn(birth, now = new Date()) {
  const b = new Date(birth + "T00:00:00Z");
  let a = now.getUTCFullYear() - b.getUTCFullYear();
  const m = now.getUTCMonth() - b.getUTCMonth();
  if (m < 0 || (m === 0 && now.getUTCDate() < b.getUTCDate())) a--;
  return a;
}

const num = (v, lo, hi) => { const n = Number(String(v || "").replace(",", ".")); return Number.isFinite(n) && n >= lo && n <= hi ? Math.round(n) : null; };

// Liest die Profilangaben aus dem Formular. Gibt {error} oder die Felder für den App-Zustand zurück.
export function readProfile(form, name) {
  const birth = String(form.get("birth") || "");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(birth) || isNaN(Date.parse(birth))) return { error: "Bitte dein Geburtsdatum angeben." };
  const age = ageOn(birth);
  if (age < 18) return { error: "Second Bloom ist für Erwachsene ab 18 Jahren." };
  if (age > 110) return { error: "Bitte das Geburtsdatum prüfen." };
  const phase = String(form.get("phase") || "");
  if (!PHASE_OPTS.some(([k]) => k === phase)) return { error: "Bitte wähle deine Phase. Wenn du unsicher bist: «Noch unsicher»." };
  const weight = num(form.get("weight"), 35, 250), height = num(form.get("height"), 120, 220), waist = num(form.get("waist"), 50, 160);
  if (form.get("waist") && !waist) return { error: "Bitte den Taillenumfang in cm prüfen." };
  if (form.get("weight") && !weight) return { error: "Bitte das Gewicht in kg prüfen." };
  if (form.get("height") && !height) return { error: "Bitte die Grösse in cm prüfen." };
  const country = COUNTRY_OPTS.some(([k]) => k === form.get("country")) ? String(form.get("country")) : "CH";
  const lang = LANG_OPTS.some(([k]) => k === form.get("lang")) ? String(form.get("lang")) : "de";
  const goals = form.getAll("goals").map(String).filter((g) => GOAL_OPTS.includes(g));
  const avoid = form.getAll("avoid").map(String).filter((k) => INTOL_OPTS.some(([x]) => x === k));
  const diet = DIET_OPTS.some(([k]) => k === form.get("diet")) ? String(form.get("diet")) : "all";
  const household = num(form.get("household"), 1, 8) || 2;
  return {
    profile: { name, lastname: String(form.get("lastname") || "").trim().slice(0, 60) || null, birth, age, weight: weight || 68, height, waist, muscular: form.get("muscular") === "on", phase, goals, country, lang },
    household, diet, prefs: { avoid, dislike: [], like: [] },
  };
}
