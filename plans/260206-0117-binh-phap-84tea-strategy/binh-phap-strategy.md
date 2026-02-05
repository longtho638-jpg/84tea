---
title: "Binh Phap 84tea Strategy: The Ancient Tea Route"
description: "Comprehensive strategic plan for 84tea SEA expansion using Binh Phap methodology"
status: pending
priority: P1
effort: 9 months
branch: master
tags: [strategy, franchise, tech, expansion]
created: 2026-02-06
---

# Binh Phap 84tea Strategy: The Ancient Tea Route

> **Strategy:** "Luxury Wellness" positioning via Tech-enabled Franchise & Ancient Tea Heritage.
> **Objective:** Establish SG HQ, VN Supply Chain, and penetrate TH/MY markets.

## 1. 始計 (Initial Calculations) - Current State Analysis

**Inventory & Status**
| Component | Status | Notes |
| :--- | :--- | :--- |
| **Frontend (MD3)** | ✅ DONE | Landing, Products, Cart, Checkout, Franchise UI complete. |
| **Backend/API** | ❌ PENDING | Currently using mock data. Needs Supabase integration. |
| **Database** | ❌ PENDING | Schema designed but not migrated. |
| **Compliance** | ⚠️ RISK | Halal/SFA certifications not yet started. |

**Technical Debt Assessment**
- **Data:** 100% Mock data usage. No real persistence.
- **Auth:** Hardcoded/Mock auth. No secure session management.
- **Testing:** Zero coverage. Critical risk for financial transactions.

**Data Model Analysis**
- **Core Entities:** `Product`, `Variant` (Sugar/Ice), `Cart`, `Order`, `FranchiseLead`.
- **Missing:** `Inventory` (Multi-warehouse), `RoyaltyLog`, `LoyaltyProfile`.

## 2. 作戰 (Waging War) - Business Strategy

**Market Positioning**
- **Identity:** "Luxury Wellness" & "Ancient Heritage" (100yr+ trees).
- **Differentiation:** Anti-commodity. Not "Bubble Tea" but "Energy from Ancient Forest".
- **Pricing:** Premium ($5.50 - $8.00 USD). Comparable to Starbucks, higher than Gong Cha.

**Target Markets & Expansion**
1.  **Singapore (HQ):** Branding hub. Premium gifting & corporate focus.
2.  **Vietnam (Supply):** "The Farm". Central Kitchen & Export Hub.
3.  **Thailand (Lifestyle):** "Instagrammable" cafe experience. Mall presence.
4.  **Malaysia (Volume):** Halal-mandatory. Mass market franchise.

**Revenue Model**
- **Franchise Fee:** $30k - $50k (Country dependent).
- **Royalties:** 4-5% of Gross Sales.
- **Supply Chain:** 20-30% margin on proprietary tea base & syrups.

**Competitive Analysis**
- **Phúc Long:** Strong heritage but mass-market execution.
- **Gong Cha/The Alley:** Industrial consistency, low "soul".
- **84tea Advantage:** Origin story transparency + Health/Wellness angle.

## 3. 謀攻 (Attack by Stratagem) - Technical Roadmap

**Timeline (9 Months)**
- **Phase 1 (M1-2):** Compliance & Foundation (Halal, Trademark, SFA).
- **Phase 2 (M3-4):** Digital Core (PWA, Supabase, Auth).
- **Phase 3 (M5-6):** Ops Integration (POS Middleware, Inventory).
- **Phase 4 (M7-9):** Market Entry (SG Pilot, Marketing).

**Architecture Decisions**
- **Core:** Next.js PWA (Consumer) + NestJS (FMS API).
- **PWA First:** Bypass App Store 30% tax. Instant QR access.
- **Headless FMS:** API-first to plug into local accounting/POS.

**Integration Strategy**
- **Database:** Supabase (PostgreSQL) for transactional data.
- **POS Middleware:**
    -   **Thailand:** Wongnai POS (LINE MAN integration).
    -   **Singapore:** Qashier (PayNow integration).
-   **Payments:** Stripe (International) + Local QRs (VietQR, PayNow, PromptPay).

**Security & Compliance**
- **Data:** PDPA (SG) & Cybersecurity Law (VN). Data residency options.
- **Product:** Halal (JAKIM/MUI recognized). SFA Pesticide limit adherence.

## 4. 軍形 (Military Disposition) - Marketing & Operations

**Brand Positioning**
- **Narrative:** "The Ancient Tea Route". Story of the H'mong/Dao farmers.
- **Visuals:** Material Design 3 (Imperial Green + Gold Leaf). Minimalist Luxury.

**Channel Strategy**
- **Digital:** PWA > Native App. "First Cup Free" via QR scan.
- **Physical:**
    -   **Kiosk (10-15m²):** High traffic, takeaway.
    -   **Express (25-40m²):** Street-front.
    -   **Lounge (80m²+):** Full experience (Flagship only).

**Supply Chain Logistics**
- **Exports (VN -> SEA):** Dry Tea, Freeze-dried Powders, Proprietary Syrups. (ATIGA 0% Tax).
- **Local Sourcing:** Fresh Milk, Fruits, Sugar, Ice.
- **Critical Path:** SFA testing for pesticide residue (3-4 week lead time).

**Customer Acquisition**
- **84tea Club:** Subscription ($X/month for daily tea). High retention.
- **Referral:** "Gift a Tea" features in PWA.

## 5. 兵勢 (Energy) - Weekly Action Items

| Priority | Weeks | Action Items |
| :--- | :--- | :--- |
| **HIGH** | 1-2 | 1. Initiate Halal Cert (HCA Vietnam).<br>2. Submit tea samples for SFA pesticide testing.<br>3. File Trademarks (SG, TH, MY). |
| **MED** | 3-4 | 1. Build FMS Backend (Supabase/NestJS).<br>2. Develop POS Middleware for Wongnai/Qashier.<br>3. Implement PWA Auth & Payments. |
| **LOW** | 5-8 | 1. Launch Content Marketing (Origin Stories).<br>2. Recruit Master Franchise leads.<br>3. Finalize "84tea Club" logic. |

## 6. 虛實 (Weaknesses & Strengths) - Metrics & KPIs

**Business Metrics**
| Metric | Target |
| :--- | :--- |
| **GMV (Monthly/Store)** | $25k - $35k (Standard) |
| **AOV (Ticket Size)** | $5.50 - $8.00 |
| **CAC** | < $5.00 |
| **LTV** | > $150 (30 visits) |

**Operational Metrics**
| Metric | Target |
| :--- | :--- |
| **Gross Margin** | > 70% |
| **Logistics Cost** | < 15% of COGS |
| **Inventory Turnover** | < 30 Days |
| **Breakeven** | 18 - 24 Months |

**Technical Metrics**
| Metric | Target |
| :--- | :--- |
| **PWA Performance** | Lighthouse > 95 |
| **Load Time** | < 3s (4G SEA) |
| **Uptime** | 99.9% |

**Unresolved Questions**
- [ ] Specific Halal reciprocity agreement status between VN HCA and MY JAKIM for 2026?
- [ ] Exact logistics cost per kg for cold-chain vs dry to Thailand via land border?
- [ ] Partner vetting criteria for Master Franchisee in Thailand?
