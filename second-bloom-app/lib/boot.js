// Startdaten für die App-Seite: Zustand, Gerätewerte (eingeordnet) und ob die KI bereitsteht.
import * as repo from "./repo";
import { summarize } from "./wellness";
import { demoRows } from "./demowear";
import { aiConfig } from "./ai";

const today = () => new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Zurich" });

export async function wearFor(userId, state) {
  const conn = await repo.getConnection(userId, "intervals");
  const rows = await repo.getDaily(userId);
  const st = state === undefined ? await repo.getState(userId) : state;
  return summarize(rows, st, today(), { connected: Boolean(conn), provider: conn ? "intervals.icu" : null, lastSync: conn?.last_sync_at || null, error: conn?.last_error || null });
}

export async function bootUser(user) {
  const state = await repo.getState(user.id);
  const cfg = await aiConfig();
  return { mode: "user", user: { name: user.name, email: user.email, role: user.role }, state, wear: await wearFor(user.id, state), ai: Boolean(cfg.key && state?.consent?.ai !== false) };
}

export async function bootDemo() {
  const cfg = await aiConfig().catch(() => ({ key: "", demoAi: false }));
  return { mode: "demo", user: null, state: null, wear: summarize(demoRows(today()), null, today(), { connected: true, demo: true, provider: "Beispieldaten (Garmin)" }), ai: Boolean(cfg.key && cfg.demoAi) };
}

