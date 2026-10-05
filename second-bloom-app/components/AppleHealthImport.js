"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Unzip, UnzipInflate } from "fflate";
import { createAggregator } from "@/lib/applehealth";

const DAYS = 180;
const sinceDay = () => new Date(Date.now() - DAYS * 864e5).toISOString().slice(0, 10);

// Liest export.zip (oder export.xml) im Browser in Stücken, damit auch sehr grosse Exporte funktionieren
async function readExport(file, onProgress) {
  const agg = createAggregator(sinceDay());
  const dec = new TextDecoder();
  const reader = file.stream().getReader();
  let read = 0, found = false;
  const isZip = /\.zip$/i.test(file.name) || file.type.includes("zip");
  let uz = null;
  if (isZip) {
    uz = new Unzip();
    uz.register(UnzipInflate);
    uz.onfile = (f) => {
      // export.xml (je nach Sprache auch anders benannt), nicht die klinischen CDA-Daten oder Routen
      if (found || !/\.xml$/i.test(f.name) || /cda|workout-routes|electrocardiograms/i.test(f.name)) return;
      found = true;
      f.ondata = (err, chunk, final) => { if (err) throw err; agg.feed(dec.decode(chunk, { stream: !final })); };
      f.start();
    };
  }
  for (;;) {
    const { value, done } = await reader.read();
    if (value) { read += value.length; onProgress(Math.min(99, Math.round((read / file.size) * 100))); }
    if (isZip) uz.push(value || new Uint8Array(0), done);
    else if (value || done) { found = true; agg.feed(dec.decode(value || new Uint8Array(0), { stream: !done })); }
    if (done) break;
  }
  if (!found) throw new Error("In der ZIP-Datei wurde keine export.xml gefunden.");
  return agg.result();
}

export default function AppleHealthImport({ last }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false), [pct, setPct] = useState(0), [msg, setMsg] = useState(null);
  const go = async (e) => {
    const file = e.target.files?.[0]; e.target.value = "";
    if (!file) return;
    setBusy(true); setMsg(null); setPct(0);
    try {
      const { rows } = await readExport(file, setPct);
      if (!rows.length) throw new Error(`In der Datei wurden keine passenden Werte der letzten ${DAYS} Tage gefunden.`);
      const r = await fetch("/api/health-import", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ rows }) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.error || "Der Import hat nicht geklappt.");
      setMsg({ ok: `${j.days} Tage übernommen (${j.from} bis ${j.to}).` });
      router.refresh();
    } catch (err) { setMsg({ error: String(err?.message || err) }); }
    setBusy(false); setPct(0);
  };
  return (
    <div className="stack" style={{ gap: 10 }}>
      {last && <p className="small">Letzter Import: <b>{last}</b></p>}
      <label className="btn accent" style={{ alignSelf: "flex-start", cursor: busy ? "wait" : "pointer" }}>
        {busy ? `Wird gelesen … ${pct} %` : "Apple-Health-Export auswählen"}
        <input type="file" accept=".zip,.xml,application/zip,text/xml" onChange={go} disabled={busy} hidden />
      </label>
      {msg?.ok && <p className="msg ok" role="status">{msg.ok}</p>}
      {msg?.error && <p className="msg err" role="alert">{msg.error}</p>}
    </div>
  );
}
