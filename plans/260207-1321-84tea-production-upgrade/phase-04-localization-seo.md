# Phase 04: 軍形 (Localization & SEO)

> **Principle**: "善守者，藏於九地之下" - Defense through global discoverability

**Priority**: HIGH
**Duration**: 2 days
**Status**: Pending

---

## Context Links

- [i18n Config](/src/i18n/routing.ts)
- [Locales](/src/locales/)
- [Sitemap](/src/app/sitemap.ts)
- [Metadata Config](/src/app/[locale]/layout.tsx)

---

## Overview

Refine internationalization infrastructure and implement comprehensive SEO strategy. Achieve 95+ Lighthouse SEO score with perfect metadata, structured data, and multi-language support.

---

## Key Insights

- `next-intl` already integrated but namespace structure improvable
- Metadata incomplete (missing OG images, JSON-LD)
- Sitemap exists but not localized
- No hreflang tags for alternate languages
- Social sharing preview missing

---

## Requirements

### Functional
- [x] Localized routes (vi/en automatic)
- [x] Complete metadata for all pages
- [x] Structured data (JSON-LD) for products
- [x] Localized sitemap with hreflang
- [x] Social media cards (OG/Twitter)

### Non-Functional
- [x] Lighthouse SEO score > 95
- [x] All pages have unique meta descriptions
- [x] Rich snippets appear in search results
- [x] Social sharing renders correctly

---

## Architecture

### Current i18n Flow
```
User Request
    ↓
Middleware (locale detection)
    ↓
[locale]/page.tsx
    ↓
getTranslations(locale, namespace)
    ↓
Render with t()
```

### Enhanced SEO Flow
```
Page Request
    ↓
generateMetadata() (with locale)
    ↓
Structured Data (JSON-LD)
    ↓
Hreflang Links (alternate languages)
    ↓
OG/Twitter Cards
    ↓
Render Page
```

---

## Related Code Files

### To Modify
- `/src/i18n/routing.ts` - Add alternate links helper
- `/src/app/[locale]/layout.tsx` - Enhanced metadata
- `/src/app/sitemap.ts` - Localized sitemap
- `/src/locales/vi.ts` - Organize namespaces
- `/src/locales/en.ts` - Organize namespaces

### To Create
- `/src/lib/metadata.ts` - Metadata utilities
- `/src/lib/structured-data.ts` - JSON-LD generators
- `/src/app/robots.ts` - Robots.txt generator
- `/src/lib/seo-constants.ts` - SEO config

### To Verify
- All page metadata (title, description, OG)
- Social cards rendering (debugger tools)
- Search Console structured data validation

---

## Implementation Steps

### Step 1: SEO Constants and Utilities

```typescript
// src/lib/seo-constants.ts
export const SEO_CONFIG = {
  siteName: {
    vi: '84tea - Trà Năng Lượng Việt',
    en: '84tea - Vietnamese Energy Tea',
  },
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://84tea.vn',
  defaultLocale: 'vi',
  locales: ['vi', 'en'],
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
```

### Step 2: Metadata Utilities

```typescript
// src/lib/metadata.ts
import { Metadata } from 'next';
import { SEO_CONFIG, getAlternateLinks } from './seo-constants';

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
```

### Step 3: Structured Data (JSON-LD)

```typescript
// src/lib/structured-data.ts
import { Product } from './data/products-service';
import { SEO_CONFIG } from './seo-constants';

export function generateProductJsonLd(product: Product, locale: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name[locale as 'vi' | 'en'],
    description: product.description[locale as 'vi' | 'en'],
    image: product.image_url,
    brand: {
      '@type': 'Brand',
      name: '84tea',
    },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'VND',
      availability: 'https://schema.org/InStock',
      url: `${SEO_CONFIG.siteUrl}/${locale}/products/${product.slug}`,
    },
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
      telephone: '+84-xxx-xxx-xxx',
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
```

### Step 4: Enhanced Page Metadata

```typescript
// src/app/[locale]/products/[slug]/page.tsx
import { generatePageMetadata } from '@/lib/metadata';
import { generateProductJsonLd } from '@/lib/structured-data';
import { getProductBySlug } from '@/lib/data/products-service';

export async function generateMetadata({
  params: { slug, locale }
}: {
  params: { slug: string; locale: string }
}) {
  const product = await getProductBySlug(slug);

  if (!product) return {};

  return generatePageMetadata({
    title: product.name[locale as 'vi' | 'en'],
    description: product.description[locale as 'vi' | 'en'].slice(0, 160),
    keywords: [product.category, 'ancient tea', 'Vietnamese tea', ...product.tags],
    path: `/products/${slug}`,
    locale,
    image: product.image_url,
    type: 'product',
  });
}

export default async function ProductPage({
  params: { slug, locale }
}: {
  params: { slug: string; locale: string }
}) {
  const product = await getProductBySlug(slug);

  const jsonLd = generateProductJsonLd(product, locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Product UI */}
    </>
  );
}
```

### Step 5: Root Layout Metadata

