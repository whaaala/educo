Feature: StorageManager singleton for managing storage providers
  As a developer managing file storage providers
  I want a singleton StorageManager to orchestrate provider selection
  So that the application can switch between storage backends

  # singleton pattern

  Scenario: Manager returns the same instance on repeated calls
    When getStorageManager is called twice
    Then both references should be the same instance

  # getService

  Scenario: Getting a service for the supabase provider
    Given a manager with settings configured
    When a supabase service is requested
    Then a service should be returned
    And the current provider should be "supabase"

  Scenario: Getting a service for the dropbox provider
    Given a manager with settings configured
    When a dropbox service is requested
    Then a service should be returned
    And the current provider should be "dropbox"

  Scenario: Google Drive falls back to dropbox
    Given a manager with settings configured
    When a google-drive service is requested
    Then a service should be returned
    And the current provider should fall back to "dropbox"

  Scenario: Local provider is not supported
    Given a manager with settings configured
    When a local service is requested
    Then it should throw a "not supported" error

  # getHybridService

  Scenario: Getting a HybridStorageService instance
    Given a manager with settings configured
    When a hybrid service is requested for user "user1"
    Then the hybrid service should be defined and initialized

  Scenario: Hybrid service is cached per user and tenant
    Given a manager with settings configured
    When a hybrid service is requested twice for user "user1"
    Then both references should be the same instance

  # isProviderConfigured

  Scenario: Supabase is configured when settings are loaded
    Given a manager with settings configured
    Then supabase should be reported as configured

  Scenario: Local provider is always available
    Given a manager with settings configured
    Then local should be reported as configured

  Scenario: Provider is not configured when no settings are loaded
    Given a manager without settings
    Then dropbox should not be reported as configured

  # getAvailableProviders

  Scenario: Available providers include supabase and local
    Given a manager with settings configured
    When available providers are retrieved
    Then the list should include "supabase" and "local"
