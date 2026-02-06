import { render, screen } from '@testing-library/react';
import { LoyaltyPointsHistoryList } from './loyalty-points-history-list';
import { LoyaltyTransaction } from '@/types/loyalty-transaction.types';

describe('LoyaltyPointsHistoryList', () => {
  const mockTransactions: LoyaltyTransaction[] = [
    {
      id: '1',
      user_id: 'user1',
      amount: 100,
      type: 'purchase',
      description: 'Order #123',
      created_at: '2023-01-01T10:00:00Z',
    },
    {
      id: '2',
      user_id: 'user1',
      amount: 50,
      type: 'bonus',
      description: 'Welcome Bonus',
      created_at: '2023-01-02T10:00:00Z',
    },
    {
      id: '3',
      user_id: 'user1',
      amount: -20,
      type: 'redemption',
      description: 'Redeemed Coupon',
      created_at: '2023-01-03T10:00:00Z',
    }
  ];

  it('renders empty state when no transactions provided', () => {
    render(<LoyaltyPointsHistoryList transactions={[]} />);

    expect(screen.getByText('Lịch sử giao dịch')).toBeInTheDocument();
    expect(screen.getByText('Chưa có giao dịch nào')).toBeInTheDocument();
  });

  it('renders list of transactions correctly', () => {
    render(<LoyaltyPointsHistoryList transactions={mockTransactions} />);

    expect(screen.getAllByText('Lịch sử giao dịch')).toHaveLength(1); // One header

    // Check first transaction
    expect(screen.getByText('Order #123')).toBeInTheDocument();
    expect(screen.getByText('+100')).toBeInTheDocument();

    // Check second transaction
    expect(screen.getByText('Welcome Bonus')).toBeInTheDocument();
    expect(screen.getByText('+50')).toBeInTheDocument();

    // Check negative transaction (redemption)
    expect(screen.getByText('Redeemed Coupon')).toBeInTheDocument();
    expect(screen.getByText('-20')).toBeInTheDocument();
  });

  it('uses default labels when description is missing', () => {
    const transactionsWithoutDesc: LoyaltyTransaction[] = [
      {
        id: '4',
        user_id: 'user1',
        amount: 100,
        type: 'purchase',
        description: null as any, // Simulate missing description from DB if that happens
        created_at: '2023-01-04T10:00:00Z',
      }
    ];

    render(<LoyaltyPointsHistoryList transactions={transactionsWithoutDesc} />);
    // Should fallback to 'Mua hàng' for purchase type
    expect(screen.getByText('Mua hàng')).toBeInTheDocument();
  });
});
