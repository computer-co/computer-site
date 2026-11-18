// Blog em arquivos Markdown: content/blog/<slug>.md
// Frontmatter simples (chave: valor). `draft: true` só aparece em `npm run dev`.
import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";

const dir = path.join(process.cwd(), "content", "blog");

export type Post = {
  slug: string;
  title: string;
  seoTitle?: string; // title tag (SEO); se ausente, usa title
  description: string;
  category?: string; // ex.: "Guia" — aparece no caminho Blog / Categoria
  date: string; // AAAA-MM-DD
  author: string;
  draft: boolean;
  body: string;
  readingMinutes: number;
};

function parse(file: string): Post {
  const raw = fs.readFileSync(path.join(dir, file), "utf8").replace(/\r\n/g, "\n");
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) throw new Error(`Post sem frontmatter: ${file}`);
  const meta: Record<string, string> = {};
  for (const line of m[1].split("\n")) {
    const i = line.indexOf(":");
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^"(.*)"$/, "$1");
  }
  const body = m[2].trim();
  return {
    slug: file.replace(/\.md$/, ""),
    title: meta.title ?? "",
    seoTitle: meta.seoTitle || undefined,
    description: meta.description ?? "",
    category: meta.category || undefined,
    date: meta.date ?? "",
    author: meta.author ?? "Caio Saback",
    draft: meta.draft === "true",
    body,
    readingMinutes: Math.max(1, Math.round(body.split(/\s+/).length / 200)),
  };
}

const showDrafts = process.env.NODE_ENV === "development";

export function getPosts(): Post[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map(parse)
    .filter((p) => showDrafts || !p.draft)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(slug: string): Post | undefined {
  return getPosts().find((p) => p.slug === slug);
}

export function renderMarkdown(md: string): string {
  const html = marked.parse(md, { async: false }) as string;
  // Checklists marcáveis: tira o "disabled" do marked e envolve item + texto num <label>
  // para o clique no texto também marcar a caixinha.
  return html.replace(
    /<li><input disabled="" type="checkbox">([\s\S]*?)<\/li>/g,
    '<li><label><input type="checkbox">$1</label></li>',
  );
}

// Extrai perguntas/respostas da seção "## Perguntas frequentes" (### pergunta + parágrafos).
export function extractFaq(md: string): { q: string; a: string }[] {
  const sec = md.split(/^## Perguntas frequentes\s*$/m)[1];
  if (!sec) return [];
  const body = sec.split(/^## /m)[0];
  return body
    .split(/^### /m)
    .slice(1)
    .map((chunk) => {
      const [q, ...rest] = chunk.split("\n");
      const a = rest.join(" ").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/[*_`]/g, "").replace(/\s+/g, " ").trim();
      return { q: q.trim(), a };
    })
    .filter((f) => f.q && f.a);
}

export function formatDate(date: string): string {
  return new Date(`${date}T12:00:00`).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
