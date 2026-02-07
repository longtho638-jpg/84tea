import { getTranslations } from "next-intl/server";
import { generatePageMetadata } from "@/lib/metadata";
import AboutContent from "./about-content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "About.Hero" });

  return generatePageMetadata({
    title: t("title"),
    description: t("desc"),
    path: "/about",
    locale,
    type: "article",
  });
}

export default function AboutPage() {
  return <AboutContent />;
}
