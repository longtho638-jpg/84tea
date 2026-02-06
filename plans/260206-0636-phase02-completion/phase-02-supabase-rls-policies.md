# Phase 02: Supabase RLS Policies

## Context
- **Plan:** [84tea Phase 02 Completion](../plan.md)
- **Research:** [Supabase RLS](../research/researcher-02-supabase-rls.md)
- **Goal:** Secure the application data using Row Level Security (RLS) policies.

## Requirements

### Security Model
- **Public Data:** Products, Categories, Public Profiles (if enabled).
- **Private Data:** Orders, Personal Profile info.
- **Admin Data:** Product management, All Orders view.

### Policies Strategy
| Table | Operation | Role | Policy Condition |
|-------|-----------|------|------------------|
| `products` | SELECT | Public | `true` (Always allow) |
| `products` | INSERT/UPDATE/DELETE | Admin | `auth.jwt() ->> 'email'` IN (admin_list) OR custom claim |
| `orders` | SELECT | User | `auth.uid() = user_id` |
| `orders` | INSERT | User | `auth.uid() = user_id` |
| `profiles` | SELECT | Public | `true` (Or limited to username/avatar) |
| `profiles` | UPDATE | User | `auth.uid() = id` |

## Implementation Steps

### 1. Define Admin Strategy
- For MVP, use a simple email check or a `is_admin` boolean in `profiles` (protected column).
- **Decision:** Use `is_admin` boolean in `profiles` table.
- **Prerequisite:** Ensure `profiles` table has `is_admin` column and it is secure (users cannot update it).

### 2. Create SQL Migration File
- Create `supabase/migrations/20260206_rls_policies.sql`.

```sql
-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- PRODUCTS POLICIES
CREATE POLICY "Public products are viewable by everyone"
ON products FOR SELECT USING (true);

-- Assuming we use a secure way to identify admins.
-- For now, allow authenticated users to view, but only specific logic for write.
-- Let's stick to the Research Note suggestion or secure profile check.
-- Admin Policy (Draft):
CREATE POLICY "Admins can manage products"
ON products FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.is_admin = true
  )
);

-- ORDERS POLICIES
CREATE POLICY "Users can view own orders"
ON orders FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create orders"
ON orders FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- PROFILES POLICIES
CREATE POLICY "Public profiles are viewable by everyone"
ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);
-- Note: Trigger usually handles INSERT on signup
```

### 3. Verification & Testing
- [ ] Apply migration locally or to remote (via Dashboard SQL editor if CLI not linked).
- [ ] Test scenarios:
    - Unauthenticated user fetching products (Should Pass).
    - Unauthenticated user fetching orders (Should Fail/Return Empty).
    - Authenticated User A fetching User B's orders (Should Fail).
    - User updating their own profile (Should Pass).

## Success Criteria
- [ ] All tables have RLS enabled.
- [ ] Public data is accessible without login.
- [ ] Private data is strictly isolated to owners.
- [ ] Admin operations are protected.
