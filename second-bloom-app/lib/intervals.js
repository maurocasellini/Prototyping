// intervals.icu (wie in Formstand): darüber kommen Garmin, Oura, WHOOP, Polar, COROS, Suunto …
// Second Bloom liest nur die Gesundheitsseite: Schlaf, HRV, Ruhepuls, Stress, Schritte, Kalorien, Zyklusphase.
const BASE = process.env.INTERVALS_BASE || "https://intervals.icu/api/v1";
const auth = (key) => "Basic " + Buffer.from(`API_KEY:${key}`).toString("base64");
const iso = (d) => d.toISOString().slice(0, 10);
const n = (v) => (v == null || v === "" || !Number.isFinite(Number(v)) ? null : Number(v));
const r1 = (v) => (v == null ? null : Math.round(v * 10) / 10);

async function get(key, path) {
  const r = await fetch(`${BASE}${path}`, { headers: { authorization: auth(key), accept: "application/json" }, cache: "no-store" });
  if (r.status === 401 || r.status === 403) throw new Error("intervals.icu: API-Schlüssel oder Athleten-ID stimmt nicht.");
  if (r.status === 429) throw new Error("intervals.icu: Limit erreicht, bitte später nochmals.");
  if (!r.ok) throw new Error(`intervals.icu antwortet mit Fehler ${r.status}.`);
  return r.json();
}

export function mapWellness(w) {
  const day = String(w.id || w.date || "").slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return null;
  const row = {
    day,
    hrv: n(w.hrv), rhr: n(w.restingHR),
    sleep_h: n(w.sleepSecs) != null ? Math.round((n(w.sleepSecs) / 3600) * 100) / 100 : null,
    sleep_score: n(w.sleepScore), avg_sleep_hr: n(w.avgSleepingHR), spo2: n(w.spO2), respiration: n(w.respiration),
    stress: n(w.stress), steps: n(w.steps), weight: n(w.weight), kcal_in: n(w.kcalConsumed),
    phase: typeof w.menstrualPhase === "string" && w.menstrualPhase ? w.menstrualPhase.toUpperCase() : null,
  };
  return Object.entries(row).some(([k, v]) => k !== "day" && v != null) ? row : null;
}

// Aktivitäten je Tag zusammengefasst: Minuten, verbrannte Kalorien, Krafttraining ja/nein
export function mapActivities(list) {
  const by = {};
  for (const a of list) {
    if (!a || (!a.moving_time && !a.elapsed_time)) continue;
    const day = String(a.start_date_local || a.start_date || "").slice(0, 10);
    if (!day) continue;
    const d = (by[day] ||= { day, act_min: 0, act_kcal: 0, strength: false });
    d.act_min += Math.round((n(a.moving_time) || n(a.elapsed_time) || 0) / 60);
    d.act_kcal += n(a.calories) || 0;
    if (/weight|strength|kraft/i.test(String(a.type || ""))) d.strength = true;
  }
  return Object.values(by).map((d) => ({ ...d, act_kcal: Math.round(d.act_kcal) || null }));
}

export async function verify(athleteId, key) {
  const a = await get(key, `/athlete/${encodeURIComponent(athleteId || "0")}`);
  return { external_id: String(a.id || athleteId), name: a.name || null };
}

export async function fetchSince(key, athleteId, since) {
  const id = encodeURIComponent(athleteId || "0");
  const oldest = iso(since), newest = iso(new Date(Date.now() + 864e5));
  const [well, acts] = await Promise.all([
    get(key, `/athlete/${id}/wellness?oldest=${oldest}&newest=${newest}`),
    get(key, `/athlete/${id}/activities?oldest=${oldest}&newest=${newest}`).catch(() => []),
  ]);
  const rows = new Map();
  for (const w of Array.isArray(well) ? well : []) { const m = mapWellness(w); if (m) rows.set(m.day, m); }
  for (const a of mapActivities(Array.isArray(acts) ? acts : [])) rows.set(a.day, { ...(rows.get(a.day) || { day: a.day }), ...a });
  return [...rows.values()].map((r) => ({ ...r, sleep_h: r1(r.sleep_h) }));
}
