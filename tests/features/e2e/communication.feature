@communication
Feature: Communication
  As a user of the Educo platform
  I want to access messaging, chat, and communication settings
  So that I can communicate effectively with parents and administrators

  # -------------------------------------------------------------------
  @admin @messages
  Scenario: Admin navigates to the parent messages page
    Given the admin navigates to "/admin/parents/messages"
    Then the page body should be visible

  Scenario: Admin navigates to the compose message page
    Given the admin navigates to "/admin/parents/messages/compose"
    Then the page body should be visible

  # -------------------------------------------------------------------
  @admin @chat
  Scenario: Admin navigates to the parent chat page
    Given the admin navigates to "/admin/parents/chat"
    Then the page body should be visible

  Scenario: Admin navigates to the compose chat page
    Given the admin navigates to "/admin/parents/chat/compose"
    Then the page body should be visible

  # -------------------------------------------------------------------
  @parent @messages
  Scenario: Parent navigates to the messages page
    Given the parent navigates to "/parents/messages"
    Then the page body should be visible

  Scenario: Parent navigates to the compose message page
    Given the parent navigates to "/parents/messages/compose"
    Then the page body should be visible

  # -------------------------------------------------------------------
  @parent @chat
  Scenario: Parent navigates to the chat page
    Given the parent navigates to "/parents/chat"
    Then the page body should be visible

  Scenario: Parent navigates to the compose chat page
    Given the parent navigates to "/parents/chat/compose"
    Then the page body should be visible

  # -------------------------------------------------------------------
  @settings
  Scenario: Admin navigates to the communication settings page
    Given the admin navigates to "/admin/settings/communication"
    Then the page body should be visible

  Scenario: User navigates to the communication settings page
    Given the user navigates to "/settings/communication"
    Then the page body should be visible

  # -------------------------------------------------------------------
  @responsive
  Scenario: Messages page renders correctly on mobile
    Given the viewport is set to mobile dimensions 375x812
    And the admin navigates to "/admin/parents/messages"
    Then the page body should be visible

  Scenario: Chat page renders correctly on tablet
    Given the viewport is set to tablet dimensions 768x1024
    And the admin navigates to "/admin/parents/chat"
    Then the page body should be visible
