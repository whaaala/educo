Feature: SecondaryButton component
  A secondary-styled button that supports label text, children content,
  onClick handler, custom className, and mobile text hiding.

  # ── Functional ──────────────────────────────────────────────

  Scenario: Renders label text
    Given a SecondaryButton is rendered with label "Refresh"
    When the component renders
    Then the "Refresh" text should be visible

  Scenario: Renders children as alternative to label
    Given a SecondaryButton is rendered with children "Export"
    When the component renders
    Then the "Export" text should be visible

  Scenario: Calls onClick when clicked
    Given a SecondaryButton is rendered with an onClick handler
    When the button is clicked
    Then the onClick handler should be called once

  Scenario: Applies custom className
    Given a SecondaryButton is rendered with className "my-class"
    When the component renders
    Then the button should have the "my-class" class

  # ── Visual / CSS ────────────────────────────────────────────

  @visual
  Scenario: SecondaryButton has theme-responsive background colors
    Given a SecondaryButton is rendered with a label
    Then the button has "bg-white" class
    And the button has "dark:bg-gray-800" class
    And the button has "midnight:bg-gray-800/80" class
    And the button has "purple:bg-gray-800/80" class

  @visual
  Scenario: SecondaryButton has theme-responsive text colors
    Given a SecondaryButton is rendered with a label
    Then the button has "text-gray-700" class
    And the button has "dark:text-gray-300" class
    And the button has "midnight:text-cyan-300" class
    And the button has "purple:text-pink-300" class

  @visual
  Scenario: SecondaryButton has theme-responsive border colors
    Given a SecondaryButton is rendered with a label
    Then the button has "border" class
    And the button has "border-gray-200" class
    And the button has "dark:border-gray-700" class
    And the button has "midnight:border-cyan-500/20" class
    And the button has "purple:border-pink-500/20" class

  @visual
  Scenario: SecondaryButton has rounded corners and flex layout
    Given a SecondaryButton is rendered with a label
    Then the button has "rounded-lg" class
    And the button has "flex" class
    And the button has "items-center" class

  @visual
  Scenario: SecondaryButton has correct typography
    Given a SecondaryButton is rendered with a label
    Then the button has "text-sm" class
    And the button has "font-medium" class

  @visual
  Scenario: Label is hidden on mobile when hideTextOnMobile is true
    Given a SecondaryButton is rendered with hideTextOnMobile enabled
    Then the label span has "hidden" class
    And the label span has "sm:inline" class

  @visual
  Scenario: Label is visible on all sizes when hideTextOnMobile is false
    Given a SecondaryButton is rendered without hideTextOnMobile
    Then the label span does not have the "hidden" class
