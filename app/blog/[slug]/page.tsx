import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import Button from "@/components/ui/Button";
import { getPosts, getPost, renderMarkdown, formatDate, extractFaq } from "@/lib/blog";
import { contactHash } from "@/lib/content";
import { siteUrl, entity } from "@/lib/seo";

export const dynamicParams = false;

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
}

export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  return {
    title: post.seoTitle ? { absolute: post.seoTitle } : post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: `/blog/${post.slug}`,
      publishedTime: post.date,
      authors: [post.author],
    },
    robots: post.draft ? { index: false } : undefined,
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const post = getPost((await params).slug);
  if (!post) notFound();

  const faq = extractFaq(post.body);
  const blogPosting = {
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    inLanguage: "pt-BR",
    url: `${siteUrl}/blog/${post.slug}`,
    author: { "@type": "Person", "@id": `${siteUrl}/#founder`, name: post.author },
    publisher: { "@id": `${siteUrl}/#organization`, name: entity.name },
  };
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": faq.length
      ? [
          blogPosting,
          {
            "@type": "FAQPage",
            mainEntity: faq.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          },
        ]
      : [blogPosting],
  };

  return (
    <>
      <SiteHeader />
      <main className="shell py-20 md:py-28">
        <article className="mx-auto max-w-[680px]">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
            }}
          />
          <nav className="flex items-center gap-2 text-[13px] text-muted">
            <Link href="/blog" className="transition-colors hover:text-ink">
              Blog
            </Link>
            {post.category && (
              <>
                <span>/</span>
                <span className="text-ink">{post.category}</span>
              </>
            )}
            {post.draft && <span className="ml-2 text-accent">rascunho</span>}
          </nav>

          <h1 className="mt-6 text-[clamp(2.1rem,4.4vw,3.3rem)] font-semibold leading-[1.08] tracking-[-0.035em]">
            {post.title}
          </h1>
          <p className="mt-5 text-[19px] leading-relaxed text-muted">{post.description}</p>
          <div className="mt-8 flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-ink text-[13px] font-medium text-paper">
              {initials(post.author)}
            </span>
            <div className="text-[13px] leading-tight">
              <p className="font-medium text-ink">{post.author}</p>
              <p className="text-muted">
                <time dateTime={post.date}>{formatDate(post.date)}</time> · {post.readingMinutes} min
              </p>
            </div>
          </div>

          <div
            className="prose-computer prose-tech mt-12"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(post.body) }}
          />

          <div className="mt-14 flex justify-center">
            <Button href={contactHash} variant="primary">
              Falar com o time
            </Button>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
