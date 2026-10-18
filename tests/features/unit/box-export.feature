Feature: The published page — what the builder writes when a site is previewed or downloaded
  The export turns the page a person built into plain HTML and CSS: the right element for each block, the same
  look as the canvas at every screen size, safe from anything typed into a field, and self-contained.
  Related stories: box-builder-site.feature (Export) · accordion-component.feature · box-builder-responsive.feature.
  Guards: tests/unit/box-export.test.ts

  # ── The right element, the right content ──
  Scenario: Blocks publish as the elements they are
    Given a page with a heading, a numbered list of two items and a button that opens a link in a new tab
    When the page is published
    Then the page's first heading is its title, an h1
    And the list is a numbered list whose items each carry the space the canvas draws under them
    And the button's link opens in a new tab

  Scenario: A Divider publishes as one thematic break
    Given a page with a Divider
    When the page is published
    Then it is an "hr" that draws one solid line, with the browser's own margin and border taken away

  Scenario: A number in a style means the same as on the canvas
    Then a length written as a bare number is published in px, and a zero length too
    And a weight, a column count, a grid line, an aspect ratio, a zoom or a scale stays a plain number
    And a theme variable such as the heading weight never gains a unit

  Scenario: A filled button is one shape
    Given a filled, rounded button that has been resized
    When the page is published
    Then the link itself fills the box and centres its label
    And the box around it paints no second background behind it

  # ── Backgrounds ──
  Scenario: Backgrounds from the library are published as they are
    Given a section with a gradient, and another with a tiled pattern
    When the page is published
    Then the gradient is written as a gradient, never wrapped in url()
    And the pattern repeats at its tile size
    And a photo background keeps its size, position, repeat and scrolling choices

  Scenario: An empty box with a background can still be seen
    Given an empty section with a gradient background
    When the page is published
    Then it is 8rem tall rather than nothing
    But a section with content in it is as tall as its content

  # ── Safe from what is typed ──
  Scenario: Words typed into any block cannot become code on the page
    When a text, a Card's title or an accordion item's title holds "<script>" or "<img onerror>"
    Then the published page shows those characters as words
    And a quoted font name or a picture written as a data address cannot break the block's style
    And in the page's stylesheet the quotes stay real quotes, so the picture and the font still arrive
    And nothing typed can close the page's stylesheet early

  Scenario: Hidden blocks are left out
    Given a text block that is hidden
    When the page is published
    Then its words are not in the page at all

  # ── Self-contained ──
  Scenario: The download carries everything it needs
    When a site is downloaded
    Then each page links one shared "styles.css" holding the design tokens and the base rules
    And the components a page uses are written into that page, not into the shared sheet
    And the page's body is scoped, so its styles never leak
    And no stylesheet is fetched from another site
    And a single page is a whole document with its own title

  Scenario: The Preview shows the real page
    Given a page with a button that links to the home page
    Then the Preview and the download carry the same link to "index.html"
    And the Preview has the shared sheet written inside it, because it has no folder to fetch it from
    And the Preview carries the site's embedded fonts, before every rule that uses them, and none it was not given
    But an empty page is empty in the Preview: no navigation is added that I did not build

  Scenario: Downloading never breaks a page that cannot download
    Given a place with no way to save a file
    When the site is downloaded
    Then nothing happens and nothing fails

  # ── The accordion ──
  Scenario: An accordion publishes as native details and summary
    Given an accordion in the "panel" design with two items, the first open and showing a price
    When the page is published
    Then each item is a "details" with its number, the open one is open, and the price shows beside its title
    And only one item opens at a time unless "several open" is chosen
    And the accordion's own font, size, weight and letter spacing reach every item

  Scenario: An accordion needs no script until I ask for one
    Given an accordion with none of its extras turned on
    Then the published page has no script for it
    When I turn on "Expand / Collapse all", search, or a link to an item
    Then only that accordion gets the buttons, the search box or the link-opening it needs, with a small script of its own
    And search hides the group headings while it filters

  Scenario: An accordion's own styling stays on that accordion
    When I restyle one item's title, answer, icon and background with its own CSS
    Then only that item changes, and an item I did not touch gets no rule
    And CSS that tries to reach the whole page, or imports another sheet, is dropped
    And a colour token I override, and the accordion's Advanced CSS, reach the accordion

  Scenario: The accordion's richer designs publish too
    Then a split design shows its picture beside the items, and refuses an address that is not a web address
    And items grouped by category get one heading per group
    And an item with sub-items holds a smaller accordion inside its answer
    And an item's icon is drawn inline, in the text colour, and an Icon block publishes its drawing
    And answers can hold a link and bold words, and the FAQ search listing is added only when I ask for it

  # ── Components ──
  Scenario: A Card, Quote, Stat, Badge or Rating publishes as one component
    When the page is published
    Then each is one component with its design on it, with no extra box around it
    And a Rating of three out of five shows three filled stars of five
    And a component's border, background and font style the component itself, not a box around it

  # ── Every screen ──
  Scenario: Nothing on the published page scrolls sideways
    Then every block is capped at the width of what holds it, except a band reaching into its own gutter on purpose
    And no block carries an inline layout style that a screen size could not override
    And the page itself can never scroll sideways

  Scenario: The published page is built phone first
    Given a section coloured blue on a phone, green on a tablet and red on a desktop
    When the page is published
    Then the phone colour is the starting rule, and wider screens add their own from the tablet and desktop widths
    And every screen width is in em, never px, and no rule is written for "narrower than"

  Scenario: Something set for one screen is published for that screen only
    When I give a block Advanced CSS on the phone only, or on the wide screen only
    Then the published page applies it only at that screen size
    And Advanced CSS set for every screen is one plain rule

  Scenario: A floating block on a phone
    Given a floating block that I have not moved on the phone
    Then on a phone it stacks in the flow, full width, as tall as its content
    And from a tablet up it floats, and the box it floats in keeps room for it, in rem
    And its smallest height is published in rem, never px
    But a block I placed by hand on the phone stays floating there too

  Scenario: A row of five on a tablet and on a laptop
    Given a Side by side holding five equal blocks
    Then a tablet held upright shows three, then two, each line full
    And a laptop shows all five across on one line
