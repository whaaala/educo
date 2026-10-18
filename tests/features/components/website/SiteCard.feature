Feature: A site's card in the list of my websites
  Each website I have made is shown as a card with its name, how many pages it has and when it was last changed.
  Pressing the card opens the site; its actions menu deletes it without opening it.
  Guards: tests/components/website/SiteCard.test.tsx

  Scenario: The card says what the site is
    Given a site called "Greenfield Academy" with its home page, last changed 2 minutes ago
    Then its card shows "Greenfield Academy", "1 page" and "2m ago"

  Scenario: Pressing the card opens the site
    When I press the "Open Greenfield Academy" card
    Then that site opens in the builder

  Scenario: The actions menu opens the site, and only opens it
    When I open "Actions for Greenfield Academy" and choose Open
    Then that site opens in the builder, once
    And it is not deleted, and the menu closes

  Scenario: The actions menu deletes the site, and only deletes it
    When I open "Actions for Greenfield Academy" and choose Delete
    Then the site is deleted once
    And the site is not opened as well
