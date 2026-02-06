/**
 * Loyalty Points Summary Card
 * Displays current points balance, tier, and progress to next tier
 */

'use client';

import { LoyaltyTier } from '@/types/loyalty-transaction.types';
import { TierBadge } from './loyalty-tier-badge';
import { getPointsToNextTier, getTierProgress, getNextTier } from '@/lib/loyalty-tier-utilities';
import { twMerge } from 'tailwind-merge';
import { useTranslations } from 'next-intl';

interface LoyaltyPointsCardProps {
  points: number;
  tier: LoyaltyTier;
  className?: string;
}

export function LoyaltyPointsCard({ points, tier, className }: LoyaltyPointsCardProps) {
  const nextTier = getNextTier(tier);
  const pointsNeeded = getPointsToNextTier(points, tier);
  const progress = getTierProgress(points, tier);
  const t = useTranslations("Club");

  return (
    <div
      className={twMerge(
        'rounded-2xl bg-gradient-to-br from-surface-container to-surface-container-high p-6 shadow-md border border-outline-variant',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-on-surface">{t('Dashboard.currentPoints')}</h2>
        <TierBadge tier={tier} />
      </div>

      {/* Points Display */}
      <div className="mb-6">
        <div className="text-5xl font-bold text-primary mb-2">
          {points.toLocaleString()}
        </div>
        <div className="text-sm text-on-surface-variant">{t('Dashboard.availablePoints')}</div>
      </div>

      {/* Progress to Next Tier */}
      {nextTier && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-on-surface-variant">
              {t('Dashboard.progressTo', { tier: t(`Tiers.items.${nextTier}.title`) })}
            </span>
            <span className="font-semibold text-on-surface">
              {t('Dashboard.pointsNeeded', { points: pointsNeeded.toLocaleString() })}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-primary-container transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Diamond Tier Message */}
      {!nextTier && (
        <div className="text-center py-3 px-4 bg-primary-container/30 rounded-lg">
          <span className="text-sm font-semibold text-primary">
            {t('Dashboard.highestTier')}
          </span>
        </div>
      )}

      {/* Redeem Button (Placeholder) */}
      <button
        className="w-full mt-6 px-6 py-3 bg-primary hover:bg-primary/90 text-on-primary rounded-full font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        disabled
      >
        {t('Dashboard.redeemComingSoon')}
      </button>
    </div>
  );
}
