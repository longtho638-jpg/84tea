'use client';

import { MainLayout, FooterSection } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { AuthButton } from "@/components/auth/auth-button";
import { useAuth } from "@/lib/auth-context";
import { LoyaltyDashboard } from "./loyalty-dashboard-view";
import { useTranslations } from "next-intl";

export default function ClubContent() {
  const { user, profile, isLoading } = useAuth();
  const t = useTranslations("Club");

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface flex flex-col">
        <MainLayout>
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-500">Đang tải...</p>
            </div>
          </div>
        </MainLayout>
      </div>
    );
  }

  // If logged in, show dashboard
  if (user && profile) {
    return (
      <div className="min-h-screen bg-surface flex flex-col">
        <MainLayout>
          <LoyaltyDashboard
            userName={profile.full_name}
            userId={profile.id}
            points={profile.loyalty_points}
            tier={profile.loyalty_tier}
          />
          <FooterSection />
        </MainLayout>
      </div>
    );
  }

  // Otherwise, show landing page
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <MainLayout>
        {/* Hero Section */}
        <div className="relative h-[50vh] min-h-[400px] flex items-center justify-center bg-primary-container overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-30 mix-blend-multiply" />
          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-6">
            <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 border border-secondary text-secondary-dark font-medium text-sm tracking-wide animate-in fade-in slide-in-from-bottom-4 duration-700">
              {t("Hero.label")}
            </span>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-on-surface-variant animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
              {t("Hero.title")}
            </h1>
            <p className="text-lg md:text-xl text-on-surface-variant/80 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
              {t("Hero.description")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
              <AuthButton variant="filled" className="min-w-[160px]" />
              {/* Note: AuthButton text should be handled internally or passed as prop if supported, assuming it toggles based on auth state or defaults to login/register */}
              <Link href="/products">
                <Button variant="outlined" className="min-w-[160px] border-primary text-primary hover:bg-primary/5">
                  {t("Hero.join")}
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <section className="py-20 px-6 max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl font-display font-bold text-on-surface">{t("Benefits.title")}</h2>
            <p className="text-on-surface-variant">{t("Hero.description")}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <BenefitCard
              icon="savings"
              title={t("Benefits.earnPoints.title")}
              description={t("Benefits.earnPoints.desc")}
            />
            <BenefitCard
              icon="card_giftcard"
              title={t("Benefits.birthday.title")}
              description={t("Benefits.birthday.desc")}
            />
            <BenefitCard
              icon="local_cafe"
              title={t("Benefits.events.title")}
              description={t("Benefits.events.desc")}
            />
          </div>
        </section>

        {/* Tiers Section */}
        <section className="py-20 px-6 bg-surface-container-low">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-display font-bold text-on-surface">{t("Tiers.title")}</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <TierCard
                name={t("Tiers.items.silver.title")}
                color="bg-outline-variant"
                requirement={t("Tiers.items.silver.requirement")}
                benefits={["Tiers.items.silver.benefits.0", "Tiers.items.silver.benefits.1"].map(k => t(k))}
              />
              <TierCard
                name={t("Tiers.items.gold.title")}
                color="bg-secondary"
                requirement={t("Tiers.items.gold.requirement")}
                benefits={["Tiers.items.gold.benefits.0", "Tiers.items.gold.benefits.1", "Tiers.items.gold.benefits.2"].map(k => t(k))}
                isPopular
                popularLabel={t("Tiers.mostPopular")}
              />
              <TierCard
                name={t("Tiers.items.diamond.title")}
                color="bg-on-surface text-surface"
                requirement={t("Tiers.items.diamond.requirement")}
                benefits={["Tiers.items.diamond.benefits.0", "Tiers.items.diamond.benefits.1", "Tiers.items.diamond.benefits.2", "Tiers.items.diamond.benefits.3"].map(k => t(k))}
              />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6">
          <div className="bg-primary rounded-3xl p-8 md:p-16 text-center text-white max-w-5xl mx-auto relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1594631252845-d9b50291300f?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10 mix-blend-overlay" />
            <div className="relative z-10 space-y-6">
              <h2 className="text-3xl md:text-4xl font-display font-bold">{t("CTA.title")}</h2>
              <p className="text-primary-container/90 max-w-2xl mx-auto">
                {t("CTA.description")}
              </p>
              <div className="pt-4">
                 <AuthButton variant="filled" className="bg-white text-primary hover:bg-white/90" />
              </div>
            </div>
          </div>
        </section>

        <FooterSection />
      </MainLayout>
    </div>
  );
}

function BenefitCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <Card className="p-6 text-center space-y-4 bg-surface hover:shadow-md transition-shadow border-none shadow-sm">
      <div className="w-12 h-12 rounded-full bg-primary-container/30 text-primary flex items-center justify-center mx-auto">
        <span className="material-symbols-rounded text-2xl" aria-hidden="true">{icon}</span>
      </div>
      <h3 className="text-xl font-bold text-on-surface">{title}</h3>
      <p className="text-sm text-on-surface-variant leading-relaxed">{description}</p>
    </Card>
  );
}

function TierCard({ name, color, requirement, benefits, isPopular, popularLabel }: { name: string; color: string; requirement: string; benefits: string[]; isPopular?: boolean; popularLabel?: string }) {
  return (
    <Card className={`p-8 relative flex flex-col h-full ${isPopular ? 'border-primary shadow-lg scale-105 z-10' : 'border-outline-variant'}`}>
      {isPopular && (
        <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          {popularLabel}
        </span>
      )}
      <div className="text-center mb-6 space-y-2">
        <h3 className="text-2xl font-display font-bold">{name}</h3>
        <p className="text-sm text-on-surface-variant font-medium">{requirement}</p>
      </div>

      <div className={`h-2 w-full rounded-full mb-8 ${color}`} />

      <ul className="space-y-4 mb-8 flex-1">
        {benefits.map((benefit, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-on-surface-variant">
            <span className="material-symbols-rounded text-primary text-lg shrink-0" aria-hidden="true">check_circle</span>
            <span>{benefit}</span>
          </li>
        ))}
      </ul>

      <AuthButton variant={isPopular ? "filled" : "outlined"} className="w-full" />
    </Card>
  );
}
