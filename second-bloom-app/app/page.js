import Link from "next/link";
import { redirect } from "next/navigation";
import SiteShell from "@/components/SiteShell";
import Form from "@/components/Form";
import LandingLive from "@/components/LandingLive";
import { currentUser } from "@/lib/auth";
import * as repo from "@/lib/repo";
import { joinWaitlist } from "./actions";

export const dynamic = "force-dynamic";

const GOALS = [
  ["salbei", "Verstehen", "Klar erklärt, was die Hormone in dieser Lebensphase verändern und welche Beschwerden dazugehören können."],
  ["rosa", "Selbst handeln", "Konkrete Schritte für Ernährung, Krafttraining, Schlaf und Psyche, die sich an deinen Alltag anpassen."],
  ["salbei", "Gut vorbereitet", "Deine Beobachtungen übersichtlich zusammengefasst, damit das Gespräch mit deiner Ärztin oder deinem Arzt leichter wird."],
];
const PLANNED = [
  ["salbei", "Hormone & Zyklus", "Was in Perimenopause und Menopause im Körper passiert, verständlich erklärt. Dazu Perioden, Beschwerden und Zykluslänge über die Monate, damit du Veränderungen früh erkennst."],
  ["rosa", "Gut vorbereitet zum Arzt", "Ein Bericht mit deinen Beschwerden, Werten und Fragen für das Gespräch über Hormone und Hormonersatztherapie."],
  ["salbei", "Essen, das passt", "Proteinreich und hormonfreundlich: Wochenplan, Einkaufsliste und Rezepte aus dem, was im Kühlschrank ist."],
  ["rosa", "Kraft für Muskeln und Knochen", "Ein Wochenplan mit Krafteinheiten, der sich an deine Energie und deinen Tag anpasst."],
  ["salbei", "Kopf und Gefühle", "Atemübungen, Coaching-Programme und Antworten auf Fragen zu Dünnhäutigkeit, Brain Fog und Leistung im Job."],
  ["rosa", "Optional: deine Gesundheitsdaten", "Wer mag, verbindet Uhr oder Ring, etwa von Garmin, Oura oder Polar. Schlaf, HRV und Ruhepuls ergänzen das Bild, immer gemessen an deiner eigenen Normalität."],
];
const LANGS = ["Deutsch", "Português", "English", "Español", "Français"];

