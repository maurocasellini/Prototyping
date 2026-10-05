import { LANGS } from "@/lib/lang";

// Kleine Sprachwahl in der Kopfzeile (Links, funktionieren ohne JavaScript)
export default function LangSwitch({ lang }) {
  return (
    <div className="lang-switch" aria-label="Sprache">
      {Object.keys(LANGS).map((k) => <a key={k} href={`/api/lang?l=${k}`} className={k === lang ? "on" : ""} hrefLang={k} title={LANGS[k]} translate="no">{k.toUpperCase()}</a>)}
    </div>
  );
}
