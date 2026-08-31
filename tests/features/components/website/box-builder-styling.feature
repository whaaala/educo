Feature: Box Builder — styling primitives (border, shadow, typography, corners, rotation)
  As a website designer using the Box Builder
  I want full per-block styling controls
  So that any block can look exactly how a real website needs — bordered, elevated, rounded, and typeset

  Background:
    Given a selected block in the Box Builder inspector

  Scenario: Border with width, style and colour
    When I set a border width, pick solid/dashed/dotted, and choose a colour
    Then the block renders that border

  Scenario: Drop shadow presets
    When I choose a shadow elevation (sm / md / lg / xl) — or none
    Then the block gets that elevation (or no shadow)

  Scenario: Per-corner radius on top of the all-corners radius
    Given an all-corners radius is set
    When I override a single corner (TL / TR / BR / BL)
    Then only that corner uses the override and the rest keep the all-corners value
    And a rounded (or clipped) block hides its overflow

  Scenario: Rotate a block
    When I set a rotation angle
    Then the block is visually rotated without affecting the flow of its siblings

  Scenario Outline: Real per-element typography
    Given a text, heading or button element
    When I set its <property>
    Then the rendered text reflects <property>

    Examples:
      | property        |
      | font family     |
      | font weight     |
      | line height     |
      | letter spacing  |
      | italic          |
      | underline       |
      | text transform  |

  Scenario: Grid cell span
    Given a block inside a grid container
    Then the inspector exposes Column span and Row span
    And those controls are hidden when the block is not inside a grid

  Scenario: Bulk styling reflects the selection and applies to all
    Given several sections selected
    Then the bulk panel's sliders show the first selection's values (not blank defaults)
    And changing border, shadow, radius, opacity, margin or padding applies to every selected section

  Scenario: Every styling control works in all themes and is keyboard/screen-reader accessible
    Then each control has an aria label, sensible ranges, and correct contrast in light / dark / midnight / purple
