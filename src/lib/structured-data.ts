import { Product } from '@/types/product';
import { SEO_CONFIG } from './seo-constants';

export function generateProductJsonLd(product: Product, locale: string) {
  const name = typeof product.name === 'string' ? product.name : product.name[locale as 'vi' | 'en'] || product.name.vi;
  const description = typeof product.description === 'string' ? product.description : product.description[locale as 'vi' | 'en'] || product.description.vi;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image: product.image_url,
    brand: {
      '@type': 'Brand',
      name: '84tea',
    },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'VND',
      availability: product.in_stock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: `${SEO_CONFIG.siteUrl}/${locale}/products/${product.slug}`,
    },
    // Mock rating for now, connect to real reviews later
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '127',
    },
  };
}

export function generateOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: '84tea',
    url: SEO_CONFIG.siteUrl,
    logo: `${SEO_CONFIG.siteUrl}/images/logo.png`,
    sameAs: [
      'https://facebook.com/84tea.vn',
      'https://instagram.com/84tea.vn',
      SEO_CONFIG.twitterHandle,
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+84-988-030-204',
      contactType: 'Customer Service',
      areaServed: ['VN', 'SG', 'MY', 'TH'],
      availableLanguage: ['Vietnamese', 'English'],
    },
  };
}

export function generateWebsiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: '84tea',
    url: SEO_CONFIG.siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SEO_CONFIG.siteUrl}/products?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}
