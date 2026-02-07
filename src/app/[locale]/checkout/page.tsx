import { getTranslations } from "next-intl/server";
import { generatePageMetadata } from "@/lib/metadata";
import CheckoutContent from "./checkout-content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Checkout" });

  return generatePageMetadata({
    title: t("title"),
    description: t("title"), // Checkout pages usually don't need rich description
    path: "/checkout",
    locale,
    type: "website",
  });
}

export default function CheckoutPage() {
  return <CheckoutContent />;
}
