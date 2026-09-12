import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

// Feature: Supabase client configuration and singleton management
describe("Supabase Client (lib/supabase.ts)", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  // Scenario: Configuration check returns false when env vars are missing
  it("isSupabaseConfigured returns false when env vars are missing", async () => {
    // Given Supabase environment variables are empty
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "");

    // When isSupabaseConfigured is called
    const { isSupabaseConfigured } = await import("@/lib/supabase");

    // Then it should return false
    expect(isSupabaseConfigured()).toBe(false);
  });

  // Scenario: Configuration check returns true when env vars are set
  it("isSupabaseConfigured returns true when env vars are set", async () => {
    // Given Supabase environment variables are set with valid values
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://test.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "test-anon-key");

    // When isSupabaseConfigured is called
    const { isSupabaseConfigured } = await import("@/lib/supabase");

    // Then it should return true
    expect(isSupabaseConfigured()).toBe(true);
  });

  // Scenario: Getting client throws when env vars are missing
  it("getSupabaseClient throws when env vars are missing", async () => {
    // Given Supabase environment variables are empty
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "");

    // When getSupabaseClient is called
    const { getSupabaseClient } = await import("@/lib/supabase");

    // Then it should throw an error about missing configuration
    expect(() => getSupabaseClient()).toThrow("Supabase environment variables not configured");
  });

  // Scenario: Resetting the client singleton does not throw
  it("resetSupabaseClient clears the singleton without error", async () => {
    // Given the supabase module is imported
    const { resetSupabaseClient } = await import("@/lib/supabase");

    // When resetSupabaseClient is called (even without an existing client)
    resetSupabaseClient();

    // Then no error should be thrown
    expect(true).toBe(true);
  });
});
