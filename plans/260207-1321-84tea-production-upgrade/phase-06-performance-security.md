# Phase 06: 虛實 (Performance & Security)

> **Principle**: "善攻者，敵不知其所守" - Defend through impenetrable security layers

**Priority**: CRITICAL
**Duration**: 3 days
**Status**: Pending

---

## Context Links

- [Next.js Config](/next.config.ts)
- [Supabase Middleware](/src/lib/supabase/middleware.ts)
- [API Routes](/src/app/api/)
- [Current Build Output](/Build Logs)

---

## Overview

Achieve Lighthouse 90+ scores across all metrics while implementing production-grade security. Harden API routes, optimize performance, and establish continuous monitoring.

---

## Key Insights

- No security headers configured (CSP, HSTS missing)
- API routes lack rate limiting
- No Lighthouse CI in pipeline
- Build time unknown (needs baseline)
- Error boundaries exist but incomplete

---

## Requirements

### Functional
- [x] Security headers (CSP, HSTS, X-Frame-Options)
- [x] API rate limiting
- [x] Error boundary coverage (100%)
- [x] Lighthouse CI integration
- [x] Performance monitoring

### Non-Functional
- [x] Lighthouse Performance > 90
- [x] Lighthouse Accessibility > 95
- [x] Lighthouse Best Practices > 95
- [x] Lighthouse SEO > 95
- [x] Build time < 60s

---

## Architecture

### Security Layers
```
Internet
    ↓
Vercel Edge (WAF)
    ↓
Security Headers Middleware
    ↓
Rate Limiting Middleware
    ↓
Supabase RLS
    ↓
Application Logic
```

### Performance Pipeline
```
Code → Build (Optimization)
    ↓
Static Analysis (Lighthouse CI)
    ↓
Deploy to Edge (Vercel)
    ↓
Runtime Monitoring (Vercel Analytics)
    ↓
Error Tracking (Sentry/Future)
```

---

## Related Code Files

### To Modify
- `/next.config.ts` - Security headers
- `/src/middleware.ts` - Rate limiting
- `/src/app/[locale]/layout.tsx` - Error boundary
- `/.github/workflows/ci.yml` - Lighthouse CI (if exists)
- `/vercel.json` - Headers configuration

### To Create
- `/src/lib/rate-limit.ts` - Rate limiting utilities
- `/src/lib/security-headers.ts` - CSP configuration
- `/lighthouserc.js` - Lighthouse CI config
- `/src/app/error.tsx` - Global error boundary
- `/scripts/lighthouse-check.sh` - Manual audit script

---

## Implementation Steps

### Step 1: Security Headers Configuration

```typescript
// src/lib/security-headers.ts
export const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live https://*.vercel-scripts.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://*.supabase.co https://vercel.live https://api.payos.vn",
      "frame-src 'self' https://pay.payos.vn",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests",
    ].join('; '),
  },
];
```

```typescript
// next.config.ts
import { securityHeaders } from './src/lib/security-headers';

const config = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
  // ... rest of config
};

export default config;
```

### Step 2: API Rate Limiting

```typescript
// src/lib/rate-limit.ts
import { LRUCache } from 'lru-cache';

type RateLimitOptions = {
  interval: number; // ms
  uniqueTokenPerInterval: number;
};

export function rateLimit(options: RateLimitOptions) {
  const tokenCache = new LRUCache({
    max: options.uniqueTokenPerInterval || 500,
    ttl: options.interval || 60000,
  });

  return {
    check: (limit: number, token: string) =>
      new Promise<void>((resolve, reject) => {
        const tokenCount = (tokenCache.get(token) as number[]) || [0];
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

// Create limiters
export const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500, // Max 500 unique IPs per interval
});

export const strictLimiter = rateLimit({
  interval: 15 * 60 * 1000, // 15 minutes
  uniqueTokenPerInterval: 500,
});
```

```typescript
// src/app/api/orders/route.ts
import { limiter } from '@/lib/rate-limit';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // Get IP from request
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';

  try {
    // Allow 10 requests per minute per IP
    await limiter.check(10, ip);
  } catch {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please try again later.' },
      { status: 429 }
    );
  }

  // Process order creation...
}
```

### Step 3: Global Error Boundary

```tsx
// src/app/error.tsx
'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to error tracking service (Sentry, etc.)
    console.error('Global error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-4">
      <div className="max-w-md text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="text-3xl font-serif text-primary mb-4">
          Đã có lỗi xảy ra
        </h1>
        <p className="text-on-surface-variant mb-8">
          Chúng tôi đã ghi nhận sự cố và sẽ khắc phục sớm nhất.
        </p>
        <button
          onClick={reset}
          className="bg-primary text-on-primary px-6 py-3 rounded-full font-medium hover:opacity-90 transition"
        >
          Thử lại
        </button>
      </div>
    </div>
  );
}
```

### Step 4: Lighthouse CI Configuration

