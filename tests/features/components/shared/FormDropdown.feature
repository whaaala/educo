Feature: FormDropdown component
  The FormDropdown is a custom dropdown/select component used in forms,
  supporting options, placeholder text, required indicators, and error states.

  # --- Functional scenarios (from FormDropdown.test.tsx) ---

  Scenario: Renders with label
    Given a FormDropdown with a label
    Then the label should be visible

  Scenario: Shows placeholder when no value selected
    Given a FormDropdown with no value and a placeholder
    Then the placeholder text should be visible

  Scenario: Displays the selected option label
    Given a FormDropdown with a pre-selected value
    Then the selected option label should be visible

  Scenario: Opens dropdown on click and shows options
    Given a FormDropdown with no value selected
    When the dropdown trigger is clicked
    Then all options should be visible

  Scenario: Calls onChange when an option is selected
    Given a FormDropdown with an onChange handler
    When the dropdown is opened and an option is selected
    Then onChange should be called with the selected value

  Scenario: Shows required asterisk when required
    Given a FormDropdown with the required prop
    Then a required asterisk should be visible

  Scenario: Shows error message
    Given a FormDropdown with an error prop
    Then the error message should be visible

  Scenario: Renders icon when provided
    Given a FormDropdown with an icon prop
    Then the icon should be visible

  # --- Visual / CSS scenarios (from FormDropdown.visual.test.tsx) ---

  @visual
  Scenario: Label has theme-responsive text colors
    Given a FormDropdown is rendered with default props
    Then the label should have theme-responsive text colors

  @visual
  Scenario: Label has text-sm font-medium
    Given a FormDropdown is rendered with default props
    Then the label should have small bold typography

  @visual
  Scenario: Dropdown button has theme backgrounds
    Given a FormDropdown is rendered with default props
    Then the dropdown button should have theme-responsive backgrounds

  @visual
  Scenario: Dropdown button has rounded-xl
    Given a FormDropdown is rendered with default props
    Then the dropdown button should have rounded-xl border radius

  @visual
  Scenario: Dropdown button has min-h-[46px]
    Given a FormDropdown is rendered with default props
    Then the dropdown button should have a minimum height

  @visual
  Scenario: Dropdown button has red border on error
    Given a FormDropdown is rendered with an error message
    Then the button should have a red border

  @visual
  Scenario: Dropdown has opacity-50 cursor-not-allowed when disabled
    Given a FormDropdown is rendered in the disabled state
    Then it should have reduced opacity and not-allowed cursor

  @visual
  Scenario: Required dropdown shows red asterisk
    Given a FormDropdown is rendered with required flag
    Then it should display a red asterisk
