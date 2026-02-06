/**
 * Tier Badge Component
 * Visual indicator of user's loyalty tier level
 */

import { LoyaltyTier } from '@/types/loyalty-transaction.types';
import { TIER_CONFIG } from '@/lib/loyalty-tier-utilities';
import { twMerge } from 'tailwind-merge';

interface TierBadgeProps {
  tier: LoyaltyTier;
  className?: string;
}

const TIER_COLORS = {
  bronze: 'bg-gradient-to-r from-tertiary to-tertiary-container text-on-tertiary',
  silver: 'bg-gradient-to-r from-outline to-outline-variant text-surface',
  gold: 'bg-gradient-to-r from-secondary to-secondary-container text-on-secondary',
  diamond: 'bg-gradient-to-r from-primary to-primary-container text-on-primary'
};

export function TierBadge({ tier, className }: TierBadgeProps) {
  const tierInfo = TIER_CONFIG[tier];

  return (
    <div
      className={twMerge(
        'inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm',
        TIER_COLORS[tier],
        className
      )}
    >
      <span className="material-symbols-rounded text-base">workspace_premium</span>
      <span>{tierInfo.name}</span>
    </div>
  );
}
