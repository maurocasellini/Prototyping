import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import Form from "@/components/Form";
import SyncButton from "@/components/SyncButton";
import { requireUser } from "@/lib/auth";
import * as repo from "@/lib/repo";
import { updateAccount, changePassword, deleteAccount, connectDevice, disconnectDevice, syncNow, setAiConsent } from "../actions";

export const dynamic = "force-dynamic";
const when = (s) => (s ? new Date(s).toLocaleString("de-CH", { dateStyle: "medium", timeStyle: "short" }) : "noch nie");

export default async function Konto({ searchParams }) {
  const sp = await searchParams;
  const me = await requireUser();
  const conn = await repo.getConnection(me.id, "intervals");
  const days = conn ? (await repo.getDaily(me.id)).length : 0;
  const consent = (await repo.getState(me.id))?.consent || {};
  const d = (s) => (s ? new Date(s).toLocaleDateString("de-CH", { dateStyle: "long" }) : "–");
  return (
    <SiteShell>
      <div className="stack"><span className="eyebrow">Konto{me.username ? ` · ${me.username}` : ""}</span><h1>Hallo, <em>{me.name}</em>.</h1></div>
      {me.must_change && <p className="msg err">{sp?.neu ? "Willkommen. " : ""}Du nutzt noch das Startpasswort. Bitte ändere es jetzt unter Sicherheit. Danach ist das Konto voll freigeschaltet.</p>}
      <div className="grid2">
        <section className="card" id="geraete">
          <span className="eyebrow">Geräte</span>
          <h2>Uhr oder Ring verbinden</h2>
          {conn ? (<>
            <div className="kv">
              <span>Verbunden über</span><b>intervals.icu{conn.name ? ` (${conn.name})` : ""}</b>
              <span>Letzter Abgleich</span><b>{when(conn.last_sync_at)}</b>
              <span>Tage gespeichert</span><b className="num">{days}</b>
            </div>
            {conn.last_error && <p className="msg err">{conn.last_error}</p>}
            <SyncButton action={syncNow} />
            <form action={disconnectDevice} className="form">
              <label className="check"><input type="checkbox" name="purge" /> <span>Auch alle gespeicherten Gerätewerte löschen</span></label>
              <button className="btn line" type="submit">Verbindung trennen</button>
            </form>
          </>) : (<>
            <p className="small">Second Bloom liest Schlaf, HRV, Ruhepuls, Stress, Schritte, Kalorien und, wenn vorhanden, die Zyklusphase. Garmin, Oura, WHOOP, Polar, COROS und Suunto laufen über den Gratis-Dienst <b>intervals.icu</b>, denselben Weg wie bei Formstand.</p>
            <ol className="small" style={{ paddingLeft: 18, margin: 0, display: "grid", gap: 6 }}>
              <li>Auf <a href="https://intervals.icu" target="_blank" rel="noreferrer">intervals.icu</a> ein Gratis-Konto erstellen.</li>
              <li>Dort unter Settings → Connections deine Uhr verbinden (z. B. Garmin).</li>
              <li>Unter Settings → Developer Settings die <b>Athleten-ID</b> (beginnt mit i) und den <b>API-Schlüssel</b> kopieren.</li>
            </ol>
            <Form action={connectDevice} submit="Verbinden" pending="Verbinde und lade 120 Tage …" kind="accent">
              <label>Athleten-ID<input type="text" name="athlete" placeholder="i123456" required /></label>
              <label>API-Schlüssel<input type="password" name="key" autoComplete="off" required /></label>
            </Form>
            <p className="small muted">Der Schlüssel wird verschlüsselt gespeichert. Danach gleicht Second Bloom jeden Morgen automatisch ab.</p>
          </>)}
        </section>
        <section className="card">
          <span className="eyebrow">Profil</span>
          <h2>Deine Angaben</h2>
          <Form action={updateAccount} submit="Speichern">
            <label>Vorname<input type="text" name="name" defaultValue={me.name} required /></label>
            <label>E-Mail{me.username ? " (optional)" : ""}<input type="text" name="email" defaultValue={me.email || ""} required={!me.username} /></label>
          </Form>
          <p className="small muted">Phase, Gewicht und Haushalt änderst du direkt in der App unter Körper.</p>
        </section>
        <section className="card">
          <span className="eyebrow">Sicherheit</span>
          <h2>Passwort ändern</h2>
          <Form action={changePassword} submit="Passwort ändern">
            <label>Aktuelles Passwort<input type="password" name="current" autoComplete="current-password" required /></label>
            <label>Neues Passwort<input type="password" name="password" autoComplete="new-password" minLength={8} required /></label>
            <label>Neues Passwort wiederholen<input type="password" name="password2" autoComplete="new-password" minLength={8} required /></label>
          </Form>
        </section>
        <section className="card">
          <span className="eyebrow">Einwilligungen</span>
          <h2>Datenschutz</h2>
          <div className="kv">
            <span>Gesundheitsdaten</span><b>erteilt am {d(consent.health_at)}</b>
            <span>KI-Funktionen</span><b>{consent.ai ? `eingeschaltet seit ${d(consent.ai_at)}` : "ausgeschaltet"}</b>
            <span>Fassung der Erklärung</span><b>{consent.version || "–"}</b>
          </div>
          <Form action={setAiConsent} submit="Speichern">
            <label className="check"><input type="checkbox" name="ai" defaultChecked={Boolean(consent.ai)} /> <span>KI-Funktionen nutzen: Für Rezeptvorschläge, Wochenpläne und die Tageseinordnung wird ein knapper Auszug ohne Name und E-Mail an Anthropic (USA) gesendet.</span></label>
          </Form>
          <p className="small muted">Die Einwilligung zu den Gesundheitsdaten widerrufst du, indem du dein Konto löschst. Ohne sie kann die App nicht arbeiten. Alles Weitere steht in der <Link href="/datenschutz">Datenschutzerklärung</Link>.</p>
        </section>
        <section className="card">
          <span className="eyebrow">Deine Daten</span>
          <h2>Export und Löschen</h2>
          <p className="small">Alle deine Daten als JSON-Datei: Profil, Einträge und Gerätewerte.</p>
          <a className="btn line" href="/api/export">Daten herunterladen</a>
          <div className="orn">· · ·</div>
          <p className="small">Konto endgültig löschen. Alle Einträge und Gerätewerte werden sofort entfernt.</p>
          <Form action={deleteAccount} submit="Konto löschen" kind="line">
            <label>Zur Bestätigung dein Passwort<input type="password" name="password" autoComplete="current-password" required /></label>
          </Form>
        </section>
      </div>
      <p className="small"><Link href="/app">Zurück zur App</Link></p>
    </SiteShell>
  );
}
