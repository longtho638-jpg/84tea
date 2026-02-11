/**
 * Loyalty Points Transaction History List
 * Displays chronological list of point earnings and redemptions
 */

'use client';

import { LoyaltyTransaction } from '@/types/loyalty-transaction.types';
import { twMerge } from 'tailwind-merge';
import { useTranslations } from 'next-intl';

interface LoyaltyPointsHistoryListProps {
  transactions: LoyaltyTransaction[];
  className?: string;
}

const TRANSACTION_ICONS = {
  purchase: 'shopping_bag',
  bonus: 'star',
  redemption: 'redeem',
  expiry: 'schedule'
};

export function LoyaltyPointsHistoryList({ transactions, className }: LoyaltyPointsHistoryListProps) {
  const t = useTranslations("Club");

  if (transactions.length === 0) {
    return (
      <div className={twMerge('rounded-2xl bg-white p-6 shadow-md border border-gray-200', className)}>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('Dashboard.history')}</h3>
        <div className="text-center py-12 text-gray-500">
          <span className="material-symbols-rounded text-5xl mb-3 block opacity-50" aria-hidden="true">
            history
          </span>
          <p>{t('Dashboard.emptyHistory')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={twMerge('rounded-2xl bg-white p-6 shadow-md border border-gray-200', className)}>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('Dashboard.history')}</h3>

      <div className="space-y-3">
        {transactions.map((transaction) => {
          const isPositive = transaction.amount > 0;
          const icon = TRANSACTION_ICONS[transaction.type as keyof typeof TRANSACTION_ICONS] || 'circle';
          const label = t(`History.type.${transaction.type}`);

          return (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 rounded-lg border border-outline-variant hover:bg-surface-container-low transition-colors"
            >
              {/* Left: Icon + Description */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div
                  className={twMerge(
                    'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center',
                    isPositive ? 'bg-primary-container text-primary' : 'bg-error-container text-error'
                  )}
                >
                  <span className="material-symbols-rounded text-xl" aria-hidden="true">{icon}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="font-medium text-on-surface truncate">
                    {transaction.description || label}
                  </div>
                  <div className="text-sm text-on-surface-variant">
                    {new Date(transaction.created_at).toLocaleDateString('vi-VN', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>

              {/* Right: Amount */}
              <div
                className={twMerge(
                  'text-lg font-bold flex-shrink-0 ml-4',
                  isPositive ? 'text-primary' : 'text-error'
                )}
              >
                {isPositive ? '+' : ''}
                {transaction.amount.toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
