import { describe, it, expect } from "vitest";
import type { BoxNode } from "@/lib/box-model";
import { createContainer, normalizeRowBands, makeRowBand, containerStyle, blockTypography } from "@/lib/box-model";
import { renderPageHTML } from "@/lib/box-export";
import { DEFAULT_THEME } from "@/lib/site-storage";
import { blockForKind } from "@/lib/box-presets";

/**
 * L2-d — A PAGE HEADER OR FOOTER USES ITS WIDTH (the user, 2026-10-01, decided "Header spreads").
 * Behaviours: tests/features/components/website/box-builder-site.feature "A page header spreads across the page".
 */
const item = (kind: string) => blockForKind(kind);
const bar = (tag: "header" | "footer" | undefined, line: BoxNode) => ({ ...createContainer("column", tag ? { tag } : {}), children: [line] });
const lineOf = (n: BoxNode) => normalizeRowBands(n).children![0];

describe("a header's line spreads its items across the page", () => {
  it("a header or footer line of two or more, never aligned, is set to Spread out — and emits space-between", () => {
    for (const tag of ["header", "footer"] as const) {
      const line = lineOf(bar(tag, makeRowBand([item("heading"), item("button")])));
      expect(line.justify, tag).toBe("between");
      expect(containerStyle(line).justifyContent).toBe("space-between");
      expect(line.align, `${tag}: its items on ONE centre line (L2-f)`).toBe("center");
    }
  });
  it("a line the user set to Start keeps it — every line saved before this was stored as Start", () => {
    expect(lineOf(bar("header", { ...makeRowBand([item("heading"), item("button")]), justify: "start" })).justify).toBe("start");
  });
  it("a single item, or a line outside a header or footer, is left as it was", () => {
    expect(lineOf(bar("header", makeRowBand([item("heading")]))).justify).toBeUndefined();
    expect(lineOf(bar(undefined, makeRowBand([item("heading"), item("button")]))).justify).toBeUndefined();
  });
  it("a floating block beside one item is not a second item", () => {
    expect(lineOf(bar("header", makeRowBand([item("heading"), { ...item("text"), position: "absolute" } as BoxNode]))).justify).toBeUndefined();
  });
  it("an unaligned line still means Start everywhere else", () => {
    expect(containerStyle(makeRowBand([item("heading"), item("button")])).justifyContent).toBe("flex-start");
  });
});

/**
 * L2-g — A BUTTON'S WORDS ARE NOT UNDERLINED. Seen in the HEADED UAT, 2026-10-01: "Apply now" in the header was underlined
 * in the Preview. The button writes `text-decoration: none`, and the shared typography spread after it carried
 * `textDecoration: undefined`, which erased it — the browser then underlines every <a>.
 */
describe("a button's words are not underlined, and an underline the user asked for stays", () => {
  const html = (n: BoxNode) => renderPageHTML({ ...createContainer("column"), children: [makeRowBand([n])] }, DEFAULT_THEME);
  const anchor = (h: string, text: string) => (h.match(new RegExp(`<a [^>]*>${text}</a>`)) ?? [""])[0];
  it("a button publishes text-decoration:none", () => {
    expect(anchor(html({ ...item("button"), text: "Apply now" }), "Apply now")).toContain("text-decoration:none");
  });
  it("the shared typography carries no key it has no value for", () => {
    expect(Object.values(blockTypography(item("button"), "body", 600))).not.toContain(undefined);
  });
  it("a link set to Underline is still underlined", () => {
    expect(anchor(html({ ...item("link"), text: "Term dates", underline: true } as BoxNode), "Term dates")).toContain("text-decoration:underline");
  });
});
