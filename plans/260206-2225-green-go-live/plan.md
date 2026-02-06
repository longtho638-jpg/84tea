---
title: "84tea Green Go-Live Plan"
description: "Implementation plan for PayOS payment, PWA, Localization, and MD3 UI polish."
status: pending
priority: P1
effort: 20h
branch: feat/green-go-live
tags: [payment, pwa, i18n, ui, md3]
created: 2026-02-06
---

# 84tea Green Go-Live Plan

## Overview
This plan focuses on preparing the 84tea platform for launch ("Green Go-Live") by integrating essential payment infrastructure (PayOS/VietQR), enabling PWA capabilities for mobile engagement, implementing localization (Vietnamese/English), and enforcing the Material Design 3 Imperial Green visual identity.

## Phases

### [Phase 1: Environment & Core Setup](./phase-01-core-setup.md)
**Goal:** Establish the foundation for localization and PWA support.
- Setup `next-intl` for i18n (VI default, EN support).
- Configure `@ducanh2912/next-pwa` for A2HS (Add to Home Screen).
- Refactor routing structure for `[locale]`.
- Define environment variables.

### [Phase 2: PayOS Integration](./phase-02-payos-integration.md)
**Goal:** Enable seamless payments via VietQR using PayOS.
- Install and configure `@payos/node`.
- Implement Payment Link creation API.
- Implement Webhook handler for payment success/fail.
- Integrate with Checkout UI.

### [Phase 3: UI Polish & Localization Content](./phase-03-ui-localization.md)
**Goal:** Ensure brand consistency and complete translations.
- Enforce MD3 Imperial Green theme.
- Extract hardcoded text to translation files.
- Polish UI components for mobile responsiveness.

### [Phase 4: Testing & Verification](./phase-04-testing-verification.md)
**Goal:** Validate all features before production deploy.
- Payment flow verification (Test mode).
- PWA installability test.
- Language switching verification.
- Lighthouse performance audit.
