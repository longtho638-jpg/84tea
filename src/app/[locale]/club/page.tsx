import { getTranslations } from "next-intl/server";
import { generatePageMetadata } from "@/lib/metadata";
import ClubContent from "./club-content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Club.Hero" });

  return generatePageMetadata({
    title: t("title"),
    description: t("description"),
    path: "/club",
    locale,
    type: "website",
  });
}

export default function ClubPage() {
  return <ClubContent />;
}
