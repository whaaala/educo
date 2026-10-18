Feature: Create a new website — the name and the starting point
  The "Create site" dialog asks for the site's name and whether to begin from the starter pages or a blank site.
  A name left blank still makes a site, called "My School", so the dialog never refuses to create one.
  Guards: tests/components/website/CreateSiteModal.test.tsx

  Scenario: The dialog is not there until I open it
    Given the "Create site" dialog is closed
    Then no "Site name" field is shown

  Scenario: A site is made with the name I typed, from the starter pages
    Given the "Create site" dialog is open
    When I type "Sunrise School" as the site name and press Create
    Then a site called "Sunrise School" is made from the starter pages

  Scenario: A blank name still makes a site
    Given the "Create site" dialog is open
    When I press Create without typing a name
    Then a site called "My School" is made from the starter pages

  Scenario: I can start from a blank site instead
    Given the "Create site" dialog is open
    When I choose Blank, type "Blank Co" and press Create
    Then a blank site called "Blank Co" is made

  Scenario: Cancel closes the dialog
    Given the "Create site" dialog is open
    When I press Cancel
    Then the dialog closes and no site is made
