"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";

export function HeroSection() {
  const t = useTranslations("Hero");

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background - Real tea hills photograph */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-scrim/60 via-scrim/30 to-surface z-10" />
        <Image
          src="/images/hero-tea-hills.png"
          alt="Vietnamese tea hills in the misty highlands"
          fill
          className="object-cover"
          priority
          sizes="100vw"
          quality={85}
        />
      </div>

      <div className="relative z-10 container mx-auto px-6 text-center max-w-4xl pt-20">
        <Typography
          variant="label-large"
          className="text-secondary tracking-[0.2em] uppercase mb-6 animate-fade-in-up"
        >
          {t("subtitle")}
        </Typography>

        <Typography
          variant="display-large"
          className="text-white mb-6 font-display font-medium leading-tight animate-fade-in-up delay-100 drop-shadow-lg"
        >
          {t("title")} <br />
          <span className="italic text-secondary">{t("titleHighlight")}</span>
        </Typography>

        <Typography
          variant="body-large"
          className="text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200 drop-shadow-md"
        >
          {t("description")}
        </Typography>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
          <Button size="lg" variant="filled" className="min-w-[180px]" asChild>
            <Link href="/products">{t("ctaPrimary")}</Link>
          </Button>
          <Button
            size="lg"
            variant="outlined"
            className="min-w-[180px] border-white text-white hover:bg-white/10"
            asChild
          >
            <Link href="/story">{t("ctaSecondary")}</Link>
          </Button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 animate-bounce">
        <span className="material-symbols-rounded">keyboard_arrow_down</span>
      </div>
    </section>
  );
}
