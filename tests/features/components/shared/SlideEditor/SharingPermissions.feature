Feature: Slide Editor Sharing Permissions
  As a presentation owner
  I want to control security and sharing permissions
  So that I can protect my presentation content

  Background:
    Given the slide editor is loaded with a presentation
    And I open File > Sharing permissions

  # ── Dialog UI ──

  Scenario: Permissions dialog shows three toggle settings
    Then I should see a dialog titled "Sharing Permissions"
    And it should show three permission toggles:
      | Setting                              | Description                                                              |
      | Prevent editors from changing access | Only you can manage sharing permissions. Editors cannot add or remove collaborators. |
      | Disable copy, print, and download    | Viewers and commenters cannot copy, print, or download this presentation. |
      | Require sign-in to view              | Only signed-in users can access this file. Anonymous access is blocked.   |

  Scenario: Toggles switch on and off when clicked
    When I click the toggle for "Prevent editors from changing access"
    Then the toggle should switch to ON with blue styling
    And the row should have a blue border and background tint
    When I click the toggle again
    Then the toggle should switch to OFF with gray styling

  Scenario: Clicking Save persists permissions
    When I toggle "Disable copy, print, and download" ON
    And I click "Save Permissions"
    Then the dialog should close
    And the permissions should be saved to storage
    When I reopen Sharing permissions
    Then "Disable copy, print, and download" should still be ON

  Scenario: Clicking Cancel discards changes
    When I toggle "Prevent editors from changing access" ON
    And I click "Cancel"
    Then the dialog should close
    And the permission should NOT be saved
    When I reopen Sharing permissions
    Then "Prevent editors from changing access" should still be OFF

  # ── Prevent Access Change Enforcement ──

  Scenario: Share button is blocked when prevent-access-change is ON
    Given "Prevent editors from changing access" is enabled
    When I click the Share button in the header
    Then I should see an alert "Sharing permissions are locked"
    And the Share dialog should NOT open

  Scenario: File > Share is blocked when prevent-access-change is ON
    Given "Prevent editors from changing access" is enabled
    When I click File > Share > Share with others
    Then I should see an alert "Sharing permissions are locked"

  Scenario: File > Publish is blocked when prevent-access-change is ON
    Given "Prevent editors from changing access" is enabled
    When I click File > Share > Publish
    Then I should see an alert about locked permissions

  # ── Disable Copy/Print/Download Enforcement ──

  Scenario: Copy is blocked when disabled
    Given "Disable copy, print, and download" is enabled
    When I try to copy text (Ctrl+C or Edit > Copy)
    Then I should see an alert "Copy is disabled by the document owner"
    And the clipboard should NOT be modified

  Scenario: Cut is blocked when disabled
    Given "Disable copy, print, and download" is enabled
    When I try to cut text (Ctrl+X or Edit > Cut)
    Then I should see an alert "Copy is disabled by the document owner"

  Scenario: Print is blocked when disabled
    Given "Disable copy, print, and download" is enabled
    When I click File > Print
    Then I should see an alert "Printing is disabled by the document owner"
    And the print dialog should NOT open

  Scenario: Download is blocked when disabled
    Given "Disable copy, print, and download" is enabled
    When I click File > Download
    Then I should see an alert "Downloading is disabled by the document owner"
    And the download dialog should NOT open

  Scenario: Text selection is disabled when copy is disabled
    Given "Disable copy, print, and download" is enabled
    Then text in the slide editor should NOT be selectable (user-select: none)

  Scenario: Right-click copy is blocked
    Given "Disable copy, print, and download" is enabled
    When I right-click and try to copy
    Then the copy event should be prevented

  Scenario: Restricted badge shows in header
    Given "Disable copy, print, and download" is enabled
    Then a "Restricted" badge should appear in the editor header
    And it should have a red shield icon

  # ── Require Sign-in Enforcement ──

  Scenario: Sign-in required badge shows in header
    Given "Require sign-in to view" is enabled
    Then a "Sign-in required" badge should appear in the editor header
    And it should have an amber lock icon

  Scenario: Sign-in required badge hides when disabled
    Given "Require sign-in to view" is disabled
    Then the "Sign-in required" badge should NOT appear

  # ── Persistence ──

  Scenario: Permissions persist across page reloads
    Given I set "Disable copy, print, and download" to ON
    And I save permissions
    When I reload the page
    Then "Disable copy, print, and download" should still be ON
    And text should still not be selectable
    And the "Restricted" badge should still show

  Scenario: Default permissions for new presentations
    Given I create a new presentation
    Then "Prevent editors from changing access" should be OFF
    And "Disable copy, print, and download" should be OFF
    And "Require sign-in to view" should be ON
