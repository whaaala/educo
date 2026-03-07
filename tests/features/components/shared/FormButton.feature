Feature: FormButton component
  The FormButton is a styled button used within forms, supporting
  primary and secondary variants with gradient and outline styles.

  # --- Functional scenarios (from FormButton.test.tsx) ---

  Scenario: Renders children
    Given a FormButton with text content
    Then the text content should be visible

  Scenario: Calls onClick when clicked
    Given a FormButton with an onClick handler
    When the button is clicked
    Then the onClick handler should be called once

  Scenario: Defaults to type button
    Given a FormButton with no explicit type
    Then the button type should default to "button"

  Scenario: Supports type submit
    Given a FormButton with type "submit"
    Then the button type should be "submit"

  Scenario: Is disabled when disabled prop is true
    Given a FormButton with disabled prop
    Then the button should be disabled

  Scenario: Renders icon
    Given a FormButton with an icon prop
    Then the icon should be visible

  Scenario Outline: Renders with variant
    Given a FormButton with variant "<variant>"
    Then the button should render successfully

    Examples:
      | variant   |
      | primary   |
      | secondary |

  # --- Visual / CSS scenarios (from FormButton.visual.test.tsx) ---

  @visual
  Scenario: FormButton has rounded-xl and flex layout
    Given a FormButton is rendered with default props
    Then it should have rounded-xl border radius and centered flex layout

  @visual
  Scenario: FormButton has responsive padding
    Given a FormButton is rendered with default props
    Then it should have responsive horizontal padding

  @visual
  Scenario: FormButton has text-sm font-semibold
    Given a FormButton is rendered with default props
    Then it should have small semibold typography

  @visual
  Scenario: Primary variant has gradient background with theme colors
    Given a FormButton is rendered with primary variant
    Then it should have a blue-to-purple gradient with white text

  @visual
  Scenario: Primary variant has dark theme gradient
    Given a FormButton is rendered with primary variant
    Then it should have dark theme gradient variants

  @visual
  Scenario: Primary variant has midnight theme gradient
    Given a FormButton is rendered with primary variant
    Then it should have midnight theme gradient variant

  @visual
  Scenario: Secondary variant has border-2 outline style
    Given a FormButton is rendered with secondary variant
    Then it should have a 2px border with theme-responsive colors

  @visual
  Scenario: Secondary variant has theme text colors
    Given a FormButton is rendered with secondary variant
    Then it should have theme-responsive text colors

  @visual
  Scenario: Disabled FormButton has opacity-50 cursor-not-allowed
    Given a FormButton is rendered in the disabled state
    Then it should have reduced opacity and not-allowed cursor
