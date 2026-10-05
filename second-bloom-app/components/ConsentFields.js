import Link from "next/link";

// Pflicht-Häkchen bei Registrierung und bei der Bestätigung nach dem Login (neue Fassung der Datenschutzerklärung)
export default function ConsentFields({ adult = false }) {
  return (
    <>
      {adult && <label className="check"><input type="checkbox" name="adult" /> <span>Ich bin mindestens 18 Jahre alt.</span></label>}
      <label className="check"><input type="checkbox" name="privacy" /> <span>Ich habe die <Link href="/datenschutz" target="_blank">Datenschutzerklärung</Link> gelesen und akzeptiere sie.</span></label>
      <label className="check"><input type="checkbox" name="consent" /> <span><b>Einwilligung Gesundheitsdaten:</b> Ich willige ausdrücklich ein, dass Second Bloom meine Gesundheitsdaten (Check-ins, Symptome, Zyklus, Ernährung, Training, Tagebuch und, falls verbunden, Werte meiner Uhr) speichert und auswertet, um mir persönliche Empfehlungen zu geben. Für KI-Vorschläge (Rezepte, Wochenpläne, Tageseinordnung) wird dazu ein knapper Auszug ohne Name und E-Mail an Anthropic (USA) gesendet (Art. 9 Abs. 2 lit. a und Art. 49 Abs. 1 lit. a DSGVO, Art. 6 Abs. 7 DSG). Ich kann diese Einwilligung jederzeit widerrufen und die KI-Funktionen unter Konto separat ausschalten.</span></label>
      <label className="check"><input type="checkbox" name="medical" /> <span>Ich habe verstanden, dass Second Bloom keine ärztliche Beratung ersetzt. Fragen zu Hormonen, Medikamenten und Nahrungsergänzung bespreche ich mit Ärztin, Arzt oder Apotheke.</span></label>
    </>
  );
}
