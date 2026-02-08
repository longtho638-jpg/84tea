/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';

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
  validateCartItems: jest.fn().mockResolvedValue([
    { id: 'p1', name: 'Trà Shan Tuyết', quantity: 2, price: 350000 },
  ]),
  calculateOrderTotal: jest.fn().mockReturnValue(700000),
}));

// Mock Supabase - use a chainable query builder
const mockSingle = jest.fn();
const mockSelect = jest.fn().mockReturnValue({ single: mockSingle });
const mockInsert = jest.fn().mockReturnValue({ select: mockSelect });

// Chainable query builder for GET: select("*") returns obj with .eq() and .single()
// .eq() returns the same obj (like real Supabase client)
const mockQueryBuilder: Record<string, jest.Mock> = {};
mockQueryBuilder.eq = jest.fn().mockReturnValue(mockQueryBuilder);
mockQueryBuilder.single = mockSingle;
const mockSelectAll = jest.fn().mockReturnValue(mockQueryBuilder);

const mockFrom = jest.fn().mockImplementation(() => ({
  insert: mockInsert,
  select: mockSelectAll,
}));

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({ from: mockFrom })),
}));

import { POST, GET } from '@/app/api/orders/route';
import { strictLimiter, limiter } from '@/lib/rate-limit';
import { validateCartItems } from '@/lib/payment-utils';

function createRequest(method: string, body?: unknown, searchParams?: Record<string, string>) {
  const url = new URL('http://localhost:3000/api/orders');
  if (searchParams) {
    Object.entries(searchParams).forEach(([k, v]) => url.searchParams.set(k, v));
  }
  return new NextRequest(url, {
    method,
    ...(body ? { body: JSON.stringify(body) } : {}),
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
  });
}

const validOrderBody = {
  items: [
    { productId: 'p1', name: 'Trà Shan Tuyết', quantity: 2, price: 350000, weight: '200g' },
  ],
  total: 700000,
  customerInfo: {
    name: 'Nguyen Van A',
    phone: '0901234567',
    address: '123 Nguyen Hue, Quan 1',
    city: 'Ho Chi Minh',
  },
};

describe('POST /api/orders', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSingle.mockResolvedValue({
      data: {
        id: 'uuid-123',
        order_code: 1234567890,
        status: 'pending',
        total: 700000,
        items: [],
        payment_status: 'pending',
        created_at: '2026-02-08T00:00:00Z',
      },
      error: null,
    });
  });

  it('creates order with valid data', async () => {
    const res = await POST(createRequest('POST', validOrderBody));
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.order.orderCode).toBeDefined();
  });

  it('returns 400 for invalid body (missing items)', async () => {
    const res = await POST(createRequest('POST', { total: 100 }));
    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json.error).toBe('Validation failed');
    expect(json.details).toBeDefined();
  });

  it('returns 400 for invalid customer info', async () => {
    const res = await POST(createRequest('POST', {
      ...validOrderBody,
      customerInfo: { name: 'A', phone: '1', address: 'x', city: '' },
    }));
    expect((await res.json()).error).toBe('Validation failed');
    expect(res.status).toBe(400);
  });

  it('returns 429 when rate limited', async () => {
    (strictLimiter.check as jest.Mock).mockRejectedValueOnce(new Error('Rate limit'));
    const res = await POST(createRequest('POST', validOrderBody));
    expect(res.status).toBe(429);
  });

  it('returns 400 when cart validation fails', async () => {
    (validateCartItems as jest.Mock).mockRejectedValueOnce(new Error('Product not found'));
    const res = await POST(createRequest('POST', validOrderBody));
    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json.error).toContain('invalid or unavailable');
  });

  it('returns 400 on price mismatch (tampering)', async () => {
    const res = await POST(createRequest('POST', {
      ...validOrderBody,
      total: 100000, // server calculates 700000
    }));
    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json.error).toContain('Price mismatch');
  });

  it('returns 500 on database error', async () => {
    mockSingle.mockResolvedValueOnce({
      data: null,
      error: { message: 'DB error', code: 'PGRST116' },
    });
    const res = await POST(createRequest('POST', validOrderBody));
    expect(res.status).toBe(500);
  });
});

describe('GET /api/orders', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSingle.mockResolvedValue({
      data: {
        id: 'uuid-123',
        order_code: 1234567890,
        status: 'pending',
        total: 700000,
        items: [],
        payment_status: 'pending',
        created_at: '2026-02-08T00:00:00Z',
      },
      error: null,
    });
  });

  it('returns 400 when no id or orderCode provided', async () => {
    const res = await GET(createRequest('GET'));
    expect(res.status).toBe(400);
  });

  it('fetches order by id', async () => {
    const res = await GET(createRequest('GET', undefined, { id: 'uuid-123' }));
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
  });

  it('fetches order by orderCode', async () => {
    const res = await GET(createRequest('GET', undefined, { orderCode: '1234567890' }));
    expect(res.status).toBe(200);
  });

  it('returns 404 when order not found', async () => {
    mockSingle.mockResolvedValueOnce({ data: null, error: { message: 'Not found' } });
    const res = await GET(createRequest('GET', undefined, { id: 'nonexistent' }));
    expect(res.status).toBe(404);
  });

  it('returns 429 when rate limited', async () => {
    (limiter.check as jest.Mock).mockRejectedValueOnce(new Error('Rate limit'));
    const res = await GET(createRequest('GET', undefined, { id: 'uuid-123' }));
    expect(res.status).toBe(429);
  });
});
