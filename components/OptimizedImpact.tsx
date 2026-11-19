import { Sparkles, Layers, Boxes } from "lucide-react";
import { optimized as o } from "@/lib/content";

const icons = {
  sparkle: Sparkles,
  layers: Layers,
  boxes: Boxes,
} as const;

export default function OptimizedImpact() {
  return (
    <section className="border-t border-line bg-paper">
      <div className="shell py-24 md:py-32">
        <p className="eyebrow">{o.eyebrow}</p>
        <h2 className="mt-5 font-display text-[clamp(2rem,4vw,3rem)] font-normal leading-[1.08] tracking-[-0.015em]">
          {o.title}
        </h2>

        <div className="mt-16 grid md:grid-cols-3">
          {o.columns.map((col) => {
            const Icon = icons[col.icon as keyof typeof icons];
            return (
              <div
                key={col.title}
                className="salto -mt-px border border-line bg-paper p-9 first:mt-0 md:mt-0 md:-ml-px md:first:ml-0"
              >
                <Icon size={22} strokeWidth={1.4} className="salto-icon text-ink" />
                <h3 className="mt-6 font-serif text-[1.5rem] font-normal leading-snug">
                  {col.title}
                </h3>
                <p className="mt-4 text-[14px] leading-relaxed text-muted">
                  {col.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
