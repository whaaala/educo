Feature: Space by default — words never touch an edge
  As a teacher building a page
  I want every section, block and coloured box to arrive with sensible space around it
  So that my words never sit against an edge, and I only touch spacing when I want something different

  # BUILT 2026-09-30 (batch S-1, docs/TASK_TREE.md). The user's values: side gutter 2rem (≈22px on a 360px phone, fluid) ·
  # section space 1rem above and below · header/footer bar 1rem · stack gap 1rem · column and grid gap 1rem · inner
  # padding 1.5rem in a box with a visible edge, 0 in a plain box · saved pages keep their spacing. The controls show
  # real rem. Columns side by side keep a 1rem GUTTER across and 1rem down (S1-a): each gives up one gap from its share.
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

  Scenario Outline: Columns side by side on the page keep a 1rem gap and still fit their line at <screen>
    When I drop three Stacks beside each other on the page, each with a background colour and a Text block
    And I look at the page at <screen>
    Then the coloured columns are 1rem apart and never touch
    And all three are on one line
    And the first column starts at the left edge of the page and the last ends at the right edge
    Because the gap is a gutter: each column gives up one gap from its share, so a full line of shares still fits
      (the user, 2026-09-30: "add a gap, the widths shrink so the line still fits — 1rem")

    Examples:
      | screen       |
      | Laptop 1024  |
      | Desktop 1280 |
      | Wide 1920    |

  Scenario Outline: Columns that wrap or stack keep a 1rem gap down as well at <screen>
    Given four coloured columns side by side on the page
    When I look at the page at <screen>
    Then the columns on one line are 1rem apart from the columns on the next
    Because coloured columns never touch in any direction (the user, 2026-09-30: "1rem down too")

    Examples:
      | screen     |
      | Mobile 375 |
      | Tablet 768 |

  Scenario: Wrapping one column never resizes the others
    Given three columns side by side on the page
    When I drag the right edge of the first column until the last one wraps to the next line
    Then the columns left on the first line keep the width I dragged them to
    And when I drag the edge back, all three return to one line at the widths they had

  Scenario: Resizing a column with the gap still moves only the edge I hold
    Given three columns side by side on the page
    When I drag the boundary between the first and the second to the right
    Then the edge I hold follows the pointer
    And the left edge of the first column and the right edge of the third do not move
    And the gap between the columns stays 1rem

  Scenario: A page saved before the gap keeps its columns touching
    Given a page saved before columns had a gap, with two columns side by side
    When I open it
    Then the columns sit exactly where they were
    And a column I add beside them now arrives in a band of its own with the gap

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

  Scenario Outline: A spacing control shows the real size in rem for <space>
    Given a new <block> at its defaults
    When I select it
    Then its <space> control reads "Default · <size>"
    And <size> is the size in real rem, 16px to the rem, never the stored number divided by 10
    Because a control said "3.2rem" for a 2rem gutter (S1-b, the user 2026-09-30: "real rem")

    Examples:
      | block                     | space                   | size   |
      | section on the page       | side inner spacing      | 2rem   |
      | section on the page       | top inner spacing       | 1rem   |
      | header on the page        | top inner spacing       | 1rem   |
      | stack                     | space between blocks    | 1rem   |
      | row of columns            | space across            | 1rem   |
      | grid                      | space across            | 1rem   |
      | box with a background     | inner spacing           | 1.5rem |
      | plain box                 | inner spacing           | 0rem   |

  Scenario Outline: The top of a <region> is 1rem, not a tall strip
    Given a <region> on the page at its defaults
    Then its words are 1rem below its top edge and 1rem above its bottom edge, on the canvas and in the Preview
    Because 4rem was too far from the top (the user, 2026-09-30: "1rem")

    Examples:
      | region  |
      | section |
      | header  |
      | footer  |

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

  # ── Blocks that paint their own box (S-2 (5), decided by the user 2026-09-30) ──

  Scenario: Components and buttons placed one under another on the page never touch
    Given an empty page
    When I drag a Card, a Button, a Quote and an Alert onto the page, one under another
    Then each has 1rem above and below it, OUTSIDE its coloured box
    And each keeps the page gutter at both sides, and a Card that fills the line still ends inside the page
    And the selection outline sits on the coloured box, not around the space

  Scenario: Two coloured sections still meet
    Given two Stacks with a background, one under the other, straight on the page
    Then they meet edge to edge — a section paints no box of its own

  Scenario: Inside a Stack, the Stack's gap spaces them — never twice
    Given a Stack on the page holding a Card, a Button, a Quote and an Alert
    Then they are spaced by the Stack's gap only

  Scenario: In a row of columns, the band's gutter spaces them across
    Given a Button beside a Card in a row on the page
    Then each has 1rem above and below, and the columns' gutter between them

  Scenario: Outer spacing shows the space and takes it back to 0
    Given a Card straight on the page, selected
    Then Spacing → Outer spacing reads "Default · 2rem" with 1rem top and bottom and 2rem at the sides
    And Inner spacing is the Card's own padding, which is drawn
    When I set Outer spacing to 0
    Then the Card touches the block above and below on the canvas and in the Preview, and still does after a reload
    When I press "Back to default"
    Then the 1rem comes back

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
