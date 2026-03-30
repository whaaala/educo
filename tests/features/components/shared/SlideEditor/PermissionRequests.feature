Feature: Permission Request Flow
  As a user without copy/print/download access
  I want to request permission from the document owner
  So that I can get access to restricted actions

  Background:
    Given the slide editor is loaded
    And "Disable copy, print, and download" is enabled

  # ── Request Permission from Action Restricted Modal ──

  Scenario: Action Restricted modal shows Request Permission button
    When I try to copy (Ctrl+C)
    Then the Action Restricted modal should appear
    And it should show "Copying is disabled by the document owner"
    And it should show a "Request Permission" button with a send icon
    And it should show a "Close" button

  Scenario: Clicking Request Permission sends request and notification
    Given the Action Restricted modal is showing for a copy action
    When I click "Request Permission"
    Then a permission request should be saved to storage
    And a notification should be sent to the document owner
    And the modal should show a success message "Permission request sent!"
    And it should say "A notification and email have been sent to the document owner"
    And the "Request Permission" button should be replaced with "Done"

  Scenario: Request Permission works for print action
    When I click File > Print
    Then the Action Restricted modal should show for printing
    And I should be able to request print permission

  Scenario: Request Permission works for download action
    When I click File > Download
    Then the Action Restricted modal should show for downloading
    And I should be able to request download permission

  Scenario: Request Permission works for make a copy action
    When I click File > Make a copy > Entire presentation
    Then the Action Restricted modal should show for copying
    And I should be able to request copy permission

  Scenario: Duplicate request is prevented
    Given I already requested copy permission
    When I try to request copy permission again
    Then the existing request should be returned (not duplicated)

  # ── No Request Button for Non-Requestable Actions ──

  Scenario: Sharing lock does not show Request Permission button
    Given "Prevent editors from changing access" is enabled
    When I click the Share button
    Then the Action Restricted modal should appear
    But it should NOT show a "Request Permission" button
    And it should only show "Close"

  # ── Owner Receives Notification ──

  Scenario: Owner sees permission request in notification bell
    Given a user requested copy permission
    When the owner checks the notification bell
    Then they should see a "Permission Request" notification
    And it should show the requester's full name and username
    And it should show the permission type requested
    And it should link to the presentation

  # ── Owner Grants Permission ──

  Scenario: Owner approves permission request
    Given the owner views a pending permission request
    When they approve the request
    Then the request status should change to "approved"
    And a "Permission Granted" notification should be sent to the requester
    And the requester should receive an email notification

  Scenario: Owner denies permission request
    Given the owner views a pending permission request
    When they deny the request
    Then the request status should change to "denied"
    And a "Permission Denied" notification should be sent to the requester
