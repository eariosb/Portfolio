import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Esneider Ríos",
  description: "Datos en decisiones, complejidad en claridad. Estadístico UNAL Medellín. Análisis bayesiano, ML, Shiny Apps, LegalTech.",
  themeColor: "#0A1128",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ backgroundColor: "#0A1128", color: "#F8FAFF" }}>
        {children}
      </body>
    </html>
  );
}
