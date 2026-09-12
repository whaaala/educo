Feature: ControlBar provides call control buttons for mute, video, screen share, and more

  # --- Functional scenarios ---

  Scenario: Renders mute button with 'Mute' label
    Given the component is rendered with microphone on
    Then the mute button should show title "Turn off microphone"

  Scenario: Renders unmute label when muted
    Given the component is rendered with isMuted set to true
    Then the button should show title "Turn on microphone"

  Scenario: Renders video toggle button
    Given the component is rendered with camera on
    Then the video button should show title "Turn off camera"

  Scenario: Renders camera on label when video is off
    Given the component is rendered with isVideoOff set to true
    Then the video button should show title "Turn on camera"

  Scenario: Calls onToggleMute when mute button clicked
    Given the component is rendered with an onToggleMute handler
    When the "Turn off microphone" button is clicked
    Then the onToggleMute handler should be called

  Scenario: Calls onToggleVideo when video button clicked
    Given the component is rendered with an onToggleVideo handler
    When the "Turn off camera" button is clicked
    Then the onToggleVideo handler should be called

  Scenario: Calls onEndCall when end button clicked
    Given the component is rendered with an onEndCall handler
    When the "End call" button is clicked
    Then the onEndCall handler should be called

  Scenario: Calls onToggleChat when chat button clicked
    Given the component is rendered with an onToggleChat handler
    When the "Toggle chat panel" button is clicked
    Then the onToggleChat handler should be called

  Scenario: Calls onToggleParticipants when participants button clicked
    Given the component is rendered with an onToggleParticipants handler
    When the "Toggle participants panel" button is clicked
    Then the onToggleParticipants handler should be called

  Scenario: Renders screen share button when handler provided
    Given the component is rendered with an onToggleScreenShare handler
    Then the "Share your screen" button should be displayed

  Scenario: Renders recording button when handler provided
    Given the component is rendered with an onToggleRecording handler
    Then the "Start recording" button should be displayed

  Scenario: Renders settings button when handler provided
    Given the component is rendered with an onSettings handler
    Then the "Open settings" button should be displayed

  Scenario: Renders layout button when handler provided
    Given the component is rendered with an onChangeLayout handler
    Then the "Change layout" button should be displayed

  Scenario: Renders whiteboard button when handler provided
    Given the component is rendered with an onToggleWhiteboard handler
    Then the "Open whiteboard" button should be displayed

  Scenario: Renders reaction button when handler provided
    Given the component is rendered with an onReaction handler
    Then the "Send a reaction" button should be displayed

  # --- Visual / CSS scenarios ---

  @visual
  Scenario: Has theme backgrounds with backdrop blur
    Given the component is rendered with default props
    Then the bar should have "bg-white/98", "dark:bg-gray-900/98", "midnight:bg-[#0f1729]/98", and "purple:bg-[#2a1a3e]/98" classes
    And the bar should have the "backdrop-blur-xl" class

  @visual
  Scenario: Has border-t with theme colors
    Given the component is rendered with default props
    Then the bar should have "border-t", "border-gray-100", and "dark:border-gray-800" classes

  @visual
  Scenario: Has responsive gap and padding
    Given the component is rendered with default props
    Then the bar should have "gap-1", "sm:gap-2", "lg:gap-3", "px-2", and "sm:px-6" classes

  @visual
  Scenario: Has flex wrap centered layout
    Given the component is rendered with default props
    Then the bar should have "flex", "flex-wrap", "items-center", and "justify-center" classes

  @visual
  Scenario: Has shadow styling
    Given the component is rendered with default props
    Then the bar should have a shadow class

  @visual
  Scenario: Has theme-colored dividers hidden on small screens
    Given the component is rendered with default props
    Then the dividers should have "hidden" and "sm:block" responsive visibility
    And the dividers should have "rounded-full" shape

  @visual
  Scenario: Renders end call button with destructive styling
    Given the component is rendered with default props
    Then the end call button should have "bg-red-500", "text-white", and "rounded-full" classes

  @visual
  Scenario: Control buttons have responsive sizing
    Given the component is rendered with default props
    Then there should be buttons with "rounded-full", "flex", "items-center", and "justify-center" classes
