Feature: Group and ungroup — several blocks wrapped in one, in place (ED-12, BATCH LE-14)

  Grouping is how a person says "these belong together" so they can be moved, styled or made a card as one.
  The leaders (Figma Ctrl+G, the WordPress editor's Group) wrap the blocks WHERE THEY ARE: nothing moves on the
  screen, the reading order stays, and the group adds nothing of its own. Ours used to lift them out of their
  section into a group floating over the page (LE14-2 … LE14-6, reproduced through the UI 2026-10-18).
  Research: docs/web-anatomy/layout-tiers/baseline-le14-editing.md (ED-12) — design D1, signed by the user 2026-10-18.
  The words are config/inspector.json `group` (RULE CFG).
  Guards: tests/unit/group-in-place.test.ts · tests/components/website/BulkInspector.test.tsx (LE-14) · HEADED: scripts/uat/uat-le14-headed.js

  Background:
    Given the website builder is open on an empty page

  Scenario: Ctrl+G wraps the blocks where they are
    Given a Heading, a Heading and a Text on the page, one after another
    When I select the two Headings and press Ctrl+G
    Then one group holds the two Headings, in their order, where the first one was
    And the page still reads Heading · Heading · Text
    And nothing on the canvas moves, and the group does not float

  Scenario: The group adds no space and keeps each block's own size
    Given two blocks selected, each with its own width
    When I group them
    Then the group has no gap, no padding, no margin and no background
    And each block keeps the width it had
    And the group is as tall as what it holds, never a fixed height

  Scenario: Blocks side by side are grouped side by side
    Given three blocks side by side on one line, each a share of it
    When I group the first two
    Then the group sits on that line in their place, as wide as their two shares together
    And the two blocks show at the same place and size as before

  Scenario: Ungroup puts everything back where it was
    Given a group made from blocks in a section
    When I select the group and press Ctrl+Shift+G
    Then its blocks are back in the section, at the group's place, in their order
    And each has the width it had before it was grouped
    And grouping then ungrouping gives back the page I started with

  Scenario: Group and ungroup are each one undo step
    Given two blocks I grouped
    When I press Ctrl+Z
    Then the two blocks are back as they were, ungrouped, in one step
    And Ctrl+Y groups them again

  Scenario: Blocks in different places cannot be grouped, and the builder says why
    Given a block in one section and a block in another section selected
    Then "Group" is shown but cannot be pressed, and it says the blocks must be side by side or one under the other in the same place
    And Ctrl+G does nothing

  Scenario: A group made before this change still ungroups
    Given a page saved with a group floating over the page
    When I select it and press Ctrl+Shift+G
    Then its blocks return to the page's flow where the group was

  Scenario: The group publishes as the canvas shows it
    Given two Headings grouped on the page
    When I open the Preview at every width
    Then the Headings sit where the canvas shows them, in reading order, with no space added
