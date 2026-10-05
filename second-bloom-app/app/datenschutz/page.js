import SiteShell from "@/components/SiteShell";
import { getLang } from "@/lib/lang";
import PrivacyDE from "./de";
import PrivacyEN from "./en";
import PrivacyFR from "./fr";
import PrivacyES from "./es";
import PrivacyPT from "./pt";

export const metadata = { title: "Datenschutzerklärung · Second Bloom" };
export const dynamic = "force-dynamic";
const BY_LANG = { de: PrivacyDE, en: PrivacyEN, fr: PrivacyFR, es: PrivacyES, pt: PrivacyPT };

// Übersetzungen sind vollständige eigene Fassungen (nicht über das Wörterbuch); massgeblich ist die deutsche Fassung.
export default async function Datenschutz() {
  const lang = await getLang(), Body = BY_LANG[lang] || PrivacyDE;
  return <SiteShell><div translate={lang === "de" ? undefined : "no"}><Body /></div></SiteShell>;
}
