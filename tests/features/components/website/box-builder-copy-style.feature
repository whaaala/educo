Feature: Copy a block's style and paste it onto others (ED-3b, BATCH LE-14)

  Making ten cards look alike should be one copy and a paste, not ten rounds of the same settings. The leader,
  Figma's Copy / Paste properties (Ctrl+Alt+C / Ctrl+Alt+V), takes the look and leaves the content; the WordPress
  editor's Copy / Paste styles does the same. Research: docs/web-anatomy/layout-tiers/baseline-le14-editing.md (ED-3b)
  — design D4, signed by the user 2026-10-18. What counts as the look, and the words, are config/inspector.json `style`.
  Guards: tests/unit/copy-style.test.ts · HEADED: scripts/uat/uat-le14-headed.js

  Background:
    Given the website builder is open on an empty page

  Scenario: Copy the look of one block, paste it onto another
    Given a Stack with a background, rounded corners, a border and inner spacing, and a plain Stack
    When I select the first, press Ctrl+Alt+C, select the second and press Ctrl+Alt+V
    Then the second has the same background, corners, border and inner spacing
    And its blocks, its words and its size are its own, unchanged

  Scenario: The look of the words comes too, where there are words
    Given a Heading in a set font, size and colour, and a Text
    When I copy the Heading's style and paste it onto the Text
    Then the Text takes that font, size and colour, and keeps its own words

  Scenario: Only what the block can use is pasted
    Given a Stack with a gap between its blocks, and a Heading
    When I copy the Stack's style and paste it onto the Heading
    Then the Heading takes the background and the corners, and no gap is written to it

  Scenario: Pasted on one screen, only that screen changes
    Given I am editing the phone screen
    When I paste a style onto a block
    Then the phone shows the new look and the desktop keeps its own

  Scenario: Paste onto several blocks at once, in one undo step
    Given three blocks selected
    When I press Ctrl+Alt+V
    Then all three take the copied look, and one Ctrl+Z takes it off all three

  Scenario: Copy style and Paste style are in the block's menu too
    When I open a block's ⋮ menu
    Then it offers "Copy style" (Ctrl+Alt+C) and "Paste style" (Ctrl+Alt+V)
    And "Paste style" cannot be pressed until a style has been copied
