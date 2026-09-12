Feature: MessageStats component rendering

  The MessageStats component displays summary statistics for messages
  including total, received, sent, unread, and high priority counts.

  # --- Functional scenarios (from MessageStats.test.tsx) ---

  Scenario: Displaying total messages statistic
    Given a MessageStats component rendered with total 50, received 30, sent 20, unread 5, and highPriority 3
    Then the "Total Messages" label should be visible
    And the total count "50" should be displayed

  Scenario: Displaying received messages statistic
    Given a MessageStats component rendered with total 50, received 30, sent 20, unread 5, and highPriority 3
    Then the "Received" label should be visible
    And the received count "30" should be displayed

  Scenario: Displaying sent messages statistic
    Given a MessageStats component rendered with total 50, received 30, sent 20, unread 5, and highPriority 3
    Then the "Sent" label should be visible
    And the sent count "20" should be displayed

  Scenario: Displaying high priority messages statistic
    Given a MessageStats component rendered with total 50, received 30, sent 20, unread 5, and highPriority 3
    Then the "High Priority" label should be visible
    And the high priority count "3" should be displayed

  Scenario: Showing unread badge when there are unread messages
    Given a MessageStats component rendered with unread 5
    Then the unread badge should display "5 Unread"

  Scenario: Hiding unread badge when unread count is zero
    Given a MessageStats component rendered with unread 0
    Then no unread badge should be visible

  Scenario: Rendering with all zero stats without crashing
    Given a MessageStats component rendered with total 0, received 0, sent 0, unread 0, and highPriority 0
    Then the "Total Messages" label should still be visible

  # --- Visual / CSS scenarios (from MessageStats.visual.test.tsx) ---

  @visual
  Scenario: Grid has responsive column layout
    Given a MessageStats component rendered with default stats
    Then the grid should have the class "grid"
    And the grid should have the class "grid-cols-2"
    And the grid should have the class "sm:grid-cols-4"

  @visual
  Scenario: Grid has responsive gap spacing
    Given a MessageStats component rendered with default stats
    Then the grid should have the class "gap-3"
    And the grid should have the class "sm:gap-4"

  @visual
  Scenario: Grid has entry animation
    Given a MessageStats component rendered with default stats
    Then the grid should have the class "animate-in"
    And the grid should have the class "fade-in"

  @visual
  Scenario: Grid has slide-in-from-bottom animation
    Given a MessageStats component rendered with default stats
    Then the grid should have the class "slide-in-from-bottom-2"

  @visual
  Scenario: Grid has bottom margin for spacing
    Given a MessageStats component rendered with default stats
    Then the grid should have the class "mb-6"
