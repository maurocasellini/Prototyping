// Anmeldung mit signiertem Cookie (wie Formstand): Konto-ID + Version (wird bei Passwortwechsel ungültig) + Ablauf.
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import crypto from "node:crypto";
import { getUser, publicUser } from "./repo";
import { hasStore } from "./store";

const COOKIE = "sb_session";
const DAYS = 60;

function secret() {
  const s = process.env.SESSION_SECRET || process.env.ENCRYPTION_KEY;
  if (!s) throw new Error("SESSION_SECRET oder ENCRYPTION_KEY fehlt");
  return s;
}
const sign = (data) => crypto.createHmac("sha256", secret()).update(data).digest("base64url");

export async function createSession(user) {
  const exp = Date.now() + DAYS * 864e5;
  const body = Buffer.from(JSON.stringify({ u: user.id, v: user.sver, e: exp })).toString("base64url");
  (await cookies()).set(COOKIE, `${body}.${sign(body)}`, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", expires: new Date(exp) });
}

export async function destroySession() { (await cookies()).delete(COOKIE); }

export async function currentUser() {
  if (!hasStore) return null;
  const t = (await cookies()).get(COOKIE)?.value;
  if (!t || !t.includes(".")) return null;
  const [body, sig] = t.split(".");
  const expect = sign(body);
  if (sig.length !== expect.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expect))) return null;
  let s; try { s = JSON.parse(Buffer.from(body, "base64url").toString()); } catch { return null; }
  if (!s.e || s.e < Date.now()) return null;
  const u = await getUser(s.u);
  if (!u || u.sver !== s.v) return null;
  return publicUser(u);
}

export async function requireUser() {
  const u = await currentUser();
  if (!u) redirect("/login");
  return u;
}
export async function requireAdmin() {
  const u = await requireUser();
  if (u.role !== "admin") redirect("/app");
  return u;
}
