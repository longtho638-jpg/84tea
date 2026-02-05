-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table (Extends Supabase Auth)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  phone TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'franchisee')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone."
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile."
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile."
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- 2. Products Table
CREATE TABLE public.products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  long_description TEXT,
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  weight TEXT,
  image TEXT,
  images TEXT[],
  category TEXT NOT NULL CHECK (category IN ('tea', 'teaware', 'gift')),
  type TEXT CHECK (type IN ('green', 'black', 'white', 'oolong', 'herbal')),
  origin TEXT,
  harvest TEXT,
  taste TEXT,
  tags TEXT[],
  in_stock BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  rating NUMERIC DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for Products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are viewable by everyone."
  ON public.products FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert products."
  ON public.products FOR INSERT
  WITH CHECK (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

CREATE POLICY "Admins can update products."
  ON public.products FOR UPDATE
  USING (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- 3. Orders Table
CREATE TABLE public.orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  guest_info JSONB, -- For guest checkout { name, email, phone, address }
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  total NUMERIC NOT NULL,
  items JSONB NOT NULL, -- Array of { product_id, quantity, price, name }
  payment_status TEXT DEFAULT 'unpaid',
  payment_method TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for Orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own orders."
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders."
  ON public.orders FOR SELECT
  USING (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

CREATE POLICY "Users can insert their own orders."
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 4. Franchise Applications Table
CREATE TABLE public.franchise_applications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  location TEXT,
  investment_range TEXT,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for Franchise Applications
ALTER TABLE public.franchise_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all applications."
  ON public.franchise_applications FOR SELECT
  USING (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

CREATE POLICY "Anyone can insert application."
  ON public.franchise_applications FOR INSERT
  WITH CHECK (true);

-- Function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
