import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

describe("Supabase Client (lib/supabase.ts)", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("isSupabaseConfigured returns false when env vars are missing", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "");

    const { isSupabaseConfigured } = await import("@/lib/supabase");
    expect(isSupabaseConfigured()).toBe(false);
  });

  it("isSupabaseConfigured returns true when env vars are set", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://test.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "test-anon-key");

    const { isSupabaseConfigured } = await import("@/lib/supabase");
    expect(isSupabaseConfigured()).toBe(true);
  });

  it("getSupabaseClient throws when env vars are missing", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "");

    const { getSupabaseClient } = await import("@/lib/supabase");
    expect(() => getSupabaseClient()).toThrow("Supabase environment variables not configured");
  });

  it("resetSupabaseClient clears the singleton without error", async () => {
    const { resetSupabaseClient } = await import("@/lib/supabase");
    // Should not throw even when no client exists
    resetSupabaseClient();
    expect(true).toBe(true);
  });
});
