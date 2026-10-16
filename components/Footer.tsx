import Link from "next/link";
import Logo from "./ui/Logo";
import { footer as f, brand } from "@/lib/content";

export default function Footer() {
  return (
    <footer className="mt-auto bg-navy text-paper">
      <div className="shell pt-20 pb-8">
        {/* linha enxuta: logo + apenas o exigido por lei */}
        <div className="flex flex-col gap-5 pb-10 lg:flex-row lg:items-center lg:justify-between">
          <Logo size={24} tone="light" name={brand.name} />
          <nav className="flex flex-wrap gap-x-7 gap-y-2">
            {f.legal.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="text-[13px] text-paper/65 transition-colors hover:text-paper"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* marca dominando o footer */}
        <div className="pt-10">
          <span
            aria-label={brand.footerName}
            className="block select-none font-display text-[clamp(4.5rem,17vw,17rem)] font-light leading-[0.82] tracking-[-0.04em] text-paper"
          >
            {brand.footerName.split(" ").map((word, index) => (
              <span key={`${word}-${index}`} className="block sm:inline">
                {word}
                {index < brand.footerName.split(" ").length - 1 ? " " : ""}
              </span>
            ))}
          </span>
        </div>

        <p className="mt-6 text-[12px] text-paper/45">{brand.copyright}</p>
      </div>
    </footer>
  );
}
