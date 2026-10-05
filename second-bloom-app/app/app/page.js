import AppShell from "@/components/AppShell";
import { requireUser } from "@/lib/auth";
import { bootUser } from "@/lib/boot";

export const dynamic = "force-dynamic";
export const metadata = { title: "Second Bloom" };

export default async function AppPage() {
  const me = await requireUser();
  return <AppShell boot={await bootUser(me)} />;
}
