import type { Metadata } from "next";
import { Fraunces, Newsreader, Inter } from "next/font/google";
import "./globals.css";
import { siteUrl, entity, jsonLd } from "@/lib/seo";
import ContactFlow from "@/components/ContactFlow";

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

const description =
  "Agentes de IA que eliminam o trabalho repetitivo. Entendemos seu gargalo, construímos o agente, colocamos em produção.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "The Computer Company — Agentes de IA para empresas",
    template: "%s | The Computer Company",
  },
  description,
  applicationName: entity.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: entity.name,
    title: "The Computer Company — Agentes de IA para empresas",
    description,
    images: [{ url: "/images/hero.jpg", alt: "The Computer Company" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Computer Company — Agentes de IA para empresas",
    description,
    images: ["/images/hero.jpg"],
  },
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        {children}
        <ContactFlow />
      </body>
    </html>
  );
}
