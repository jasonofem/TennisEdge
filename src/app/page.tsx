import { HeroSection, FeaturesSection, HowItWorksSection, CTASection, Footer } from "@/components/landing/landing-components";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CTASection />
      <Footer />
    </main>
  );
}