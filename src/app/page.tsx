import { DSLShowcaseSection } from "@/components/DSLShowcaseSection";
import { FAQSection } from "@/components/FAQSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { Navbar } from "@/components/Navbar";
import { PricingSection } from "@/components/PricingSection";
import { TemplatesGallerySection } from "@/components/TemplatesGallerySection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { CTASection } from "@/components/CTASection";
export default function Home() {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation */}
      <Navbar></Navbar>

      {/* Main Content */}
      <main className="flex flex-1 flex-col relative z-10">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <DSLShowcaseSection />
        <TemplatesGallerySection />
        <TestimonialsSection />
        <PricingSection />
        <FAQSection />
        <CTASection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
