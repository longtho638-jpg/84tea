---
title: "Phase 1: Environment & Core Setup"
description: "Setup next-intl, PWA, and refactor directory structure for localization."
status: pending
priority: P1
---

# Phase 1: Environment & Core Setup

## 1. Requirements
- **Localization:** Support Vietnamese (default) and English.
- **PWA:** Application must be installable (A2HS) on mobile devices.
- **Routing:** Move to `[locale]` based routing for `next-intl`.

## 2. Technical Stack
- `next-intl`: For internationalization.
- `@ducanh2912/next-pwa`: For Progressive Web App features.

## 3. Implementation Steps

### 3.1. Install Dependencies
```bash
npm install next-intl @ducanh2912/next-pwa
```

### 3.2. Directory Structure Refactoring
We need to move existing app pages into a `[locale]` folder.
- `src/app/page.tsx` -> `src/app/[locale]/page.tsx`
- `src/app/layout.tsx` -> `src/app/[locale]/layout.tsx`
- Maintain `src/app/api` outside of `[locale]` (APIs don't usually need locale params unless specific).
- Maintain `src/app/not-found.tsx` at root.

### 3.3. Setup `next-intl`
- Create `src/i18n/request.ts`: Configuration for request locale.
- Create `src/i18n/routing.ts`: Define locales (`['vi', 'en']`) and default locale (`vi`).
- Create `src/middleware.ts`: Update to use `createMiddleware` from `next-intl`.
- Create `messages/vi.json` and `messages/en.json` in project root.

### 3.4. Configure PWA
- Update `next.config.ts`:
  ```typescript
  import withPWA from "@ducanh2912/next-pwa";
  import createNextIntlPlugin from 'next-intl/plugin';

  const withNextIntl = createNextIntlPlugin();

  const withPWAConfig = withPWA({
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

  export default withPWAConfig(withNextIntl({
    // ... existing config
  }));
  ```
- Create `public/manifest.json`: Define name, icons, theme_color (Imperial Green #1b5e20).

### 3.5. Environment Variables
- Create/Update `.env.example`:
  ```
  NEXT_PUBLIC_APP_URL=http://localhost:3000
  PAYOS_CLIENT_ID=
  PAYOS_API_KEY=
  PAYOS_CHECKSUM_KEY=
  ```

## 4. Todo List
- [ ] Install `next-intl` and `@ducanh2912/next-pwa`.
- [ ] Create `messages/vi.json` and `messages/en.json` (initial empty or basic keys).
- [ ] Setup `src/i18n/routing.ts` and `src/i18n/request.ts`.
- [ ] Update `src/middleware.ts`.
- [ ] Move `src/app` pages to `src/app/[locale]`.
- [ ] Update `src/app/[locale]/layout.tsx` to wrap with `NextIntlClientProvider`.
- [ ] Configure `next.config.ts`.
- [ ] Create `public/manifest.json`.
- [ ] Verify build passes.

## 5. Verification
- `npm run dev` starts without errors.
- Visiting `/` redirects to `/vi`.
- Visiting `/en` shows the English version (even if content is same for now, routing works).
- PWA install icon appears in browser address bar (or Lighthouse checks pass).
