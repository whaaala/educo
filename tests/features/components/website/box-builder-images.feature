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
