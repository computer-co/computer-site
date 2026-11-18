import Header from "./Header";
import { nav } from "@/lib/content";
import { getPosts } from "@/lib/blog";

// O link "Blog" só aparece quando existe pelo menos um post publicado.
export default function SiteHeader() {
  const links = getPosts().length
    ? [...nav.links, { label: "Blog", href: "/blog" }]
    : nav.links;
  return <Header links={links} />;
}
