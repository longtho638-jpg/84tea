import { FranchiseHero } from "@/components/franchise/franchise-hero";
import { FranchiseBenefits } from "@/components/franchise/franchise-benefits";
import { FranchiseModels } from "@/components/franchise/franchise-models";
import { FranchiseProcess } from "@/components/franchise/franchise-process";
import { FranchiseForm } from "@/components/franchise/franchise-form";
import { MainLayout } from "@/components/layout/main-layout";
import { FooterSection } from "@/components/layout/footer-section";
import { getTranslations } from "next-intl/server";
import { generatePageMetadata } from "@/lib/metadata";

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
