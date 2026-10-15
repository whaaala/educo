import { describe, it, expect } from "vitest";
import { createContainer, createElement, type BoxNode } from "@/lib/box-model";
import { siteFromRoot, freshSite, siteFonts, setSiteFonts, SAVED_SITE_FONTS, NEW_SITE_FONTS, coerceSite } from "@/lib/box-site";
import { pageCheck } from "@/lib/semantics";
import { DEFAULT_THEME } from "@/lib/site-storage";

/** BATCH A-1b — the site's own font pair (1)(4) and the Page check's font line (3). */
const page = (kids: BoxNode[], extra: Partial<BoxNode> = {}) => createContainer("column", { id: "page", children: kids, ...extra } as Partial<BoxNode>);
const text = (words: string, extra: Partial<BoxNode> = {}) => createElement("text", { text: words, ...extra } as Partial<BoxNode>);
const OLD = { heading: "Poppins, sans-serif", body: "'DM Sans', sans-serif" };

describe("the site's fonts (A-1b (1) (4))", () => {
  it("a site saved before sites stored a pair reads the pair it was drawn in — saved pages keep theirs", () => {
    expect(SAVED_SITE_FONTS).toEqual({ heading: DEFAULT_THEME.headingFont, body: DEFAULT_THEME.bodyFont });
    expect(siteFonts(siteFromRoot(page([])))).toEqual(OLD);
    const stored = JSON.parse(JSON.stringify(siteFromRoot(page([])))); // a save from before A-1b, loaded again
    expect(siteFonts(coerceSite(stored)!)).toEqual(OLD);
  });

  it("a NEW site starts with Montserrat + Inter, and the pair survives a save and a load", () => {
    const s = freshSite(page([]));
    expect(siteFonts(s)).toEqual({ heading: "Montserrat, sans-serif", body: "Inter, sans-serif" });
    expect(siteFonts(coerceSite(JSON.parse(JSON.stringify(s)))!)).toEqual(NEW_SITE_FONTS);
  });

  it("Site fonts changes one role and keeps the other; the old site object is untouched (one Undo)", () => {
    const s = freshSite(page([]));
    const t = setSiteFonts(s, { heading: "Merriweather, serif" });
    expect(siteFonts(t)).toEqual({ heading: "Merriweather, serif", body: "Inter, sans-serif" });
    expect(siteFonts(s)).toEqual(NEW_SITE_FONTS);
    expect(siteFonts(setSiteFonts(siteFromRoot(page([])), { body: "Inter, sans-serif" }))).toEqual({ heading: OLD.heading, body: "Inter, sans-serif" });
  });
});

describe("the Page check's font line (A-1b (3))", () => {
  const issues = (root: BoxNode, fonts = OLD) => pageCheck(root, undefined, fonts).filter((i) => i.kind === "font-letters");

  it("Yoruba words in the site's Poppins: named, with the letters and a sans that has them", () => {
    const [i, ...rest] = issues(page([text("Ẹ ṣé o, ẹ ṣé", { id: "t" } as Partial<BoxNode>)]));
    expect(rest).toEqual([]);
    expect(i).toMatchObject({ id: "t", blocks: false, fix: { font: "Inter, sans-serif" } });
    expect(i.message).toContain("DM Sans has no Ẹ ṣ ẹ");
  });

  it("a heading is checked against the heading font, words against the body font", () => {
    const h = createElement("heading", { id: "h", text: "Ɓarka" } as Partial<BoxNode>);
    expect(issues(page([h]), { heading: "Montserrat, sans-serif", body: OLD.body })).toEqual([]);
    expect(issues(page([h]), { heading: OLD.heading, body: "Montserrat, sans-serif" }).map((i) => i.id)).toEqual(["h"]);
  });

  it("a font set on a block — or on a box above it — is the one checked", () => {
    expect(issues(page([text("Ẹ ṣé", { fontFamily: "Inter, sans-serif" } as Partial<BoxNode>)]))).toEqual([]);
    const box = createContainer("column", { fontFamily: "'Noto Serif', serif", children: [text("Ẹ ṣé")] } as Partial<BoxNode>);
    expect(issues(page([box]))).toEqual([]);
    const serif = createContainer("column", { fontFamily: "Lora, serif", children: [text("Ɓarka", { id: "s" } as Partial<BoxNode>)] } as Partial<BoxNode>);
    expect(issues(page([serif]))[0]).toMatchObject({ id: "s", fix: { font: "Merriweather, serif" } }); // a serif for a serif
  });

  it("English words, a hidden block, or no site fonts given: no font line", () => {
    expect(issues(page([text("Good morning")]))).toEqual([]);
    expect(issues(page([text("Ẹ ṣé", { hidden: true } as Partial<BoxNode>)]))).toEqual([]);
    expect(pageCheck(page([text("Ẹ ṣé")])).filter((i) => i.kind === "font-letters")).toEqual([]);
  });
});
