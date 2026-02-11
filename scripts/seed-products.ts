#!/usr/bin/env tsx
/**
 * Product Seeding Script for 84tea
 * Migrates static product data to Supabase
 *
 * Usage: npx tsx scripts/seed-products.ts
 */

import { createClient } from '@supabase/supabase-js';
import productsData from '../src/data/products.json';
import type { Database } from '../src/types/database.types';

const logger = {
  info: (msg: string, ...args: unknown[]) => console.log(msg, ...args),
  warn: (msg: string, ...args: unknown[]) => console.warn(msg, ...args),
  error: (msg: string, ...args: unknown[]) => console.error(msg, ...args),
};

const products = productsData;

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  logger.error('❌ Missing environment variables:');
  logger.error('  - NEXT_PUBLIC_SUPABASE_URL');
  logger.error('  - SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Create admin client with service role
const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

// Map category to database schema
function mapCategory(category: string): 'tea' | 'teaware' | 'gift' {
  if (category.includes('LIMITED') || category.includes('PREMIUM') || category.includes('CLASSIC')) {
    return 'tea';
  }
  return 'tea'; // Default to tea
}

// Map to database product type
function mapType(name: string): 'green' | 'black' | 'white' | 'oolong' | 'herbal' | null {
  const nameLower = name.toLowerCase();
  if (nameLower.includes('lục') || nameLower.includes('green')) return 'green';
  if (nameLower.includes('đen') || nameLower.includes('black')) return 'black';
  if (nameLower.includes('trắng') || nameLower.includes('white')) return 'white';
  if (nameLower.includes('oolong')) return 'oolong';
  return null;
}

async function seedProducts() {
  logger.info('🌱 Starting product seeding...\n');

  // Transform static data to database format
  const productsToInsert = products.map(p => ({
    slug: p.id,
    name: p.name.vi,
    description: p.description.vi,
    long_description: p.description.vi, // Use description as fallback
    price: p.price.vnd,
    original_price: null,
    weight: p.weight,
    image: p.images[0] ? `/images/products/${p.images[0]}` : null,
    images: p.images.map(img => `/images/products/${img}`),
    category: mapCategory(p.category),
    type: mapType(p.name.vi),
    origin: 'Tây Bắc, Việt Nam',
    harvest: null,
    taste: null,
    tags: null,
    in_stock: p.stock > 0,
    featured: p.featured || false,
    rating: 0,
    reviews_count: 0,
  }));

  logger.info(`📦 Prepared ${productsToInsert.length} products for insertion\n`);

  // Upsert products (insert or update based on slug)
  const { data, error } = await supabase
    .from('products')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .upsert(productsToInsert as any, {
      onConflict: 'slug',
      ignoreDuplicates: false
    })
    .select();

  if (error) {
    logger.error('❌ Seeding failed:', error);
    process.exit(1);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const insertedProducts = data as any[];
  logger.info('✅ Successfully seeded products:\n');
  insertedProducts?.forEach((product, index) => {
    logger.info(`  ${index + 1}. ${product.name} (${product.slug})`);
  });

  logger.info(`\n📊 Summary:`);
  logger.info(`   Total products: ${insertedProducts?.length || 0}`);
  logger.info(`   Featured: ${insertedProducts?.filter(p => p.featured).length || 0}`);
  logger.info(`   Categories: ${[...new Set(insertedProducts?.map(p => p.category))].join(', ')}`);

  logger.info('\n🎉 Product seeding completed!');
  logger.info('\n📝 Next steps:');
  logger.info('   1. Upload actual product images to Supabase Storage');
  logger.info('   2. Update image URLs in database');
  logger.info('   3. Verify products appear on website');
  logger.info('   4. Test product filtering and search\n');
}

// Execute seeding
seedProducts()
  .catch((err) => {
    logger.error('💥 Unexpected error:', err);
    process.exit(1);
  });
