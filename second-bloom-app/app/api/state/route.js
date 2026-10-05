import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import * as repo from "@/lib/repo";

export const dynamic = "force-dynamic";
const MAX = 900_000; // ~0,9 MB je Konto reicht für Jahre an Einträgen

export async function GET() {
  const me = await currentUser();
  if (!me) return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
  return NextResponse.json((await repo.getState(me.id)) || {});
}

// PUT aus der App, POST über navigator.sendBeacon beim Schliessen
async function save(req) {
  const me = await currentUser();
  if (!me) return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
  const text = await req.text();
  if (text.length > MAX) return NextResponse.json({ error: "Zu viele Daten auf einmal." }, { status: 413 });
  let s; try { s = JSON.parse(text); } catch { return NextResponse.json({ error: "Ungültige Daten." }, { status: 400 }); }
  if (!s || typeof s !== "object" || Array.isArray(s)) return NextResponse.json({ error: "Ungültige Daten." }, { status: 400 });
  const prev = (await repo.getState(me.id)) || {};
  // Einwilligungen gehören dem Server: die App kann sie nicht überschreiben
  delete s.consent; delete s.consent_log; delete s.consent_at;
  await repo.saveState(me.id, { ...s, consent: prev.consent || null, consent_log: prev.consent_log || [] });
  return NextResponse.json({ ok: true });
}
export const PUT = save;
export const POST = save;
