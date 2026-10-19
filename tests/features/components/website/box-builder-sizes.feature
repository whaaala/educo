Feature: Sizes and grids — a shape, limits, cards that fit, spacing on the scale (BATCH LE-12)
  A video box, a square portrait, a 2:1 band keep their shape on every screen (SZ-4, AC-34).
  A form or a quote is never wider than it should be, a sidebar stays between two widths (SZ-3, AC-30 bounded).
  A grid of cards puts as many across as fit at a smallest card width (GR-2, AC-33).
  The spacing sliders move on the spacing scale, the way the canvas handles do (SP-4).
  Guards: tests/unit/sizes.test.ts · HEADED: scripts/uat/uat-le12-headed.js

  Scenario: a block keeps a chosen proportion
    Given a Stack holding a heading
    When I pick the 16:9 shape under Size → Proportion
    Then the Stack is its width × 9 / 16 tall on every screen
    And a paragraph too long for that box makes the box taller instead of being cut
    When I pick Free
    Then the Stack is as tall as its content again

  Scenario: a proportion and a height are one decision
    Given a block with a Height of 20rem
    When I pick the 1:1 shape
    Then the Height is cleared and the block is square
    When I type a Height of 10rem
    Then the proportion is cleared

  Scenario: a custom proportion, and one per screen
    Given an Image
    When I pick Custom and type 5 : 2
    Then the Image is two and a half times as wide as it is tall
    When I edit the Mobile screen and pick 1:1
    Then the Image is square on a phone and 5 : 2 on a desktop

  Scenario: a largest and a smallest width
    Given a text block
    When I set its Max width to 40rem
    Then it is never wider than 40rem, and on a phone it is the line's width
    When I set its Min width to 20rem
    Then on a 320 phone it is the full line, never wider than the screen

  Scenario: a sidebar between two widths on a row of the page
    Given two blocks side by side on a page
    When I set the first block's Min width to 12rem and its Max width to 18rem
    Then wherever the two sit side by side the first block is between 12rem and 18rem
    And the second block takes the rest of the row

  Scenario: a largest height never cuts words
    Given a Full screen section
    When I set its Max height to 40rem
    Then on a tall screen it is 40rem tall
    And on a phone with more words than fit it grows to hold them

  Scenario: a Grid column between two widths
    Given a Grid block of three columns
    When I set Column widths: column 1 "Between" 12rem and 18rem
    Then column 1 is between 12rem and 18rem where the Grid shows all its columns

  Scenario: as many cards across as fit
    Given a Grid block of six cards
    When I set Columns to "As many as fit", each at least 16rem
    Then the row holds as many cards as fit at 16rem on every screen, all equal, filling the row
    And on a 320 phone the cards are one a line
    And the cell controls that cannot apply are not offered
    When I set Columns back to a number
    Then the cards take their spans again

  Scenario: as many as fit, but never more than I say (LE15b-6)
    Given a Grid of six cards set to "As many as fit", each at least 16rem
    When I set "At most across" to 3
    Then on a wide screen the cards are three across, two rows, all equal, filling the row
    And where three do not fit at 16rem it still puts fewer across, down to one a line on a phone
    When I set it at the tablet upright and phone screens to 2
    Then a grid of four is two by two there, and four across from the tablet held sideways up
    And left empty, it puts as many across as fit, as every grid saved before it did
    And the canvas and the Preview show the same at every width

  Scenario: the spacing sliders step on the scale
    Given a block with no spacing
    When I press the right arrow on its Inner spacing slider three times
    Then its inner spacing is 0.75rem, one step of the spacing scale at a time
    And a value typed into a side field is kept as typed
