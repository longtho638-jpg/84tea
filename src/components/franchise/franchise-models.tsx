"use client";

import { Typography } from "@/components/ui/typography";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

const MODELS = [
  {
    id: "kiosk",
    area: "10 - 15m²",
    color: "bg-tertiary text-on-tertiary"
  },
  {
    id: "express",
    area: "25 - 40m²",
    highlight: true,
    color: "bg-primary text-on-primary"
  },
  {
    id: "lounge",
    area: "50 - 80m²",
    color: "bg-secondary text-on-secondary"
  }
];

export function FranchiseModels() {
  const t = useTranslations("Franchise.Models");

  return (
    <section id="models" className="py-24 bg-surface-container-low">
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

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {MODELS.map((model) => (
            <div key={model.id} className={`relative flex flex-col h-full ${model.highlight ? 'lg:-mt-8 lg:mb-8' : ''}`}>
               {model.highlight && (
                 <div className="absolute -top-10 left-0 right-0 flex justify-center z-10">
                   <span className="bg-secondary text-on-secondary py-2 px-6 rounded-t-xl font-bold text-sm uppercase tracking-wider shadow-sm">
                     {t("mostPopular")}
                   </span>
                 </div>
               )}
              <Card
                className={`h-full flex flex-col overflow-hidden transition-transform duration-300 hover:-translate-y-2 ${model.highlight ? 'shadow-xl border-secondary border-2' : 'shadow-md'}`}
              >
                <div className={`p-8 ${model.color}`}>
                  <Typography variant="headline-medium" className="font-display mb-2">
                    {t(`items.${model.id}.title`)}
                  </Typography>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-rounded text-lg" aria-hidden="true">square_foot</span>
                    <Typography variant="body-medium">{model.area}</Typography>
                  </div>
                </div>

                <CardContent className="p-8 flex-1 flex flex-col bg-surface">
                  <div className="mb-6 pb-6 border-b border-outline-variant">
                    <Typography variant="label-large" className="text-on-surface-variant mb-2 block">
                      {t("location")}
                    </Typography>
                    <Typography variant="body-large" className="text-on-surface font-medium">
                      {t(`items.${model.id}.location`)}
                    </Typography>
                  </div>

                  <div className="mb-8 flex-1">
                    <Typography variant="label-large" className="text-on-surface-variant mb-4 block">
                      {t("features")}
                    </Typography>
                    <ul className="space-y-3">
                      {[0, 1, 2, 3].map((idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="material-symbols-rounded text-primary text-xl shrink-0" aria-hidden="true">check_circle</span>
                          <Typography variant="body-medium" className="text-on-surface">
                            {t(`items.${model.id}.features.${idx}`)}
                          </Typography>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-surface-container p-4 rounded-xl mb-6">
                    <Typography variant="label-small" className="text-on-surface-variant uppercase tracking-wide block mb-1">
                      {t("idealFor")}
                    </Typography>
                    <Typography variant="body-medium" className="text-primary font-bold">
                      {t(`items.${model.id}.idealFor`)}
                    </Typography>
                  </div>

                  <Button variant={model.highlight ? "filled" : "outlined"} className="w-full" onClick={() => document.getElementById('register-form')?.scrollIntoView({ behavior: 'smooth' })}>
                    {t("getQuote")}
                  </Button>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
