import { Playfair_Display, Inter } from "next/font/google";
import { getLang, HTML_LANG, I18N_VERSION } from "@/lib/lang";
import "./globals.css";

const display = Playfair_Display({ subsets: ["latin"], weight: ["400", "500", "700"], style: ["normal", "italic"], variable: "--fd" });
const body = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600"], variable: "--fb" });

export const metadata = {
  title: "Second Bloom",
  description: "Begleiter für Perimenopause und Menopause: Ernährung, Krafttraining, Erholung, Zyklus und Mental Coaching.",
  appleWebApp: { capable: true, title: "Second Bloom", statusBarStyle: "default" },
  robots: { index: false },
};
export const viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#F6F1EE" };

export default async function RootLayout({ children }) {
  const lang = await getLang();
  return (
    <html lang={HTML_LANG[lang]} data-lang={lang} data-i18n-v={I18N_VERSION} className={`${display.variable} ${body.variable}${lang !== "de" ? " i18n-wait" : ""}`}>
      <head>{lang !== "de" && <script src={`/i18n.js?v=${I18N_VERSION}`} defer />}</head>
      <body>{children}</body>
    </html>
  );
}
