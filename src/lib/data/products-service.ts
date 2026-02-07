import { createClient } from '@supabase/supabase-js';
import { cache } from 'react';
import { Product } from '@/types/product';
import { Database } from '@/types/database.types';

// Create a static client for public data fetching (SSG compatible)
const getSupabaseStaticClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.warn('Supabase credentials missing, returning null client');
    return null;
  }

  return createClient<Database>(url, key);
};

// Cache product queries (React Server Components)
export const getProducts = cache(async (): Promise<Product[]> => {
  const supabase = getSupabaseStaticClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  if (!data) {
    return [];
  }

  const rows = data as Database['public']['Tables']['products']['Row'][];

  // Transform to match existing interface
  return rows.map(p => ({
    id: p.id,
    slug: p.slug,
    name: { vi: p.name, en: p.name },
    description: { vi: p.description || '', en: p.description || '' },
    category: p.category,
    price: p.price,
    original_price: p.original_price || undefined,
    image_url: p.image || '',
    images: p.images || [],
    energy_level: undefined,
    tags: p.tags || [],
    is_featured: p.featured || false,
    in_stock: p.in_stock || false,
    weight: p.weight || undefined,
    origin: p.origin || undefined,
    harvest: p.harvest || undefined,
    taste: p.taste || undefined,
    type: p.type || undefined,
  }));
});

export const getProductBySlug = cache(async (slug: string): Promise<Product | null> => {
  const supabase = getSupabaseStaticClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) return null;

  const row = data as Database['public']['Tables']['products']['Row'];

  return {
    id: row.id,
    slug: row.slug,
    name: { vi: row.name, en: row.name },
    description: { vi: row.description || '', en: row.description || '' },
    category: row.category,
    price: row.price,
    original_price: row.original_price || undefined,
    image_url: row.image || '',
    images: row.images || [],
    energy_level: undefined,
    tags: row.tags || [],
    is_featured: row.featured || false,
    in_stock: row.in_stock || false,
    weight: row.weight || undefined,
    origin: row.origin || undefined,
    harvest: row.harvest || undefined,
    taste: row.taste || undefined,
    type: row.type || undefined,
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

export const getRelatedProducts = cache(
  async (category: string | null, currentId: string): Promise<Product[]> => {
    const products = await getProducts();
    return products
      .filter(p => p.id !== currentId && (!category || p.category === category))
      .slice(0, 3);
  }
);
