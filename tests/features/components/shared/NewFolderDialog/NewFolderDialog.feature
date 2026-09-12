Feature: New Folder Dialog
  As a user
  I want a modal dialog to create new folders
  So that I can organize my files with a clean, focused experience

  Scenario: Dialog opens with pre-filled "Untitled folder" name
    When the dialog opens
    Then the title should say "New folder"
    And the input should be pre-filled with "Untitled folder"
    And the text should be auto-selected for easy replacement

  Scenario: Create button creates the folder and closes
    When I type "Reports" and click "Create"
    Then onSubmit should be called with "Reports"
    And the dialog should close

  Scenario: Cancel button closes without creating
    When I click "Cancel"
    Then onSubmit should NOT be called
    And the dialog should close

  Scenario: Enter key submits the form
    When I type "Archive" and press Enter
    Then onSubmit should be called with "Archive"

  Scenario: Escape key cancels
    When I press Escape
    Then the dialog should close without creating

  Scenario: Create button is disabled when input is empty
    When the input is cleared to empty
    Then the "Create" button should be disabled

  @visual
  Scenario: Dialog matches application modal style
    Then the dialog should use the existing Modal component pattern
    And it should have a centered layout with backdrop blur
    And the input should have focus ring animation
    And Cancel and Create buttons should match the app design system
