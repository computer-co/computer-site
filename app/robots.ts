import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

// Liberado para buscadores e crawlers de IA (busca e citação). Ver areas/marketing/geo/.
const aiAndSearchBots = [
  "Googlebot",
  "Bingbot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "GPTBot",
  "Claude-SearchBot",
  "Claude-User",
  "ClaudeBot",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: aiAndSearchBots, allow: "/" },
      { userAgent: "*", allow: "/" },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
