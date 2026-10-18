Feature: The layers tree — every block of the page, in order, to pick, name, hide, lock and move (ED-2b, BATCH LE-14)

  A page five levels deep cannot be read from the canvas alone: a block under another, a hidden one, an empty one,
  cannot be clicked. The leaders (the WordPress editor's List View, Webflow's Navigator, Figma's layers) list the page
  as a tree: selecting there selects on the canvas, rows are dragged to reorder or to move into another block, and
  each row is renamed, hidden and locked. Built to the WAI-ARIA tree view pattern (docs/web-anatomy/components.md).
  Research: docs/web-anatomy/layout-tiers/baseline-le14-editing.md (ED-2b) — design D3, signed by the user 2026-10-18.
  The words are config/inspector.json `layers` (RULE CFG). Row bands are never shown: they are the builder's, not yours.
  Guards: tests/unit/layers.test.ts · tests/components/website/LayersPanel.test.tsx · HEADED: scripts/uat/uat-le14-headed.js

  Background:
    Given the website builder is open with a Stack holding a Heading and a Text, and a Button below it

  Scenario: The tree lists the page in reading order, nested as it is built
    When I open the left panel's Layers
    Then it shows Stack, inside it Heading and Text, then Button
    And no row band appears

  Scenario: Selecting in the tree selects on the canvas, and the other way round
    When I click "Text" in the tree
    Then the Text is selected on the canvas and scrolled into view
    And when I click the Button on the canvas, the Button's row is the selected one in the tree

  Scenario: The tree is used with the keyboard
    Given the focus on the tree
    Then the down and up arrows move between rows, Home and End go to the first and last
    And the right arrow opens a closed block or goes into it, the left arrow closes it or goes to its parent
    And Enter selects the row's block, and F2 renames it

  Scenario: A row is renamed, and the name is shown in the tree and the Inspector
    When I rename the Stack "Welcome"
    Then the tree and the Inspector's trail call it "Welcome"
    And the published page is unchanged

  Scenario: A row hides its block on this screen, and locks it
    When I press the row's Hide on the phone screen
    Then the block is hidden on the phone only, and the row says so
    And when I press its Lock, the block can no longer be moved or resized on the canvas

  Scenario Outline: A row is dragged to a new place
    When I drag "<row>" <where> "<target>"
    Then the page reads <order>

    Examples:
      | row    | where       | target  | order                                  |
      | Button | above       | Stack   | Button · Stack ( Heading · Text )      |
      | Text   | above       | Heading | Stack ( Text · Heading ) · Button      |
      | Button | into        | Stack   | Stack ( Heading · Text · Button )      |

  Scenario: A row's menu has the canvas's actions
    When I open a row's ⋮ menu
    Then it offers Duplicate, Move up, Move down and Delete, and each does what it says on the canvas

  Scenario: A block is never moved into itself
    When I drag "Stack" into "Heading"
    Then nothing moves
