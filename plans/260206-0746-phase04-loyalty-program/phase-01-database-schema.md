---
title: Phase 01 - Database Schema
status: completed
completed: 2026-02-06
---

# Phase 01: Database Schema

## Context
We need to store loyalty program data. To adhere to **YAGNI** and **KISS**, we will extend the existing `profiles` table for current state (balance, tier) and create a separate `loyalty_transactions` table for history.

## Architecture

### 1. Table Extensions: `profiles`
We will add the following columns to the `public.profiles` table:

| Column | Type | Default | Description |
|--------|------|---------|-------------|
| `loyalty_points` | `integer` | `0` | Current available points balance |
| `loyalty_tier` | `text` | `'bronze'` | Current tier (bronze, silver, gold, diamond) |
| `lifetime_points` | `integer` | `0` | Total points earned (for tier calculation) |

### 2. New Table: `loyalty_transactions`
Tracks how points were earned or spent.

| Column | Type | Description |
|--------|------|-------------|
| `id` | `uuid` | Primary Key |
| `user_id` | `uuid` | FK to `auth.users` / `profiles.id` |
| `amount` | `integer` | Positive for earning, negative for spending |
| `type` | `text` | e.g., 'purchase', 'bonus', 'redemption', 'expiry' |
| `description` | `text` | Readable description (e.g., "Order #1234") |
| `created_at` | `timestamptz` | Transaction timestamp |

## SQL Migration

```sql
-- Add loyalty columns to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS loyalty_points integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS loyalty_tier text DEFAULT 'bronze',
ADD COLUMN IF NOT EXISTS lifetime_points integer DEFAULT 0;

-- Create loyalty transactions table
CREATE TABLE IF NOT EXISTS public.loyalty_transactions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    amount integer NOT NULL,
    type text NOT NULL,
    description text,
    created_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.loyalty_transactions ENABLE ROW LEVEL SECURITY;

-- Policies for loyalty_transactions
CREATE POLICY "Users can view own transactions"
ON public.loyalty_transactions FOR SELECT
USING (auth.uid() = user_id);

-- Only service role can insert/update transactions (for now)
-- In a real app, we might have triggers or specific functions
```

## Typescript Interfaces

Update `types/database.types.ts` (or let Supabase generator handle it, but we need to be aware of the shape).

```typescript
export interface LoyaltyTransaction {
  id: string;
  user_id: string;
  amount: number;
  type: 'purchase' | 'bonus' | 'redemption' | 'expiry';
  description: string | null;
  created_at: string;
}

// Profile type update in auth-context will happen automatically if we use the Database generated types,
// but we might need to manually extend if using a local interface.
```

## Todo List
- [x] Run SQL migration in Supabase Dashboard or via CLI
- [x] Verify `profiles` table structure
- [x] Insert sample data for testing (optional)
