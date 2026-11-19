"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Point = { title: string; description: string };

/**
 * Metodologia: linha do tempo com progresso de rolagem ("um ponto percorre a rota").
 * Desktop: a seção fica presa (sticky) enquanto a linha navy atravessa o divisor;
 * cada um dos 3 pontos, centrado na sua coluna, acende quando a linha chega nele.
 * Só depois de completar a página volta a rolar.
 * Mobile (ou tela baixa): sem trava; trilho vertical acompanha a rolagem.
 */
export default function ScrollTimeline({
  points,
  head,
  footer,
}: {
  points: Point[];
  head: ReactNode;
  footer: ReactNode;
}) {
  const pinRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDListElement>(null);
  const [lit, setLit] = useState(0);

  useEffect(() => {
    const pin = pinRef.current;
    const list = listRef.current;
    if (!pin || !list) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pinned = window.matchMedia("(min-width: 768px) and (min-height: 640px)");
    let raf = 0;

    const compute = () => {
      raf = 0;
      const dots = Array.from(list.querySelectorAll<HTMLElement>(".rota-dot"));
      if (reduce.matches) {
        list.style.setProperty("--p", "1");
        setLit(dots.length);
        return;
      }
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const lr = list.getBoundingClientRect();
      let p: number;
      let thresholds: number[];
      if (pinned.matches) {
        // progresso = quanto da "pista" extra da seção presa já foi rolado
        const pr = pin.getBoundingClientRect();
        const track = pr.height - vh;
        p = track > 0 ? -pr.top / track : 1;
        thresholds = dots.map((d) => {
          const r = d.getBoundingClientRect();
          return (r.left + r.width / 2 - lr.left) / lr.width;
        });
      } else {
        // a ponta da linha acompanha a altura de 60% da tela
        p = (vh * 0.6 - lr.top) / lr.height;
        thresholds = dots.map((d) => {
          const r = d.getBoundingClientRect();
          return (r.top + r.height / 2 - lr.top) / lr.height;
        });
      }
      p = Math.min(1, Math.max(0, p));
      list.style.setProperty("--p", p.toFixed(4));
      setLit(thresholds.filter((t) => p > 0 && p >= t - 0.002).length);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    const t = setTimeout(compute, 400);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      clearTimeout(t);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={pinRef} id="produto" className="rota-pin bg-beige">
      <div className="rota-stage">
        <div className="shell w-full py-24 md:py-0">
          {head}
          <dl ref={listRef} className="rota mt-14 grid gap-x-10 gap-y-10 md:grid-cols-3">
            <span aria-hidden className="rota-rail" />
            <span aria-hidden className="rota-run" />
            {points.map((pt, i) => (
              <div key={pt.title} className="rota-step" data-lit={i < lit || undefined}>
                <span aria-hidden className="rota-dot" />
                <dt className="font-display text-[clamp(1.25rem,2vw,1.5rem)] font-normal leading-snug text-ink">
                  {pt.title}
                </dt>
                <dd className="mt-3 text-[14px] leading-relaxed text-muted">{pt.description}</dd>
              </div>
            ))}
          </dl>
          {footer}
        </div>
      </div>
    </section>
  );
}
