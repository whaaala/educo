Feature: Drive Page (My Drive)
  As a user
  I want a centralized file manager in the application
  So that I can browse, organize, and access all my files and folders

  Background:
    Given I am logged in as an authenticated user
    And the Drive page is accessible at "/drive"
    And documents and presentations are synced into the virtual file system

  # ── Navigation & Access ──

  Scenario: Drive is accessible from the sidebar under Workspace
    When I look at the sidebar navigation
    Then I should see "My Drive" under the "Workspace" section
    And clicking "My Drive" should navigate to "/drive"

  Scenario: Drive page shows header with title and actions
    When I visit the Drive page
    Then I should see the heading "My Drive"
    And I should see the subtitle "Manage your files and folders"
    And I should see a "New folder" button

  # ── Folder Browsing ──

  Scenario: Root level shows default folders
    When I visit the Drive page
    Then I should see folders: "Documents", "Images", "Presentations", "Spreadsheets"
    And each folder card should show the folder name and item count

  Scenario: Clicking a folder navigates into it
    When I click on the "Presentations" folder
    Then the breadcrumb should show "My Drive > Presentations"
    And I should see the presentation files inside

  Scenario: Breadcrumb navigation allows going back
    Given I am inside "My Drive > Presentations"
    When I click "My Drive" in the breadcrumb
    Then I should return to the root My Drive view

  # ── File Display ──

  Scenario: Files are displayed in grid view by default
    When I visit the Drive page and navigate to "Presentations"
    Then files should be displayed in a grid layout
    And each file card should show a type-specific icon
    And each file card should show the file name and relative time

  Scenario: Switching to list view
    When I click the list view toggle
    Then files should be displayed in a list layout
    And each row should show icon, name, size, and modified time

  # ── File Sync ──

  Scenario: Documents are synced into the Documents folder
    Given I have created documents via the Doc Editor
    When I visit the Drive page and navigate to "Documents"
    Then my documents should appear as file entries

  Scenario: Presentations are synced into the Presentations folder
    Given I have created presentations via the Slide Editor
    When I visit the Drive page and navigate to "Presentations"
    Then my presentations should appear as file entries

  Scenario: Clicking a synced file opens it in the appropriate editor
    When I click on a presentation file in the Drive
    Then I should be navigated to the Slide Editor with that presentation loaded
    When I click on a document file in the Drive
    Then I should be navigated to the Doc Editor with that document loaded

  # ── Folder Creation ──

  Scenario: Creating a new folder
    When I click "New folder"
    Then an inline folder creation form should appear
    When I type "Archive" and press Enter
    Then a new "Archive" folder should be created in the current directory
    And the folder list should refresh to include "Archive"

  Scenario: Canceling folder creation
    When I click "New folder"
    And I press Escape
    Then the folder creation form should close without creating a folder

  # ── Context Menu Actions ──

  Scenario: Right-clicking a file shows context menu
    When I hover over a file card and click the more menu button
    Then I should see options: "Rename", "Move to", "Delete"

  Scenario: Renaming a file via context menu
    When I select "Rename" from the context menu on "My File"
    Then the file name should become an editable input
    When I type "Renamed File" and press Enter
    Then the file should be renamed to "Renamed File"

  Scenario: Moving a file via context menu opens Move Dialog
    When I select "Move to" from the context menu on "My File"
    Then the Move Dialog should open for "My File"
    And I should be able to select a destination and complete the move

  Scenario: Deleting a file via context menu
    When I select "Delete" from the context menu on "My File"
    Then a confirmation prompt should appear
    When I confirm the deletion
    Then the file should be removed from the Drive

  # ── Search ──

  Scenario: Searching filters items by name
    Given I am in a folder with items "Report.doc", "Budget.xlsx", "Notes.doc"
    When I type "Report" in the search field
    Then only "Report.doc" should be visible

  Scenario: Empty search results show appropriate message
    When I type "nonexistent" in the search field
    Then I should see "No results found" message

  # ── Empty State ──

  Scenario: Empty folder shows helpful message
    Given I navigate to an empty folder
    Then I should see "This folder is empty"
    And I should see "Upload files or create a folder to get started"
    And I should see a "Create a folder" button

  # ── UI / Look and Feel ──

  @visual
  Scenario: Drive page follows application design system
    When I visit the Drive page
    Then the header should have a blue gradient icon
    And folder cards should have amber folder icons
    And file cards should have type-colored icons (blue for docs, orange for presentations)
    And the search bar should have a search icon and rounded styling

  @visual
  Scenario: Folder cards show hover effects
    When I hover over a folder card
    Then the card should show a blue border highlight
    And the folder name should transition to blue text
    And the context menu button should become visible

  @responsive
  Scenario: Grid layout adapts to screen size
    Given I am on the Drive page
    When the viewport is 375px wide
    Then the grid should show 2 columns
    When the viewport is 768px wide
    Then the grid should show 3 columns
    When the viewport is 1280px wide
    Then the grid should show 5 columns

  # ── Drive Change Events ──

  Scenario: File list refreshes when driveChanged event fires
    Given I am viewing the Drive page
    When a "driveChanged" event is dispatched (e.g., from the MoveDialog)
    Then the file list should automatically refresh to reflect the changes
