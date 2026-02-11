# Core Web Vitals Investigation Report

**Date:** 2026-02-12
**Project:** 84tea

## Executive Summary
An investigation into code patterns affecting Core Web Vitals (LCP, CLS, FID) was conducted. The codebase generally adheres to Next.js best practices for performance optimization.

## Detailed Findings

### 1. Font Loading Strategy
**Status:** ✅ Optimized
- **Implementation:** `src/lib/fonts.ts` uses `next/font/google`.
- **Fonts:** `Inter` (Body) and `Playfair_Display` (Display).
- **Strategy:** `display: 'swap'` is explicitly configured for both fonts, preventing "Flash of Invisible Text" (FOIT) and reducing First Contentful Paint (FCP) delays.

### 2. Image Optimization (LCP & CLS)
**Status:** ✅ Optimized
- **Implementation:** Usage of `next/image` is consistent across key components.
- **Hero Section:** `HeroSection` uses `priority` prop, ensuring the LCP element loads immediately.
- **Dimensions:** Components use `fill` with parent containers having explicit aspect ratios (e.g., `aspect-square`, `aspect-[4/5]`) or explicit dimensions. This effectively mitigates Cumulative Layout Shift (CLS).
- **Responsive Sizing:** `sizes` prop is used correctly to serve appropriate image sizes based on viewport width.
- **No Raw `<img>` Tags:** A codebase scan confirmed zero usage of unoptimized `<img />` tags.

### 3. Blocking Scripts (FID/INP)
**Status:** ✅ Optimized
- **Layout Analysis:** `src/app/[locale]/layout.tsx` was inspected.
- **Scripts:** Only inline JSON-LD scripts (Organization, Website) are present in the `<head>`. These do not block rendering in the same way synchronous third-party scripts do.
- **Third-party Scripts:** No synchronous external scripts were found in the critical rendering path.

## Recommendations
- **Maintain Current Standards:** Continue using `next/image` and `next/font` for all future development.
- **Monitoring:** Periodic Lighthouse checks or Vercel Analytics should be enabled to monitor real-world performance (RUM).

