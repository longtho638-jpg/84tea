---
title: "Phase 4: Testing & Verification"
description: "Final validation before release."
status: pending
priority: P1
---

# Phase 4: Testing & Verification

## 1. Scope
- Functional testing of core flows (Payment, Navigation).
- UI/UX verification (Responsive, Theme, Localization).
- Performance check (Lighthouse).

## 2. Test Cases

### 2.1. Payment Flow (Critical)
1. Add product to cart.
2. Proceed to checkout.
3. Select PayOS payment.
4. Verify redirect to PayOS gateway.
5. Complete payment (Test mode).
6. Verify redirect to Success page.
7. Verify Order status in system (if DB connected).

### 2.2. Localization
1. Default load -> Vietnamese.
2. Switch to English -> URL changes to `/en/...`, content updates.
3. Refresh page -> Language persists (or stays on URL).
4. Check 404 page in both languages.

### 2.3. PWA
1. Open in Chrome (Desktop/Mobile).
2. Check "Install App" icon availability.
3. Install and open.
4. Verify Splash screen (background color).
5. Verify Offline mode (basic pages cached).

### 2.4. Performance
1. Run Lighthouse Audit.
2. Target:
   - Performance > 90
   - Accessibility > 95
   - Best Practices > 95
   - SEO > 95
   - PWA: Pass

## 3. Todo List
- [ ] Perform Payment Flow test.
- [ ] Perform Localization test.
- [ ] Perform PWA install test.
- [ ] Run Lighthouse audit and fix critical issues.
- [ ] Check console for errors/warnings.
- [ ] Verify `npm run build` produces a clean build.

## 4. Deliverables
- Test Report (Summary).
- Green Go-Live ready codebase.
