# Tech Stack Research Report: PayOS, PWA, Localization

**Date:** 2026-02-06
**Status:** Complete
**Context:** Next.js 16 App Router Project (84tea)

## 1. PayOS Integration (VietQR)

**Library:** `@payos/node`
**Purpose:** Generate VietQR for checkout flows.

### Installation
```bash
npm install @payos/node
```

### Implementation Strategy (App Router)

**1. Initialization (`lib/payos.ts`)**
```typescript
import PayOS from "@payos/node";

const payOS = new PayOS(
  process.env.PAYOS_CLIENT_ID!,
  process.env.PAYOS_API_KEY!,
  process.env.PAYOS_CHECKSUM_KEY!
);

export default payOS;
```

**2. Create Payment Link (Server Action / API Route)**
```typescript
import payOS from "@/lib/payos";

export async function createPayment(orderId: number, amount: number) {
  const body = {
    orderCode: orderId,
    amount: amount,
    description: `Thanh toan don hang ${orderId}`,
    cancelUrl: `${process.env.NEXT_PUBLIC_DOMAIN}/checkout/cancel`,
    returnUrl: `${process.env.NEXT_PUBLIC_DOMAIN}/checkout/success`,
    items: [
        // Optional: detailed items
    ]
  };

  try {
    const paymentLinkRes = await payOS.createPaymentLink(body);
    return paymentLinkRes.checkoutUrl; // Redirect user here
  } catch (error) {
    console.error(error);
    return null;
  }
}
```

**3. Webhook Handling (Important for status update)**
- Use `payOS.verifyPaymentWebhookData(webhookBody)` to verify signature.
- Update order status based on webhook data.

---

## 2. Next.js 16 PWA

**Library:** `@ducanh2912/next-pwa`
**Status:** Recommended over `next-pwa` (unmaintained) for App Router support.

### Installation
```bash
npm install @ducanh2912/next-pwa
```

### Configuration (`next.config.mjs`)
```javascript
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swcMinify: true,
  disable: process.env.NODE_ENV === "development",
  workboxOptions: {
    disableDevLogs: true,
  },
});

export default withPWA({
  // Your Next.js config
});
```

### Manifest
Create `manifest.json` or use `app/manifest.ts` (Next.js Metadata API) for dynamic generation.

---

## 3. Localization (i18n)

**Library:** `next-intl`
**Status:** Best-in-class for App Router & Server Components.

### Installation
```bash
npm install next-intl
```

### Configuration Steps

**1. Structure**
```
messages/
  en.json
  vi.json
src/
  i18n/
    request.ts  # Request config
  middleware.ts # Matcher config
  app/
    [locale]/
      layout.tsx
      page.tsx
```

**2. `src/i18n/request.ts`**
```typescript
import {getRequestConfig} from 'next-intl/server';

export default getRequestConfig(async ({requestLocale}) => {
  let locale = await requestLocale;

  // Validate locale
  if (!locale || !['en', 'vi'].includes(locale)) {
    locale = 'vi';
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});
```

**3. `src/middleware.ts`**
```typescript
import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'vi'],
  defaultLocale: 'vi'
});

export const config = {
  matcher: ['/', '/(vi|en)/:path*']
};
```

**4. Usage in Components**
```typescript
import {useTranslations} from 'next-intl'; // Client Component
import {getTranslations} from 'next-intl/server'; // Server Component

// Server Component Example
export default async function Page() {
  const t = await getTranslations('HomePage');
  return <h1>{t('title')}</h1>;
}
```

## Unresolved Questions
- **PayOS**: Does 84tea require split payments or recurring billing? (Assume standard checkout for now).
- **PWA**: Are there specific offline requirements (e.g., offline catalog)?
