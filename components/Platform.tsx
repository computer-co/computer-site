import Button from "./ui/Button";
import { platform as p } from "@/lib/content";

export default function Platform() {
  return (
    <section id="produto" className="bg-beige">
      <div className="shell py-24 md:py-32">
        <div className="max-w-2xl">
          <p className="eyebrow">{p.eyebrow}</p>
          <h2 className="mt-5 font-display text-[clamp(2rem,4vw,3rem)] font-normal leading-[1.08] tracking-[-0.015em]">
            {p.title}
          </h2>
        </div>

        <dl className="mt-14 grid gap-x-10 gap-y-10 border-t border-line/70 pt-10 md:grid-cols-3">
          {p.points.map((pt) => (
            <div key={pt.title}>
              <dt className="font-display text-[clamp(1.25rem,2vw,1.5rem)] font-normal leading-snug text-ink">
                {pt.title}
              </dt>
              <dd className="mt-3 text-[14px] leading-relaxed text-muted">
                {pt.description}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-12">
          <Button href={p.cta.href} variant="secondary">
            {p.cta.label}
          </Button>
        </div>
      </div>
    </section>
  );
}
