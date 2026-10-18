Feature: The published page's base stylesheet — the four responsive ingredients
  Every exported page starts from one small base layer (lib/educo-ui/base.ts): a page measure, text that follows the
  reader's own font size, images that never overflow, mobile-first breakpoints in em, and the accessibility floor.
  It carries nothing a page cannot use and never reaches the editor's own screens.
  Guards: tests/unit/educo-base.test.ts

  Scenario: The page has a measure every band can read
    Then the page root sets the page measure, and the band styles are in the base layer

  Scenario: The base layer ships only what the builder can put on a page
    Then the only classes it styles are the page root and the bands
    And it carries no container-query scaffolding — the page root is the one size container

  Scenario: Text follows the reader's own font size
    Then the root font size is 100 %, never a fixed pixel size
    And body text is fluid, from the type tokens

  Scenario: Pictures never overflow their box
    Then images are at most the full width of their box, keep their proportions and sit on their own line

  Scenario: Breakpoints are mobile first and move with the reader's text
    Then every breakpoint is a minimum width in em, from tablet portrait up to desktop
    And no breakpoint is written desktop first or in pixels

  Scenario: Reduced motion is honoured, on the published page and on the canvas
    Given a visitor who asks their device for reduced motion
    Then animations and transitions stop
    And a parallax background scrolls with the page instead of staying fixed, in the Preview and on the canvas alike

  Scenario: The accessibility and everyday basics are covered
    Then focus is always visible, selected text and form controls take the brand colour
    And form fields inherit the page's font, tables collapse their borders and long words wrap
    And motion uses the duration and easing tokens, and a printed page keeps blocks whole

  Scenario: Nothing leaks into the editor
    Then every rule is scoped under the page root, never a bare universal selector

  Scenario: One stylesheet holds the tokens and the base rules
    When the stylesheet for the site's theme is built
    Then it holds the colour and font tokens and the band styles together
