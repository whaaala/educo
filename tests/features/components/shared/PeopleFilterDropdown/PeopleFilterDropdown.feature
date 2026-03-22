Feature: People Filter Dropdown
  As a user
  I want to filter files by who shared them with me
  So that I can quickly find files from a specific person

  Background:
    Given the PeopleFilterDropdown is rendered with a list of people

  # ── Core Behavior ──

  Scenario: Dropdown opens when "People" chip is clicked
    When I click the "People" trigger button
    Then the dropdown should appear with a search input and people list
    And the chevron should rotate to indicate open state

  Scenario: Dropdown closes when clicking outside
    Given the dropdown is open
    When I click outside the dropdown
    Then it should close and the chevron should rotate back

  Scenario: Dropdown closes on Escape key
    Given the dropdown is open
    When I press Escape
    Then it should close

  # ── People List ──

  Scenario: People list shows users who have shared files
    Given people data includes "John Doe" and "Jane Smith"
    Then the list should show each person with avatar, name, and email
    And each person should have a right chevron arrow

  Scenario: Current user is shown first with "(me)" label
    Given the current user is "vcc test"
    Then "vcc test (me)" should appear at the top of the list

  Scenario: "Anyone with the link" option appears at the bottom
    Then an "Anyone with the link" option should be shown
    And it should have a globe/link icon

  # ── Search ──

  Scenario: Search input filters people by name or email
    Given people include "John Doe" and "Jane Smith"
    When I type "John" in the search input
    Then only "John Doe" should be visible
    And the results should animate in smoothly

  Scenario: Search uses existing SearchBar component
    Then the search input should be the app's SearchBar component
    And it should have focus ring animation and clear button

  Scenario: Empty search results show message
    When I type "nonexistent" in the search
    Then I should see "No people found"

  # ── Selection ──

  Scenario: Clicking a person fires onSelect with that person's data
    When I click on "John Doe"
    Then onSelect should be called with John's person data
    And the dropdown should close

  Scenario: Selected person filters the main file list
    Given I selected "John Doe" from the People dropdown
    Then the main file area should show only files shared by John Doe
    And the results should animate in with fade-in slide effect

  Scenario: Active person shows on the trigger chip
    Given "John Doe" is the active filter
    Then the trigger should show "John Doe" instead of "People"
    And the chip should have an active/highlighted style

  Scenario: Clearing the filter resets to show all files
    Given "John Doe" is the active filter
    When I click the clear/X on the trigger
    Then onSelect should be called with null
    And the trigger should revert to showing "People"

  # ── UI / Look and Feel ──

  @visual
  Scenario: People list items have avatar, name, email, and chevron
    Then each person row should show:
      | element   | description                        |
      | avatar    | colored circle with first initial   |
      | name      | bold text with email below          |
      | chevron   | right-pointing arrow                |
    And hover should highlight the row

  @visual
  Scenario: Dropdown matches app design system
    Then the dropdown should have rounded corners and shadow
    And search input should match existing SearchBar styling
    And the component should support dark/midnight/purple themes

  @responsive
  Scenario: Dropdown adapts to mobile
    When viewport is 375px wide
    Then the dropdown should take appropriate width
    And the search input should remain usable
