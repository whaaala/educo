import { describe, it, expect } from "vitest";
import { advancedCssStyle, sanitizeCssDeclarations, type BoxNode } from "@/lib/box-model";

/**
 * ADVANCED CSS — the same declarations must reach the canvas and the export.
 *
 * The export appends them to the node's own rule. The canvas writes the node's generated styles INLINE, where
 * a stylesheet rule cannot reach them, so it needs the declarations as a style OBJECT merged in last. Before
 * that existed the canvas applied Advanced CSS only inside the component branches: on a plain section it did
 * nothing while you edited, then appeared on the published site.
 */

const node = (advancedCss?: string) => ({ id: "n", type: "container", advancedCss }) as unknown as BoxNode;

describe("advancedCssStyle", () => {
  it("is empty when there is nothing to apply", () => {
    expect(advancedCssStyle(node())).toEqual({});
    expect(advancedCssStyle(node("   "))).toEqual({});
  });

  it("camel-cases standard properties, because that is what React expects", () => {
    expect(advancedCssStyle(node("padding-top: 2rem; background-color: red"))).toEqual({
      paddingTop: "2rem", backgroundColor: "red",
    });
  });

  it("keeps custom properties exactly as written", () => {
    // `--eu-col-min` must NOT become `euColMin`, or the variable silently stops existing.
    expect(advancedCssStyle(node("--eu-col-min: 20rem"))).toEqual({ "--eu-col-min": "20rem" });
  });

  it("carries a var() through, so the design tokens are reachable from Advanced CSS", () => {
    // This is what makes the space TOKENS a live part of the product while their utility classes do not exist.
    expect(advancedCssStyle(node("padding: var(--eu-gap-section)"))).toEqual({
      padding: "var(--eu-gap-section)",
    });
  });

  it("applies the SAME sanitiser the export uses — no selector, script or layout animation gets through", () => {
    for (const bad of ["color: red} body {display:none", "background: url(http://x/y.png)", "transition: all 1s"]) {
      expect(advancedCssStyle(node(bad)), bad).toEqual({});
      expect(sanitizeCssDeclarations(bad), bad).toBe("");
    }
  });

  it("survives odd spacing and a trailing semicolon", () => {
    expect(advancedCssStyle(node("  padding :  1rem ;  "))).toEqual({ padding: "1rem" });
  });
});
