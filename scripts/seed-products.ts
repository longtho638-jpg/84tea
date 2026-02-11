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

const products = productsData;

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables:');
  console.error('  - NEXT_PUBLIC_SUPABASE_URL');
  console.error('  - SUPABASE_SERVICE_ROLE_KEY');
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
  console.log('🌱 Starting product seeding...\n');

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

  console.log(`📦 Prepared ${productsToInsert.length} products for insertion\n`);

  // Upsert products (insert or update based on slug)
  const { data, error } = await supabase
    .from('products')
    .upsert(productsToInsert as any, {
      onConflict: 'slug',
      ignoreDuplicates: false
    })
    .select();

  if (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }

  const insertedProducts = data as any[];
  console.log('✅ Successfully seeded products:\n');
  insertedProducts?.forEach((product, index) => {
    console.log(`  ${index + 1}. ${product.name} (${product.slug})`);
  });

  console.log(`\n📊 Summary:`);
  console.log(`   Total products: ${insertedProducts?.length || 0}`);
  console.log(`   Featured: ${insertedProducts?.filter(p => p.featured).length || 0}`);
  console.log(`   Categories: ${[...new Set(insertedProducts?.map(p => p.category))].join(', ')}`);

  console.log('\n🎉 Product seeding completed!');
  console.log('\n📝 Next steps:');
  console.log('   1. Upload actual product images to Supabase Storage');
  console.log('   2. Update image URLs in database');
  console.log('   3. Verify products appear on website');
  console.log('   4. Test product filtering and search\n');
}

// Execute seeding
seedProducts()
  .catch((err) => {
    console.error('💥 Unexpected error:', err);
    process.exit(1);
  });
