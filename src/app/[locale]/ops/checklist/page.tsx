import { getTranslations } from "next-intl/server";
import { generatePageMetadata } from "@/lib/metadata";
import ChecklistContent from "./checklist-content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Ops" });

  return generatePageMetadata({
    title: "Checklist Hàng Ngày", // Ideally localized if we add it to messages
    description: t("description"),
    path: "/ops/checklist",
    locale,
    type: "website",
  });
}

export default function ChecklistPage() {
  return <ChecklistContent />;
}
