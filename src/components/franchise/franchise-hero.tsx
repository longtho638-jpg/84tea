"use client";

import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

export function FranchiseHero() {
  const t = useTranslations("Franchise.Hero");

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-surface-variant">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-tertiary/90 to-tertiary/50 z-10" />
        <Image
          src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&h=1080&fit=crop&q=80"
          alt="Modern tea shop storefront"
          fill
          priority
          className="object-cover"
          sizes="100vw"
          quality={80}
        />
      </div>

      <div className="relative z-10 container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <div className="text-left text-on-tertiary animate-fade-in-up">
          <Typography
            variant="label-large"
            className="text-secondary-container tracking-[0.2em] uppercase mb-4"
          >
            {t("label")}
          </Typography>

          <Typography
            variant="display-medium"
            className="mb-6 font-display font-medium leading-tight text-on-tertiary"
          >
            {t.rich("title")} <br />
            <span className="text-secondary-container italic">{t("titleHighlight")}</span>
          </Typography>

          <Typography
            variant="body-large"
            className="text-on-tertiary mb-8 max-w-xl leading-relaxed"
          >
            {t("description")}
          </Typography>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" variant="filled" className="bg-secondary text-on-secondary hover:bg-secondary-container hover:text-on-secondary-container border-none" onClick={() => document.getElementById('register-form')?.scrollIntoView({ behavior: 'smooth' })}>
              {t("register")}
            </Button>
            <Button
              size="lg"
              variant="outlined"
              className="border-on-tertiary text-on-tertiary hover:bg-on-tertiary/10"
              asChild
            >
              <Link href="#models">{t("explore")}</Link>
            </Button>
          </div>
        </div>

        {/* Stats or Highlight */}
        <div className="hidden md:flex justify-end animate-fade-in-up delay-200">
           <div className="bg-surface/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 max-w-sm">
             <div className="grid grid-cols-2 gap-8">
               <div>
                 <Typography variant="display-medium" className="text-secondary-container font-display">50+</Typography>
                 <Typography variant="body-small" className="text-on-tertiary">{t("stats.stores")}</Typography>
               </div>
               <div>
                 <Typography variant="display-medium" className="text-secondary-container font-display">12</Typography>
                 <Typography variant="body-small" className="text-on-tertiary">{t("stats.payback")}</Typography>
               </div>
               <div>
                 <Typography variant="display-medium" className="text-secondary-container font-display">35%</Typography>
                 <Typography variant="body-small" className="text-on-tertiary">{t("stats.profit")}</Typography>
               </div>
               <div>
                 <Typography variant="display-medium" className="text-secondary-container font-display">24/7</Typography>
                 <Typography variant="body-small" className="text-on-tertiary">{t("stats.support")}</Typography>
               </div>
             </div>
           </div>
        </div>
      </div>
    </section>
  );
}
