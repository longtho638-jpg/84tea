import { Metadata } from 'next';
import { SEO_CONFIG } from './seo-constants';

export interface PageMetadata {
  title: string;
  description: string;
  keywords?: string[];
  path: string;
  locale: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
}

export function generatePageMetadata(data: PageMetadata): Metadata {
  const { title, description, keywords, path, locale, image, type = 'website' } = data;

  const fullTitle = `${title} | ${SEO_CONFIG.siteName[locale as 'vi' | 'en']}`;
  const ogImage = image || SEO_CONFIG.ogImage;
  // Ensure we don't double slash if path starts with /
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const canonicalUrl = `${SEO_CONFIG.siteUrl}/${locale}/${cleanPath}`;

  return {
    title: fullTitle,
    description,
    keywords: keywords?.join(', '),
    alternates: {
      canonical: canonicalUrl,
      languages: Object.fromEntries(
        SEO_CONFIG.locales.map(loc => [
          loc,
          `${SEO_CONFIG.siteUrl}/${loc}/${cleanPath}`,
        ])
      ),
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl,
      siteName: SEO_CONFIG.siteName[locale as 'vi' | 'en'],
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale,
      type: type as "website" | "article",
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
      creator: SEO_CONFIG.twitterHandle,
    },
  };
}
