import { CTASection } from "@/components/CTASection";
import { FAQSection } from "@/components/FAQSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { Navbar } from "@/components/Navbar";
import { PricingSection } from "@/components/PricingSection";
import { TemplatesGallerySection } from "@/components/TemplatesGallerySection";
import { TestimonialsSection } from "@/components/TestimonialsSection";

export default function Home() {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
      {/* Background Gradient */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-transparent dark:from-indigo-500/20 dark:via-purple-500/20 -z-10"></div>

      {/* Navigation */}
      <Navbar></Navbar>

      {/* Main Content */}
      <main className="flex flex-1 flex-col">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
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
