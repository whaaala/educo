Feature: Fonts that write the region's languages (BATCH A-1b, RULE AF)
  A school writes in Yoruba, Igbo, Hausa, Twi, Ga and Ewe as well as English. A font that lacks ẹ ọ ṣ ị ụ ɓ ɗ ƙ ɛ ɔ ŋ draws
  those letters in a different font in the middle of a word. The builder says which fonts write which languages, starts
  a new site with a pair that writes them all, and warns when a page's words use letters their font lacks.
  Which languages each font writes is MEASURED, in lib/educo-ui/font-coverage.json (scripts/uat/a1-font-coverage.js).
  Guards: tests/unit/font-coverage.test.ts · tests/unit/site-fonts.test.ts

  Background:
    Given the box builder is open

  # (1) the pair is the site's
  Scenario: A new site starts with a pair that writes every region language
    Given a site that has never been saved
    Then its headings are in Montserrat and its words in Inter
    And "Ẹ kú àárọ̀ — Ụlọ akwụkwọ — Ɓarka — Ɛyɛ" is drawn in those fonts on the canvas, the Preview and the download

  Scenario: A site saved before keeps its fonts
    Given a site saved before sites stored their own fonts
    Then its headings are still in Poppins and its words in DM Sans, after a reload and after an edit and Undo

  Scenario: A new site's pair survives a save and a load
    Given a new site in Montserrat and Inter
    When it is saved and loaded again
    Then its headings are still in Montserrat and its words in Inter

  # (2) the picker says which languages
  Scenario Outline: Every font in a picker says which languages it writes
    When I open the <picker> font picker
    Then "<font>" reads "<says>"

    Examples:
      | picker                         | font       | says                                  |
      | block Text style               | Montserrat | Yoruba · Igbo · Hausa · Twi / Ga / Ewe |
      | section Text style             | Lora       | Yoruba · Igbo only                    |
      | component Typography           | Poppins    | none of Yoruba, Igbo, Hausa, Twi      |

  Scenario: Every font in the picker was measured, and the canvas draws the same font the download ships
    Then every family the pickers offer has its measured languages
    And exactly eight families write all four region languages: Inter, Montserrat, Merriweather, EB Garamond, Libre Baskerville, Noto Serif, Anton and Great Vibes
    And every family the pickers offer is loaded by the editor itself, so the canvas never borrows another copy
    And every picker option keeps the font's name as its label and says its languages in words on a second line

  Scenario: Naming the letters a font lacks
    Then a font is read out of its stack, quoted or not
    And "Ẹ ṣé o, ẹ ṣé" in Poppins lacks "Ẹ ṣ ẹ" — each letter named once
    And "Ɓarka, Ụlọ" in Lora lacks only "Ɓ", because Lora writes Yoruba and Igbo but not Hausa
    And plain English lacks nothing, and a font that was never measured makes no claim

  # (3) the Page check warns
  Scenario: A paragraph uses letters its font lacks
    Given a paragraph "Ẹ ṣé o" in Poppins
    When I open the Page check
    Then it warns that "ẹ ṣ" are drawn in another font, names the block and suggests a font that writes them
    When I choose "Go to block"
    Then that paragraph is selected
    When I set the paragraph's font to Inter
    Then the warning is gone

  Scenario: An English page has no font warning
    Given a page whose words are all English
    Then the Page check has no font warning

  Scenario: A heading is checked against the heading font, and words against the words font
    Given a heading "Ɓarka"
    Then there is no font warning while the site's headings are in Montserrat, even with words in DM Sans
    And it is named when the site's headings are in Poppins, even with words in Montserrat

  Scenario: The font checked is the one the block is drawn in
    Given Yoruba words with a font of their own, or inside a box with a font of its own, that writes them
    Then the Page check has no font warning
    When Hausa words sit inside a box set to the serif Lora
    Then they are named, and the font suggested is a serif that writes them, Merriweather

  Scenario: A hidden block is not checked
    Given a hidden paragraph in Yoruba
    Then the Page check has no font warning for it

  # (4) Site fonts
  Scenario: Choosing the site's fonts
    When I open Page settings and choose Site fonts → Headings "Merriweather" and Words "Noto Serif"
    Then every heading without a font of its own is in Merriweather and every word in Noto Serif
    And a block with a font of its own keeps it
    And one Undo puts the site's fonts back
    And changing the font of headings or of words alone keeps the other, on a new site and on a site saved before
