import { NextResponse } from "next/server";
import { syncAll } from "@/lib/sync";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

// Täglicher Abgleich aller verbundenen Uhren (Vercel Cron)
export async function GET(req) {
  if (!process.env.CRON_SECRET || req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.json(await syncAll());
}
