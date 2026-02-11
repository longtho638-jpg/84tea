"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";

export function StorySection() {
  const t = useTranslations("Story");

  return (
    <section className="py-24 bg-surface overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="relative order-2 md:order-1">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden relative shadow-2xl">
              <Image
                src="/images/brand/tea-ceremony.png"
                alt="Vietnamese tea ceremony with traditional clay teapot"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                quality={80}
              />
              {/* Subtle overlay for depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-scrim/20 to-transparent" />
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-secondary-container rounded-full -z-10 blur-3xl" />
            <div className="absolute -top-8 -left-8 w-48 h-48 bg-primary-container rounded-full -z-10 blur-3xl" />
          </div>

          <div className="order-1 md:order-2">
            <Typography variant="label-large" className="text-primary tracking-widest uppercase mb-4">
              {t("label")}
            </Typography>
            <Typography variant="headline-large" className="text-on-surface mb-6 font-display">
              {t("headline")} <br />
              <span className="text-primary italic">{t("headlineHighlight")}</span>
            </Typography>
            <div className="space-y-6 text-on-surface-variant">
              <Typography variant="body-large">
                {t("description1")}
              </Typography>
              <Typography variant="body-large">
                {t("description2")}
              </Typography>
            </div>

            <div className="mt-10 flex gap-8">
              <div>
                <Typography variant="display-medium" className="text-secondary font-display">
                  {t("stat1Value")}
                </Typography>
                <Typography variant="body-medium" className="text-on-surface-variant">
                  {t("stat1Label")}
                </Typography>
              </div>
              <div>
                <Typography variant="display-medium" className="text-secondary font-display">
                  {t("stat2Value")}
                </Typography>
                <Typography variant="body-medium" className="text-on-surface-variant">
                  {t("stat2Label")}
                </Typography>
              </div>
              <div>
                <Typography variant="display-medium" className="text-secondary font-display">
                  {t("stat3Value")}
                </Typography>
                <Typography variant="body-medium" className="text-on-surface-variant">
                  {t("stat3Label")}
                </Typography>
              </div>
            </div>

            <div className="mt-10">
              <Button variant="text" className="pl-0 text-primary hover:text-secondary transition-colors" asChild>
                <Link href="/story" className="flex items-center gap-2">
                  {t("cta")}
                  <span className="material-symbols-rounded" aria-hidden="true">arrow_forward</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
