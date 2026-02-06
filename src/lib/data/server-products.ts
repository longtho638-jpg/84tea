import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

export type Product = Database['public']['Tables']['products']['Row'];

// Create a static client for build-time data fetching (no auth needed for public data)
function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return null;
  }

  return createClient<Database>(url, key);
}

export async function getProducts(): Promise<Product[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase.from('products').select('*');
  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }
  return data ?? [];
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('featured', true)
    .limit(4);
  if (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
  return data ?? [];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single();
  if (error) {
    console.error('Error fetching product:', error);
    return null;
  }
  return data;
}

export async function getRelatedProducts(category: string | null, currentId: string): Promise<Product[]> {
    const supabase = getSupabaseClient();
    if (!supabase) return [];

    const query = supabase
        .from('products')
        .select('*')
        .neq('id', currentId)
        .limit(3);

    if (category) {
      const { data, error } = await query.eq('category', category);
      if (error) {
        console.error('Error fetching related products:', error);
        return [];
      }
      return data ?? [];
    }

    const { data, error } = await query;
    if (error) {
        console.error('Error fetching related products:', error);
        return [];
      }
    return data ?? [];
}
