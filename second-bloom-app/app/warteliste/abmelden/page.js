import SiteShell from "@/components/SiteShell";
import Form from "@/components/Form";
import { leaveWaitlist } from "../../actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Warteliste verlassen · Second Bloom" };

export default function Abmelden() {
  return (
    <SiteShell>
      <section className="lp-wait" style={{ maxWidth: 560, margin: "40px auto" }}>
        <div className="lp-head"><span className="eyebrow">Warteliste</span><h2>Von der Warteliste austragen</h2>
          <p className="lp-lead">Gib die E-Mail-Adresse ein, mit der du dich eingetragen hast. Wir löschen den Eintrag sofort.</p></div>
        <Form action={leaveWaitlist} submit="Austragen" kind="accent block" className="form lp-form">
          <label>E-Mail<input type="email" name="email" autoComplete="email" required /></label>
        </Form>
      </section>
    </SiteShell>
  );
}
