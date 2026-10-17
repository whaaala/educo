Feature: The page uses its space (BATCH F-1)
  The whole page uses its width and height where it makes sense — sections, rows and components — unless the space was
  chosen by the person building it (the user, 2026-10-01). Measured by the page audit's W19 on every swept page.

  Scenario: A component dropped on the page fills its line
    Given an empty page in the website builder
    When I drop an Accordion onto the page
    Then the Accordion is as wide as the page's content at every screen size, in the editor and in the Preview
    And an Alert, a Card and a Quote do the same
    But a Stat, a Badge and a Rating hug what they hold

  Scenario: A component I sized keeps my size
    Given an Accordion on the page
    When I drag its right edge in
    Then it keeps the width I dragged at every screen size, after a reload, in the editor and in the Preview

  Scenario: Columns nobody sized take what is left of their line
    Given a row of two columns I dropped side by side and never resized
    When the screen is too narrow for both to keep their share
    Then each column fills the line it wraps onto, with no empty space beside it

  Scenario: A space I opened at the end of a line stays
    Given a row of two columns
    When I drag the outer edge of the last column inward
    Then a space opens at that edge and stays there
    And the other column does not grow into it

  # L-8 (BATCH LE-2): the same rule down a column
  Scenario: A space I open at the bottom of a column stays
    Given a Stack holding three pictures, one under another
    When I drag the last picture's bottom edge up
    Then the picture gets shorter, cropped, by what I dragged
    And a space of that size opens below it, at the edge I dragged, and the Stack keeps its height
    And the space is still there after a reload and in the Preview
    When I drag the same edge back down
    Then the space closes first and the picture is its old height again

  Scenario: A picture between two others gives up its height to the one below
    Given a Stack holding three pictures
    When I drag the first picture's bottom edge up
    Then the picture below grows by what it gave up and no space opens between them

  Scenario: Links on a phone sit closer so the line fits
    Given a line of four links in a pager or a menu
    When the page is shown on a phone
    Then the links are 1rem apart and fit on one line
    And on a tablet, a laptop and a desktop they are 2rem apart
    And a space I set between them is kept on every screen

  Scenario: The sweep's audit reports space nobody chose
    Given a page built through the editor
    When the page audit runs in the Preview at every screen size
    Then it reports a line that wrapped with room left beside a block, a component narrower than its line, a coloured
      column shorter than its row, and a window left empty under a short page
    And it reports nothing for space I chose — a width I dragged, a height, a margin, an alignment
