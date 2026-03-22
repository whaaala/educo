Feature: Drive Storage (Virtual File System)
  As a system component
  I want to manage a hierarchical file/folder structure in localStorage
  So that users can organize their files within the application

  Background:
    Given the drive storage is initialized with default folders

  # ── Default Folder Structure ──

  Scenario: Default folders are seeded on first use
    When drive storage is accessed for the first time
    Then the following root-level folders should exist:
      | name            | readOnly |
      | My Drive        | false    |
      | Shared with me  | true     |
      | Starred         | true     |
      | Recent          | true     |
      | Bin             | true     |
    And "My Drive" should contain:
      | name           | type   |
      | Documents      | folder |
      | Presentations  | folder |
      | Spreadsheets   | folder |
      | Images         | folder |

  # ── CRUD Operations ──

  Scenario: Creating a new folder
    When I create a folder "Reports" under "My Drive"
    Then a folder "Reports" should exist with parentId "folder-my-drive"
    And it should have type "folder"
    And it should have a unique id starting with "folder-"

  Scenario: Creating a new file entry
    When I create a file "Budget.xlsx" under "Documents" with sourceType "spreadsheet"
    Then a file "Budget.xlsx" should exist with parentId "folder-documents"
    And it should have type "file"
    And it should have sourceType "spreadsheet"

  Scenario: Getting children of a folder
    Given files "Report.doc" and "Notes.doc" exist in "Documents"
    When I call getChildren for "folder-documents"
    Then I should receive both files sorted alphabetically
    And folders should appear before files

  Scenario: Getting only folder children
    Given "Documents" contains a subfolder "Archive" and a file "Notes.doc"
    When I call getFolders for "folder-documents"
    Then I should only receive "Archive"

  Scenario: Renaming an item
    Given a file "Old Name.pptx" exists in "Presentations"
    When I rename the file to "New Name.pptx"
    Then the file name should be "New Name.pptx"
    And the updatedAt timestamp should be updated

  Scenario: Deleting a file
    Given a file "Temp.doc" exists in "Documents"
    When I delete "Temp.doc"
    Then "Temp.doc" should no longer exist in storage

  Scenario: Deleting a folder removes all descendants
    Given a folder "Project" exists with a subfolder "Sub" and a file "data.csv"
    When I delete "Project"
    Then "Project", "Sub", and "data.csv" should all be removed

  # ── Move Operation ──

  Scenario: Moving a file to a different folder
    Given a file "Slides.pptx" exists in "Presentations"
    When I move "Slides.pptx" to "Documents"
    Then the move should succeed
    And "Slides.pptx" parentId should be "folder-documents"
    And the result should contain oldParentName "Presentations" and newParentName "Documents"

  Scenario: Moving a file to the same location fails gracefully
    Given a file "Slides.pptx" exists in "Presentations"
    When I move "Slides.pptx" to "Presentations"
    Then the move should fail with error "Item is already in this folder"

  Scenario: Moving into a read-only folder is blocked
    Given a file "Slides.pptx" exists in "Presentations"
    When I move "Slides.pptx" to "Shared with me"
    Then the move should fail with error containing "read-only"

  Scenario: Moving a folder into itself is blocked
    Given a folder "Project" exists in "My Drive"
    When I move "Project" into "Project"
    Then the move should fail with error "Cannot move a folder into itself or its subfolder"

  Scenario: Moving a folder into its own descendant is blocked
    Given a folder "Parent" with subfolder "Child" exists
    When I move "Parent" into "Child"
    Then the move should fail with error "Cannot move a folder into itself or its subfolder"

  # ── Source ID Integration ──

  Scenario: ensureFileEntry creates new entry if not found
    When I call ensureFileEntry with sourceId "pres-123", name "My Deck", sourceType "presentation"
    Then a new file "My Deck" should be created in "Presentations" folder
    And it should have sourceId "pres-123"

  Scenario: ensureFileEntry returns existing entry if found
    Given a file with sourceId "pres-123" already exists as "My Deck"
    When I call ensureFileEntry with sourceId "pres-123", name "My Deck", sourceType "presentation"
    Then no duplicate should be created
    And the existing item should be returned

  Scenario: ensureFileEntry updates name if changed
    Given a file with sourceId "pres-123" exists as "Old Name"
    When I call ensureFileEntry with sourceId "pres-123", name "New Name", sourceType "presentation"
    Then the file name should be updated to "New Name"

  Scenario: findBySourceId locates items by external ID
    Given a file with sourceId "doc-456" exists
    When I call findBySourceId with "doc-456"
    Then the matching item should be returned

  # ── Breadcrumb Path ──

  Scenario: Building breadcrumb path from root to a nested folder
    Given the path is "My Drive > Documents > Archive"
    When I call getPath for "Archive"
    Then the result should be ["My Drive", "Documents", "Archive"]

  # ── Change Notification ──

  Scenario: notifyChange dispatches a custom event
    When I call notifyChange
    Then a "driveChanged" CustomEvent should be dispatched on the window
