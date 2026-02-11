"use client";

import { useTranslations } from "next-intl";
import { Typography } from "@/components/ui/typography";

export function BenefitsSection() {
  const t = useTranslations("Benefits");

  const BENEFITS = [
    {
      icon: "eco",
      title: t("item1Title"),
      description: t("item1Desc")
    },
    {
      icon: "history_edu",
      title: t("item2Title"),
      description: t("item2Desc")
    },
    {
      icon: "verified",
      title: t("item3Title"),
      description: t("item3Desc")
    },
    {
      icon: "handshake",
      title: t("item4Title"),
      description: t("item4Desc")
    }
  ];

  return (
    <section className="py-24 bg-tertiary text-on-tertiary">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {BENEFITS.map((item, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-secondary-container flex items-center justify-center mb-6 text-on-secondary-container">
                <span className="material-symbols-rounded text-3xl" aria-hidden="true">{item.icon}</span>
              </div>
              <Typography variant="title-large" className="mb-3 font-display">
                {item.title}
              </Typography>
              <Typography variant="body-medium" className="text-on-tertiary leading-relaxed">
                {item.description}
              </Typography>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
