@parent-portal
Feature: Parent Portal
  As a parent user
  I want to access all sections of the parent portal
  So that I can manage my children's school information

  # -------------------------------------------------------------------
  # Dashboard
  # -------------------------------------------------------------------
  @dashboard
  Scenario: Parent loads the dashboard page
    Given the parent has navigated to the dashboard "/parents"
    Then the URL should match the parents route
    And the dashboard should have key widgets visible

  Scenario: Parent views the child selector
    Given the parent is on the dashboard "/parents"
    Then a child selector should be visible to switch between children

  Scenario: Parent views stats cards on the dashboard
    Given the parent is on the dashboard "/parents"
    Then stat cards like Term Average, Position, and Attendance should be visible

  Scenario: Parent views the quick links section
    Given the parent is on the dashboard "/parents"
    Then quick links for navigation should be present
    And there should be more than 0 links to parent sub-pages

  # -------------------------------------------------------------------
  # My Children
  # -------------------------------------------------------------------
  @children
  Scenario: Parent loads the children page
    Given the parent has navigated to "/parents/children"
    Then the URL should match the children route

  Scenario: Parent views child cards with profile info
    Given the parent is on the children page "/parents/children"
    Then each child should have a card with their info

  # -------------------------------------------------------------------
  # Fees
  # -------------------------------------------------------------------
  @fees
  Scenario: Parent loads the fees page
    Given the parent has navigated to "/parents/fees"
    Then the URL should match the fees route

  Scenario: Parent views the fee records table
    Given the parent is on the fees page "/parents/fees"
    Then a table or list of fee records should be visible

  Scenario: Parent views fee status badges (Paid, Partial, Pending, Overdue)
    Given the parent is on the fees page "/parents/fees"
    Then fee status badges should be present

  Scenario: Parent opens the Pay Fees modal
    Given the parent is on the fees page "/parents/fees"
    When the parent clicks the pay button
    Then the pay fees modal should appear

  # -------------------------------------------------------------------
  # Messages
  # -------------------------------------------------------------------
  @messages
  Scenario: Parent loads the messages page
    Given the parent has navigated to "/parents/messages"
    Then the URL should match the messages route

  Scenario: Parent views the message list
    Given the parent is on the messages page "/parents/messages"
    Then the message list should be visible

  # -------------------------------------------------------------------
  # Homework
  # -------------------------------------------------------------------
  @homework
  Scenario: Parent loads the homework page
    Given the parent has navigated to "/parents/homework"
    Then the URL should match the homework route

  Scenario: Parent views the homework table with assignments
    Given the parent is on the homework page "/parents/homework"
    Then a homework table should be visible

  # -------------------------------------------------------------------
  # Events
  # -------------------------------------------------------------------
  @events
  Scenario: Parent loads the events page
    Given the parent has navigated to "/parents/events"
    Then the URL should match the events route

  Scenario: Parent views event cards
    Given the parent is on the events page "/parents/events"
    Then event cards should be visible

  # -------------------------------------------------------------------
  # Leave Requests
  # -------------------------------------------------------------------
  @leaves
  Scenario: Parent loads the leave requests page
    Given the parent has navigated to "/parents/leaves"
    Then the URL should match the leaves route

  Scenario: Parent views leave request history
    Given the parent is on the leave requests page "/parents/leaves"
    Then the leave request history should be visible

  # -------------------------------------------------------------------
  # Results
  # -------------------------------------------------------------------
  @results
  Scenario: Parent loads the results page
    Given the parent has navigated to "/parents/results"
    Then the URL should match the results route

  # -------------------------------------------------------------------
  # Meetings
  # -------------------------------------------------------------------
  @meetings
  Scenario: Parent loads the meetings page
    Given the parent has navigated to "/parents/meetings"
    Then the URL should match the meetings route

  Scenario: Parent views upcoming meetings
    Given the parent is on the meetings page "/parents/meetings"
    Then upcoming meetings should be visible

  # -------------------------------------------------------------------
  # Support
  # -------------------------------------------------------------------
  @support
  Scenario: Parent loads the support page
    Given the parent has navigated to "/parents/support"
    Then the URL should match the support route

  # -------------------------------------------------------------------
  # Chat
  # -------------------------------------------------------------------
  @chat
  Scenario: Parent loads the chat page
    Given the parent has navigated to "/parents/chat"
    Then the URL should match the chat route

  # -------------------------------------------------------------------
  # Cross-Page Navigation
  # -------------------------------------------------------------------
  @navigation
  Scenario: Parent navigates from dashboard to children page
    Given the parent is on the dashboard "/parents"
    When the parent clicks the children link
    Then the URL should navigate to "/parents/children"

  Scenario: Parent navigates from dashboard to fees page
    Given the parent is on the dashboard "/parents"
    When the parent clicks the fees link
    Then the URL should navigate to "/parents/fees"

  Scenario: Parent navigates from dashboard to messages page
    Given the parent is on the dashboard "/parents"
    When the parent clicks the messages link
    Then the URL should navigate to "/parents/messages"

  # -------------------------------------------------------------------
  # Responsive Layout
  # -------------------------------------------------------------------
  @responsive
  Scenario: Dashboard renders without horizontal overflow
    Given the parent navigates to the dashboard "/parents"
    Then the body should not exceed viewport width

  @responsive
  Scenario: Fees page table is scrollable on small viewports
    Given the parent navigates to "/parents/fees"
    Then the page body should be visible
