import { Playfair_Display, Inter } from "next/font/google";
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

export default function RootLayout({ children }) {
  return (
    <html lang="de-CH" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
