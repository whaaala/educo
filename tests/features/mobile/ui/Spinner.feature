Feature: Mobile Spinner
  As a user of the mobile app
  I want to see a loading indicator when content is being fetched
  So that I know the app is working and not frozen

  Scenario: Full page spinner with default message
    When a page is loading
    Then I should see a spinning icon
    And I should see "Loading..." message below the spinner
    And the spinner should be centered on the page

  Scenario: Spinner with custom message
    When a page is loading with message "Fetching files..."
    Then I should see "Fetching files..." below the spinner

  Scenario: Spinner without message
    When a spinner is shown with no message
    Then only the spinning icon should be visible

  Scenario: Inline spinner
    When a spinner is shown in inline mode
    Then it should render without taking full page height
    And it should be suitable for use inside other components

  Scenario Outline: Spinner size variants
    When a spinner is rendered with size "<size>"
    Then the icon should be <iconSize>px
    And the text should be <textSize>px

    Examples:
      | size | iconSize | textSize |
      | sm   | 20       | 12       |
      | md   | 28       | 14       |
      | lg   | 36       | 16       |

  @visual
  Scenario: Spinner has animated pulsing background
    Then the spinner should have a pulsing circle behind it
    And the circle should use the primary light color
    And the message text should pulse in sync

  @responsive
  Scenario: Spinner works on both mobile and tablet
    Given the spinner is rendered
    When viewed on any screen size
    Then it should be centered and properly sized
