import dynamic from "next/dynamic";
import { FranchiseHero } from "@/components/franchise/franchise-hero";
import { MainLayout } from "@/components/layout/main-layout";
import { FooterSection } from "@/components/layout/footer-section";
import { getTranslations } from "next-intl/server";
import { generatePageMetadata } from "@/lib/metadata";

// Dynamic imports for below-fold sections
const FranchiseBenefits = dynamic(
  () => import("@/components/franchise/franchise-benefits").then((mod) => ({ default: mod.FranchiseBenefits })),
  { loading: () => null }
);
const FranchiseModels = dynamic(
  () => import("@/components/franchise/franchise-models").then((mod) => ({ default: mod.FranchiseModels })),
  { loading: () => null }
);
const FranchiseProcess = dynamic(
  () => import("@/components/franchise/franchise-process").then((mod) => ({ default: mod.FranchiseProcess })),
  { loading: () => null }
);
const FranchiseForm = dynamic(
  () => import("@/components/franchise/franchise-form").then((mod) => ({ default: mod.FranchiseForm })),
  { loading: () => null }
);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Franchise.Hero" });
  const tNav = await getTranslations({ locale, namespace: "Navigation" });

  return generatePageMetadata({
    title: `${tNav("franchise")} | 84tea - ${t("titleHighlight")}`,
    description: t("description"),
    path: "/franchise",
    locale,
    type: "website",
  });
}

export default function FranchisePage() {
  return (
    <MainLayout>
      <div className="bg-surface">
        <FranchiseHero />
        <FranchiseBenefits />
        <FranchiseModels />
        <FranchiseProcess />
        <FranchiseForm />
        <FooterSection />
      </div>
    </MainLayout>
  );
}
