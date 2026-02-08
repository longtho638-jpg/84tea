'use client';

import { HeaderNavigation, FooterSection } from "@/components/layout";
import { Typography } from "@/components/ui/typography";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "next-intl";

export default function PrivacyContent() {
  const t = useTranslations('Privacy');

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <HeaderNavigation />

      <main className="flex-1 pt-28 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          <Typography
            variant="display-small"
            className="text-primary mb-8 font-bold"
          >
            {t('title')}
          </Typography>

          <Card className="shadow-lg border-none bg-surface-container-low">
            <CardContent className="p-8">
              <Typography
                variant="body-medium"
                className="text-on-surface-variant mb-6 italic"
              >
                {t('lastUpdated')}
              </Typography>

              <div className="space-y-8">
                {/* Section 1 */}
                <section>
                  <Typography
                    variant="headline-small"
                    className="text-primary mb-4 font-bold"
                  >
                    {t('Section1.title')}
                  </Typography>
                  <Typography
                    variant="body-large"
                    className="text-on-surface-variant mb-4"
                  >
                    {t('Section1.intro')}
                  </Typography>
                  <ul className="list-disc list-inside text-on-surface-variant space-y-2 ml-4">
                    <li>{t('Section1.items.0')}</li>
                    <li>{t('Section1.items.1')}</li>
                    <li>{t('Section1.items.2')}</li>
                    <li>{t('Section1.items.3')}</li>
                  </ul>
                </section>

                {/* Section 2 */}
                <section>
                  <Typography
                    variant="headline-small"
                    className="text-primary mb-4 font-bold"
                  >
                    {t('Section2.title')}
                  </Typography>
                  <Typography
                    variant="body-large"
                    className="text-on-surface-variant mb-4"
                  >
                    {t('Section2.intro')}
                  </Typography>
                  <ul className="list-disc list-inside text-on-surface-variant space-y-2 ml-4">
                    <li>{t('Section2.items.0')}</li>
                    <li>{t('Section2.items.1')}</li>
                    <li>{t('Section2.items.2')}</li>
                    <li>{t('Section2.items.3')}</li>
                    <li>{t('Section2.items.4')}</li>
                  </ul>
                </section>

                {/* Section 3 */}
                <section>
                  <Typography
                    variant="headline-small"
                    className="text-primary mb-4 font-bold"
                  >
                    {t('Section3.title')}
                  </Typography>
                  <Typography
                    variant="body-large"
                    className="text-on-surface-variant mb-4"
                  >
                    {t('Section3.intro')}
                  </Typography>
                  <ul className="list-disc list-inside text-on-surface-variant space-y-2 ml-4">
                    <li>{t('Section3.items.0')}</li>
                    <li>{t('Section3.items.1')}</li>
                    <li>{t('Section3.items.2')}</li>
                    <li>{t('Section3.items.3')}</li>
                  </ul>
                </section>

                {/* Section 4 */}
                <section>
                  <Typography
                    variant="headline-small"
                    className="text-primary mb-4 font-bold"
                  >
                    {t('Section4.title')}
                  </Typography>
                  <Typography
                    variant="body-large"
                    className="text-on-surface-variant mb-4"
                  >
                    {t('Section4.content')}
                  </Typography>
                </section>

                {/* Section 5 */}
                <section>
                  <Typography
                    variant="headline-small"
                    className="text-primary mb-4 font-bold"
                  >
                    {t('Section5.title')}
                  </Typography>
                  <Typography
                    variant="body-large"
                    className="text-on-surface-variant mb-4"
                  >
                    {t('Section5.intro')}
                  </Typography>
                  <ul className="list-disc list-inside text-on-surface-variant space-y-2 ml-4">
                    <li>{t('Section5.items.0')}</li>
                    <li>{t('Section5.items.1')}</li>
                    <li>{t('Section5.items.2')}</li>
                    <li>{t('Section5.items.3')}</li>
                  </ul>
                </section>

                {/* Section 6 */}
                <section>
                  <Typography
                    variant="headline-small"
                    className="text-primary mb-4 font-bold"
                  >
                    {t('Section6.title')}
                  </Typography>
                  <Typography
                    variant="body-large"
                    className="text-on-surface-variant mb-4"
                  >
                    {t('Section6.intro')}
                  </Typography>
                  <div className="bg-surface-variant/30 p-4 rounded-lg border border-outline-variant/50">
                    <Typography
                      variant="body-large"
                      className="text-on-surface font-medium"
                    >
                      Email: privacy@84tea.com
                    </Typography>
                    <Typography
                      variant="body-large"
                      className="text-on-surface font-medium"
                    >
                      Hotline: 0988 030 204
                    </Typography>
                  </div>
                </section>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <FooterSection />
    </div>
  );
}
