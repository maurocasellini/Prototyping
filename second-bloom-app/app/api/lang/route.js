import { NextResponse } from "next/server";
import { pickLang, setLangCookie } from "@/lib/lang";
import { currentUser } from "@/lib/auth";
import * as repo from "@/lib/repo";

// /api/lang?l=en&next=/app – Sprache wechseln; bei Anmeldung auch im Profil speichern
export async function GET(req) {
  const u = new URL(req.url), lang = pickLang(u.searchParams.get("l"));
  let next = u.searchParams.get("next");
  if (!next) { try { const r = new URL(req.headers.get("referer") || ""); if (r.host === u.host) next = r.pathname + r.search; } catch {} }
  next ||= "/";
  if (!next.startsWith("/") || next.startsWith("//")) next = "/";
  await setLangCookie(lang);
  const me = await currentUser().catch(() => null);
  if (me) await repo.patchState(me.id, (st) => { if (st.profile) st.profile.lang = lang; return st; });
  return NextResponse.redirect(new URL(next, u.origin), 303);
}
