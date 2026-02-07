import { HeroParallax } from "@/components/ui/hero-parallax";
import { StorySectionAnimated } from "@/components/home/story-section-animated";
import { FeaturedProducts } from "@/components/home/featured-products";
import { ProcessSection } from "@/components/home/process-section";
import { CTASection } from "@/components/home/cta-section";
import { MainLayout, FooterSection } from "@/components/layout";

export default function Home() {
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <MainLayout>
        <HeroParallax />
        <StorySectionAnimated />
        <FeaturedProducts />
        <ProcessSection />
        <CTASection />
        <FooterSection />
      </MainLayout>
    </div>
  );
}
