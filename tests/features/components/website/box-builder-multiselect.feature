Feature: Box Builder — marquee multi-select + bulk edits
  As a website designer using the Box Builder (/website/box-demo)
  I want to select several sections at once and change them together
  So that I can align a whole group's size, spacing and look in one action instead of editing each

  Background:
    Given the Box Builder canvas with several sections
    And a single click selects one section (its toolbar + resize handles appear)

  # ── Selecting many ──────────────────────────────────────────────────────────
  Scenario: Marquee-drag selects every fully-enclosed section
    When I press on empty canvas (or a section's empty body) and drag a rectangle
    Then a dashed rubber-band rectangle follows the pointer
    And on release every box FULLY ENCLOSED by the rectangle is selected
    And structural row bands and the page root are never selected

  Scenario: The marquee keeps only the outermost of a nested pair
    Given a section that contains child blocks
    When my marquee encloses both the section and its children
    Then only the outermost section is selected (not its inner blocks)
    But a tight marquee that only encloses the inner blocks selects those blocks instead

  Scenario: A plain click still selects just one
    When I click a section without dragging
    Then only that section is selected and its toolbar returns

  Scenario: Multi-selected sections show a selection outline but no per-box toolbar
    Given two or more sections selected
    Then each is outlined
    And no per-box ⋯ toolbar is shown — the right panel becomes the bulk editor

  # ── Editing many at once ────────────────────────────────────────────────────
  Scenario: The bulk panel reports the selection and applies to all
    Given three sections selected
    Then the inspector shows "3 sections selected"
    And any change I make there is applied to all three at once

  Scenario Outline: Quick steppers grow/shrink the whole group
    Given several sections selected
    When I press the <control> stepper
    Then every selected section's <property> changes by one step together

    Examples:
      | control            | property |
      | Increase width     | width    |
      | Decrease width     | width    |
      | Increase height    | height   |
      | Decrease height    | height   |

  Scenario Outline: Shared properties apply to every selected section
    Given several sections selected
    When I set <property> in the bulk panel
    Then <property> is set identically on all selected sections

    Examples:
      | property     |
      | margin       |
      | padding      |
      | background   |
      | corner radius|
      | opacity      |
      | align        |

  Scenario: Bulk actions act on the whole selection
    Given several sections selected
    When I choose Float, Duplicate or Delete in the bulk panel (or press Delete / Ctrl+D)
    Then the action is applied to every selected section at once

  # ── Undo / responsive / accessible ──────────────────────────────────────────
  Scenario: A bulk edit is a single undo step
    Given a bulk change was applied to several sections
    When I press Ctrl+Z
    Then all of them revert together in one undo

  Scenario: Bulk editing is keyboard + screen-reader accessible
    Then the steppers and actions have aria labels and are reachable by keyboard
