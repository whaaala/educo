Feature: Admin parents list sorting, filtering, and utility functions
  As an admin user managing the parent directory
  I want sorting, filtering, and utility functions for the parent list
  So that I can efficiently manage parent records

  # sortParents

  Scenario: Sorting parents ascending by full name
    Given a list of test parents
    When parents are sorted in ascending order
    Then IDs should appear in alphabetical order by name

  Scenario: Sorting parents descending by full name
    Given a list of test parents
    When parents are sorted in descending order
    Then IDs should appear in reverse alphabetical order by name

  Scenario: Sorting parents by most recently added
    Given a list of test parents
    When parents are sorted by recently added
    Then the most recently created parent should appear first

  Scenario: Sorting parents by highest outstanding balance
    Given a list of test parents
    When parents are sorted by highest balance
    Then the parent with the highest fees should appear first

  Scenario: Sorting parents by most children
    Given a list of test parents
    When parents are sorted by most children
    Then the parent with the most children should appear first

  Scenario: Sort does not mutate the original array
    Given a list of test parents
    When parents are sorted
    Then the original array should be unchanged

  # filterParents

  Scenario: No filters returns all parents
    When parents are filtered with an empty filter object
    Then all parents should be returned

  Scenario: Filtering by relationship
    When parents are filtered by "Father" relationship
    Then only the father should be returned

  Scenario: Filtering by status
    When parents are filtered by "Active" status
    Then only active parents should be returned

  Scenario: Filtering by fee status categories
    When parents are filtered by "Paid Up" fee status
    Then only the parent with zero outstanding fees should be returned
    When parents are filtered by "Pending" fee status
    Then only the parent with moderate outstanding fees should be returned
    When parents are filtered by "High Balance" fee status
    Then only the parent with high outstanding fees should be returned

  Scenario: Filtering by children count buckets
    When parents are filtered by "1 Child"
    Then only the parent with one child should be returned
    When parents are filtered by "2 Children"
    Then only the parent with two children should be returned
    When parents are filtered by "3+ Children"
    Then only the parent with three or more children should be returned

  Scenario: Multiple filters are combined with AND logic
    When parents are filtered by relationships "Mother" and "Guardian", status "Active", and fee status "Pending" or "Paid Up"
    Then only parents matching all criteria should be returned

  # getCurrencySymbol

  Scenario: Invalid currency code returns Naira fallback
    When getCurrencySymbol is called with "NOT_A_CURRENCY"
    Then it should return the Naira symbol

  Scenario: Valid currency code returns a non-empty symbol
    When getCurrencySymbol is called with "NGN"
    Then it should return a non-empty string

  # hasActiveFilters

  Scenario: No filters and no date range means no active filters
    Given empty filters and no date range
    Then hasActiveFilters should return false

  Scenario: Any filter with values means active filters
    Given a filter with a relationship value
    Then hasActiveFilters should return true

  Scenario: Date range with start or end means active filters
    Given a date range with only a start date
    Then hasActiveFilters should return true
    Given a date range with only an end date
    Then hasActiveFilters should return true
