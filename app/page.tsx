import SiteHeader from "@/components/SiteHeader";
import Hero from "@/components/Hero";
import Statement from "@/components/Statement";
import StartsWithAgents from "@/components/StartsWithAgents";
import Platform from "@/components/Platform";
import OptimizedImpact from "@/components/OptimizedImpact";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <StartsWithAgents />
        <Statement />
        <Platform />
        <OptimizedImpact />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
