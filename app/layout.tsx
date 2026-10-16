import type { Metadata } from "next";
import { Fraunces, Newsreader, Inter } from "next/font/google";
import "./globals.css";

// Serif display elegante (com optical sizing) para os títulos
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

// Serif de texto para detalhes menores (cards, números, wordmark)
const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Computer Company — Agentes de IA para empresas",
  description:
    "Agentes de IA que eliminam o trabalho repetitivo. Entendemos seu gargalo, construímos o agente, colocamos em produção.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${fraunces.variable} ${newsreader.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink">
        {children}
      </body>
    </html>
  );
}
