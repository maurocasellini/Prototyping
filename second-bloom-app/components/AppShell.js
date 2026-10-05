import Script from "next/script";
import { SHELL } from "./shell";

// Die App selbst ist ein schlankes Vanilla-JS-Programm (public/sb-app.js). Diese Komponente liefert nur Gerüst und Startdaten.

export default function AppShell({ boot }) {
  return (
    <>
      <div className="app" id="app" dangerouslySetInnerHTML={{ __html: SHELL }} />
      <div id="sb-boot" hidden data-boot={JSON.stringify(boot)} />
      <Script src="/sb-app.js?v=12" strategy="afterInteractive" />
    </>
  );
}