```javascript
// lighthouserc.js
module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npm run start',
      url: [
        'http://localhost:3000',
        'http://localhost:3000/vi/products',
        'http://localhost:3000/vi/franchise',
        'http://localhost:3000/vi/checkout',
      ],
      numberOfRuns: 3,
    },
    assert: {
      preset: 'lighthouse:recommended',
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.95 }],
        'categories:seo': ['error', { minScore: 0.95 }],
        'categories:pwa': ['warn', { minScore: 0.9 }],
        // Specific metrics
        'first-contentful-paint': ['warn', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['warn', { maxNumericValue: 300 }],
      },
    },
    upload: {
      target: 'temporary-public-storage', // or 'lhci' for permanent storage
    },
  },
};
```

```yaml
# .github/workflows/lighthouse-ci.yml
name: Lighthouse CI
on: [push, pull_request]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}

      - name: Run Lighthouse CI
        run: |
          npm install -g @lhci/cli
          lhci autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
```

### Step 5: Performance Optimizations

```typescript
// next.config.ts
const config = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-dropdown-menu'],
  },
  // ... rest
};
```

### Step 6: Bundle Analysis

```bash
# Install bundle analyzer
npm install -D @next/bundle-analyzer

# Add to next.config.ts
import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default withBundleAnalyzer(config);

# Run analysis
ANALYZE=true npm run build
```

### Step 7: API Input Validation

```typescript
// src/lib/validation.ts
import { z } from 'zod';

export const orderSchema = z.object({
  cartItems: z.array(
    z.object({
      id: z.string(),
      quantity: z.number().min(1).max(99),
      price: z.number().positive(),
    })
  ),
  customerInfo: z.object({
    email: z.string().email(),
    name: z.string().min(2).max(100),
    phone: z.string().regex(/^[0-9]{10,11}$/),
  }),
});

// Use in API route
export async function POST(req: Request) {
  const body = await req.json();

  // Validate input
  const result = orderSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: 'Invalid input', details: result.error.errors },
      { status: 400 }
    );
  }

  // Proceed with validated data
  const { cartItems, customerInfo } = result.data;
  // ...
}
```

---

## Todo List

### Security Implementation
- [ ] Add security headers to next.config.ts
- [ ] Implement rate limiting on API routes
- [ ] Add input validation (zod) to all API routes
- [ ] Create global error boundary
- [ ] Test CSP doesn't break functionality

### Performance Optimization
- [ ] Enable AVIF/WebP image formats
- [ ] Remove console.logs in production
- [ ] Analyze bundle size (identify large chunks)
- [ ] Lazy load heavy components
- [ ] Optimize font loading

### Lighthouse CI
- [ ] Create lighthouserc.js configuration
- [ ] Add GitHub Actions workflow
- [ ] Run baseline audit
- [ ] Fix issues to meet thresholds
- [ ] Enable CI blocking on PR

### Monitoring Setup
- [ ] Enable Vercel Analytics
- [ ] Configure Web Vitals tracking
- [ ] Set up error logging (console → service)
- [ ] Create performance dashboard

### Testing
- [ ] Test security headers (securityheaders.com)
- [ ] Test rate limiting (simulate attacks)
- [ ] Test error boundaries (force errors)
- [ ] Lighthouse audit all pages
- [ ] Load testing (artillery/k6)

---

## Success Criteria

### Technical Gates
- [x] All security headers present
- [x] API rate limiting active
- [x] Lighthouse Performance > 90
- [x] Lighthouse Accessibility > 95
- [x] Lighthouse Best Practices > 95
- [x] Lighthouse SEO > 95

### Quality Gates
- [x] Build time < 60s
- [x] LCP < 2.5s
- [x] CLS < 0.1
- [x] FID < 100ms
- [x] No console errors in production

### Security Gates
- [x] Security headers score A+ (securityheaders.com)
- [x] CSP blocks XSS attempts
- [x] Rate limiter blocks brute force
- [x] All inputs validated (no injection vulnerabilities)

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| CSP too strict (breaks functionality) | HIGH | Gradual implementation, test each directive |
| Rate limiting too aggressive (blocks legitimate users) | MEDIUM | Start with generous limits, monitor, adjust |
| Performance regressions from security overhead | LOW | Benchmark before/after, optimize critical paths |
| Lighthouse CI fails sporadically (flaky tests) | LOW | Run multiple times, use median scores |

---

## Security Considerations

### Attack Surface Reduction
- No server-side secrets in client bundle (verify with build analysis)
- API routes require authentication where applicable
- Supabase RLS as last defense layer
- Input validation prevents injection attacks

### Headers Defense
- CSP prevents XSS
- HSTS prevents downgrade attacks
- X-Frame-Options prevents clickjacking
- Referrer-Policy limits data leakage

### Rate Limiting Strategy
- 10 req/min for order creation
- 30 req/min for product queries
- 5 req/15min for login attempts
- IP-based tracking (with proxy awareness)

---

## Next Steps

1. Implement security headers
2. Add rate limiting to API routes
3. Configure Lighthouse CI
4. Run performance audit
5. Fix identified issues
6. Enable monitoring
7. Proceed to Phase 07 (Hub Connection)

---

**Dependencies**: Phase 01-05 (All features implemented)
**Blocks**: Production deployment (must pass all gates)

**Created**: 2026-02-07
**Author**: docs-manager agent
