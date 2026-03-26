Feature: Mobile Drive End-to-End Flows
  As a teacher using the mobile app
  I want to complete full drive workflows
  So that I can manage my files efficiently across all scenarios

  Background:
    Given I am logged in as an authenticated teacher
    And I navigate to the Drive screen

  # ── Full File Lifecycle ──

  Scenario: Create folder, move file into it, then delete
    When I tap the FAB (+) to create a new folder
    And I name it "Term 3 Materials"
    And I tap Create
    Then "Term 3 Materials" should appear in my drive

    When I long-press on "Quick Notes.txt"
    And I tap "Move" in the action sheet
    And I select "Term 3 Materials" and tap "Move here"
    Then "Quick Notes.txt" should disappear from the current view

    When I tap on "Term 3 Materials" folder
    Then I should see "Quick Notes.txt" inside

    When I long-press "Quick Notes.txt" and tap "Bin"
    Then it should move to the Bin
    And "Term 3 Materials" should show "0 items"

  Scenario: Star, rename, and share a file
    When I long-press on "Budget Proposal 2026.xlsx"
    And I tap "Star"
    Then the star indicator should appear

    When I navigate to the "Starred" section
    Then I should see "Budget Proposal 2026.xlsx" in the starred list

    When I long-press it and tap "Rename"
    And I change the name to "Budget Final 2026.xlsx"
    And I tap Rename
    Then the file should be renamed

    When I long-press it and tap "Share"
    Then I should see a share confirmation

  Scenario: Delete and restore a file
    When I long-press "Quick Notes.txt" and tap "Bin"
    Then it should disappear from My Drive

    When I navigate to the "Bin" section
    Then I should see "Quick Notes.txt"

    When I long-press it and tap "Restore"
    Then it should disappear from the Bin

    When I navigate to "Home"
    Then "Quick Notes.txt" should be back in My Drive

  Scenario: Permanently delete a file
    When I navigate to the "Bin" section
    And I long-press "Old Timetable.pdf" and tap "Delete permanently"
    Then "Old Timetable.pdf" should be permanently removed
    And it should not appear in any section

  # ── Navigation Flows ──

  Scenario: Deep folder navigation with breadcrumbs
    When I tap on "Documents" folder
    Then breadcrumbs should show "My Drive > Documents"
    And I should see files inside Documents

    When I tap "My Drive" in the breadcrumbs
    Then I should return to the root
    And breadcrumbs should update accordingly

  Scenario: Search across sections
    When I type "Budget" in the search bar
    Then I should see "Budget Proposal 2026.xlsx"
    And other items should be hidden

    When I clear the search
    Then all items should reappear

  Scenario: Switch between list and grid views
    When I tap the grid view toggle
    Then items should display in a grid layout
    And each item should show a colored preview card

    When I tap the list view toggle
    Then items should display in a list layout
    And each item should show as a row with icon

  # ── File Preview Flows ──

  Scenario: Open a document and return to drive
    When I tap on "Staff Meeting Notes.docx"
    Then I should see the document preview with meeting notes content
    And the header should show "Staff Meeting Notes.docx"

    When I tap the back button
    Then I should return to the drive at the same location

  Scenario: Open a spreadsheet and view table
    When I navigate to "My Drive > Spreadsheets"
    And I tap on "Student Grades Term 2.xlsx"
    Then I should see a table with student names and grades
    And the table should be horizontally scrollable

  Scenario: Open a presentation and view slides
    When I navigate to "My Drive > Presentations"
    And I tap on "Term 2 Assembly.pptx"
    Then I should see slide cards with titles and content

  Scenario: Open a video file
    When I tap on "Recording 2026-03-21.mp4"
    Then I should see a video player UI with play button and controls

  # ── Tablet-Specific E2E ──

  Scenario: Tablet full workflow with sidebar
    Given I am on a tablet device
    When I tap "My Drive" in the sidebar
    Then the content should show My Drive files in grid view

    When I tap "Starred" in the sidebar
    Then the content should switch to starred items

    When I tap "Bin" in the sidebar
    Then the content should show bin items with restore/delete actions

  Scenario: Tablet action sheet as centered dialog
    Given I am on a tablet device
    When I long-press a file
    Then the action sheet should appear as a centered dialog
    And I should be able to perform all actions (rename, move, star, etc.)

  # ── Edge Cases ──

  Scenario: Empty folder shows helpful message
    Given I create a new empty folder "Empty Folder"
    When I navigate into "Empty Folder"
    Then I should see "This folder is empty"
    And I should see "Upload files or create folders to get started"

  Scenario: Search with no results
    When I type "xyznonexistent" in the search bar
    Then I should see "No results found"
    And it should show the search query in the message

  Scenario: Section with no items shows empty state
    Given all starred items have been unstarred
    When I navigate to "Starred"
    Then I should see "No starred items"
    And I should see "Star important files and folders for quick access"
