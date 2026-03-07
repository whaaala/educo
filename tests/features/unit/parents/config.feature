Feature: Parent filter fields configuration
  As a developer configuring parent list filters
  I want the filter fields to be correctly defined
  So that users can filter the parent directory

  Scenario: Verify filter field count
    Then parentFilterFields should have exactly 4 entries

  Scenario: Verify filter field IDs
    Given the parent filter fields
    Then the IDs should be "relationship", "status", "feeStatus", and "childrenCount" in order

  Scenario: Verify relationship filter options
    Given the relationship filter field
    Then it should have "Father", "Mother", "Guardian", and "Sponsor" options

Feature: Parent sort options configuration
  As a developer configuring parent list sorting
  I want the sort options to be correctly defined
  So that users can sort the parent directory

  Scenario: Verify sort option count
    Then parentSortOptions should have exactly 5 entries

  Scenario: Verify sort option IDs
    Given the parent sort options
    Then the IDs should be "ascending", "descending", "recently_added", "highest_balance", and "most_children" in order

Feature: Parent sorting
  As a user viewing the parent directory
  I want to sort parents by various criteria
  So that I can find relevant parents quickly

  Scenario: Sort parents ascending by full name
    Given a list of test parents
    When sorting by "ascending"
    Then the parents should be in A-Z order by name

  Scenario: Sort parents descending by full name
    Given a list of test parents
    When sorting by "descending"
    Then the parents should be in Z-A order by name

  Scenario: Sort parents by most recently added
    Given a list of test parents
    When sorting by "recently_added"
    Then the parents should be in reverse chronological order

  Scenario: Sort parents by highest outstanding balance
    Given a list of test parents
    When sorting by "highest_balance"
    Then the parents should be ordered by descending outstanding fees

  Scenario: Sort parents by most children
    Given a list of test parents
    When sorting by "most_children"
    Then the parents should be ordered by descending children count

  Scenario: Sort does not mutate the original array
    Given a list of test parents
    When sorting by any sort option
    Then the original array should remain unchanged

  Scenario: Unknown sort option returns original order
    Given a list of test parents
    When sorting with an unknown sort option
    Then all parents should still be returned

Feature: Parent filtering
  As a user viewing the parent directory
  I want to filter parents by various criteria
  So that I can narrow down the list to specific parents

  Scenario: No filters returns all parents
    Given a list of test parents
    When no filters are active
    Then all parents should be returned

  Scenario: Filter by single relationship
    Given a list of test parents
    When filtering by relationship "Father"
    Then only fathers should be returned

  Scenario: Filter by multiple relationships (OR within category)
    Given a list of test parents
    When filtering by relationships "Mother" and "Guardian"
    Then mothers and guardians should be returned

  Scenario: Filter by status
    Given a list of test parents
    When filtering by status "Active"
    Then only active parents should be returned

  Scenario: Filter by fee status - Paid Up
    Given a list of test parents
    When filtering by fee status "Paid Up"
    Then only parents with zero outstanding fees should be returned

  Scenario: Filter by fee status - Pending
    Given a list of test parents
    When filtering by fee status "Pending"
    Then only parents with moderate outstanding fees (0 < fees <= 100000) should be returned

  Scenario: Filter by fee status - High Balance
    Given a list of test parents
    When filtering by fee status "High Balance"
    Then only parents with high outstanding fees (fees > 100000) should be returned

  Scenario: Filter by children count - 1 Child
    Given a list of test parents
    When filtering by children count "1 Child"
    Then only parents with exactly 1 child should be returned

  Scenario: Filter by children count - 2 Children
    Given a list of test parents
    When filtering by children count "2 Children"
    Then only parents with exactly 2 children should be returned

  Scenario: Filter by children count - 3+ Children
    Given a list of test parents
    When filtering by children count "3+ Children"
    Then only parents with 3 or more children should be returned

  Scenario: Combine filters using AND logic across categories
    Given a list of test parents
    When filtering by relationships "Mother" and "Guardian", status "Active", and fee status "Pending" or "Paid Up"
    Then only parents matching all filter categories should be returned

  Scenario: AND combination with no matches returns empty
    Given a list of test parents
    When filtering by relationship "Father" and status "Active"
    Then no parents should be returned

Feature: Parent search
  As a user searching the parent directory
  I want to search by various fields
  So that I can find specific parents quickly

  Scenario: Search by first name
    Given a list of test parents
    When searching for "Ada"
    Then the matching parent should be returned

  Scenario: Search by last name
    Given a list of test parents
    When searching for "Baker"
    Then the matching parent should be returned

  Scenario: Search by email
    Given a list of test parents
    When searching for "bola@test.com"
    Then exactly one parent should be returned

  Scenario: Search by phone number
    Given a list of test parents
    When searching for "+234 800 000 0003"
    Then exactly one parent should be returned

  Scenario: Search by occupation
    Given a list of test parents
    When searching for "Doctor"
    Then exactly one parent should be returned

  Scenario: Search by relationship
    Given a list of test parents
    When searching for "Guardian"
    Then exactly one parent should be returned

  Scenario: Search is case-insensitive
    Given a list of test parents
    When searching for "ADA" and "ada"
    Then both should return the same number of results

  Scenario: Search with no match returns empty
    Given a list of test parents
    When searching for "zzzzz"
    Then no parents should be returned

Feature: Currency symbol lookup
  As a user viewing financial data
  I want currency codes to resolve to symbols
  So that amounts are displayed with the correct currency symbol

  Scenario: Invalid currency code returns fallback symbol
    Given an invalid currency code "NOT_A_CURRENCY"
    When getting the currency symbol
    Then the fallback Naira symbol should be returned

  Scenario: NGN currency code returns a valid symbol
    Given the currency code "NGN"
    When getting the currency symbol
    Then a non-empty string should be returned

  Scenario: USD currency code returns a valid symbol
    Given the currency code "USD"
    When getting the currency symbol
    Then a non-empty string should be returned

  Scenario: GBP currency code returns a valid symbol
    Given the currency code "GBP"
    When getting the currency symbol
    Then a non-empty string should be returned

Feature: Active filter detection
  As a developer managing filter state
  I want to detect when filters are active
  So that I can show or hide filter indicators

  Scenario: No filters and no date range
    Given empty filters and null date range
    Then hasActiveFilters should return false

  Scenario: Filters with empty arrays
    Given filters with empty arrays and null date range
    Then hasActiveFilters should return false

  Scenario: Filter with values present
    Given a filter with at least one value
    Then hasActiveFilters should return true

  Scenario: Date range with start date
    Given a date range with a start date
    Then hasActiveFilters should return true

  Scenario: Date range with end date
    Given a date range with an end date
    Then hasActiveFilters should return true

  Scenario: Both filters and date range are set
    Given both filters with values and a date range
    Then hasActiveFilters should return true
