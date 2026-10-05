import { getLang } from "@/lib/lang";
import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import { cookRecipe, weekPlan, dayNote, AiError } from "@/lib/ai";
import * as repo from "@/lib/repo";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const str = (v, max) => String(v ?? "").slice(0, max);
const int = (v, a, b, d) => { const n = Math.round(Number(v)); return Number.isFinite(n) ? Math.max(a, Math.min(b, n)) : d; };
const DIET = (v) => (["all", "pesc", "veg"].includes(v) ? v : "all");
const list = (v, n = 12) => (Array.isArray(v) ? v : []).slice(0, n).map((x) => str(x, 40)).filter(Boolean);
const PREFS = (p) => ({ avoid: list(p?.avoid), dislike: list(p?.dislike), like: list(p?.like) });

export async function POST(req, { params }) {
  const { task } = await params;
  const me = await currentUser().catch(() => null);
  const who = me ? me.id : "demo";
  if (me) {
    const c = (await repo.getState(me.id))?.consent;
    if (!c?.health_at) return NextResponse.json({ error: "Bitte zuerst der Datenschutzerklärung zustimmen." }, { status: 403 });
    if (c.ai === false) return NextResponse.json({ error: "Die KI-Funktionen sind in deinem Konto ausgeschaltet. Du kannst sie unter Konto einschalten." }, { status: 503 });
  }
  const lang = await getLang();
  let b; try { b = await req.json(); } catch { return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 }); }
  try {
    if (task === "cook") {
      const image = b.image ? str(b.image, 2_000_000) : null;
      if (image && !/^[A-Za-z0-9+/=]+$/.test(image)) return NextResponse.json({ error: "Das Foto konnte nicht gelesen werden." }, { status: 400 });
      const r = await cookRecipe({ who, words: str(b.words, 600), meal: str(b.meal, 20), time: int(b.time, 10, 90, 30), servings: int(b.servings, 1, 8, 2), diet: DIET(b.diet), prefs: PREFS(b.prefs), image, lang });
      return NextResponse.json(r);
    }
    if (task === "plan") {
      const recipes = (Array.isArray(b.recipes) ? b.recipes : []).slice(0, 40).map((r) => ({ id: str(r.id, 20), type: r.type === "B" ? "B" : "M", n: str(r.n, 70), p: int(r.p, 0, 99, 0), min: int(r.min, 0, 180, 0), tags: (Array.isArray(r.tags) ? r.tags : []).slice(0, 3).map((t) => str(t, 24)) }));
      if (recipes.length < 3) return NextResponse.json({ error: "Zu wenige Rezepte." }, { status: 400 });
      const r = await weekPlan({ who, phase: str(b.phase, 30) || "Perimenopause", household: int(b.household, 1, 8, 2), diet: DIET(b.diet), prefs: PREFS(b.prefs), goal: int(b.goal, 40, 200, 95), wishes: str(b.wishes, 400), recipes, lang });
      return NextResponse.json(r);
    }
    if (task === "day") {
      // Nur bekannte Felder, kurz gehalten (spart Tokens und verhindert, dass beliebiger Text mitgeschickt wird)
      const c = b.ctx || {}, ci = c.checkin || null, w = c.wear || null;
      const ctx = {
        phase: str(c.phase, 30),
        checkin: ci ? { stimmung: int(ci.mood, 1, 5, null), energie: int(ci.energy, 1, 5, null), schlaf: int(ci.sleep, 1, 5, null), fokus: int(ci.focus, 1, 5, null), symptome: (Array.isArray(ci.symptoms) ? ci.symptoms : []).slice(0, 8).map((x) => str(x, 30)) } : null,
        uhr: w ? { erholung: int(w.erholung, 0, 100, null), einordnung: str(w.einordnung, 30), gruende: (Array.isArray(w.gruende) ? w.gruende : []).slice(0, 4).map((x) => str(x, 80)), unruhige_nacht: Boolean(w.unruhige_nacht), zyklus: str(w.zyklus, 160) } : null,
        training_heute: str(c.training, 80), abendessen: str(c.dinner, 80),
        protein: { heute: int(c.protein, 0, 400, 0), ziel: int(c.goal, 0, 400, 0) },
        tiefe_stimmung_mehrere_tage: Boolean(c.lowStreak),
      };
      return NextResponse.json({ text: await dayNote({ who, ctx, lang }) });
    }
    return NextResponse.json({ error: "Unbekannte Aufgabe." }, { status: 404 });
  } catch (e) {
    if (e instanceof AiError) return NextResponse.json({ error: e.message }, { status: e.status });
    console.error(e);
    return NextResponse.json({ error: "Das hat nicht geklappt. Bitte nochmals versuchen." }, { status: 500 });
  }
}
