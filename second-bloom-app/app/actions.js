"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import * as repo from "@/lib/repo";
import { createSession, destroySession, requireUser, requireAdmin } from "@/lib/auth";
import { connectIntervals, syncUser } from "@/lib/sync";
import { encrypt } from "@/lib/crypto";
import { PRIVACY_VERSION } from "@/lib/privacy";
import { readProfile } from "@/lib/profile";
import { needsConsent } from "@/lib/consent";
import { setLangCookie } from "@/lib/lang";

const s = (form, k) => String(form.get(k) || "").trim();

// ---------- Anmeldung ----------
export async function login(_prev, form) {
  const u = await repo.findUserByLogin(s(form, "login"));
  if (!u || !(await repo.checkPassword(form.get("password"), u.password_hash))) return { error: "Benutzername, E-Mail oder Passwort stimmt nicht." };
  // Start-Konto ADMIN mit Startpasswort: gesperrt, sobald eine andere Admin ein eigenes Passwort hat (wie Formstand)
  if (u.username === "ADMIN" && u.must_change && (await repo.listUsers()).some((x) => x.id !== u.id && x.role === "admin" && !x.must_change))
    return { error: "Dieses Start-Konto ist aus Sicherheitsgründen gesperrt. Bitte mit deinem eigenen Admin-Konto anmelden." };
  await createSession(u);
  const lang = (await repo.getState(u.id))?.profile?.lang;
  if (lang) await setLangCookie(lang);
  redirect(u.must_change ? "/konto?neu=1" : (await needsConsent(u.id)) ? "/einwilligung" : "/app");
}

