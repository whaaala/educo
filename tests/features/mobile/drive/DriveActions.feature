Feature: Mobile Drive File Actions
  As a teacher using the mobile app
  I want to perform actions on my files and folders
  So that I can organize, share, and manage my drive content

  Background:
    Given I am logged in as an authenticated teacher
    And I am on the Drive screen

  # ── Action Sheet ──

  Scenario: Long-pressing a file shows the action sheet
    When I long-press on "Budget Proposal 2026.xlsx"
    Then the action sheet should appear
    And it should show the file name "Budget Proposal 2026.xlsx"
    And it should show the file type "Spreadsheet", size, and date
    And it should show action tiles: Open, Rename, Move, Star, Share, Save, Bin

  Scenario: Long-pressing a folder shows folder actions
    When I long-press on the "Documents" folder
    Then the action sheet should appear
    And it should show actions: Open, Rename, Move, Star, Bin
    And it should NOT show Share or Save actions

  Scenario: Tapping the three-dot menu opens action sheet
    When I tap the three-dot menu on "Quick Notes.txt"
    Then the action sheet should appear for "Quick Notes.txt"

  Scenario: Dismissing the action sheet
    Given the action sheet is open
    When I tap the backdrop
    Then the action sheet should close

  # ── Open ──

  Scenario: Opening a folder navigates into it
    Given the action sheet is open for the "Documents" folder
    When I tap the "Open" action
    Then I should navigate into the Documents folder
    And the action sheet should close

  Scenario: Opening a file navigates to the file preview
    Given the action sheet is open for "School Policy 2025.pdf"
    When I tap the "Open" action
    Then I should navigate to the file preview screen
    And the preview should show the file content

  Scenario: Tapping a file in the list opens it
    When I tap on "Staff Meeting Notes.docx"
    Then I should navigate to the file preview screen

  # ── Rename ──

  Scenario: Renaming a file
    Given the action sheet is open for "Quick Notes.txt"
    When I tap the "Rename" action
    Then the rename modal should appear with "Quick Notes.txt" pre-filled
    When I change the name to "Important Notes.txt" and tap Rename
    Then the file should be renamed to "Important Notes.txt"
    And the file list should refresh

  Scenario: Canceling rename
    Given the rename modal is open
    When I tap Cancel
    Then the modal should close without renaming

  # ── Move ──

  Scenario: Moving a file to another folder
    Given the action sheet is open for "Quick Notes.txt"
    When I tap the "Move" action
    Then the move modal should appear showing available folders
    When I select "Documents" and tap "Move here"
    Then the file should move to the Documents folder
    And the file list should refresh

  Scenario: Move modal excludes current folder and the item itself
    Given "Quick Notes.txt" is in "My Drive"
    When I open the move modal for it
    Then "My Drive" should NOT be in the folder list
    And the Bin folder should NOT be in the list

  # ── Star / Unstar ──

  Scenario: Starring a file
    Given "Quick Notes.txt" is not starred
    When I open the action sheet and tap "Star"
    Then the file should become starred
    And the star indicator should appear on the file
    And the action sheet should close

  Scenario: Unstarring a file
    Given "School Policy 2025.pdf" is starred
    When I open the action sheet and tap "Unstar"
    Then the file should become unstarred
    And the star indicator should disappear

  # ── Share ──

  Scenario: Sharing a file shows confirmation
    When I tap "Share" in the action sheet
    Then I should see a confirmation alert "Share link copied to clipboard"

  # ── Download / Save ──

  Scenario: Saving a file shows confirmation
    When I tap "Save" in the action sheet
    Then I should see a confirmation alert "has been saved to your device"

  # ── Delete / Bin ──

  Scenario: Moving a file to bin
    Given "Quick Notes.txt" is in My Drive
    When I open the action sheet and tap "Bin"
    Then the file should be moved to the Bin
    And it should disappear from the current view
    And the file list should refresh

  Scenario: Viewing bin items
    When I navigate to the "Bin" section
    Then I should see previously deleted files
    And each item should show "Restore" and "Delete permanently" actions

  Scenario: Restoring a file from bin
    Given I am in the Bin section
    And "Old Timetable.pdf" is in the bin
    When I open its action sheet and tap "Restore"
    Then the file should be restored to its original folder
    And it should disappear from the Bin

  Scenario: Permanently deleting a file
    Given I am in the Bin section
    When I open the action sheet for "Draft Letter.docx" and tap "Delete permanently"
    Then the file should be permanently removed
    And it should not appear anywhere in the drive

  # ── New Folder ──

  Scenario: Creating a new folder via FAB
    When I tap the FAB (+) button
    Then the new folder modal should appear
    When I type "Projects" and tap Create
    Then a new "Projects" folder should appear in the current directory

  Scenario: Empty folder name is rejected
    When I open the new folder modal
    And the folder name input is empty
    Then the Create button should be disabled
