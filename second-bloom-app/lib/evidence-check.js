// Prüft jede PubMed-ID aus public/evidence.json bei der offiziellen NCBI-Schnittstelle (E-Utilities esummary):
// Gibt es den Eintrag, und passt der Titel? Ergebnis wird einen Tag zwischengespeichert.
import EVID from "@/public/evidence.json";

const norm = (s) => String(s || "").toLowerCase().replace(/<[^>]+>/g, "").replace(/[^a-z0-9]+/g, " ").trim();
// Titel gelten als passend, wenn der kürzere fast vollständig im längeren steckt (Satzzeichen und Gross/klein egal)
function sameTitle(a, b) {
  const x = norm(a), y = norm(b);
  if (!x || !y) return false;
  if (x.includes(y) || y.includes(x)) return true;
  const wa = new Set(x.split(" ")), wb = y.split(" ");
  return wb.filter((w) => wa.has(w)).length / Math.max(wa.size, wb.length) >= 0.8;
}

export function evidenceSources() {
  const out = [];
  for (const [key, e] of Object.entries(EVID)) {
    if (key.startsWith("_")) continue;
    for (const s of e.sources || []) out.push({ key, topic: e.name, ...s });
  }
  return out;
}

export async function checkEvidence() {
  const all = evidenceSources(), ids = [...new Set(all.filter((s) => s.pmid).map((s) => s.pmid))];
  let found = null, error = null;
  try {
    const r = await fetch(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&retmode=json&tool=second-bloom&id=${ids.join(",")}`, { signal: AbortSignal.timeout(8000), next: { revalidate: 86400 } });
    if (!r.ok) throw new Error(`NCBI ${r.status}`);
    found = (await r.json()).result || {};
  } catch (e) { error = String(e.message || e); }
  const rows = all.map((s) => {
    if (!s.pmid) return { ...s, status: "ohne PMID" };
    if (!found) return { ...s, status: "nicht geprüft" };
    const hit = found[s.pmid];
    if (!hit || hit.error) return { ...s, status: "nicht gefunden" };
    const year = Number(String(hit.pubdate || "").slice(0, 4)) || null;
    const ok = sameTitle(s.title, hit.title);
    return { ...s, status: ok ? "ok" : "Titel weicht ab", pubmedTitle: hit.title, pubmedJournal: hit.fulljournalname || hit.source, pubmedYear: year };
  });
  return { checkedAt: new Date().toISOString(), error, rows };
}
