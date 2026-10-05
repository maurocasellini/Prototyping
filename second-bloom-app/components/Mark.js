// Das Blüten-Zeichen von Second Bloom (Kupfer-Verlauf nur im Zeichen, wie in der Frauenraum-CI)
export default function Mark({ size = 28 }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden="true">
      <defs><linearGradient id="sbg-r" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#8E1C2C" /><stop offset=".5" stopColor="#C94C2B" /><stop offset="1" stopColor="#E08A4F" /></linearGradient></defs>
      <g fill="none" stroke="url(#sbg-r)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 29V17" /><path d="M16 17c-5.5 0-9-4-9-10 4.5 0 7.5 2.4 9 6 1.5-3.6 4.5-6 9-6 0 6-3.5 10-9 10Z" /><path d="M16 13V4" />
        <path d="M16 24c-2.5 0-4.5-1.2-5.5-3.2M16 24c2.5 0 4.5-1.2 5.5-3.2" />
      </g>
    </svg>
  );
}
