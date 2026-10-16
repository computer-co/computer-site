"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Reveal de texto amarrado ao scroll.
 * As palavras "acendem" (de uma opacidade baixa até 100%) conforme a frase
 * sobe pela viewport: rolar para baixo avança, rolar para cima reverte.
 * Fica 100% acesa por volta do momento em que a frase está centralizada.
 */
export default function ScrollRevealText({
  text,
  className = "",
  dimmed = 0.22,
  feather = 3,
}: {
  text: string;
  className?: string;
  dimmed?: number;
  feather?: number;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [progress, setProgress] = useState(0);

  const words = text.split(" ");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    const compute = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const center = rect.top + rect.height / 2;
      // p=0 quando o centro entra pela base da tela; p=1 um pouco antes de
      // centralizar — distribui o "acender" por ~meia tela de scroll.
      const p = (vh - center) / (vh * 0.55);
      setProgress(Math.min(1, Math.max(0, p)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    // recalcula depois que fontes/imagens assentam o layout
    const t1 = setTimeout(compute, 300);
    const t2 = setTimeout(compute, 1200);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      clearTimeout(t1);
      clearTimeout(t2);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // nº fracionário de palavras "acesas"; a borda preenche gradualmente (feather)
  const lit = progress * (words.length + feather);

  return (
    <p ref={ref} className={className} aria-label={text}>
      {words.map((word, i) => {
        const fill = Math.min(1, Math.max(0, (lit - i) / feather));
        const opacity = dimmed + (1 - dimmed) * fill;
        return (
          <span key={i} aria-hidden style={{ opacity }}>
            {word}
            {i < words.length - 1 ? " " : ""}
          </span>
        );
      })}
    </p>
  );
}
