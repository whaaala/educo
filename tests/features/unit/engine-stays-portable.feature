Feature: The builder's engine stays portable to the phone and tablet app
  The engine — lib/box-model.ts and lib/box-export.ts — is what the phone and tablet builder will be built on, with
  the page itself shown in a WebView over the real exported HTML (CLAUDE.md rule 20). That only stays true while the
  engine keeps out of React and out of the browser, except in a short, named list of functions: the porting surface.
  Guards: tests/unit/engine-stays-portable.test.ts

  Scenario: The engine never brings React in at run time
    When the engine's files are read
    Then any React they import is imported as a type only, which disappears when the code is built

  Scenario: Only the named functions reach for the browser
    When the engine's running code is read, leaving out comments and the text of scripts it writes for the page
    Then every function that touches the document, the window, the page's styles, a picture loader or a file reader
      is on the allowed list
    And a function that reaches for the browser and is not on the list is named as the one that cannot come to the app

  Scenario: The allowed list cannot go stale
    Then every name on the allowed list is still a function in the engine
    Because a renamed function would otherwise be forgiven under its old name while the new one went unchecked
