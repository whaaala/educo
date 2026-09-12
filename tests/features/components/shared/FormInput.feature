Feature: FormInput component
  The FormInput is a styled text input component used in forms, supporting
  labels, placeholders, icons, validation errors, and various input types.

  # --- Functional scenarios (from FormInput.test.tsx) ---

  Scenario: Renders with label
    Given a FormInput with a label
    Then the label should be visible

  Scenario: Renders with value
    Given a FormInput with a pre-set value
    Then the value should be displayed in the input

  Scenario: Renders placeholder
    Given a FormInput with a placeholder
    Then the placeholder text should be visible

  Scenario: Calls onChange when user types
    Given a FormInput with an onChange handler
    When the user types in the input
    Then onChange should be called

  Scenario: Shows required asterisk when required
    Given a FormInput with the required prop
    Then a required asterisk should be visible

  Scenario: Renders with disabled state
    Given a FormInput with the disabled prop
    Then the input should be disabled

  Scenario: Shows error message when error prop is set
    Given a FormInput with an error prop
    Then the error message should be visible

  Scenario: Accepts helpText prop without crashing
    Given a FormInput with a helpText prop
    Then the component should render without crashing

  Scenario Outline: Renders input with various type variants
    Given a FormInput with type "<type>"
    Then the input should be rendered

    Examples:
      | type  |
      | text  |
      | email |
      | tel   |

  Scenario: Renders number input
    Given a FormInput with type "number" and min/max constraints
    Then the number input spinbutton should be rendered

  Scenario: Renders icon when provided
    Given a FormInput with an icon prop
    Then the icon should be visible

  # --- Visual / CSS scenarios (from FormInput.visual.test.tsx) ---

  @visual
  Scenario: Label has theme-responsive text colors
    Given a FormInput is rendered with default props
    Then the label should have theme-responsive text colors

  @visual
  Scenario: Label has text-sm font-medium
    Given a FormInput is rendered with default props
    Then the label should have small bold typography

  @visual
  Scenario: Required asterisk has red color
    Given a FormInput is rendered with required flag
    Then the asterisk should have red color with dark variant

  @visual
  Scenario: Input has theme-responsive backgrounds
    Given a FormInput is rendered with default props
    Then the input should have theme-responsive background colors

  @visual
  Scenario: Input has theme-responsive text colors
    Given a FormInput is rendered with default props
    Then the input should have theme-responsive text colors

  @visual
  Scenario: Input has rounded-xl border
    Given a FormInput is rendered with default props
    Then the input should have rounded-xl border radius with border

  @visual
  Scenario: Input has h-[46px] fixed height
    Given a FormInput is rendered with default props
    Then the input should have a fixed height

  @visual
  Scenario: Input has red border on error
    Given a FormInput is rendered with an error message
    Then the input should have a red border

  @visual
  Scenario: Input has normal border without error
    Given a FormInput is rendered without an error
    Then the input should have a gray border

  @visual
  Scenario: Disabled input has opacity-50
    Given a FormInput is rendered in the disabled state
    Then it should have reduced opacity and not-allowed cursor

  @visual
  Scenario: Icon background has theme colors
    Given a FormInput is rendered with default props
    Then the icon background should be present with opacity styling
