Feature: Blocks that flow inside a section
  A section of a section-built site can hold extra blocks — a heading, a text, a button or a picture — that flow
  one under another. Each can be added, aligned, moved up or down and deleted; a visitor sees them without any
  of the editing controls.
  Guards: tests/components/website/SectionBlocks.test.tsx

  Scenario: The Add menu offers the four kinds of block
    Given an empty section being edited
    Then I can add a Heading block, a Text block, a Button block or an Image block

  Scenario: Adding a text block
    Given an empty section being edited
    When I press "Add Text block"
    Then the section holds one block, a text

  Scenario: Blocks are shown one under another, and one can be deleted
    Given a section holding a heading "My heading" and a text "My text"
    Then "My heading" is shown
    And both blocks sit in one column flow, neither positioned on top of the page, so they cannot overlap
    When I press "Delete block" on the heading
    Then the section holds only "My text"

  Scenario: Aligning a block steps it from left to centre
    Given a section holding a heading aligned left
    When I press its Align button
    Then the heading is centred

  Scenario: A block moves down or up with a button, not only by dragging
    Given a section holding the texts "first" and "second", in that order
    When I press "Move block down" on "first"
    Then "second" comes first
    When I press "Move block up" on "second"
    Then "second" comes first
    And the first block cannot move up and the last cannot move down

  Scenario: A visitor sees the blocks and none of the controls
    Given a section holding a text "Read only text" that is only shown
    Then "Read only text" is shown and there is no Add menu
    And a shown section with no blocks adds nothing to the page

  Scenario: Every new block is its own, with sensible defaults
    When I add one block of each kind
    Then each has its own id
    And a new button already has a link
