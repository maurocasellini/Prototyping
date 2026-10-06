import Link from "next/link";
import SiteShell from "@/components/SiteShell";


const STEPS = [
  ["Kurz einchecken", "Jeden Tag eine Minute: Stimmung, Energie, Schlaf, Fokus und was dich gerade beschäftigt."],
  ["Dein Plan für heute", "Daraus entsteht ein Tagesplan: was du isst, wie du dich bewegst und was deinem Kopf guttut."],
  ["Verstehen und vorbereitet sein", "Wissen zu Hormonen und Zyklus, dein Verlauf über die Wochen und ein Bericht für das Gespräch in der Praxis."],
];
const FEATURES = [
  ["salbei", "Hormone & Zyklus", "Was in Perimenopause und Menopause im Körper passiert, verständlich erklärt. Dazu Perioden, Beschwerden und Zykluslänge über die Monate, damit du Veränderungen früh erkennst."],
  ["rosa", "Gut vorbereitet zum Arzt", "Ein Bericht mit deinen Beschwerden, Werten und Fragen für das Gespräch über Hormone und Hormonersatztherapie."],
  ["salbei", "Essen, das passt", "Proteinreich und hormonfreundlich: Wochenplan, Einkaufsliste und Rezepte aus dem, was im Kühlschrank ist."],
  ["rosa", "Kraft für Muskeln und Knochen", "Ein Wochenplan mit Krafteinheiten, der sich an deine Energie und deinen Tag anpasst."],
  ["salbei", "Kopf und Gefühle", "Atemübungen, Coaching-Programme und Antworten auf Fragen zu Dünnhäutigkeit, Brain Fog und Leistung im Job."],
  ["rosa", "Optional: deine Gesundheitsdaten", "Wer mag, verbindet Uhr oder Ring, etwa von Garmin, Oura oder Polar. Schlaf, HRV und Ruhepuls ergänzen das Bild, immer gemessen an deiner eigenen Normalität."],
];
const LANGS = ["Deutsch", "Português", "English", "Español", "Français"];

// Startseite nach dem Start (Stufe 2): mit Registrierung und Demo
export default function LandingLive({ sp, open = true }) {
  return (
    <SiteShell nav="preview">
      {sp?.geloescht && <p className="msg ok">Dein Konto und alle Daten sind gelöscht.</p>}

      <section className="lp-hero">
        <div className="lp-hero-text">
          <span className="eyebrow">Perimenopause · Menopause · danach</span>
          <h1 className="word">Second Bloom</h1>
          <p className="lede">Deine zweite Lebenshälfte.<br />Klar, ruhig, begleitet.</p>
          <p className="lp-intro">Second Bloom ist deine persönliche Begleiterin durch die Wechseljahre. Die App hilft dir, Hormone und Zyklus zu verstehen, und gibt dir jeden Tag konkrete Schritte für Ernährung, Krafttraining und dein seelisches Gleichgewicht. Abgestimmt auf deine Phase und auf das, wie es dir heute geht.</p>
          <div className="row wrap">
            {open ? <Link className="btn accent" href="/register">Jetzt starten</Link> : <Link className="btn accent" href="/demo">Demo ansehen</Link>}
            {open ? <Link className="btn line" href="/demo">Demo ansehen</Link> : <Link className="btn line" href="/login">Anmelden</Link>}
          </div>
        </div>
        <div className="lp-hero-art" aria-hidden="true">
          <div className="lp-blob lp-blob-a" /><div className="lp-blob lp-blob-b" />
          <div className="lp-quote"><span className="eyebrow">Impuls des Tages</span><p className="q">„Dein Körper baut nicht ab. Er baut um. Du darfst dabei mitbestimmen.“</p></div>
        </div>
      </section>

      <section className="lp-section">
        <div className="lp-head"><span className="eyebrow">So funktioniert es</span><h2>Jeden Tag ein kleiner, <em>passender</em> Schritt</h2></div>
        <ol className="lp-steps">
          {STEPS.map(([t, x], i) => <li key={t}><span className="lp-num">{i + 1}</span><h3>{t}</h3><p className="small muted">{x}</p></li>)}
        </ol>
      </section>

      <section className="lp-section">
        <div className="lp-head"><span className="eyebrow">Was dich erwartet</span><h2>Alles, was in dieser Phase <em>zählt</em></h2></div>
        <div className="lp-feat">
          {FEATURES.map(([tone, t, x]) => <div key={t} className={`lp-card lp-${tone}`}><span className="lp-dot" /><h3>{t}</h3><p className="small muted">{x}</p></div>)}
        </div>
      </section>

      <section className="lp-section lp-about">
        <img src="/sara.webp" alt="Sara Casellini-Machado Sousa" className="lp-photo" width={360} height={360} />
        <div className="stack" style={{ gap: 14 }}>
          <span className="eyebrow">Wer hinter Second Bloom steht</span>
          <h2>Sara Casellini-<wbr />Machado Sousa</h2>
          <p className="lp-role">Fachärztin für Gynäkologie und Geburtshilfe</p>
          <p>Geboren in Lissabon, aufgewachsen in Basel, wo sie Humanmedizin studierte. Ihre Ausbildung zur Fachärztin absolvierte sie in Grabs und Chur. Heute lebt sie mit ihrem Mann und den zwei Kindern in Liechtenstein und gehört seit 2023 zum Team der Praxis Gynorina.</p>
          <blockquote className="lp-cite">„Es ist mir wichtig, Frauen auf ihrem persönlichen Lebens- und Gesundheitsweg zu begleiten. Vertrauen steht dabei immer an erster Stelle.“</blockquote>
          <p className="small muted">Sara berät auf Deutsch, Portugiesisch, Englisch, Spanisch und Französisch. Deshalb spricht auch Second Bloom diese fünf Sprachen.</p>
          <div className="chips" translate="no">{LANGS.map((l) => <span key={l} className="lp-chip">{l}</span>)}</div>
        </div>
      </section>

      <section className="lp-section lp-trust">
        {[
          ["Fundiert", "Empfehlungen zu Nährstoffen und Supplements mit Evidenzstufe und Quellen aus Studien und Leitlinien."],
          ["Privat", "Deine Daten gehören dir: geschützt gespeichert, keine Werbung, kein Verkauf, jederzeit löschbar."],
          ["Ehrlich", "Second Bloom ersetzt keine ärztliche Beratung. Die App hilft dir, gut informiert ins Gespräch zu gehen."],
        ].map(([t, x]) => <div key={t}><h3>{t}</h3><p className="small muted">{x}</p></div>)}
      </section>

      <section className="lp-cta">
        <h2>Bereit für deine <em>zweite Blüte</em>?</h2>
        <p className="muted">In zwei Minuten eingerichtet. Ohne Werbung.</p>
        <div className="row wrap" style={{ justifyContent: "center" }}>
          {open ? <Link className="btn accent" href="/register">Konto erstellen</Link> : <Link className="btn accent" href="/demo">Demo ansehen</Link>}
          {open ? <Link className="btn line" href="/demo">Erst die Demo ansehen</Link> : <a className="btn line" href="/#warteliste">Auf die Warteliste</a>}
        </div>
      </section>
    </SiteShell>
  );
}
