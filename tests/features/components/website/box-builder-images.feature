Feature: Box Builder — images that describe themselves and hold their own shape
  As a school putting photographs on its website
  I want a picture to be described, to load sensibly, and to reserve its space before it arrives
  So that the page is readable to everyone and does not jump under the reader's eye as it loads

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
