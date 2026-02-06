import { render, screen } from '@testing-library/react';
import { LoyaltyPointsCard } from './loyalty-points-card';

describe('LoyaltyPointsCard', () => {
  it('renders points and tier correctly', () => {
    render(<LoyaltyPointsCard points={1234} tier="silver" />);

    expect(screen.getByText('1,234')).toBeInTheDocument();
    expect(screen.getByText('Điểm thưởng của bạn')).toBeInTheDocument();
    // It should render the TierBadge
    expect(screen.getByText('Silver')).toBeInTheDocument();
  });

  it('displays progress to next tier for non-max tier', () => {
    // Silver tier (1000-4999), Gold starts at 5000
    // Points 1234. Needed: 5000 - 1234 = 3766
    render(<LoyaltyPointsCard points={1234} tier="silver" />);

    expect(screen.getByText('Tiến độ lên hạng Gold')).toBeInTheDocument();
    expect(screen.getByText('3,766 điểm nữa')).toBeInTheDocument();
  });

  it('displays max tier message for diamond tier', () => {
    render(<LoyaltyPointsCard points={20000} tier="diamond" />);

    expect(screen.getByText('🎉 Bạn đã đạt hạng cao nhất!')).toBeInTheDocument();
    expect(screen.queryByText(/Tiến độ lên hạng/)).not.toBeInTheDocument();
  });

  it('renders redeem button as disabled placeholder', () => {
    render(<LoyaltyPointsCard points={100} tier="bronze" />);

    const button = screen.getByRole('button', { name: /Đổi điểm/i });
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent('Coming soon');
  });
});
