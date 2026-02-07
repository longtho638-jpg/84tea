import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

/**
 * Verify PayOS webhook signature using HMAC-SHA256
 * @param payload - Raw webhook payload string
 * @param signature - Signature from webhook headers
 * @param secret - PayOS checksum key
 * @returns boolean indicating if signature is valid
 */
export function verifyPayOSSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  try {
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(payload);
    const expectedSignature = hmac.digest('hex');

    // Use timing-safe comparison to prevent timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

/**
 * Log payment events for audit trail
 * @param event - Event type
 * @param data - Event data
 */
export async function logPaymentEvent(
  event: 'payment_created' | 'webhook_received' | 'payment_failed' | 'webhook_duplicate',
  data: any
) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );

    await supabase.from('payment_logs').insert({
      event,
      data,
      created_at: new Date().toISOString()
    });
  } catch (error) {
    // Don't fail the main flow if logging fails
    console.error('Failed to log payment event:', error);
  }
}

/**
 * Validate cart items against product database
 * Prevents price tampering by verifying server-side prices
 * @param cartItems - Items from client
 * @returns Validated items with correct prices
 */
export async function validateCartItems(cartItems: any[]): Promise<any[]> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );

  const validatedItems = [];

  for (const item of cartItems) {
    // Fetch actual product price from database
    const { data: product, error } = await supabase
      .from('products')
      .select('id, price, name_vi, name_en')
      .eq('id', item.id)
      .single();

    if (error || !product) {
      throw new Error(`Invalid product: ${item.id}`);
    }

    // Use server-side price, ignore client-provided price
    validatedItems.push({
      id: product.id,
      name: product.name_vi || product.name_en,
      price: product.price,
      quantity: item.quantity
    });
  }

  return validatedItems;
}

/**
 * Generate unique order code
 * Format: 84TEA-{timestamp}-{random}
 */
export function generateOrderCode(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `84TEA-${timestamp}-${random}`;
}

/**
 * Calculate order total from validated items
 * @param items - Validated cart items
 * @returns Total amount
 */
export function calculateOrderTotal(items: any[]): number {
  return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}
