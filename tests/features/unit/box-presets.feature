Feature: The ready-made looks and the fresh blocks the palette hands out
  Every block the Blocks panel adds is built fresh, and every block kind that has looks offers them as presets
  that follow the site's theme. A Grid's shape is structure, not a look, so it has no presets of its own.
  Components: tests/features/components/website/editable-components.feature · Grid shapes: box-builder-columns.feature.
  Guards: tests/unit/box-presets.test.ts

  Scenario: Every main kind of block has looks to choose from
    Given a site in its default theme
    Then a button, a heading, a text, a divider, a picture, a video, an icon and a Stack each offer at least one look
    And the "Outline" button look has a border in the theme's main colour
    And a kind of block the builder does not know offers no looks at all

  Scenario: A Grid wears the looks of a Stack, and its shape is changed elsewhere
    Given a Grid on the page
    Then the looks it offers are the Stack's looks
    And it has no looks of its own that could change how many columns it has
    Because a look that re-cut the columns would leave every block pointing at columns that no longer exist

  Scenario Outline: A tile adds a fresh block of its kind
    When I add a "<tile>"
    Then I get <block>

    Examples:
      | tile         | block                                   |
      | Stack        | a box that lays blocks one under another |
      | Side by side | a box that lays blocks in a row          |
      | Grid         | a box laid out as a grid                 |
      | Spacer       | an empty space 3rem tall, never in px    |

  Scenario: A look chosen when adding is applied to the new block
    When I add a button with a look that rounds its corners and fills it with a colour
    Then the new button has those round corners and that fill

  Scenario: Composite blocks arrive as trees of editable blocks, coloured from the theme
    When I add a Card, a Quote, a Stat, a Badge or a Rating
    Then a Card holds a picture, a heading, a text and a button, in that order
    And a Quote holds two texts, a Stat a heading and a text, and a Rating five star icons
    And a Badge is a padded, rounded box holding one text with words in it
    And none of them carries a colour written as a hex code
    But an Accordion stays one component whose items are edited on the canvas

  Scenario: A Grid added with no shape chosen is one undivided cell
    When a Grid is added without a shape being picked
    Then it has exactly one cell, spanning all twelve columns

  Scenario: Every uneven shape fills the twelve columns, with fresh cells each time
    When I pick "Sidebar left"
    Then I get a cell of four columns and a cell of eight
    And picking it a second time gives new cells, never the same ones twice
    And every shape offered adds up to exactly twelve columns
    And a shape the builder does not offer gives nothing
