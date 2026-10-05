import SiteShell from "@/components/SiteShell";

export default function Datenschutz() {
  return (
    <SiteShell narrow>
      <div className="stack"><span className="eyebrow">Entwurf für den Prototyp</span><h1>Datenschutz</h1></div>
      <div className="card">
        <p className="small"><b>Was gespeichert wird:</b> Name, E-Mail, Passwort (nur als sicherer Hash), deine Einträge in der App (Check-ins, Ernährung, Training, Tagebuch, Zyklus) und, wenn du eine Uhr verbindest, Tageswerte wie Schlaf, HRV, Ruhepuls, Schritte und Zyklusphase.</p>
        <p className="small"><b>Wo:</b> In einem privaten Speicher bei Vercel. Schlüssel zu verbundenen Diensten werden verschlüsselt abgelegt (AES-256).</p>
        <p className="small"><b>KI:</b> Für Rezeptvorschläge, Wochenpläne und die Tageseinordnung wird ein knapper Auszug an die Claude-API von Anthropic gesendet, ohne Name und E-Mail. Fotos werden nur für den einen Vorschlag verwendet und nicht gespeichert.</p>
        <p className="small"><b>Deine Rechte:</b> Unter Konto kannst du alle Daten als Datei herunterladen und dein Konto mit allen Daten endgültig löschen.</p>
        <p className="small muted">Vor einem öffentlichen Start muss dieser Text rechtlich geprüft werden (DSG Schweiz, DSGVO, Liechtenstein), inklusive Hosting-Region und Auftragsverarbeitung.</p>
      </div>
    </SiteShell>
  );
}
