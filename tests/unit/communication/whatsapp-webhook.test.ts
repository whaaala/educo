/**
 * RA-5 (BATCH A-1): the WhatsApp webhook accepts only what Meta really sent.
 * Scenarios: tests/features/unit/communication/whatsapp-webhook.feature
 */
import { createHmac } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { GET, POST } from "@/app/api/webhooks/whatsapp/route";

const URL_BASE = "http://localhost/api/webhooks/whatsapp";
const sign = (body: string, secret: string) => `sha256=${createHmac("sha256", secret).update(body).digest("hex")}`;

const verify = (token: string, challenge = "12345") =>
  GET(new NextRequest(`${URL_BASE}?hub.mode=subscribe&hub.verify_token=${token}&hub.challenge=${challenge}`));

const post = (body: string, signature?: string) =>
  POST(new NextRequest(URL_BASE, {
    method: "POST",
    body,
    headers: signature ? { "x-hub-signature-256": signature, "content-type": "application/json" } : { "content-type": "application/json" },
  }));

const PARENT = { number: "2348012345678", name: "Adaeze Okafor", text: "Is school open tomorrow?" };
const payload = JSON.stringify({
  object: "whatsapp_business_account",
  entry: [{ changes: [{ field: "messages", value: {
    metadata: { phone_number_id: "PNID", display_phone_number: "234800000000" },
    contacts: [{ profile: { name: PARENT.name }, wa_id: PARENT.number }],
    messages: [{ id: "wamid.1", from: PARENT.number, timestamp: "1700000000", type: "text", text: { body: PARENT.text } }],
  } }] }],
});

beforeEach(() => {
  vi.unstubAllEnvs();
  vi.spyOn(console, "log").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
});
afterEach(() => { vi.unstubAllEnvs(); vi.restoreAllMocks(); });

describe("GET — Meta's verification", () => {
  it("refuses the old default token when no verify token is configured", async () => {
    vi.stubEnv("WHATSAPP_WEBHOOK_VERIFY_TOKEN", "");
    expect((await verify("educo_whatsapp_webhook")).status).toBe(403);
  });
  it("refuses a token that does not match", async () => {
    vi.stubEnv("WHATSAPP_WEBHOOK_VERIFY_TOKEN", "s3cret");
    expect((await verify("guess")).status).toBe(403);
  });
  it("echoes the challenge when the token matches", async () => {
    vi.stubEnv("WHATSAPP_WEBHOOK_VERIFY_TOKEN", "s3cret");
    const res = await verify("s3cret", "12345");
    expect(res.status).toBe(200);
    expect(await res.text()).toBe("12345");
  });
});

describe("POST — messages and status updates", () => {
  it("refuses every POST when no app secret is configured", async () => {
    vi.stubEnv("WHATSAPP_APP_SECRET", "");
    expect((await post(payload, sign(payload, ""))).status).toBe(401);
  });
  it("refuses a POST with no signature header", async () => {
    vi.stubEnv("WHATSAPP_APP_SECRET", "appsecret");
    expect((await post(payload)).status).toBe(401);
  });
  it("refuses a POST signed with a different secret", async () => {
    vi.stubEnv("WHATSAPP_APP_SECRET", "appsecret");
    expect((await post(payload, sign(payload, "other"))).status).toBe(401);
  });
  it("refuses a body changed by one byte after signing", async () => {
    vi.stubEnv("WHATSAPP_APP_SECRET", "appsecret");
    const sig = sign(payload, "appsecret");
    expect((await post(payload.replace("tomorrow", "tomorrov"), sig)).status).toBe(401);
  });
  it("refuses a correct signature with anything appended", async () => {
    vi.stubEnv("WHATSAPP_APP_SECRET", "appsecret");
    expect((await post(payload, `${sign(payload, "appsecret")}00`)).status).toBe(401);
  });
  it("accepts a POST signed over its exact body", async () => {
    vi.stubEnv("WHATSAPP_APP_SECRET", "appsecret");
    const res = await post(payload, sign(payload, "appsecret"));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ status: "received" });
  });
});

describe("A1-3 — the log holds no personal data", () => {
  it("logs no number, name, message text or token", async () => {
    vi.stubEnv("WHATSAPP_APP_SECRET", "appsecret");
    vi.stubEnv("WHATSAPP_WEBHOOK_VERIFY_TOKEN", "s3cret");
    await verify("s3cret");
    await post(payload, sign(payload, "appsecret"));
    const logged = [...vi.mocked(console.log).mock.calls, ...vi.mocked(console.error).mock.calls]
      .map((c) => c.map((a) => (typeof a === "string" ? a : JSON.stringify(a))).join(" ")).join("\n");
    expect(logged.length).toBeGreaterThan(0);
    for (const secret of [PARENT.number, PARENT.name, PARENT.text, "s3cret"]) expect(logged).not.toContain(secret);
  });
});
