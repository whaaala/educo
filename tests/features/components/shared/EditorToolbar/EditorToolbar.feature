Feature: Shared Editor Toolbar Components
  As a developer building document and presentation editors
  I want shared toolbar components for visual and functional parity
  So that toolbars look and behave identically across all editors

  # ──────────────────────────────────────────────────
  # ToolbarButton
  # ──────────────────────────────────────────────────

  Scenario: ToolbarButton renders with icon and tooltip
    Given a ToolbarButton with title "Bold (Ctrl+B)" and a Bold icon
    When the button renders
    Then the icon should be visible inside the button
    And hovering should show a tooltip with "Bold (Ctrl+B)"

  Scenario: ToolbarButton active state shows blue highlight
    Given a ToolbarButton with active: true
    When the button renders
    Then it should have a blue background highlight
    And the icon should appear in blue color

  Scenario: ToolbarButton disabled state prevents interaction
    Given a ToolbarButton with disabled: true
    When the user clicks the button
    Then the onClick handler should not fire
    And the button should appear with reduced opacity

  # ──────────────────────────────────────────────────
  # ToolbarDivider
  # ──────────────────────────────────────────────────

  Scenario: ToolbarDivider renders as a vertical line
    Given a ToolbarDivider component
    When it renders
    Then a 1px wide vertical line should appear
    And it should be 20px tall with gray color

  # ──────────────────────────────────────────────────
  # ToolbarDropdown
  # ──────────────────────────────────────────────────

  Scenario: ToolbarDropdown opens panel on click
    Given a ToolbarDropdown with label "Font" and children content
    When the user clicks the dropdown button
    Then the dropdown panel should appear below the button
    And the panel should have glassmorphism styling

  Scenario: ToolbarDropdown closes on outside click
    Given a ToolbarDropdown is open
    When the user clicks outside the dropdown
    Then the dropdown should close

  Scenario: ToolbarDropdown respects alignment prop
    Given a ToolbarDropdown with align: "right"
    When the dropdown opens
    Then the panel should be right-aligned to the button
