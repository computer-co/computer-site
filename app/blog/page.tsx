import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import { getPosts, formatDate } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Textos da The Computer Company sobre agentes de IA, operações e o que aprendemos colocando IA para trabalhar em empresas reais.",
  alternates: { canonical: "/blog" },
};

// Capas alternam entre as cores da marca
const covers = ["bg-navy text-paper", "bg-beige text-ink", "bg-ink text-paper"];

export default function BlogIndex() {
  const posts = getPosts();

  return (
    <>
      <SiteHeader />
      <main className="shell py-20 md:py-28">
        <header className="mx-auto max-w-3xl text-center">
          <h1 className="font-display text-[clamp(2.4rem,5vw,4rem)] font-normal leading-[1.05] tracking-[-0.02em]">
            Para quem quer colocar agentes para trabalhar.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-[17px] leading-relaxed text-muted">
            Guias, ideias e bastidores sobre como usar agentes de IA para eliminar gargalos
            operacionais que drenam tempo e dinheiro.
          </p>
        </header>

        {posts.length === 0 ? (
          <p className="mt-20 text-center text-[16.5px] text-muted">Em breve.</p>
        ) : (
          <div className="mt-20 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
                <div
                  className={`flex aspect-[3/2] flex-col justify-between rounded-[var(--radius-md)] p-7 transition-transform duration-300 group-hover:-translate-y-1 md:p-8 ${covers[i % covers.length]}`}
                >
                  <span className="font-display text-[15px] italic opacity-70">c</span>
                  <h2 className="font-display text-[clamp(1.45rem,1.9vw,1.85rem)] leading-[1.1] tracking-[-0.015em]">
                    {post.title}
                  </h2>
                  <span className="text-[12px] uppercase tracking-[0.14em] opacity-60">
                    {post.readingMinutes} min
                  </span>
                </div>
                <p className="mt-5 text-[13px] text-muted">
                  <time dateTime={post.date}>{formatDate(post.date)}</time> ·{" "}
                  {post.readingMinutes} min de leitura
                  {post.draft && <span className="ml-2 text-accent">rascunho</span>}
                </p>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{post.description}</p>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
