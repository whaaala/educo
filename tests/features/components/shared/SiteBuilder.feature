Feature: SiteBuilder — modern school website builder

  As a school administrator
  I want to build my school's website from modern, brand-driven sections
  So that I can produce a professional public site that matches my school's brand

  # Sections are CONTENT-DRIVEN (hero, about, programs, stats, gallery, testimonials, CTA, contact),
  # rendered by a reusable section library. Every colour comes from the site's brand theme — nothing
  # hardcoded — so editing the brand cascades to every section. Builder chrome follows the app theme.

  # --- Structure ---

  Scenario: Renders the seeded site
    Given the builder is opened with a new site named "Test School"
    Then the site name field shows "Test School"
    And the Pages panel lists the "Home" page
    And the sections tree lists Hero, Programs, Stats, and Call to Action
    And the canvas renders the real hero heading from the section component

  # --- Pages ---

  Scenario: Add a page
    Given the builder is opened with a new site
    When the user clicks "Add page"
    Then a "Page 2" entry appears in the Pages panel

  Scenario: The last page cannot be deleted
    Given a site with a single page
    Then no delete control is shown for the "Home" page

  # --- Sections ---

  Scenario: Add a section from the catalog
    Given the builder is opened with a new site
    When the user opens "Add section" and chooses "Contact"
    Then a "Contact Us" section appears in the tree

  Scenario: Delete a section
    Given the builder is opened with a new site
    When the user deletes the "Hero" section
    Then "Hero" no longer appears in the tree

  Scenario: Hide a section
    Given the builder is opened with a new site
    When the user hides the "Programs" section
    Then the section offers a "Show Programs" control
    And hidden sections are omitted from Preview

  Scenario: Reorder and duplicate sections
    Given a selected section
    Then the on-canvas toolbar can move it up/down, duplicate, hide, or delete it

  # --- Content editing ---

  Scenario: Edit a section's content
    Given the Hero section is active
    Then the Content panel shows its heading, subheading and button labels
    When the user edits the heading text
    Then the canvas updates to the new heading

  Scenario: Edit list items
    Given a Programs or Stats section is active
    Then the Content panel exposes each item's title/value/body for editing

  # --- Design (global brand styles) ---

  Scenario: Change brand colours and typography
    Given the Design tab is open
    Then the user can change primary, accent, background, surface and text colours
    And choose heading and body fonts and a corner radius
    And every section re-colours to match (brand cascade, no hardcoded colours)

  # --- Preview & responsive ---

  Scenario: Preview mode hides editing chrome
    Given the builder is opened with a new site
    When the user enters Preview
    Then the Pages and Content/Design panels are hidden

  Scenario: Responsive builder chrome
    Given a small (mobile/tablet) viewport
    Then the side panels collapse into toggleable drawers
    And the device-width toggle previews desktop, tablet and mobile

  # --- Publishing deferred ---

  Scenario: Publish is deferred
    Given the builder is opened with a new site
    Then the Publish button is present but disabled

  # --- Persistence & migration ---

  Scenario: Edits persist to storage
    Given the builder is opened with a new site
    When the user renames the site and edits a section
    Then the changes are saved to localStorage via siteStorage

  Scenario: Legacy sites are migrated
    Given a site saved under the previous freeform section model
    When it is loaded
    Then each old section is upgraded to the modern content model
    And retired section types are remapped to valid modern types
