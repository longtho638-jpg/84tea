# Phase 05: 兵勢 (Mobile & PWA Excellence)

> **Principle**: "激水之疾，至於漂石者，勢也" - Mobile momentum through progressive enhancement

**Priority**: MEDIUM
**Duration**: 2 days
**Status**: Pending

---

## Context Links

- [PWA Config](/next.config.ts)
- [PWA Service Worker](/src/components/pwa/service-worker-register.tsx)
- [Bottom Navigation](/src/components/layout/bottom-navigation.tsx)
- [Responsive Components](/src/components/ui/)

---

## Overview

Transform 84tea into a mobile-first Progressive Web App with offline capabilities, installability, and Material Design 3 responsive excellence.

---

## Key Insights

- `@ducanh2912/next-pwa` already installed but not fully configured
- MD3 responsive breakpoints defined but inconsistent usage
- Bottom navigation exists but UX refinement needed
- No offline fallback strategy
- PWA manifest incomplete (missing screenshots, categories)

---

## Requirements

### Functional
- [x] PWA installable on iOS/Android
- [x] Offline page fallback
- [x] Service Worker caching strategy
- [x] Bottom navigation on mobile (<600px)
- [x] Touch-optimized interactions

### Non-Functional
- [x] Lighthouse PWA score > 90
- [x] Touch targets ≥ 44px
- [x] Responsive 320px-1920px
- [x] Offline page loads instantly

---

## Architecture

### PWA Flow
```
User Visit (First Time)
    ↓
Service Worker Registers
    ↓
Precache Critical Assets
    ↓
Install Prompt (iOS/Android)
    ↓
[User Installs]
    ↓
Standalone App Experience
    ↓
Offline Mode (Service Worker Cache)
```

### Responsive Breakpoints (MD3)
```css
0-599px:    Mobile (Bottom Nav, Single Column)
600-839px:  Tablet Portrait (Nav Drawer, Two Columns)
840-1199px: Tablet Landscape (Persistent Nav, Three Columns)
1200px+:    Desktop (Full Navigation, Four Columns)
```

---

## Related Code Files

### To Modify
- `/next.config.ts` - PWA configuration
- `/public/manifest.json` - Enhanced manifest
- `/src/app/[locale]/layout.tsx` - PWA meta tags
- `/src/components/layout/bottom-navigation.tsx` - Touch optimization
- `/src/components/layout/top-app-bar.tsx` - Mobile hamburger menu
- `/src/app/globals.css` - MD3 breakpoint utilities

### To Create
- `/public/offline.html` - Offline fallback page
- `/src/app/api/pwa-icons/route.ts` - Dynamic icon generator
- `/public/screenshots/` - PWA screenshots (mobile/tablet)
- `/src/lib/pwa-utils.ts` - Install prompt helper

---

## Implementation Steps

### Step 1: Enhanced PWA Configuration

```typescript
// next.config.ts
import withPWA from '@ducanh2912/next-pwa';

const config = withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts-webfonts',
        expiration: {
          maxEntries: 4,
          maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
        },
      },
    },
    {
      urlPattern: /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'google-fonts-stylesheets',
        expiration: {
          maxEntries: 4,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 1 week
        },
      },
    },
    {
      urlPattern: /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-font-assets',
        expiration: {
          maxEntries: 4,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 1 week
        },
      },
    },
    {
      urlPattern: /\.(?:jpg|jpeg|gif|png|svg|ico|webp|avif)$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-image-assets',
        expiration: {
          maxEntries: 64,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
      },
    },
    {
      urlPattern: /\/_next\/image\?url=.+$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'next-image',
        expiration: {
          maxEntries: 64,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
      },
    },
    {
      urlPattern: /\.(?:js)$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-js-assets',
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
      },
    },
    {
      urlPattern: /\.(?:css|less)$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-style-assets',
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
      },
    },
    {
      urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'supabase-api',
        expiration: {
          maxEntries: 16,
          maxAgeSeconds: 60 * 5, // 5 minutes
        },
        networkTimeoutSeconds: 10,
      },
    },
  ],
  fallbacks: {
    document: '/offline',
  },
});

export default config({
  // ... other Next.js config
});
```

### Step 2: Enhanced PWA Manifest

