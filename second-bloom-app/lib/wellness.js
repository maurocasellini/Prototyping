// Gerätewerte → verständliche Einordnung. Jeder Wert wird gegen die EIGENEN letzten 28 Tage gemessen (Ansatz aus Formstand),
// nicht gegen Normwerte anderer. Keine KI nötig: reine Rechenregeln, nachvollziehbar und kostenlos.
const mean = (a) => { const x = a.filter((v) => v != null && Number.isFinite(v)); return x.length ? x.reduce((s, v) => s + v, 0) / x.length : null; };
const sd = (a) => { const x = a.filter((v) => v != null && Number.isFinite(v)); if (x.length < 5) return null; const m = mean(x); return Math.sqrt(x.reduce((s, v) => s + (v - m) ** 2, 0) / (x.length - 1)); };
const clip = (v, a, b) => Math.max(a, Math.min(b, v));
const diffDays = (a, b) => Math.round((new Date(b + "T12:00:00Z") - new Date(a + "T12:00:00Z")) / 864e5);
const addDays = (s, n) => { const d = new Date(s + "T12:00:00Z"); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
const fmt1 = (v) => String(Math.round(v * 10) / 10).replace(".", ",");

const KEYS = ["hrv", "rhr", "sleep_h", "sleep_score", "avg_sleep_hr", "stress", "steps"];

function baseline(rows, day) {
  const win = rows.filter((r) => r.day < day && diffDays(r.day, day) <= 28);
  const b = {};
  for (const k of KEYS) b[k] = { m: mean(win.map((r) => r[k])), s: sd(win.map((r) => r[k])), n: win.filter((r) => r[k] != null).length };
  return b;
}

// Erholung 0–100 aus HRV (+), Ruhepuls (−), Schlafdauer (+), Schlafqualität (+), je als Abweichung von der eigenen Normalität
export function recoveryFor(row, b) {
  const parts = [["hrv", 1], ["rhr", -1], ["sleep_h", 1], ["sleep_score", 1]], z = [];
  for (const [k, sign] of parts) {
    const v = row?.[k], m = b[k]?.m, s = b[k]?.s;
    if (v == null || m == null || !s) continue;
    z.push(clip(((v - m) / s) * sign, -2, 2));
  }
  if (z.length < 2) return null;
  return Math.round(clip(50 + 15 * mean(z) + 10, 0, 100));
}

function periodStarts(rows, state) {
  const set = new Set(Object.entries(state?.checkins || {}).filter(([, c]) => c?.period).map(([d]) => d));
  let prev = null;
  for (const r of rows) { if (r.phase === "PERIOD" && prev !== "PERIOD") set.add(r.day); prev = r.phase || prev; }
  const out = [];
  for (const d of [...set].sort()) if (!out.length || diffDays(out.at(-1), d) >= 10) out.push(d);
  return out;
}

function cycleSummary(rows, state, today) {
  const starts = periodStarts(rows, state);
  if (!starts.length) return null;
  const lens = starts.slice(1).map((d, i) => diffDays(starts[i], d)).filter((x) => x >= 14 && x <= 120);
  const last = starts.at(-1), since = diffDays(last, today);
  const c = { starts: starts.slice(-8), last, since, lens: lens.slice(-6) };
  if (lens.length >= 2) {
    const L = lens.slice(-6);
    c.avg = Math.round(mean(L)); c.min = Math.min(...L); c.max = Math.max(...L);
    c.irregular = c.max - c.min > 7;
  }
  if (since > 60) c.note = `Seit ${since} Tagen keine Periode notiert. Nach 12 Monaten ohne Periode spricht man von der Menopause.`;
  else if (c.irregular) c.note = `Deine Zykluslänge schwankt zwischen ${c.min} und ${c.max} Tagen. Das ist typisch für die Perimenopause.`;
  else if (c.avg) c.note = `Dein Zyklus ist mit rund ${c.avg} Tagen noch recht regelmässig.`;
  return c;
}

// Was tut dir gut? Vergleich mit ähnlichen Tagen ohne den Auslöser (ab 5 Tagen je Gruppe)
function insights(rows, state) {
  const out = [];
  const byDay = new Map(rows.map((r) => [r.day, r]));
  const trained = (d) => Boolean(state?.workouts?.[d]?.length) || Boolean(byDay.get(d)?.strength);
  const ci = state?.checkins || {};
  // Stimmung an Trainingstagen
  const moodT = [], moodN = [];
  for (const [d, c] of Object.entries(ci)) if (c?.mood && !c.ex) (trained(d) ? moodT : moodN).push(c.mood);
  if (moodT.length >= 5 && moodN.length >= 5) {
    const dlt = mean(moodT) - mean(moodN);
    if (Math.abs(dlt) >= 0.3) out.push({ k: "mood_training", text: `An Tagen mit Krafttraining ist deine Stimmung im Schnitt ${fmt1(Math.abs(dlt))} Punkte ${dlt > 0 ? "höher" : "tiefer"}.`, n: moodT.length + moodN.length });
  }
  // Schlaf nach Trainingstagen
  const sT = [], sN = [];
  for (const r of rows) { const prev = addDays(r.day, -1); if (r.sleep_h == null) continue; (trained(prev) ? sT : sN).push(r.sleep_h); }
  if (sT.length >= 5 && sN.length >= 5) {
    const dm = Math.round((mean(sT) - mean(sN)) * 60);
    if (Math.abs(dm) >= 10) out.push({ k: "sleep_training", text: `Nach Trainingstagen schläfst du ${Math.abs(dm)} Minuten ${dm > 0 ? "länger" : "kürzer"}.`, n: sT.length + sN.length });
  }
  // Hitzewallungen und Schlaf
  const hT = [], hN = [];
  for (const [d, c] of Object.entries(ci)) { const r = byDay.get(d); if (!r || r.sleep_score == null || c?.ex) continue; ((c.symptoms || []).some((s) => /Hitze|Nachtschweiss/.test(s)) ? hT : hN).push(r.sleep_score); }
  if (hT.length >= 4 && hN.length >= 4) {
    const dd = Math.round(mean(hT) - mean(hN));
    if (Math.abs(dd) >= 3) out.push({ k: "flush_sleep", text: `An Tagen mit Hitzewallungen oder Nachtschweiss liegt dein Schlafwert ${Math.abs(dd)} Punkte ${dd < 0 ? "tiefer" : "höher"}.`, n: hT.length + hN.length });
  }
  return out;
}

export function summarize(rows = [], state = null, today = new Date().toISOString().slice(0, 10), meta = {}) {
  rows = [...rows].sort((a, b) => (a.day < b.day ? -1 : 1));
  const recent = rows.filter((r) => diffDays(r.day, today) <= 45 && r.day <= today);
  const last = [...recent].reverse().find((r) => r.sleep_h != null || r.hrv != null || r.rhr != null) || null;
  const out = { connected: Boolean(meta.connected), demo: Boolean(meta.demo), provider: meta.provider || null, lastSync: meta.lastSync || null, error: meta.error || null, days: [], today: null, cycle: null, insights: [] };
  out.days = recent.slice(-30).map((r) => {
    const b = baseline(rows, r.day);
    return { day: r.day, sleep_h: r.sleep_h ?? null, sleep_score: r.sleep_score ?? null, hrv: r.hrv ?? null, rhr: r.rhr ?? null, steps: r.steps ?? null, act_kcal: r.act_kcal ?? null, phase: r.phase ?? null, recovery: recoveryFor(r, b) };
  });
  if (last) {
    const b = baseline(rows, last.day), t = { day: last.day, stale: diffDays(last.day, today) > 1, reasons: [] };
    t.recovery = recoveryFor(last, b);
    t.label = t.recovery == null ? null : t.recovery >= 65 ? "gut erholt" : t.recovery >= 45 ? "mittel erholt" : "wenig erholt";
    if (last.sleep_h != null) {
      t.sleep = { h: last.sleep_h, score: last.sleep_score ?? null, deltaMin: b.sleep_h.m != null ? Math.round((last.sleep_h - b.sleep_h.m) * 60) : null };
      if (t.sleep.deltaMin != null && Math.abs(t.sleep.deltaMin) >= 25) t.reasons.push(`Schlaf ${fmt1(last.sleep_h)} h, ${Math.abs(t.sleep.deltaMin)} min ${t.sleep.deltaMin < 0 ? "unter" : "über"} deinem Schnitt`);
    }
    if (last.hrv != null && b.hrv.m) { t.hrv = { v: last.hrv, pct: Math.round((last.hrv / b.hrv.m - 1) * 100) }; if (Math.abs(t.hrv.pct) >= 8) t.reasons.push(`HRV ${Math.abs(t.hrv.pct)} % ${t.hrv.pct < 0 ? "unter" : "über"} normal`); }
    if (last.rhr != null && b.rhr.m) { t.rhr = { v: last.rhr, d: Math.round(last.rhr - b.rhr.m) }; if (Math.abs(t.rhr.d) >= 3) t.reasons.push(`Ruhepuls ${t.rhr.d > 0 ? "+" : ""}${t.rhr.d} Schläge`); }
    if (last.steps != null) t.steps = last.steps;
    if (last.act_kcal != null) t.act_kcal = last.act_kcal;
    if (last.stress != null) t.stress = last.stress;
    // Unruhige Nacht: Puls im Schlaf deutlich über der eigenen Normalität (passt zu Nachtschweiss / Hitzewallungen)
    const ah = last.avg_sleep_hr, m = b.avg_sleep_hr.m, s = b.avg_sleep_hr.s;
    if (ah != null && m != null && ah - m >= Math.max(3, 1.5 * (s || 0))) t.unrest = { d: Math.round(ah - m), text: `Unruhige Nacht: Puls im Schlaf ${Math.round(ah - m)} Schläge über deinem Schnitt. Das passt zu Nachtschweiss oder Hitzewallungen.` };
    t.baselineDays = b.hrv.n || b.sleep_h.n || 0;
    out.today = t;
  }
  out.cycle = cycleSummary(rows, state, today);
  out.insights = insights(rows, state);
  return out;
}

// Für die KI: nur das Nötigste, kompakt (spart Tokens)
export function brief(w) {
  if (!w?.today) return null;
  const t = w.today;
  return { erholung: t.recovery, einordnung: t.label, gruende: t.reasons, unruhige_nacht: Boolean(t.unrest), schritte: t.steps ?? null, zyklus: w.cycle?.note || null };
}
