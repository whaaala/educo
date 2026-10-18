Feature: Where am I — the selected block's parents, shown and clickable (ED-2, BATCH LE-10)

  A block three levels deep is hard to place: the canvas shows one outline, and the only way out was Escape,
  one level at a time. The Inspector names the blocks around the selection, outermost first, and any of them
  is one click (or one tap, or Enter) away — the breadcrumb Webflow puts under its canvas (5 of 6 builders).
  Research: docs/web-anatomy/layout-tiers/baseline-webflow-wix.md (ED-2) · docs/web-anatomy/components.md (Breadcrumb).
  The trail IS `selectionChain` — the same blocks Escape steps out through — so the two can never disagree.
  The words are config/inspector.json `trail` (RULE CFG). The full layers tree is BATCH LE-14 / L-20.
  Guards: tests/unit/selection-trail.test.ts · tests/components/website/BoxInspector.test.tsx (LE-10) · HEADED: scripts/uat/uat-le10-headed.js

  Background:
    Given the website builder is open on an empty page

  Scenario: A block inside other blocks names them, outermost first
    Given a Stack holding a Side by side holding a Heading, built from the blocks panel
    When I select the Heading
    Then the Inspector reads "Editing: Stack › Side by side › Heading"
    And the Heading is marked as where I am
    And the page itself and the structural row bands are never in the trail

  Scenario: Clicking a block in the trail selects it
    Given the Heading inside the Side by side inside the Stack is selected
    When I click "Stack" in the trail
    Then the Stack is selected on the canvas
    And the Inspector shows the Stack's own controls, reading "Editing: Stack"

  Scenario: The trail and Escape go through the same blocks
    Given the Heading inside the Side by side inside the Stack is selected
    When I press Escape
    Then the block selected is the last one the trail named before the Heading

  Scenario: A block at the top of the page has no trail
    Given a Heading added straight to the page
    When I select it
    Then the Inspector reads "Editing: Heading" and shows no trail

  Scenario: The trail by keyboard
    Given the Heading inside the Side by side inside the Stack is selected
    When I Tab to "Side by side" in the trail and press Enter
    Then the Side by side is selected
    And the keyboard focus is on its name in the Inspector, so the next Tab carries on from there

  Scenario Outline: On every screen and in every editor theme
    Given the editor at <width> in the <theme> theme
    When the Heading inside the Side by side inside the Stack is selected
    Then the trail is shown, readable (at least 4.5 : 1), wrapped onto a second line rather than cut off
    And a finger-sized target on a touch screen
    And tapping "Stack" selects the Stack

    Examples:
      | width | theme    |
      | 375   | light    |
      | 768   | dark     |
      | 1280  | midnight |
      | 1536  | purple   |

  Scenario: In the phone and tablet app
    Given the Educo app's website builder on a tablet, then on a phone
    When I select the Heading inside the Side by side inside the Stack
    Then the trail names Stack and Side by side
    And tapping "Stack" selects the Stack
