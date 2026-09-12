Feature: FormTextarea component
  The FormTextarea is a styled multi-line text input component used in forms,
  supporting labels, placeholders, character counts, optional indicators,
  and validation errors.

  # --- Functional scenarios (from FormTextarea.test.tsx) ---

  Scenario: Renders with label
    Given a FormTextarea with a label
    Then the label should be visible

  Scenario: Renders textarea with value
    Given a FormTextarea with a pre-set value
    Then the value should be displayed in the textarea

  Scenario: Renders placeholder
    Given a FormTextarea with a placeholder
    Then the placeholder text should be visible

  Scenario: Calls onChange when user types
    Given a FormTextarea with an onChange handler
    When the user types in the textarea
    Then onChange should be called

  Scenario: Shows required asterisk
    Given a FormTextarea with the required prop
    Then a required asterisk should be visible

  Scenario: Shows optional label
    Given a FormTextarea with the optional prop
    Then the optional label should be visible

  Scenario: Shows error message
    Given a FormTextarea with an error prop
    Then the error message should be visible

  Scenario: Shows character count when enabled
    Given a FormTextarea with showCharacterCount and maxLength
    Then the character count should be displayed

  Scenario: Renders icon when provided
    Given a FormTextarea with an icon prop
    Then the icon should be visible

  # --- Visual / CSS scenarios (from FormTextarea.visual.test.tsx) ---

  @visual
  Scenario: Label has theme-responsive text colors
    Given a FormTextarea is rendered with default props
    Then the label should have theme-responsive text colors

  @visual
  Scenario: Label has text-sm font-medium
    Given a FormTextarea is rendered with default props
    Then the label should have small bold typography

  @visual
  Scenario: Container has theme backgrounds
    Given a FormTextarea is rendered with default props
    Then the container should have theme-responsive backgrounds

  @visual
  Scenario: Container has rounded-xl border
    Given a FormTextarea is rendered with default props
    Then the container should have rounded-xl border

  @visual
  Scenario: Textarea has transparent background
    Given a FormTextarea is rendered with default props
    Then the textarea should have a transparent background

  @visual
  Scenario: Textarea has theme text colors
    Given a FormTextarea is rendered with default props
    Then the textarea should have theme-responsive text colors

  @visual
  Scenario: Container has red border on error
    Given a FormTextarea is rendered with an error message
    Then the container should have a red border

  @visual
  Scenario: Optional label text is shown with styling
    Given a FormTextarea is rendered with the optional flag
    Then the optional indicator should have small muted styling
