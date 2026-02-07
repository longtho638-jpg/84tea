-- Create orders table for 84tea commerce
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_code BIGINT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  guest_info JSONB,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  total INTEGER NOT NULL CHECK (total > 0),
  items JSONB NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  payment_method TEXT DEFAULT 'payos',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_orders_order_code ON orders(order_code);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);

-- RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Users can read their own orders
CREATE POLICY "Users read own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Guest orders readable by order_code (via API, not direct DB access)
CREATE POLICY "Anon read by order_code"
  ON orders FOR SELECT
  TO anon
  USING (false);

-- Service role can do everything (API routes use service role key)
CREATE POLICY "Service role full access"
  ON orders FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Admin full access
CREATE POLICY "Admin orders access"
  ON orders FOR ALL
  TO authenticated
  USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- Trigger for updated_at
CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_products_updated_at();

-- Payment logs table for audit trail
CREATE TABLE IF NOT EXISTS payment_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event TEXT NOT NULL,
  data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS for payment_logs (service role only)
ALTER TABLE payment_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role payment logs"
  ON payment_logs FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin read payment logs"
  ON payment_logs FOR SELECT
  TO authenticated
  USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );
