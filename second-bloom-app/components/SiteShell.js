import Link from "next/link";
import Mark from "./Mark";
import { currentUser } from "@/lib/auth";
import { logout } from "@/app/actions";

// Rahmen für die Website-Seiten (Start, Anmeldung, Konto, Admin)
export default async function SiteShell({ children }) {
  const me = await currentUser().catch(() => null);
  return (
    <>
      <header className="site-top">
        <Link href={me ? "/app" : "/"} className="brand"><Mark /> Second Bloom</Link>
        <nav>
          {me ? (<>
            <Link href="/app">App</Link>
            <Link href="/konto">Konto</Link>
            {me.role === "admin" && <Link href="/admin">Admin</Link>}
            <form action={logout}><button className="link" type="submit">Abmelden</button></form>
          </>) : (<>
            <Link href="/demo">Demo</Link>
            <Link href="/login">Anmelden</Link>
            <Link href="/register">Konto erstellen</Link>
          </>)}
        </nav>
      </header>
      <main className="site-main">{children}</main>
      <footer className="foot">Second Bloom ist ein Lifestyle-Begleiter und kein Medizinprodukt. Die App ersetzt keine ärztliche Beratung. · <Link href="/datenschutz">Datenschutzerklärung</Link> · <Link href="/quellen">Quellen & Studienlage</Link></footer>
    </>
  );
}
