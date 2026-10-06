import { LANGS } from "@/lib/lang";
import Dropdown from "./Dropdown";

// Dezente Sprachwahl in der Kopfzeile: aktuelles Kürzel, Liste klappt auf
export default function LangSwitch({ lang }) {
  const globe = <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z" /></svg>;
  return (
    <Dropdown className="lang-switch" label="Sprache" summary={<>{globe}<span translate="no">{lang.toUpperCase()}</span></>}>
      {Object.keys(LANGS).map((k) => <a key={k} href={`/api/lang?l=${k}`} className={k === lang ? "on" : ""} hrefLang={k} lang={k} translate="no">{LANGS[k]}</a>)}
    </Dropdown>
  );
}
