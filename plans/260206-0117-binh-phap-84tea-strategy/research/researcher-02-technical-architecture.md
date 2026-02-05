# 84tea Technical Architecture Research Report

**Date:** 2026-02-06
**Focus:** Franchise Management System (FMS), Loyalty Architecture, MD3 Implementation, SEA Compliance

## 1. Franchise Management System (FMS) Architecture
To support rapid expansion across SEA, the FMS must be centralized, scalable, and multi-tenant.

*   **Core Architecture:** Cloud-native Microservices (or Modular Monolith for startup phase).
    *   **Backend:** Node.js (NestJS) or Go.
    *   **Database:** PostgreSQL (Transactional) + Redis (Caching).
*   **Essential Modules:**
    *   **Inventory & Supply Chain:** Real-time tracking from Central Warehouse (Vietnam) to Country Hubs (SG/TH) to Individual Stores. Auto-replenishment triggers.
    *   **Multi-Store POS Integration:** Unified API to connect with varying local POS hardware (or proprietary iPad-based POS).
    *   **Franchise Portal:** Web dashboard for franchisees to view sales, order stock, and access training manuals (LMS).
    *   **Billing & Royalty Engine:** Automated calculation of franchise fees/royalties based on POS data.

## 2. Loyalty & Customer Experience (Digital Layer)
The "digital-first" tea experience is a key differentiator against legacy competitors.

*   **Platform Strategy:** **Next.js PWA** (Progressive Web App) first.
    *   *Why:* Lower CAC than native app install, instant access via QR code at table/counter, SEO benefits.
    *   *Future:* Wrap PWA into Native App (Capacitor/React Native) for push notifications later.
*   **Loyalty Features:**
    *   **Subscription Model (The "84tea Club"):** Monthly fee for X drinks/day. High retention lock-in.
    *   **Gamification:** "Tea Journey" (Unlock origins/stories).
    *   **Social Gifting:** "Send a cup" feature (Critical for gifting culture in Vietnam/China/Singapore).

## 3. Frontend Strategy: Material Design 3 (MD3) + Tailwind
Strict adherence to Google's Material Design 3 ensures a premium, modern, and accessible UI.

*   **Tech Stack:** Next.js 14 (App Router) + Tailwind CSS.
*   **Implementation:**
    *   **Tokens:** Map MD3 Design Tokens (Color, Typography, Elevation) to Tailwind configuration (`tailwind.config.js`).
    *   **Dynamic Color:** Implement Material You (dynamic theming) based on brand colors (Imperial Green #1B5E20).
    *   **Components:** Build a proprietary UI Kit (`@84tea/ui`) wrapping Headless UI or Radix UI with MD3 styles. Avoid heavy UI libraries like MUI if performance is key; prefer lightweight custom implementations.

## 4. Security & Data Compliance (SEA Context)
Operating in Singapore, Thailand, and Vietnam requires navigating fragmented data privacy laws.

*   **Data Sovereignty:**
    *   **Primary Region:** Singapore (AWS ap-southeast-1) is the safest hub for SEA user data.
    *   **Vietnam:** Cybersecurity Law requires local data copy/storage for Vietnamese users. Architecture must support "Data Residency" flags.
*   **Privacy Frameworks:**
    *   **PDPA (Singapore/Thailand):** Strict consent management (Cookies, Marketing). Right to be forgotten.
    *   **Compliance:** Implement a centralized Identity Server (e.g., Auth0 or custom Keycloak) to handle consent and PII access logs.

## 5. Technology Roadmap for Expansion
*   **Phase 1 (Bootstrap):** Next.js Monolith (Web + Admin + API). deploy on Vercel/AWS.
*   **Phase 2 (Regional):** Split API services. Implement Country-level data sharding.
*   **Phase 3 (Scale):** AI-driven forecasting for inventory.

## Actionable Insights & Unresolved Questions
*   **Insight:** "Headless FMS" is the winning strategy—keep the core logic API-first so it can plug into any country's specific accounting/POS software effortlessly.
*   **Insight:** Building a proprietary PWA avoids the 30% "Apple Tax" on subscriptions if done via web payment.
*   **Q1:** Which specific POS hardware is dominant in Thailand/Singapore that we must integrate with?
*   **Q2:** Does the Vietnam cybersecurity law strictly enforce physical server location, or is cloud region sufficient?

**Sources:**
- Material Design 3 Guidelines
- Next.js Architecture Best Practices
- PDPA Singapore Official Docs
- Franchise Tech Stack Industry Reviews
