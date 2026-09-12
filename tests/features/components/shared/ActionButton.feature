Feature: ActionButton component
  The ActionButton is a versatile button component supporting multiple variants,
  sizes, and colors with gradient styling.

  # --- Functional scenarios (from ActionButton.test.tsx) ---

  Scenario: Renders children text
    Given the ActionButton is rendered with children text "Export"
    Then the button with name "Export" should be in the document

  Scenario: Renders label prop as alias for children
    Given the ActionButton is rendered with a label prop "Download"
    Then the text "Download" should be in the document

  Scenario: Calls onClick when clicked
    Given the user event handler is set up
    And an onClick handler is provided
    When the user clicks the button
    Then onClick should have been called once

  Scenario: Is disabled when disabled prop is true
    Given the ActionButton is rendered with disabled prop
    Then the button should be disabled

  Scenario: Defaults to type button
    Given the ActionButton is rendered without an explicit type
    Then the button should have type "button"

  Scenario Outline: Renders with variant without crashing
    Given the ActionButton is rendered with variant "<variant>"
    Then the button should be in the document

    Examples:
      | variant   |
      | primary   |
      | secondary |
      | outline   |
      | ghost     |
      | danger    |

  Scenario Outline: Renders with size without crashing
    Given the ActionButton is rendered with size "<size>"
    Then the button should be in the document

    Examples:
      | size |
      | sm   |
      | md   |
      | lg   |

  Scenario Outline: Renders with color without crashing
    Given the ActionButton is rendered with color "<color>"
    Then the button should be in the document

    Examples:
      | color   |
      | blue    |
      | emerald |
      | purple  |
      | amber   |
      | red     |
      | gray    |

  # --- Visual / CSS scenarios (from ActionButton.visual.test.tsx) ---

  @visual
  Scenario: ActionButton has inline-flex font-medium layout
    Given an ActionButton is rendered with default props
    Then it should have inline-flex layout classes
    And it should have font-medium typography
    And it should have a pointer cursor

  @visual
  Scenario: ActionButton has disabled styles
    Given an ActionButton is rendered in the disabled state
    Then it should have reduced opacity when disabled
    And it should show a not-allowed cursor when disabled

  @visual
  Scenario: ActionButton blue primary variant has blue gradient
    Given an ActionButton is rendered with blue color and primary variant
    Then it should have a blue-to-indigo gradient background
    And it should have white text

  @visual
  Scenario: ActionButton blue secondary variant has blue-50 gradient background
    Given an ActionButton is rendered with blue color and secondary variant
    Then it should have a light blue gradient background
    And it should have blue text with dark mode variant

  @visual
  Scenario: ActionButton sm size has correct padding and typography
    Given an ActionButton is rendered with sm size
    Then it should have small padding and text size
    And it should have rounded-lg border radius

  @visual
  Scenario: ActionButton md size has correct padding and border radius
    Given an ActionButton is rendered with md size
    Then it should have medium padding
    And it should have rounded-xl border radius

  @visual
  Scenario: ActionButton lg size has correct padding and typography
    Given an ActionButton is rendered with lg size
    Then it should have large padding and text size

  @visual
  Scenario: ActionButton danger variant has red gradient
    Given an ActionButton is rendered with the danger variant
    Then it should have a red-to-rose gradient background
    And it should have white text
