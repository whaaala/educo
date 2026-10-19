Feature: The CodePen research recognises what a pen is made of (LE15-1, LE15-2)
  # A big CodePen tag is read until SATURATED (RULE R): a run of pens adding no technique not seen yet. The techniques
  # are ONE list in config/research.json (RULE CFG), read by scripts/research/cp-how.js (how a pen is made) and by
  # scripts/research/cp-tag.js (when a tag has saturated) — so a gallery tag is judged on its layout and media too.
  Guards: tests/unit/research-techniques.test.ts

  Scenario: Every technique in the list is a pattern that can be read
    Given config/research.json lists techniques as a name, a pattern and optional flags
    When each pattern is compiled
    Then none fails and no name is listed twice

  Scenario: A gallery pen is named by its layout and media techniques
    Given a pen whose code lays its pictures out in an auto-fit grid with spans, crops them with aspect-ratio and object-fit, loads them lazily with a srcset and opens them in a lightbox
    When the research reads how it is made
    Then the techniques name the CSS grid, the auto-fit grid, the spans, aspect-ratio, object-fit, srcset, lazy loading and the lightbox

  Scenario: A masonry gallery is told apart from a grid
    Given a pen that lays its pictures out with "columns: 3"
    When the research reads how it is made
    Then it names multi-column masonry and not the CSS grid

  Scenario: Saturation is judged on the same techniques
    Given a pen read by cp-tag.js with its techniques named by cp-how.js
    When its signature for saturation is taken
    Then every technique cp-how.js named is in it
    And a second pen made the same way adds nothing new, while a pen with a new technique does

  Scenario: The list lives in one place
    When cp-tag.js and cp-how.js are read
    Then neither holds its own list of technique patterns

  Scenario: A listing page that loads no pens is not the end of the tag (LE15-3)
    # Measured 2026-10-19: the collector stopped "layout" at page 12 with 66 pens; pages 12, 13, 40, 120 and 400 hold pens.
    Given a listing page that shows no pens and does not say "No Pens for the tag"
    When the collector decides whether the tag has ended
    Then it skips that page and reads the next
    And it rests longer after each one (the configured rest × the empty pages in a row), and only the configured number
      in a row end it — five (LE15-20, measured 2026-10-19: three empty pages at page 62–64 of 400+ were CodePen throttling)
    And a page that says "No Pens for the tag" ends it at once
    And a page whose every pen was already read counts like an empty one — CodePen serves a page twice when it throttles
      (LE15-24, measured 2026-10-19: "layout" ended at page 22 on a repeat)

  Scenario: A pen is read only when its code is saved and it ran (LE15-4, LE15-5)
    # Measured 2026-10-19: of 95 pens read, 60 had no code saved (the fetch failed under load and saved "") and 7 no preview.
    Given a pen whose html, css and js all came back empty, or that showed no preview, or that failed
    When the collector resumes
    Then it reads that pen again
    And a pen with any code saved and a preview is kept
    And the status of each code fetch is kept on the pen, so a failed fetch is never mistaken for an empty pen
