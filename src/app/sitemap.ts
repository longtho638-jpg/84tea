import { MetadataRoute } from 'next'
import { getProducts } from '@/lib/data/server-products'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://84tea.com'

  const products = await getProducts()

  // Static pages
  const staticPages = [
    '',
    '/products',
    '/about',
    '/franchise',
    '/franchise/apply',
    '/contact',
    '/training',
    '/ops',
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }))

  // Product pages
  const productPages = (products || []).map(product => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: new Date(product.updated_at || product.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...productPages]
}
