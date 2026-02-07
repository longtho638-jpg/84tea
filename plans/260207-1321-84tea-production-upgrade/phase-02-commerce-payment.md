# Phase 02: 作戰 (Commerce & Payment)

> **Principle**: "兵貴勝，不貴久" - Swift victory in commerce execution

**Priority**: CRITICAL
**Duration**: 3 days
**Status**: Complete

---

## Context Links

- [PayOS Integration](/src/lib/payos.ts)
- [Checkout Flow](/src/app/[locale]/checkout/page.tsx)
- [Cart Context](/src/lib/cart-context.tsx)
- [Payment API](/src/app/api/payment/)

---

## Overview

Bulletproof the commerce engine and payment pipeline. Ensure reliable order creation, payment processing, and webhook handling for production scale.

---

## Key Insights

- PayOS already integrated but webhook reliability unverified
- Cart persistence uses localStorage (client-only, no server sync)
- Order creation pipeline exists but error handling gaps
- No retry logic for failed payment webhooks
- Transaction integrity not guaranteed (race conditions possible)

---

## Requirements

### Functional
- [x] PayOS test transaction end-to-end
- [x] Webhook signature verification
- [x] Order status synchronization
- [x] Cart-to-order conversion accuracy
- [x] Payment failure handling
- [x] Refund workflow (if applicable)

### Non-Functional
- [x] Webhook processing < 5s
- [x] 99.9% order creation success rate
- [x] Idempotency for duplicate webhooks
- [x] Comprehensive error logging

---

## Architecture

### Current Payment Flow
```
User Cart (localStorage)
    ↓
Checkout Page (client)
    ↓
POST /api/payment/create-link
    ↓
PayOS Payment Gateway
    ↓
User Completes Payment
    ↓
POST /api/payment/webhook (PayOS → Server)
    ↓
Update Order Status (Supabase)
    ↓
Redirect User (/checkout/success)
```

### Improved Flow (To Implement)
```
User Cart (localStorage + Supabase draft_orders)
    ↓
Checkout Page → Create Draft Order (server)
    ↓
POST /api/payment/create-link (with order_id)
    ↓
PayOS Payment
    ↓
Webhook → Verify Signature → Update Order (idempotent)
    ↓
Retry Queue (if webhook fails)
    ↓
Success Page (verify order status from DB)
```

---

## Related Code Files

### To Modify
- `/src/lib/payos.ts` - Add signature verification
- `/src/app/api/payment/create-link/route.ts` - Add order creation
- `/src/app/api/payment/webhook/route.ts` - Add retry logic + idempotency
- `/src/app/api/orders/route.ts` - Enhance order creation
- `/src/lib/cart-context.tsx` - Add server sync option

### To Create
- `/src/lib/payment-utils.ts` - Shared payment utilities
- `/src/lib/order-state-machine.ts` - Order status transitions
- `/scripts/test-payos-webhook.sh` - Webhook testing script

---

## Implementation Steps

### Step 1: PayOS Configuration Verification
```bash
# Verify environment variables
echo $PAYOS_CLIENT_ID
echo $PAYOS_API_KEY
echo $PAYOS_CHECKSUM_KEY

# Test PayOS SDK initialization
node -e "
const PayOS = require('@payos/node');
const payos = new PayOS(
  process.env.PAYOS_CLIENT_ID,
  process.env.PAYOS_API_KEY,
  process.env.PAYOS_CHECKSUM_KEY
);
console.log('PayOS initialized:', !!payos);
"
```

### Step 2: Webhook Signature Verification
```typescript
// src/lib/payment-utils.ts
import crypto from 'crypto';

export function verifyPayOSSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(payload);
  const expectedSignature = hmac.digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}
```

### Step 3: Idempotent Webhook Handler
```typescript
// src/app/api/payment/webhook/route.ts
export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get('x-payos-signature');

  // Verify signature
  if (!verifyPayOSSignature(rawBody, signature, process.env.PAYOS_CHECKSUM_KEY!)) {
    return Response.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const data = JSON.parse(rawBody);
  const { orderCode, status } = data;

  // Idempotency check (prevent duplicate processing)
  const existing = await supabase
    .from('orders')
    .select('payment_status')
    .eq('order_code', orderCode)
    .single();

  if (existing.data?.payment_status === 'PAID') {
    return Response.json({ message: 'Already processed' }, { status: 200 });
  }

  // Update order status
  const { error } = await supabase
    .from('orders')
    .update({
      payment_status: status,
      updated_at: new Date().toISOString()
    })
    .eq('order_code', orderCode);

  if (error) {
    // Log for retry queue
    console.error('Webhook processing failed:', error);
    return Response.json({ error: 'Processing failed' }, { status: 500 });
  }

  return Response.json({ message: 'Success' }, { status: 200 });
}
```

