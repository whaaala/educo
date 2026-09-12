@whiteboard
Feature: Whiteboard
  As a user of the Educo platform
  I want to access whiteboard pages
  So that I can use interactive whiteboard functionality

  # -------------------------------------------------------------------
  # Whiteboard Page Navigation
  # -------------------------------------------------------------------

  Scenario: User navigates to standalone whiteboard page
    Given the user navigates to "/whiteboard"
    Then the page body should be visible

  Scenario: User navigates to classroom whiteboard page
    Given the user navigates to "/classroom/whiteboard"
    Then the page body should be visible

  # -------------------------------------------------------------------
  # Admin Whiteboard
  # -------------------------------------------------------------------
  @admin
  Scenario: User navigates to admin whiteboard page
    Given the user navigates to "/admin/whiteboard"
    Then the page body should be visible

  # -------------------------------------------------------------------
  # Responsive Layout
  # -------------------------------------------------------------------
  @responsive
  Scenario: Whiteboard renders on mobile viewport
    Given the viewport is set to mobile dimensions 375x812
    And the user navigates to "/whiteboard"
    Then the page body should be visible

  @responsive
  Scenario: Whiteboard renders on tablet viewport
    Given the viewport is set to tablet dimensions 768x1024
    And the user navigates to "/whiteboard"
    Then the page body should be visible
