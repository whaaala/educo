Feature: Box Builder — marquee multi-select + bulk edits
  As a website designer using the Box Builder (/website/box-demo)
  I want to select several sections at once and change them together
  So that I can align a whole group's size, spacing and look in one action instead of editing each
  Guards: tests/components/website/BulkInspector.test.tsx · tests/unit/multi-select.test.ts (ED-13, BATCH LE-14) · HEADED: scripts/uat/uat-le14-headed.js

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
    Then the inspector shows "3 blocks selected"
    Because a Heading and a Text are blocks, not sections (the S-1 pass, 2026-09-30)
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

  Scenario: The bulk panel's controls are named in plain words
    Given several sections selected
    Then the bulk panel offers "Outer spacing", "Inner spacing", "Rounded corners" and "See-through"
    And setting each one sets the margin, the padding, the corner radius or the opacity of every selected section

  # ── ED-13 (BATCH LE-14; design D2 signed 2026-10-18 — Figma, Wix Studio) ──────────────────────────────
  Scenario: Shift-click adds a block to the selection, or takes it out
    Given a Heading selected
    When I Shift-click another Heading beside it
    Then both are selected and the bulk panel says "2 blocks selected"
    And Shift-clicking one of them again takes only that one out

  Scenario: Shift-click picks the block at the level of the selection
    Given two Headings inside a Stack that they fill, the first one selected
    When I Shift-click the second
    Then the second Heading is added, not the Stack round them

  Scenario: A field the blocks differ in reads Mixed
    Given two blocks selected, one with rounded corners and one without
    Then the bulk panel's Rounded corners reads "Mixed", not the first block's value
    And a field they share shows its value

  Scenario: The arrows move every selected block together
    Given two blocks next to each other selected, one under the other
    When I press the down arrow
    Then both move one place down together, in their order
    And nothing moves when one of them is already at the end

  Scenario: Group the selection into one unit
    Given three sections selected where grouping is possible
    When I press "Group these 3"
    Then the three are combined into one unit
    But where grouping is not possible, no Group action is shown

  # ── Undo / responsive / accessible ──────────────────────────────────────────
  Scenario: A bulk edit is a single undo step
    Given a bulk change was applied to several sections
    When I press Ctrl+Z
    Then all of them revert together in one undo

  Scenario: Bulk editing is keyboard + screen-reader accessible
    Then the steppers and actions have aria labels and are reachable by keyboard
