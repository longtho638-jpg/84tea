"use client";

import { Typography } from "@/components/ui/typography";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "next-intl";

const BENEFITS = [
  {
    icon: "storefront",
    key: "storefront"
  },
  {
    icon: "monitoring",
    key: "monitoring"
  },
  {
    icon: "soup_kitchen",
    key: "soup_kitchen"
  },
  {
    icon: "campaign",
    key: "campaign"
  },
  {
    icon: "school",
    key: "school"
  },
  {
    icon: "engineering",
    key: "engineering"
  }
];

export function FranchiseBenefits() {
  const t = useTranslations("Franchise.Benefits");

  return (
    <section className="py-24 bg-surface">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Typography variant="label-large" className="text-secondary tracking-widest uppercase mb-4">
            {t("label")}
          </Typography>
          <Typography variant="headline-large" className="text-on-surface font-display mb-6">
            {t("title")}
          </Typography>
          <Typography variant="body-large" className="text-on-surface-variant">
            {t("description")}
          </Typography>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BENEFITS.map((item, index) => (
            <Card key={index} variant="outlined" className="hover:border-primary transition-colors duration-300">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-full bg-secondary-container flex items-center justify-center mb-6 text-on-secondary-container">
                  <span className="material-symbols-rounded text-3xl" aria-hidden="true">{item.icon}</span>
                </div>
                <Typography variant="title-large" className="mb-3 text-on-surface font-bold">
                  {t(`items.${item.key}.title`)}
                </Typography>
                <Typography variant="body-medium" className="text-on-surface-variant leading-relaxed">
                  {t(`items.${item.key}.description`)}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
