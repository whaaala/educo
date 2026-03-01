/**
 * Supabase Client Singleton
 *
 * Provides a browser-side Supabase client for storage operations.
 * Uses the public anon key (safe for client-side use with RLS policies).
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let instance: SupabaseClient | null = null;

/** Get the shared Supabase client (browser-side, uses anon key) */
export function getSupabaseClient(): SupabaseClient {
  if (instance) return instance;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase environment variables not configured. " +
      "Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local"
    );
  }

  instance = createClient(url, key);
  return instance;
}

/** Check if Supabase environment variables are configured */
export function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

/** Reset the client instance (for testing or cleanup) */
export function resetSupabaseClient(): void {
  instance = null;
}
