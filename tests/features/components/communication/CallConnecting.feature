Feature: CallConnecting component displays connection status for voice and video calls

  # --- Functional scenarios ---

  Scenario: Renders 'Calling...' for voice calls
    Given the component is rendered with callType "voice"
    Then it should display "Calling..."

  Scenario: Renders 'Connecting to call...' for video calls
    Given the component is rendered with callType "video"
    Then it should display "Connecting to call..."

  Scenario: Shows recipient name for voice calls
    Given the component is rendered with callType "voice" and recipientName "John Doe"
    Then the recipient name "John Doe" should be displayed

  Scenario: Shows 'Setting up your session' for video calls
    Given the component is rendered with callType "video"
    Then it should display "Setting up your session"

  Scenario: Renders quality label when provided
    Given the component is rendered with callType "video" and qualityLabel "Full HD 1080p"
    Then the quality label "Full HD 1080p" should be displayed

  Scenario: Renders 'Voice Call' badge for voice calls without quality label
    Given the component is rendered with callType "voice" without a quality label
    Then it should display a "Voice Call" badge

  Scenario: Renders 'Video Call' badge for video calls without quality label
    Given the component is rendered with callType "video" without a quality label
    Then it should display a "Video Call" badge

  Scenario: Renders tenant name when provided
    Given the component is rendered with callType "video" and tenantName "Educo School"
    Then it should display "Powered by Educo School"

  Scenario: Does not render tenant name when not provided
    Given the component is rendered with callType "video" without a tenantName
    Then no "Powered by" text should be present

  Scenario: Shows recipient initial for voice call without avatar
    Given the component is rendered with callType "voice" and recipientName "Jane" without an avatar
    Then the initial "J" should be displayed

  Scenario: Shows recipient avatar for voice call when provided
    Given the component is rendered with callType "voice", recipientName "Jane", and recipientAvatar "/avatar.jpg"
    Then an avatar image with alt text "Jane" should be displayed
    And the image source should be "/avatar.jpg"

  # --- Visual / CSS scenarios ---

  @visual
  Scenario: Has full-height centered layout
    Given the component is rendered with callType "video"
    Then the container should have "flex", "items-center", "justify-center", and "h-full" classes

  @visual
  Scenario: Has light theme background
    Given the component is rendered with callType "video"
    Then the container should have the "bg-white" class

  @visual
  Scenario: Has dark theme background
    Given the component is rendered with callType "video"
    Then the container should have the "dark:bg-gray-900" class

  @visual
  Scenario: Has midnight theme background
    Given the component is rendered with callType "video"
    Then the container should have the "midnight:bg-[#0a0f1a]" class

  @visual
  Scenario: Has purple theme background
    Given the component is rendered with callType "video"
    Then the container should have the "purple:bg-[#120622]" class

  @visual
  Scenario: Has fade-in animation
    Given the component is rendered with callType "video"
    Then the container should have "animate-in", "fade-in", and "duration-300" classes

  @visual
  Scenario: Voice call heading has bold xl text with theme colors
    Given the component is rendered with callType "voice"
    Then the "Calling..." heading should have "text-xl" and "font-bold" classes
    And it should have theme text colors "text-gray-900", "dark:text-white", "midnight:text-cyan-50", and "purple:text-pink-50"

  @visual
  Scenario: Subtitle has sm text with subdued theme colors
    Given the component is rendered with callType "video"
    Then the "Setting up your session" subtitle should have "text-sm" class
    And it should have subdued theme colors "text-gray-500", "dark:text-gray-400", "midnight:text-cyan-400", and "purple:text-pink-400"

  @visual
  Scenario: Badge has rounded-full pill shape
    Given the component is rendered with callType "voice"
    Then the badge should have "rounded-full", "inline-flex", and "items-center" classes

  @visual
  Scenario: Badge has blue theme with dark/midnight/purple variants
    Given the component is rendered with callType "voice"
    Then the badge should have "bg-blue-50", "dark:bg-blue-900/20", "midnight:bg-cyan-900/20", and "purple:bg-pink-900/20" classes
    And the badge should have "border" and "border-blue-200" classes

  @visual
  Scenario: Badge text has theme-responsive colors
    Given the component is rendered with callType "video"
    Then the badge text should have "text-blue-700", "dark:text-blue-300", "midnight:text-cyan-300", and "purple:text-pink-300" classes

  @visual
  Scenario: Voice avatar has responsive sizing (w-20/sm:w-24)
    Given the component is rendered with callType "voice" and recipientName "Jane"
    Then the initial circle should have "w-20", "h-20", "sm:w-24", and "sm:h-24" classes

  @visual
  Scenario: Video spinner has responsive sizing
    Given the component is rendered with callType "video"
    Then the spinner wrapper should have "w-16" and "sm:w-20" classes

  @visual
  Scenario: Badge icon has responsive sizing (w-3.5/sm:w-4)
    Given the component is rendered with callType "voice"
    Then a Lucide SVG icon should be present in the badge

  @visual
  Scenario: Has small muted text with theme colors
    Given the component is rendered with callType "video" and tenantName "Educo School"
    Then the "Powered by Educo School" text should have "text-xs" and "text-gray-400" classes
    And it should have dark variant "dark:text-gray-500", midnight variant "midnight:text-cyan-400/40", and purple variant "purple:text-pink-400/40"