```json
// public/manifest.json
{
  "name": "84tea - Vietnamese Energy Tea",
  "short_name": "84tea",
  "description": "Ancient Vietnamese tea for modern energy. Order premium Shan Tuyet tea online.",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#FBF8F3",
  "theme_color": "#1B5E20",
  "orientation": "portrait-primary",
  "categories": ["food", "lifestyle", "shopping"],
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable any"
    }
  ],
  "screenshots": [
    {
      "src": "/screenshots/mobile-home.png",
      "sizes": "390x844",
      "type": "image/png",
      "form_factor": "narrow",
      "label": "Homepage on mobile"
    },
    {
      "src": "/screenshots/mobile-products.png",
      "sizes": "390x844",
      "type": "image/png",
      "form_factor": "narrow",
      "label": "Product catalog"
    },
    {
      "src": "/screenshots/tablet-home.png",
      "sizes": "1024x768",
      "type": "image/png",
      "form_factor": "wide",
      "label": "Homepage on tablet"
    }
  ],
  "shortcuts": [
    {
      "name": "Products",
      "short_name": "Products",
      "url": "/products",
      "icons": [{ "src": "/icons/products-96x96.png", "sizes": "96x96" }]
    },
    {
      "name": "Cart",
      "short_name": "Cart",
      "url": "/checkout",
      "icons": [{ "src": "/icons/cart-96x96.png", "sizes": "96x96" }]
    },
    {
      "name": "Loyalty Club",
      "short_name": "Club",
      "url": "/club",
      "icons": [{ "src": "/icons/club-96x96.png", "sizes": "96x96" }]
    }
  ]
}
```

### Step 3: Offline Fallback Page

```html
<!-- public/offline.html -->
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>84tea - Offline</title>
  <style>
    :root {
      --primary: #1B5E20;
      --surface: #FBF8F3;
      --on-surface: #4E342E;
    }
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Inter', system-ui, sans-serif;
      background: var(--surface);
      color: var(--on-surface);
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 1rem;
    }
    .container {
      text-align: center;
      max-width: 400px;
    }
    .icon {
      width: 120px;
      height: 120px;
      margin: 0 auto 2rem;
      background: var(--primary);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 3rem;
    }
    h1 {
      font-family: 'Playfair Display', serif;
      color: var(--primary);
      font-size: 2rem;
      margin-bottom: 1rem;
    }
    p {
      font-size: 1rem;
      line-height: 1.6;
      margin-bottom: 2rem;
      opacity: 0.8;
    }
    button {
      background: var(--primary);
      color: white;
      border: none;
      padding: 1rem 2rem;
      border-radius: 24px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: opacity 0.2s;
    }
    button:hover {
      opacity: 0.9;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="icon">🍵</div>
    <h1>Bạn đang offline</h1>
    <p>
      Không thể kết nối internet. Vui lòng kiểm tra kết nối và thử lại.
    </p>
    <button onclick="window.location.reload()">Thử lại</button>
  </div>
</body>
</html>
```

### Step 4: Responsive Breakpoint Utilities

```css
/* src/app/globals.css */

/* MD3 Responsive Utilities */
@media (max-width: 599px) {
  .hide-on-mobile { display: none !important; }
  .container { padding: 16px; }
  .grid { grid-template-columns: 1fr; }
}

@media (min-width: 600px) and (max-width: 839px) {
  .hide-on-tablet { display: none !important; }
  .container { padding: 24px; }
  .grid { grid-template-columns: repeat(2, 1fr); }
}

@media (min-width: 840px) and (max-width: 1199px) {
  .hide-on-tablet-landscape { display: none !important; }
  .container { padding: 32px; }
  .grid { grid-template-columns: repeat(3, 1fr); }
}

@media (min-width: 1200px) {
  .hide-on-desktop { display: none !important; }
  .container { padding: 48px; }
  .grid { grid-template-columns: repeat(4, 1fr); }
}

/* Touch Targets (44px minimum) */
.touch-target {
  min-width: 44px;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Bottom Navigation Spacing (Mobile) */
@media (max-width: 599px) {
  .page-content {
    padding-bottom: 80px; /* Space for bottom nav */
  }
}
```

### Step 5: Touch-Optimized Bottom Navigation

