// Datenschutzerklärung, deutsche Fassung (massgeblich). Übersetzungen: en.js, fr.js, es.js, pt.js
import Link from "next/link";
import { PRIVACY_VERSION, PRIVACY_DATE } from "@/lib/privacy";

// Platzhalter für Angaben, die die Betreiberin vor dem Start ergänzen muss
const P = ({ children }) => <span className="ph">{children}</span>;

const TOC = [
  ["kurz", "Das Wichtigste in Kürze"],
  ["verantwortlich", "Verantwortliche Stelle"],
  ["recht", "Anwendbares Recht"],
  ["daten", "Welche Daten wir verarbeiten"],
  ["zwecke", "Zwecke und Rechtsgrundlagen"],
  ["einwilligung", "Einwilligung und Widerruf"],
  ["gesundheit", "Gesundheitsdaten"],
  ["geraete", "Verbundene Uhren und Ringe"],
  ["ki", "KI-Funktionen"],
  ["videos", "Übungsvideos (YouTube)"],
  ["auswertung", "Automatische Auswertungen"],
  ["empfaenger", "Empfänger und Auftragsverarbeiter"],
  ["drittland", "Übermittlung in Drittländer"],
  ["dauer", "Speicherdauer"],
  ["cookies", "Cookies und lokale Speicherung"],
  ["demo", "Demo ohne Konto"],
  ["sicherheit", "Datensicherheit"],
  ["rechte", "Deine Rechte"],
  ["beschwerde", "Beschwerde bei einer Aufsichtsbehörde"],
  ["pflicht", "Pflicht zur Angabe von Daten"],
  ["alter", "Mindestalter"],
  ["werbung", "Keine Werbung, kein Verkauf, kein Tracking"],
  ["medizin", "Kein Medizinprodukt"],
  ["aenderungen", "Änderungen dieser Erklärung"],
];

