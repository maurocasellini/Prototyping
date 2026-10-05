"use client";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

function Submit({ label, pending: pendingLabel, kind }) {
  const { pending } = useFormStatus();
  return <button className={`btn ${kind || ""}`} type="submit" disabled={pending}>{pending ? pendingLabel || "Einen Moment …" : label}</button>;
}

// Formular mit Server-Aktion: zeigt Fehler und Bestätigung direkt darunter.
export default function Form({ action, submit, pending, kind, children, className = "form" }) {
  const [state, act] = useActionState(action, null);
  return (
    <form action={act} className={className}>
      {children}
      {state?.error && <p className="msg err" role="alert">{state.error}</p>}
      {state?.ok && <p className="msg ok" role="status">{state.ok}</p>}
      <Submit label={submit} pending={pending} kind={kind} />
    </form>
  );
}
