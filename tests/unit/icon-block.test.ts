import { describe, it, expect } from "vitest";
import { createContainer, createElement, normalizeRowBands, u } from "@/lib/box-model";
import { renderPageHTML } from "@/lib/box-export";
import { DEFAULT_THEME } from "@/lib/site-storage";

/**
 * THE ICON BLOCK PUBLISHES THE BOX THE CANVAS DRAWS (#143) — behaviours in tests/features/components/website/box-builder-content.feature.
 * Measured by the tier-99 dressed sweep: a 32px icon on the canvas published 40px tall — the inline SVG sat in a normal line
 * box and gained the leading — with a different default size and colour. Canvas ≠ export in the block itself.
 */
describe("the Icon block", () => {
  const page = (icon: Parameters<typeof createElement>[1]) => normalizeRowBands(createContainer("column", { id: "page", width: "fill", children: [createElement("icon", { icon: "Star", ...icon })] }));
  it("publishes a zero-line-height wrapper with the icon exactly 1em square, at the same default size as the canvas", () => {
    const html = renderPageHTML(page({}), DEFAULT_THEME);
    const m = /<div style="([^"]*)"><span aria-hidden="true" style="([^"]*)"><svg/.exec(html);
    expect(m, "wrapper + 1em span around the svg").not.toBeNull();
    expect(m![1]).toContain("line-height:0");
    expect(m![1]).toContain("width:100%");
    expect(m![2]).toContain("width:1em");
    expect(m![2]).toContain("height:1em");
    expect(m![2]).toContain(`font-size:${u(32)}`); // the canvas's default (32 in the spacing unit), not 1.5× body
  });
  it("uses the brand colour by default and the block's own colour when set — as the canvas does", () => {
    expect(renderPageHTML(page({}), DEFAULT_THEME)).toContain(`color:${DEFAULT_THEME.primary}`);
    expect(renderPageHTML(page({ color: "#123456" }), DEFAULT_THEME)).toContain("color:#123456");
  });
  it("a size somebody set is written in the spacing unit, never a pixel", () => {
    const html = renderPageHTML(page({ fontSize: 48 }), DEFAULT_THEME);
    expect(html).toContain(`font-size:${u(48)}`);
    expect(html).not.toMatch(/font-size:\d+px/);
  });
});
