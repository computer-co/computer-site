"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Button from "./ui/Button";
import { nav, brand } from "@/lib/content";

function Wordmark() {
  return (
    <Link href="/" className="group flex min-w-0 items-center gap-2">
      <span
        aria-hidden
        className="grid h-7 w-7 shrink-0 place-items-center bg-ink font-serif text-[15px] italic leading-none text-paper sm:h-8 sm:w-8 sm:text-[17px]"
      >
        {brand.mark}
      </span>
      <span className="truncate font-serif text-[17px] tracking-tight sm:text-[22px]">
        {brand.name}
      </span>
    </Link>
  );
}

export default function Header({
  links,
}: {
  links: { label: string; href: string }[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-paper/95 pt-2 md:pt-3">
      <div className="shell relative flex h-16 items-center justify-between">
        <Wordmark />

        {/* nav centralizado — desktop */}
        <nav className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="text-[13px] text-muted transition-colors hover:text-ink"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* CTA — desktop */}
        <div className="hidden md:block">
          <Button href={nav.cta.href} variant="primary" className="px-5 py-2.5">
            {nav.cta.label}
          </Button>
        </div>

        {/* toggle — mobile */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          className="grid h-10 w-10 place-items-center text-ink md:hidden"
        >
          {open ? <X size={22} strokeWidth={1.75} /> : <Menu size={22} strokeWidth={1.75} />}
        </button>
      </div>

      {/* painel — mobile */}
      {open && (
        <div className="border-t border-line bg-paper md:hidden">
          <div className="shell flex flex-col py-4">
            {links.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="border-b border-line/60 py-3 text-[15px] text-ink"
              >
                {l.label}
              </Link>
            ))}
            <Button
              href={nav.cta.href}
              variant="primary"
              className="mt-4 w-full"
            >
              {nav.cta.label}
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
