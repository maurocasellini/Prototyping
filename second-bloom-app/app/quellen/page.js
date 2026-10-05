import SiteShell from "@/components/SiteShell";
import DE from "@/public/evidence.json";
import EN from "@/public/evidence.en.json";
import FR from "@/public/evidence.fr.json";
import ES from "@/public/evidence.es.json";
import PT from "@/public/evidence.pt.json";
import { getLang } from "@/lib/lang";

export const metadata = { title: "Quellen · Second Bloom" };
export const dynamic = "force-dynamic";
const BY_LANG = { de: DE, en: EN, fr: FR, es: ES, pt: PT };

const LEVEL = { hoch: "Hoch", moderat: "Moderat", niedrig: "Niedrig", unzureichend: "Unzureichend" };
const LCLASS = { hoch: "t-sage", moderat: "t-sky", niedrig: "t-sun", unzureichend: "t-accent" };

function Src({ q }) {
  return (
    <li>
      <span className={`tag t-sky`}>{q.type || "Quelle"}</span> <span translate="no">{q.authors}{q.year ? ` (${q.year})` : ""}. <i>{q.title}</i>. {q.journal}.</span>{" "}
      {q.pmid && <a href={`https://pubmed.ncbi.nlm.nih.gov/${q.pmid}/`} target="_blank" rel="noreferrer">PubMed {q.pmid}</a>}
      {q.doi && <> · <a href={`https://doi.org/${q.doi}`} target="_blank" rel="noreferrer">DOI</a></>}
      {!q.pmid && !q.doi && q.url && <a href={q.url} target="_blank" rel="noreferrer">Quelle öffnen</a>}
    </li>
  );
}

export default async function Quellen() {
  const entries = Object.entries(BY_LANG[await getLang()] || DE).filter(([k]) => !k.startsWith("_"));
  return (
    <SiteShell>
      <div className="doc">
        <nav className="doc-toc" aria-label="Inhalt">
          <span className="eyebrow">Inhalt</span>
          <ol style={{ marginTop: 12 }}>
            <li><a href="#methodik">Methodik und Evidenzstufen</a></li>
            {entries.map(([k, e]) => <li key={k}><a href={`#${k}`} translate="no">{e.name}</a></li>)}
          </ol>
        </nav>
        <article className="doc-body">
          <div className="stack" style={{ gap: 6 }}>
            <span className="eyebrow">Evidenzbasiert</span>
            <h1>Quellen & <em>Studienlage</em></h1>
            <p className="muted small">Woher die Angaben zu Mikronährstoffen, Nahrungsergänzung und Protein in Second Bloom stammen.</p>
          </div>
          <h2 id="methodik">Methodik und Evidenzstufen</h2>
          <p>Wir stützen uns bevorzugt auf systematische Übersichtsarbeiten und Meta-Analysen, grosse randomisierte Studien (RCT), Leitlinien und Positionspapiere von Fachgesellschaften sowie Empfehlungen von Behörden wie EFSA, DGE oder dem NIH Office of Dietary Supplements. Jede Quelle ist mit PubMed-ID, DOI oder der Originalseite verlinkt. Titel, Journal und Jahr wurden bei der Aufnahme abgeglichen; die PubMed-IDs werden zusätzlich täglich automatisch bei der offiziellen PubMed-Schnittstelle (NCBI) geprüft. Vor dem öffentlichen Start ist eine fachliche Durchsicht vorgesehen.</p>
          <div className="scroll-x"><table className="t"><thead><tr><th>Stufe</th><th>Bedeutung</th></tr></thead><tbody>
            <tr><td><span className="tag t-sage">Hoch</span></td><td>Mehrere gute Studien oder Meta-Analysen kommen übereinstimmend zum Ergebnis. Weitere Forschung ändert das Bild wahrscheinlich nicht.</td></tr>
            <tr><td><span className="tag t-sky">Moderat</span></td><td>Gute Hinweise, aber mit Einschränkungen, etwa kleinere Studien, andere Zielgruppen oder uneinheitliche Ergebnisse.</td></tr>
            <tr><td><span className="tag t-sun">Niedrig</span></td><td>Wenige, kleine oder widersprüchliche Studien. Der Effekt ist unsicher.</td></tr>
            <tr><td><span className="tag t-accent">Unzureichend</span></td><td>Kein belastbarer Nutzen gezeigt, oder gute Studien fanden keinen Effekt.</td></tr>
          </tbody></table></div>
          <p className="small muted">Die Angaben sind Informationen, keine persönliche Empfehlung. Die Einnahme von Nahrungsergänzungsmitteln besprichst du bitte mit deiner Ärztin, deinem Arzt oder in der Apotheke.</p>
          {entries.length === 0 && <p className="small muted">Die Auswertung wird gerade ergänzt.</p>}
          {entries.map(([k, e]) => (
            <section key={k} className="stack" style={{ gap: 10 }}>
              <h2 id={k} translate="no">{e.name}</h2>
              <div className="list">{(e.claims || []).map((c, i) => <div key={i} className="li small"><div className="grow" translate="no">{c.claim_de}</div><span className={`tag ${LCLASS[c.evidence] || "t-accent"}`}>{LEVEL[c.evidence] || "Offen"}</span></div>)}</div>
              <p translate="no">{e.summary_de}</p>
              {e.dose_de && <p className="small"><b>Dosis laut Studien und Fachstellen:</b> <span translate="no">{e.dose_de}</span></p>}
              {e.safety_de && <p className="small"><b>Sicherheit:</b> <span translate="no">{e.safety_de}</span></p>}
              <ol className="srcs">{(e.sources || []).map((q, i) => <Src key={i} q={q} />)}</ol>
            </section>
          ))}
        </article>
      </div>
    </SiteShell>
  );
}
