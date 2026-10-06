// Das Frauenraum-Zeichen (Figur, S und Unendlichkeitsschleife; Kupfer-Verlauf nur im Zeichen, wie in der CI)
export default function Mark({ size = 40 }) {
  return <img src="/frauenraum.webp?v=1" alt="" aria-hidden="true" className="mark" height={size} width={Math.round(size * 394 / 530)} />;
}
