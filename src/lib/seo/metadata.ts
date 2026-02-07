/**
 * Metadata Generation Utilities
 * WOW Protocol: OpenGraph, Twitter Cards, Structured Data
 */

import { Metadata } from 'next';
import { SEO_CONFIG } from '../seo-constants';

export interface PageMetadata {
  title: string;
  description: string;
  keywords?: string[];
  path: string;
  locale: string;
  image?: string;
  type?: 'website' | 'article';
}

export function generatePageMetadata(data: PageMetadata): Metadata {
  const { title, description, keywords, path, locale, image, type = 'website' } = data;

  const fullTitle = `${title} | ${SEO_CONFIG.siteName[locale as 'vi' | 'en']}`;
  const ogImage = image || SEO_CONFIG.ogImage;
  const canonicalUrl = `${SEO_CONFIG.siteUrl}/${locale}${path}`;

  return {
    title: fullTitle,
    description,
    keywords: keywords?.join(', '),
    alternates: {
      canonical: canonicalUrl,
      languages: Object.fromEntries(
        SEO_CONFIG.locales.map(loc => [
          loc,
          `${SEO_CONFIG.siteUrl}/${loc}${path}`,
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
      type,
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
