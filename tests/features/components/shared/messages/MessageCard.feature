Feature: MessageCard component rendering and interaction

  The MessageCard displays a message summary including sender/recipient info,
  subject, preview text, category, priority, read status, and supports
  user interactions such as viewing, replying, selecting, and deleting messages.

  # --- Functional scenarios (from MessageCard.test.tsx) ---

  Scenario: Displaying sender name in the message card
    Given a MessageCard rendered with default message data
    Then the sender name "Jane Parent" should be visible

  Scenario: Displaying recipient name in the message card
    Given a MessageCard rendered with default message data
    Then the recipient name should be visible as "To: Admin User"

  Scenario: Displaying subject line in the message card
    Given a MessageCard rendered with default message data
    Then the subject line "Fee Payment Inquiry" should be visible

  Scenario: Displaying message preview text
    Given a MessageCard rendered with default message data
    Then the message preview "I have a question about the outstanding fees for this term." should be visible

  Scenario: Displaying category badge on the message card
    Given a MessageCard rendered with category "Academic"
    Then the category badge should display "Academic"

  Scenario: Showing child name when provided in message data
    Given a MessageCard rendered with a child name "Tom Parent"
    Then the child name should be displayed as "Re: Tom Parent"

  Scenario: Rendering checkbox in unchecked state by default
    Given a MessageCard rendered in unselected state
    Then the checkbox should not be checked

  Scenario: Rendering checkbox in checked state when selected
    Given a MessageCard rendered in selected state
    Then the checkbox should be checked

  Scenario: Triggering onSelect callback when checkbox is toggled
    Given a MessageCard rendered with a custom onSelect handler
    When the user clicks the checkbox
    Then onSelect should be called with the message id "msg-1" and checked state true

  Scenario: Triggering onView callback when view button is clicked
    Given a MessageCard rendered with a custom onView handler
    When the user clicks the view button
    Then onView should be called with the message data

  Scenario: Triggering onReply callback when reply button is clicked
    Given a MessageCard rendered with a custom onReply handler
    When the user clicks the reply button
    Then onReply should be called with the message data

  Scenario: Triggering onDelete callback when delete button is clicked
    Given a MessageCard rendered with a custom onDelete handler
    When the user clicks the delete button
    Then onDelete should be called with the message data

  Scenario: Displaying formatted time using the formatTime prop
    Given a MessageCard rendered with a custom formatTime function that returns "2:30 PM"
    Then the formatted time "2:30 PM" should be visible

  Scenario: Rendering avatar image when provided
    Given a MessageCard rendered with a sender avatar "/avatar.jpg"
    Then an image with alt text "Jane Parent" should be present

  Scenario Outline: Rendering category badge for each valid category type
    Given a MessageCard rendered with category "<category>"
    Then the category badge should display "<category>"

    Examples:
      | category  |
      | Academic  |
      | Fee       |
      | Event     |
      | General   |
      | Complaint |
      | Inquiry   |

  # --- Visual / CSS scenarios (from MessageCard.visual.test.tsx) ---

  @visual
  Scenario: Card container has correct theme background classes
    Given a MessageCard rendered with default props
    Then the card should have the class "bg-white"
    And the card should have the class "dark:bg-gray-800"
    And the card should have the class "midnight:bg-gray-900"
    And the card should have the class "purple:bg-gray-900"

  @visual
  Scenario: Card container has rounded corners and border
    Given a MessageCard rendered with default props
    Then the card should have the class "rounded-xl"
    And the card should have the class "border"

  @visual
  Scenario: Card container has shadow and hover transition
    Given a MessageCard rendered with default props
    Then the card should have the class "shadow-sm"
    And the card should have the class "hover:shadow-md"
    And the card should have the class "transition-all"

  @visual
  Scenario: Card container has overflow hidden
    Given a MessageCard rendered with default props
    Then the card should have the class "overflow-hidden"

  @visual
  Scenario: Header has bottom border with theme-aware colors
    Given a MessageCard rendered with default props
    Then the header should have the class "border-b"
    And the header should have the class "border-gray-100"
    And the header should have the class "dark:border-gray-700"

  @visual
  Scenario: Preview text has subdued color styling
    Given a MessageCard rendered with default props
    Then the preview text should have the class "text-xs"
    And the preview text should have the class "text-gray-500"
    And the preview text should have the class "dark:text-gray-400"

  @visual
  Scenario: Preview text is clamped to two lines
    Given a MessageCard rendered with default props
    Then the preview text should have the class "line-clamp-2"

  @visual
  Scenario: Card has blue border and ring when selected
    Given a MessageCard rendered in the selected state
    Then the card should have the class "border-blue-500"
    And the card should have the class "ring-2"
    And the card should have the class "ring-blue-500/20"

  @visual
  Scenario: Unread received messages have a blue border
    Given a MessageCard rendered with an unread received message
    Then the card should have the class "border-blue-300"

  @visual
  Scenario: Action buttons have proper styling with hover states
    Given a MessageCard rendered with default props
    Then action buttons with the class "rounded-lg" should be present
