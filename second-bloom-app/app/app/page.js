import AppShell from "@/components/AppShell";
import { requireUser } from "@/lib/auth";
import { bootUser } from "@/lib/boot";
import { needsConsent } from "@/lib/consent";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const metadata = { title: "Second Bloom" };

export default async function AppPage() {
  const me = await requireUser();
  if (me.must_change) redirect("/konto?neu=1");
  if (await needsConsent(me.id)) redirect("/einwilligung");
  return <AppShell boot={await bootUser(me)} />;
}
