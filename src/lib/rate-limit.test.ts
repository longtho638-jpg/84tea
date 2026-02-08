/**
 * @jest-environment node
 */
import { rateLimit, getClientIP } from './rate-limit';

describe('rateLimit', () => {
  it('allows requests under the limit', async () => {
    const limiter = rateLimit({ interval: 60000, uniqueTokenPerInterval: 100 });
    await expect(limiter.check(3, 'test-token')).resolves.toBeUndefined();
    await expect(limiter.check(3, 'test-token')).resolves.toBeUndefined();
    await expect(limiter.check(3, 'test-token')).resolves.toBeUndefined();
  });

  it('rejects requests over the limit', async () => {
    const limiter = rateLimit({ interval: 60000, uniqueTokenPerInterval: 100 });
    await limiter.check(2, 'over-token');
    await limiter.check(2, 'over-token');
    await expect(limiter.check(2, 'over-token')).rejects.toThrow('Rate limit exceeded');
  });

  it('tracks tokens independently', async () => {
    const limiter = rateLimit({ interval: 60000, uniqueTokenPerInterval: 100 });
    await limiter.check(1, 'token-a');
    await limiter.check(1, 'token-b');
    // token-a should be at limit, token-b should be at limit
    await expect(limiter.check(1, 'token-a')).rejects.toThrow();
    await expect(limiter.check(1, 'token-b')).rejects.toThrow();
  });

  it('allows first request for new token', async () => {
    const limiter = rateLimit({ interval: 60000, uniqueTokenPerInterval: 100 });
    await expect(limiter.check(1, 'fresh-token')).resolves.toBeUndefined();
  });
});

describe('getClientIP', () => {
  it('extracts IP from x-forwarded-for header', () => {
    const req = new Request('http://localhost', {
      headers: { 'x-forwarded-for': '192.168.1.1, 10.0.0.1' },
    });
    expect(getClientIP(req)).toBe('192.168.1.1');
  });

  it('extracts IP from x-real-ip header', () => {
    const req = new Request('http://localhost', {
      headers: { 'x-real-ip': '10.0.0.5' },
    });
    expect(getClientIP(req)).toBe('10.0.0.5');
  });

  it('returns unknown when no IP headers present', () => {
    const req = new Request('http://localhost');
    expect(getClientIP(req)).toBe('unknown');
  });

  it('prefers x-forwarded-for over x-real-ip', () => {
    const req = new Request('http://localhost', {
      headers: {
        'x-forwarded-for': '1.2.3.4',
        'x-real-ip': '5.6.7.8',
      },
    });
    expect(getClientIP(req)).toBe('1.2.3.4');
  });
});
