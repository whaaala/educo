Feature: HybridStorageService combining Supabase and Dropbox overflow
  As a developer managing file storage
  I want a hybrid service that uses Supabase with Dropbox overflow
  So that files can be stored even when Supabase quota is exceeded

  # initialization

  Scenario: Service is initialized by default since Supabase needs no OAuth
    Given a HybridStorageService with default configuration
    Then the service should report as initialized

  Scenario: Dropbox is not connected by default
    Given a HybridStorageService with default configuration
    Then Dropbox should not be connected

  Scenario: Connecting Dropbox overflow provider
    Given a HybridStorageService with default configuration
    When Dropbox service is connected
    Then Dropbox should be reported as connected

  Scenario: Disconnecting Dropbox overflow provider
    Given a HybridStorageService with Dropbox connected
    When Dropbox is disconnected
    Then Dropbox should no longer be connected

  # quota management

  Scenario: Retrieving configured quota
    Given a HybridStorageService configured with 100 MB quota
    Then the quota should be 100 MB in bytes

  Scenario: Getting Supabase storage usage
    When Supabase usage is retrieved
    Then the result should be a number

  Scenario: Usage results are cached
    When Supabase usage is retrieved twice
    Then both calls should return the same value

  Scenario: Invalidating cache does not throw
    When the cache is invalidated
    Then no error should be thrown

  # upload routing

  Scenario: Uploading a file when under quota routes to Supabase
    Given a small file within quota limits
    When the file is uploaded
    Then the result should be a Supabase-prefixed item

  Scenario: Uploading over quota without Dropbox throws error
    Given a service with a 1-byte quota and no Dropbox connected
    When a file larger than the quota is uploaded
    Then a StorageQuotaExceededError should be thrown

  Scenario: Uploading over quota with Dropbox connected routes to Dropbox
    Given a service with a 1-byte quota and Dropbox connected
    When a file larger than the quota is uploaded
    Then the upload should be delegated to Dropbox
    And the result should be a Dropbox-prefixed item

  Scenario: Uploading with unlimited quota (0) skips quota check
    Given a service with unlimited quota (0 bytes)
    When a file is uploaded
    Then the upload should succeed

  # listing

  Scenario: Listing items when no Dropbox is connected
    When listing the root folder
    Then the result should contain an array of items

  Scenario: Listing items merges Dropbox items when connected
    Given Dropbox is connected
    When listing the root folder
    Then the result should include Dropbox-prefixed items

  Scenario: Listing falls back to Supabase results when Dropbox fails
    Given Dropbox is connected but its listFolder rejects
    When listing the root folder
    Then Supabase results should still be returned

  # OAuth delegation

  Scenario: Getting authorization URL without Dropbox throws
    When getAuthorizationUrl is called without Dropbox connected
    Then it should throw "No overflow provider configured"

  Scenario: Getting authorization URL delegates to Dropbox
    Given Dropbox is connected
    When getAuthorizationUrl is called
    Then it should return the Dropbox authorization URL

  Scenario: Exchanging code without Dropbox throws
    When exchangeCodeForTokens is called without Dropbox connected
    Then it should reject with "No overflow provider configured"

  Scenario: Refreshing token without Dropbox throws
    When refreshAccessToken is called without Dropbox connected
    Then it should reject with "No overflow provider configured"

  # sharing

  Scenario: Creating a shared link for a file
    When a shared link is created for a file
    Then the result should contain a shared link URL

  # folder creation

  Scenario: Creating a folder in Supabase
    When a folder is created
    Then the result should be a folder item

  # download fallback

  Scenario: Downloading a file from Supabase
    When a file is downloaded
    Then the result should be defined

  # cleanup

  Scenario: Destroying the service cleans up Dropbox
    Given Dropbox is connected
    When the service is destroyed
    Then the Dropbox service should be destroyed
