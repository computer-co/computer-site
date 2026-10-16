import Button from "./ui/Button";
import { finalCta as f } from "@/lib/content";

export default function FinalCTA() {
  return (
    <section id="agendar" className="bg-beige">
      <div className="shell flex flex-col items-center py-28 text-center md:py-36">
        <h2 className="whitespace-nowrap font-display text-[clamp(1.2rem,5vw,3.4rem)] font-normal leading-[1.08] tracking-[-0.015em]">
          {f.title}
        </h2>
        <div className="mt-10">
          <Button href={f.cta.href} variant="primary">
            {f.cta.label}
          </Button>
        </div>
      </div>
    </section>
  );
}
