/**
 * @jest-environment node
 */

// Mock rate limiting
jest.mock('@/lib/rate-limit', () => ({
  strictLimiter: {
    check: jest.fn().mockResolvedValue(undefined),
  },
  getClientIP: jest.fn().mockReturnValue('127.0.0.1'),
}));

// Mock payment utils
jest.mock('@/lib/payment-utils', () => ({
  validateCartItems: jest.fn().mockResolvedValue([
    { id: 'p1', name: 'Trà Shan Tuyết', quantity: 2, price: 350000 },
  ]),
  calculateOrderTotal: jest.fn().mockReturnValue(700000),
  logPaymentEvent: jest.fn().mockResolvedValue(undefined),
}));

// Mock PayOS
const mockCreate = jest.fn();
jest.mock('@/lib/payos', () => ({
  getPayOS: jest.fn(() => ({
    paymentRequests: { create: mockCreate },
  })),
}));

import { POST } from '@/app/api/payment/create-link/route';
import { strictLimiter } from '@/lib/rate-limit';
import { validateCartItems, logPaymentEvent } from '@/lib/payment-utils';

function createRequest(body: unknown) {
  return new Request('http://localhost:3000/api/payment/create-link', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
}

const validBody = {
  orderCode: 1234567890,
  description: 'Don hang 84tea',
  returnUrl: 'https://84tea.com/success',
  cancelUrl: 'https://84tea.com/cancel',
  items: [
    { name: 'Trà Shan Tuyết', quantity: 2, price: 350000 },
  ],
  buyerName: 'Nguyen Van A',
  buyerPhone: '0901234567',
};

describe('POST /api/payment/create-link', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCreate.mockResolvedValue({
      checkoutUrl: 'https://pay.payos.vn/checkout/123',
      orderCode: 1234567890,
    });
  });

  it('creates payment link with valid data', async () => {
    const res = await POST(createRequest(validBody));
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.checkoutUrl).toBeDefined();
    expect(json.orderCode).toBe(1234567890);
  });

  it('returns 400 for missing required fields', async () => {
    const res = await POST(createRequest({ items: [] }));
    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json.error).toBe('Validation failed');
  });

  it('returns 400 for non-positive orderCode', async () => {
    const res = await POST(createRequest({ ...validBody, orderCode: 0 }));
    expect(res.status).toBe(400);
  });

  it('returns 400 for non-integer orderCode', async () => {
    const res = await POST(createRequest({ ...validBody, orderCode: 1.5 }));
    expect(res.status).toBe(400);
  });

  it('returns 400 for invalid returnUrl', async () => {
    const res = await POST(createRequest({ ...validBody, returnUrl: 'not-a-url' }));
    expect(res.status).toBe(400);
  });

  it('returns 429 when rate limited', async () => {
    (strictLimiter.check as jest.Mock).mockRejectedValueOnce(new Error('Rate limit'));
    const res = await POST(createRequest(validBody));
    expect(res.status).toBe(429);
  });

  it('returns 400 when cart validation fails', async () => {
    (validateCartItems as jest.Mock).mockRejectedValueOnce(new Error('Product unavailable'));
    const res = await POST(createRequest(validBody));
    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json.error).toContain('invalid or unavailable');
  });

  it('returns 400 on price tampering', async () => {
    const res = await POST(createRequest({
      ...validBody,
      amount: 100000, // Server calculates 700000
    }));
    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json.error).toContain('Price mismatch');
  });

  it('logs payment_created event on success', async () => {
    await POST(createRequest(validBody));
    expect(logPaymentEvent).toHaveBeenCalledWith('payment_created', expect.objectContaining({
      orderCode: 1234567890,
      amount: 700000,
    }));
  });

  it('returns 500 when PayOS fails', async () => {
    mockCreate.mockRejectedValueOnce(new Error('PayOS service unavailable'));
    const res = await POST(createRequest(validBody));
    expect(res.status).toBe(500);
  });

  it('logs payment_failed on error', async () => {
    mockCreate.mockRejectedValueOnce(new Error('PayOS error'));
    await POST(createRequest(validBody));
    expect(logPaymentEvent).toHaveBeenCalledWith('payment_failed', expect.objectContaining({
      error: 'Payment link creation failed',
    }));
  });
});
