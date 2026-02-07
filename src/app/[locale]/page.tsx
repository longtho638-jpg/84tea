import dynamic from "next/dynamic";
import { FeaturedProducts } from "@/components/home/featured-products";
import { ProcessSection } from "@/components/home/process-section";
import { CTASection } from "@/components/home/cta-section";
import { MainLayout, FooterSection } from "@/components/layout";

// Dynamic imports for heavy components
const HeroParallax = dynamic(
  () => import("@/components/ui/hero-parallax").then((mod) => ({ default: mod.HeroParallax })),
  { loading: () => null }
);

const StorySectionAnimated = dynamic(
  () => import("@/components/home/story-section-animated").then((mod) => ({ default: mod.StorySectionAnimated })),
  { loading: () => null }
);

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
