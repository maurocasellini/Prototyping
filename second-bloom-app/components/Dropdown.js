"use client";
import { useEffect, useRef } from "react";

// Aufklappmenü auf Basis von <details>: schliesst bei Klick ausserhalb, auf einen Link oder mit Escape
export default function Dropdown({ className = "", label, summary, children }) {
  const ref = useRef(null);
  useEffect(() => {
    const close = (e) => {
      const d = ref.current;
      if (!d?.open) return;
      if (e.type === "keydown" ? e.key === "Escape" : !d.contains(e.target) || e.target.closest("a")) d.open = false;
    };
    document.addEventListener("click", close);
    document.addEventListener("keydown", close);
    return () => { document.removeEventListener("click", close); document.removeEventListener("keydown", close); };
  }, []);
  return (
    <details ref={ref} className={`dd ${className}`}>
      <summary aria-label={label}>{summary}</summary>
      <div className="dd-panel">{children}</div>
    </details>
  );
}
