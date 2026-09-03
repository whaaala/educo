Feature: A block IS the box — clean selection, sizing and content position
  As a teacher building a school website
  I want each block to behave as its own box — nothing selectable or space-consuming wraps it,
  I can resize it from any edge, and its content positions predictably at any size
  So that the builder feels direct and precise, like a real design tool

  Background:
    Given the Box Builder is open with a freshly reset, empty page

  # ── 1. Row bands are invisible structure, never a "wrapper" ──
  Scenario: A row band is never selected
    Given a block is on the page
    When I click the block (or anywhere in its row)
    Then the block itself is selected, never the structural row band around it
    And the inspector never shows "Editing: Row" for a structural band

  Scenario: A row band adds no space around a block
    Given a single block in its own row
    Then the row band is exactly the size of the block — it adds no extra height, width or padding
    And removing/adding blocks never leaves empty row-band space on the page

  # ── 1b. A block IS exactly its content — no empty "wrapper" space ──
  Scenario: A Fit block hugs its content and leaves no empty box around it
    Given a short heading (Width = Fit) is on the page
    Then the block's box is exactly as wide as the heading text
    And there is no empty stretched space to the right of the text
    And the parent column never forces the hugging block to full width

  Scenario: Resizing a block sets its box to exactly the new size
    Given a block is on the page
    When I change its Width or Height
    Then the block occupies exactly that width/height — no more, no less

  Scenario: A floating block hugs its content by default
    Given a short heading is floated
    Then its floating box is the size of its content, not an arbitrary fraction of the page
    And it is never defaulted to a wide (e.g. 40%) empty box

  Scenario: Selecting or hovering a block never reveals an empty container wrapper
    Given a hugging block is on the page
    When I click the block (or hover near it)
    Then no full-width structural band or page outline appears around it
    And the only highlight is the block's own selection box (hugging its content)

  Scenario Outline: Moving a hugging block in the layout keeps it hugging
    Given a hugging "<block>" is on the page
    When I drag it to a new position in the layout (without floating it)
    Then it stays exactly as wide as its content — it never expands to the full page width
    And its Width stays "Fit"

    Examples:
      | block   |
      | heading |
      | button  |
      | badge   |
      | card    |

  # ── 1c. A resized block is ONE shape whose content re-centres ──
  Scenario Outline: Resizing a self-painting block grows one shape and re-centres its content
    Given a "<block>" on the page
    When I resize it larger
    Then the block itself grows to the new size (its visual fills the box)
    And there is no duplicate empty shape left behind at the old size
    And its content re-positions inside it (centred by default, or per Content position)

    Examples:
      | block  |
      | button |
      | card   |
      | badge  |
      | stat   |

  # ── 2. Resize works from EVERY edge, including the top ──
  Scenario Outline: Dragging any edge resizes the block
    Given a block is selected
    When I drag its "<edge>" edge outward
    Then the block grows in that direction
    And the OPPOSITE edge stays put

    Examples:
      | edge   |
      | top    |
      | bottom |
      | left   |
      | right  |

  Scenario: Dragging the top edge upward grows the block (does not collapse it)
    Given a block near the top of the canvas is selected
    When I drag its top edge upward by 90px
    Then the block's height increases by about 90px
    And it never snaps to a tiny minimum height

  # ── 3. Content positions predictably at any size ──
  Scenario Outline: Content position places the content inside a resized block
    Given a block has been made much taller than its content
    When I set Content position to "<position>"
    Then the block's content sits at that position inside the block, at every block size

    Examples:
      | position      |
      | top left      |
      | middle center |
      | bottom right  |

  Scenario: Content position applies to elements and components alike
    Then the Content position control is available for every non-container block
    And it works the same for a heading, a text, a button, a badge and a card
