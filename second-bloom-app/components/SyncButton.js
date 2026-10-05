"use client";
import { useState, useTransition } from "react";

export default function SyncButton({ action }) {
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState(null);
  return (
    <div className="row wrap">
      <button className="btn" type="button" disabled={pending} onClick={() => start(async () => { const r = await action(); setMsg(r.ok ? `Abgeglichen: ${r.items} Tage.` : r.message); })}>
        {pending ? "Gleiche ab …" : "Jetzt abgleichen"}
      </button>
      {msg && <span className="small muted">{msg}</span>}
    </div>
  );
}