export default function PrivacyDE() {
  return (
      <div className="doc">
        <nav className="doc-toc" aria-label="Inhalt">
          <span className="eyebrow">Inhalt</span>
          <ol style={{ marginTop: 12 }}>{TOC.map(([id, t], i) => <li key={id}><a href={`#${id}`}>{i + 1}. {t}</a></li>)}</ol>
        </nav>
        <article className="doc-body">
          <div className="stack" style={{ gap: 6 }}>
            <span className="eyebrow">Fassung {PRIVACY_VERSION}</span>
            <h1>Datenschutz<em>erklärung</em></h1>
            <p className="muted small">Stand: {PRIVACY_DATE}. Diese Erklärung informiert dich nach Art. 13 und 14 der Datenschutz-Grundverordnung (DSGVO), Art. 19 ff. des Schweizer Datenschutzgesetzes (DSG) und dem Liechtensteiner Datenschutzgesetz darüber, wie Second Bloom deine Personendaten bearbeitet.</p>
          </div>

          <h2 id="kurz">1. Das Wichtigste in Kürze</h2>
          <div className="card flat">
            <ul>
              <li>Second Bloom verarbeitet <b>Gesundheitsdaten</b>. Das tun wir nur mit deiner <b>ausdrücklichen Einwilligung</b> und nur, um dir persönliche Empfehlungen zu geben.</li>
              <li>Server und Datenspeicher stehen in der <b>EU (Frankfurt am Main)</b>. Betreiber der Infrastruktur ist ein US-Unternehmen, siehe Abschnitt 12 und 13.</li>
              <li>Die <b>KI-Funktionen</b> sind standardmässig eingeschaltet und lassen sich unter Konto jederzeit ausschalten. Dabei geht ein knapper Auszug ohne Name und E-Mail an Anthropic.</li>
              <li><b>Keine Werbung, kein Verkauf von Daten, kein Tracking</b>, keine Analyse-Werkzeuge von Dritten.</li>
              <li>Du kannst jederzeit <b>alle Daten herunterladen</b> und dein <b>Konto mit allen Daten sofort löschen</b> (unter <Link href="/konto">Konto</Link>).</li>
            </ul>
          </div>

          <h2 id="verantwortlich">2. Verantwortliche Stelle</h2>
          <p>Verantwortlich für die Datenbearbeitung im Sinne von Art. 4 Nr. 7 DSGVO und Art. 5 lit. j DSG ist:</p>
          <p><P>Name bzw. Firma</P><br /><P>Strasse und Nummer</P><br /><P>PLZ, Ort, Land</P><br />E-Mail: <P>datenschutz@…</P></p>
          <p>Für alle Fragen zum Datenschutz und zur Ausübung deiner Rechte erreichst du uns unter der oben genannten E-Mail-Adresse. <P>Falls ein Datenschutzbeauftragter benannt ist: Name und Kontakt ergänzen.</P> <P>Falls die verantwortliche Stelle ihren Sitz ausserhalb des EWR hat und Personen im EWR anspricht: Vertreter in der EU nach Art. 27 DSGVO ergänzen.</P></p>

          <h2 id="recht">3. Anwendbares Recht</h2>
          <p>Wir richten uns nach der <b>DSGVO</b>, die im gesamten Europäischen Wirtschaftsraum gilt, also auch in Liechtenstein, sowie nach dem <b>Liechtensteiner Datenschutzgesetz</b>. Für Personen in der Schweiz gilt zusätzlich das <b>Schweizer Datenschutzgesetz (DSG)</b> mit der Datenschutzverordnung (DSV). Begriffe wie „Personendaten“ (DSG) und „personenbezogene Daten“ (DSGVO) verwenden wir gleichbedeutend.</p>

          <h2 id="daten">4. Welche Daten wir verarbeiten</h2>
          <div className="scroll-x"><table className="t"><thead><tr><th>Kategorie</th><th>Beispiele</th><th>Herkunft</th></tr></thead><tbody>
            <tr><td>Kontodaten</td><td>Vorname, Nachname (freiwillig), E-Mail-Adresse, Passwort (nur als bcrypt-Hash, nie im Klartext), Rolle, Erstelldatum</td><td>von dir bei der Registrierung</td></tr>
            <tr><td>Einwilligungen</td><td>Zeitpunkt, Art und Fassung deiner Einwilligungen und deiner Zustimmung zur Datenschutzerklärung, Bestätigung des Hinweises, dass die App keine ärztliche Beratung ersetzt</td><td>von dir</td></tr>
            <tr><td>Profilangaben</td><td>Geburtsdatum (daraus berechnet: Alter und Prüfung des Mindestalters), Land, Sprache, Körpergrösse, Gewicht, Taillenumfang und Angabe zu regelmässigem Krafttraining (freiwillig), Phase (Perimenopause, Menopause …), Ziele, Haushaltsgrösse, Ernährungsweise, Vorlieben und Abneigungen beim Essen</td><td>von dir bei der Registrierung und in der App</td></tr>
            <tr><td><b>Gesundheitsdaten</b></td><td>Check-ins zu Stimmung, Energie, Schlaf und Konzentration, Symptome wie Hitzewallungen oder Nachtschweiss, Periode und Blutungen, Unverträglichkeiten (z. B. Laktose, Gluten, Histamin), eingenommene Nahrungsergänzungen, Trainings, Protein- und Wasserprotokoll, Tagebucheinträge, abgeschlossene Übungen und Coaching-Einheiten</td><td>von dir in der App</td></tr>
            <tr><td><b>Gerätewerte</b> (Gesundheitsdaten)</td><td>Schlafdauer und -wert, HRV, Ruhepuls, Puls im Schlaf, SpO2, Atemfrequenz, Stress, Schritte, Gewicht, Aktivitätsminuten und -kalorien, Zyklusphase</td><td>von intervals.icu, nur wenn du eine Uhr verbindest</td></tr>
            <tr><td>Zugangsdaten zu intervals.icu</td><td>Athleten-ID und persönlicher API-Schlüssel (verschlüsselt)</td><td>von dir</td></tr>
            <tr><td>KI-Anfragen</td><td>Zutatenliste, Mahlzeit, Personenzahl, Ernährungsweise, Foto vom Kühlschrank, Wünsche zum Wochenplan, Kurzfassung von Check-in und Gerätewerten</td><td>von dir, nur bei eingeschalteter KI</td></tr>
            <tr><td>Nutzungs- und Sicherheitsdaten</td><td>Anzahl KI-Aufrufe pro Tag, Kosten pro Monat (ohne Inhalte), technische Protokolle unseres Hosters (z. B. IP-Adresse, Zeitpunkt, aufgerufene Adresse, Fehlermeldungen)</td><td>entstehen bei der Nutzung</td></tr>
          </tbody></table></div>

          <h2 id="zwecke">5. Zwecke und Rechtsgrundlagen</h2>
          <div className="scroll-x"><table className="t"><thead><tr><th>Zweck</th><th>Daten</th><th>Rechtsgrundlage</th></tr></thead><tbody>
            <tr><td>Konto bereitstellen, Anmeldung, Passwort ändern</td><td>Kontodaten</td><td>Vertrag, Art. 6 Abs. 1 lit. b DSGVO</td></tr>
            <tr><td>Persönliche Empfehlungen: Tagesplan, Training, Ernährung, Übungen, Verlauf, Bericht fürs Arztgespräch</td><td>Profil, Gesundheitsdaten, Gerätewerte</td><td>ausdrückliche Einwilligung, Art. 9 Abs. 2 lit. a und Art. 6 Abs. 1 lit. a DSGVO, Art. 6 Abs. 7 lit. a DSG</td></tr>
            <tr><td>Uhr verbinden und täglich abgleichen</td><td>Zugangsdaten, Gerätewerte</td><td>ausdrückliche Einwilligung wie oben, Vertrag für die Funktion</td></tr>
            <tr><td>KI-Vorschläge</td><td>KI-Anfragen</td><td>Einwilligung bei der Registrierung, jederzeit separat abschaltbar, Art. 9 Abs. 2 lit. a und Art. 49 Abs. 1 lit. a DSGVO, soweit für die Übermittlung nötig</td></tr>
            <tr><td>Nachweis der Einwilligungen</td><td>Einwilligungsprotokoll</td><td>rechtliche Pflicht, Art. 6 Abs. 1 lit. c i. V. m. Art. 7 Abs. 1 DSGVO</td></tr>
            <tr><td>Sicherheit, Missbrauchsschutz, Kostenbegrenzung der KI, Fehlerbehebung</td><td>Nutzungs- und Sicherheitsdaten</td><td>berechtigtes Interesse an einem sicheren, bezahlbaren Betrieb, Art. 6 Abs. 1 lit. f DSGVO</td></tr>
            <tr><td>Erfüllung gesetzlicher Pflichten, Durchsetzung von Ansprüchen</td><td>soweit nötig</td><td>Art. 6 Abs. 1 lit. c und f DSGVO, Art. 9 Abs. 2 lit. f DSGVO</td></tr>
          </tbody></table></div>
          <p>Wir verwenden deine Daten nicht für andere Zwecke. Eine Weiterverarbeitung zu einem neuen Zweck würden wir dir vorher mitteilen und, wo nötig, deine Einwilligung einholen.</p>

          <h2 id="einwilligung">6. Einwilligung und Widerruf</h2>
          <p>Bei der Registrierung bitten wir dich um eine ausdrückliche <b>Einwilligung zu den Gesundheitsdaten</b>, ohne die die App ihre Aufgabe nicht erfüllen kann. Sie umfasst ausdrücklich auch die KI-Funktionen und die dafür nötige Übermittlung an Anthropic. Die KI-Funktionen kannst du unter Konto jederzeit separat ausschalten, ohne die übrige App zu verlieren. Wir speichern Zeitpunkt, Art und Fassung jeder Einwilligung, um sie nachweisen zu können.</p>
          <p>Du kannst jede Einwilligung <b>jederzeit mit Wirkung für die Zukunft widerrufen</b> (Art. 7 Abs. 3 DSGVO). Die KI schaltest du unter <Link href="/konto">Konto</Link> mit einem Klick aus. Die Einwilligung zu den Gesundheitsdaten widerrufst du, indem du dein Konto löschst oder uns schreibst. Dann löschen wir deine Gesundheitsdaten. Die Rechtmässigkeit der bis dahin erfolgten Verarbeitung bleibt unberührt.</p>

          <h2 id="gesundheit">7. Gesundheitsdaten</h2>
          <p>Gesundheitsdaten gehören zu den besonderen Kategorien personenbezogener Daten (Art. 9 DSGVO) bzw. zu den besonders schützenswerten Personendaten (Art. 5 lit. c DSG). Wir behandeln sie entsprechend: Sie werden nur für deine eigenen Empfehlungen ausgewertet, nicht mit anderen Konten verknüpft, nicht an Dritte zu deren eigenen Zwecken weitergegeben und nicht für Werbung genutzt. Verwalterinnen der App (Admin) sehen in der Verwaltungsoberfläche nur Name, E-Mail, Rolle und Erstelldatum, nicht deine Einträge. Ein Zugriff auf Inhalte erfolgt nur, soweit er für Betrieb, Sicherheit oder Fehlerbehebung zwingend nötig ist oder du darum bittest.</p>

          <h2 id="geraete">8. Verbundene Uhren und Ringe</h2>
          <p>Wenn du eine Uhr oder einen Ring verbindest, ruft Second Bloom die Tageswerte über den Dienst <b>intervals.icu</b> ab. intervals.icu ist ein eigenständiger Dienst, mit dem du selbst ein Konto führst und mit dem du Garmin, Oura, WHOOP, Polar oder andere Hersteller verbindest. Für die Datenbearbeitung bei intervals.icu und bei deinem Gerätehersteller gelten deren eigene Datenschutzerklärungen.</p>
          <p>Wir speichern deinen API-Schlüssel <b>verschlüsselt (AES-256-GCM)</b> und rufen damit einmal täglich sowie auf deinen Wunsch die Werte der letzten Tage ab, beim ersten Verbinden die letzten 120 Tage. Wir übernehmen nur die in Abschnitt 4 genannten Gesundheitswerte, keine GPS-Daten, Strecken oder Trainingsdetails. Du kannst die Verbindung unter Konto jederzeit trennen und dabei alle gespeicherten Gerätewerte löschen.</p>

          <h2 id="ki">9. KI-Funktionen</h2>
          <p>Solange du die KI-Funktionen nicht ausgeschaltet hast (Standard: eingeschaltet), senden wir für die jeweilige Anfrage einen knappen Auszug an die Claude-API von <b>Anthropic</b>:</p>
          <ul>
            <li><b>Rezept aus Zutaten:</b> Zutaten, Mahlzeit, Zeit, Personenzahl, Ernährungsweise.</li>
            <li><b>Rezept aus Foto:</b> zusätzlich das Foto, vorher auf höchstens 1024 Pixel verkleinert. Wir speichern das Foto nicht. Achte bitte darauf, dass keine Personen oder persönlichen Unterlagen zu sehen sind.</li>
            <li><b>Wochenplan:</b> Phase, Haushaltsgrösse, Ernährungsweise, Proteinziel, deine Wünsche und die Liste unserer Rezepte.</li>
            <li><b>Tageseinordnung:</b> Phase, heutiger Check-in, eine Kurzfassung der Gerätewerte (Erholung, Gründe, unruhige Nacht, Zyklushinweis), heutiges Training, Abendessen und Proteinstand.</li>
          </ul>
          <p>Wir senden dabei <b>nie Name, E-Mail oder Kontokennung</b>. Anthropic verarbeitet die Daten als unser Auftragsverarbeiter. Nach den kommerziellen Bedingungen von Anthropic werden Eingaben über die API standardmässig nicht zum Training von KI-Modellen verwendet. Einzelheiten zur Aufbewahrung regelt die <a href="https://www.anthropic.com/legal/privacy" target="_blank" rel="noreferrer">Datenschutzerklärung von Anthropic</a>. Die Antworten der KI sind Vorschläge, keine medizinischen Empfehlungen. Die Tageseinordnung speichern wir in deinem Konto für 14 Tage.</p>
          <p>Ohne eingeschaltete KI nutzt die App ausschliesslich ihre eigene Rezeptsammlung und Regeln. Es werden dann keine Daten an Anthropic übermittelt.</p>

          <h2 id="videos">10. Übungsvideos (YouTube)</h2>
          <p>Zu den Übungen zeigen wir Anleitungsvideos von YouTube. Die Videos werden erst geladen, wenn du auf „Video ansehen“ tippst. Vorher wird keine Verbindung zu YouTube aufgebaut, auch keine Vorschaubilder. Wir binden die Videos im erweiterten Datenschutzmodus über <code>youtube-nocookie.com</code> ein.</p>
          <p>Sobald du ein Video startest, verbindet sich dein Browser direkt mit Servern von YouTube. Anbieter ist die Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland. Dabei erhält Google mindestens deine IP-Adresse, die aufgerufene Seite und technische Angaben zu deinem Gerät. Ein Zugriff durch die Google LLC in den USA ist möglich. YouTube kann beim Abspielen Daten in deinem Browser speichern. Rechtsgrundlage ist deine Einwilligung durch das Antippen (Art. 6 Abs. 1 lit. a DSGVO, § 25 Abs. 1 TDDDG für Personen in Deutschland). Es werden dabei keine Gesundheitsdaten an YouTube übermittelt, nur welche Übung du dir ansiehst. Details: <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">Datenschutzerklärung von Google</a>. Für die Inhalte der Videos sind die jeweiligen Kanäle verantwortlich.</p>

          <h2 id="auswertung">11. Automatische Auswertungen</h2>
          <p>Die App berechnet aus deinen Eingaben und Gerätewerten Hinweise, zum Beispiel einen Erholungswert von 0 bis 100 aus HRV, Ruhepuls und Schlaf im Vergleich zu deinen eigenen letzten 28 Tagen, Hinweise auf unruhige Nächte, die Länge deiner Zyklen oder Zusammenhänge wie „nach Trainingstagen schläfst du länger“. Diese Auswertungen laufen nach festen, nachvollziehbaren Regeln. Sie dienen nur deiner Information und haben <b>keine rechtliche Wirkung</b> und keine vergleichbar erhebliche Beeinträchtigung für dich. Eine automatisierte Entscheidung im Sinne von Art. 22 DSGVO bzw. Art. 21 DSG findet nicht statt.</p>

          <h2 id="empfaenger">12. Empfänger und Auftragsverarbeiter</h2>
          <p>Wir setzen folgende Dienstleister ein, die Daten in unserem Auftrag und nach unseren Weisungen bearbeiten (Art. 28 DSGVO, Art. 9 DSG). Mit ihnen bestehen Verträge zur Auftragsverarbeitung. <P>Abschluss der Auftragsverarbeitungsverträge (DPA) mit Vercel und Anthropic vor dem Start bestätigen.</P></p>
          <div className="scroll-x"><table className="t"><thead><tr><th>Empfänger</th><th>Aufgabe</th><th>Ort der Verarbeitung</th></tr></thead><tbody>
            <tr><td>Vercel Inc., USA</td><td>Hosting der App, Server-Funktionen, privater Datenspeicher (Vercel Blob), technische Protokolle</td><td>Server-Funktionen und Datenspeicher in Frankfurt am Main (EU). Auslieferung über das weltweite Netz von Vercel. <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noreferrer">Datenschutz Vercel</a></td></tr>
            <tr><td>Google Ireland Ltd. (YouTube)</td><td>Abspielen von Übungsvideos, nur nach deinem Klick; eigenständig verantwortlich</td><td>EU und USA. <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">Datenschutz Google</a></td></tr>
            <tr><td>Anthropic, USA</td><td>KI-Vorschläge (nur bei eingeschalteter KI)</td><td>USA. <a href="https://www.anthropic.com/legal/privacy" target="_blank" rel="noreferrer">Datenschutz Anthropic</a></td></tr>
          </tbody></table></div>
          <p><b>intervals.icu</b> ist kein Auftragsverarbeiter von uns, sondern ein Dienst, den du selbst nutzt. Wir rufen dort mit deinem Schlüssel deine Werte ab. Schriften werden von unserem eigenen Server ausgeliefert, es findet keine Verbindung zu Google statt. Darüber hinaus geben wir Daten nur weiter, wenn wir gesetzlich dazu verpflichtet sind, etwa auf behördliche Anordnung.</p>

          <h2 id="drittland">13. Übermittlung in Drittländer</h2>
          <p>Vercel und Anthropic haben ihren Sitz in den USA. Ein Zugriff aus den USA, etwa für Wartung, und die Verarbeitung der KI-Anfragen in den USA sind daher möglich. Die Übermittlung stützt sich, soweit der jeweilige Anbieter unter dem <b>EU-US Data Privacy Framework</b> und der <b>Swiss-US-Erweiterung</b> zertifiziert ist, auf den Angemessenheitsbeschluss der EU-Kommission (Art. 45 DSGVO) bzw. die Anerkennung durch den Bundesrat (Art. 16 Abs. 1 DSG). Andernfalls verwenden wir die <b>EU-Standardvertragsklauseln</b> (Art. 46 Abs. 2 lit. c DSGVO, Art. 16 Abs. 2 lit. d DSG) mit den für die Schweiz nötigen Anpassungen. Für die KI-Funktionen stützt sich die Übermittlung zusätzlich auf deine ausdrückliche Einwilligung (Art. 49 Abs. 1 lit. a DSGVO, Art. 17 Abs. 1 lit. a DSG). Eine Kopie der Garantien kannst du bei uns anfordern. <P>Zertifizierungsstatus der Anbieter beim Start prüfen und hier eintragen.</P></p>

          <h2 id="dauer">14. Speicherdauer</h2>
          <div className="scroll-x"><table className="t"><thead><tr><th>Daten</th><th>Wie lange</th></tr></thead><tbody>
            <tr><td>Kontodaten, Profil, App-Einträge</td><td>bis du dein Konto löschst; dann sofort und vollständig</td></tr>
            <tr><td>Gerätewerte</td><td>höchstens die letzten 400 Tage (ältere werden automatisch entfernt), bei Trennung auf Wunsch sofort, bei Kontolöschung sofort</td></tr>
            <tr><td>Zugangsdaten intervals.icu</td><td>bis du die Verbindung trennst oder dein Konto löschst</td></tr>
            <tr><td>Tageseinordnung der KI</td><td>die letzten 14 Tage</td></tr>
            <tr><td>Fotos für KI-Rezepte</td><td>bei uns gar nicht; nur für die eine Anfrage übermittelt</td></tr>
            <tr><td>Einwilligungsprotokoll</td><td>solange dein Konto besteht; danach nur, soweit wir es zum Nachweis rechtlich brauchen</td></tr>
            <tr><td>KI-Aufrufzähler je Konto</td><td>ein Tag</td></tr>
            <tr><td>KI-Kosten je Monat (ohne Inhalte, ohne Personenbezug)</td><td>12 Monate</td></tr>
            <tr><td>Anmelde-Cookie</td><td>60 Tage oder bis zur Abmeldung</td></tr>
            <tr><td>Technische Protokolle des Hosters</td><td>kurzfristig nach den Vorgaben von Vercel</td></tr>
          </tbody></table></div>
          <p>Gesetzliche Aufbewahrungspflichten bleiben vorbehalten. Wir führen keine eigenen Sicherungskopien deiner Gesundheitsdaten.</p>

          <h2 id="cookies">15. Cookies und lokale Speicherung</h2>
          <p>Wir verwenden genau <b>drei Cookies</b>. <code>sb_session</code> hält dich angemeldet (60 Tage); es ist signiert, für Skripte nicht lesbar (httpOnly) und wird nur über verschlüsselte Verbindungen gesendet. <code>sb_lang</code> speichert nur die gewählte Sprache der Oberfläche (de, en, fr, es oder pt, 1 Jahr). <code>sb_cookie_ok</code> merkt sich, dass du den Cookie-Hinweis gesehen hast (1 Jahr). Alle drei sind für die von dir gewünschte Funktion technisch notwendig; dafür ist keine Einwilligung nötig (Art. 5 Abs. 3 der ePrivacy-Richtlinie, Art. 45c FMG). Wir setzen keine Analyse-, Werbe- oder Tracking-Cookies und keine Pixel von Dritten ein. Erst wenn du ein Übungsvideo startest, kann YouTube eigene Daten in deinem Browser ablegen (siehe Abschnitt 10).</p>

          <h2 id="demo">16. Demo ohne Konto</h2>
          <p>In der öffentlichen <Link href="/demo">Demo</Link> speichern wir nichts auf unserem Server. Deine Eingaben bleiben im lokalen Speicher deines Browsers, bis du sie dort löschst. Die Gerätewerte in der Demo sind erfundene Beispieldaten. Nutzt du in der Demo eine KI-Funktion, gilt Abschnitt 9 sinngemäss. Wir empfehlen, in der Demo keine echten Gesundheitsangaben einzugeben.</p>

          <h2 id="sicherheit">17. Datensicherheit</h2>
          <p>Wir treffen technische und organisatorische Massnahmen nach Art. 32 DSGVO und Art. 8 DSG, unter anderem:</p>
          <ul>
            <li>Verschlüsselte Übertragung (HTTPS/TLS) für alle Verbindungen.</li>
            <li>Passwörter nur als bcrypt-Hash; API-Schlüssel mit AES-256-GCM verschlüsselt.</li>
            <li>Privater Datenspeicher ohne öffentliche Adressen, getrennt pro Konto.</li>
            <li>Signierte Sitzungen, die bei einer Passwortänderung ungültig werden.</li>
            <li>Rollenkonzept: Verwalterinnen sehen keine Gesundheitsdaten in der Oberfläche; das Start-Konto der Verwaltung wird gesperrt, sobald eine Verwalterin ein eigenes Passwort hat.</li>
            <li>Datensparsamkeit bei der KI: nur nötige Felder, keine Namen, Fotos verkleinert und nicht gespeichert.</li>
            <li>Server-Funktionen und Datenspeicher in der EU.</li>
          </ul>
          <p>Kommt es trotzdem zu einer Verletzung des Schutzes deiner Daten, melden wir sie der zuständigen Aufsichtsbehörde und informieren dich, wenn dies gesetzlich vorgesehen ist (Art. 33 und 34 DSGVO, Art. 24 DSG).</p>

          <h2 id="rechte">18. Deine Rechte</h2>
          <ul>
            <li><b>Auskunft</b> über deine gespeicherten Daten (Art. 15 DSGVO, Art. 25 DSG). Am schnellsten über den Export unter Konto.</li>
            <li><b>Berichtigung</b> unrichtiger Daten (Art. 16 DSGVO, Art. 32 DSG). Die meisten Angaben änderst du direkt in der App.</li>
            <li><b>Löschung</b> (Art. 17 DSGVO, Art. 32 DSG). Mit „Konto löschen“ werden alle Daten sofort entfernt.</li>
            <li><b>Einschränkung der Verarbeitung</b> (Art. 18 DSGVO).</li>
            <li><b>Datenübertragbarkeit</b> (Art. 20 DSGVO, Art. 28 DSG): Export als maschinenlesbare JSON-Datei unter Konto.</li>
            <li><b>Widerspruch</b> gegen Verarbeitungen auf Grundlage berechtigter Interessen (Art. 21 DSGVO, Art. 30 Abs. 2 lit. b DSG).</li>
            <li><b>Widerruf</b> von Einwilligungen jederzeit mit Wirkung für die Zukunft (siehe Abschnitt 6).</li>
          </ul>
          <p>Für alle Anliegen genügt eine E-Mail an <P>datenschutz@…</P>. Wir antworten in der Regel innerhalb eines Monats und können zur Sicherheit einen Nachweis verlangen, dass du die betroffene Person bist.</p>

          <h2 id="beschwerde">19. Beschwerde bei einer Aufsichtsbehörde</h2>
          <p>Du hast das Recht, dich bei einer Datenschutz-Aufsichtsbehörde zu beschweren (Art. 77 DSGVO), insbesondere in deinem Wohnsitzland. Zuständig sind zum Beispiel:</p>
          <ul>
            <li>Liechtenstein: Datenschutzstelle Liechtenstein, Vaduz, <a href="https://www.datenschutzstelle.li" target="_blank" rel="noreferrer">datenschutzstelle.li</a></li>
            <li>Schweiz: Eidgenössischer Datenschutz- und Öffentlichkeitsbeauftragter (EDÖB), Bern, <a href="https://www.edoeb.admin.ch" target="_blank" rel="noreferrer">edoeb.admin.ch</a></li>
            <li>Deutschland und Österreich: die Aufsichtsbehörde deines Bundeslandes bzw. die österreichische Datenschutzbehörde</li>
          </ul>

          <h2 id="pflicht">20. Pflicht zur Angabe von Daten</h2>
          <p>Für ein Konto brauchen wir Vorname, E-Mail, Passwort, Geburtsdatum (für die Altersprüfung) und deine Phase sowie deine Zustimmung zur Datenschutzerklärung und deine Einwilligung zu den Gesundheitsdaten. Alle weiteren Angaben und das Verbinden einer Uhr sind freiwillig; die KI-Funktionen kannst du ausschalten. Ohne sie stehen einzelne Funktionen nicht oder nur eingeschränkt zur Verfügung.</p>

          <h2 id="alter">21. Mindestalter</h2>
          <p>Second Bloom richtet sich an Erwachsene. Die Nutzung ist erst ab 18 Jahren erlaubt. Bei der Registrierung gibst du dein Geburtsdatum an; ein Konto für Personen unter 18 Jahren wird nicht angelegt.</p>

          <h2 id="werbung">22. Keine Werbung, kein Verkauf, kein Tracking</h2>
          <p>Wir zeigen keine Werbung, verkaufen keine Daten, erstellen keine Werbeprofile und nutzen keine Analyse-Werkzeuge von Dritten. Deine Daten werden nicht zum Trainieren von KI-Modellen verwendet.</p>

          <h2 id="medizin">23. Kein Medizinprodukt</h2>
          <p>Second Bloom ist ein Lifestyle-Begleiter. Die App stellt keine Diagnosen, ersetzt keine ärztliche Beratung und gibt keine Therapieempfehlungen, insbesondere nicht zu Hormonersatztherapie, Medikamenten oder Nahrungsergänzung. Bei Beschwerden wende dich bitte an deine Ärztin oder deinen Arzt, in einer akuten Krise an die in der App genannten Notfallnummern.</p>

          <h2 id="aenderungen">24. Änderungen dieser Erklärung</h2>
          <p>Wir passen diese Erklärung an, wenn sich die App oder die Rechtslage ändert. Die jeweils aktuelle Fassung findest du hier. Bei wesentlichen Änderungen, die eine neue Einwilligung erfordern, fragen wir dich in der App, bevor die Änderung für dich gilt.</p>

          <div className="card flat" style={{ marginTop: 24 }}>
            <p className="small"><b>Hinweis zum Prototyp:</b> Die gelb markierten Stellen sind Platzhalter, die vor einer öffentlichen Nutzung ergänzt werden müssen. Diese Erklärung bildet die tatsächliche technische Umsetzung der App ab. Sie sollte vor dem Start von einer Fachperson für Datenschutzrecht geprüft werden, zusammen mit den Auftragsverarbeitungsverträgen und dem Verzeichnis der Verarbeitungstätigkeiten (Art. 30 DSGVO, Art. 12 DSG).</p>
          </div>
        </article>
      </div>
  );
}
