import Image from "next/image";
import Button from "./ui/Button";
import { hero } from "@/lib/content";

export default function Hero() {
  return (
    // wrapper com fundo da página: as margens deixam o "card" flutuar
    <section id="top" className="bg-paper px-3 pt-3 pb-5 md:px-4 md:pt-4 md:pb-7">
      <div className="relative flex min-h-[84vh] items-center justify-center overflow-hidden rounded-[14px] bg-[#10171f] md:rounded-[18px]">
        <Image
          src={hero.image}
          alt={hero.imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* overlay escuro para legibilidade do texto branco */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.5),rgba(0,0,0,0.62))]" />

        <div className="shell relative z-10 flex flex-col items-center text-center">
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
    </section>
  );
}
