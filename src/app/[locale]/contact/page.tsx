import { getTranslations } from "next-intl/server";
import { generatePageMetadata } from "@/lib/metadata";
import ContactContent from "./contact-content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Contact.Hero" });

  return generatePageMetadata({
    title: t("label"),
    description: t("desc"),
    path: "/contact",
    locale,
    type: "website",
  });
}

export default function ContactPage() {
  return <ContactContent />;
}
