/**
 * SEO Configuration Constants
 * WOW Protocol: Metadata standards for 84tea
 */

export const SEO_CONFIG = {
  siteName: {
    vi: '84tea - Trà Năng Lượng Việt',
    en: '84tea - Vietnamese Energy Tea',
  },
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://84tea.com',
  defaultLocale: 'vi',
  locales: ['vi', 'en'] as const,
  ogImage: '/images/og-default.jpg', // 1200x630
  twitterHandle: '@84tea_vn',
  facebookAppId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
} as const;

export function getAlternateLinks(path: string) {
  return SEO_CONFIG.locales.map(locale => ({
    hrefLang: locale,
    href: `${SEO_CONFIG.siteUrl}/${locale}${path}`,
  }));
}
