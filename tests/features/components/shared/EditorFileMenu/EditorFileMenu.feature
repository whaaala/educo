Feature: Reusable Editor File Menu
  As a workspace editor (presentations, documents, spreadsheets)
  I want a composable File menu built from reusable item factories
  So that all workspace editors share consistent File menu behavior

  Background:
    Given a File menu built from EditorFileMenu factories

  # ── Individual Menu Item Factories ──

  Scenario: New menu with workspace-specific items
    Given the workspace provides "Presentation" and "From template gallery" as New submenu items
    Then the "New" item should have a submenu with 2 items
    And the submenu should contain "Presentation" and "From template gallery"

  Scenario: New menu without workspace config
    Given no workspace config is provided for New
    Then the "New" item should be a simple clickable item (no submenu)

  Scenario: Open item displays keyboard shortcut
    Then the "Open" item should show shortcut "Ctrl+O"

  Scenario: Share submenu contains sharing options
    Then the "Share" item should have a submenu with:
      | label              |
      | Share with others  |
      | Publish            |

  Scenario: Email submenu contains email options
    Then the "Email" item should have a submenu with:
      | label               |
      | Email this file     |
      | Email collaborators |

  Scenario: Download item is present
    Then the menu should contain a "Download" item

  Scenario: Convert to video is workspace-specific
    Given the workspace sets showConvertToVideo to true
    Then the menu should contain a "Convert to video" item

  Scenario: Convert to video is hidden by default
    Given the workspace does not set showConvertToVideo
    Then the menu should NOT contain a "Convert to video" item

  Scenario: Star toggle shows correct label when not starred
    Given the file is not starred
    Then the star item label should be "Add to starred"

  Scenario: Star toggle shows correct label when starred
    Given the file is starred
    Then the star item label should be "Remove from starred"

  Scenario: Location shows current folder
    Given the current folder is "Presentations"
    Then the location item label should be "Location: Presentations"

  Scenario: Version history submenu
    Then the "Version history" item should have a submenu with:
      | label                | shortcut           |
      | Name current version |                    |
      | See version history  | Ctrl+Alt+Shift+H   |

  Scenario: Language item uses workspace-specific label
    Given the workspace sets languageLabel to "Slide language"
    Then the menu should contain a "Slide language" item

  Scenario: Language item uses different workspace label
    Given the workspace sets languageLabel to "Document language"
    Then the menu should contain a "Document language" item

  # ── File Management Group ──

  Scenario: File management group contains 5 items
    Then the file management group should contain:
      | label                |
      | Rename               |
      | Move                 |
      | Add to starred       |
      | Location: My Drive   |
      | Move to bin          |

  # ── Info Group ──

  Scenario: Info group includes all items when configured
    Given languageLabel is "Slide language" and showPageSetup is true
    Then the info group should contain:
      | label                |
      | Details              |
      | Sharing permissions  |
      | Slide language       |
      | Page setup           |

  Scenario: Info group excludes language when not configured
    Given no languageLabel is set
    Then the info group should NOT contain a language item

  Scenario: Info group excludes page setup when disabled
    Given showPageSetup is false
    Then the info group should NOT contain "Page setup"

  # ── Print Group ──

  Scenario: Print group contains preview and print
    Then the print group should contain:
      | label         | shortcut |
      | Print preview |          |
      | Print         | Ctrl+P   |

  # ── Full Menu Composition ──

  Scenario: Presentation editor file menu contains all expected items
    Given the workspace is configured for presentations
    Then the File menu should contain these items in order:
      | label                  |
      | New                    |
      | Open                   |
      | Import slides          |
      | Make a copy            |
      | Share                  |
      | Email                  |
      | Download               |
      | Convert to video       |
      | Rename                 |
      | Move                   |
      | Add to starred         |
      | Location: Presentations|
      | Move to bin            |
      | Version history        |
      | Details                |
      | Sharing permissions    |
      | Slide language         |
      | Page setup             |
      | Print preview          |
      | Print                  |

  Scenario: Document editor file menu omits presentation-specific items
    Given the workspace is configured for documents
    Then the File menu should NOT contain "Convert to video"
    And the File menu should NOT contain "Import slides"
    And the File menu should contain "Document language"

  Scenario: Menu items fire correct actions when clicked
    When I click the "Download" item
    Then the onAction callback should receive "file:download"
    When I click the "Rename" item
    Then the onAction callback should receive "file:rename"
    When I click the "Print" item
    Then the onAction callback should receive "file:print"

  Scenario: Menu sections are separated by dividers
    Then there should be at least 5 dividers in the menu

  Scenario: Extra workspace items can be injected
    Given the workspace provides extra items
    Then those extra items should appear in the menu
