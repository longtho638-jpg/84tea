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

interface PaymentEventData {
  [key: string]: unknown;
}

/**
 * Log payment events for audit trail
 * @param event - Event type
 * @param data - Event data
 */
export async function logPaymentEvent(
  event: 'payment_created' | 'webhook_received' | 'payment_failed' | 'webhook_duplicate',
  data: PaymentEventData
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
  } catch {
    // Non-critical: don't fail the main flow if logging fails
  }
}

interface CartItem {
  id: string;
  quantity: number;
  price?: number;
}

export interface ValidatedItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

/**
 * Validate cart items against product database
 * Prevents price tampering by verifying server-side prices
 * @param cartItems - Items from client
 * @returns Validated items with correct prices
 */
export async function validateCartItems(cartItems: CartItem[]): Promise<ValidatedItem[]> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );

  const validatedItems: ValidatedItem[] = [];

  for (const item of cartItems) {
    // Fetch actual product price from database
    // DB schema has 'name' column (not name_vi/name_en)
    const { data: product, error } = await supabase
      .from('products')
      .select('id, price, name, slug')
      .or(`id.eq.${item.id},slug.eq.${item.id}`)
      .single();

    if (error || !product) {
      throw new Error(`Invalid product: ${item.id}`);
    }

    // Use server-side price, ignore client-provided price
    validatedItems.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: item.quantity
    });
  }

  return validatedItems;
}

/**
 * Calculate order total from validated items
 * @param items - Validated cart items
 * @returns Total amount
 */
export function calculateOrderTotal(items: ValidatedItem[]): number {
  return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}
