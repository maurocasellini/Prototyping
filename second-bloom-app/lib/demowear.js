// Beispiel-Gerätedaten für die Demo (wie von einer Garmin über intervals.icu): 60 Tage, unregelmässiger Zyklus,
// ein paar unruhige Nächte. Deterministisch pro Tag, damit die Demo bei jedem Laden gleich aussieht.
function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32); }
const addDays = (s, n) => { const d = new Date(s + "T12:00:00Z"); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };

export function demoRows(today = new Date().toISOString().slice(0, 10)) {
  const r = rng(Number(today.replace(/-/g, "")) % 100000 + 7);
  const periodStartsAgo = [58, 31, 2]; // 27 und 29 Tage, dann ein kurzer Zyklus → in der Demo wirkt das „schwankend“
  const rows = [];
  for (let i = 59; i >= 0; i--) {
    const day = addDays(today, -i);
    const bad = [3, 9, 17, 22, 35, 41, 1].includes(i);
    const strength = [1, 3, 5].includes(new Date(day + "T12:00:00Z").getUTCDay());
    const inPeriod = periodStartsAgo.some((p) => i <= p && i > p - 5);
    rows.push({
      day,
      sleep_h: Math.round((bad ? 5.6 + r() * 0.6 : 6.7 + r() * 1.1) * 10) / 10,
      sleep_score: Math.round(bad ? 52 + r() * 10 : 70 + r() * 15),
      hrv: Math.round(bad ? 29 + r() * 4 : 36 + r() * 8),
      rhr: Math.round(bad ? 62 + r() * 3 : 56 + r() * 3),
      avg_sleep_hr: Math.round(bad ? 66 + r() * 3 : 58 + r() * 3),
      stress: Math.round(bad ? 42 + r() * 10 : 24 + r() * 10),
      steps: Math.round(5000 + r() * 6000),
      act_min: strength ? 40 : r() > 0.5 ? 30 : null,
      act_kcal: strength ? 260 : null,
      strength,
      phase: inPeriod ? "PERIOD" : "FOLLICULAR",
    });
  }
  return rows;
}
