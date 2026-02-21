import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";
import "server-only";

let adminClient: SupabaseClient<Database> | null = null;

/**
 * Singleton Supabase admin client using service role key.
 * Use for server-side operations that bypass RLS (API routes, webhooks).
 * For user-scoped operations, use `@/lib/supabase/server` or `@/lib/supabase/client`.
 */
export function getSupabaseAdmin(): SupabaseClient<Database> {
  if (adminClient) return adminClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Missing required Supabase credentials: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set");
  }

  adminClient = createClient<Database>(url, key);
  return adminClient;
}
