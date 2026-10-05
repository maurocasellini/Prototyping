import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import * as repo from "@/lib/repo";

export const dynamic = "force-dynamic";

// Tageswerte aus dem Apple-Health-Export. Die Datei selbst wird im Browser ausgewertet; hier kommen nur Tageswerte an.
const num = (v, lo, hi) => { const n = Number(v); return v != null && Number.isFinite(n) && n >= lo && n <= hi ? n : null; };
export async function POST(req) {
  const me = await currentUser();
  if (!me) return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
  let b; try { b = await req.json(); } catch { return NextResponse.json({ error: "Ungültige Daten." }, { status: 400 }); }
  const rows = (Array.isArray(b?.rows) ? b.rows : []).slice(-400).map((r) => ({
    day: /^\d{4}-\d{2}-\d{2}$/.test(String(r?.day)) ? String(r.day) : null,
    sleep_h: num(r.sleep_h, 0, 16), steps: num(r.steps, 0, 150000), hrv: num(r.hrv, 1, 400), rhr: num(r.rhr, 20, 200),
    spo2: num(r.spo2, 50, 100), respiration: num(r.respiration, 4, 60), weight: num(r.weight, 25, 300),
    phase: r?.phase === "PERIOD" ? "PERIOD" : null,
  })).filter((r) => r.day && Object.entries(r).some(([k, v]) => k !== "day" && v != null));
  if (!rows.length) return NextResponse.json({ error: "In der Datei wurden keine passenden Werte der letzten Monate gefunden." }, { status: 422 });
  await repo.upsertDaily(me.id, rows);
  await repo.saveConnection(me.id, "apple", { last_import_at: new Date().toISOString(), days: rows.length, from: rows[0].day, to: rows[rows.length - 1].day });
  return NextResponse.json({ ok: true, days: rows.length, from: rows[0].day, to: rows[rows.length - 1].day });
}

// Import-Verbindung entfernen, auf Wunsch mit allen Gerätewerten
export async function DELETE(req) {
  const me = await currentUser();
  if (!me) return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
  await repo.removeConnection(me.id, "apple");
  if (new URL(req.url).searchParams.get("purge") === "1") await repo.clearDaily(me.id);
  return NextResponse.json({ ok: true });
}
