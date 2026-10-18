Feature: Box Builder — images that describe themselves and hold their own shape
  As a school putting photographs on its website
  I want a picture to be described, to load sensibly, and to reserve its space before it arrives
  So that the page is readable to everyone and does not jump under the reader's eye as it loads
  Guards: tests/unit/image-a11y.test.ts · tests/unit/image-intrinsic.test.ts · tests/unit/pictures-keep-their-shape.test.ts · tests/unit/photo-gallery.test.ts

  Background:
    Given an Image block on a page in the Box Builder
    And whatever the canvas shows is exactly what the exported site shows

  # ── What the picture says (WCAG 1.1.1) ──
  Scenario: A photograph can describe itself
    When I type a description in "Describe this image"
    Then the exported <img> carries it as alt text
    And the description is escaped, because a person typed it
    And leaving it blank still produces alt="", which is correct for a purely decorative image

  # ── When the picture loads ──
  Scenario: Pictures wait their turn by default
    Then the exported <img> is loading="lazy" and decoding="async"
    And a page of twenty photographs does not fetch all twenty before the visitor has scrolled

  Scenario: A picture at the top of the page loads straight away
    When I tick "Load straight away"
    Then the exported <img> is loading="eager", so the top of the page is never briefly blank

  Scenario: An accordion item's thumbnail follows the same policy
    Given an accordion item with an image
    Then its thumbnail is loading="lazy" and decoding="async"
    And it still carries the alt text the user wrote

  Scenario: An alert message's thumbnail follows the same policy
    Given an alert message with an image
    Then its thumbnail is loading="lazy" and decoding="async"
    And it still carries the alt text the user wrote

  # ── What shape the picture is ──
  Scenario: The natural size is measured when the picture is added
    When I upload a photograph
    Then its natural pixel width and height are measured once and stored on the block
    And the picture and its measurements arrive together, so undo takes back one step, not two
    And replacing the photograph replaces the measurements — never leaves the previous one's behind

  Scenario: Measuring can fail without costing the user their picture
    When the browser cannot decode the file, or the decode never finishes
    Then the picture is still placed on the page
    And it simply keeps the fixed height it would have had before
    And a picture that decodes as 0 × 0, like an SVG with no size of its own, or a measurement with only one side,
      is never stored as a shape

  Scenario: A new Image block's shape is found from its photograph, by whichever route it arrives
    When I add an Image block from the palette and upload a photograph into it
    Then the block holds no stored pixel height, and the picture takes its photograph's own shape
    And a photograph dropped straight onto the canvas comes out the same shape
    And while the block has no picture yet it is a visible box, 16.25rem tall, to drop one into
    And "Fill" as a height fills the block

  Scenario: The space is reserved before the bytes arrive
    Given a photograph whose natural size is known
    Then the exported <img> carries width and height attributes
    And nothing below the picture moves when it finishes loading
    But a picture that has never been measured carries no attributes at all, rather than a guess

  Scenario: Showing the whole picture instead of cropping it
    Given a photograph whose natural size is known
    When I tick "Show the whole picture (don't crop it)"
    Then the block takes the photograph's own shape, held open by aspect-ratio
    And the same is true on the canvas and in the exported page

  Scenario: A height set by hand still crops, because that is a design choice
    When I type a height
    Then the picture is cropped to it with object-fit: cover
    And no aspect-ratio is emitted, because the fixed height would override it anyway

  Scenario: The control only appears when it can actually do something
    Given a photograph whose natural size is NOT known
    Then "Show the whole picture" is not offered
    # Offering it would be a control that silently does nothing: with no known shape, `height: auto`
    # and `object-fit: cover` give a box of no height at all, and the picture would vanish.

  # ── A photograph is stored at a size the browser can actually keep ────────
  # Measured: one 3000×2000 photograph off a phone is 1,260 KB as a data URL, and a browser gives the
  # saved site about 5MB — so the FIFTH upload filled the store, the save threw, and the failure was
  # swallowed. A gallery of a dozen photographs could not have existed.

  Scenario: An uploaded photograph is downscaled on the way in
    When I upload a photograph straight from a phone
    Then it is stored with its longest edge no greater than 1600 pixels
    And the picture on the page is the downscaled one, not the original

  Scenario: A picture that cannot be re-encoded is kept rather than lost
    Given a file the browser cannot decode or draw
    Then the original is stored unchanged
    # Losing a picture somebody chose is worse than storing a large one.

  Scenario: Re-encoding is kept only when it actually wins
    Given a small logo that would grow if it were re-encoded
    Then the original is stored instead

  Scenario: A save that fails is said out loud
    Given the browser's storage is full
    When an edit is made
    Then the editor says the page is no longer being saved
    And it names exporting as the way to keep the work
    # It used to be swallowed: the page went on looking fine and every edit since the last good save
    # was gone at the next reload.

  # ── A photograph is not rounded unless someone asked ──────────────────────

  Scenario: A picture with no radius set is square
    Then its corners are square on the canvas
    And they are square on the published page

  Scenario: A radius I set is the radius that gets published
    When I round a picture's corners
    Then the canvas and the published page show the same corners
    # They did not: the builder wrote 20px onto every photograph by hand while the export emitted the
    # node's own radius — canvas 20px, export 0px, with no control able to explain either.

  # ── Adding many photographs at once — the Photo gallery tile ──────────────

  Scenario: The palette says the word gallery
    When I open the Blocks panel
    Then there is a "Photo gallery" tile under Media

  Scenario: It asks before it adds anything
    When I click the Photo gallery tile
    Then a setup opens and nothing has been added to the page yet
    And dismissing it leaves the page exactly as it was

  Scenario: Dropping the tile asks the same question
    When I drag the Photo gallery tile onto the page
    Then the same setup opens where I dropped it
    # A drop says WHERE something goes, never WHAT it is.

  Scenario: Many photographs, one file dialog
    When I choose seven photographs at once
    Then all seven are shown as thumbnails before I commit
    And I can remove any of them before adding

  Scenario: The gallery that lands is an ordinary grid
    When I choose "4 across" and add the gallery
    Then I get one cell per photograph, each spanning three of the twelve
    And every column, spacing and row-height control still works on it
    And each cell is a box I can design, put a caption in, or nest another layout inside

  Scenario: Alt text starts from the file name
    Given a photograph named "sports day 1.jpg"
    Then its description starts as "sports day 1"
    # A starting point the user can improve, never a fabricated caption.

  Scenario: The gallery arrives with no spacing I did not choose
    Then the space between the photographs is exactly what the setup's slider showed

  Scenario: Photographs of different shapes can stagger
    When I choose "Follow the picture" in the setup
    Then the gallery arrives with row heights following each photograph

  Scenario Outline: Every gallery row adds up to the twelve
    When I choose "<across> across" for seven photographs
    Then every cell spans the same share of the twelve, one cell per photograph
    And each Image block carries its photograph, its measured shape and its description, at its own height, uncropped

    Examples:
      | across |
      | 2      |
      | 3      |
      | 4      |
      | 6      |

  Scenario: A count the twelve cannot share out is rounded to one it can
    When I choose "5 across"
    Then every cell's span divides the twelve exactly, rather than two cells coming out wider

  Scenario: The gallery arrives square and with no space, unless the setup asked
    When I add a gallery without choosing a gap
    Then it has no gap, no inner space, no masonry, and no rounded corners on its cells or its pictures

  Scenario: Two galleries never share an id
    When I add two galleries of the same photographs
    Then every block in one has a different id from every block in the other

  Scenario: A drop that skips the setup still lands a real grid
    When a Photo gallery arrives without the setup
    Then it is an empty grid, with nothing odd inside it

  Scenario: A photograph's remove ✕ can be found (D3-44)
    Given the setup's thumbnails
    Then a photograph's ✕ shows when I hover the photograph
    And on a touch screen, which has no hover, it is always shown

  # ── G-3d (2) · a picture fills a block that spans rows (the user, 2026-10-05; G3d-1: centred crop for now) ──
  Scenario: A picture fills the block that spans rows
    Given a block on a page-grid row two rows tall holding only a picture, beside two short blocks of words
    Then the picture fills the block's whole height, cropped from its centre, never stretched
    And the canvas and the Preview show the same at every screen where the row is side by side

  Scenario: The fill can be switched off
    Given that picture
    When I turn off "Fill the block's height" in the picture's settings
    Then the picture keeps its own height and the block below it is empty space
    And one Undo turns the fill back on
    And after a reload it is still off

  Scenario: The switch shows only where it does something
    Given a picture in a block that spans one row, or a picture beside words in a block that spans two
    Then its settings have no "Fill the block's height" switch, and the picture keeps its own height

  Scenario: Where the row steps to one a line, the picture keeps its own height
    Given a picture filling a block two rows tall
    When the row stacks on a phone
    Then the block spans one row and the picture is its own height again

  Scenario: A height I set on a filling picture is its least height
    Given a picture filling a block two rows tall, with a height of 15rem set by hand
    Then it fills the block but is never shorter than 15rem, and is 15rem wherever it does not fill

  Scenario: The fill follows each screen
    Given a picture filling a block two rows tall, whose block is one row tall on Mobile
    Then it fills on the desktop and not on a phone
    When I turn the fill off while editing Tablet portrait
    Then it does not fill on a tablet in portrait or on a phone, and still fills on the wider screens
    And on a page saved before the page grid the picture never fills

  # BATCH LE-2 · rule 16 · RULE AF — on 3G a page that jumps as each photo lands loses the reader's line
  Scenario: Every picture on every block keeps its shape while it loads
    Given every tile of the blocks panel, in every one of its styles, holding sample photographs wherever it can hold one
    When the page is published
    Then every picture and every video reserves its box before a byte arrives — its width and height, a proportion, or a set height
    And every photograph is cropped to its box, never squashed
    And a block added to the panel later is checked the day it appears
