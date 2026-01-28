import HeroSection from "@/components/landing/hero-section";
import FeatureSection from "@/components/landing/features-section";
import HowItWorksSection from "@/components/landing/how-it-works-section";
import PricingSection from "@/components/landing/pricing-section";
import CTASection from "@/components/landing/cta-section";

export default function Home() {
  return (
    <main className="page-wrapper">
      <HeroSection />
      <FeatureSection />
      <HowItWorksSection />
      <PricingSection />
      <CTASection />
    </main>
  );
}
