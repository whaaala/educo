Feature: The WhatsApp webhook refuses what it cannot verify (RA-5, BATCH A-1)
  As a school whose parents message it on WhatsApp
  I want the webhook to accept only what Meta really sent
  So that nobody can register the endpoint with a guessed token or post forged messages

  # GET — Meta's one-time verification

  Scenario: No verify token is configured
    Given WHATSAPP_WEBHOOK_VERIFY_TOKEN is not set
    When Meta's verification request arrives with the old default token "educo_whatsapp_webhook"
    Then the webhook refuses it with 403

  Scenario: The verify token does not match
    Given WHATSAPP_WEBHOOK_VERIFY_TOKEN is "s3cret"
    When a verification request arrives with the token "guess"
    Then the webhook refuses it with 403

  Scenario: The verify token matches
    Given WHATSAPP_WEBHOOK_VERIFY_TOKEN is "s3cret"
    When a verification request arrives with the token "s3cret" and the challenge "12345"
    Then the webhook answers 200 with the body "12345"

  # POST — every message and status update

  Scenario: No app secret is configured
    Given WHATSAPP_APP_SECRET is not set
    When a POST arrives, however it is signed
    Then the webhook refuses it with 401

  Scenario: The signature header is missing
    Given WHATSAPP_APP_SECRET is "appsecret"
    When a POST arrives with no X-Hub-Signature-256 header
    Then the webhook refuses it with 401

  Scenario: The signature is wrong
    Given WHATSAPP_APP_SECRET is "appsecret"
    When a POST arrives signed with a different secret
    Then the webhook refuses it with 401

  Scenario: The body was changed after signing
    Given WHATSAPP_APP_SECRET is "appsecret"
    When a POST arrives whose body differs by one byte from what was signed
    Then the webhook refuses it with 401

  Scenario: A correctly signed POST
    Given WHATSAPP_APP_SECRET is "appsecret"
    When a POST arrives signed with "appsecret" over its exact body
    Then the webhook answers 200 "received"

  # A1-3 — the server log holds no personal data

  Scenario: The log holds no phone number, name, message text or token
    Given a correctly signed POST carrying a parent's number, name and message
    When the webhook processes it
    Then nothing it logs contains the number, the name, the message text or the verify token
