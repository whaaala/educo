Feature: Supabase client configuration and singleton management
  As a developer configuring the Supabase client
  I want proper configuration detection and singleton management
  So that the Supabase client is only created when properly configured

  Scenario: Configuration check returns false when env vars are missing
    Given Supabase environment variables are empty
    When isSupabaseConfigured is called
    Then it should return false

  Scenario: Configuration check returns true when env vars are set
    Given Supabase environment variables are set with valid values
    When isSupabaseConfigured is called
    Then it should return true

  Scenario: Getting client throws when env vars are missing
    Given Supabase environment variables are empty
    When getSupabaseClient is called
    Then it should throw "Supabase environment variables not configured"

  Scenario: Resetting the client singleton does not throw
    Given the supabase module is imported
    When resetSupabaseClient is called
    Then no error should be thrown
