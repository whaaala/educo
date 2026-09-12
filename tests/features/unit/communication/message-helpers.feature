Feature: Message time formatting
  As a user viewing messages
  I want timestamps to be formatted in a human-readable way
  So that I can quickly understand when messages were sent

  Scenario: Format a message sent today
    Given a message timestamp from earlier today
    When the message time is formatted
    Then the formatted time should show hour and minute with AM/PM

  Scenario: Format a message sent yesterday
    Given a message timestamp from yesterday
    When the message time is formatted
    Then the formatted time should be "Yesterday"

  Scenario: Format a message sent 2-6 days ago
    Given a message timestamp from 3 days ago
    When the message time is formatted
    Then the formatted time should be the abbreviated weekday name

  Scenario: Format a message sent more than 7 days ago
    Given a message timestamp from more than 7 days ago
    When the message time is formatted
    Then the formatted time should show the date in "dd Mon" format

Feature: Message statistics calculation
  As a user viewing the message dashboard
  I want to see accurate message statistics
  So that I can understand messaging activity at a glance

  Scenario: Calculate stats for an empty message list
    Given an empty array of messages
    When message stats are calculated
    Then all stats should be zero

  Scenario: Count total messages
    Given two messages
    When message stats are calculated
    Then the total count should be 2

  Scenario: Count received messages
    Given three messages where two are received
    When message stats are calculated
    Then the received count should be 2

  Scenario: Count sent messages
    Given three messages where two are sent
    When message stats are calculated
    Then the sent count should be 2

  Scenario: Count only unread received messages
    Given messages with mixed read/unread and sent/received status
    When message stats are calculated
    Then the unread count should only include unread received messages

  Scenario: Count high priority messages
    Given messages with mixed priorities
    When message stats are calculated
    Then the high priority count should be 2

  Scenario: Handle comprehensive mixed message data
    Given a mix of received/sent, read/unread, and normal/high priority messages
    When message stats are calculated
    Then total should be 5
    And received should be 3
    And sent should be 2
    And unread should be 2
    And high priority should be 2

Feature: Message category configuration
  As a developer configuring message categories
  I want the category config to be correctly defined
  So that messages are properly styled by category

  Scenario: Verify all 6 categories are configured
    Then CATEGORY_CONFIG should have exactly 6 entries

  Scenario Outline: Each category has required styling classes
    Given the category config for "<category>" category
    Then the config should be defined
    And it should have a background class
    And it should have a text class

    Examples:
      | category  |
      | Academic  |
      | Fee       |
      | Event     |
      | General   |
      | Complaint |
      | Inquiry   |

Feature: Message sort options configuration
  As a developer configuring message sort options
  I want the sort options to be correctly defined
  So that users can sort their messages

  Scenario: Verify sort options count
    Then MESSAGE_SORT_OPTIONS should have exactly 5 entries

  Scenario: Verify sort option values
    Given the message sort options
    Then the values should be "newest", "oldest", "priority", "sender_asc", and "sender_desc"

Feature: Default message filter fields configuration
  As a developer configuring message filters
  I want the filter fields to be correctly defined
  So that users can filter their messages

  Scenario: Verify filter field count
    Then DEFAULT_MESSAGE_FILTER_FIELDS should have exactly 4 entries

  Scenario: Verify filter field IDs
    Given the default message filter fields
    Then the IDs should be "type", "status", "category", and "priority" in order

  Scenario: Verify type filter options
    Given the type filter field
    Then it should have "Received" and "Sent" options

  Scenario: Verify category filter options
    Given the category filter field
    Then it should have all 6 message categories: "Academic", "Fee", "Event", "General", "Complaint", and "Inquiry"

  Scenario: Verify priority filter options
    Given the priority filter field
    Then it should have "High", "Normal", and "Low" options
