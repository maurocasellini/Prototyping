// Alle Datenzugriffe. Ablage pro Konto getrennt (privater Blob-Speicher, siehe store.js):
//   db/users.json, db/settings.json, db/ai_usage.json, db/ai_daily.json
//   db/u/<id>/state.json        App-Zustand (Profil, Check-ins, Ernährung, Training, Mental …)
//   db/u/<id>/connections.json  Geräte-Verbindungen, Schlüssel AES-256-GCM verschlüsselt
//   db/u/<id>/daily.json        Tageswerte der Geräte (Schlaf, HRV, Ruhepuls, Schritte, Zyklus …)
import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { read, update, write, removePrefix } from "./store";

const now = () => new Date().toISOString();
const uid = () => crypto.randomUUID();
const U = (id, f) => `u/${id}/${f}.json`;

// ---------- Konten ----------
// Wie bei Formstand: Gibt es noch keine Konten, wird das Start-Konto ADMIN / ADMIN angelegt (muss beim ersten Login das Passwort ändern).
const SEED = [{ username: "ADMIN", name: "Admin", password: "ADMIN", role: "admin" }];

export async function listUsers() {
  let users = await read("users.json", []);
  if (!users.length) {
    users = await update("users.json", [], async (cur) => {
      if (cur.length) return cur;
      const out = [];
      for (const s of SEED) out.push({ id: uid(), username: s.username, email: null, name: s.name, role: s.role, password_hash: await bcrypt.hash(s.password, 11), sver: 1, must_change: true, created_at: now() });
      return out;
    });
  }
  return users;
}
export const publicUser = (u) => u && { id: u.id, username: u.username || null, email: u.email, name: u.name, role: u.role, sver: u.sver, must_change: Boolean(u.must_change), created_at: u.created_at };

export async function getUser(id) { return (await listUsers()).find((u) => u.id === id) || null; }
// Anmelden mit Benutzername (z. B. ADMIN) oder E-Mail
export async function findUserByLogin(login) {
  const l = String(login || "").trim().toLowerCase();
  if (!l) return null;
  return (await listUsers()).find((u) => (u.username && u.username.toLowerCase() === l) || (u.email && u.email === l)) || null;
}
export async function createUser({ name, email, password }) {
  await listUsers(); // legt bei Bedarf zuerst das Start-Konto ADMIN an
  const hash = await bcrypt.hash(password, 11);
  let created = null;
  await update("users.json", [], (users) => {
    if (users.some((u) => u.email === email)) throw new Error("Zu dieser E-Mail gibt es schon ein Konto.");
    created = { id: uid(), username: null, email, name, role: "user", password_hash: hash, sver: 1, must_change: false, created_at: now() };
    users.push(created);
  });
  return created;
}
export async function updateUser(id, patch) {
  let out = null;
  await update("users.json", [], (users) => { const u = users.find((x) => x.id === id); if (u) { Object.assign(u, patch); out = u; } });
  return out;
}
export async function setPassword(id, password) {
  return updateUser(id, { password_hash: await bcrypt.hash(password, 11), must_change: false, sver: Date.now() });
}
export const checkPassword = (pw, hash) => bcrypt.compare(String(pw || ""), hash);
export async function deleteUser(id) {
  await update("users.json", [], (users) => users.filter((u) => u.id !== id));
  await removePrefix(`u/${id}/`);
}

// ---------- Einstellungen ----------
// launched: false = Stufe 1 (nur Landingpage mit Warteliste), true = App öffentlich (Registrierung, Demo-Links)
const SETTINGS = { registrationOpen: true, launched: false, apps: {} };
export const isLive = (s) => s?.launched === true;
export const getSettings = () => read("settings.json", SETTINGS);
export const updateSettings = (fn) => update("settings.json", SETTINGS, fn);

// ---------- Warteliste (Stufe 1) ----------
export const getWaitlist = () => read("waitlist.json", []);
export async function addToWaitlist(entry) {
  let added = false;
  await update("waitlist.json", [], (list) => {
    if (list.some((x) => x.email === entry.email)) return list;
    added = true;
    list.push(entry);
    return list.slice(-20000);
  });
  return added;
}
export const removeFromWaitlist = (email) => update("waitlist.json", [], (list) => list.filter((x) => x.email !== email));

// ---------- App-Zustand ----------
export const getState = (userId) => read(U(userId, "state"), null);
export const saveState = (userId, state) => write(U(userId, "state"), { ...state, saved_at: now() });
export const patchState = (userId, fn) => update(U(userId, "state"), {}, fn);

// ---------- Geräte ----------
export const getConnections = (userId) => read(U(userId, "connections"), []);
export async function getConnection(userId, provider) { return (await getConnections(userId)).find((c) => c.provider === provider) || null; }
export async function saveConnection(userId, provider, patch) {
  let out;
  await update(U(userId, "connections"), [], (list) => {
    let c = list.find((x) => x.provider === provider);
    if (!c) { c = { provider, created_at: now() }; list.push(c); }
    Object.assign(c, patch);
    out = c;
  });
  return out;
}
export const removeConnection = (userId, provider) => update(U(userId, "connections"), [], (l) => l.filter((c) => c.provider !== provider));

export const getDaily = (userId) => read(U(userId, "daily"), []);
// Upsert je Tag; die letzten 400 Tage bleiben.
export async function upsertDaily(userId, rows) {
  if (!rows.length) return;
  await update(U(userId, "daily"), [], (list) => {
    const idx = new Map(list.map((d, i) => [d.day, i]));
    for (const r of rows) {
      if (idx.has(r.day)) { const cur = list[idx.get(r.day)]; for (const [k, v] of Object.entries(r)) if (v != null) cur[k] = v; }
      else { idx.set(r.day, list.length); list.push({ ...r }); }
    }
    list.sort((a, b) => (a.day < b.day ? -1 : 1));
    return list.slice(-400);
  });
}
export const clearDaily = (userId) => write(U(userId, "daily"), []);

export { write };
