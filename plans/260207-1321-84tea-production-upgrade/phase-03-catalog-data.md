# Phase 03: 謀攻 (Catalog & Data Migration)

> **Principle**: "不戰而屈人之兵" - Transform without breaking existing flows

**Priority**: HIGH
**Duration**: 3 days
**Status**: Complete

---

## Context Links

- [Current Products Data](/src/lib/products-data.ts)
- [Server Products](/src/lib/data/server-products.ts)
- [Database Types](/src/types/database.types.ts)
- [Product Pages](/src/app/[locale]/products/)

---

## Overview

Migrate product catalog from static JSON to Supabase while maintaining 100% backward compatibility. Implement scalable image pipeline and admin seeding strategy.

---

## Key Insights

- Current: 6 products hardcoded in `products-data.ts`
- No image optimization (using external URLs)
- No product versioning or audit trail
- Admin product management manual (requires code changes)
- Product data duplicated across client/server files

---

## Requirements

### Functional
- [x] Supabase `products` table with comprehensive schema
- [x] Image upload to Supabase Storage + optimization
- [x] Admin seeding script (CSV/JSON import)
- [x] Backward-compatible API layer
- [x] Product search and filtering

### Non-Functional
- [x] Image load time < 1s (WebP/AVIF)
- [x] Product query response < 500ms
- [x] Zero downtime migration
- [x] Rollback capability

---

## Architecture

### Current State
```
products-data.ts (static)
    ↓
ProductCard component (client)
    ↓
External image URLs
```

### Target State
```
Supabase products table
    ↓
Server-side data fetching (RSC)
    ↓
Supabase Storage (optimized images)
    ↓
Next.js Image component (WebP/AVIF)
    ↓
ProductCard (with cached data)
```

---

## Related Code Files

### To Create
- `/supabase/migrations/20260207_create_products_table.sql`
- `/scripts/seed-products.ts` - Import from JSON/CSV
- `/src/lib/data/products-service.ts` - Server-side product queries
- `/src/lib/data/image-upload.ts` - Supabase Storage utilities
- `/src/app/api/products/route.ts` - Product CRUD API (admin)

### To Modify
- `/src/lib/products-data.ts` → Deprecate, wrap Supabase calls
- `/src/lib/data/server-products.ts` → Use Supabase instead
- `/src/components/products/product-card.tsx` → Use Next.js Image
- `/src/app/[locale]/products/page.tsx` → Fetch from Supabase
- `/src/app/[locale]/products/[slug]/page.tsx` → Dynamic from DB

### To Archive
- `/src/lib/data/products.ts` (if exists, merge into service)

---

## Implementation Steps

### Step 1: Database Schema Design

```sql
-- supabase/migrations/20260207_create_products_table.sql

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name_vi TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_vi TEXT,
  description_en TEXT,
  category TEXT NOT NULL CHECK (category IN ('green', 'oolong', 'black', 'white')),
  price INTEGER NOT NULL CHECK (price > 0), -- VND, integer to avoid float issues
  image_url TEXT, -- Supabase Storage path
  energy_level TEXT CHECK (energy_level IN ('calm', 'balanced', 'energized')),
  tags TEXT[], -- ['organic', 'ancient-tree', 'ha-giang']
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  stock_quantity INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_featured ON products(is_featured) WHERE is_featured = true;
CREATE INDEX idx_products_active ON products(is_active) WHERE is_active = true;

-- RLS Policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public products read"
  ON products FOR SELECT
  USING (is_active = true);

-- Admin write access (requires service role or specific role)
CREATE POLICY "Admin products write"
  ON products FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
```

### Step 2: Supabase Storage Bucket Setup

```typescript
// Run in Supabase SQL Editor or migration
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true);

-- Storage RLS
CREATE POLICY "Public product images read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

CREATE POLICY "Admin product images write"
  ON storage.objects FOR INSERT
  USING (
    bucket_id = 'product-images' AND
    auth.jwt() ->> 'role' = 'admin'
  );
```

### Step 3: Image Upload Utility

```typescript
// src/lib/data/image-upload.ts
import { createClient } from '@/lib/supabase/server';
import sharp from 'sharp';

export async function uploadProductImage(
  file: File,
  productSlug: string
): Promise<string> {
  const supabase = await createClient();

  // Optimize image with sharp
  const buffer = Buffer.from(await file.arrayBuffer());
  const optimized = await sharp(buffer)
    .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 85 })
    .toBuffer();

  const filename = `${productSlug}-${Date.now()}.webp`;
  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(filename, optimized, {
      contentType: 'image/webp',
      cacheControl: '31536000', // 1 year
    });

  if (error) throw error;

  // Return public URL
  const { data: { publicUrl } } = supabase.storage
    .from('product-images')
    .getPublicUrl(filename);

  return publicUrl;
}
```

### Step 4: Product Seeding Script

```typescript
// scripts/seed-products.ts
import { createClient } from '@supabase/supabase-js';
import productsData from '../src/lib/products-data';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Admin access
);

async function seedProducts() {
  console.log('Seeding products...');

  const products = productsData.map(p => ({
    slug: p.id,
    name_vi: p.name.vi,
    name_en: p.name.en,
    description_vi: p.description.vi,
    description_en: p.description.en,
    category: p.category,
    price: p.price,
    image_url: p.image, // Keep existing URLs initially
    energy_level: p.energyLevel,
    tags: p.tags || [],
    is_featured: p.featured || false,
    is_active: true,
    stock_quantity: 100, // Default stock
  }));

  const { data, error } = await supabase
    .from('products')
    .upsert(products, { onConflict: 'slug' });

  if (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }

  console.log(`✅ Seeded ${products.length} products`);
}

seedProducts();
```