export default async function Home({ searchParams }) {
  const sp = await searchParams;
  if (await currentUser().catch(() => null)) redirect("/app");
  if (repo.isLive(await repo.getSettings())) return <LandingLive sp={sp} />;
  return (
    <SiteShell>
      {sp?.geloescht && <p className="msg ok">Dein Konto und alle Daten sind gelöscht.</p>}

      <section className="lp-hero">
        <div className="lp-hero-text">
          <span className="eyebrow">Bald verfügbar · Perimenopause · Menopause · danach</span>
          <h1 className="word">Second Bloom</h1>
          <p className="lede">Deine zweite Lebenshälfte.<br />Klar, ruhig, begleitet.</p>
          <p className="lp-intro">Second Bloom wird eine digitale Begleiterin für Frauen in der Perimenopause und Menopause: mit fundiertem Wissen und kleinen, alltagstauglichen Schritten für Körper und Kopf. Hinter der Idee steht die Gynäkologin Sara Casellini-Machado Sousa.</p>
          <div className="row wrap">
            <a className="btn accent" href="#warteliste">Auf die Warteliste</a>
            <a className="btn line" href="#ziel">Mehr erfahren</a>
          </div>
        </div>
        <div className="lp-hero-art" aria-hidden="true">
          <div className="lp-blob lp-blob-a" /><div className="lp-blob lp-blob-b" />
          <div className="lp-quote"><span className="eyebrow">Impuls des Tages</span><p className="q">„Dein Körper baut nicht ab. Er baut um. Du darfst dabei mitbestimmen.“</p></div>
        </div>
      </section>

      <section className="lp-section" id="ziel">
        <div className="lp-head"><span className="eyebrow">Das Ziel</span><h2>Gut informiert durch die <em>Wechseljahre</em></h2>
          <p className="lp-lead">Hitzewallungen, Schlafprobleme, Stimmungsschwankungen, Brain Fog: Viele Frauen erleben die Wechseljahre, ohne zu wissen, was gerade in ihrem Körper passiert und was ihnen wirklich hilft. Second Bloom soll das ändern.</p></div>
        <div className="lp-feat">
          {GOALS.map(([tone, t, x]) => <div key={t} className={`lp-card lp-${tone}`}><span className="lp-dot" /><h3>{t}</h3><p className="small muted">{x}</p></div>)}
        </div>
      </section>

      <section className="lp-section">
        <div className="lp-head"><span className="eyebrow">Was geplant ist</span><h2>Eine Begleiterin für <em>jeden Tag</em></h2>
          <p className="lp-lead">Jeden Tag ein kurzer Check-in, daraus ein passender Plan für Essen, Bewegung und Kopf. Dazu Wissen, das du verstehst, und dein Verlauf über die Wochen.</p></div>
        <div className="lp-feat">
          {PLANNED.map(([tone, t, x]) => <div key={t} className={`lp-card lp-${tone}`}><span className="lp-dot" /><h3>{t}</h3><p className="small muted">{x}</p></div>)}
        </div>
      </section>

      <section className="lp-section lp-about" id="sara">
        <img src="/sara.webp?v=3" alt="Sara Casellini-Machado Sousa" className="lp-photo" width={360} height={360} />
        <div className="stack" style={{ gap: 14 }}>
          <span className="eyebrow">Hallo, ich bin Sara</span>
          <h2>Sara Casellini-<wbr />Machado Sousa</h2>
          <p className="lp-role">Fachärztin für Gynäkologie und Geburtshilfe</p>
          <p>Ich bin Sara, Fachärztin für Gynäkologie und Geburtshilfe. Geboren bin ich in Lissabon, aufgewachsen in Basel, wo ich auch Medizin studiert habe. Meine Ausbildung zur Fachärztin habe ich in Grabs und Chur gemacht. Heute lebe ich mit meinem Mann und unseren zwei Kindern in Liechtenstein und arbeite seit 2023 in der Praxis Gynorina in Buchs.</p>
          <p>In meiner Sprechstunde erlebe ich jeden Tag, wie viele Fragen die Wechseljahre mit sich bringen und wie wenig Zeit oft bleibt, sie in Ruhe zu beantworten. Mit Second Bloom möchte ich dich auch zwischen den Terminen begleiten: mit Wissen, das du verstehst, mit kleinen Schritten, die in deinen Alltag passen, und mit dem Gefühl, mit diesen Veränderungen nicht allein zu sein.</p>
          <blockquote className="lp-cite">„Mir ist wichtig, dich auf deinem ganz persönlichen Weg zu begleiten: ehrlich, fundiert und mit viel Vertrauen.“</blockquote>
          <p className="small muted">Ich berate auf Deutsch, Portugiesisch, Englisch, Spanisch und Französisch. Deshalb wird auch Second Bloom diese fünf Sprachen sprechen.</p>
          <div className="chips" translate="no">{LANGS.map((l) => <span key={l} className="lp-chip">{l}</span>)}</div>
          <p className="lp-sign">Herzlich, Sara</p>
        </div>
      </section>

      <section className="lp-section lp-wait" id="warteliste">
        <div className="lp-head"><span className="eyebrow">Warteliste</span><h2>Sei von Anfang an <em>dabei</em></h2>
          <p className="lp-lead">Trag dich ein, und wir sagen dir Bescheid, sobald Second Bloom startet. Nur diese eine Nachricht, kein Newsletter.</p></div>
        <Form action={joinWaitlist} submit="Auf die Warteliste" kind="accent block" className="form lp-form">
          <div className="row2">
            <label>Vorname (optional)<input type="text" name="name" autoComplete="given-name" maxLength={60} /></label>
            <label>E-Mail<input type="email" name="email" autoComplete="email" required maxLength={200} /></label>
          </div>
          <label className="lp-hp" aria-hidden="true">Website<input type="text" name="website" tabIndex={-1} autoComplete="off" /></label>
          <label className="check"><input type="checkbox" name="consent" /> <span>Ich möchte per E-Mail informiert werden, wenn Second Bloom startet. Ich habe die <Link href="/datenschutz#warteliste" target="_blank">Datenschutzerklärung</Link> gelesen und kann mich jederzeit wieder austragen.</span></label>
        </Form>
        <p className="small muted" style={{ textAlign: "center" }}><Link href="/warteliste/abmelden">Von der Warteliste austragen</Link></p>
      </section>

      <section className="lp-section lp-trust">
        {[
          ["Fundiert", "Empfehlungen zu Nährstoffen und Supplements mit Evidenzstufe und Quellen aus Studien und Leitlinien."],
          ["Privat", "Deine Daten gehören dir: geschützt gespeichert, keine Werbung, kein Verkauf, jederzeit löschbar."],
          ["Ehrlich", "Second Bloom ersetzt keine ärztliche Beratung. Die App hilft dir, gut informiert ins Gespräch zu gehen."],
        ].map(([t, x]) => <div key={t}><h3>{t}</h3><p className="small muted">{x}</p></div>)}
      </section>
    </SiteShell>
  );
}
