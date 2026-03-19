Feature: Template Gallery Page
  A dedicated full-page view at /documents/templates for browsing
  and using all document templates organized by category.

  # ──────────────────────────────────────────────────
  # Navigation
  # ──────────────────────────────────────────────────

  Scenario: Back button returns to documents home
    Given the user is on /documents/templates
    When they click the back arrow button
    Then they should be navigated to /documents

  Scenario: Page shows template count and category count
    Given the template gallery page is loaded
    Then the header should display the total number of templates
    And the number of categories

  # ──────────────────────────────────────────────────
  # Categories & Filtering
  # ──────────────────────────────────────────────────

  Scenario: All categories are displayed by default
    Given no filter is active
    Then all template categories should be visible with headers
    And each category should show its templates in a responsive grid

  Scenario: Category filter pills
    Given the gallery page is loaded
    Then filter pills for each category should be displayed
    And the "All" pill should be active by default

  Scenario: Filtering by category
    When the user clicks the "Legal" category pill
    Then only Legal templates should be displayed
    And the "Legal" pill should be visually active with its accent color

  Scenario: Search filters templates
    When the user types "resume" in the search bar
    Then only templates with "resume" in the name or category should appear
    And a count of matching results should be displayed

  Scenario: No results state
    When the user searches for "xyznonexistent"
    Then a "No templates found" message should appear

  # ──────────────────────────────────────────────────
  # Template Cards
  # ──────────────────────────────────────────────────

  Scenario: Template cards show real HTML previews
    Given the gallery page is loaded
    Then each template card should render the template's HTML content
    And the content should be scaled down to fit the card
    And a bottom fade gradient should be applied
    And the template name and category should appear below the card

  Scenario: Using a template creates a new document
    When the user clicks a template card (e.g., "Consultant Agreement")
    Then a new document should be created in docStorage
    And its title should match the template's title
    And its HTML should match the template's content
    And the user should be navigated to the doc editor with the new doc's ID

  # ──────────────────────────────────────────────────
  # Template Library Coverage
  # ──────────────────────────────────────────────────

  Scenario: All 8 categories exist
    Then the following categories should exist:
      | Resumes  |
      | Letters  |
      | Legal    |
      | Business |
      | Education |
      | Planning |
      | Reports  |
      | Personal |

  Scenario: Minimum template count per category
    Then each category should have at least 2 templates
    And the total template count should be at least 30

  Scenario: Blank document option at the top
    Given no filter is active
    Then a "Blank document" button should appear above the categories
    And clicking it should navigate to the doc editor

  # ──────────────────────────────────────────────────
  # Template Content Quality
  # ──────────────────────────────────────────────────

  Scenario: Legal templates have proper structure
    Given the "Consultant Agreement" template
    Then its HTML should contain sections for Services, Term, Termination, and Compensation
    And it should contain signature blocks

  Scenario: Resume templates have professional content
    Given the "Modern Resume" template
    Then its HTML should contain headings for Experience, Education, and Skills
    And it should contain realistic job titles and company names

  Scenario: Each template has a title and html
    Then every template in DOC_TEMPLATES should have a non-empty title
    And every template should have a non-empty html string
    And every template should have a category