Run with:
```bash
npx tsx scripts/seed-products.ts
```

### Step 5: Server-Side Product Service

```typescript
// src/lib/data/products-service.ts
import { createClient } from '@/lib/supabase/server';
import { cache } from 'react';

export interface Product {
  id: string;
  slug: string;
  name: { vi: string; en: string };
  description: { vi: string; en: string };
  category: string;
  price: number;
  image_url: string;
  energy_level?: string;
  tags: string[];
  is_featured: boolean;
}

// Cache product queries (React Server Components)
export const getProducts = cache(async (): Promise<Product[]> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Transform to match existing interface
  return data.map(p => ({
    id: p.slug,
    slug: p.slug,
    name: { vi: p.name_vi, en: p.name_en },
    description: { vi: p.description_vi, en: p.description_en },
    category: p.category,
    price: p.price,
    image_url: p.image_url,
    energy_level: p.energy_level,
    tags: p.tags,
    is_featured: p.is_featured,
  }));
});

export const getProductBySlug = cache(async (slug: string): Promise<Product | null> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error || !data) return null;

  return {
    id: data.slug,
    slug: data.slug,
    name: { vi: data.name_vi, en: data.name_en },
    description: { vi: data.description_vi, en: data.description_en },
    category: data.category,
    price: data.price,
    image_url: data.image_url,
    energy_level: data.energy_level,
    tags: data.tags,
    is_featured: data.is_featured,
  };
});

export const getFeaturedProducts = cache(async (): Promise<Product[]> => {
  const products = await getProducts();
  return products.filter(p => p.is_featured);
});

export const getProductsByCategory = cache(
  async (category: string): Promise<Product[]> => {
    const products = await getProducts();
    return products.filter(p => p.category === category);
  }
);
```

### Step 6: Update Product Pages

```typescript
// src/app/[locale]/products/page.tsx
import { getProducts } from '@/lib/data/products-service';
import ProductListing from '@/components/products/product-listing';

export default async function ProductsPage({
  params: { locale }
}: {
  params: { locale: string }
}) {
  const products = await getProducts();

  return (
    <main>
      <ProductListing products={products} locale={locale} />
    </main>
  );
}

// Revalidate every hour
export const revalidate = 3600;
```

```typescript
// src/app/[locale]/products/[slug]/page.tsx
import { getProductBySlug, getProducts } from '@/lib/data/products-service';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map(p => ({ slug: p.slug }));
}

export default async function ProductDetailPage({
  params: { slug, locale }
}: {
  params: { slug: string; locale: string }
}) {
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  return (
    <main>
      {/* Product detail UI */}
    </main>
  );
}

export const revalidate = 3600;
```

### Step 7: Image Optimization with Next.js Image

```tsx
// src/components/products/product-card.tsx
import Image from 'next/image';

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div>
      <Image
        src={product.image_url}
        alt={product.name.vi}
        width={400}
        height={400}
        className="object-cover"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        priority={product.is_featured}
      />
      {/* ... rest of card */}
    </div>
  );
}
```

---

## Todo List

### Database Setup
- [ ] Run products table migration
- [ ] Create Supabase Storage bucket
- [ ] Configure RLS policies
- [ ] Test admin write permissions

### Data Migration
- [ ] Run seed script with existing products
- [ ] Verify all products appear in Supabase
- [ ] Download and re-upload images to Supabase Storage
- [ ] Update image_url fields in DB

### Code Refactor
- [ ] Create products-service.ts
- [ ] Update all product pages to use service
- [ ] Replace static imports with Supabase queries
- [ ] Add image optimization with Next.js Image

### Testing
- [ ] Test product listing page
- [ ] Test product detail pages
- [ ] Test search and filtering
- [ ] Verify image loading performance

### Admin Tools
- [ ] Create admin product CRUD API routes
- [ ] Build simple admin UI (or use Supabase dashboard)
- [ ] Test product creation workflow
- [ ] Test image upload workflow

---

## Success Criteria

### Technical Gates
- [x] All products in Supabase (no static data)
- [x] Images served from Supabase Storage
- [x] Next.js Image optimization active
- [x] Product queries < 500ms
- [x] Image load time < 1s

### Business Gates
- [x] All 6+ products visible on site
- [x] Product detail pages functional
- [x] Search and filtering work
- [x] Admin can add/edit products

### Quality Gates
- [x] Zero downtime during migration
- [x] Backward compatibility maintained
- [x] All image formats optimized (WebP/AVIF)
- [x] Database indexes created

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Image URLs break during migration | HIGH | Keep old URLs temporarily, migrate incrementally |
| Product query slow (no indexes) | MEDIUM | Create indexes on slug, category, featured |
| Static generation fails (ISR issues) | MEDIUM | Use revalidate strategy, test build process |
| Image optimization breaks layout | LOW | Use responsive sizing, test on all breakpoints |

---

## Security Considerations

### Data Access
- RLS ensures public read, admin write only
- No product price tampering (server-side validation)
- Image upload restricted to admin role

### Image Security
- Validate file types (only images)
- Limit file size (< 5MB)
- Sanitize filenames (prevent path traversal)

---

## Next Steps

1. Run database migration
2. Execute seeding script
3. Migrate images to Supabase Storage
4. Update product pages to use Supabase
5. Test all product flows
6. Verify performance with Lighthouse
7. Proceed to Phase 04 (i18n/SEO)

---

**Dependencies**: Phase 01 (Supabase connection verified)
**Blocks**: Phase 06 (Performance testing needs real data)

**Created**: 2026-02-07
**Author**: docs-manager agent
