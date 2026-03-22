Feature: Move Dialog
  As a user
  I want to move files and folders to different locations in my Drive
  So that I can organize my content effectively

  Background:
    Given the virtual file system has default folders "My Drive", "Documents", "Presentations", "Spreadsheets", "Images"
    And a presentation file "Quarterly Report" exists in the "Presentations" folder

  # ── Functional Scenarios ──

  Scenario: Dialog opens with file info and current location
    When I open the Move dialog for "Quarterly Report"
    Then the dialog title should be "Move to"
    And the subtitle should be "Choose a destination folder"
    And the file card should show the name "Quarterly Report"
    And the file card should show the current location "My Drive / Presentations"
    And the file card should show a presentation icon

  Scenario: Move button is disabled until a valid destination is selected
    When I open the Move dialog for "Quarterly Report"
    Then the "Move here" button should be disabled
    When I select the "Documents" folder
    Then the "Move here" button should be enabled

  Scenario: Current folder is marked and disabled
    When I open the Move dialog for "Quarterly Report"
    Then the "Presentations" folder should show a "Current" badge
    And the "Presentations" folder should be disabled

  Scenario: Successfully moving a file to a different folder
    When I open the Move dialog for "Quarterly Report"
    And I select the "Documents" folder
    And I click the "Move here" button
    Then a success snackbar should appear with message containing "Moved" and "Documents"
    And the dialog should close
    And the file "Quarterly Report" should now be in the "Documents" folder

  Scenario: Moving a file updates the parentId in storage
    Given the file "Quarterly Report" has parentId "folder-presentations"
    When I move "Quarterly Report" to the "Documents" folder
    Then the file "Quarterly Report" should have parentId "folder-documents"

  Scenario: Prevent moving a folder into itself
    Given a folder "Project A" exists in "My Drive"
    And a subfolder "Subproject" exists inside "Project A"
    When I attempt to move "Project A" into "Subproject"
    Then the move should fail with error "Cannot move a folder into itself or its subfolder"

  Scenario: Prevent moving into a read-only folder
    Given the "Shared with me" folder is read-only
    When I open the Move dialog for "Quarterly Report"
    Then the "Shared with me" folder should not appear as a selectable destination

  Scenario: Prevent moving to the same location
    When I open the Move dialog for "Quarterly Report"
    Then the "Presentations" folder should be disabled
    And the "Presentations" folder cannot be selected as destination

  # ── Folder Navigation ──

  Scenario: My Drive is expanded by default showing child folders
    When I open the Move dialog for "Quarterly Report"
    Then "My Drive" should be expanded
    And I should see "Documents", "Images", "Presentations", and "Spreadsheets" as child folders

  Scenario: Expanding and collapsing folders
    When I open the Move dialog for "Quarterly Report"
    And I click the expand chevron on "My Drive"
    Then "My Drive" should collapse and hide its children

  # ── Search ──

  Scenario: Searching filters folders by name
    When I open the Move dialog for "Quarterly Report"
    And I type "Doc" in the search field
    Then only "Documents" should be visible in the folder tree

  # ── New Folder Creation ──

  Scenario: Creating a new folder from the dialog
    When I open the Move dialog for "Quarterly Report"
    And I click "+ New folder"
    And I type "Archive" in the new folder name input
    And I press Enter
    Then a new folder "Archive" should be created under "My Drive"
    And "Archive" should be automatically selected as the destination

  # ── UI / Look and Feel ──

  @visual
  Scenario: Dialog has modern styling with proper visual hierarchy
    When I open the Move dialog for "Quarterly Report"
    Then the dialog should have a backdrop blur overlay
    And the dialog should have rounded corners (rounded-2xl)
    And the header icon should have a blue gradient background
    And the file card should have a bordered container with icon
    And folder items should have rounded icon backgrounds
    And the "Current" badge should be styled as a pill badge

  @visual
  Scenario: Selected folder has visual highlight
    When I open the Move dialog for "Quarterly Report"
    And I select the "Documents" folder
    Then the "Documents" folder should have a blue highlight ring
    And the "Move here" button should become blue with shadow
    And a "Moving to:" hint should appear in the footer

  @visual
  Scenario: Disabled folders appear dimmed
    When I open the Move dialog for "Quarterly Report"
    Then disabled folders should have reduced opacity (opacity-35)

  # ── Responsive ──

  @responsive
  Scenario: Dialog is responsive on mobile
    Given the viewport is 375px wide
    When I open the Move dialog for "Quarterly Report"
    Then the dialog should not exceed 94vw width
    And all content should be visible without horizontal scrolling

  # ── Snackbar ──

  Scenario: Success snackbar auto-dismisses after 4.5 seconds
    When I complete a move operation
    Then a success snackbar should appear
    And it should auto-dismiss after 4.5 seconds

  Scenario: Error snackbar shows on move failure
    Given the destination folder does not exist
    When I attempt the move
    Then an error snackbar should appear with the error message
