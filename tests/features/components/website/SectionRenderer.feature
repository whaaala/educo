Feature: Editing a section's words on the page itself
  In the section builder the words of a section — its eyebrow, heading, subheading, button labels and each item's
  title — are typed straight onto the canvas. The edit reaches the site when I leave the words (or pause typing).
  A section that is only shown cannot be typed into.
  Guards: tests/components/website/inline-editing.test.tsx

  Scenario: A section that is only shown cannot be typed into
    Given a hero section that is shown, not edited
    Then none of its words can be typed into

  Scenario: An edited section's words can be typed into on the canvas
    Given a hero section being edited
    Then its eyebrow, heading, subheading and button labels can be typed into

  Scenario: A new heading reaches the site when I leave it
    Given a hero section being edited
    When I type "Our new headline" over its heading and click away
    Then the section's heading is "Our new headline"

  Scenario: Renaming one item keeps all the others
    Given a features section being edited
    When I type "Renamed program" over its first item's title and click away
    Then the first item is called "Renamed program"
    And the section still has every one of its items
