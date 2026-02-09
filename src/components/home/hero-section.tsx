"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";

export function HeroSection() {
  const t = useTranslations("Hero");

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background with Vietnamese tea hills atmosphere */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-scrim/40 via-scrim/20 to-surface z-10" />
        <div
          className="w-full h-full"
          style={{
            background: `
              linear-gradient(180deg,
                #0d3911 0%,
                #1b5e20 15%,
                #2e7d32 30%,
                #388e3c 45%,
                #4caf50 55%,
                #a5d6a7 65%,
                #e8e1d9 75%,
                #c5a962 85%,
                #f5e6ba 92%,
                #fbf8f3 100%
              )`,
          }}
        >
          {/* Mist overlay */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background: `
                radial-gradient(ellipse 120% 60% at 20% 50%, rgba(255,255,255,0.4) 0%, transparent 70%),
                radial-gradient(ellipse 100% 50% at 80% 40%, rgba(255,255,255,0.3) 0%, transparent 60%)`,
            }}
          />
          {/* Mountain silhouette layers */}
          <div
            className="absolute bottom-0 left-0 right-0 h-2/3"
            style={{
              background: `
                url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%231b5e20' fill-opacity='0.3' d='M0,224L80,213.3C160,203,320,181,480,186.7C640,192,800,224,960,218.7C1120,213,1280,171,1360,149.3L1440,128L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z'/%3E%3C/svg%3E") no-repeat bottom/cover`,
            }}
          />
        </div>
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
          className="text-on-tertiary mb-6 font-display font-medium leading-tight animate-fade-in-up delay-100"
        >
          {t("title")} <br />
          <span className="italic text-secondary">{t("titleHighlight")}</span>
        </Typography>

        <Typography
          variant="body-large"
          className="text-on-tertiary/90 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200"
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
            className="min-w-[180px] border-on-tertiary text-on-tertiary hover:bg-on-tertiary/10"
            asChild
          >
            <Link href="/story">{t("ctaSecondary")}</Link>
          </Button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-on-tertiary/50 animate-bounce">
        <span className="material-symbols-rounded">keyboard_arrow_down</span>
      </div>
    </section>
  );
}
