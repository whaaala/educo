Feature: Change a container's kind and keep what is in it (RC-7, BATCH LE-14)

  A Stack that should have been a Side by side, or a Grid, used to mean building it again. The leader, the WordPress
  editor's Transform (Group → Row → Stack → Grid), changes the kind and keeps every block; so do Figma, Framer and
  Webflow on the same frame. Research: docs/web-anatomy/layout-tiers/baseline-le14-editing.md (RC-7) — design D6,
  signed by the user 2026-10-18. The words are config/inspector.json `kind` (RULE CFG).
  Guards: tests/unit/container-kind.test.ts · tests/components/website/BoxInspector.test.tsx (LE-14) · HEADED: scripts/uat/uat-le14-headed.js

  Background:
    Given the website builder is open on an empty page

  Scenario Outline: A container becomes another kind, its blocks kept in their order
    Given a <from> holding three Headings, built from the blocks panel
    When I select it and choose "<to>" under Kind in the Inspector
    Then it is a <to>, holding the same three Headings in the same order
    And it is one undo step: Ctrl+Z gives back the <from>

    Examples:
      | from         | to           |
      | Stack        | Side by side |
      | Stack        | Grid         |
      | Side by side | Stack        |
      | Side by side | Grid         |
      | Grid         | Stack        |
      | Grid         | Side by side |

  Scenario: A Stack becomes a Side by side whose blocks share the line
    Given a Stack holding two Stacks
    When I change it to a Side by side
    Then the two sit side by side, each half the line, not one full-width band beside another

  Scenario: A Side by side becomes a Grid with a column for each block
    Given a Side by side holding three blocks
    When I change it to a Grid
    Then the Grid has three columns, one block in each

  Scenario: What does not carry over is said
    Given a Grid whose first block spans two columns
    When I change it to a Stack
    Then a short message says the column spans were left behind
    And the message is read out to a screen reader

  Scenario: The kind is chosen with the keyboard
    Given a Stack selected
    When I Tab to Kind and press the right arrow to "Side by side"
    Then it is a Side by side and the focus stays on Kind
