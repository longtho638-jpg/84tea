'use client';

import { HeaderNavigation, FooterSection } from "@/components/layout";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { generatePageMetadata } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "About.Hero" });

  return generatePageMetadata({
    title: t("title"),
    description: t("desc"),
    path: "/about",
    locale,
    type: "article", // Semantic choice for About page
  });
}

export default function AboutPage() {
  const t = useTranslations('About');

  const values = [
    {
      icon: "🌿",
      title: t('Values.items.nature.title'),
      description: t('Values.items.nature.desc'),
    },
    {
      icon: "🔬",
      title: t('Values.items.fermentation.title'),
      description: t('Values.items.fermentation.desc'),
    },
    {
      icon: "⚡",
      title: t('Values.items.energy.title'),
      description: t('Values.items.energy.desc'),
    },
    {
      icon: "🎯",
      title: t('Values.items.premium.title'),
      description: t('Values.items.premium.desc'),
    },
  ];

  const timeline = [
    {
      year: "2020",
      title: t('Timeline.items.2020.title'),
      description: t('Timeline.items.2020.desc'),
    },
    {
      year: "2022",
      title: t('Timeline.items.2022.title'),
      description: t('Timeline.items.2022.desc'),
    },
    {
      year: "2024",
      title: t('Timeline.items.2024.title'),
      description: t('Timeline.items.2024.desc'),
    },
    {
      year: "2026",
      title: t('Timeline.items.2026.title'),
      description: t('Timeline.items.2026.desc'),
    },
  ];

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <HeaderNavigation />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-32 pb-24 bg-surface-container-low">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <Typography
              variant="label-large"
              className="text-primary uppercase tracking-[0.3em] mb-4 block"
            >
              {t('Hero.label')}
            </Typography>
            <Typography
              variant="display-medium"
              className="text-on-surface mb-6 font-bold"
            >
              {t('Hero.title')} <span className="text-primary">84tea</span>
            </Typography>
            <Typography
              variant="body-large"
              className="text-on-surface-variant text-lg max-w-2xl mx-auto"
            >
              {t('Hero.desc')}
            </Typography>
          </div>
        </section>

        {/* Vision Section */}
        <section className="py-24 bg-surface">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <Typography
                  variant="label-large"
                  className="text-secondary uppercase tracking-[0.3em] mb-4 block"
                >
                  {t('Vision.label')}
                </Typography>
                <Typography
                  variant="headline-medium"
                  className="text-primary mb-6 font-bold"
                >
                  {t('Vision.title')}
                </Typography>
                <Typography
                  variant="body-large"
                  className="text-on-surface-variant text-lg mb-6"
                >
                  {t('Vision.desc1')}
                </Typography>
                <Typography
                  variant="body-large"
                  className="text-on-surface-variant text-lg"
                >
                  {t('Vision.desc2')}
                </Typography>
              </div>
              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-primary to-primary-container rounded-3xl flex items-center justify-center shadow-lg">
                  <span className="text-9xl">🍵</span>
                </div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-secondary-container rounded-2xl flex items-center justify-center shadow-lg border-4 border-surface">
                  <span className="text-5xl">🌿</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-24 bg-surface-container">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <Typography
                variant="label-large"
                className="text-secondary uppercase tracking-[0.3em] mb-4 block"
              >
                {t('Values.label')}
              </Typography>
              <Typography
                variant="headline-medium"
                className="text-primary font-bold"
              >
                {t('Values.title')}
              </Typography>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, idx) => (
                <Card
                  key={idx}
                  className="hover:shadow-lg transition-all duration-300 hover:-translate-y-2 border-none shadow-md"
                >
                  <CardContent className="pt-8">
                    <span className="text-5xl mb-4 block">{value.icon}</span>
                    <Typography
                      variant="title-medium"
                      className="text-on-surface font-bold mb-2"
                    >
                      {value.title}
                    </Typography>
                    <Typography
                      variant="body-medium"
                      className="text-on-surface-variant"
                    >
                      {value.description}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-24 bg-primary text-on-primary">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-16">
              <Typography
                variant="label-large"
                className="text-secondary-container uppercase tracking-[0.3em] mb-4 block"
              >
                {t('Timeline.label')}
              </Typography>
              <Typography
                variant="headline-medium"
                className="text-on-primary font-bold"
              >
                {t('Timeline.title')}
              </Typography>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {timeline.map((item, idx) => (
                <div key={idx} className="text-center group">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center transition-transform group-hover:scale-110">
                    <Typography variant="title-large" className="font-bold">
                      {item.year}
                    </Typography>
                  </div>
                  <Typography
                    variant="title-medium"
                    className="text-on-primary font-bold mb-2"
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    variant="body-medium"
                    className="text-primary-container"
                  >
                    {item.description}
                  </Typography>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Company Info */}
        <section className="py-24 bg-surface">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16">
              <div>
                <Typography
                  variant="label-large"
                  className="text-secondary uppercase tracking-[0.3em] mb-4 block"
                >
                  {t('Company.label')}
                </Typography>
                <Typography
                  variant="headline-medium"
                  className="text-primary mb-6 font-bold"
                >
                  {t('Company.title')}
                </Typography>
                <div className="space-y-4">
                  {[
                    { label: t('Company.details.license'), value: "011 070 44 89" },
                    { label: t('Company.details.founded'), value: "04/05/2024" },
                    { label: t('Company.details.founder'), value: "Lương Tuấn Anh" },
                    {
                      label: t('Company.details.address'),
                      value: t('Company.details.addressValue'),
                    },
                  ].map((item) => (
                    <Typography
                      key={item.label}
                      variant="body-large"
                      className="text-on-surface-variant flex gap-2"
                    >
                      <span className="font-bold text-on-surface">
                        {item.label}:
                      </span>
                      {item.value}
                    </Typography>
                  ))}
                </div>
              </div>
              <div>
                <Typography
                  variant="label-large"
                  className="text-secondary uppercase tracking-[0.3em] mb-4 block"
                >
                  {t('Partner.label')}
                </Typography>
                <Typography
                  variant="headline-medium"
                  className="text-primary mb-6 font-bold"
                >
                  {t('Partner.title')}
                </Typography>
                <Typography
                  variant="body-large"
                  className="text-on-surface-variant mb-4"
                >
                  {t('Partner.desc')}
                </Typography>
                <a
                  href="https://tralenmen.vn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:text-secondary transition-colors font-bold"
                >
                  {t('Partner.link')} →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-secondary-container border-y border-secondary">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <Typography
              variant="headline-medium"
              className="text-on-surface mb-6 font-bold"
            >
              {t('CTA.title')}
            </Typography>
            <Typography
              variant="body-large"
              className="text-on-surface-variant text-lg mb-8 max-w-2xl mx-auto"
            >
              {t('CTA.desc')}
            </Typography>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <Button variant="filled" size="lg" className="w-full sm:w-auto">
                  {t('CTA.products')} →
                </Button>
              </Link>
              <Link href="/franchise">
                <Button
                  variant="outlined"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  {t('CTA.franchise')}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <FooterSection />
    </div>
  );
}
