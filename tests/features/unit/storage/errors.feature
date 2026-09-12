Feature: StorageQuotaExceededError custom error class
  As a developer handling storage quota errors
  I want a well-structured custom error class
  So that quota exceeded conditions can be handled programmatically

  Scenario: Error is created with correct properties
    Given a StorageQuotaExceededError constructed with 50 MB used, 100 MB limit, and 20 MB file size
    Then the error should be an instance of Error
    And the error should be an instance of StorageQuotaExceededError
    And the error name should be "StorageQuotaExceededError"
    And currentUsage should be 50 MB in bytes
    And quotaLimit should be 100 MB in bytes
    And attemptedSize should be 20 MB in bytes

  Scenario: Error message contains human-readable MB values
    Given a StorageQuotaExceededError with 90 MB used, 100 MB limit, and 15 MB file size
    Then the message should contain "90.0 MB"
    And the message should contain "100.0 MB"
    And the message should contain "15.0 MB"
    And it should suggest connecting Dropbox

  Scenario: Error handles zero values gracefully
    Given a StorageQuotaExceededError constructed with all zero values
    Then all numeric properties should be zero
    And the message should display "0.0 MB"

  Scenario: Error handles large values correctly
    Given a StorageQuotaExceededError constructed with 1 GB values
    Then the currentUsage property should store the full byte count for 1 GB
    And the message should display "1024.0 MB"
