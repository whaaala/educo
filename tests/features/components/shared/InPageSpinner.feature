Feature: InPageSpinner component
  The InPageSpinner displays a loading spinner with customizable loading text
  and sub text, used as an in-page loading indicator.

  # --- Functional scenarios (from InPageSpinner.test.tsx) ---

  Scenario: Renders default loading text
    Given an InPageSpinner with default props
    Then the default loading text should be visible

  Scenario: Renders default sub text
    Given an InPageSpinner with default props
    Then the default sub text should be visible

  Scenario: Renders custom loading text
    Given an InPageSpinner with custom loadingText
    Then the custom loading text should be visible

  Scenario: Renders custom sub text
    Given an InPageSpinner with custom subText
    Then the custom sub text should be visible

  # --- Visual / CSS scenarios (from InPageSpinner.visual.test.tsx) ---

  @visual
  Scenario: Container has centered flex layout with min-height
    Given an InPageSpinner is rendered with default props
    Then it should have centered flex layout with a minimum height

  @visual
  Scenario: Container has fade-in animation
    Given an InPageSpinner is rendered with default props
    Then it should have fade-in animation classes

  @visual
  Scenario: Spinner has animated spin ring with theme colors
    Given an InPageSpinner is rendered with default props
    Then the spinner should have theme-responsive border-top colors

  @visual
  Scenario: Spinner has background ring with theme colors
    Given an InPageSpinner is rendered with default props
    Then the background ring should be present with dark theme variant

  @visual
  Scenario: Loading text has theme colors
    Given an InPageSpinner is rendered with loading text
    Then the loading text should have bold typography with theme colors

  @visual
  Scenario: Subtext has subdued colors
    Given an InPageSpinner is rendered with default props
    Then the subtext should have small muted typography
