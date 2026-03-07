@admin @parents
Feature: Admin Portal - Parent Management
  As an admin user
  I want to manage parents in the admin portal
  So that I can view, search, filter, and sort parent records

  Background:
    Given the admin has navigated to the parents page "/admin/parents"

  Scenario: Admin loads the parents page
    Then the URL should match the admin parents route
    And the page body should be visible

  Scenario: Admin views the parent list
    Then a table or grid of parents should be visible

  Scenario: Admin searches parents by name
    When the admin types "Emeka" into the search input
    Then the results should filter to match the search term

  Scenario: Admin toggles between grid and list view
    When the admin clicks the view toggle button
    Then the view should switch between grid and list

  Scenario: Admin opens the filter dropdown
    When the admin clicks the filter button
    Then the filter dropdown should appear

  Scenario: Admin opens the sort dropdown
    When the admin clicks the sort button
    Then the sort dropdown should appear

  # -------------------------------------------------------------------
  @detail
  Feature: Admin Portal - Parent Detail

  Scenario: Admin navigates to a parent detail page
    Given the admin is on the parents list page "/admin/parents"
    And there is a parent link visible
    When the admin clicks on the first parent card or row
    Then the URL should navigate to the parent detail page

  # -------------------------------------------------------------------
  @responsive
  Feature: Admin Parents - Responsive Layout

  Scenario: Admin parents page renders without overflow
    Given the admin navigates to the parents page "/admin/parents"
    Then the page body should be visible without horizontal overflow