export async function register(_prev, form) {
  const settings = await repo.getSettings();
  if (!settings.registrationOpen) return { error: "Die Registrierung ist im Moment geschlossen." };
  const name = s(form, "name"), email = s(form, "email").toLowerCase(), pw = String(form.get("password") || "");
  if (!name) return { error: "Bitte deinen Vornamen angeben." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Die E-Mail-Adresse sieht nicht gültig aus." };
  if (pw.length < 8) return { error: "Bitte ein Passwort mit mindestens 8 Zeichen wählen." };
  if (pw !== String(form.get("password2") || "")) return { error: "Die beiden Passwörter sind nicht gleich." };
  const p = readProfile(form, name);
  if (p.error) return { error: p.error };
  const c = consentError(form);
  if (c) return { error: c };
  let u;
  try { u = await repo.createUser({ name, email, password: pw }); } catch (e) { return { error: e.message }; }
  await setLangCookie(p.profile.lang);
  await repo.saveState(u.id, { profile: p.profile, household: p.household, diet: p.diet, prefs: p.prefs, ...consentRecord() });
  await createSession(u);
  redirect("/app");
}

// Pflicht-Häkchen: Datenschutz akzeptiert, Gesundheitsdaten (inkl. KI), kein Ersatz für ärztliche Beratung
function consentError(form) {
  if (form.get("privacy") !== "on") return "Bitte lies und akzeptiere die Datenschutzerklärung.";
  if (form.get("consent") !== "on") return "Ohne Einwilligung zu den Gesundheitsdaten kann die App nicht arbeiten. Du kannst sie jederzeit widerrufen.";
  if (form.get("medical") !== "on") return "Bitte bestätige, dass Second Bloom keine ärztliche Beratung ersetzt.";
  return null;
}
// Nachweis der Einwilligung (Art. 7 Abs. 1 DSGVO): Zeitpunkt, Art und Version der Erklärung
function consentRecord(prev = {}) {
  const at = new Date().toISOString(), ai = prev.consent?.ai !== false;
  return {
    consent: { ...(prev.consent || {}), version: PRIVACY_VERSION, health_at: at, privacy_at: at, medical_at: at, adult: true, ai, ai_at: prev.consent?.ai_at || at },
    consent_log: [...(prev.consent_log || []), { at, type: "privacy", value: true, version: PRIVACY_VERSION }, { at, type: "health", value: true, version: PRIVACY_VERSION }, { at, type: "ai", value: ai, version: PRIVACY_VERSION }].slice(-50),
  };
}

// Bestätigung nach dem Login, wenn noch keine oder eine ältere Einwilligung vorliegt
export async function acceptConsent(_prev, form) {
  const me = await requireUser();
  if (form.get("adult") !== "on") return { error: "Second Bloom ist für Erwachsene ab 18 Jahren." };
  const c = consentError(form);
  if (c) return { error: c };
  await repo.patchState(me.id, (st) => ({ ...st, ...consentRecord(st) }));
  redirect("/app");
}

export async function logout() {
  await destroySession();
  redirect("/login");
}

// ---------- Konto ----------
export async function updateAccount(_prev, form) {
  const me = await requireUser();
  const name = s(form, "name"), email = s(form, "email").toLowerCase();
  if (!name) return { error: "Der Name darf nicht leer sein." };
  if ((email || !me.username) && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Die E-Mail-Adresse sieht nicht gültig aus." };
  if (email && (await repo.listUsers()).some((u) => u.id !== me.id && u.email === email)) return { error: "Diese E-Mail nutzt schon ein anderes Konto." };
  await repo.updateUser(me.id, { name, email: email || null });
  revalidatePath("/konto");
  return { ok: "Gespeichert." };
}

export async function changePassword(_prev, form) {
  const me = await requireUser();
  const full = await repo.getUser(me.id);
  const cur = String(form.get("current") || ""), pw = String(form.get("password") || ""), pw2 = String(form.get("password2") || "");
  if (!(await repo.checkPassword(cur, full.password_hash))) return { error: "Das aktuelle Passwort stimmt nicht." };
  if (pw.length < 8) return { error: "Das neue Passwort braucht mindestens 8 Zeichen." };
  if (pw !== pw2) return { error: "Die beiden neuen Passwörter sind nicht gleich." };
  const u = await repo.setPassword(me.id, pw);
  await createSession(u);
  return { ok: "Passwort geändert." };
}

export async function deleteAccount(_prev, form) {
  const me = await requireUser();
  const full = await repo.getUser(me.id);
  if (!(await repo.checkPassword(form.get("password"), full.password_hash))) return { error: "Das Passwort stimmt nicht." };
  if (me.role === "admin" && (await repo.listUsers()).filter((u) => u.role === "admin").length === 1 && (await repo.listUsers()).length > 1)
    return { error: "Du bist die einzige Admin. Bitte zuerst eine andere Person zur Admin machen." };
  await repo.deleteUser(me.id);
  await destroySession();
  redirect("/?geloescht=1");
}

// Einwilligung KI ein- oder ausschalten (jederzeit widerrufbar, Art. 7 Abs. 3 DSGVO)
export async function setAiConsent(_prev, form) {
  const me = await requireUser();
  const on = form.get("ai") === "on", at = new Date().toISOString();
  await repo.patchState(me.id, (st) => {
    st.consent = { ...(st.consent || {}), ai: on, ai_at: at };
    st.consent_log = [...(st.consent_log || []), { at, type: "ai", value: on, version: PRIVACY_VERSION }].slice(-50);
    return st;
  });
  revalidatePath("/konto");
  return { ok: on ? "KI-Funktionen eingeschaltet." : "KI-Funktionen ausgeschaltet. Es werden keine Daten mehr an Anthropic gesendet." };
}

// ---------- Geräte ----------
export async function connectDevice(_prev, form) {
  const me = await requireUser();
  const athlete = s(form, "athlete"), key = s(form, "key");
  if (!/^i?\d+$/.test(athlete)) return { error: "Die Athleten-ID beginnt mit i, gefolgt von Ziffern (z. B. i123456)." };
  if (key.length < 10) return { error: "Bitte den API-Schlüssel aus intervals.icu einfügen." };
  try {
    const r = await connectIntervals(me.id, athlete, key);
    revalidatePath("/konto");
    return r.ok ? { ok: `Verbunden. ${r.items} Tage übernommen.` } : { error: r.message };
  } catch (e) { return { error: String(e.message || e) }; }
}

export async function disconnectDevice(form) {
  const me = await requireUser();
  await repo.removeConnection(me.id, "intervals");
  if (form.get("purge") === "on") await repo.clearDaily(me.id);
  revalidatePath("/konto");
}

export async function syncNow() {
  const me = await requireUser();
  const r = await syncUser(me.id);
  revalidatePath("/konto");
  return r;
}

// ---------- Admin ----------
export async function adminSettings(_prev, form) {
  await requireAdmin();
  const key = s(form, "apiKey"), cap = Number(s(form, "cap"));
  await repo.updateSettings((x) => {
    x.registrationOpen = form.get("registrationOpen") === "on";
    x.apps ||= {};
    const a = (x.apps.anthropic ||= {});
    if (key === "-") delete a.apiKey; else if (key) a.apiKey = encrypt(key);
    if (Number.isFinite(cap) && cap >= 0) a.monthlyCapUsd = cap;
    a.demoAi = form.get("demoAi") === "on";
    return x;
  });
  revalidatePath("/admin");
  return { ok: "Gespeichert." };
}

export async function adminSetRole(form) {
  const me = await requireAdmin();
  const id = String(form.get("id")), role = form.get("role") === "admin" ? "admin" : "user";
  if (id === me.id) return;
  await repo.updateUser(id, { role });
  revalidatePath("/admin");
}

export async function adminDeleteUser(form) {
  const me = await requireAdmin();
  const id = String(form.get("id"));
  if (id === me.id || form.get("confirm") !== "LÖSCHEN") return;
  await repo.deleteUser(id);
  revalidatePath("/admin");
}
