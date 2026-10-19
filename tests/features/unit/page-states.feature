Feature: What every page DOES — hover, focus, opening, scroll, reduced motion, its elements and its flow (LE-15, store once)
  # The user, 2026-10-19: "the components, the flow, the effects… the hover over… HTML elements… everything, so we don't
  # have to come back and get everything again". scripts/research/page-states.js runs in the same archive pass as
  # section-kinds.js and writes sites/<site>/<page>.states.json and sites/<site>/flow.json. Its limits are in
  # config/research.json `states` (RULE CFG).
  Guards: tests/unit/page-states.test.ts

  Scenario: What a hover changes is recorded, property by property
    Given an element's styles before and while the pointer is over it
    When the two are compared
    Then each property that changed is listed with its value before and after, on the element, its children and its parent
    And a property that did not change is not listed

  Scenario: Look-alikes are tried once
    Given twenty cards with the same tag and classes
    When the elements to try are chosen
    Then one of them is tried, and the count of the others is kept

  Scenario: Hover, keyboard focus and opening are recorded for every distinct interactive thing
    Given a page's buttons, cards, menu links, menu buttons, tabs, accordion headers and slider arrows
    When the pass tries each one
    Then its hover change, its timing and easing, and its keyboard focus look are recorded
    And a menu button, an accordion header or a tab is clicked, and what appears, its size, and whether Escape closes it are recorded
    And a link is never followed, so the page stays where it is

  Scenario: Scroll and reduced motion are recorded
    When the page is scrolled down in steps
    Then which elements move, and how, is recorded
    And with reduced motion asked for, what still animates is counted

  Scenario: Every element, role and key attribute is counted, and the site's flow is kept
    When a page is read
    Then every tag, ARIA role and key attribute on it is counted
    And for each site its menu and footer are kept as label, address and page type

  Scenario: An SVG's class is read as its class (LE15-17)
    # Measured 2026-10-19: SVG elements were recorded as "svg.[object" — className is an SVGAnimatedString on SVG.
    When any research script reads an element's class
    Then it reads the class attribute, never className

  Scenario: The transition between pages is recorded live (the user, 2026-10-19: "record the transition between pages… record everything")
    Given a site's home page served from the archive, and its other pages served from the archive too
    When a link in its menu to another of its pages is clicked
    Then a strip of frames from the click to 1.6 seconds is kept
    And any full-screen cover or curtain, whether View Transitions were used, whether the page reloaded or only its content changed,
      and how long it took, are recorded
    And the link chosen is the site's own, to a page the archive holds, never the page already shown

  Scenario: Canvas and WebGL effects are recorded with their code
    Given a page that draws on a canvas
    When the page is read
    Then each canvas's size, its kind (2D or WebGL), a few frames of it and whether it moves are kept
    And the shader code a WebGL effect compiles is kept, caught as the page creates it
    And a canvas the archived copy holds only as a dead snapshot (no drawing context) is recorded live instead (LE15-21:
      11moissanstoit.com's WebGL map drew nothing from the archive — live it gave webgl2 and 5 shaders)
    And the motion and 3D libraries the page uses are named

  Scenario: Each site is recorded on video
    When a site is read
    Then a short video of its home page — the intro, a scroll to the bottom and a page transition — is kept beside its pages

  Scenario: Each Awwwards item's own recording of the effect is kept (the user, 2026-10-19: "do the same thing for the award website")
    Given an item of an Awwwards collection, whose page shows a short recording of the effect
    When scripts/research/aw-clips.js reads the collection
    Then each recording is stored once, named by the item, beside an index of item → live site → clip file → its tags
    And an item with no recording is listed, never left out
