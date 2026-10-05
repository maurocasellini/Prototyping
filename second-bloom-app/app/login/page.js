import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import Form from "@/components/Form";
import { login } from "../actions";

export default function Login() {
  return (
    <SiteShell narrow>
      <div className="stack"><span className="eyebrow">Willkommen zurück</span><h1>Anmelden</h1></div>
      <Form action={login} submit="Anmelden" kind="accent block">
        <label>E-Mail oder Benutzername<input type="text" name="login" autoComplete="username" autoCapitalize="none" required /></label>
        <label>Passwort<input type="password" name="password" autoComplete="current-password" required /></label>
      </Form>
      <p className="small muted">Noch kein Konto? <Link href="/register">Konto erstellen</Link> · <Link href="/demo">Demo ansehen</Link></p>
    </SiteShell>
  );
}
