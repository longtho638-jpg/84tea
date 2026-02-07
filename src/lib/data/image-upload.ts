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
  const { error } = await supabase.storage
    .from('product-images')
    .upload(filename, optimized, {
      contentType: 'image/webp',
      cacheControl: '31536000', // 1 year
    });

  if (error) throw error;

  // Return public URL
  const { data } = supabase.storage
    .from('product-images')
    .getPublicUrl(filename);

  return data.publicUrl;
}
