Feature: Documents Home Dashboard
  The Documents home page at /documents provides file management,
  template access, and recent document browsing within the app layout.

  # ──────────────────────────────────────────────────
  # Layout & Navigation
  # ──────────────────────────────────────────────────

  Scenario: Dashboard renders within MainLayout
    Given the user navigates to /documents
    Then the page should display within the app's MainLayout
    And the sidebar navigation should be visible
    And the top header with search, notifications, and user avatar should be visible

  Scenario: Documents link appears in sidebar
    Given the user is on any page in the app
    Then the sidebar should contain a "Documents" link
    And clicking it should navigate to /documents

  # ──────────────────────────────────────────────────
  # Search
  # ──────────────────────────────────────────────────

  Scenario: Search bar filters recent documents in real-time
    Given there are recent documents with titles "Budget Report" and "Meeting Notes"
    When the user types "budget" in the search bar
    Then only "Budget Report" should appear in the recent documents
    And "Meeting Notes" should be hidden

  Scenario: Search with no results shows empty state
    When the user types "xyznonexistent" in the search bar
    Then a "No documents found" message should appear
    And the message should suggest creating a new document

  # ──────────────────────────────────────────────────
  # Start a New Document
  # ──────────────────────────────────────────────────

  Scenario: Blank document card creates a new empty document
    When the user clicks the Blank (+) card
    Then a new document should be created in docStorage
    And the user should be navigated to the doc editor with the new doc's ID

  Scenario: Template cards show real HTML previews
    Given the documents page is loaded
    Then the first 5 template cards should display scaled-down HTML content
    And each card should have a colored accent border at the top
    And a label below the card with the template name

  Scenario: Clicking a template creates a pre-filled document
    When the user clicks the "Modern Resume" template card
    Then a new document should be created with the template's title and HTML
    And the user should be navigated to the doc editor
    And the editor should display the resume content

  Scenario: Template gallery link navigates to full gallery page
    When the user clicks "Template gallery"
    Then the user should be navigated to /documents/templates

  # ──────────────────────────────────────────────────
  # Recent Documents
  # ──────────────────────────────────────────────────

  Scenario: Recent documents load from docStorage
    Given there are 3 saved documents in localStorage
    When the documents page loads
    Then all 3 documents should appear in the Recent Documents section

  Scenario: Grid view shows document preview cards
    Given the view mode is "grid"
    Then each document card should have a 3:4 aspect ratio
    And documents with HTML content should show a scaled-down preview
    And documents without HTML should show a file icon placeholder

  Scenario: List view shows structured rows
    When the user clicks the list view toggle
    Then documents should display in 52px-height rows
    And each row should show Name, Owner, and Last Opened columns

  Scenario: Sorting by title
    When the user selects "Title" from the sort dropdown
    Then documents should be sorted alphabetically by title

  Scenario: Star a document
    When the user clicks the star icon on a document card
    Then the document's starred status should toggle in docStorage
    And the star icon should update visually

  Scenario: Delete a document
    When the user clicks "Remove" from a document's context menu
    Then the document should be removed from docStorage
    And it should disappear from the recent documents list

  # ──────────────────────────────────────────────────
  # Responsive Grid
  # ──────────────────────────────────────────────────

  @responsive
  Scenario: Grid adapts to screen width
    Given the view mode is "grid"
    Then on desktop (xl) the grid should show 6 columns
    And on tablet (md) the grid should show 4 columns
    And on mobile (sm) the grid should show 2 columns
