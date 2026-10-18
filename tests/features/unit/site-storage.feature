Feature: Site storage — the section-based school site, its templates, theme and saved copies
  The site-storage layer behind the SiteBuilder (components/shared/SiteBuilder.feature): content-driven sections from
  a catalogue, pages and sites made from templates, a brand theme whose base follows the app theme, and sites kept
  in the browser's localStorage, with older saved sites upgraded when they are loaded.
  Guards: tests/unit/site-storage.test.ts

  # ── Sections ──
  Scenario: Every section in the catalogue can be added
    Then the catalogue lists hero, about, features, stats, gallery, testimonials, call to action, contact and custom, each once
    And each entry has an icon for the picker
    And each one, when added, is a named section with its own content and an id no other section shares

  Scenario: A new section arrives with content to start from
    When I add a hero
    Then it has a heading and a main button with a label
    When I add features or stats
    Then each has at least one item

  # ── Pages and sites ──
  Scenario: A new page
    When I add a page called "About" at "/about"
    Then it has that name and address and no sections yet
    And a home page can be asked for with a hero already on it

  Scenario: A new site starts ready to edit
    When I create a site called "Greenfield Academy"
    Then it has a home page holding a hero, features, stats and a call to action
    And it has the default theme, a menu with one "Home" link to that page, and the time it was made
    And brand colours given when it is created are used, while the other theme values keep their defaults

  Scenario: Sites and pages made from templates
    Then every site template builds a home page with the sections it declares, in the brand colour given
    And the blank site template and the blank page template have no sections
    And a plain new site is the "classic" template
    And every page template builds its declared sections, with its hero design where it names one
    And a site made from a template is saved straight away

  Scenario: Page addresses are made from their names
    Then "About Us" becomes "/about-us", "  Programs & Fees! " becomes "/programs-fees", and an empty name "/page"

  # ── Theme ──
  Scenario: The site's base colours follow the app theme, and its brand stays
    Given a site with its own main and accent colours
    When the app is in Dark
    Then the site keeps its brand colours and fonts, and takes the Dark background and text
    And Light, Dark, Midnight and Purple each give a different background
    And an app theme the site does not know falls back to Light

  # ── Saved copies ──
  Scenario: Sites are saved, changed, listed and removed
    Given nothing has been saved
    Then the list of sites is empty
    When I create a site, with or without brand colours
    Then it can be found again by its id, with those colours
    When I save a change to its name
    Then the change is kept, and there is still only one site
    And sections and their content come back exactly as they were saved
    And the most recently changed site is listed first
    When I remove a site
    Then it can no longer be found

  Scenario: Opening the builder with no site makes one, once
    When the builder asks for the default site twice
    Then the first time a site is made, and the second time the same site comes back

  Scenario: Sites saved by an older version still open
    Given a site saved before sections had content, with a retired "staff" section and a theme missing values
    When it is loaded
    Then every section has content, keeping its id and name
    And the "staff" section becomes a features section with items
    And the theme's missing values are filled from the defaults, and its own colours are kept
    And an old menu of plain links becomes typed page links, and the header gets a logo, a name, the menu and a button
