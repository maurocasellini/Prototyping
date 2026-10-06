import Link from "next/link";
import Mark from "./Mark";
import { currentUser } from "@/lib/auth";
import { logout } from "@/app/actions";
import LangSwitch from "./LangSwitch";
import Dropdown from "./Dropdown";
import { getLang } from "@/lib/lang";
import { getSettings, isLive } from "@/lib/repo";

// Rahmen für die Website-Seiten (Start, Anmeldung, Konto, Admin)
export default async function SiteShell({ children, nav }) {
  const [me, lang, settings] = await Promise.all([currentUser().catch(() => null), getLang(), getSettings()]);
  const live = isLive(settings);
  const links = me ? (<>
    <Link href="/app">App</Link>
    <Link href="/konto">Konto</Link>
    {me.role === "admin" && <Link href="/admin">Admin</Link>}
    <form action={logout}><button className="link" type="submit">Abmelden</button></form>
  </>) : live || nav === "preview" ? (<>
    <Link href="/demo">Demo</Link>
    <Link href="/login">Anmelden</Link>
    {live ? <Link href="/register">Konto erstellen</Link> : <a href="/#warteliste">Warteliste</a>}
  </>) : (<>
    <a href="/#ziel">Das Ziel</a>
    <a href="/#sara">Über Sara</a>
    <a href="/#warteliste">Warteliste</a>
  </>);
  return (
    <>
      <header className="site-top">
        <Link href={me ? "/app" : "/"} className="brand"><Mark /> Second Bloom</Link>
        <nav className="site-nav">{links}</nav>
        <div className="site-tools">
          <LangSwitch lang={lang} />
          <Dropdown className="nav-menu" label="Menü" summary={<span className="burger" aria-hidden="true"><i /><i /><i /></span>}>{links}</Dropdown>
        </div>
      </header>
      <main className="site-main">{children}</main>
      <footer className="foot">Second Bloom ist ein Lifestyle-Begleiter und kein Medizinprodukt. Die App ersetzt keine ärztliche Beratung. · <Link href="/impressum">Impressum</Link> · <Link href="/datenschutz">Datenschutzerklärung</Link>{me && <> · <Link href="/quellen">Quellen & Studienlage</Link></>}</footer>
    </>
  );
}
