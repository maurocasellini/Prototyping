import SiteShell from "@/components/SiteShell";

export const dynamic = "force-dynamic";
export const metadata = { title: "Impressum · Second Bloom" };

// Platzhalter: vor dem Start mit den echten Angaben der Betreiberin füllen (Pflichtangaben nach Art. 3 Abs. 1 lit. s UWG
// Schweiz, § 5 ECG Liechtenstein bzw. Art. 5 E-Commerce-Richtlinie).
const P = ({ children }) => <span className="ph">{children}</span>;

export default function Impressum() {
  return (
    <SiteShell>
      <article className="doc-body" style={{ maxWidth: 760, margin: "0 auto" }}>
        <div className="stack" style={{ gap: 6 }}>
          <span className="eyebrow">Anbieterkennzeichnung</span>
          <h1>Impressum</h1>
        </div>
        <h2>Betreiberin</h2>
        <p><P>Name der Firma oder Person</P><br /><P>Strasse und Hausnummer</P><br /><P>PLZ, Ort, Land</P></p>
        <h2>Kontakt</h2>
        <p>E-Mail: <P>kontakt@…</P><br />Telefon: <P>optional</P></p>
        <h2>Handelsregister</h2>
        <p>Eingetragen im <P>Handelsregister / Firmenbuch</P>, Nummer <P>…</P><br />UID / MWST-Nummer: <P>…</P></p>
        <h2>Verantwortlich für den Inhalt</h2>
        <p><P>Name</P></p>
        <h2>Haftung</h2>
        <p>Die Inhalte von Second Bloom wurden sorgfältig erstellt und stützen sich auf veröffentlichte Studien und Empfehlungen von Fachstellen. Sie dienen der allgemeinen Information und ersetzen keine ärztliche Beratung, Diagnose oder Behandlung. Für Inhalte verlinkter Seiten sind ausschliesslich deren Betreiber verantwortlich.</p>
        <h2>Urheberrecht</h2>
        <p>Texte, Gestaltung und Programmcode von Second Bloom sind urheberrechtlich geschützt. Übungsvideos werden von YouTube eingebunden; die Rechte liegen bei den jeweiligen Urheberinnen und Urhebern.</p>
        <div className="card flat" style={{ marginTop: 24 }}><p className="small"><b>Hinweis zum Prototyp:</b> Die gelb markierten Stellen sind Platzhalter und müssen vor einer öffentlichen Nutzung ergänzt werden.</p></div>
      </article>
    </SiteShell>
  );
}
