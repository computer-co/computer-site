import Button from "./ui/Button";
import { startsWithAgents as s } from "@/lib/content";

export default function StartsWithAgents() {
  return (
    <section id="solucoes" className="bg-paper">
      <div className="shell grid gap-14 py-24 md:grid-cols-[0.85fr_1.15fr] md:py-32">
        <div>
          <p className="eyebrow">{s.eyebrow}</p>
          <h2 className="mt-5 font-display text-[clamp(2rem,4vw,3rem)] font-normal leading-[1.08] tracking-[-0.015em]">
            {s.title}
          </h2>
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-muted">
            {s.description}
          </p>
          <div className="mt-8">
            <Button href={s.cta.href} variant="secondary">
              {s.cta.label}
            </Button>
          </div>
        </div>

        <ul className="flex flex-col">
          {s.items.map((item) => (
            <li
              key={item.n}
              className="grid grid-cols-[1fr_auto] items-start gap-6 border-t border-line py-7 last:border-b"
            >
              <p className="max-w-xl text-[17px] leading-snug text-ink">
                {item.text}
              </p>
              <span className="font-serif text-[15px] text-muted tabular-nums">
                {item.n}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
