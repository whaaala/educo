Feature: FormBadge component
  The FormBadge displays a label with an icon and a badge value,
  supporting required indicators, error states, and placeholder text.

  # --- Functional scenarios (from FormBadge.test.tsx) ---

  Scenario: Renders label text
    Given the FormBadge is rendered with a label, icon, and value
    Then the label text should be in the document

  Scenario: Renders value text when badgeColorClasses are provided
    Given the FormBadge is rendered with badgeColorClasses
    Then the value text should be in the document

  Scenario: Renders placeholder when value is set but no badgeColorClasses
    Given the FormBadge is rendered with a value but without badgeColorClasses
    Then the placeholder text should be shown instead of the value

  Scenario: Renders placeholder when value is empty
    Given the FormBadge is rendered with an empty value and a placeholder
    Then the placeholder text should be in the document

  Scenario: Shows required asterisk
    Given the FormBadge is rendered with required set to true
    Then the required asterisk should be in the document

  Scenario: Shows error message
    Given the FormBadge is rendered with an error message
    Then the error message should be in the document

  Scenario: Renders icon
    Given the FormBadge is rendered with a custom icon
    Then the icon should be in the document

  # --- Visual / CSS scenarios (from FormBadge.visual.test.tsx) ---

  @visual
  Scenario: Label has theme text colors
    Given a FormBadge is rendered with a label and icon
    Then the label should have theme-responsive text colors

  @visual
  Scenario: Label is text-sm font-medium
    Given a FormBadge is rendered with a label and icon
    Then the label should have small bold typography

  @visual
  Scenario: Badge container has theme backgrounds
    Given a FormBadge is rendered with a label and icon
    Then the container should have theme-responsive backgrounds

  @visual
  Scenario: Badge container has rounded-xl border
    Given a FormBadge is rendered with a label and icon
    Then the container should have rounded-xl border

  @visual
  Scenario: Placeholder shows with italic style when no value is set
    Given a FormBadge is rendered with no value and a placeholder
    Then the placeholder should have italic style with muted color

  @visual
  Scenario: Badge has red border on error
    Given a FormBadge is rendered with an error message
    Then the container should have a red border
