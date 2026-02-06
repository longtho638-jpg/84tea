-- Add loyalty columns to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS loyalty_points integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS loyalty_tier text DEFAULT 'bronze' CHECK (loyalty_tier IN ('bronze', 'silver', 'gold', 'diamond')),
ADD COLUMN IF NOT EXISTS lifetime_points integer DEFAULT 0;

-- Create loyalty transactions table
CREATE TABLE IF NOT EXISTS public.loyalty_transactions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    amount integer NOT NULL,
    type text NOT NULL CHECK (type IN ('purchase', 'bonus', 'redemption', 'expiry')),
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
