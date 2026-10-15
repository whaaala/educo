import { describe, it, expect } from "vitest";
import { primaryFamily, familiesInUse, googleCssUrl, fontUrls, embedFontCss, fontFiles, fontFileName, type Fetcher } from "@/lib/educo-ui/font-embed";
import { fontStacksInSite, fontFamiliesInSite, renderSiteFiles } from "@/lib/box-export";
import { DEFAULT_THEME } from "@/lib/site-storage";
import type { BoxSite } from "@/lib/box-site";
import type { BoxNode } from "@/lib/box-model";

/**
 * FONTS IN THE EXPORT.
 *
 * The builder loads ~48 Google families, so a school picks Poppins and sees Poppins. The exported site loaded
 * no font files at all, so every visitor got the browser's default sans-serif — the one design decision a
 * school is most likely to care about, discarded exactly where it mattered.
 */

describe("reading a font stack", () => {
  it("takes the family the school chose, not the fallback", () => {
    expect(primaryFamily("'DM Sans', sans-serif")).toBe("DM Sans");
    expect(primaryFamily("Poppins, sans-serif")).toBe("Poppins");
  });

  it("ignores stacks that need no loading", () => {
    // Asking Google for "sans-serif" would be a wasted request and a wasted 30 KB.
    for (const s of ["sans-serif", "system-ui, sans-serif", "Georgia, serif", "monospace"]) {
      expect(primaryFamily(s), s).toBeNull();
    }
  });

  it("refuses anything that is not a plain family name", () => {
    expect(primaryFamily("")).toBeNull();
    expect(primaryFamily(undefined)).toBeNull();
    expect(primaryFamily("url(evil), sans-serif")).toBeNull();
  });

  it("de-duplicates, so two blocks in Poppins are one request", () => {
    expect(familiesInUse(["Poppins, sans-serif", "'Poppins', serif", "'DM Sans', sans-serif", "sans-serif"]))
      .toEqual(["DM Sans", "Poppins"]);
  });
});

describe("what a site asks for", () => {
  const site = (): BoxSite => ({
    homeId: "p1",
    pages: [{ id: "p1", name: "Home", path: "home", root: {
      id: "r", type: "container", direction: "column", children: [
        { id: "a", type: "heading", text: "Hi", fontFamily: "'Lora', serif" },
        { id: "b", type: "container", children: [{ id: "c", type: "text", text: "x", fontFamily: "Montserrat, sans-serif" }] },
      ],
    } }],
  } as unknown as BoxSite);

  it("collects the theme's fonts and every per-block override", () => {
    const stacks = fontStacksInSite(site(), DEFAULT_THEME);
    expect(stacks).toContain(DEFAULT_THEME.headingFont);
    expect(stacks).toContain(DEFAULT_THEME.bodyFont);
    expect(stacks).toContain("'Lora', serif");
    expect(stacks).toContain("Montserrat, sans-serif");
  });

  it("reduces them to the families that actually need loading", () => {
    // The default theme is Poppins + DM Sans; the two overrides add Lora and Montserrat.
    expect(fontFamiliesInSite(site(), DEFAULT_THEME)).toEqual(["DM Sans", "Lora", "Montserrat", "Poppins"]);
  });
});

describe("the request", () => {
  it("asks for the weights the builder can apply, and for swap", () => {
    const url = googleCssUrl(["DM Sans", "Poppins"]);
    expect(url).toContain("family=DM+Sans");
    expect(url).toContain("family=Poppins");
    expect(url).toContain("display=swap"); // text must never be invisible while a font loads
    expect(url).toContain("wght@0,400;0,700;1,400;1,700");
  });
});

describe("embedding", () => {
  const CSS = `@font-face{font-family:'Poppins';src:url(https://fonts.gstatic.com/s/a.woff2) format('woff2')}`;
  const ok = (body: string | ArrayBuffer): Response =>
    ({ ok: true, text: async () => String(body), arrayBuffer: async () => new Uint8Array([1, 2, 3]).buffer } as unknown as Response);

  it("replaces every font URL with a data: URI, so nothing is fetched at page load", async () => {
    const out = await embedFontCss(["Poppins"], (async (u: string) => ok(u.includes("googleapis") ? CSS : "")) as Fetcher);
    expect(out).toContain("@font-face");
    expect(out).toContain("data:font/woff2;base64,");
    expect(fontUrls(out), "no external URL may survive").toEqual([]);
  });

  it("returns nothing when a font cannot be fetched, rather than failing the export", async () => {
    // A school must always be able to download their site. Losing a typeface is survivable; losing the
    // download is not — the stack's fallback keeps the page readable.
    const failing = (async () => ({ ok: false, status: 503 } as unknown as Response)) as Fetcher;
    expect(await embedFontCss(["Poppins"], failing)).toBe("");
    const throwing = (async () => { throw new Error("offline"); }) as Fetcher;
    expect(await embedFontCss(["Poppins"], throwing)).toBe("");
  });

  it("does nothing at all when no web font is used", async () => {
    let called = false;
    await embedFontCss([], (async () => { called = true; return ok(""); }) as Fetcher);
    expect(called).toBe(false);
  });
});

