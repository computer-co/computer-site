import { deployed as d } from "@/lib/content";

export default function DeployedRealWorld() {
  return (
    <section className="bg-paper">
      <div className="shell py-24 md:py-32">
        <div className="grid gap-8 md:grid-cols-2 md:items-end">
          <div>
            <p className="eyebrow">{d.eyebrow}</p>
            <h2 className="mt-5 font-display text-[clamp(2rem,4vw,3rem)] font-normal leading-[1.08] tracking-[-0.015em]">
              {d.title}
            </h2>
          </div>
          <p className="max-w-xl text-[15px] leading-relaxed text-muted">
            {d.description}
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          {d.cards.map((card) => (
            <article
              key={card.title}
              className="group relative flex aspect-[16/10] flex-col justify-end overflow-hidden border border-line"
              style={{ backgroundImage: card.bg }}
            >
              {/* textura tech sutil (grade fina) */}
              <div
                aria-hidden
                className="absolute inset-0 opacity-[0.10]"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(0deg, transparent 0 27px, rgba(255,255,255,0.6) 27px 28px), repeating-linear-gradient(90deg, transparent 0 27px, rgba(255,255,255,0.6) 27px 28px)",
                }}
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_25%,rgba(0,0,0,0.78))]" />

              <div className="relative p-7">
                <h3 className="max-w-md font-serif text-[clamp(1.25rem,2vw,1.6rem)] font-normal leading-snug text-paper">
                  {card.title}
                </h3>
                <p className="mt-3 max-w-sm text-[13px] leading-relaxed text-paper/70">
                  {card.subtitle}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
