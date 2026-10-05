import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import Form from "@/components/Form";
import { register } from "../actions";

export default function Register() {
  return (
    <SiteShell narrow>
      <div className="stack"><span className="eyebrow">Second Bloom</span><h1>Konto <em>erstellen</em></h1></div>
      <Form action={register} submit="Konto erstellen" kind="accent block">
        <label>Vorname<input type="text" name="name" autoComplete="given-name" required /></label>
        <label>E-Mail<input type="text" name="email" autoComplete="email" inputMode="email" required /></label>
        <label>Passwort (mindestens 8 Zeichen)<input type="password" name="password" autoComplete="new-password" minLength={8} required /></label>
        <label className="check"><input type="checkbox" name="consent" /> <span>Ich willige ein, dass Second Bloom meine Gesundheitsdaten (Check-ins, Zyklus, Werte meiner Uhr) speichert und für meine persönlichen Empfehlungen auswertet. Details unter <Link href="/datenschutz">Datenschutz</Link>. Ich kann alles jederzeit exportieren und löschen.</span></label>
      </Form>
      <p className="small muted">Schon ein Konto? <Link href="/login">Anmelden</Link></p>
    </SiteShell>
  );
}
