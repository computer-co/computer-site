import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";
import { getPosts } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPosts();
  const home: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
  ];
  if (!posts.length) return home;

  return [
    ...home,
    {
      url: `${siteUrl}/blog`,
      lastModified: new Date(posts[0].date),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...posts.map((p) => ({
      url: `${siteUrl}/blog/${p.slug}`,
      lastModified: new Date(p.date),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
