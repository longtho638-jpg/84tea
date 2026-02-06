/**
 * Loyalty Dashboard Wrapper Component
 * Main dashboard view for logged-in Club members
 */

'use client';

import { LoyaltyPointsCard } from '@/components/loyalty/loyalty-points-card';
import { LoyaltyPointsHistoryList } from '@/components/loyalty/loyalty-points-history-list';
import { useLoyaltyTransactionHistory } from '@/lib/hooks/use-loyalty-transaction-history';
import { LoyaltyTier } from '@/types/loyalty-transaction.types';

interface LoyaltyDashboardProps {
  userName: string | null;
  userId: string;
  points: number;
  tier: LoyaltyTier;
}

export function LoyaltyDashboard({ userName, userId, points, tier }: LoyaltyDashboardProps) {
  const { transactions, loading } = useLoyaltyTransactionHistory(userId);

  return (
    <div className="min-h-screen bg-gradient-to-b from-surface-container-low to-surface py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-on-surface mb-2">
            Xin chào, {userName || 'thành viên'}! 👋
          </h1>
          <p className="text-on-surface-variant">Chào mừng bạn đến với 84tea Club</p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Points Card */}
          <div className="lg:col-span-1">
            <LoyaltyPointsCard points={points} tier={tier} />
          </div>

          {/* Right: Transaction History */}
          <div className="lg:col-span-1">
            {loading ? (
              <div className="rounded-2xl bg-surface p-6 shadow-md border border-outline-variant flex items-center justify-center h-full min-h-[400px]">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
                  <p className="text-on-surface-variant">Đang tải lịch sử...</p>
                </div>
              </div>
            ) : (
              <LoyaltyPointsHistoryList transactions={transactions} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
