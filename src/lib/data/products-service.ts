import { createClient } from '@supabase/supabase-js';
import { cache } from 'react';
import { Product } from '@/types/product';
import { Database } from '@/types/database.types';

// Create a static client for public data fetching (SSG compatible)
const getSupabaseStaticClient = () => {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};

// Cache product queries (React Server Components)
export const getProducts = cache(async (): Promise<Product[]> => {
  const supabase = getSupabaseStaticClient();

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  if (!data) {
    return [];
  }

  // Transform to match existing interface
  return data.map(p => ({
    id: p.id,
    slug: p.slug,
    name: { vi: p.name_vi || p.name, en: p.name_en || p.name },
    description: { vi: p.description_vi || p.description || '', en: p.description_en || p.description || '' },
    category: p.category,
    price: p.price,
    original_price: p.original_price || undefined,
    image_url: p.image_url || p.image || '',
    images: p.images || [],
    energy_level: p.energy_level || undefined,
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

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    slug: data.slug,
    name: { vi: data.name_vi || data.name, en: data.name_en || data.name },
    description: { vi: data.description_vi || data.description || '', en: data.description_en || data.description || '' },
    category: data.category,
    price: data.price,
    original_price: data.original_price || undefined,
    image_url: data.image_url || data.image || '',
    images: data.images || [],
    energy_level: data.energy_level || undefined,
    tags: data.tags || [],
    is_featured: data.featured || false,
    in_stock: data.in_stock || false,
    weight: data.weight || undefined,
    origin: data.origin || undefined,
    harvest: data.harvest || undefined,
    taste: data.taste || undefined,
    type: data.type || undefined,
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
