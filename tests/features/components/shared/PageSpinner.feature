Feature: PageSpinner component
  An inline loading spinner with a message, pulsing background circle,
  and support for small, medium, and large size variants.

  # ── Functional ──────────────────────────────────────────────

  Scenario: Renders default loading message
    Given a PageSpinner is rendered with default props
    When the component renders
    Then the "Loading..." text should be visible

  Scenario: Renders custom message
    Given a PageSpinner is rendered with message "Fetching records..."
    When the component renders
    Then the "Fetching records..." text should be visible

  Scenario Outline: Renders with size <size>
    Given a PageSpinner is rendered with size "<size>"
    When the component renders
    Then the "Loading..." text should be visible

    Examples:
      | size |
      | sm   |
      | md   |
      | lg   |

  Scenario: Renders spinner icon
    Given a PageSpinner is rendered
    When the component renders
    Then an SVG spinner icon should be present

  # ── Visual / CSS ────────────────────────────────────────────

  @visual
  Scenario: PageSpinner has centered flex layout with minimum height
    Given a PageSpinner is rendered with default props
    Then the wrapper has "flex" class
    And the wrapper has "flex-col" class
    And the wrapper has "items-center" class
    And the wrapper has "justify-center" class
    And the wrapper has "min-h-[400px]" class

  @visual
  Scenario: Spinner SVG has theme-responsive colors
    Given a PageSpinner is rendered with default props
    Then the spinner SVG has "animate-spin" class
    And the spinner SVG has "text-blue-600" class
    And the spinner SVG has "dark:text-blue-400" class
    And the spinner SVG has "midnight:text-cyan-400" class
    And the spinner SVG has "purple:text-pink-400" class

  @visual
  Scenario: Pulsing background circle has theme colors
    Given a PageSpinner is rendered with default props
    Then the pulsing background has "animate-pulse" class
    And the pulsing background has "rounded-full" class
    And the pulsing background has "bg-blue-100" class
    And the pulsing background has "dark:bg-blue-900/20" class

  @visual
  Scenario: Small spinner is 8x8
    Given a PageSpinner is rendered with size "sm"
    Then the spinner SVG has "w-8" class
    And the spinner SVG has "h-8" class

  @visual
  Scenario: Medium spinner is 12x12
    Given a PageSpinner is rendered with size "md"
    Then the spinner SVG has "w-12" class
    And the spinner SVG has "h-12" class

  @visual
  Scenario: Large spinner is 16x16
    Given a PageSpinner is rendered with size "lg"
    Then the spinner SVG has "w-16" class
    And the spinner SVG has "h-16" class

  @visual
  Scenario: Message text has theme-responsive colors
    Given a PageSpinner is rendered with a message
    Then the message has "text-gray-600" class
    And the message has "dark:text-gray-400" class
    And the message has "midnight:text-cyan-300" class
    And the message has "purple:text-pink-300" class
