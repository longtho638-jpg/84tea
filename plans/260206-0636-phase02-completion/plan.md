---
title: "84tea Phase 02 Completion"
description: "Complete remaining Phase 02 tasks: PWA icons, RLS policies, Auth UI"
status: pending
priority: P1
effort: 8h
branch: main
tags: [phase-02, pwa, security, auth]
created: 2026-02-06
---

# 84tea Phase 02 Completion Plan

## Context
This plan covers the remaining tasks to complete Phase 02 of the 84tea digital platform implementation. The focus is on polishing the PWA experience, securing the database with RLS policies, and enhancing the authentication UI.

## Goal
Achieve 100% completion of Phase 02 to prepare for Phase 03 (Testing & Deployment).

## Phases

### Phase 1: PWA Icon Generation
**Status:** Pending
**Priority:** Medium
- Generate complete icon set for PWA (any & maskable)
- Automate generation using `sharp` script
- Validate with Maskable.app standards
- Update `manifest.json` references if needed

### Phase 2: Supabase RLS Policies
**Status:** Pending
**Priority:** High
- Implement Security Policies for `products`, `orders`, and `profiles`
- Ensure public read access for products but admin-only write
- Secure user data (orders, profiles) to owner-only access
- Create and verify SQL migration files

### Phase 3: Auth UI Polish
**Status:** Pending
**Priority:** Medium
- Enhance `AuthModal` UX with better loading states and error handling
- Implement registration flow with profile creation
- Add email verification UI feedback
- Optimize mobile responsiveness for auth screens

## Dependencies
- `sharp` library for image processing
- Supabase project access for applying RLS
- Existing Auth Context (`src/lib/auth-context.tsx`)

## Success Criteria
- [ ] PWA passes Lighthouse "Installable" check with perfect icon set
- [ ] Database is secure; users cannot access others' data
- [ ] Auth flow is smooth, responsive, and handles errors gracefully
- [ ] All new code follows project standards (TypeScript, MD3, 200-line limit)
