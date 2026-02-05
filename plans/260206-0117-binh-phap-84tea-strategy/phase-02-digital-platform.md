# Phase 02: Digital Platform (Tech)

**Status:** In Progress
**Priority:** High
**Duration:** 10 Weeks

## Context
We need a "Digital First" approach. A PWA for customers (Ordering, Loyalty) and a Headless FMS for franchisees (Inventory, Reporting). The architecture must be multi-tenant and compliant with regional data laws (PDPA).

## Key Insights (from Research)
- **Next.js PWA** lowers CAC and bypasses 30% App Store tax for subscriptions.
- **Headless FMS** allows integration with diverse local POS systems (Wongnai in TH, Qashier in SG).
- **Data Residency** is critical. AWS Singapore is the primary hub.

## Architecture
- **Frontend:** Next.js 14 (App Router), Tailwind CSS, Material Design 3.
- **Backend:** NestJS (Microservices), GraphQL/REST.
- **Database:** PostgreSQL (Core Data), Redis (Cache/Session).
- **Infra:** AWS (ECS/Lambda), Vercel (Frontend), Cloudflare (Edge/Security).

## Implementation Steps

### 1. Customer App (PWA)
- [x] **Project Setup:**
    - [x] Initialize Next.js repo with TypeScript, Tailwind, ESLint.
    - [x] Implement MD3 Theme Provider.
- [ ] **Core Features:**
    - [ ] Menu Browser (CMS driven).
    - [ ] Mobile Ordering (Pickup/Delivery).
    - [ ] **84tea Club:** Subscription management logic.
    - [ ] **Loyalty:** Points engine, Tier status.
- [ ] **Authentication:**
    - [ ] Phone number login (OTP) via Firebase or Twilio.
    - [ ] Social Login (Google, Apple, Line for Thailand).

### 2. Franchise Management System (FMS) - MVP
- [ ] **Franchise Portal:**
    - [x] Web dashboard for Franchisees to view daily sales. (Frontend MVP Done)
    - [ ] Inventory Ordering System (Request stock from HQ).
- [ ] **Headless Middleware:**
    - Build API connectors for **Qashier** (SG) and **Wongnai** (TH).
    - Data ingestion pipeline (Webhooks -> DB).

### 3. Infrastructure & Security
- [ ] **Cloud Setup:**
    - Provision AWS VPC in `ap-southeast-1` (Singapore).
    - Setup CI/CD pipelines (GitHub Actions).
- [ ] **Compliance:**
    - Implement "Consent Manager" for PDPA/GDPR.
    - Encryption at rest and in transit.

## Success Criteria
- [ ] PWA scores 100 on Lighthouse (Performance/Accessibility).
- [ ] "84tea Club" subscription flow works E2E (Payment -> Active Status).
- [ ] Franchise Portal can trigger a mock stock order.
- [ ] Middleware successfully parses webhook data from a test POS.

## Risk Assessment
- **Risk:** POS API limitations (Wongnai/Qashier).
    - *Mitigation:* Technical feasibility study on POS APIs in Week 1.
- **Risk:** Payment Gateway rejection for subscriptions.
    - *Mitigation:* Use Stripe or 2C2P (strong in SEA) with proper business registration.
