/**
 * Loyalty Tier Configuration and Utilities
 * Handles tier calculations and progress tracking
 */

import { LoyaltyTier } from '@/types/loyalty-transaction.types';

export const TIER_CONFIG = {
  bronze: { name: 'Bronze', min: 0, max: 999, color: 'bg-tertiary' },
  silver: { name: 'Silver', min: 1000, max: 4999, color: 'bg-outline' },
  gold: { name: 'Gold', min: 5000, max: 14999, color: 'bg-secondary' },
  diamond: { name: 'Diamond', min: 15000, max: Infinity, color: 'bg-primary' }
} as const;

export function getTierFromPoints(points: number): LoyaltyTier {
  if (points >= 15000) return 'diamond';
  if (points >= 5000) return 'gold';
  if (points >= 1000) return 'silver';
  return 'bronze';
}

export function getNextTier(currentTier: LoyaltyTier): LoyaltyTier | null {
  const tierOrder: LoyaltyTier[] = ['bronze', 'silver', 'gold', 'diamond'];
  const currentIndex = tierOrder.indexOf(currentTier);

  if (currentIndex === -1 || currentIndex === tierOrder.length - 1) {
    return null; // Already at max tier or invalid tier
  }

  return tierOrder[currentIndex + 1];
}

export function getPointsToNextTier(currentPoints: number, currentTier: LoyaltyTier): number {
  const nextTier = getNextTier(currentTier);

  if (!nextTier) {
    return 0; // Already at max tier
  }

  const nextTierMin = TIER_CONFIG[nextTier].min;
  return Math.max(0, nextTierMin - currentPoints);
}

export function getTierProgress(currentPoints: number, currentTier: LoyaltyTier): number {
  const tierConfig = TIER_CONFIG[currentTier];
  const nextTier = getNextTier(currentTier);

  if (!nextTier) {
    return 100; // Max tier reached
  }

  const currentMin = tierConfig.min;
  const nextMin = TIER_CONFIG[nextTier].min;
  const range = nextMin - currentMin;
  const progress = currentPoints - currentMin;

  return Math.min(100, Math.max(0, (progress / range) * 100));
}
