# 84tea Operational & Logistics Research Report

**Date:** 2026-02-06
**Focus:** Halal Compliance, Supply Chain Logistics, POS Integration, Export Regulations

## 1. Halal Strategy for Muslim-Majority Markets (Malaysia/Indonesia)
To penetrate Malaysia (60% Muslim) and Indonesia (87%), Halal certification is **non-negotiable**, not just an "add-on".

*   **Certification Pathway:**
    *   **Vietnam:** Certification via **HCA** (Halal Certification Agency) or **HVCN** (Halal Vietnam), which must be recognized by **JAKIM** (Malaysia) and **MUI** (Indonesia). *Crucial: Not all Vietnam certifiers are recognized reciprocally.*
    *   **Scope:** Certification covers ingredients (tea leaves, syrups, toppings) AND the central kitchen/processing facility.
    *   **Store-Level:** Franchise outlets in Malaysia often require their own Halal application even if ingredients are certified, to ensure no cross-contamination.
*   **Strategic Implication:** Start process 6-9 months before launch.
*   **Cost:** ~$2,000 - $5,000 initially per facility + annual renewal.

## 2. Cross-Border Supply Chain Strategy
Balancing "Authenticity" (Vietnam origin) with "Margin" (Logistics cost).

*   **Sourcing Split:**
    *   **Vietnam Export (Proprietary Core):** Tea leaves (Dry), proprietary syrup bases, freeze-dried fruit powders.
        *   *Logistics:* **Dry Cargo**. Low risk, long shelf life (12-24 months). Tariff advantage under ATIGA (0%).
    *   **Local Sourcing (Volume/Perishables):** Fresh Milk, Fresh Fruits, Ice, Sugar.
        *   *Rationale:* Shipping fresh milk/fruit from Vietnam is cost-prohibitive and risky (spoilage).
    *   **Toppings (Boba/Jelly):** Evaluate cost of export vs OEM in Taiwan/Thailand. Often cheaper to OEM standard toppings locally or regionally.
*   **Logistics Costs (Est.):**
    *   **Dry Container (20ft) to SG/TH:** $300 - $600 USD (Ocean Freight) + trucking. Very efficient for tea leaves.
    *   **Cold Chain (LCL):** 3-4x cost of dry. *Avoid unless absolutely necessary for proprietary frozen puree.*

## 3. Technology Infrastructure: POS Landscape
The "Unified FMS" must integrate with dominant local players.

*   **Singapore:**
    *   **Qashier:** Strong SME presence, integrated payments (PayNow).
    *   **Eats365:** Modular, iPad-based, popular in F&B chains.
*   **Thailand:**
    *   **Wongnai POS (FoodStory):** The absolute market leader due to integration with LINE MAN (Delivery). *Critical integration.*
*   **Malaysia:**
    *   **StoreHub:** Cloud-based, strong ecosystem.
*   **Integration Strategy:**
    *   Do not force a proprietary POS hardware.
    *   Build **FMS Middleware** that pulls API data from Qashier/Wongnai/StoreHub for sales reporting.

## 4. Export Regulations & Tariffs (ASEAN)
*   **ATIGA (ASEAN Trade in Goods Agreement):**
    *   **Tea (HS Code 0902):** Generally **0% Import Duty** when exporting from Vietnam to ASEAN countries, provided it meets **Certificate of Origin (Form D)** criteria (Wholly Obtained or 40% Regional Value Content).
*   **Non-Tariff Barriers:**
    *   **SFA (Singapore Food Agency):** Strict testing for pesticide residues in tea. Vietnamese tea often faces scrutiny here. *Action: Pre-test batches at Eurofins/SGS Vietnam before shipping.*
    *   **FDA Thailand:** Registration required for food products. Time-consuming (3-6 months).

## Actionable Insights
*   **Insight:** SFA (Singapore) pesticide standards are the "Gatekeeper". Passing SFA gives a "Quality Halo" for the rest of SEA.
*   **Strategy:** "Central Kitchen in Vietnam (Dry/Base) -> Regional Hub in Singapore (QC/Dist) -> Franchisees."
    *   Actually, direct shipping to Thailand is better due to land borders (trucking via Laos/Cambodia) for faster lead time.
*   **Tech:** Do not build a POS. Integrate with **Wongnai** (TH) and **Qashier** (SG).

**Sources:**
- Vietnam Halal Certification Agency (HCA)
- ATIGA Tariff Schedules
- SFA Import Requirements for Food
- Wongnai POS / Qashier Market Reports
