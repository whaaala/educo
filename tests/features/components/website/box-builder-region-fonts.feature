Feature: Fonts that write the region's languages (BATCH A-1b, RULE AF)
  A school writes in Yoruba, Igbo, Hausa, Twi, Ga and Ewe as well as English. A font that lacks ẹ ọ ṣ ị ụ ɓ ɗ ƙ ɛ ɔ ŋ draws
  those letters in a different font in the middle of a word. The builder says which fonts write which languages, starts
  a new site with a pair that writes them all, and warns when a page's words use letters their font lacks.

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

  # (2) the picker says which languages
  Scenario Outline: Every font in a picker says which languages it writes
    When I open the <picker> font picker
    Then "<font>" reads "<says>"

    Examples:
      | picker                         | font       | says                                  |
      | block Text style               | Montserrat | Yoruba · Igbo · Hausa · Twi / Ga / Ewe |
      | section Text style             | Lora       | Yoruba · Igbo only                    |
      | component Typography           | Poppins    | none of Yoruba, Igbo, Hausa, Twi      |

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

  # (4) Site fonts
  Scenario: Choosing the site's fonts
    When I open Page settings and choose Site fonts → Headings "Merriweather" and Words "Noto Serif"
    Then every heading without a font of its own is in Merriweather and every word in Noto Serif
    And a block with a font of its own keeps it
    And one Undo puts the site's fonts back
