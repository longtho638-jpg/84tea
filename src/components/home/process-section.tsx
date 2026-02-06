"use client";

import { useTranslations } from "next-intl";
import { Typography } from "@/components/ui/typography";

export function ProcessSection() {
  const t = useTranslations("Process");

  const PROCESS_STEPS = [
    {
      step: "01",
      title: t("step1Title"),
      description: t("step1Desc"),
      icon: "spa"
    },
    {
      step: "02",
      title: t("step2Title"),
      description: t("step2Desc"),
      icon: "hourglass_bottom"
    },
    {
      step: "03",
      title: t("step3Title"),
      description: t("step3Desc"),
      icon: "local_cafe"
    }
  ];

  return (
    <section className="py-24 bg-surface text-on-surface overflow-hidden relative">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Typography variant="label-large" className="text-primary tracking-widest uppercase mb-4">
            {t("label")}
          </Typography>
          <Typography variant="headline-large" className="font-display mb-4">
            {t("headline")}
          </Typography>
          <Typography variant="body-large" className="text-on-surface-variant">
            {t("description")}
          </Typography>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0" />

          {PROCESS_STEPS.map((step, index) => (
            <div key={index} className="relative flex flex-col items-center text-center group">
              <div className="w-24 h-24 rounded-full bg-surface-container border border-outline-variant flex items-center justify-center mb-6 z-10 transition-colors group-hover:border-primary group-hover:bg-primary-container group-hover:text-on-primary-container">
                <span className="material-symbols-rounded text-4xl text-primary group-hover:text-inherit transition-colors">
                  {step.icon}
                </span>
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-bold text-sm">
                  {step.step}
                </div>
              </div>

              <Typography variant="title-large" className="mb-3 font-display">
                {step.title}
              </Typography>
              <Typography variant="body-medium" className="text-on-surface-variant max-w-xs">
                {step.description}
              </Typography>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
