import AppShell from "@/components/AppShell";
import { bootDemo } from "@/lib/boot";

export const dynamic = "force-dynamic";
export const metadata = { title: "Second Bloom · Demo" };

export default async function Demo() {
  return <AppShell boot={await bootDemo()} />;
}
