/**
 * Loyalty Transaction Types
 * Database schema types for the loyalty program
 */

export interface LoyaltyTransaction {
  id: string;
  user_id: string;
  amount: number;
  type: 'purchase' | 'bonus' | 'redemption' | 'expiry';
  description: string | null;
  created_at: string;
}

export type LoyaltyTier = 'bronze' | 'silver' | 'gold' | 'diamond';

export interface ProfileWithLoyalty {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  loyalty_points: number;
  loyalty_tier: LoyaltyTier;
  lifetime_points: number;
  created_at: string;
  updated_at: string;
}
