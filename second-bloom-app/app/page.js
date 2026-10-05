import Link from "next/link";
import { redirect } from "next/navigation";
import SiteShell from "@/components/SiteShell";
import { currentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function Home({ searchParams }) {
  const sp = await searchParams;
  if (await currentUser().catch(() => null)) redirect("/app");
  return (
    <SiteShell>
      {sp?.geloescht && <p className="msg ok">Dein Konto und alle Daten sind gelöscht.</p>}
      <section className="hero">
        <div className="stack" style={{ gap: 18 }}>
          <span className="eyebrow">Perimenopause · Menopause · danach</span>
          <div className="word">Second Bloom</div>
          <p className="lede">Deine zweite Lebenshälfte.<br />Klar, ruhig, begleitet.</p>
          <p className="muted">Hormone und Zyklus verstehen, dazu Ernährung, Krafttraining und tägliches Mental Coaching. Abgestimmt auf deine Phase und deinen Tag. Auf Wunsch ergänzt mit deinen Gesundheitsdaten.</p>
          <div className="row wrap">
            <Link className="btn accent" href="/register">Konto erstellen</Link>
            <Link className="btn line" href="/demo">Demo ansehen</Link>
          </div>
        </div>
        <div className="impulse"><span className="eyebrow">Impuls des Tages</span><p className="q">„Dein Körper baut nicht ab. Er baut um. Du darfst dabei mitbestimmen.“</p></div>
      </section>
      <div className="orn">· · ·</div>
      <section className="feat">
        {[
          ["Hormone & Zyklus", "Was in Perimenopause und Menopause im Körper passiert, verständlich erklärt. Dazu Perioden, Beschwerden und Zykluslänge über die Monate, damit du Veränderungen früh erkennst."],
          ["Gut vorbereitet zum Arzt", "Ein Bericht mit deinen Beschwerden, Werten und Fragen für das Gespräch über Hormone und Hormonersatztherapie."],
          ["Essen, das passt", "Proteinreich und hormonfreundlich: Wochenplan, Einkaufsliste und Rezepte aus dem, was im Kühlschrank ist."],
          ["Kraft für Muskeln und Knochen", "Ein Wochenplan mit Krafteinheiten, der sich an deine Energie und deinen Tag anpasst."],
          ["Kopf und Gefühle", "Atemübungen, Coaching-Programme und Antworten auf Fragen zu Dünnhäutigkeit, Brain Fog und Leistung im Job."],
          ["Optional: deine Gesundheitsdaten", "Wer mag, verbindet Uhr oder Ring, etwa von Garmin, Oura oder Polar. Schlaf, HRV und Ruhepuls ergänzen das Bild, immer gemessen an deiner eigenen Normalität."],
        ].map(([t, x]) => <div key={t} className="card"><h3>{t}</h3><p className="small muted">{x}</p></div>)}
      </section>
    </SiteShell>
  );
}
