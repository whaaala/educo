Feature: Space by default — words never touch an edge
  As a teacher building a page
  I want every section, block and coloured box to arrive with sensible space around it
  So that my words never sit against an edge, and I only touch spacing when I want something different

  # DRAFT 2026-09-29 — written while the tier-99 sweep runs; nothing here is built yet.
  # The VALUES (the named defaults below) and the saved-pages scenario wait on the user's decisions.
  # Every default comes from the spacing tokens, in rem with a fluid term, from ONE emitter for canvas and export.

  Background:
    Given the website builder is open on an empty page
    And the blocks panel is open

  # ── The side gutter ──

  Scenario Outline: Words in a new section stay off the page edge at <screen>
    When I drag a Heading onto the page
    And I look at the page at <screen>
    Then the heading's words are at least the default gutter from the left edge of the page
    And at least the default gutter from the right edge of the page
    And the page does not scroll sideways

    Examples:
      | screen           |
      | Phone 360        |
      | Mobile 375       |
      | Tablet 768       |
      | Laptop 1024      |
      | Desktop 1280     |
      | Wide 1920        |
      | Full width       |

  Scenario: A section's colour runs edge to edge while its words keep the gutter
    Given a section with a background colour
    When I drag a Text block into it
    Then the colour reaches both edges of the page
    And the words are at least the default gutter from each edge
    Because only pictures and backgrounds bleed; words never do

  Scenario: A picture set edge to edge still bleeds
    Given a section holding an Image set to edge to edge
    Then the picture reaches both edges of the page
    And a Text block beside it in the same section keeps the gutter

  Scenario: A section inside a section does not get the gutter twice
    Given a section inside a column inside a section
    When I drag a Text block into the inner section
    Then the words are one default gutter from the page edge, not two

  Scenario Outline: The logo and the menu at the top of the page keep the gutter at <screen>
    Given a header holding a logo on the left and a menu of four links on the right
    When I look at the page at <screen>
    Then the logo is at least the default gutter from the left edge of the page
    And the last link is at least the default gutter from the right edge of the page
    And the logo and the links are at least the default inner padding from the top and the bottom of the header
    And each link is the default column gap from the link beside it
    Because a header's logo and links are content; reported by the user from the sweep's own screenshots, 2026-09-29

    Examples:
      | screen       |
      | Phone 360    |
      | Mobile 375   |
      | Tablet 768   |
      | Laptop 1024  |
      | Desktop 1280 |
      | Wide 1920    |

  # ── Every element, every component, everything added to a layout ──

  Scenario: Every block in the palette can be given inner and outer spacing
    Given the list of every block in the blocks panel and every component in the catalogue
    When I add each one to the page and select it
    Then the inspector offers inner spacing for it, all sides at once and each side alone
    And the inspector offers outer spacing for it, all sides at once and each side alone
    And what I set is what the canvas draws and what the Preview publishes
    Because the list is enumerated, a block added later is covered the day it appears

  Scenario: The size a spacing control shows is the size the block has
    Given a block whose spacing I have never touched
    When I select it, alone or with other blocks
    Then every spacing control shows the space the block is drawn with
    And never a size the block does not have

  # ── Space around sections ──

  Scenario: Two sections are not stacked tight
    When I build two sections, one under the other, each with a Heading
    Then there is at least the default section space between the words of the first and the words of the second
    And the first section has the default space above its first block
    And the last section has the default space under its last block

  # ── Gaps between blocks ──

  Scenario: Blocks in a stack have a gap between them
    When I drag a Heading, a Text block and a Button into one stack
    Then each block is the default stack gap from the one above it

  Scenario: Columns in a row have a gap, and still fit their line
    When I build a row of three columns with a Text block in each
    Then each column is the default column gap from its neighbour
    And the three columns are on one line at Desktop 1280
    And the widths and the gaps on the line add up to the line
    Because the gap is a share of the line and one sum with the widths; a default must never push a column down

  Scenario: Cells in a grid have a gap across and down
    When I build a grid of three across and two down with a Card in each cell
    Then the cells are the default column gap apart across
    And the default stack gap apart down

  # ── Inner padding of a box that can be seen ──

  Scenario Outline: A box with <surface> keeps its words off its own edge
    Given a column holding a Text block
    When I give the column <surface>
    Then the words are at least the default inner padding from every edge of the column

    Examples:
      | surface             |
      | a background colour |
      | a background image  |
      | a border            |
      | a colour scheme     |

  Scenario: A box with nothing to see gets no inner padding
    Given a column with no background and no border, holding a Text block
    Then the column adds no padding of its own
    Because padding there would only move the words off the line the blocks above and below them sit on

  # ── Always overridable, down to zero ──

  Scenario Outline: I can take a default away, and it stays away
    Given a new section with a Heading in it
    When I set its <spacing> to 0 in the inspector
    Then the <spacing> is 0 on the canvas and in the Preview
    And it is still 0 after I reload the page
    And it is still 0 at every screen size

    Examples:
      | spacing                 |
      | side gutter             |
      | space above             |
      | space below             |
      | gap                     |
      | inner padding           |

  Scenario: I can change one side and leave the others at their default
    Given a column with a background colour
    When I set its inner spacing on the left to a larger size
    Then the left is the size I set
    And the top, right and bottom are still the default inner padding

  Scenario: A spacing control says when it is showing the default
    Given a new section
    Then each spacing control in the inspector reads "Default" with the size beside it
    When I change one and then choose "Back to default"
    Then it reads "Default" again
    And the control has a label a screen reader announces, and works from the keyboard

  Scenario: Undo takes an override back
    Given I have set a section's side gutter to 0
    When I press Ctrl+Z
    Then the section has the default gutter again

  # ── The same in the editor and on the published page ──

  Scenario Outline: The default space is the same on the canvas and in the Preview at <screen>
    Given a page with a header, a coloured section of three columns and a footer, all at their defaults
    When I compare the canvas and the Preview at <screen>
    Then every gutter, section space, gap and inner padding is the same in both

    Examples:
      | screen       |
      | Mobile 375   |
      | Tablet 768   |
      | Laptop 1024  |
      | Desktop 1280 |
      | Wide 1920    |

  Scenario: The published space is not written in pixels
    Given a page built at its defaults
    When I read the published CSS
    Then every default space is in rem with a fluid term, or a share of its line
    And no default space is a pixel length

  Scenario: Larger browser text makes the space larger
    Given a page built at its defaults
    When the reader's browser text size is 150%
    Then the gutter, the section space, the gaps and the inner padding are all larger than at 100%
    And the page still does not scroll sideways at Phone 360

  # ── Pages that already exist (THE USER'S DECISION — recommended: they keep their spacing) ──

  Scenario: A page saved before this change looks the same after it
    Given a page saved before space by default existed
    When I open it
    Then every block is where it was, with the spacing it had
    And a block I add to it now arrives with the defaults

  # ── Measured on every page ──

  Scenario: The Page check finds words too close to an edge
    Given a section whose side gutter I have set to 0, holding a Text block
    When the Page check runs
    Then it reports the words as closer to the page edge than the gutter floor, as a warning
    Because I chose it; the check says so and does not stop me

  Scenario: The sweep's audit measures both on every page at every size
    Given a dressed page built through the UI at its defaults
    When the page audit runs in the Preview at every screen size
    Then it reports no words closer than the gutter floor to the page edge or to the edge of the coloured box they sit in
    And no two sections closer than the section-space floor
