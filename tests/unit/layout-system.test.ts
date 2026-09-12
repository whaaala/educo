import { describe, it, expect } from "vitest";
import {
  RUNG_PX, RUNG_EM, RUNG_MEASURE, RUNG_LABEL, RUNG_ORDER, LAYOUT_CSS, mediaFrom, atRung,
} from "@/lib/educo-ui/layout";
import { BASE_CSS } from "@/lib/educo-ui/base";
import { renderSiteFiles } from "@/lib/box-export";
import { stripComments } from "@/lib/educo-ui/subset";
import { DEFAULT_THEME } from "@/lib/site-storage";
import type { BoxSite } from "@/lib/box-site";
import { bandClasses, setSectionWidth, sectionWidthOf, pageBandOf, findBox, type BoxNode } from "@/lib/box-model";

const onePageSite = (): BoxSite =>
  ({
    homeId: "p1",
    pages: [{ id: "p1", name: "Home", path: "home",
      root: { id: "r1", type: "container", direction: "column", children: [] } as unknown as BoxNode }],
  } as unknown as BoxSite);

/**
 * THE LAYOUT LAYER.
 *
 * The system used to carry three ladders — a Tailwind-shaped one in base.ts, hand-typed container-query
 * thresholds, and a `--eu-container-max` variable nothing set. These assert there is now exactly one, that it
 * is expressed in the unit that respects a reader's font size, and that a section can actually be told to run
 * edge to edge — the control that was missing entirely.
 */

describe("the rung ladder", () => {
  it("climbs, and starts at the phone with no query of its own", () => {
    const widths = RUNG_ORDER.map((r) => RUNG_PX[r]);
    expect(widths).toEqual([...widths].sort((a, b) => a - b));
    expect(RUNG_PX.phone).toBe(0);
    expect(mediaFrom("phone"), "the phone rung IS the base — a query would make it desktop-first").toBeNull();
  });

  it("is expressed in em, derived from px, so the two can never drift apart", () => {
    for (const r of RUNG_ORDER) expect(RUNG_EM[r]).toBe(RUNG_PX[r] / 16);
    expect(RUNG_EM.tabletPortrait).toBe(37.5);
    expect(RUNG_EM.desktop).toBe(75);
  });

  it("emits em queries, never px — a px breakpoint ignores a reader who enlarged their font", () => {
    for (const r of RUNG_ORDER) {
      const q = mediaFrom(r);
      if (!q) continue;
      expect(q).toContain("em)");
      expect(q).not.toMatch(/\d+px/);
    }
  });

  it("names every rung for what it is, so a chip and a query can never disagree", () => {
    for (const r of RUNG_ORDER) expect(RUNG_LABEL[r].length).toBeGreaterThan(0);
    expect(new Set(Object.values(RUNG_LABEL)).size).toBe(RUNG_ORDER.length);
  });

  it("atRung wraps at every rung but the phone", () => {
    expect(atRung("phone", ".x{color:red}")).toBe(".x{color:red}");
    expect(atRung("desktop", ".x{color:red}")).toContain("@media (min-width: 75em)");
  });
});

describe("containers", () => {
  it("ships ONLY classes a renderer can actually emit", () => {
    // A class is worth its bytes only if something can put it on an element. The builder emits markup from the
    // node tree and a user cannot type a class name anywhere, so a class no renderer writes is dead weight on
    // every page of every school site — the same defect as --eu-container-max, which this module removed.
    // .eu-container, .eu-gap-*, .eu-flow-* and .eu-band--scrim were all written before their controls existed;
    // they return in Phase 2, in the same change as the controls that emit them.
    // Comments are stripped first — the prose above names the removed classes, and scanning it would report
    // them as declared. What ships is what counts.
    const declared = new Set(
      [...stripComments(LAYOUT_CSS).matchAll(/\.(eu-[A-Za-z0-9_-]+)/g)].map((m) => m[1]),
    );
    const emittable = new Set(["eu-band", "eu-band--contained", "eu-root", "eu-tokens"]);
    for (const c of declared) {
      expect(emittable.has(c), `.${c} is declared but no renderer emits it`).toBe(true);
    }
  });

  it("the cap steps up once per rung, and only widens", () => {
    const caps = RUNG_ORDER.filter((r) => r !== "phone").map((r) => RUNG_MEASURE[r]!);
    const rem = caps.map((c) => parseFloat(c));
    expect(rem).toEqual([...rem].sort((a, b) => a - b));
    for (const r of RUNG_ORDER) {
      if (r === "phone") continue;
      expect(LAYOUT_CSS, `${r} must set a measure`).toContain(`--eu-measure: ${RUNG_MEASURE[r]}`);
    }
  });

  it("the phone rung has NO cap — the gutters already hold the column in", () => {
    expect(RUNG_MEASURE.phone).toBeNull();
  });

  it("a BAND runs edge to edge", () => {
    // The single biggest thing missing before: a full-bleed colour or photo with text still on the measure.
    expect(LAYOUT_CSS).toContain(".eu-band");
    expect(LAYOUT_CSS).toMatch(/\.eu-band\s*\{[^}]*max-width:\s*none/);
  });
});

