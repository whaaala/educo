Feature: CallHeader displays call information and provides call controls

  # --- Functional scenarios ---

  Scenario: Renders call title
    Given the component is rendered with title "Team Meeting"
    Then the title "Team Meeting" should be displayed

  Scenario: Formats duration as MM:SS
    Given the component is rendered with a duration of 125 seconds
    Then the duration should be displayed as "02:05"

  Scenario: Formats duration as HH:MM:SS for long calls
    Given the component is rendered with a duration of 3661 seconds
    Then the duration should be displayed as "1:01:01"

  Scenario: Shows recording indicator when isRecording
    Given the component is rendered with isRecording set to true
    Then a recording indicator with pulse animation should be present

  Scenario: Calls onClose when close button is clicked
    Given the component is rendered with an onClose handler
    When the "End call" button is clicked
    Then the onClose handler should be called

  Scenario: Shows 'End Call' in dropdown menu
    Given the component is rendered with an onSettings handler
    When the more menu button is clicked
    Then "End Call" should appear in the dropdown

  Scenario: Shows Settings in dropdown when onSettings provided
    Given the component is rendered with an onSettings handler
    When the more menu button is clicked
    Then "Settings" should appear in the dropdown

  Scenario: Shows Copy Room ID in dropdown when onCopyRoomId provided
    Given the component is rendered with an onCopyRoomId handler
    When the more menu button is clicked
    Then "Copy Room ID" should appear in the dropdown

  Scenario: Shows Add Participant in dropdown when onAddParticipant provided
    Given the component is rendered with an onAddParticipant handler
    When the more menu button is clicked
    Then "Add Participant" should appear in the dropdown

  # --- Visual / CSS scenarios ---

  @visual
  Scenario: Has theme backgrounds
    Given the component is rendered with default props
    Then the header should have "bg-white", "dark:bg-gray-900", "midnight:bg-[#0f1729]", and "purple:bg-[#2a1a3e]" classes

  @visual
  Scenario: Has border-b with theme colors
    Given the component is rendered with default props
    Then the header should have "border-b", "border-gray-200", and "dark:border-gray-800" classes

  @visual
  Scenario: Has flex layout
    Given the component is rendered with default props
    Then the header should have "flex", "items-center", and "justify-between" classes

  @visual
  Scenario: Has responsive padding
    Given the component is rendered with default props
    Then the header should have "px-3", "sm:px-4", and "lg:px-6" classes

  @visual
  Scenario: Title has responsive text sizing
    Given the component is rendered with default props
    Then the title should have "text-sm", "sm:text-base", "lg:text-lg", and "font-bold" classes

  @visual
  Scenario: Title has theme text colors
    Given the component is rendered with default props
    Then the title should have "text-gray-900", "dark:text-white", "midnight:text-cyan-50", and "purple:text-pink-50" classes

  @visual
  Scenario: Title has truncate for overflow
    Given the component is rendered with default props
    Then the title should have the "truncate" class

  @visual
  Scenario: Duration badge has hidden sm:flex responsive visibility
    Given the component is rendered with default props
    Then the duration badge should be hidden on small screens with "hidden" and visible with "sm:flex"
    And the badge should have "rounded-full" and "font-semibold" classes

  @visual
  Scenario: Duration badge has theme backgrounds
    Given the component is rendered with default props
    Then the duration badge should have "bg-gray-100" and "dark:bg-gray-800" classes

  @visual
  Scenario: Close button has hover and active states
    Given the component is rendered with default props
    Then the close button should have "rounded-lg", "active:scale-95", and "cursor-pointer" classes