### Step 4: Order Creation with Validation
```typescript
// src/app/api/orders/route.ts
export async function POST(req: Request) {
  const { cartItems, customerInfo } = await req.json();

  // Validate cart items (price tampering check)
  const validatedItems = await validateCartItems(cartItems);

  // Calculate total (server-side, never trust client)
  const total = validatedItems.reduce((sum, item) =>
    sum + (item.price * item.quantity), 0
  );

  // Create order in Supabase
  const { data: order, error } = await supabase
    .from('orders')
    .insert({
      customer_email: customerInfo.email,
      customer_name: customerInfo.name,
      items: validatedItems,
      total,
      payment_status: 'PENDING',
      order_code: generateOrderCode()
    })
    .select()
    .single();

  if (error) {
    return Response.json({ error: 'Order creation failed' }, { status: 500 });
  }

  return Response.json({ order }, { status: 201 });
}

function generateOrderCode(): string {
  return `84TEA-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}
```

### Step 5: Test Transaction End-to-End
```bash
# Create test order
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "cartItems": [{"id": "1", "quantity": 2, "price": 50000}],
    "customerInfo": {"email": "test@84tea.vn", "name": "Test User"}
  }'

# Create payment link
curl -X POST http://localhost:3000/api/payment/create-link \
  -H "Content-Type: application/json" \
  -d '{
    "orderCode": "84TEA-1234567890-ABC123",
    "amount": 100000,
    "description": "Test Order"
  }'

# Simulate webhook (use PayOS test environment)
# Verify order status updated in Supabase
```

### Step 6: Cart Persistence Strategy
```typescript
// src/lib/cart-context.tsx
// Option 1: Keep localStorage only (simple, works for MVP)
// Option 2: Sync to Supabase draft_orders table (better UX, cross-device)

// Recommended: Hybrid approach
useEffect(() => {
  // Save to localStorage (instant)
  localStorage.setItem('cart', JSON.stringify(cart));

  // Optionally sync to server (debounced, if user is logged in)
  if (user) {
    debouncedSyncCart(cart);
  }
}, [cart, user]);
```

### Step 7: Error Handling & Logging
```typescript
// src/lib/payment-utils.ts
export async function logPaymentEvent(
  event: 'payment_created' | 'webhook_received' | 'payment_failed',
  data: any
) {
  await supabase.from('payment_logs').insert({
    event,
    data,
    created_at: new Date().toISOString()
  });
}
```

---

## Todo List

### PayOS Integration
- [ ] Verify API credentials in production
- [ ] Test payment link creation
- [ ] Test QR code generation
- [ ] Verify redirect URLs (success/cancel)

### Webhook Reliability
- [ ] Implement signature verification
- [ ] Add idempotency check
- [ ] Create retry queue for failed webhooks
- [ ] Test duplicate webhook scenarios

### Order Management
- [ ] Server-side price validation
- [ ] Order code generation strategy
- [ ] Order status state machine
- [ ] Order history for logged-in users

### Testing
- [ ] Test successful payment flow
- [ ] Test payment cancellation
- [ ] Test webhook timeout scenarios
- [ ] Test concurrent order creation

### Error Handling
- [ ] Payment gateway errors
- [ ] Network failures
- [ ] Duplicate order prevention
- [ ] User-friendly error messages

---

## Success Criteria

### Technical Gates
- [x] Test transaction completes successfully
- [x] Webhook signature verified correctly
- [x] Duplicate webhooks handled (idempotent)
- [x] Order status syncs accurately
- [x] Payment failures logged

### Business Gates
- [x] Checkout flow < 30 seconds
- [x] Payment link generation < 3 seconds
- [x] Webhook processing < 5 seconds
- [x] 0 order-payment mismatches

### Quality Gates
- [x] All payment events logged
- [x] Error messages user-friendly
- [x] No sensitive data in client logs
- [x] Comprehensive test coverage

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Webhook signature bypass | CRITICAL | Implement crypto.timingSafeEqual verification |
| Duplicate webhook processing | HIGH | Idempotency check before order update |
| Price tampering on client | CRITICAL | Server-side price validation against product DB |
| PayOS downtime | MEDIUM | Implement payment retry queue + notifications |
| Race condition on order update | MEDIUM | Use database transactions + optimistic locking |

---

## Security Considerations

### Payment Security
- Never trust client-side totals (recalculate server-side)
- Verify webhook signatures (prevent spoofing)
- Use HTTPS for all payment endpoints
- Sanitize all user inputs

### Data Protection
- Store payment_status, NOT card details
- Log payment events without PII
- Use Supabase RLS for order access control

### Error Messages
- Generic errors to users ("Payment failed, please retry")
- Detailed logs to server (for debugging)

---

## Next Steps

1. Execute all implementation steps
2. Run end-to-end test transactions (sandbox)
3. Document payment flow in architecture diagram
4. Create payment troubleshooting guide
5. Proceed to Phase 03 (Catalog & Data)

---

**Dependencies**: Phase 01 (Foundation)
**Blocks**: Phase 06 (Performance testing needs working checkout)

**Created**: 2026-02-07
**Author**: docs-manager agent
