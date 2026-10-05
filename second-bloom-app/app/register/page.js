import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import AuthLayout from "@/components/AuthLayout";
import Form from "@/components/Form";
import ConsentFields from "@/components/ConsentFields";
import { register } from "../actions";
import { PHASE_OPTS, GOAL_OPTS, DIET_OPTS, INTOL_OPTS, COUNTRY_OPTS, LANG_OPTS } from "@/lib/profile";

export const metadata = { title: "Konto erstellen · Second Bloom" };

export default function Register() {
  return (
    <SiteShell>
      <AuthLayout>
        <div className="stack"><span className="eyebrow">Second Bloom</span><h1>Konto <em>erstellen</em></h1><p className="small muted">Mit diesen Angaben ist die App sofort auf dich eingestellt. Felder ohne «optional» sind nötig.</p></div>
        <Form action={register} submit="Konto erstellen" kind="accent block">
          <fieldset className="fs"><legend>Zugang</legend>
            <div className="row2">
              <label>Vorname<input type="text" name="name" autoComplete="given-name" required /></label>
              <label>Nachname (optional)<input type="text" name="lastname" autoComplete="family-name" /></label>
            </div>
            <label>E-Mail<input type="text" name="email" autoComplete="email" inputMode="email" required /></label>
            <div className="row2">
              <label>Passwort, mind. 8 Zeichen<input type="password" name="password" autoComplete="new-password" minLength={8} required /></label>
              <label>Passwort wiederholen<input type="password" name="password2" autoComplete="new-password" minLength={8} required /></label>
            </div>
          </fieldset>
          <fieldset className="fs"><legend>Über dich</legend>
            <div className="row2">
              <label>Geburtsdatum<input type="date" name="birth" required max={new Date().toISOString().slice(0, 10)} /></label>
              <label>Land<select name="country" defaultValue="CH">{COUNTRY_OPTS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select></label>
            </div>
            <div className="row2">
              <label>Grösse in cm (optional)<input type="number" name="height" min={120} max={220} inputMode="numeric" /></label>
              <label>Gewicht in kg (optional)<input type="number" name="weight" min={35} max={250} inputMode="numeric" /></label>
            </div>
            <p className="small muted">Das Gewicht dient nur deinem Proteinziel (1,4 g pro kg). Ohne Angabe rechnen wir mit 68 kg.</p>
            <label>Sprache<select name="lang" defaultValue="de">{LANG_OPTS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select></label>
          </fieldset>
          <fieldset className="fs"><legend>Deine Phase</legend>
            <div className="opts">{PHASE_OPTS.map(([k, n, d]) => <label key={k} className="opt"><input type="radio" name="phase" value={k} required /> <span><b>{n}</b><small>{d}</small></span></label>)}</div>
          </fieldset>
          <fieldset className="fs"><legend>Was dir gerade wichtig ist (optional)</legend>
            <div className="chips">{GOAL_OPTS.map((g) => <label key={g} className="chipc"><input type="checkbox" name="goals" value={g} /><span>{g}</span></label>)}</div>
          </fieldset>
          <fieldset className="fs"><legend>Essen</legend>
            <div className="row2">
              <label>Ernährungsweise<select name="diet" defaultValue="all">{DIET_OPTS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select></label>
              <label>Für wie viele Personen kochst du?<input type="number" name="household" min={1} max={8} defaultValue={2} inputMode="numeric" /></label>
            </div>
            <span className="small muted">Unverträglichkeiten oder was du nicht isst (optional)</span>
            <div className="chips">{INTOL_OPTS.map(([k, l]) => <label key={k} className="chipc"><input type="checkbox" name="avoid" value={k} /><span>{l}</span></label>)}</div>
          </fieldset>
          <fieldset className="fs"><legend>Einwilligungen</legend>
            <ConsentFields />
          </fieldset>
        </Form>
        <p className="small muted">Schon ein Konto? <Link href="/login">Anmelden</Link></p>
      </AuthLayout>
    </SiteShell>
  );
}
