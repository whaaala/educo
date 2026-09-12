Feature: Context menu action builder for whiteboard elements
  The buildContextMenuActions function produces the set of context-menu
  actions available when the user right-clicks on the whiteboard,
  adapting to selection state and grouping capabilities.

  # ── With Selection ──────────────────────────────────────────────

  Scenario: Order submenu is included when selection exists
    Given actions built with a selection
    Then the Order submenu should be present
    And it should have children and the label "Order"

  Scenario: Order submenu contains all four ordering items
    Given actions built with a selection
    Then the Order submenu should have 4 children
    And it should contain "bring-to-front", "bring-forward", "send-backward", and "send-to-back"

  Scenario: Rotate submenu is included when selection exists
    Given actions built with a selection
    Then the Rotate submenu should be present with children

  Scenario: Rotate submenu contains all four transform items
    Given actions built with a selection
    Then the Rotate submenu should have 4 children
    And it should contain "rotate-cw", "rotate-ccw", "flip-h", and "flip-v"

  Scenario: Copy and Duplicate actions are included
    Given actions built with a selection
    Then both Copy and Duplicate actions should be present

  Scenario: Delete action has danger flag
    Given actions built with a selection
    Then the Delete action should be present
    And it should be marked as danger

  Scenario: Group action is excluded when canGroup is false
    Given actions built with canGroup set to false
    Then the Group action should not be present

  Scenario: Group action is included when canGroup is true
    Given actions built with canGroup set to true
    Then the Group action should be present with label "Group"

  Scenario: Ungroup action is included when canUngroup is true
    Given actions built with canUngroup set to true
    Then the Ungroup action should be present with label "Ungroup"

  Scenario: Paste action is excluded when selection exists
    Given actions built with a selection
    Then the Paste action should not be present

  # ── Without Selection ───────────────────────────────────────────

  Scenario: Paste action is included when no selection
    Given actions built without a selection
    Then the Paste action should be present with label "Paste"

  Scenario: Insert image action is included when no selection
    Given actions built without a selection
    Then the Insert image action should be present with label "Insert image"

  Scenario: Selection-only actions are excluded when no selection
    Given actions built without a selection
    Then Order, Rotate, Copy, and Delete should not be present

  Scenario: Only Paste and Insert image actions exist without selection
    Given actions built without a selection
    Then there should be exactly 2 actions

  # ── Action Shortcuts ────────────────────────────────────────────

  Scenario: Copy action has Ctrl+C shortcut
    Given actions built with a selection
    Then the Copy action shortcut should be "Ctrl+C"

  Scenario: Duplicate action has Ctrl+D shortcut
    Given actions built with a selection
    Then the Duplicate action shortcut should be "Ctrl+D"

  Scenario: Delete action has Del shortcut
    Given actions built with a selection
    Then the Delete action shortcut should be "Del"

  Scenario: Paste action has Ctrl+V shortcut
    Given actions built without a selection
    Then the Paste action shortcut should be "Ctrl+V"

  Scenario: Group action has Ctrl+G shortcut
    Given actions built with canGroup set to true
    Then the Group action shortcut should be "Ctrl+G"

  Scenario: Ungroup action has Ctrl+Shift+G shortcut
    Given actions built with canUngroup set to true
    Then the Ungroup action shortcut should be "Ctrl+Shift+G"

  # ── Action Callbacks ────────────────────────────────────────────

  Scenario: Copy action invokes onCopy callback
    Given actions built with a custom onCopy handler
    When the copy action is invoked
    Then onCopy should have been called

  Scenario: Delete action invokes onDelete callback
    Given actions built with a custom onDelete handler
    When the delete action is invoked
    Then onDelete should have been called

  Scenario: Bring to front action invokes onBringToFront callback
    Given actions built with a custom onBringToFront handler
    When the bring-to-front action is invoked from the Order submenu
    Then onBringToFront should have been called

  Scenario: Rotate clockwise action invokes onRotateCW callback
    Given actions built with a custom onRotateCW handler
    When the rotate-cw action is invoked from the Rotate submenu
    Then onRotateCW should have been called

  Scenario: Paste action invokes onPaste callback from no-selection menu
    Given actions built without a selection and with a custom onPaste handler
    When the paste action is invoked
    Then onPaste should have been called
