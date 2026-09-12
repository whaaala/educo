Feature: ParticipantsPanel displays the list of call participants with roles and statuses

  # --- Functional scenarios ---

  Scenario: Renders 'Participants' heading
    Given the component is rendered with participants
    Then the "Participants" heading should be displayed

  Scenario: Renders participant count badge
    Given the component is rendered with 3 participants
    Then the participant count "3" should be displayed

  Scenario: Renders all participant names
    Given the component is rendered with participants "Alice (Host)", "Bob Smith", and "Charlie Brown"
    Then "Alice (Host)" should be displayed
    And "Bob Smith" should be displayed
    And "Charlie Brown" should be displayed

  Scenario: Shows 'Host' badge for host participant
    Given the component is rendered with a participant that has isHost set to true
    Then the "Host" badge should be displayed

  Scenario: Shows '(You)' for current user
    Given the component is rendered with the current user in the participant list
    Then the "(You)" label should be displayed

  Scenario: Shows initials for participants without avatars
    Given the component is rendered with a participant named "Zack" without an avatar
    Then the initial "Z" should be displayed

  Scenario: Renders 'Add Participant' button when handler provided
    Given the component is rendered with an onAddParticipant handler
    Then the "Add Participant" button should be displayed

  Scenario: Does not render 'Add Participant' button when handler not provided
    Given the component is rendered without an onAddParticipant handler
    Then the "Add Participant" button should not be present

  Scenario: Calls onAddParticipant when button clicked
    Given the component is rendered with an onAddParticipant handler
    When the "Add Participant" button is clicked
    Then the onAddParticipant handler should be called

  # --- Visual / CSS scenarios ---

  @visual
  Scenario: Has theme backgrounds
    Given the component is rendered with default props
    Then the panel should have "bg-white", "dark:bg-gray-900", "midnight:bg-[#0f1729]", and "purple:bg-[#2a1a3e]" classes

  @visual
  Scenario: Has flex-col full size
    Given the component is rendered with default props
    Then the panel should have "flex", "flex-col", "w-full", and "h-full" classes

  @visual
  Scenario: Header has border-b with theme colors
    Given the component is rendered with default props
    Then the header should have "border-b", "border-gray-100", and "dark:border-gray-800" classes

  @visual
  Scenario: Title has theme text colors
    Given the component is rendered with default props
    Then the title should have "font-semibold", "text-gray-900", and "dark:text-white" classes

  @visual
  Scenario: Title has midnight and purple theme text colors
    Given the component is rendered with default props
    Then the title should have "midnight:text-cyan-50" and "purple:text-pink-50" classes

  @visual
  Scenario: Participant name has theme colors
    Given the component is rendered with default props
    Then the participant name should have "text-sm", "font-medium", "text-gray-900", and "dark:text-white" classes

  @visual
  Scenario: Host badge has amber styling
    Given the component is rendered with a host participant
    Then the host badge should have "bg-amber-500", "text-white", and "font-bold" classes

  @visual
  Scenario: Participant row has hover state
    Given the component is rendered with default props
    Then the participant row should have "hover:bg-gray-50", "cursor-pointer", and "transition-colors" classes

  @visual
  Scenario: Avatar has online indicator
    Given the component is rendered with default props
    Then the avatar should have a green online indicator with "bg-green-500" and "rounded-full" classes