describe("fonts as files for the download (RA-7, A1-2)", () => {
  // What Google returns: one @font-face per subset, each with its own unicode-range.
  const SUBSETS = `/* vietnamese */
@font-face{font-family:'Poppins';font-weight:400;src:url(https://fonts.gstatic.com/s/poppins/v22/viet.woff2) format('woff2');unicode-range:U+0102-0103,U+1EA0-1EF9}
/* latin-ext */
@font-face{font-family:'Poppins';font-weight:400;src:url(https://fonts.gstatic.com/s/poppins/v22/ext.woff2) format('woff2');unicode-range:U+0100-02BA,U+1E00-1E9F}
/* latin */
@font-face{font-family:'Poppins';font-weight:400;src:url(https://fonts.gstatic.com/s/poppins/v22/latin.woff2) format('woff2');unicode-range:U+0000-00FF}`;
  const google = (async (u: string) => ({
    ok: true,
    text: async () => (u.includes("googleapis") ? SUBSETS : ""),
    arrayBuffer: async () => new TextEncoder().encode(u).buffer,
  } as unknown as Response)) as Fetcher;

  it("names each face fonts/<family>-<Google's file>", () => {
    expect(fontFileName("https://fonts.gstatic.com/s/poppins/v22/pxiEyp8kv8JHgFVrJJfecg.woff2")).toBe("fonts/poppins-pxiEyp8kv8JHgFVrJJfecg.woff2");
  });

  it("writes every face as a file and points the CSS at it — no bytes inside the CSS", async () => {
    const { css, files } = await fontFiles(["Poppins"], google);
    expect(Object.keys(files).sort()).toEqual(["fonts/poppins-ext.woff2", "fonts/poppins-latin.woff2", "fonts/poppins-viet.woff2"]);
    expect(new TextDecoder().decode(files["fonts/poppins-latin.woff2"])).toBe("https://fonts.gstatic.com/s/poppins/v22/latin.woff2");
    expect(css).toContain("url(fonts/poppins-latin.woff2)");
    expect(css).not.toContain("data:");
    expect(fontUrls(css), "no external URL may survive").toEqual([]);
  });

  it("keeps EVERY subset with its unicode-range, so Yoruba ẹ ọ and Twi ɛ ɔ are not dropped (A1-2)", async () => {
    const { css } = await fontFiles(["Poppins"], google);
    // ẹ U+1EB9 and ọ U+1ECD live in the vietnamese range; ɛ U+025B and ɔ U+0254 in latin-ext.
    expect(css).toContain("U+1EA0-1EF9");
    expect(css).toContain("U+0100-02BA");
    expect(css.match(/unicode-range/g)).toHaveLength(3);
  });

  it("gives nothing, never an error, when the fonts cannot be fetched", async () => {
    const failing = (async () => ({ ok: false, status: 503 } as unknown as Response)) as Fetcher;
    expect(await fontFiles(["Poppins"], failing)).toEqual({ css: "", files: {} });
    expect(await fontFiles([], google)).toEqual({ css: "", files: {} });
  });
});

describe("the shared stylesheet", () => {
  const site = (): BoxSite => ({ homeId: "p1", pages: [{ id: "p1", name: "Home", path: "home",
    root: { id: "r", type: "container", direction: "column", children: [] } as unknown as BoxNode }] } as unknown as BoxSite);

  it("puts the faces FIRST, before any rule that asks for them", () => {
    const css = renderSiteFiles(site(), DEFAULT_THEME, "@font-face{font-family:'Poppins'}")["styles.css"];
    expect(css.indexOf("@font-face")).toBeLessThan(css.indexOf("--eu-font-heading"));
  });

  it("is unchanged when there are no fonts to embed", () => {
    expect(renderSiteFiles(site(), DEFAULT_THEME)["styles.css"]).not.toContain("@font-face");
  });
});
