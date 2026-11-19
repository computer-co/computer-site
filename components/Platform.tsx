import Button from "./ui/Button";
import ScrollTimeline from "./ScrollTimeline";
import { platform as p } from "@/lib/content";

export default function Platform() {
  return (
    <ScrollTimeline
      points={p.points}
      head={
        <div className="max-w-2xl">
          <p className="eyebrow">{p.eyebrow}</p>
          <h2 className="mt-5 font-display text-[clamp(2rem,4vw,3rem)] font-normal leading-[1.08] tracking-[-0.015em]">
            {p.title}
          </h2>
        </div>
      }
      footer={
        <div className="mt-12">
          <Button href={p.cta.href} variant="secondary">
            {p.cta.label}
          </Button>
        </div>
      }
    />
  );
}
