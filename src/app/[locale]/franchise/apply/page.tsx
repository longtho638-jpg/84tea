import { getTranslations } from "next-intl/server";
import { generatePageMetadata } from "@/lib/metadata";
import FranchiseApplyContent from "./apply-content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "FranchiseApply" });

  return generatePageMetadata({
    title: t("title"),
    description: t("subtitle"),
    path: "/franchise/apply",
    locale,
    type: "website",
  });
}

export default function FranchiseApplyPage() {
  return <FranchiseApplyContent />;
}
