import { redirect } from "next/navigation";
import SiteShell from "@/components/SiteShell";
import AuthLayout from "@/components/AuthLayout";
import Form from "@/components/Form";
import ConsentFields from "@/components/ConsentFields";
import { requireUser } from "@/lib/auth";
import { needsConsent } from "@/lib/consent";
import { PRIVACY_DATE } from "@/lib/privacy";
import { acceptConsent } from "../actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Datenschutz bestätigen · Second Bloom" };

export default async function Einwilligung() {
  const me = await requireUser();
  if (me.must_change) redirect("/konto?neu=1");
  if (!(await needsConsent(me.id))) redirect("/app");
  return (
    <SiteShell>
      <AuthLayout>
        <div className="stack"><span className="eyebrow">Bevor es losgeht</span><h1>Datenschutz <em>bestätigen</em></h1>
          <p className="small muted">Für dein Konto liegt noch keine Zustimmung zur aktuellen Datenschutzerklärung vom {PRIVACY_DATE} vor. Ohne diese Zustimmung dürfen wir deine Gesundheitsdaten nicht verarbeiten.</p></div>
        <Form action={acceptConsent} submit="Zustimmen und weiter" kind="accent block">
          <ConsentFields adult />
        </Form>
        <p className="small muted">Nicht einverstanden? Du kannst dich abmelden oder dein Konto unter <a href="/konto">Konto</a> löschen.</p>
      </AuthLayout>
    </SiteShell>
  );
}
