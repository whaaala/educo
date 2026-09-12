Feature: Mobile Drive File Preview
  As a teacher using the mobile app
  I want to preview file contents when I open them
  So that I can read documents, view spreadsheets, and watch media

  Background:
    Given I am logged in as an authenticated teacher
    And I am on the Drive screen

  # ── Navigation ──

  Scenario: Opening a file navigates to the preview screen
    When I tap on "School Policy 2025.pdf"
    Then I should navigate to the file preview screen
    And I should see the file name in the header
    And I should see a back button to return to the drive

  Scenario: File info bar shows metadata
    When I open "Budget Proposal 2026.xlsx"
    Then I should see a colored info bar below the header
    And it should show the file type icon and "Spreadsheet" label
    And it should show the file size "762 KB"
    And it should show the relative time
    And it should show the owner "Mr. Chidi Okafor"

  # ── Document Preview ──

  Scenario: PDF files show document content
    When I open "School Policy 2025.pdf"
    Then I should see the document text content
    And the content should include headings and paragraphs

  Scenario: Word documents show document content
    When I open "Staff Meeting Notes.docx"
    Then I should see the meeting notes text
    And it should include agenda items and action items

  Scenario: Text files show plain text content
    When I open "Quick Notes.txt"
    Then I should see the text content in a readable format

  # ── Spreadsheet Preview ──

  Scenario: Excel files show a table view
    When I open "Fee Collection Report.xlsx"
    Then I should see a scrollable table
    And the table should have colored headers matching the file type
    And it should show student names, scores, and grades in rows

  # ── Presentation Preview ──

  Scenario: PowerPoint files show slide cards
    When I open "Term 2 Assembly.pptx"
    Then I should see slide cards stacked vertically
    And each slide should show a slide number, title, and content
    And slide cards should have a border and proper spacing

  # ── Video Preview ──

  Scenario: Video files show a player UI
    When I open "Recording 2026-03-21.mp4"
    Then I should see a dark video placeholder with a play button
    And I should see a duration label "03:42"
    And I should see video controls: progress bar, play, volume, fullscreen

  # ── Image Preview ──

  Scenario: Image files show an image placeholder
    When I open "School Event Photo.jpg"
    Then I should see an image preview area
    And it should show the image icon with "Image Preview" text

  # ── File Not Found ──

  Scenario: Invalid file ID shows error
    Given I navigate to file preview with an invalid ID
    Then I should see "File not found" in the header

  # ── Responsive ──

  @responsive
  Scenario: Tablet preview has wider content padding
    Given I am on a tablet
    When I open a file preview
    Then the content should have 32px horizontal padding
