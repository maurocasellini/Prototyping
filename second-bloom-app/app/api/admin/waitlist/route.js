import { currentUser } from "@/lib/auth";
import * as repo from "@/lib/repo";

export const dynamic = "force-dynamic";

// Warteliste als CSV (nur Admin), z. B. für die Startnachricht
export async function GET() {
  const me = await currentUser();
  if (!me || me.role !== "admin") return new Response("Kein Zugriff.", { status: 403 });
  const q = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const rows = (await repo.getWaitlist()).map((w) => [w.email, w.name, w.lang, w.at, w.consent_version].map(q).join(";"));
  const csv = "﻿" + ["E-Mail;Vorname;Sprache;Eingetragen;Fassung Datenschutz", ...rows].join("\r\n");
  return new Response(csv, { headers: { "content-type": "text/csv; charset=utf-8", "content-disposition": `attachment; filename="second-bloom-warteliste.csv"`, "cache-control": "no-store" } });
}
