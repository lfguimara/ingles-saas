import type { Metadata } from "next";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage", weight: ["500", "700", "800"] });
const dm = DM_Sans({ subsets: ["latin"], variable: "--font-dm", weight: ["400", "500", "700"] });

export const metadata: Metadata = {
  title: "SpeakUp — Inglês com tutor de IA",
  description: "Aprenda inglês com e-books e pratique com o tutor Max, sua IA disponível 24h.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${bricolage.variable} ${dm.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
