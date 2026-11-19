"use client";

import { useEffect, useRef } from "react";
import Button from "./ui/Button";
import { hero } from "@/lib/content";

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
// abertura do ponto: quase constante, só desacelera de leve no fim (sem arrancada)
const open = (t: number) => 1 - Math.pow(1 - t, 1.5);

/**
 * Hero "ponto que abre" (desktop). O vídeo toca sozinho em loop; a seção fica
 * presa e a rolagem:
 *  1. a página começa só com um ponto preto no centro (sem header); o ponto
 *     abre em círculo até a tela cheia e header, título e vídeo aparecem juntos;
 *  2. segura a tela cheia com o título;
 *  3. retrai de volta ao card arredondado com margem; a página segue.
 * Tudo é amortecido: a animação persegue a rolagem em vez de pular.
 * Mobile ou "reduzir movimento": card normal, sem trava.
 * O layout de cada modo vem das mesmas media queries no CSS (.hero-pin).
 */
export default function Hero() {
  const pinRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pin = pinRef.current;
    const card = cardRef.current;
    const video = videoRef.current;
    const copy = copyRef.current;
    const cue = cueRef.current;
    if (!pin || !card || !video || !copy) return;

    video.play().catch(() => {});

    const mq = window.matchMedia(
      "(min-width: 768px) and (min-height: 640px) and (prefers-reduced-motion: no-preference)",
    );
    if (!mq.matches) return;

    const header = document.querySelector<HTMLElement>("header");
    const hdr = header?.offsetHeight ?? 76;
    pin.style.setProperty("--hdr", `${hdr}px`);

    let raf = 0;
    let smooth = -1;
    let auto = 0; // rAF da rolagem automática do clique (0 = parada)

    const target = () => {
      const r = pin.getBoundingClientRect();
      const track = r.height - window.innerHeight;
      return track > 0 ? clamp(-r.top / track) : 0;
    };

    const DOT = 4.5; // raio do ponto inicial (px)
    const DOT_STATE = 0.06; // até aqui a tela ainda é "o ponto" (clicável)

    const render = (p: number) => {
      const W = card.clientWidth;
      const H = card.clientHeight;
      // recuo final do card (px): laterais, topo, base e raio dos cantos
      const R = { side: 32, top: 24, bot: 44, radius: 26 };

      // fase 1: ponto -> círculo que cobre a tela | fase 3: tela cheia -> card com margem
      const grow = open(clamp(p / 0.35));
      // a retração termina em 83%: o resto da trava segura o card parado antes de a página descer
      const shrink = ease(clamp((p - 0.6) / 0.233));
      const side = mix(0, R.side, shrink);
      const top = mix(0, R.top, shrink); // o card segue por trás do header
      if (shrink <= 0) {
        const cover = Math.hypot(W, H) / 2; // círculo deste raio cobre o card inteiro
        card.style.clipPath = `circle(${mix(DOT, cover, grow)}px at 50% 50%)`;
      } else {
        const bot = mix(0, R.bot, shrink);
        card.style.clipPath = `inset(${top}px ${side}px ${bot}px ${side}px round ${mix(0, R.radius, shrink)}px)`;
      }

      // vídeo: invisível no ponto (o ponto é preto), surge e "assenta" ao abrir
      video.style.opacity = String(clamp(grow * 2.2));
      video.style.transform = `scale(${mix(1.18, 1, grow)})`;

      // título e vídeo aparecem durante a abertura
      const t = ease(clamp((p - 0.1) / 0.25));
      copy.style.opacity = String(t);
      copy.style.transform = `translateY(${mix(28, 0, t)}px)`;
      copy.style.pointerEvents = t < 0.5 ? "none" : "";

      // no estado de ponto, a tela toda é clicável (abre a sequência inteira)
      pin.style.cursor = p < DOT_STATE ? "pointer" : "";

      // setinha de rolagem: só no estado de ponto, some assim que a abertura começa
      if (cue) cue.style.opacity = String(1 - clamp(p / 0.05));

      // header: entra quando o círculo já cobre o topo da tela (texto branco
      // sobre o vídeo) e fica transparente enquanto o hero estiver por trás dele
      if (header) {
        const h = ease(clamp((grow - 0.72) / 0.28));
        header.style.opacity = String(h);
        header.style.transform = `translateY(${mix(-16, 0, h)}px)`;
        header.style.pointerEvents = h < 0.5 ? "none" : "";
        const under = pin.getBoundingClientRect().bottom - R.bot > hdr;
        // o conteúdo do header recua junto com o card, na mesma proporção
        header.style.setProperty("--hero-in", `${side}px`);
        header.style.setProperty("--hero-down", `${top}px`);
        if (under) header.dataset.onHero = "";
        else delete header.dataset.onHero;
      }
    };

    const tick = () => {
      raf = 0;
      const goal = target();
      if (smooth < 0) smooth = goal;
      // na rolagem a animação persegue a posição (suave); no clique ela já vem
      // cronometrada, então segue direto para não somar atraso
      smooth = auto ? goal : smooth + (goal - smooth) * 0.075; // menor = mais suave/lento
      if (Math.abs(goal - smooth) < 0.0005) smooth = goal;
      render(smooth);
      if (smooth !== goal) raf = requestAnimationFrame(tick);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    // clique no estado de ponto: rola sozinho até o fim da trava (expande, segura,
    // retrai e para no card). Qualquer gesto da pessoa no meio cancela.
    const stopAuto = () => {
      if (auto) cancelAnimationFrame(auto);
      auto = 0;
    };
    const onClick = () => {
      if (auto || target() >= DOT_STATE) return;
      const from = window.scrollY;
      const to = pin.offsetTop + pin.offsetHeight - window.innerHeight;
      // ritmo por fase (ms): abre (rápido), segura a tela cheia (10% mais rápida), retrai + pausa.
      // Cada fase já tem sua própria curva; aqui o avanço dentro dela é constante.
      const SEGMENTS = [
        { until: 0.35, ms: 650 },
        { until: 0.6, ms: 765 },
        { until: 1, ms: 1360 },
      ];
      const t0 = performance.now();
      const step = (now: number) => {
        let elapsed = now - t0;
        let k = 0;
        let start = 0;
        for (const seg of SEGMENTS) {
          if (elapsed <= seg.ms) {
            k = mix(start, seg.until, elapsed / seg.ms);
            break;
          }
          elapsed -= seg.ms;
          start = k = seg.until;
        }
        // "instant": o html tem scroll-behavior: smooth, que brigaria com a animação
        window.scrollTo({ top: mix(from, to, k), behavior: "instant" });
        auto = k < 1 ? requestAnimationFrame(step) : 0;
      };
      auto = requestAnimationFrame(step);
    };
    pin.addEventListener("click", onClick);
    window.addEventListener("wheel", stopAuto, { passive: true });
    window.addEventListener("touchstart", stopAuto, { passive: true });
    window.addEventListener("keydown", stopAuto);

    render(target());
    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", kick);
    return () => {
      stopAuto();
      pin.removeEventListener("click", onClick);
      window.removeEventListener("wheel", stopAuto);
      window.removeEventListener("touchstart", stopAuto);
      window.removeEventListener("keydown", stopAuto);
      pin.style.cursor = "";
      window.removeEventListener("scroll", kick);
      window.removeEventListener("resize", kick);
      if (raf) cancelAnimationFrame(raf);
      if (header) {
        header.style.opacity = "";
        header.style.transform = "";
        header.style.pointerEvents = "";
        delete header.dataset.onHero;
        header.style.removeProperty("--hero-in");
        header.style.removeProperty("--hero-down");
      }
    };
  }, []);

  return (
    <section ref={pinRef} id="top" className="hero-pin bg-paper">
      {/* wrapper com fundo da página: as margens deixam o "card" flutuar */}
      <div className="hero-stage px-3 pt-3 pb-5 md:px-4 md:pt-4 md:pb-7">
        {/* setinha fina indicando rolagem (só no modo "ponto que abre", via CSS) */}
        <div ref={cueRef} aria-hidden className="hero-cue">
          <svg width="14" height="28" viewBox="0 0 14 28" fill="none">
            <path d="M7 1v25M1.5 20.5 7 26l5.5-5.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div
          ref={cardRef}
          className="hero-card relative flex min-h-[84vh] items-center justify-center overflow-hidden rounded-[14px] bg-[#10171f] md:rounded-[18px]"
        >
          {/* vídeo de fundo: mudo, em loop, sem controles; o poster aparece enquanto carrega */}
          <video
            ref={videoRef}
            className="hero-zoom absolute inset-0 h-full w-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster={hero.video.poster}
            aria-hidden="true"
          >
            <source src={hero.video.webm} type='video/webm; codecs="av01.0.08M.08"' />
            <source src={hero.video.mp4} type="video/mp4" />
          </video>
          {/* overlay escuro para legibilidade do texto branco */}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.5),rgba(0,0,0,0.62))]" />

          <div ref={copyRef} className="hero-copy shell relative z-10 flex flex-col items-center text-center">
            <h1 className="rise max-w-5xl font-display text-[clamp(2.4rem,6vw,5.25rem)] font-light leading-[1.04] tracking-[-0.02em] text-balance text-paper">
              {hero.title}
            </h1>
            <p
              className="rise mt-7 max-w-2xl text-[clamp(1rem,1.5vw,1.2rem)] leading-relaxed text-paper/80"
              style={{ animationDelay: "100ms" }}
            >
              {hero.subtitle}
            </p>
            <div className="rise mt-9" style={{ animationDelay: "200ms" }}>
              <Button href={hero.cta.href} variant="ghost-light">
                {hero.cta.label}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
