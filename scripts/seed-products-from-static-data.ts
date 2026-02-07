#!/usr/bin/env tsx
/**
 * Product Seeding Script for 84tea
 * Migrates static product data to Supabase
 *
 * Usage: npx tsx scripts/seed-products.ts
 */

import { createClient } from '@supabase/supabase-js';
import { products } from '../src/lib/products-data';
import type { Database } from '../src/types/database.types';

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
    slug: p.slug,
    name: p.name,
    description: p.description,
    long_description: p.descriptionFull,
    price: p.priceVnd || Math.round(p.price * 14285), // Convert USD to VND if needed
    original_price: null,
    weight: p.weight,
    image: p.image, // Will be replaced with actual URLs later
    images: null,
    category: mapCategory(p.category),
    type: mapType(p.name),
    origin: p.origin || 'Tây Bắc, Việt Nam',
    harvest: p.harvest || null,
    taste: p.brewing || null,
    tags: p.benefits ? p.benefits.slice(0, 5) : null, // Use benefits as tags
    in_stock: true,
    featured: p.featured || false,
    rating: 0 as number,
    reviews_count: 0,
  })) as Database['public']['Tables']['products']['Insert'][];

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

  console.log('✅ Successfully seeded products:\n');
  data?.forEach((product, index) => {
    console.log(`  ${index + 1}. ${product.name} (${product.slug})`);
  });

  console.log(`\n📊 Summary:`);
  console.log(`   Total products: ${data?.length || 0}`);
  console.log(`   Featured: ${data?.filter(p => p.featured).length || 0}`);
  console.log(`   Categories: ${[...new Set(data?.map(p => p.category))].join(', ')}`);

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
