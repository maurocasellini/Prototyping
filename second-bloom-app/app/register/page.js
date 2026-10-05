import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import AuthLayout from "@/components/AuthLayout";
import Form from "@/components/Form";
import { register } from "../actions";

export default function Register() {
  return (
    <SiteShell>
      <AuthLayout>
        <div className="stack"><span className="eyebrow">Second Bloom</span><h1>Konto <em>erstellen</em></h1></div>
        <Form action={register} submit="Konto erstellen" kind="accent block">
          <label>Vorname<input type="text" name="name" autoComplete="given-name" required /></label>
          <label>E-Mail<input type="text" name="email" autoComplete="email" inputMode="email" required /></label>
          <label>Passwort, mindestens 8 Zeichen<input type="password" name="password" autoComplete="new-password" minLength={8} required /></label>
          <label className="check"><input type="checkbox" name="adult" /> <span>Ich bin mindestens 18 Jahre alt.</span></label>
          <label className="check"><input type="checkbox" name="privacy" /> <span>Ich habe die <Link href="/datenschutz" target="_blank">Datenschutzerklärung</Link> gelesen.</span></label>
          <label className="check"><input type="checkbox" name="consent" /> <span><b>Einwilligung Gesundheitsdaten (Pflicht):</b> Ich willige ausdrücklich ein, dass Second Bloom meine Gesundheitsdaten (Check-ins, Symptome, Zyklus, Ernährung, Training, Tagebuch und, falls verbunden, Werte meiner Uhr) speichert und auswertet, um mir persönliche Empfehlungen zu geben (Art. 9 Abs. 2 lit. a DSGVO, Art. 6 Abs. 7 DSG). Ich kann diese Einwilligung jederzeit widerrufen.</span></label>
          <label className="check"><input type="checkbox" name="consent_ai" /> <span><b>KI-Funktionen (freiwillig):</b> Für Rezeptvorschläge, Wochenpläne und die Tageseinordnung darf ein knapper Auszug meiner Angaben ohne Name und E-Mail an Anthropic (USA) gesendet werden. Kann ich jederzeit unter Konto ausschalten.</span></label>
        </Form>
        <p className="small muted">Schon ein Konto? <Link href="/login">Anmelden</Link></p>
      </AuthLayout>
    </SiteShell>
  );
}
