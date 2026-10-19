import { describe, it, expect } from "vitest";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * The archive pass stores everything a page loads, once (the user, 2026-10-19: "once you do it once, we don't want to do
 * anything"), and indexes every component for the component work. The file names, the manifest and the selectors are
 * what a later session reads instead of the internet — so they are pinned here.
 */
const require = createRequire(import.meta.url);
const { assetFile, mergeManifest, keepBody } = require("../../scripts/research/section-kinds.js") as {
  assetFile: (url: string, contentType?: string) => string;
  mergeManifest: (old: Record<string, { file: string; status: number }>, add: Record<string, { file: string; status: number }>) => Record<string, { file: string; status: number }>;
  keepBody: (type: string, status: number, bytes: number) => boolean;
};
const config = require("../../config/research.json") as {
  capture: { types: string[]; mediaMaxMB: number };
  components: { selectors: Record<string, string>; perPage: number; htmlMaxChars: number };
};

describe("the archive pass stores everything once (LE-15)", () => {
  it("a file is named by its address, the same every time, with its kind's extension", () => {
    const a = assetFile("https://x.com/a/main.css?v=2", "text/css");
    expect(a).toBe(assetFile("https://x.com/a/main.css?v=2", "text/css"));
    expect(a).not.toBe(assetFile("https://x.com/a/main.css?v=3", "text/css"));
    expect(a).toMatch(/^assets\/[0-9a-f]{16}\.css$/);
    expect(assetFile("https://x.com/i", "image/webp")).toMatch(/\.webp$/);
    expect(assetFile("https://x.com/app.js", "")).toMatch(/\.js$/);
  });

  it("the manifest keeps every address once, and a stored file is never replaced by a failed fetch", () => {
    const m = mergeManifest({ "u1": { file: "assets/a.css", status: 200 } }, { "u1": { file: "", status: 404 }, "u2": { file: "", status: 404 } });
    expect(m.u1).toEqual({ file: "assets/a.css", status: 200 });
    expect(m.u2.status).toBe(404);
    expect(Object.keys(m)).toHaveLength(2);
  });

  it("a big media file is listed, not stored; a failed one is not stored", () => {
    const big = config.capture.mediaMaxMB * 1024 * 1024 + 1;
    expect(keepBody("media", 200, big)).toBe(false);
    expect(keepBody("image", 200, big)).toBe(true);
    expect(keepBody("stylesheet", 404, 10)).toBe(false);
    expect(keepBody("stylesheet", 200, 10)).toBe(true);
    expect(keepBody("document", 200, 10)).toBe(false);
  });

  it("every component selector is valid CSS, and the main components are all indexed", () => {
    for (const [name, sel] of Object.entries(config.components.selectors)) expect(() => document.querySelectorAll(sel), name).not.toThrow();
    for (const k of ["navigation", "accordion", "tabs", "carousel", "dialog", "form", "card", "pricing", "testimonial", "map", "video", "search", "breadcrumb", "pagination", "footer"])
      expect(config.components.selectors[k], k).toBeTruthy();
    expect(config.components.perPage).toBeGreaterThan(0);
  });

  it("every crawler runs real Chrome, headless or not (LE15-16)", () => {
    for (const f of ["crawl.js", "section-kinds.js"]) {
      const src = readFileSync(resolve(__dirname, "../../scripts/research", f), "utf8").replace(/\r\n/g, "\n");
      const launch = src.slice(src.indexOf("chromium.launch({"), src.indexOf("})", src.indexOf("chromium.launch({")));
      expect(launch, f).toContain("channel: 'chrome'");
    }
  });

  it("a site is followed to where its home ends up, and adopts its links' language (LE15-18)", () => {
    const { siteHost, langStep } = require("../../scripts/research/crawl.js") as {
      siteHost: (finalUrl: string) => string;
      langStep: (first: string, homeLang: string) => { follow: boolean; lang: string };
    };
    expect(siteHost("https://www.habitsupps.com/en-US")).toBe("habitsupps.com");
    expect(langStep("en", "")).toEqual({ follow: true, lang: "en" });
    expect(langStep("fr", "en")).toEqual({ follow: false, lang: "en" });
    expect(langStep("en", "en")).toEqual({ follow: true, lang: "en" });
    expect(langStep("cases", "")).toEqual({ follow: true, lang: "" });
    expect(langStep("en-us", "")).toEqual({ follow: true, lang: "en-us" });
    const crawl = readFileSync(resolve(__dirname, "../../scripts/research/crawl.js"), "utf8").replace(/\r\n/g, "\n");
    expect(crawl).toContain("origin = siteHost(p.url())");
    expect(crawl).toContain("}, { origin });");
  });
});
