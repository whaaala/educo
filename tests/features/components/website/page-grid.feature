Feature: The page grid (AC-37b)
  An invisible set of columns runs across every new page: 12 from tablet width up, 6 on a phone, edge to edge.
  The space at the sides is the sections' own padding and the space between blocks is the blocks' own,
  so the whole page is the user's to use. Pages saved before the grid keep exactly the spacing they had.
  Plan: https://claude.ai/artifact/Q5rAsZNSJJBXrnBTJf9zBN · decisions: docs/TASK_TREE.md AC-37b

  # ── G-1 · the page grid in the engine ─────────────────────────────────────────────────────────────

  Scenario: A new page is a page-grid page
    Given I add a new page to my site
    Then the page is laid out on the page grid
    And every block I drop on it belongs to the page grid

  Scenario: A page saved before the grid is left alone
    Given a page I saved before the page grid existed
    When I open it and add a block
    Then its sections keep the side space and gaps they had
    And the new block on it takes the same spacing as its neighbours

  Scenario: A block pasted from an old page takes the new page's spacing
    Given I copy a section from a page saved before the page grid
    When I paste it onto a new page
    Then it takes the page grid's spacing

  Scenario Outline: Words never touch the edge, and the space stays small
    Given a new page with a hero, three cards, four stats and a footer
    When I preview it at <width> px wide
    Then no words sit closer than 1 rem to the page edge
    And two blocks side by side are at least 0.75 rem apart
    And the page never scrolls sideways

    Examples:
      | width |
      | 360   |
      | 375   |
      | 600   |
      | 768   |
      | 900   |
      | 1024  |
      | 1280  |
      | 1536  |
      | 1920  |

  Scenario: The defaults are shown and can be changed down to zero
    Given a block on a page-grid page
    When I open Spacing in the Inspector
    Then the side space and the gap read "Default" with the page grid's values
    And I can set any side to 0 and put it back to the default

  Scenario: Large text still lays out
    Given a new page previewed with the browser's text at 200 %
    Then rows re-split into equal columns without breaking a word
    And no words sit closer than 1 rem to the page edge

  Scenario Outline: Columns per screen
    Given the page grid's default settings
    Then a <screen> screen has <columns> columns

    Examples:
      | screen            | columns |
      | phone             | 6       |
      | tablet portrait   | 12      |
      | tablet landscape  | 12      |
      | desktop           | 12      |
      | wide              | 12      |

  Scenario: A share keeps its meaning on every screen
    Given a block that takes half of its row
    Then it spans 6 of 12 columns on a desktop and 3 of 6 on a phone
    And changing the grid to 10 columns makes it 5 of 10

  Scenario: Snapping to whole or half columns
    Given a block dragged to 41.3 % of its row
    Then it snaps to 5 of 12 columns
    And with half-lines it snaps to 5 of 12
    And a block dragged to 37.4 % snaps to 4½ of 12 with half-lines

  Scenario: One grid for the whole site, a page may opt out
    Given my site's page grid has 12 columns
    And one page uses its own grid of 16 columns
    Then that page has 16 columns and every other page has 12

  # ── G-2 · layout guides + the page-grid panel ─────────────────────────────────────────────────────

  Scenario Outline: The layout guides show the page grid's columns on every screen
    Given a new page open in the builder
    When I switch on "Layout guides" with <entry point>
    Then the canvas shows the page grid's column lines and middle lines
    And the side space is drawn as padding, edge to edge
    And the published page has no guides

    Examples:
      | entry point                     |
      | the toolbar switch              |
      | Shift G                         |
      | the canvas right-click menu     |

  Scenario Outline: The guides follow the screen being edited
    Given the layout guides are on
    When I edit the page at <screen>
    Then the guides show <columns> columns

    Examples:
      | screen  | columns |
      | Mobile  | 6       |
      | Tablet  | 12      |
      | Laptop  | 12      |
      | Desktop | 12      |
      | Wide    | 12      |

  Scenario: Rows are drawn with the columns
    Given the layout guides are on
    Then the canvas shows row lines across the whole page as well as the columns
    And each section is still as tall as its words and pictures need
    When I untick "Row lines in the guides"
    Then only the columns are drawn, and that choice is remembered

  Scenario: The guides are off by default and remembered
    Given a builder I have never switched the guides on in
    Then the canvas looks as it did before the page grid
    When I switch the guides on and reload the page
    Then the guides are still on
    And Shift G while typing in a text field types a capital G instead

  Scenario: The selected block says how many columns it takes
    Given the layout guides are on and a block half the width of its row is selected
    Then a label on it reads "6 of 12" on a desktop
    And it reads "3 of 6" on Mobile

  Scenario: Changing the page grid moves every block with it, in one undo
    Given the page-grid panel is open
    When I set the columns to 10
    Then the guides show 10 columns and the half-width block reads "5 of 10"
    When I press Undo once
    Then the grid is back to 12 columns

  Scenario: Side space and the gap between blocks are the site's to change
    Given the page-grid panel is open
    When I set the side space to 0
    Then words in a section start at the page edge in the canvas and in the Preview
    And Reset to default puts the side space back to the page grid's default

  Scenario: A page may use its own grid
    Given my site's page grid has 12 columns
    When I switch on "This page uses its own grid" and set it to 16 columns
    Then this page's guides show 16 columns and every other page's show 12

  Scenario: The panel is reachable by keyboard and screen reader
    Given the page-grid panel is open
    Then every field has a visible label and can be changed with the keyboard
    And Escape closes the panel and returns focus to the "Layout guides" switch

  # ── G-3 · placing on columns and rows ─────────────────────────────────────────────────────────────

  Scenario: The columns run edge to edge, and the side space is the outer blocks' own
    Given a row of three cards on a page-grid page and the layout guides on
    Then the guides draw 12 columns from one page edge to the other
    And the default margin is drawn inside the first and last columns
    When I set the first card's left outer spacing to 0
    Then it reaches the page edge and the right side keeps its space
    And "Back to default" puts the space back

  Scenario Outline: A dragged edge snaps to the page grid
    Given two blocks side by side on a page-grid page at Desktop
    When I drag the edge between them to about 41 % <holding>
    Then the left block takes <result> and the far edge does not move
    And a label beside the edge says how many columns it takes, here and on a phone

    Examples:
      | holding       | result          |
      | nothing       | 5 of 12         |
      | Shift         | 4½ of 12        |
      | Alt           | 5 of 12, free   |

  Scenario: Columns by number and by keyboard, per screen
    Given a block half the width of its row is selected
    When I set "Columns" to 7 at Desktop
    Then it takes 7 of 12 and the block beside it gives one column
    When I press Alt and the left arrow at Mobile
    Then it takes one column fewer on the phone only, and a screen reader hears how many

  Scenario: A block a number of rows tall
    Given a short block on a page-grid page
    When I set "Rows" to 3
    Then it is at least three row lines tall
    And it still grows when its words need more room

  Scenario: Line up with the grid
    Given a page whose blocks were dragged to widths between the lines
    When I choose "Line up with the grid" in Page settings
    Then every block moves to the nearest whole column and I am told how many moved
    And a block I placed free with Alt keeps its place inside its columns
    And one Undo puts them all back

  # ── G-3b · the page as a real CSS grid ────────────────────────────────────────────────────────────

  Scenario Outline: A row of the page sits ON the page grid's lines
    Given a row of <blocks> on a page-grid page and the layout guides on
    When I look at it on <screen>
    Then the space between every two blocks is centred on a drawn line
    And the first block's side space lies inside the first column and the last block's inside the last
    And the canvas and the Preview put every block in the same place

    Examples:
      | blocks                  | screen  |
      | two halves              | Desktop |
      | three thirds            | Laptop  |
      | four quarters           | Tablet  |
      | 5 of 12 and 7 of 12     | Mobile  |
      | five equal cards        | Wide    |

  Scenario: Five equal cards stay equal
    Given five cards side by side on a 12-column page
    Then all five are the same width, to the pixel

  Scenario: A snapped edge lands on the line
    Given two blocks side by side on a page-grid page at Desktop
    When I drag the edge between them to the fifth line
    Then the space between them is centred on the fifth drawn line

  Scenario: A row that does not fit steps down to equal lines, whatever it holds
    Given a row of a picture and a block of words, side by side
    When the screen is too narrow for the words beside the picture
    Then the row steps to one a line, and no word is broken and nothing scrolls sideways
    And each block that starts a line keeps the side space at the page edge

  Scenario: A page saved before the page grid is published exactly as before
    Given a page saved before the page grid
    When I publish it
    Then its HTML is byte for byte what it was

  Scenario: Space between columns and space between rows, each its own
    Given a page-grid page with a row of three cards and a stack of blocks
    When I set "Space between columns" to 2.5 rem in the page-grid panel
    Then the cards move apart and the blocks of the stack do not
    When I set "Space between rows" to 0
    Then the blocks of the stack touch and the cards stay apart
    And "Back to default" on either puts that one back and leaves the other
    And the Preview shows the same at every screen

  Scenario: From line and to line, per screen
    Given two blocks side by side on a page-grid page at Desktop
    When I set the first block's "To line" to 9
    Then its right edge moves to line 9 and the block beside it gives what it takes, never below one column
    When I set the second block's "From line" to 10
    Then only its left edge moves, and the first block grows to meet it
    And at Mobile nothing changed until I set it there

  Scenario: To the last line survives a change of columns
    Given a block that ends its line short of the page's end
    When I choose "To the last line"
    Then it reaches the last line
    When I change the page grid from 12 columns to 16
    Then it still reaches the last line

  Scenario Outline: Full width and bleed
    Given a picture beside a block of words on a page-grid page
    When I choose <choice> for the picture
    Then <result>
    And the Preview shows the same at every screen, with nothing scrolling sideways

    Examples:
      | choice        | result                                                                           |
      | Whole line    | the picture takes its whole line and the words go to the next                    |
      | Bleed right   | the picture reaches the page's right edge and the words do not move              |
      | Bleed both    | with Whole line, the picture runs from one page edge to the other                 |
      | Bleed left    | nothing changes while the picture does not start its line                        |

  # ── G-3b (3) · free placement is lines plus a margin, never page x / y ──────────────────────────

  Scenario Outline: An Alt-dragged edge lands free, inside the nearest lines
    Given two blocks side by side on a page-grid page at Desktop
    When I hold Alt and drag the first block's <edge> edge to between two lines
    Then its box edge stops where I let go
    And its columns run to the nearest line <beyond> it, and the rest is a margin inside those columns
    And the label says how many columns it takes, "free"
    And the block beside it is not overlapped at any screen, and nothing scrolls sideways

    Examples:
      | edge  | beyond          |
      | right | to the right of |
      | left  | to the left of  |

  Scenario: A snapped drag puts a free edge back on its line
    Given a block whose right edge was placed free with Alt
    When I drag that edge without Alt
    Then the edge lands on a line and its free margin on that side is gone

  Scenario: Alt-dragging a block of a page row slides it along its line
    Given a narrow block with room beside it on its line of a page-grid page
    When I hold Alt and drag the block sideways
    Then it stays in the flow, on its line, and is not lifted into a floating layer
    And it covers the nearest lines around where I let go, the rest a margin inside them
    And it never goes past the block beside it, which does not move
    And Alt-dragging a block that is not on a page row still lifts it into a floating layer

  Scenario: A free placement is shown and can be changed in the panel
    Given a block placed free with Alt
    Then its Size section says how far it sits inside its columns on the left and on the right
    When I change one of those numbers, or choose "Back on the lines"
    Then the block moves to match, on this screen only, and one Undo puts it back

  Scenario: A free placement keeps to its columns on every screen
    Given a block placed free with Alt at Desktop
    When I look at it at Tablet, Mobile and in the Preview at every screen
    Then it sits inside the same columns, by the same share of them
    And where the row steps down to fewer blocks a line, the free margin is dropped and the blocks are equal

  # ── G-3b (6) · a block of a page row spans rows (the user: a gallery photo two rows tall) ──────────

  Scenario: A photo two rows tall beside two short blocks
    Given a photo and two short blocks of words on a row of a page-grid page, each half the page wide
    When I set the photo's "Rows tall" to 2 in its Size section
    Then the photo covers two rows, and the two blocks of words sit one above the other beside it
    And every block keeps the page grid's side space and one gap between neighbours
    And the photo still grows when the words beside it need more room
    And the Preview shows the same at every screen where the row is side by side

  Scenario: Where the row steps down to fewer blocks a line, a block spans one row again
    Given a photo two rows tall beside two short blocks
    When the screen is too narrow for them side by side (a phone)
    Then the blocks stack one a line, the photo no taller than its own content
    And nothing overlaps and nothing scrolls sideways

  Scenario: Rows tall is per screen, can be undone, and is named once
    Given a photo two rows tall
    When I set "Rows tall" back to 1 at Tablet only
    Then at Tablet it spans one row, and at Desktop still two
    And one Undo puts it back
    And a screen reader hears "Rows tall" for the span and "At least this many rows tall" for the height, never two controls with one name

  # ── G-3d · the user's three phone decisions (2026-10-05 / 2026-10-06) ──────────────────────────────

  Scenario Outline: On a phone no block of a row is narrower than ten letters' room (D3-31)
    Given <row> on a row of a page-grid page, built through the blocks panel
    When I look at it in the Preview on a <width> px phone
    Then <result>
    And nothing scrolls sideways and no word is broken, at 100, 150 and 200 % text

    Examples:
      | row                                     | width | result                                        |
      | a paragraph beside a photo 40 % wide    | 375   | the photo goes under the paragraph            |
      | an article beside a sidebar 30 % wide   | 375   | the sidebar goes under the article            |
      | four Stats, a quarter each              | 360   | they stay two across                          |
      | a strip of six logos                    | 360   | they go two across, in three lines            |
      | two halves                              | 340   | they stack, each the whole line               |

  Scenario: The floor never moves a row on a tablet or a desktop
    Given a strip of six logos on a row of a page-grid page
    When I look at it at 600 px and wider
    Then the floor does not step it (only its words can)

  Scenario: The floor leaves pages saved before the page grid alone
    Given a page saved before the page grid with a paragraph beside a photo
    When I publish it
    Then its HTML is byte for byte what it was

  Scenario: On a phone a block alone on its line takes the whole line (G-3b's decision)
    Given a block set to half the page at Desktop, alone on its row of a page-grid page
    When I look at it on a phone
    Then it takes the whole line, with the page's side space at both edges
    And at Tablet and Desktop it is still half the page

  Scenario: A width set on the phone itself still wins there (G3b-11)
    Given a block alone on its row of a page-grid page
    When I set its Columns to 3 of 6 at Mobile
    Then on the phone it is half the line
    And one Undo gives the whole line back
