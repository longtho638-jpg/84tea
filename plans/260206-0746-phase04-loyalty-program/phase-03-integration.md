---
title: Phase 03 - Integration
status: completed
completed: 2026-02-06
---

# Phase 03: Integration

## Context
Now that we have the database schema and UI components, we need to integrate them into the application flow.

## 1. Auth Context Update
We need to ensure the `profile` object in `AuthContext` includes the new loyalty fields.

- **File:** `src/lib/auth-context.tsx`
- **Action:**
  - The `Profile` type definition should be updated (automatically via `Database` type if updated, or manually).
  - Ensure `fetchProfile` selects the new columns (currently selects `*`, so it should be automatic).

## 2. Loyalty Data Fetching
We need a hook or function to fetch the transaction history, as it's a separate table.

- **File:** `src/lib/hooks/use-loyalty.ts` (New)
- **Content:**
  - `useLoyaltyHistory(userId)`: Fetches from `loyalty_transactions` table.

## 3. Club Page Dashboard
We will modify the `/club` page to show the dashboard view when the user is logged in.

- **File:** `src/app/club/page.tsx`
- **Logic:**
  - Check `user` from `useAuth()`.
  - If logged in: Show `LoyaltyDashboard` (new component wrapper).
  - If logged out: Show existing landing page (Hero, Benefits, Tiers).

### `LoyaltyDashboard` Component
A wrapper to layout the Points Card and History.
- **Location:** `src/app/club/loyalty-dashboard.tsx`
- **Structure:**
  - Welcome message: "Xin chào, [Name]"
  - Layout: Grid
    - Left/Top: `PointsCard`
    - Right/Bottom: `PointsHistoryList`

## 4. Header Profile Dropdown (Optional/Bonus)
If time permits, show "X Points" in the user dropdown menu in the header.

## Todo List
- [x] Create `src/lib/hooks/use-loyalty-transaction-history.ts`
- [x] Create `src/app/club/loyalty-dashboard-view.tsx`
- [x] Update `src/app/club/page.tsx` to conditionally render Dashboard
- [x] Test with a real user account
