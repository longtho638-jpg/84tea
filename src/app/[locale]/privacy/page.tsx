import { getTranslations } from "next-intl/server";
import { generatePageMetadata } from "@/lib/metadata";
import PrivacyContent from "./privacy-content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Privacy" });

  return generatePageMetadata({
    title: t("title"),
    description:
      locale === "vi"
        ? "Chính sách bảo mật thông tin cá nhân của 84tea"
        : "84tea personal data privacy policy",
    path: "/privacy",
    locale,
    type: "article",
  });
}

export default function PrivacyPage() {
  return <PrivacyContent />;
}
