Feature: ChatCard component rendering and interaction

  The ChatCard displays a chat conversation summary including recipient info,
  last message, online status, unread count, and selection state. It supports
  user interactions such as viewing, selecting, and deleting conversations.

  # --- Functional scenarios (from ChatCard.test.tsx) ---

  Scenario: Displaying recipient name in the chat card
    Given a ChatCard rendered with default chat data
    Then the recipient name "John Doe" should be visible

  Scenario: Displaying recipient email in the chat card
    Given a ChatCard rendered with default chat data
    Then the recipient email "john@example.com" should be visible

  Scenario: Displaying the last message in the chat card
    Given a ChatCard rendered with default chat data
    Then the last message text "Hello, how is my child doing?" should be visible

  Scenario: Showing unread badge when there are unread messages
    Given a ChatCard rendered with 3 unread messages
    Then the unread count badge should display "3"

  Scenario: Hiding unread badge when there are no unread messages
    Given a ChatCard rendered with 0 unread messages
    Then no unread count badge should be visible

  Scenario: Showing online indicator when recipient is online
    Given a ChatCard rendered with an online recipient
    Then the "Online" indicator should be visible

  Scenario: Hiding online indicator when recipient is offline
    Given a ChatCard rendered with an offline recipient
    Then the "Online" indicator should not be visible

  Scenario: Showing child name when provided in chat data
    Given a ChatCard rendered with a child name "Sarah Doe"
    Then the child name should be displayed as "Re: Sarah Doe"

  Scenario: Triggering onView callback when card is clicked
    Given a ChatCard rendered with a custom onView handler
    When the user clicks on the recipient name
    Then onView should be called with the chat data

  Scenario: Triggering onSelect callback when checkbox is toggled
    Given a ChatCard rendered with a custom onSelect handler
    When the user clicks the checkbox
    Then onSelect should be called with the chat id "chat-1" and checked state true

  Scenario: Rendering selected state with checked checkbox
    Given a ChatCard rendered in the selected state
    Then the checkbox should be checked

  Scenario: Displaying formatted time using the formatTime prop
    Given a ChatCard rendered with a custom formatTime function that returns "10:00 AM"
    Then the formatted time "10:00 AM" should be visible
    And formatTime should have been called with the timestamp "2026-02-27T10:00:00"

  Scenario: Rendering avatar image when provided
    Given a ChatCard rendered with a recipient avatar "/avatar.jpg"
    Then an image with alt text "John Doe" should be present

  # --- Visual / CSS scenarios (from ChatCard.visual.test.tsx) ---

  @visual
  Scenario: Card container has correct theme background classes
    Given a ChatCard rendered with default props
    Then the card should have the class "bg-white"
    And the card should have the class "dark:bg-gray-800"

  @visual
  Scenario: Card container has rounded corners, border, and shadow
    Given a ChatCard rendered with default props
    Then the card should have the class "rounded-xl"
    And the card should have the class "border"
    And the card should have the class "shadow-sm"
    And the card should have the class "hover:shadow-md"

  @visual
  Scenario: Card container has pointer cursor
    Given a ChatCard rendered with default props
    Then the card should have the class "cursor-pointer"

  @visual
  Scenario: Card container has overflow hidden
    Given a ChatCard rendered with default props
    Then the card should have the class "overflow-hidden"

  @visual
  Scenario: Card container has smooth hover transition
    Given a ChatCard rendered with default props
    Then the card should have the class "transition-all"

  @visual
  Scenario: Unread badge has blue pill styling when there are unread messages
    Given a ChatCard rendered with 3 unread messages
    Then a badge with the class "bg-blue-500" should be present
    And the badge should have the class "rounded-full"
    And the badge should have the class "text-white"
    And the badge should have the class "text-xs"
    And the badge should have the class "font-bold"

  @visual
  Scenario: No unread badge is shown when count is zero
    Given a ChatCard rendered with 0 unread messages
    Then no element with blue pill badge classes should be present

  @visual
  Scenario: Green indicator shown when recipient is online
    Given a ChatCard rendered with an online recipient
    Then a green circular indicator with classes "bg-green-500" and "rounded-full" should be present

  @visual
  Scenario: No indicator shown when recipient is offline
    Given a ChatCard rendered with an offline recipient
    Then no green circular indicator should be present

  @visual
  Scenario: Card has blue border and ring when selected
    Given a ChatCard rendered in the selected state
    Then the card should have the class "border-blue-500"
    And the card should have the class "ring-2"
    And the card should have the class "ring-blue-500/20"

  @visual
  Scenario: Header has bottom border with theme-aware colors
    Given a ChatCard rendered with default props
    Then the header should have the class "border-b"
    And the header should have the class "border-gray-100"
    And the header should have the class "dark:border-gray-700"
