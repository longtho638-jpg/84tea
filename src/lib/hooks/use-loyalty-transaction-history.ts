/**
 * Loyalty Data Fetching Hook
 * Fetches user's loyalty transaction history from Supabase
 */

'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { LoyaltyTransaction } from '@/types/loyalty-transaction.types';

export function useLoyaltyTransactionHistory(userId: string | null) {
  const [transactions, setTransactions] = useState<LoyaltyTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    async function fetchTransactions() {
      const supabase = createClient();

      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('loyalty_transactions')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(50);

        if (fetchError) throw fetchError;

        setTransactions(data || []);
      } catch (err) {
        console.error('Error fetching loyalty transactions:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch transactions'));
      } finally {
        setLoading(false);
      }
    }

    fetchTransactions();
  }, [userId]);

  return { transactions, loading, error };
}
