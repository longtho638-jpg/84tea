/**
 * @jest-environment node
 */

// Mock rate limiting
jest.mock('@/lib/rate-limit', () => ({
  strictLimiter: {
    check: jest.fn().mockResolvedValue(undefined),
  },
  limiter: {
    check: jest.fn().mockResolvedValue(undefined),
  },
  getClientIP: jest.fn().mockReturnValue('127.0.0.1'),
}));

// Mock payment utils
jest.mock('@/lib/payment-utils', () => ({
  logPaymentEvent: jest.fn().mockResolvedValue(undefined),
}));

// Mock Supabase
const mockSingle = jest.fn();
const mockEq = jest.fn().mockReturnValue({ single: mockSingle });
const mockSelectFields = jest.fn().mockReturnValue({ eq: mockEq });
const mockUpdate = jest.fn().mockReturnValue({ eq: jest.fn().mockResolvedValue({ error: null }) });
const mockFrom = jest.fn().mockReturnValue({
  select: mockSelectFields,
  update: mockUpdate,
});

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({ from: mockFrom })),
}));

// Mock PayOS
const mockVerify = jest.fn();
jest.mock('@/lib/payos', () => ({
  getPayOS: jest.fn(() => ({
    webhooks: { verify: mockVerify },
  })),
}));

import { POST } from '@/app/api/payment/webhook/route';
import { logPaymentEvent } from '@/lib/payment-utils';

function createWebhookRequest(body: unknown) {
  return new Request('http://localhost:3000/api/payment/webhook', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
}

const validWebhookBody = {
  code: '00',
  desc: 'Success',
  data: {
    orderCode: 1234567890,
    amount: 700000,
    description: 'Don hang 84tea',
  },
  signature: 'valid-signature-hash',
};

describe('POST /api/payment/webhook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockVerify.mockResolvedValue({ orderCode: 1234567890, amount: 700000 });
    mockSingle.mockResolvedValue({
      data: { id: 'uuid-123', payment_status: 'pending', status: 'pending', order_code: 1234567890 },
      error: null,
    });
    mockUpdate.mockReturnValue({
      eq: jest.fn().mockResolvedValue({ error: null }),
    });
  });

  it('processes valid webhook and updates order to paid', async () => {
    const res = await POST(createWebhookRequest(validWebhookBody));
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(mockVerify).toHaveBeenCalledWith(validWebhookBody);
  });

  it('returns 400 for invalid webhook structure', async () => {
    const res = await POST(createWebhookRequest({ invalid: true }));
    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json.error).toBe('Invalid webhook payload');
  });

  it('returns 400 when missing signature', async () => {
    const { signature: _, ...noSig } = validWebhookBody;
    const res = await POST(createWebhookRequest(noSig));
    expect(res.status).toBe(400);
  });

  it('returns 400 when missing data.orderCode', async () => {
    const body = {
      ...validWebhookBody,
      data: { amount: 700000 },
    };
    const res = await POST(createWebhookRequest(body));
    expect(res.status).toBe(400);
  });

  it('skips duplicate webhook (idempotency)', async () => {
    mockSingle.mockResolvedValueOnce({
      data: { id: 'uuid-123', payment_status: 'paid', status: 'processing', order_code: 1234567890 },
      error: null,
    });
    const res = await POST(createWebhookRequest(validWebhookBody));
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.message).toBe('Already processed');
    expect(logPaymentEvent).toHaveBeenCalledWith('webhook_duplicate', expect.any(Object));
  });

  it('returns 404 when order not found', async () => {
    mockSingle.mockResolvedValueOnce({
      data: null,
      error: { message: 'Not found', code: 'PGRST116' },
    });
    const res = await POST(createWebhookRequest(validWebhookBody));
    expect(res.status).toBe(404);
  });

  it('returns 400 when PayOS signature verification fails', async () => {
    mockVerify.mockRejectedValueOnce(new Error('Invalid signature'));
    const res = await POST(createWebhookRequest(validWebhookBody));
    expect(res.status).toBe(400);
  });

  it('handles non-success webhook code without updating order', async () => {
    const body = { ...validWebhookBody, code: '01' };
    const res = await POST(createWebhookRequest(body));
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    // Should NOT call update since code !== '00'
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it('logs webhook received event', async () => {
    await POST(createWebhookRequest(validWebhookBody));
    expect(logPaymentEvent).toHaveBeenCalledWith('webhook_received', expect.objectContaining({
      orderCode: 1234567890,
    }));
  });
});
