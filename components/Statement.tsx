import ScrollRevealText from "./ScrollRevealText";
import { statement } from "@/lib/content";

export default function Statement() {
  return (
    <section className="bg-navy text-paper">
      <div className="shell py-28 md:py-36">
        <ScrollRevealText
          text={statement.text}
          className="max-w-5xl font-display text-[clamp(1.6rem,3.4vw,2.7rem)] font-normal leading-[1.28] tracking-[-0.01em]"
        />
      </div>
    </section>
  );
}
