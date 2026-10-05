import SiteShell from "@/components/SiteShell";
import Form from "@/components/Form";
import { requireAdmin } from "@/lib/auth";
import * as repo from "@/lib/repo";
import { aiConfig, getUsage, MODELS, DAILY_CALLS_PER_USER, DAILY_CALLS_DEMO } from "@/lib/ai";
import { adminSettings, adminSetRole, adminDeleteUser } from "../actions";

export const dynamic = "force-dynamic";
const usd = (v) => `$${(v || 0).toFixed(2)}`;

export default async function Admin() {
  const me = await requireAdmin();
  const [users, settings, cfg, usage] = await Promise.all([repo.listUsers(), repo.getSettings(), aiConfig(), getUsage()]);
  const months = Object.entries(usage).slice(0, 6);
  return (
    <SiteShell>
      <div className="stack"><span className="eyebrow">Admin</span><h1>Verwaltung</h1></div>
      {me.must_change && <p className="msg err">Du nutzt noch das Startpasswort ADMIN. Bitte unter <a href="/konto">Konto</a> ändern.</p>}
      <div className="grid2">
        <section className="card">
          <span className="eyebrow">Einstellungen</span>
          <h2>Zugang und KI</h2>
          <div className="kv">
            <span>Claude-Schlüssel</span><b>{cfg.key ? (cfg.source === "env" ? "aus Vercel (ANTHROPIC_API_KEY)" : "hier hinterlegt") : "fehlt"}</b>
            <span>Modelle</span><b>Haiku 4.5 für Text, Sonnet 5.5 (Aufwand niedrig) für Fotos</b>
            <span>Tageslimit</span><b>{DAILY_CALLS_PER_USER} Aufrufe je Konto, Demo {DAILY_CALLS_DEMO} insgesamt</b>
          </div>
          <Form action={adminSettings} submit="Speichern">
            <label className="check"><input type="checkbox" name="registrationOpen" defaultChecked={settings.registrationOpen !== false} /> <span>Neue Konten dürfen sich registrieren</span></label>
            <label className="check"><input type="checkbox" name="demoAi" defaultChecked={cfg.demoAi} /> <span>KI auch in der öffentlichen Demo erlauben</span></label>
            <label>Monatslimit KI in USD (0 = ohne Limit)<input type="number" name="cap" min="0" step="1" defaultValue={cfg.monthlyCapUsd} /></label>
            <label>Claude-API-Schlüssel (leer lassen = unverändert, „-“ = entfernen)<input type="password" name="apiKey" autoComplete="off" placeholder={cfg.source === "app" ? "hinterlegt" : "sk-ant-…"} /></label>
          </Form>
          <p className="small muted">Am sichersten liegt der Schlüssel als Umgebungsvariable ANTHROPIC_API_KEY (Typ „sensitive“) in Vercel. Dann ist er nicht in der App-Datenbank.</p>
        </section>
        <section className="card">
          <span className="eyebrow">Kosten</span>
          <h2>KI-Verbrauch</h2>
          {months.length ? <div className="scroll-x"><table className="t"><thead><tr><th>Monat</th><th>Kosten</th><th>Aufrufe</th><th>Nach Art</th></tr></thead><tbody>
            {months.map(([m, v]) => <tr key={m}><td>{m}</td><td className="num">{usd(v.usd)}</td><td className="num">{v.calls}</td><td className="small">{Object.entries(v.kinds || {}).map(([k, x]) => `${k}: ${x.calls}× ${usd(x.usd)}`).join(" · ")}</td></tr>)}
          </tbody></table></div> : <p className="small muted">Noch keine KI-Aufrufe.</p>}
          <p className="small muted">Preise je 1 Mio. Tokens: {Object.values(MODELS).map((m) => `${m.name} $${m.price[0]} / $${m.price[1]}`).join(" · ")}</p>
        </section>
      </div>
      <section className="card">
        <span className="eyebrow">Konten</span>
        <h2>{users.length} {users.length === 1 ? "Konto" : "Konten"}</h2>
        <div className="scroll-x"><table className="t"><thead><tr><th>Name</th><th>E-Mail</th><th>Rolle</th><th>Seit</th><th></th></tr></thead><tbody>
          {users.map((u) => <tr key={u.id}>
            <td>{u.name}{u.username ? <span className="muted"> · {u.username}</span> : null}</td><td>{u.email || "–"}</td>
            <td>{u.id === me.id ? "Admin (du)" : <form action={adminSetRole} className="row"><input type="hidden" name="id" value={u.id} /><input type="hidden" name="role" value={u.role === "admin" ? "user" : "admin"} /><span>{u.role === "admin" ? "Admin" : "Nutzerin"}</span><button className="link" type="submit">{u.role === "admin" ? "zur Nutzerin" : "zur Admin"}</button></form>}</td>
            <td className="small">{new Date(u.created_at).toLocaleDateString("de-CH")}</td>
            <td>{u.id !== me.id && <form action={adminDeleteUser} className="row"><input type="hidden" name="id" value={u.id} /><input type="text" name="confirm" placeholder="LÖSCHEN" style={{ width: 110 }} aria-label="Zum Löschen LÖSCHEN eintippen" /><button className="btn sm line" type="submit">Löschen</button></form>}</td>
          </tr>)}
        </tbody></table></div>
      </section>
    </SiteShell>
  );
}
