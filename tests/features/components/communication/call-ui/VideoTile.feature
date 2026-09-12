Feature: VideoTile displays participant video feed with name, avatar, and status indicators

  # --- Functional scenarios ---

  Scenario: Renders participant name
    Given the component is rendered with name "John Doe"
    Then the name "John Doe" should be displayed

  Scenario: Shows 'You' for local participant
    Given the component is rendered with name "John Doe" and isLocal set to true
    Then "You" should be displayed instead of the name

  Scenario: Shows initial when video is off and no avatar
    Given the component is rendered with name "Jane Doe" and isVideoOff set to true without an avatar
    Then the initial "J" should be displayed

  Scenario: Shows avatar when video is off and avatar provided
    Given the component is rendered with name "Jane Doe", isVideoOff set to true, and avatar "/avatar.jpg"
    Then an avatar image with alt text "Jane Doe" should be displayed

  Scenario: Renders video element when video is on
    Given the component is rendered with video on
    Then a video element should be present

  Scenario: Does not render video element when video is off
    Given the component is rendered with isVideoOff set to true
    Then no video element should be present

  Scenario: Hides name when showName is false
    Given the component is rendered with name "John Doe" and showName set to false
    Then the name "John Doe" should not be displayed

  Scenario: Shows muted indicator when isMuted
    Given the component is rendered with isMuted set to true
    Then a muted indicator with red background should be present

  Scenario: Calls onClick when clicked
    Given the component is rendered with an onClick handler
    When the tile is clicked
    Then the onClick handler should be called

  Scenario Outline: Renders with various sizes without crashing
    Given the component is rendered with size "<size>" and isVideoOff set to true
    Then the initial "J" should be displayed without errors

    Examples:
      | size |
      | xs   |
      | sm   |
      | md   |
      | lg   |
      | full |

  # --- Visual / CSS scenarios ---

  @visual
  Scenario: xs size has w-16 h-12 with sm:w-20 sm:h-16
    Given the component is rendered with size "xs" and isVideoOff set to true
    Then the tile should have "w-16", "h-12", "sm:w-20", and "sm:h-16" classes

  @visual
  Scenario: sm size has w-24 h-20 with sm:w-32 sm:h-24
    Given the component is rendered with size "sm" and isVideoOff set to true
    Then the tile should have "w-24", "h-20", "sm:w-32", and "sm:h-24" classes

  @visual
  Scenario: md size has w-40 h-32 with sm:w-48 sm:h-36
    Given the component is rendered with size "md" and isVideoOff set to true
    Then the tile should have "w-40", "h-32", "sm:w-48", and "sm:h-36" classes

  @visual
  Scenario: lg size has w-60 h-44 with sm:w-72 sm:h-52
    Given the component is rendered with size "lg" and isVideoOff set to true
    Then the tile should have "w-60", "h-44", "sm:w-72", and "sm:h-52" classes

  @visual
  Scenario: full size has w-full h-full
    Given the component is rendered with size "full" and isVideoOff set to true
    Then the tile should have "w-full" and "h-full" classes

  @visual
  Scenario: Has rounded corners with responsive upgrade
    Given the component is rendered with isVideoOff set to true
    Then the tile should have "rounded-xl" and "sm:rounded-2xl" classes

  @visual
  Scenario: Has dark background for video area
    Given the component is rendered with isVideoOff set to true
    Then the tile should have "bg-gray-900" and "dark:bg-gray-800" classes

  @visual
  Scenario: Has overflow-hidden and group class
    Given the component is rendered with isVideoOff set to true
    Then the tile should have "overflow-hidden" and "group" classes

  @visual
  Scenario: Has cursor-pointer when onClick is provided
    Given the component is rendered with isVideoOff set to true and an onClick handler
    Then the tile should have the "cursor-pointer" class

  @visual
  Scenario: Does not have cursor-pointer without onClick
    Given the component is rendered with isVideoOff set to true without an onClick handler
    Then the tile should not have the "cursor-pointer" class

  @visual
  Scenario: Has ring class when isSpeaking
    Given the component is rendered with isVideoOff set to true and isSpeaking set to true
    Then the tile should have "ring-2" and "sm:ring-3" classes

  @visual
  Scenario: Does not have ring class when not speaking
    Given the component is rendered with isVideoOff set to true and isSpeaking not set
    Then the tile should not have the "ring-2" class

  @visual
  Scenario: Muted indicator has red background
    Given the component is rendered with isMuted set to true
    Then the muted indicator should have the "bg-red-500/90" class
