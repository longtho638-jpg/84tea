"use client";

import { Typography } from "@/components/ui/typography";
import { useTranslations } from "next-intl";

const STEPS = ["01", "02", "03", "04", "05"];

export function FranchiseProcess() {
  const t = useTranslations("Franchise.Process");

  return (
    <section className="py-24 bg-tertiary text-on-tertiary overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <Typography variant="label-large" className="text-secondary-container tracking-widest uppercase mb-4">
            {t("label")}
          </Typography>
          <Typography variant="headline-large" className="font-display mb-6">
            {t("title")}
          </Typography>
          <Typography variant="body-large" className="text-on-tertiary">
            {t("description")}
          </Typography>
        </div>

        <div className="relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-on-tertiary/20 -translate-y-1/2 z-0" />

          <div className="grid lg:grid-cols-5 gap-8 relative z-10">
            {STEPS.map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-display text-2xl font-bold mb-6 shadow-lg shadow-secondary/20 group-hover:scale-110 transition-transform duration-300 relative z-10">
                  {step}
                </div>
                <Typography variant="title-large" className="mb-3 font-display text-secondary-container">
                  {t(`steps.${step}.title`)}
                </Typography>
                <Typography variant="body-medium" className="text-on-tertiary">
                  {t(`steps.${step}.description`)}
                </Typography>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
