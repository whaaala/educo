Feature: Tooltip component
  A hover-triggered tooltip that displays content near a trigger element,
  with support for delay, block display mode, and portal rendering.

  # ── Functional ──────────────────────────────────────────────

  Scenario: Renders children
    Given a Tooltip is rendered wrapping a button "Hover me"
    When the component renders
    Then the child button "Hover me" should be visible

  Scenario: Does not show tooltip content initially
    Given a Tooltip is rendered without any user interaction
    When the component renders
    Then the tooltip content "Help text" should not be visible

  Scenario: Shows tooltip on mouse enter after delay
    Given a Tooltip is rendered with zero delay
    When the user hovers over the trigger element
    Then the trigger element should still be in the document

  # ── Visual / CSS ────────────────────────────────────────────

  @visual
  Scenario: Tooltip trigger has relative inline-block positioning by default
    Given a Tooltip is rendered with default props
    Then the trigger wrapper has "relative" class
    And the trigger wrapper has "inline-block" class

  @visual
  Scenario: Tooltip trigger has relative block positioning when block prop is true
    Given a Tooltip is rendered with block prop enabled
    Then the trigger wrapper has "relative" class
    And the trigger wrapper has "block" class
