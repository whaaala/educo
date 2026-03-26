Feature: Mobile Load More Button
  As a user browsing content in the mobile app
  I want a load more button at the bottom of lists
  So that I can fetch additional items without navigating away

  Background:
    Given I am viewing a list with more items than the initial display count

  Scenario: Load more button appears when there are more items
    When the list shows 10 of 20 total items
    Then I should see a "Load More" button at the bottom
    And I should see "Showing 10 of 20" text

  Scenario: Tapping load more fetches additional items
    When I tap the "Load More" button
    Then the button should show a loading spinner
    And the button text should change to "Loading..."
    And more items should appear in the list

  Scenario: Load more button disappears when all items are loaded
    Given all items have been loaded
    Then the "Load More" button should not be visible

  Scenario: Button is disabled while loading
    When I tap "Load More" and it is loading
    Then the button should be disabled
    And tapping it again should have no effect

  Scenario: Custom button text
    Given the load more button has custom text "Show More Files"
    Then it should display "Show More Files"

  @visual
  Scenario: Button has primary color with shadow
    Then the button should use the primary theme color
    And it should have elevation shadow
    And it should have rounded corners (12px)

  @responsive
  Scenario: Button works on both mobile and tablet
    Given the load more button is rendered
    When viewed on mobile
    Then it should be centered with proper padding
    When viewed on tablet
    Then it should be centered with proper padding
