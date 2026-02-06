-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- PRODUCTS POLICIES
-- Allow everyone to read products (Public Catalog)
CREATE POLICY "Public products are viewable by everyone"
ON products FOR SELECT USING (true);

-- Admin can manage products (Insert/Update/Delete)
-- We check if the user has an admin flag in their profile
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
-- Users can only see their own orders
CREATE POLICY "Users can view own orders"
ON orders FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can only insert their own orders
CREATE POLICY "Users can create orders"
ON orders FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- PROFILES POLICIES
-- Public profiles (optional, for now allow read if we want reviews etc later)
-- For strict privacy, we could restrict this to own profile too.
-- Let's stick to the plan: "Public profiles are viewable by everyone" (e.g. for Reviews)
CREATE POLICY "Public profiles are viewable by everyone"
ON profiles FOR SELECT USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Trigger to handle new user signup -> Create Profile is typically handled by Supabase triggers
-- We assume that exists or is handled by the application logic if not.
-- But usually better to have a trigger in SQL.

-- Let's ensure is_admin column exists on profiles if not already there
-- We can't conditionally add column easily in standard SQL without DO block or ignoring error
-- But this is a migration file, we assume it runs once.
-- Let's try to add it safely if we can, or just assume it's part of the schema definition.
-- Given previous phase context, `database.types.ts` was mentioned.
-- Let's assume schema exists. If is_admin is missing, we should add it.
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Secure the is_admin column?
-- RLS prevents UPDATE unless auth.uid() = id.
-- But a user could update their own profile and set is_admin = true if we don't prevent it?
-- Wait, the policy "Users can update own profile" allows updating the row.
-- If the user sends `is_admin: true`, does RLS prevent it? No, RLS is row-level.
-- We need Column Level Security or a separate policy/trigger to prevent users from promoting themselves.
-- Or we just don't expose is_admin in the API update call (Client side), but that's not secure.
-- Better approach: Separate Admin table or prevent update of is_admin column.

-- Prevent users from updating is_admin column
-- We can achieve this by ensuring the UPDATE policy doesn't allow changing is_admin
-- OR better, just rely on a Trigger that resets is_admin if changed by non-service_role?
-- Or simpler: "Users can update own profile" using a specific list of columns?
-- Postgres RLS doesn't support column filtering directly in USING/WITH CHECK easily for standard updates without some tricks.
-- However, we can use a separate function or just ignore it for now as MVP.
-- A safer way for MVP:
-- ONLY Service Role (Admin) can change is_admin.
-- Regular users update via the standard policy, but we can verify that the new row's is_admin matches old row's is_admin?
-- WITH CHECK (auth.uid() = id AND (
--   (SELECT is_admin FROM profiles WHERE id = auth.uid()) = is_admin
-- ))
-- Actually, simple check: `is_admin` should not be changed.

-- Let's refine the Profile Update Policy to be safer
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id
  AND (
    -- Prevent changing is_admin: The new value must equal the old value?
    -- RLS check compares the NEW row. We can't easily access OLD row in WITH CHECK without join.
    -- But we can assume the user input shouldn't set is_admin = true if they are not admin.
    -- Actually, simpler: just don't allow updating is_admin via standard API.
    -- For MVP, let's keep it simple and assume the backend/API won't send is_admin=true.
    -- But for strict security:
    is_admin IS NOT DISTINCT FROM (SELECT is_admin FROM profiles WHERE id = auth.uid())
  )
);
