"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/ui/typography";

export function CTASection() {
  const t = useTranslations("CTA");

  return (
    <section className="py-32 relative overflow-hidden flex items-center justify-center bg-surface-variant/30">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
         <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
         <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 px-6 text-center max-w-3xl mx-auto">
        <span className="material-symbols-rounded text-6xl text-primary mb-6 animate-bounce-slow" aria-hidden="true">mail</span>

        <Typography variant="headline-medium" className="mb-4 font-display text-on-surface">
          {t("headline")}
        </Typography>

        <Typography variant="body-large" className="mb-8 text-on-surface-variant">
          {t("description")}
        </Typography>

        <form className="max-w-md mx-auto flex gap-2 mb-10" onSubmit={(e) => e.preventDefault()}>
          <Input
            type="email"
            placeholder={t("emailPlaceholder")}
            className="bg-surface text-on-surface border-outline"
            aria-label={t("emailPlaceholder")}
          />
          <Button type="submit" variant="filled">
            {t("subscribe")}
          </Button>
        </form>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8 border-t border-outline-variant">
           <Typography variant="label-large" className="text-on-surface-variant">
              {t("orExplore")}
           </Typography>
          <Button variant="text" asChild>
            <Link href="/products">{t("collection")}</Link>
          </Button>
          <span className="text-outline-variant hidden sm:inline">•</span>
          <Button variant="text" asChild>
            <Link href="/franchise">{t("franchise")}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
