import { encrypt, decrypt } from "./crypto";
import * as intervals from "./intervals";
import * as repo from "./repo";

export async function connectIntervals(userId, athleteId, key) {
  const v = await intervals.verify(athleteId, key);
  await repo.saveConnection(userId, "intervals", { external_id: v.external_id, name: v.name, access_token: encrypt(key), last_error: null, last_sync_at: null });
  return syncUser(userId, { full: true });
}

// Erster Abgleich: 120 Tage (genug für Zyklus und 28-Tage-Normalwerte), danach die letzten 5 Tage.
export async function syncConnection(userId, conn, { full = false } = {}) {
  const since = full || !conn.last_sync_at ? new Date(Date.now() - 120 * 864e5) : new Date(new Date(conn.last_sync_at).getTime() - 5 * 864e5);
  try {
    const rows = await intervals.fetchSince(decrypt(conn.access_token), conn.external_id, since);
    await repo.upsertDaily(userId, rows);
    await repo.saveConnection(userId, conn.provider, { last_sync_at: new Date().toISOString(), last_error: null });
    return { ok: true, items: rows.length };
  } catch (e) {
    const msg = String(e.message || e).slice(0, 300);
    await repo.saveConnection(userId, conn.provider, { last_error: msg });
    return { ok: false, items: 0, message: msg };
  }
}

export async function syncUser(userId, opts) {
  const out = [];
  for (const c of await repo.getConnections(userId)) if (c.provider === "intervals") out.push(await syncConnection(userId, c, opts));
  return out[0] || { ok: false, items: 0, message: "Kein Gerät verbunden." };
}

export async function syncAll() {
  let ok = 0, fail = 0;
  for (const u of await repo.listUsers()) {
    const conns = await repo.getConnections(u.id);
    for (const c of conns) { if (c.provider !== "intervals") continue; const r = await syncConnection(u.id, c); r.ok ? ok++ : fail++; }
  }
  return { ok, fail };
}