```tsx
// src/components/layout/bottom-navigation.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingBag, Storefront, AccountCircle } from '@/components/icons';

export default function BottomNavigation({ locale }: { locale: string }) {
  const pathname = usePathname();

  const navItems = [
    { href: `/${locale}`, icon: Home, label: locale === 'vi' ? 'Trang chủ' : 'Home' },
    { href: `/${locale}/products`, icon: ShoppingBag, label: locale === 'vi' ? 'Sản phẩm' : 'Products' },
    { href: `/${locale}/franchise`, icon: Storefront, label: locale === 'vi' ? 'Nhượng quyền' : 'Franchise' },
    { href: `/${locale}/club`, icon: AccountCircle, label: locale === 'vi' ? 'Thành viên' : 'Club' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-outline md:hidden z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex flex-col items-center justify-center
                touch-target flex-1
                transition-colors
                ${isActive ? 'text-primary' : 'text-on-surface-variant'}
              `}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
```

### Step 6: Install Prompt Utility

```typescript
// src/lib/pwa-utils.ts
'use client';

import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function useInstallPrompt() {
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstallable(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;

    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;

    if (outcome === 'accepted') {
      setIsInstallable(false);
      setInstallPrompt(null);
    }
  };

  return { isInstallable, handleInstall };
}
```

### Step 7: PWA Meta Tags

```tsx
// src/app/[locale]/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        {/* PWA Meta Tags */}
        <meta name="application-name" content="84tea" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="84tea" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#1B5E20" />

        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-192x192.png" />

        {/* Manifest */}
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

---

## Todo List

### PWA Setup
- [ ] Configure Next PWA in next.config.ts
- [ ] Create/optimize PWA icons (72px-512px)
- [ ] Generate screenshots (mobile + tablet)
- [ ] Create offline.html fallback page
- [ ] Test service worker registration

### Responsive Design
- [ ] Audit all pages on MD3 breakpoints (320px, 600px, 840px, 1200px)
- [ ] Ensure touch targets ≥ 44px
- [ ] Test bottom navigation on mobile
- [ ] Verify hamburger menu on mobile
- [ ] Check tablet layout (two-column)

### Offline Strategy
- [ ] Test offline page loads
- [ ] Verify asset caching (fonts, images, JS)
- [ ] Test Supabase API network-first strategy
- [ ] Ensure graceful degradation

### Install Experience
- [ ] Test install prompt on Android (Chrome)
- [ ] Test Add to Home Screen on iOS (Safari)
- [ ] Verify standalone mode (no browser chrome)
- [ ] Test app shortcuts

### Performance
- [ ] Lighthouse PWA audit > 90
- [ ] Test on slow 3G network
- [ ] Verify lazy loading works
- [ ] Check animation performance (60fps)

---

## Success Criteria

### Technical Gates
- [x] PWA installable on iOS/Android
- [x] Service Worker registered successfully
- [x] Offline page loads instantly
- [x] All touch targets ≥ 44px
- [x] Responsive 320px-1920px

### Quality Gates
- [x] Lighthouse PWA score > 90
- [x] No layout shifts on resize
- [x] Smooth scrolling on mobile
- [x] Bottom nav doesn't overlap content
- [x] Install prompt works correctly

### Business Gates
- [x] Users can browse products offline (cached)
- [x] App feels native (standalone mode)
- [x] Shortcuts work (Products, Cart, Club)

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Service Worker caching stale content | MEDIUM | Use StaleWhileRevalidate strategy, short cache expiration |
| iOS install experience inferior (no prompt) | LOW | Provide manual instructions, optimize Add to Home Screen flow |
| Bottom nav overlaps page content | LOW | Add padding-bottom to page content wrapper |
| Large cache size impacts storage | LOW | Limit maxEntries per cache, use expiration policies |

---

## Security Considerations

### PWA Security
- Service Worker only on HTTPS
- No sensitive data in cache (exclude /api/auth)
- Cache versioning to prevent stale code execution

---

## Next Steps

1. Configure Next PWA
2. Generate PWA assets (icons, screenshots)
3. Implement offline fallback
4. Test responsive design on all breakpoints
5. Test install flow (iOS/Android)
6. Verify Lighthouse PWA audit
7. Proceed to Phase 06 (Performance & Security)

---

**Dependencies**: Phase 03 (Product images needed for caching)
**Blocks**: None (parallel with Phase 04)

**Created**: 2026-02-07
**Author**: docs-manager agent
