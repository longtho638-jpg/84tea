import { render, screen } from '@testing-library/react';
import { LoyaltyDashboard } from './loyalty-dashboard-view';
import * as Hook from '@/lib/hooks/use-loyalty-transaction-history';

// Mock the hook
jest.mock('@/lib/hooks/use-loyalty-transaction-history');

describe('LoyaltyDashboard', () => {
  const mockTransactions = [
    {
      id: '1',
      user_id: 'user1',
      amount: 100,
      type: 'purchase',
      description: 'Test Purchase',
      created_at: '2023-01-01T00:00:00Z',
    }
  ];

  it('renders welcome message and points card', () => {
    // Mock return value for loading state
    (Hook.useLoyaltyTransactionHistory as jest.Mock).mockReturnValue({
      transactions: [],
      loading: true,
      error: null
    });

    render(
      <LoyaltyDashboard
        userName="Test User"
        userId="user1"
        points={1000}
        tier="silver"
      />
    );

    expect(screen.getByText('Xin chào, Test User! 👋')).toBeInTheDocument();
    expect(screen.getByText('1,000')).toBeInTheDocument(); // Points on card
    expect(screen.getByText('Silver')).toBeInTheDocument(); // Tier badge
  });

  it('renders loading state for history', () => {
    (Hook.useLoyaltyTransactionHistory as jest.Mock).mockReturnValue({
      transactions: [],
      loading: true,
      error: null
    });

    render(
      <LoyaltyDashboard
        userName="Test User"
        userId="user1"
        points={1000}
        tier="silver"
      />
    );

    expect(screen.getByText('Đang tải lịch sử...')).toBeInTheDocument();
  });

  it('renders history list when loaded', () => {
    (Hook.useLoyaltyTransactionHistory as jest.Mock).mockReturnValue({
      transactions: mockTransactions,
      loading: false,
      error: null
    });

    render(
      <LoyaltyDashboard
        userName="Test User"
        userId="user1"
        points={1000}
        tier="silver"
      />
    );

    expect(screen.queryByText('Đang tải lịch sử...')).not.toBeInTheDocument();
    expect(screen.getByText('Test Purchase')).toBeInTheDocument();
  });
});
