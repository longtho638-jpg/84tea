export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

interface StateTransition {
  from: OrderStatus[];
  to: OrderStatus;
}

const ORDER_TRANSITIONS: StateTransition[] = [
  { from: ['pending'], to: 'processing' },   // Payment received
  { from: ['pending'], to: 'cancelled' },    // User cancelled or timeout
  { from: ['processing'], to: 'shipped' },   // Order packed and shipped
  { from: ['processing'], to: 'cancelled' }, // Admin cancelled (requires refund)
  { from: ['shipped'], to: 'delivered' },    // Successful delivery
  { from: ['shipped'], to: 'cancelled' },    // Lost/Returned?
  { from: ['delivered'], to: 'refunded' },   // Return processed
];

export function isValidOrderTransition(current: OrderStatus, next: OrderStatus): boolean {
  const transition = ORDER_TRANSITIONS.find(t => t.to === next);
  return transition ? transition.from.includes(current) : false;
}

export function getNextOrderAction(status: OrderStatus, paymentStatus: PaymentStatus): string {
  switch (status) {
    case 'pending':
      return paymentStatus === 'paid' ? 'Process Order' : 'Wait for Payment';
    case 'processing':
      return 'Ship Order';
    case 'shipped':
      return 'Mark Delivered';
    default:
      return 'View Details';
  }
}