describe("space tiers", () => {
  it("three tiers, largest between sections and smallest between elements", () => {
    // Named for the structural level, not a number — the Law of Proximity made into a default.
    // Tokens, not utility classes: a user CAN reach var(--eu-gap-section) from a block's Advanced CSS, and
    // components read them. A `.eu-gap-section` CLASS would be unreachable until Phase 2 emits it.
    for (const t of ["section", "group", "element"]) {
      expect(LAYOUT_CSS, `--eu-gap-${t} must exist`).toContain(`--eu-gap-${t}:`);
    }
    const max = (name: string) => {
      const m = LAYOUT_CSS.match(new RegExp(`--eu-gap-${name}:\\s*clamp\\([^)]*?,\\s*([\\d.]+)rem\\)`));
      return parseFloat(m![1]);
    };
    expect(max("section")).toBeGreaterThan(max("group"));
    expect(max("group")).toBeGreaterThan(max("element"));
  });

  it("every tier is fluid, so it scales without a media query", () => {
    for (const t of ["section", "group", "element"]) {
      expect(LAYOUT_CSS).toMatch(new RegExp(`--eu-gap-${t}:\\s*clamp\\(`));
    }
  });
});

describe("band or contained — the control that makes the layer live", () => {
  const band = (extra: Record<string, unknown> = {}) =>
    ({ id: "b", type: "container", direction: "row", rowBand: true, ...extra }) as unknown as BoxNode;

  it("only a structural band carries layout classes", () => {
    expect(bandClasses({ id: "x", type: "container" } as BoxNode, true)).toBe("");
    expect(bandClasses(band(), true)).toBe("eu-band");
  });

  it("REGRESSION: a band INSIDE a component is not a page section", () => {
    // `rowBand` does not mean "section". normalizeRowBands wraps the children of every content container in a
    // band, so a Card's image, heading, body and button are each in one. Without the gate they all came out
    // marked as a page-wide band — four bogus bands per card, on every card on every page.
    expect(bandClasses(band(), false)).toBe("");
    expect(bandClasses(band({ sectionWidth: "contained" }), false)).toBe("");
  });

  it("a real page section still gets them, so the gate did not just switch the feature off", () => {
    expect(bandClasses(band({ sectionWidth: "contained" }), true)).toContain("eu-band--contained");
  });

  it("defaults to edge-to-edge, which is what every band did before the control existed", () => {
    expect(bandClasses(band(), true)).not.toContain("contained");
    expect(bandClasses(band({ sectionWidth: "band" }), true)).toBe("eu-band");
  });

  it("contained adds the modifier without losing the band", () => {
    // It must stay a band: the background is painted by .eu-band and only the content is inset.
    const cls = bandClasses(band({ sectionWidth: "contained" }), true);
    expect(cls).toContain("eu-band");
    expect(cls).toContain("eu-band--contained");
  });

  it("the export emits those classes onto the section", () => {
    const site = (sectionWidth?: string): BoxSite =>
      ({ homeId: "p1", pages: [{ id: "p1", name: "Home", path: "home",
        root: { id: "r1", type: "container", direction: "column",
          children: [{ id: "b1", type: "container", direction: "row", rowBand: true, sectionWidth }] } }] } as unknown as BoxSite);
    const plain = renderSiteFiles(site(), DEFAULT_THEME)["index.html"];
    const inset = renderSiteFiles(site("contained"), DEFAULT_THEME)["index.html"];
    expect(plain).toContain("eu-band");
    expect(plain).not.toContain("eu-band--contained");
    expect(inset).toContain("eu-band--contained");
  });

  it("the control writes UPWARD, from the section a user can select to the band they cannot", () => {
    // Clicking a band selects the section inside it, so a control on the band itself is unreachable. This is
    // the same shape as alignInRow, which was already solving exactly this problem for "Position in row".
    const tree = () => ({ id: "root", type: "container", direction: "column", children: [
      { id: "band1", type: "container", direction: "row", rowBand: true, children: [
        { id: "sec1", type: "container", direction: "column", children: [] },
      ] },
    ] }) as unknown as BoxNode;

    expect(sectionWidthOf(tree(), "sec1")).toBe("band");
    const after = setSectionWidth(tree(), "sec1", "contained");
    expect(sectionWidthOf(after, "sec1")).toBe("contained");
    expect(findBox(after, "band1")!.sectionWidth).toBe("contained");
    // …and back again, leaving no field behind rather than storing the default.
    expect(findBox(setSectionWidth(after, "sec1", "band"), "band1")!.sectionWidth).toBeUndefined();
  });

  it("a section inside a COMPONENT has no such choice, and cannot rewrite a page section", () => {
    const nested = { id: "root", type: "container", direction: "column", children: [
      { id: "band1", type: "container", direction: "row", rowBand: true, children: [
        { id: "card", type: "container", direction: "column", children: [
          { id: "innerBand", type: "container", direction: "row", rowBand: true, children: [
            { id: "deep", type: "container", direction: "column", children: [] },
          ] },
        ] },
      ] },
    ] } as unknown as BoxNode;

    expect(pageBandOf(nested, "deep"), "a band inside a card is not a page band").toBeNull();
    expect(setSectionWidth(nested, "deep", "contained"), "the tree must come back untouched").toBe(nested);
    expect(pageBandOf(nested, "card")!.id).toBe("band1");
  });

  it("a contained band insets with padding, so its background still spans the page", () => {
    // An inner wrapper would have become the band's only flex child and collapsed the row of sections in it.
    expect(LAYOUT_CSS).toMatch(/\.eu-band--contained\s*\{\s*padding-inline:/);
    expect(LAYOUT_CSS).not.toMatch(/\.eu-band--contained\s*\{[^}]*max-width/);
  });

  it("keeps the page gutter on a screen narrower than the measure", () => {
    // Without the max(), the padding goes negative on a phone and the text touches the edge of the screen.
    expect(LAYOUT_CSS).toMatch(/\.eu-band--contained[^}]*max\(var\(--eu-gutter-page\)/);
  });
});

describe("the layout layer reaches the page", () => {
  it("is part of the base stylesheet every export ships", () => {
    expect(BASE_CSS).toContain(".eu-band");
    expect(BASE_CSS).toContain("--eu-gap-section");
  });

  it("leaves no trace of the ladders it replaced, in the sheet a school actually receives", () => {
    // Asserted on the SHIPPED styles.css, not on the source constant: the source still discusses the removed
    // utilities in a comment, and what matters is that no visitor downloads either the rules or the comment.
    const shipped = renderSiteFiles(onePageSite(), DEFAULT_THEME)["styles.css"];
    expect(shipped, "the variable nothing ever set").not.toContain("--eu-container-max");
    expect(shipped, "utilities no renderer emitted").not.toContain("eu-md");
    expect(shipped).not.toContain("eu-lg");
    expect(shipped, "and no comments, which are for maintainers not visitors").not.toContain("/*");
  });

  it("has balanced braces, or the browser discards the rest of the sheet", () => {
    expect(LAYOUT_CSS.split("{").length).toBe(LAYOUT_CSS.split("}").length);
    expect(BASE_CSS.split("{").length).toBe(BASE_CSS.split("}").length);
  });
});