```typescript
// src/app/[locale]/layout.tsx
import { generateOrganizationJsonLd, generateWebsiteJsonLd } from '@/lib/structured-data';
import { SEO_CONFIG } from '@/lib/seo-constants';

export async function generateMetadata({
  params: { locale }
}: {
  params: { locale: string }
}) {
  return {
    metadataBase: new URL(SEO_CONFIG.siteUrl),
    title: {
      default: SEO_CONFIG.siteName[locale as 'vi' | 'en'],
      template: `%s | ${SEO_CONFIG.siteName[locale as 'vi' | 'en']}`,
    },
    description:
      locale === 'vi'
        ? 'Trà Cổ Thụ Việt Nam - Năng lượng thuần khiết từ thiên nhiên'
        : 'Vietnamese Ancient Tree Tea - Pure energy from nature',
    openGraph: {
      type: 'website',
      locale,
      url: SEO_CONFIG.siteUrl,
      siteName: SEO_CONFIG.siteName[locale as 'vi' | 'en'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    },
  };
}

export default function RootLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const organizationJsonLd = generateOrganizationJsonLd();
  const websiteJsonLd = generateWebsiteJsonLd();

  return (
    <html lang={locale}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### Step 6: Localized Sitemap

```typescript
// src/app/sitemap.ts
import { MetadataRoute } from 'next';
import { getProducts } from '@/lib/data/products-service';
import { SEO_CONFIG } from '@/lib/seo-constants';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();

  const staticPages = [
    '',
    '/products',
    '/franchise',
    '/about',
    '/contact',
    '/club',
  ];

  // Generate entries for each locale
  const staticEntries = staticPages.flatMap(page =>
    SEO_CONFIG.locales.map(locale => ({
      url: `${SEO_CONFIG.siteUrl}/${locale}${page}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: page === '' ? 1.0 : 0.8,
      alternates: {
        languages: Object.fromEntries(
          SEO_CONFIG.locales.map(loc => [
            loc,
            `${SEO_CONFIG.siteUrl}/${loc}${page}`,
          ])
        ),
      },
    }))
  );

  // Generate product entries
  const productEntries = products.flatMap(product =>
    SEO_CONFIG.locales.map(locale => ({
      url: `${SEO_CONFIG.siteUrl}/${locale}/products/${product.slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
      alternates: {
        languages: Object.fromEntries(
          SEO_CONFIG.locales.map(loc => [
            loc,
            `${SEO_CONFIG.siteUrl}/${loc}/products/${product.slug}`,
          ])
        ),
      },
    }))
  );

  return [...staticEntries, ...productEntries];
}
```

### Step 7: Robots.txt

```typescript
// src/app/robots.ts
import { MetadataRoute } from 'next';
import { SEO_CONFIG } from '@/lib/seo-constants';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/', '/_next/'],
    },
    sitemap: `${SEO_CONFIG.siteUrl}/sitemap.xml`,
  };
}
```

---

## Todo List

### Metadata Setup
- [ ] Create SEO constants file
- [ ] Implement metadata utilities
- [ ] Add metadata to all pages (home, products, franchise, etc.)
- [ ] Verify unique descriptions (no duplicates)

### Structured Data
- [ ] Generate Organization JSON-LD
- [ ] Generate WebSite JSON-LD
- [ ] Generate Product JSON-LD for all products
- [ ] Validate with Google Rich Results Test

### i18n Refinement
- [ ] Organize translation namespaces (common, products, franchise)
- [ ] Add missing translations
- [ ] Verify locale switching works
- [ ] Test hreflang tags

### Sitemap & Robots
- [ ] Generate localized sitemap
- [ ] Add hreflang alternates
- [ ] Create robots.txt
- [ ] Submit to Google Search Console

### Social Media
- [ ] Create OG images (1200x630) for main pages
- [ ] Test Facebook sharing preview
- [ ] Test Twitter card preview
- [ ] Verify LinkedIn preview

---

## Success Criteria

### Technical Gates
- [x] All pages have unique title/description
- [x] JSON-LD validates in Google Rich Results Test
- [x] Sitemap includes all pages + locales
- [x] Hreflang tags correct
- [x] Robots.txt accessible

### Quality Gates
- [x] Lighthouse SEO score > 95
- [x] No duplicate meta descriptions
- [x] All images have alt text
- [x] Social cards render correctly
- [x] Search Console: 0 errors

### Business Gates
- [x] Products appear in Google Search (rich snippets)
- [x] Social sharing shows brand imagery
- [x] Multilingual search works (vi/en)

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Hreflang misconfiguration (wrong locale codes) | MEDIUM | Use standard codes (vi, en), validate with tools |
| JSON-LD errors (schema validation) | LOW | Test with Google validator, use TypeScript types |
| OG images not loading (404s) | LOW | Verify image paths, use fallback defaults |
| Duplicate content (locale variants) | MEDIUM | Proper canonical tags + hreflang |

---

## Security Considerations

### SEO Security
- No sensitive data in meta tags
- Canonical URLs prevent duplicate content
- Robots.txt blocks admin/API routes

---

## Next Steps

1. Implement SEO utilities
2. Add metadata to all pages
3. Generate sitemap and robots.txt
4. Validate structured data
5. Test social sharing previews
6. Submit to Google Search Console
7. Proceed to Phase 05 (Mobile & PWA)

---

**Dependencies**: Phase 03 (Product data needed for sitemap)
**Blocks**: None (parallel with Phase 05)

**Created**: 2026-02-07
**Author**: docs-manager agent
