Feature: Button component
  The Button is the primary general-purpose button component supporting
  variants, sizes, loading state, icons, and custom class names.

  # --- Functional scenarios (from Button.test.tsx) ---

  Scenario: Renders children text
    Given the Button is rendered with children text "Click me"
    Then the button with name "Click me" should be in the document

  Scenario: Calls onClick when clicked
    Given the user event handler is set up
    And an onClick handler is provided
    When the user clicks the button
    Then onClick should have been called once

  Scenario: Does not call onClick when disabled
    Given the user event handler is set up
    And the Button is rendered as disabled with an onClick handler
    When the user clicks the disabled button
    Then onClick should not have been called

  Scenario: Renders with disabled attribute
    Given the Button is rendered with disabled prop
    Then the button should be disabled

  Scenario: Defaults to type button
    Given the Button is rendered without an explicit type
    Then the button should have type "button"

  Scenario: Supports type submit
    Given the Button is rendered with type "submit"
    Then the button should have type "submit"

  Scenario: Shows loading spinner when isLoading is true
    Given the Button is rendered with isLoading set to true
    Then the button should be disabled
    And a loading spinner with animate-spin class should be present

  Scenario: Renders with icon
    Given the Button is rendered with an icon element
    Then the icon should be in the document

  Scenario: Applies custom className
    Given the Button is rendered with a custom className
    Then the button should have the custom class

  Scenario: Accepts title prop without crashing
    Given the Button is rendered with a title prop
    Then the button should be in the document

  Scenario Outline: Renders with variant without crashing
    Given the Button is rendered with variant "<variant>"
    Then the button should be in the document

    Examples:
      | variant   |
      | primary   |
      | secondary |
      | outline   |
      | ghost     |
      | danger    |

  Scenario Outline: Renders with size without crashing
    Given the Button is rendered with size "<size>"
    Then the button should be in the document

    Examples:
      | size |
      | sm   |
      | md   |
      | lg   |

  # --- Visual / CSS scenarios (from Button.visual.test.tsx) ---

  @visual
  Scenario: Primary variant has purple background
    Given a Button is rendered with primary variant
    Then it should have a purple background with hover state and white text

  @visual
  Scenario: Primary variant has dark theme class
    Given a Button is rendered with primary variant
    Then it should have dark theme background variants

  @visual
  Scenario: Secondary variant has neutral background
    Given a Button is rendered with secondary variant
    Then it should have a neutral background with hover state and white text

  @visual
  Scenario: Danger variant has red background
    Given a Button is rendered with danger variant
    Then it should have a red background with hover state

  @visual
  Scenario: Small size has smaller padding
    Given a Button is rendered with sm size
    Then it should have small padding and text size

  @visual
  Scenario: Medium size has medium padding
    Given a Button is rendered with md size
    Then it should have medium padding

  @visual
  Scenario: Large size has larger padding
    Given a Button is rendered with lg size
    Then it should have large padding

  @visual
  Scenario: Button has focus ring classes
    Given a Button is rendered with default props
    Then it should have focus ring classes for accessibility

  @visual
  Scenario: Disabled state has opacity and cursor classes
    Given a Button is rendered in the disabled state
    Then it should have reduced opacity and not-allowed cursor

  @visual
  Scenario: Button has rounded-lg border radius
    Given a Button is rendered with default props
    Then it should have rounded-lg border radius

  @visual
  Scenario: Button has inline-flex layout with centered content
    Given a Button is rendered with default props
    Then it should have inline-flex layout with centered alignment

  @visual
  Scenario: Loading state shows spinner with animate-spin class
    Given a Button is rendered in the loading state
    Then it should contain a spinner element with animate-spin class
