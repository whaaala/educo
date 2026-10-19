Feature: The page check tells a broken word from a word that wraps at its hyphen (LE15b-10), and a person's order of headings from a builder fault (LE15b-11)
  The page audit (scripts/uat/page-audit.js, check L8) reports a word split across two lines, because its box was narrower
  than the word. It read "inter-house" or "Thirty-nine" wrapping at the hyphen as broken, which is how type is set, and
  reported three sections of BATCH LE-15b for nothing.
  Guards: tests/e2e/page-audit-words.spec.ts

  Scenario: A word that wraps at its own hyphen is not broken
    Given a narrow box holding "Training for inter-house sports" that wraps after "inter-"
    Then the page check reports no broken word

  Scenario: A word split in the middle is still reported
    Given a narrow box whose long word is split across two lines
    Then the page check reports it as broken, naming the word

  Scenario: A main title smaller than a heading under it is the person's to fix, so it is a warning
    Given a page whose h1 is smaller than an h2 after it
    Then the page check lists it as a warning, not as an error of the builder
    And a heading smaller than the words around it is still an error

  Scenario: A picture in a carousel's next slide is not off the page (LE15c-3)
    Given a carousel whose second slide holds a picture, waiting to the right inside its own sideways strip
    Then the page check does not report that picture as running off the page
    And a picture that really runs past the edge of the page is still reported
