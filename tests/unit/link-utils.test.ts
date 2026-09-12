import { describe, it, expect } from "vitest";
import { normalizeUrl, isValidUrl, isDangerousUrl, linkDisplayLabel, hasLink } from "@/lib/link-utils";

describe("normalizeUrl", () => {
  it("adds https:// to a bare domain", () => {
    expect(normalizeUrl("educo.com")).toBe("https://educo.com");
    expect(normalizeUrl("www.educo.com/path")).toBe("https://www.educo.com/path");
  });

  it("respects an explicit scheme", () => {
    expect(normalizeUrl("http://x.com")).toBe("http://x.com");
    expect(normalizeUrl("https://x.com")).toBe("https://x.com");
    expect(normalizeUrl("mailto:a@b.com")).toBe("mailto:a@b.com");
    expect(normalizeUrl("tel:+123")).toBe("tel:+123");
  });

  it("turns a bare email into mailto:", () => {
    expect(normalizeUrl("teacher@educo.edu")).toBe("mailto:teacher@educo.edu");
  });

  it("leaves relative and anchor links alone", () => {
    expect(normalizeUrl("/students")).toBe("/students");
    expect(normalizeUrl("#section")).toBe("#section");
  });

  it("trims and handles blanks", () => {
    expect(normalizeUrl("  educo.com  ")).toBe("https://educo.com");
    expect(normalizeUrl("")).toBe("");
    expect(normalizeUrl("   ")).toBe("");
  });
});

describe("isDangerousUrl — XSS guard", () => {
  it("blocks script-ish schemes", () => {
    expect(isDangerousUrl("javascript:alert(1)")).toBe(true);
    expect(isDangerousUrl("data:text/html,<script>")).toBe(true);
    expect(isDangerousUrl("vbscript:msgbox")).toBe(true);
  });

  it("blocks obfuscated variants (whitespace/case)", () => {
    expect(isDangerousUrl("JavaScript:alert(1)")).toBe(true);
    expect(isDangerousUrl("java\nscript:alert(1)")).toBe(true);
    expect(isDangerousUrl("  javascript :alert(1)")).toBe(true);
  });

  it("allows normal links", () => {
    expect(isDangerousUrl("https://educo.com")).toBe(false);
    expect(isDangerousUrl("mailto:a@b.com")).toBe(false);
  });
});

describe("isValidUrl", () => {
  it("accepts real links", () => {
    expect(isValidUrl("educo.com")).toBe(true);
    expect(isValidUrl("https://educo.com/a/b?c=1")).toBe(true);
    expect(isValidUrl("teacher@educo.edu")).toBe(true);
    expect(isValidUrl("/relative")).toBe(true);
    expect(isValidUrl("#anchor")).toBe(true);
    expect(isValidUrl("http://localhost:3000")).toBe(true);
  });

  it("rejects blanks and junk", () => {
    expect(isValidUrl("")).toBe(false);
    expect(isValidUrl("   ")).toBe(false);
    expect(isValidUrl("not a url")).toBe(false);
  });

  it("rejects dangerous schemes", () => {
    expect(isValidUrl("javascript:alert(1)")).toBe(false);
    expect(isValidUrl("data:text/html,x")).toBe(false);
  });
});

describe("linkDisplayLabel", () => {
  it("strips scheme, www, query and trailing slash", () => {
    expect(linkDisplayLabel("https://www.educo.com/students/?tab=1")).toBe("educo.com/students");
    expect(linkDisplayLabel("https://educo.com/")).toBe("educo.com");
  });

  it("truncates long links", () => {
    const label = linkDisplayLabel("https://educo.com/" + "a".repeat(80), 20);
    expect(label.length).toBeLessThanOrEqual(20);
    expect(label.endsWith("…")).toBe(true);
  });

  it("handles blanks", () => {
    expect(linkDisplayLabel("")).toBe("");
  });
});

describe("hasLink", () => {
  it("is true for a url or an in-document target", () => {
    expect(hasLink({ url: "https://x.com" })).toBe(true);
    expect(hasLink({ targetId: "slide-1" })).toBe(true);
  });
  it("is false for empty values", () => {
    expect(hasLink(null)).toBe(false);
    expect(hasLink({})).toBe(false);
    expect(hasLink({ url: "   " })).toBe(false);
  });
});
