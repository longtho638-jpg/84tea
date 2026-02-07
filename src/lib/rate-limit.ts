/**
 * Rate Limiting Utility for API Routes
 * In-memory LRU cache implementation for edge runtime compatibility
 */

import { LRUCache } from 'lru-cache';

type RateLimitOptions = {
  interval: number; // ms
  uniqueTokenPerInterval: number;
};

export function rateLimit(options: RateLimitOptions) {
  const tokenCache = new LRUCache<string, number[]>({
    max: options.uniqueTokenPerInterval || 500,
    ttl: options.interval || 60000,
  });

  return {
    check: (limit: number, token: string) =>
      new Promise<void>((resolve, reject) => {
        const tokenCount = tokenCache.get(token) || [0];
        if (tokenCount[0] === 0) {
          tokenCache.set(token, [1]);
          resolve();
        } else if (tokenCount[0] < limit) {
          tokenCount[0] += 1;
          tokenCache.set(token, tokenCount);
          resolve();
        } else {
          reject(new Error('Rate limit exceeded'));
        }
      }),
  };
}

/**
 * Standard rate limiter: 60 requests per minute
 */
export const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500, // Max 500 unique IPs per interval
});

/**
 * Strict rate limiter: For sensitive operations (login, order creation)
 * 10 requests per 15 minutes
 */
export const strictLimiter = rateLimit({
  interval: 15 * 60 * 1000, // 15 minutes
  uniqueTokenPerInterval: 500,
});

/**
 * Extract IP address from request headers
 */
export function getClientIP(req: Request): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  );
}
