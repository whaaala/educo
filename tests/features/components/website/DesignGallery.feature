Feature: Design galleries I can see (RULE S)
  Every component shows its designs as small live pictures of itself, never as a row of names to imagine.
  The design that is on is shown large above the tiles, marked "Applied"; a block's style presets are shown the
  same way, beside a large picture of the block as it is now. The panel names what I selected, not what it is
  made of.
  Guards: tests/components/website/DesignGallery.test.tsx

  Scenario: The design that is on is shown large
    Given a gallery of two designs, Soft and Solid, with Solid applied
    Then a large picture of Solid is shown, marked "Applied"
    And no large picture of Soft is shown
    When the applied design is one the gallery does not know
    Then the first design, Soft, is shown large

  Scenario: Every design tile is a picture, not just a name
    Given a gallery of two designs, Soft and Solid
    Then each tile shows a small picture of its design

  Scenario: A screen reader hears which design is on, and a press picks another
    Given a gallery with Soft applied
    Then "Soft design" is announced as pressed and "Solid design" as not pressed
    When I press "Solid design"
    Then Solid is picked

  Scenario: A long gallery is split into named groups
    Given a gallery whose designs are in a group called "Signature"
    Then a screen reader hears that group as "Signature — Test designs"

  Scenario: Every component in the catalogue offers a gallery of pictures
    Given any component from the catalogue is selected
    When I open its Content tab
    Then it offers more than one design, and every design tile shows a picture of it
    And a component built from a preset offers exactly as many designs as it has presets

  Scenario: Style presets are shown as pictures, beside the block as it is now
    Given a plain section is selected
    Then its style presets are tiles that each show a picture of the section in that style
    And the large picture is the section as it is "Now"
    When I press "Card style"
    Then the section gets the card's shadow

  Scenario: The panel names what I selected
    Given any component from the catalogue is selected
    Then the panel reads "Editing:" followed by that component's name, never "Section"
    And a plain column of blocks reads "Editing: Stack"

  Scenario: A component's applied design is shown large in its own gallery
    Given an Alert with the Solid design is selected
    When I open its Content tab
    Then exactly one of the Alert's design groups holds the "Applied" design
