// Anmelden und Registrieren: links Marke und Nutzen (ab Laptop-Breite), rechts das Formular in einer Karte
export default function AuthLayout({ children }) {
  return (
    <div className="auth">
      <aside className="auth-side">
        <span className="eyebrow">Perimenopause · Menopause · danach</span>
        <div className="word">Second Bloom</div>
        <p className="lede">Deine zweite Lebenshälfte.<br />Klar, ruhig, begleitet.</p>
        <ul>
          <li>Hormone und Zyklus verstehen, mit Wissen für das Gespräch in der Praxis</li>
          <li>Proteinreiches Essen, abgestimmt auf deine Lebensphase, mit Wochenplan und Einkaufsliste</li>
          <li>Krafttraining, das sich an deinen Tag anpasst</li>
          <li>Mental Coaching bei Stimmungsschwankungen, Brain Fog und Druck im Job</li>
          <li>Optional: deine Gesundheitsdaten von Uhr oder Ring, gemessen an deiner eigenen Normalität</li>
        </ul>
        <div className="impulse"><span className="eyebrow">Impuls des Tages</span><p className="q">„Dein Körper baut nicht ab. Er baut um. Du darfst dabei mitbestimmen.“</p></div>
      </aside>
      <div className="auth-form"><div className="card">{children}</div></div>
    </div>
  );
}
