"use client";

import { HeaderNavigation, FooterSection } from "@/components/layout";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export default function CheckoutCancelContent() {
  const t = useTranslations("Checkout");

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <HeaderNavigation />

      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <Card className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <CardContent className="pt-12 pb-12 px-8 sm:px-12">
              <div className="w-24 h-24 mx-auto mb-6 bg-error-container rounded-full flex items-center justify-center">
                <span className="material-symbols-rounded text-5xl text-on-error-container" aria-hidden="true">
                  close
                </span>
              </div>

              <Typography
                variant="headline-large"
                className="text-error mb-4 font-bold"
              >
                {t("Cancel.title")}
              </Typography>

              <Typography
                variant="body-large"
                className="text-on-surface-variant text-lg mb-8"
              >
                {t("Cancel.message")}
              </Typography>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/checkout" className="w-full sm:w-auto">
                  <Button variant="filled" size="lg" className="w-full">
                    {t("Cancel.retry")}
                  </Button>
                </Link>
                <Link href="/" className="w-full sm:w-auto">
                  <Button variant="outlined" size="lg" className="w-full">
                    {t("Cancel.backHome")}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <FooterSection />
    </div>
  );
}
