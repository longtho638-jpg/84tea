import { HeaderNavigation, FooterSection } from "@/components/layout";
import { getTranslations } from "next-intl/server";
import { generatePageMetadata } from "@/lib/metadata";
import CheckoutSuccessContent from "./success-content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Checkout.Success" });

  return generatePageMetadata({
    title: t("title"),
    description: t("message"),
    path: "/checkout/success",
    locale,
    type: "website",
    // prevent indexing of transaction results
    keywords: [],
  });
}

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <HeaderNavigation />

      <main className="flex-1 pt-32 pb-24">
        <CheckoutSuccessContent />
      </main>

      <FooterSection />
    </div>
  );
}
