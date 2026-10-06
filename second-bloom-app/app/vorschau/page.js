import LandingLive from "@/components/LandingLive";
import * as repo from "@/lib/repo";

export const dynamic = "force-dynamic";
export const metadata = { title: "App-Vorschau · Second Bloom" };

// Zweite Seite hinter der Landingpage: die App mit Demo und Anmeldung.
// In Stufe 1 ohne Registrierung (Knöpfe führen zur Demo bzw. zur Warteliste).
export default async function Vorschau() {
  return <LandingLive open={repo.isLive(await repo.getSettings())} />;
}
