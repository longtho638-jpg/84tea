import { render, screen } from '@testing-library/react';
import { TierBadge } from './loyalty-tier-badge';

describe('TierBadge', () => {
  it('renders Bronze badge correctly', () => {
    render(<TierBadge tier="bronze" />);
    expect(screen.getByText('Bronze')).toBeInTheDocument();
    expect(screen.getByText('workspace_premium')).toBeInTheDocument();
  });

  it('renders Silver badge correctly', () => {
    render(<TierBadge tier="silver" />);
    expect(screen.getByText('Silver')).toBeInTheDocument();
  });

  it('renders Gold badge correctly', () => {
    render(<TierBadge tier="gold" />);
    expect(screen.getByText('Gold')).toBeInTheDocument();
  });

  it('renders Diamond badge correctly', () => {
    render(<TierBadge tier="diamond" />);
    expect(screen.getByText('Diamond')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<TierBadge tier="bronze" className="custom-class" />);
    // The component wrapper should have the class
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
