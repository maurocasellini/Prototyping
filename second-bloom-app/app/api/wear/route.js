import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import { wearFor } from "@/lib/boot";

export const dynamic = "force-dynamic";

// Aktuelle Einordnung der Gerätewerte (nach dem Check-in neu berechnet, weil Zyklus und Muster Check-ins mitnutzen)
export async function GET() {
  const me = await currentUser();
  if (!me) return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
  return NextResponse.json(await wearFor(me.id));
}
