import { isHubEnabled } from './config';

/**
 * Analytics Event Tracking
 *
 * Currently: No-op (logs to console in dev)
 * Future: Send to Hub Analytics Pipeline
 */

export async function trackEvent(
  event: string,
  _properties: Record<string, unknown> = {}
): Promise<void> {
  if (!isHubEnabled()) {
    return;
  }

  // Future: Hub SDK integration
  // await hubSDK.analytics.track({ event, properties, ... });
}

// Pre-defined events for 84tea
export const Events = {
  // E-commerce
  PRODUCT_VIEWED: 'product_viewed',
  PRODUCT_ADDED_TO_CART: 'product_added_to_cart',
  CHECKOUT_STARTED: 'checkout_started',
  ORDER_COMPLETED: 'order_completed',
  PAYMENT_SUCCESS: 'payment_success',
  PAYMENT_FAILED: 'payment_failed',

  // Loyalty
  LOYALTY_POINTS_EARNED: 'loyalty_points_earned',
  LOYALTY_POINTS_REDEEMED: 'loyalty_points_redeemed',
  LOYALTY_TIER_UPGRADED: 'loyalty_tier_upgraded',

  // Franchise
  FRANCHISE_INQUIRY_SUBMITTED: 'franchise_inquiry_submitted',
  FRANCHISE_APPLICATION_VIEWED: 'franchise_application_viewed',

  // User
  USER_SIGNED_UP: 'user_signed_up',
  USER_LOGGED_IN: 'user_logged_in',
  USER_PROFILE_UPDATED: 'user_profile_updated',
} as const;
