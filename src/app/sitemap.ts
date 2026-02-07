import { MetadataRoute } from 'next';
import { getProductSlugsWithTimestamps } from '@/lib/data/products-service';
import { SEO_CONFIG } from '@/lib/seo-constants';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProductSlugsWithTimestamps();

  const staticPages = [
    '',
    '/products',
    '/about',
    '/franchise',
    '/franchise/apply',
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
  const productEntries = (products || []).flatMap(product =>
    SEO_CONFIG.locales.map(locale => ({
      url: `${SEO_CONFIG.siteUrl}/${locale}/products/${product.slug}`,
      lastModified: new Date(product.updated_at || product.created_at),
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
