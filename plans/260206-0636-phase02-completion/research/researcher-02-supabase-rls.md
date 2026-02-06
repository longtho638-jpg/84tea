# Supabase RLS Research for 84tea E-commerce

## 1. RLS Policy Syntax & Structure
Row Level Security (RLS) restricts data access at the database row level.
**Syntax:**
```sql
CREATE POLICY "policy_name"
ON table_name
FOR [SELECT | INSERT | UPDATE | DELETE | ALL]
TO [role_name | public | authenticated]
USING ( boolean_expression )      -- Checks existing rows (SELECT/UPDATE/DELETE)
WITH CHECK ( boolean_expression ); -- Checks new data (INSERT/UPDATE)
```
*   **Enable RLS:** `ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;`
*   **Helper Functions:** `auth.uid()` (current user ID), `auth.role()` (e.g., 'authenticated').

## 2. Products Table (Public Read, Admin Write)
Products should be visible to everyone but modifiable only by admins.
*   **Strategy:** Public read access, protected write access.
*   **Example Policies:**
    ```sql
    -- Enable RLS
    ALTER TABLE products ENABLE ROW LEVEL SECURITY;

    -- Public Read
    CREATE POLICY "Public products are viewable by everyone"
    ON products FOR SELECT
    USING ( true );

    -- Admin Write (assuming 'admin' role or specific email check)
    CREATE POLICY "Admins can insert products"
    ON products FOR INSERT
    TO authenticated
    WITH CHECK ( auth.jwt() ->> 'email' LIKE '%@84tea.com' );
    -- Alternatively use a custom claim or roles table
    ```

## 3. Orders Table (User-Owned Data)
Orders are strictly private. Users see only their own orders.
*   **Strategy:** Match `user_id` column with `auth.uid()`.
*   **Example Policies:**
    ```sql
    ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

    -- User Read Own Orders
    CREATE POLICY "Users can view own orders"
    ON orders FOR SELECT
    TO authenticated
    USING ( auth.uid() = user_id );

    -- User Create Orders
    CREATE POLICY "Users can create orders"
    ON orders FOR INSERT
    TO authenticated
    WITH CHECK ( auth.uid() = user_id );
    ```

## 4. Profiles Table (User Self-Management)
Profiles link auth users to public/private data.
*   **Strategy:** Users view/edit their own profile. Public might view basic info (name/avatar) if reviews exist.
*   **Example Policies:**
    ```sql
    ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

    -- Public Read (Optional - for reviews/social)
    CREATE POLICY "Public profiles are viewable by everyone"
    ON profiles FOR SELECT
    USING ( true );

    -- User Update Own Profile
    CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING ( auth.uid() = id )
    WITH CHECK ( auth.uid() = id );

    -- Insert usually handled by Triggers on auth.users creation
    ```

## 5. Common Auth Patterns
*   **`auth.uid()`**: The most common check. Compares column `user_id` (uuid) with the authenticated user's ID.
*   **`auth.jwt()`**: Access metadata like email (`auth.jwt() ->> 'email'`) or app_metadata.
*   **Service Key Bypass**: The `service_role` key bypasses RLS. Use for admin scripts or server-side webhooks.

## Unresolved Questions
*   Does 84tea require a custom "Admin" role in `auth.users` metadata, or will we use a hardcoded email list/separate table for admin privileges?
*   Are profiles completely private or public (e.g., for reviews)?

## Sources
*   [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
*   [Supabase Auth Helpers](https://supabase.com/docs/guides/auth/managing-user-data)
