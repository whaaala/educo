Feature: ChatStats component rendering

  The ChatStats component displays summary statistics for chat conversations
  including total chats, active users, unread counts, and recipient information.

  Scenario: Displaying total chats statistic
    Given a ChatStats component rendered with total 25, active 8, unread 3, and totalUnreadMessages 12
    Then the "Total Chats" label should be visible
    And "25" should appear twice for Total Chats and Recipients

  Scenario: Displaying active now statistic
    Given a ChatStats component rendered with total 25, active 8, unread 3, and totalUnreadMessages 12
    Then the "Active Now" label should be visible
    And the active count "8" should be displayed

  Scenario: Displaying unread chats statistic
    Given a ChatStats component rendered with total 25, active 8, unread 3, and totalUnreadMessages 12
    Then the "Unread Chats" label should be visible
    And the unread count "3" should be displayed

  Scenario: Displaying recipient label with default text
    Given a ChatStats component rendered without a custom recipient label
    Then the default "Recipients" label should be visible

  Scenario: Displaying custom recipient label
    Given a ChatStats component rendered with recipientLabel "Parents"
    Then the custom label "Parents" should be visible

  Scenario: Showing online badge for active users
    Given a ChatStats component rendered with active 8
    Then the online badge should show "8 Online"

  Scenario: Showing unread messages badge when count is greater than zero
    Given a ChatStats component rendered with totalUnreadMessages 12
    Then the unread messages badge should display "12 messages"

  Scenario: Hiding unread messages badge when count is zero
    Given a ChatStats component rendered with totalUnreadMessages 0
    Then no unread messages badge should be visible

  Scenario: Rendering with all zero stats without crashing
    Given a ChatStats component rendered with total 0, active 0, unread 0, and totalUnreadMessages 0
    Then the "Total Chats" label should still be visible
