/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';

// Mock rate limiting
jest.mock('@/lib/rate-limit', () => ({
  limiter: {
    check: jest.fn().mockResolvedValue(undefined),
  },
  getClientIP: jest.fn().mockReturnValue('127.0.0.1'),
}));

// Mock Supabase server client - use lazy references to avoid TDZ with jest.mock hoisting
const mockSingle = jest.fn();
const mockOrder = jest.fn().mockImplementation(function (this: unknown) { return this; });
const mockRange = jest.fn().mockImplementation(() => ({ order: mockOrder }));
const mockSelectCount = jest.fn().mockImplementation(() => ({ range: mockRange }));
const mockInsert = jest.fn().mockImplementation(() => ({
  select: jest.fn().mockReturnValue({ single: mockSingle }),
}));
const mockProfileSingle = jest.fn();
const mockEq = jest.fn().mockImplementation(() => ({ single: mockProfileSingle }));
const mockSelectProfile = jest.fn().mockImplementation(() => ({ eq: mockEq }));
const mockGetUser = jest.fn();

const mockFrom = jest.fn().mockImplementation((table: string) => {
  if (table === 'profiles') {
    return { select: mockSelectProfile };
  }
  return {
    select: mockSelectCount,
    insert: mockInsert,
  };
});

// Use mockImplementation (lazy) instead of mockResolvedValue (eager) to avoid TDZ
jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn().mockImplementation(() =>
    Promise.resolve({
      from: mockFrom,
      auth: { getUser: mockGetUser },
    })
  ),
}));

import { GET, POST } from '@/app/api/products/route';
import { limiter } from '@/lib/rate-limit';

function createRequest(method: string, body?: unknown, searchParams?: Record<string, string>) {
  const url = new URL('http://localhost:3000/api/products');
  if (searchParams) {
    Object.entries(searchParams).forEach(([k, v]) => url.searchParams.set(k, v));
  }
  return new NextRequest(url, {
    method,
    ...(body ? { body: JSON.stringify(body) } : {}),
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
  });
}

describe('GET /api/products', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetUser.mockResolvedValue({ data: { user: { id: 'admin-id' } } });
    mockProfileSingle.mockResolvedValue({ data: { role: 'admin' }, error: null });
    mockOrder.mockResolvedValue({
      data: [{ id: 'p1', name: 'Trà Shan Tuyết', price: 350000 }],
      count: 1,
      error: null,
    });
  });

  it('returns 401 when not authenticated', async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: null } });
    const res = await GET(createRequest('GET'));
    expect(res.status).toBe(401);
  });

  it('returns 403 when not admin', async () => {
    mockProfileSingle.mockResolvedValueOnce({ data: { role: 'customer' }, error: null });
    const res = await GET(createRequest('GET'));
    expect(res.status).toBe(403);
  });

  it('returns products for admin user', async () => {
    const res = await GET(createRequest('GET'));
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.products).toBeDefined();
  });

  it('returns 429 when rate limited', async () => {
    (limiter.check as jest.Mock).mockRejectedValueOnce(new Error('Rate limit'));
    const res = await GET(createRequest('GET'));
    expect(res.status).toBe(429);
  });
});

describe('POST /api/products', () => {
  const validProduct = {
    name: 'Trà Shan Tuyết',
    price: 350000,
    category: 'tra-co-thu',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetUser.mockResolvedValue({ data: { user: { id: 'admin-id' } } });
    mockProfileSingle.mockResolvedValue({ data: { role: 'admin' }, error: null });
    mockSingle.mockResolvedValue({
      data: { id: 'new-p1', ...validProduct },
      error: null,
    });
  });

  it('creates product with valid data', async () => {
    const res = await POST(createRequest('POST', validProduct));
    const json = await res.json();
    expect(res.status).toBe(201);
    expect(json.product).toBeDefined();
  });

  it('returns 400 for invalid product data', async () => {
    const res = await POST(createRequest('POST', { name: 'A', price: -1 }));
    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json.error).toBe('Validation failed');
    expect(json.details).toBeDefined();
  });

  it('returns 400 for missing required fields', async () => {
    const res = await POST(createRequest('POST', { name: 'Tea' }));
    expect(res.status).toBe(400);
  });

  it('returns 401 when not authenticated', async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: null } });
    const res = await POST(createRequest('POST', validProduct));
    expect(res.status).toBe(401);
  });

  it('returns 403 when not admin', async () => {
    mockProfileSingle.mockResolvedValueOnce({ data: { role: 'user' }, error: null });
    const res = await POST(createRequest('POST', validProduct));
    expect(res.status).toBe(403);
  });

  it('returns 429 when rate limited', async () => {
    (limiter.check as jest.Mock).mockRejectedValueOnce(new Error('Rate limit'));
    const res = await POST(createRequest('POST', validProduct));
    expect(res.status).toBe(429);
  });

  it('validates price range (rejects > 100M)', async () => {
    const res = await POST(createRequest('POST', { ...validProduct, price: 200_000_000 }));
    expect(res.status).toBe(400);
  });
});
