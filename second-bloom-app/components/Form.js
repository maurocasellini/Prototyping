"use client";
import { useActionState, startTransition } from "react";

// Formular mit Server-Aktion: zeigt Fehler und Bestätigung direkt darunter.
// Absenden über onSubmit, damit die Eingaben bei einem Fehler stehen bleiben (React leert Formulare sonst nach jeder Aktion).
export default function Form({ action, submit, pending: pendingLabel, kind, children, className = "form" }) {
  const [state, act, pending] = useActionState(action, null);
  const onSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(() => act(fd));
  };
  return (
    <form onSubmit={onSubmit} className={className}>
      {children}
      {state?.error && <p className="msg err" role="alert">{state.error}</p>}
      {state?.ok && <p className="msg ok" role="status">{state.ok}</p>}
      <button className={`btn ${kind || ""}`} type="submit" disabled={pending}>{pending ? pendingLabel || "Einen Moment …" : submit}</button>
    </form>
  );
}
