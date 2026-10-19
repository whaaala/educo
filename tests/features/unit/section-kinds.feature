Feature: What KIND of section each band of a real page is (BATCH LE-15, the research)
  # The crawl (docs/layout-benchmark/) knows every band's SHAPE, not what it is for. The section gallery needs both:
  # which shapes a hero, a pricing table or a footer takes on real sites, and in which order each page type uses them.
  # scripts/research/section-kind.js names a band's kind from its features; the words it reads are in
  # config/research.json (RULE CFG). scripts/research/section-kinds.js measures the bands and writes the table.
  Guards: tests/unit/section-kind.test.ts · tests/unit/section-capture.test.ts

  Scenario: The class or id a site gave a band names its kind first
    Given a band whose class says "pricing-section"
    When its kind is read
    Then it is "pricing"

  Scenario: A utility class is never read as a kind (LE15-9)
    # Measured 2026-10-19: 421 × "pointer-events-none" made 61 bands of one site "events".
    Given a band whose classes are utilities like "pointer-events-none", "after:pointer-events-none" or "text-contact-600"
    When its kind is read
    Then those classes name nothing, and a site's own class like "events-list" still does

  Scenario: The kind is read from what the band holds when its class says nothing
    Given a band with two or more prices
    Then it is "pricing"
    Given a band with two or more <details>, or disclosure buttons outside the navigation
    Then it is "faq"
    And a menu's own buttons never count (LE15-6: a page with a menu was named "faq")
    Given a band with a <blockquote>
    Then it is "testimonials"
    Given a band with an email field and at most two fields
    Then it is "newsletter"
    Given a band with a form of three or more fields
    Then it is "contact"
    Given a band with four or more small pictures and few words
    Then it is "logos"
    Given a band with three or more short numbers and few words
    Then it is "stats"
    Given a band with six or more pictures and few words
    Then it is "gallery"

  Scenario: Where a band sits on the page counts
    Given the first band, under 200 pixels, holding a navigation
    Then it is "header"
    Given a band under 200 pixels holding a navigation further down the page — a floating or bottom bar (LE15-11)
    Then it is "header"
    Given a <footer>, or the last band holding eight or more links
    Then it is "footer"
    Given the first band below the header holding the h1
    Then it is "hero"

  Scenario: What is left is still named, never guessed
    Given a short band with a heading, a button and few words
    Then it is "cta"
    Given a band with three or more small headings
    Then it is "features"
    Given a band with a picture and twenty or more words
    Then it is "media"
    Given a band of one to five pictures and fewer than twenty words — a full-width picture or illustration (LE15-13)
    Then it is "image"
    Given a band with forty or more words and nothing else
    Then it is "text"
    Given a band with no words, no picture and no video — a background or overlay layer
    Then it is "decor"
    Given a band with none of these
    Then it is "other"

  Scenario: Every kind's words are in the configuration, in more than one language
    When config/research.json is read
    Then every kind the classifier can return has its list of words
    And the hero, features, pricing, FAQ, team, contact and footer words include French and Spanish ones

  Scenario: A section is a real section, not the page's wrapper (LE15-8)
    # Measured 2026-10-19 on 41 archived pages: a Framer page's "band 0" was the whole 3,000px page, named pricing.
    Given a band taller than one and a half screens whose children stack one under another
    When the page's sections are taken
    Then that band is split into its children, again and again, up to four levels deep
    And a wrapper with one row among its stacked children is split too (LE15-10: a 7,141px home stayed whole)
    And a band whose children all sit side by side is kept whole
    And a column of paragraphs is kept whole: a band is split only when two or more of its children are section-sized,
      at least the configured sectionMinPx (LE15-12: a page cut into 60 slivers of 26px)

  Scenario: An archived page that cannot be measured is measured live (LE15-14)
    # Measured 2026-10-19: every page of aicreatorawards.com failed — the archived copy sends itself elsewhere as it loads,
    # and document.body is null when the bands are read.
    Given an archived page whose body is missing when it is measured
    When section-kinds.js reads it
    Then it waits for the page's body to exist — not to be visible, since many sites hide it while an intro plays (LE15-15:
      11 of 146 pages waited 10 seconds and loaded twice) — and if the archived copy still cannot be measured, that page is measured live

  Scenario: Everything a page loads is stored once, so it replays without the internet (the user, 2026-10-19)
    # "Once you do it once, we don't want to do anything… get the code, get everything."
    Given an archived page read by section-kinds.js
    When it loads its stylesheets, scripts, fonts, pictures and media
    Then each file is stored once per site under the archive's assets folder, named by its address
    And the site's manifest lists every address with its file, type, size and status
    And a file that fails to come back is listed with its status, never silently left out
    And a media file over the configured size is listed but not stored

  Scenario: Every component on every page is indexed for the component work (CP-n)
    Given the component kinds and their selectors in config/research.json
    When a page is read
    Then each component found — menu, accordion, tabs, slider, dialog, form, card, pricing table, testimonial, map, video, search,
      breadcrumb, pagination and the rest — is written to the page's components file with its HTML, its place, its size and its section

  Scenario: The pass is fast and gives the same layout
    Given the archive is served from disk
    Then the pass runs headless, many sites at once, one worker per site so its files are shared
    And the layout it measures is the one a visible window measures (the same engine at the same size)
    And every crawler and the pass run REAL Chrome, never the bundled headless shell, which many sites turn away
      (LE15-16, measured 2026-10-19: 47 % of sites gave only their home page headless, 25 % headed; real Chrome headless matched headed)

  Scenario: Every page of a site is crawled, wherever its home ends up (LE15-18)
    # Measured 2026-10-19: 21 one-page Awwwards sites had internal links never followed — us.byhabit.com redirects to
    # www.habitsupps.com (every link "another site"), webflow.redis.agency keeps its pages under /en/ (skipped as "another language").
    Given a site whose home page redirects to another host
    Then the host it ends on is the site's own, and its links there are followed
    Given a home with no language in its address whose links go under /en/
    Then /en/ becomes the site's language and its pages are followed, while /fr/ is still skipped
