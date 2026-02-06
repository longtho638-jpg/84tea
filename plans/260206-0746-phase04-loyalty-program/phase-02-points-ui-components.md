---
title: Phase 02 - Points UI Components
status: completed
completed: 2026-02-06
---

# Phase 02: Points UI Components

## Context
We need visual components to display loyalty information in the 84tea Club dashboard. These components must follow the Material Design 3 (MD3) guidelines specified in `CLAUDE.md`.

## Component Architecture

We will create a new directory: `src/components/loyalty/`

### 1. `TierBadge`
A visual indicator of the user's current level.

- **Props:** `tier: 'bronze' | 'silver' | 'gold' | 'diamond'`
- **Design:**
  - Pill shape or Badge style
  - Colors:
    - Bronze: Brown/Orange tones
    - Silver: Gray tones
    - Gold: Gold/Yellow tones (`#c5a962`)
    - Diamond: Blue/Ice tones
- **Location:** `src/components/loyalty/tier-badge.tsx`

### 2. `PointsCard`
The main summary card showing balance and progress.

- **Props:** `points: number`, `tier: string`, `nextTierPoints: number`
- **Design:**
  - `Card` component (Elevated or Filled)
  - Big typography for Points count (`display-medium`)
  - Progress bar showing progress to next tier
  - "Redeem" button (Tonal Button) placeholder
- **Location:** `src/components/loyalty/points-card.tsx`

### 3. `PointsHistoryList`
A list of recent transactions.

- **Props:** `transactions: LoyaltyTransaction[]`
- **Design:**
  - Simple list or table
  - Icon for transaction type (Purchase vs Redemption)
  - Positive amounts in Green, negative in Red
- **Location:** `src/components/loyalty/points-history-list.tsx`

## Implementation Details

### Tier Logic Helper
We need a utility to calculate tier progress.
`src/lib/loyalty-utils.ts`

```typescript
export const TIERS = {
  BRONZE: { name: 'Bronze', min: 0, color: 'bg-orange-700' },
  SILVER: { name: 'Silver', min: 1000, color: 'bg-slate-400' },
  GOLD: { name: 'Gold', min: 5000, color: 'bg-yellow-500' },
  DIAMOND: { name: 'Diamond', min: 15000, color: 'bg-cyan-500' }
};

export function getNextTier(currentPoints: number) {
  // Logic to find next tier and points needed
}
```

## Requirements
- Use `tailwind-merge` for class handling
- Use `material-symbols-rounded` for icons
- Responsive: Full width on mobile, compact on desktop cards

## Todo List
- [x] Create `src/lib/loyalty-tier-utilities.ts`
- [x] Create `src/components/loyalty/loyalty-tier-badge.tsx`
- [x] Create `src/components/loyalty/loyalty-points-card.tsx`
- [x] Create `src/components/loyalty/loyalty-points-history-list.tsx`
