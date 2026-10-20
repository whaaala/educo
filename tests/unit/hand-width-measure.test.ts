import { describe, it, expect } from "vitest";
import { createContainer, createElement, ownMeasure, type BoxNode } from "@/lib/box-model";
import { renderPageHTML } from "@/lib/box-export";
import { DEFAULT_THEME } from "@/lib/site-storage";

/**
 * WORDS FOLLOW A WIDTH SET BY HAND (BATCH LE15k-ac — tests/features/components/website/box-builder-spacing.feature, "Words follow a
 * width I set by hand"). The user, 2026-10-20, on the hero's "Open day on Saturday 14 March, 10 am to 2 pm. Come and meet us.": its box
 * dragged 150px wider, its words still broke before "us." — every paragraph is capped at the readable measure `min(56ch, 32em)`
 * (`measureCss`), which silently overrode the person's own width. A paragraph sized by hand keeps its words in the width it was
 * given; one never sized keeps the measure (the Page check still warns past 75 characters a line). One rule, `ownMeasure`, for the
 * canvas and the published page.
 */
const page = (text: BoxNode): BoxNode => { const root = createContainer("column", { id: "root" }); root.children = [text]; return root; };

describe("a paragraph's measure", () => {
  it("is lifted on a paragraph whose width was set by hand", () => {
    expect(ownMeasure(createElement("text", { text: "x", widthByHand: true }))).toEqual({ maxWidth: "none" });
  });
  it("is kept on a paragraph nobody sized", () => {
    expect(ownMeasure(createElement("text", { text: "x" }))).toEqual({});
  });
  it("is lifted in the published page too, the same way", () => {
    const sized = renderPageHTML(page(createElement("text", { text: "Open day", widthByHand: true })), DEFAULT_THEME);
    const free = renderPageHTML(page(createElement("text", { text: "Open day" })), DEFAULT_THEME);
    expect(sized).toMatch(/<p style="[^"]*max-width:\s*none/);
    expect(free).not.toMatch(/<p style="[^"]*max-width:\s*none/);
  });
});
