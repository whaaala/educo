Feature: Upload Progress Indicator
  As a user
  I want to see upload progress for files and folders
  So that I know the status of my uploads

  Scenario: Upload toast appears at bottom-right when upload starts
    When an upload begins
    Then a toast should appear at the bottom-right of the screen
    And it should show "Uploading N items" as the title
    And it should show estimated time remaining

  Scenario: Progress updates in real-time
    Given 3 files are uploading
    When 1 file completes
    Then the progress should show "1 of 3"
    And the progress bar should update to 33%

  Scenario: Upload completes successfully
    When all files finish uploading
    Then the toast should show a success state
    And it should auto-dismiss after 3 seconds

  Scenario: Cancel button pauses upload and shows confirmation
    When I click "Cancel" on the upload toast
    Then onPause should be called to pause the upload
    And a confirmation dialog should appear
    And it should ask "Cancel upload?"
    And show "Continue upload" and "Cancel upload" buttons
    And the upload progress should freeze (not advance)

  Scenario: Continue upload resumes the paused upload
    Given the cancel confirmation is shown and upload is paused
    When I click "Continue upload"
    Then onResume should be called
    And the confirmation dialog should close
    And the upload should resume from where it paused

  Scenario: Cancel upload stops and clears the upload
    Given the cancel confirmation is shown and upload is paused
    When I click "Cancel upload"
    Then onCancel should be called
    And all upload timers should be cleared
    And the upload toast should be dismissed

  Scenario: Collapse/expand toggle
    When I click the collapse chevron
    Then the file list should collapse
    When I click it again
    Then the file list should expand

  Scenario: Close button dismisses the toast
    When I click the X button
    Then the upload toast should be dismissed

  @visual
  Scenario: Toast matches Google Drive upload indicator style
    Then the toast should be fixed to bottom-right
    And it should have a white card with shadow
    And it should show file icon, name, and progress per file
    And the progress bar should be blue/green
