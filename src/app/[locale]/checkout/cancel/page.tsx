"use client";

import { getTranslations } from "next-intl/server";
import { generatePageMetadata } from "@/lib/metadata";
import CheckoutCancelContent from "./cancel-content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Checkout.Cancel" });

  return generatePageMetadata({
    title: t("title"),
    description: t("message"),
    path: "/checkout/cancel",
    locale,
    type: "website",
  });
}

export default function CheckoutCancelPage() {
  return <CheckoutCancelContent />;
}
