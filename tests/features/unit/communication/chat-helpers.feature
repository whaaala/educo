Feature: Chat time formatting
  As a user viewing chat conversations
  I want timestamps to be formatted in a human-readable way
  So that I can quickly understand when messages were sent

  Scenario: Format a message sent today
    Given a message timestamp from earlier today
    When the chat time is formatted
    Then the formatted time should show hour and minute with AM/PM

  Scenario: Format a message sent yesterday
    Given a message timestamp from yesterday
    When the chat time is formatted
    Then the formatted time should be "Yesterday"

  Scenario: Format a message sent 2-6 days ago
    Given a message timestamp from 3 days ago
    When the chat time is formatted
    Then the formatted time should be the abbreviated weekday name

  Scenario: Format a message sent more than 7 days ago
    Given a message timestamp from more than 7 days ago
    When the chat time is formatted
    Then the formatted time should show the date in "dd Mon" format

Feature: Chat statistics calculation
  As a user viewing the chat dashboard
  I want to see accurate chat statistics
  So that I can understand communication activity at a glance

  Scenario: Calculate stats for an empty conversation list
    Given an empty array of conversations
    When chat stats are calculated
    Then all stats should be zero

  Scenario: Count total conversations
    Given three conversations
    When chat stats are calculated
    Then the total count should be 3

  Scenario: Count active (online) conversations
    Given three conversations where two are online
    When chat stats are calculated
    Then the active count should be 2

  Scenario: Count conversations with unread messages
    Given three conversations where two have unread messages
    When chat stats are calculated
    Then the unread conversation count should be 2

  Scenario: Sum total unread messages across conversations
    Given conversations with varying unread counts of 5, 0, and 3
    When chat stats are calculated
    Then the total unread message count should be 8

  Scenario: Handle mixed conversation data correctly
    Given conversations with mixed online status and unread counts
    When chat stats are calculated
    Then total should be 4
    And active count should be 2
    And unread conversation count should be 2
    And total unread messages should be 7

Feature: Chat sort options configuration
  As a developer configuring chat sort options
  I want the sort options to be correctly defined
  So that users can sort their conversations

  Scenario: Verify sort options count
    Then CHAT_SORT_OPTIONS should have exactly 5 entries

  Scenario: Verify sort option values
    Given the chat sort options
    Then the values should be "recent", "oldest", "unread", "name_asc", and "name_desc"

Feature: Default chat filter fields configuration
  As a developer configuring chat filters
  I want the filter fields to be correctly defined
  So that users can filter their conversations

  Scenario: Verify filter fields include status and messages
    Given the default chat filter fields
    Then both "status" and "messages" filters should be present

  Scenario: Verify status filter options
    Given the status filter field
    Then it should have "Online" and "Offline" options

  Scenario: Verify messages filter options
    Given the messages filter field
    Then it should have "Unread" and "Read" options
