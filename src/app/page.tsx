import Header from "@/components/layout/Header";
import HeroSection from "@/components/sections/HeroSection";
import BenefitsSection from "@/components/sections/BenefitsSection";
import ExamplesSection from "@/components/sections/ExamplesSection";
import UseCasesSection from "@/components/sections/UseCasesSection";
import EcosystemSection from "@/components/sections/EcosystemSection";
import CtaSection from "@/components/sections/CtaSection";
import Footer from "@/components/sections/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <BenefitsSection />
        <ExamplesSection />
        <UseCasesSection />
        <EcosystemSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}