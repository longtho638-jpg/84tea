---
title: "Phase 2: PayOS Integration"
description: "Integrate PayOS for VietQR payments."
status: pending
priority: P1
---

# Phase 2: PayOS Integration

## 1. Requirements
- **Provider:** PayOS (VietQR).
- **Flow:** User clicks Checkout -> Redirect/Modal with QR -> Payment Success -> Order Status Update.
- **Tech:** `@payos/node` for backend interactions.

## 2. Architecture
- **Lib:** `src/lib/payos.ts` initializes the PayOS client.
- **API Create Link:** `POST /api/payment/create-link`
  - Input: `orderCode`, `amount`, `description`, `returnUrl`, `cancelUrl`.
  - Output: `checkoutUrl`.
- **API Webhook:** `POST /api/payment/webhook`
  - Receives payment status updates.
  - Verifies signature.
  - Updates order status in Supabase (or database).

## 3. Implementation Steps

### 3.1. Install SDK
```bash
npm install @payos/node
```

### 3.2. Library Setup
Create `src/lib/payos.ts`:
```typescript
import PayOS from "@payos/node";

const payOS = new PayOS(
  process.env.PAYOS_CLIENT_ID!,
  process.env.PAYOS_API_KEY!,
  process.env.PAYOS_CHECKSUM_KEY!
);

export default payOS;
```

### 3.3. Create Payment Link API
Implement `src/app/api/payment/create-link/route.ts`.
- Generate unique `orderCode` (must be number, safe range).
- Call `payOS.createPaymentLink(body)`.
- Return the `checkoutUrl`.

### 3.4. Webhook Handler
Implement `src/app/api/payment/webhook/route.ts`.
- Verify webhook data using `payOS.verifyPaymentWebhookData(body)`.
- Handle cases: `success`, `cancelled`.
- Update order status in database.
- Return response to PayOS (fast response required).

### 3.5. UI Integration
- Create/Update `src/components/checkout/PaymentButton.tsx`.
- On click, call `/api/payment/create-link`.
- Redirect user to the returned `checkoutUrl`.
- Create Success/Cancel return pages:
  - `src/app/[locale]/checkout/success/page.tsx`
  - `src/app/[locale]/checkout/cancel/page.tsx`

## 4. Todo List
- [ ] Install `@payos/node`.
- [ ] Configure env vars in `.env.local`.
- [ ] Create `src/lib/payos.ts`.
- [ ] Implement `POST /api/payment/create-link`.
- [ ] Implement `POST /api/payment/webhook`.
- [ ] Create Payment Button component.
- [ ] Create Success/Cancel pages.
- [ ] Test with PayOS Sandbox keys.

## 5. Verification
- Click Checkout -> Redirected to PayOS page.
- Scan QR with banking app (Test mode).
- Payment successful -> Redirect to Success page.
- Webhook received -> Console log or DB update verified.
