import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import * as repo from "@/lib/repo";

export const dynamic = "force-dynamic";

export async function GET() {
  const me = await currentUser();
  if (!me) return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
  const conns = (await repo.getConnections(me.id)).map(({ access_token, ...c }) => c);
  const data = { exported_at: new Date().toISOString(), account: me, app: await repo.getState(me.id), devices: conns, device_days: await repo.getDaily(me.id) };
  return new NextResponse(JSON.stringify(data, null, 2), {
    headers: { "content-type": "application/json; charset=utf-8", "content-disposition": `attachment; filename="second-bloom-${new Date().toISOString().slice(0, 10)}.json"` },
  });
}
