Feature: Each picture is sent at the size each screen shows it (AC-22, BATCH LE-5 · RULE AF)
  A published photo comes with narrower copies (srcset). The browser picks one from `sizes`: how wide the picture is SHOWN on
  each screen. Until LE-5 that was the whole window for every picture not lazy — a third-width photo on a desktop fetched the
  1600px original. Now the download MEASURES each picture on each page at both edges of every rung of config/layout.json and
  writes what it found, so a phone, a tablet and a desktop each fetch the copy their screen needs — for every structure the
  builder makes (rows, grids that fit as many as they can, stacks that wrap, container queries), because it is measured.
  Guards: tests/unit/image-sizes.test.ts · tests/unit/export-photos.test.ts · scripts/uat/uat-le5-headed.js

  Scenario: The copy widths are configuration
    When I read config/layout.json
    Then media.photoWidths lists the narrower copies the export makes, smallest first
    And the export reads them from there, never typed in code

  Scenario: A picture that fills the window everywhere says so once
    Given a picture measured at 100% of the window on every screen
    Then its sizes is "100vw"

  Scenario: A picture a third of a desktop row says so on the desktop
    Given a picture that is the whole width on a phone and a third of the row from the tablet held sideways
    Then its sizes says 100vw up to the tablet line and 34vw (a third, rounded UP) after it
    And each condition is a max-width in em, so an old Android WebView reads it too

  Scenario: Neighbouring rungs that agree are written once
    Given a picture measured at 50% on both tablet rungs
    Then one condition covers both

  Scenario: A picture held by the content width is a fixed size on wide screens
    Given a picture that measures the same pixels at the wide rung's edge and on a 2560 screen
    Then the last entry of its sizes is that width in rem, not a share of the window

  Scenario: A picture hidden on one screen asks for the smallest copy there
    Given a picture hidden on phones
    Then its sizes on phones is the smallest width, never 0 and never the whole window

  Scenario: A picture shown only once opened keeps the window
    Given a picture inside a closed accordion, which measures nothing on any screen
    Then its sizes is "100vw" — its shown size is not knowable until it is opened

  Scenario: A lazy picture still lets the browser measure, with the measured list as its fallback
    Given a picture below the first screen (loading lazy)
    Then its sizes is "auto, " followed by the measured list

  Scenario: The measured sizes reach the right picture
    Given a page with two pictures of the same photo, one full width and one a third
    When the download writes their srcset
    Then each carries its own sizes, in page order

  Scenario: A page the measuring cannot lay out keeps the window
    Given the measuring frame fails
    Then the picture's sizes is "100vw" as before, and the download still completes

  Scenario: In the downloaded site, each screen fetches the copy it needs (HEADED)
    Given a site built through the UI with a full-width hero photo and three photos in a row
    When I open the downloaded site at every width of scripts/uat/screens.js
    Then each picture's chosen copy (currentSrc) is the smallest at least as wide as it is shown × the pixel ratio
    And no picture on a 360px phone is the original when a narrower copy would do
