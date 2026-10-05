import { NextResponse } from "next/server";
import { liveVideos } from "@/lib/videos";

// Einmal am Tag neu geprüft; Antwort wird im CDN zwischengespeichert.
export const revalidate = 86400;

export async function GET() {
  return NextResponse.json(await liveVideos(), { headers: { "cache-control": "public, s-maxage=86400, stale-while-revalidate=604800" } });
}
