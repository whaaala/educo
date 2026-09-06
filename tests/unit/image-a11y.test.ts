import { describe, it, expect } from "vitest";
import { createContainer, createElement, makeRowBand, type BoxNode } from "@/lib/box-model";
import { renderPageHTML } from "@/lib/box-export";
import { DEFAULT_THEME } from "@/lib/site-storage";

/**
 * AN IMAGE MUST BE ABLE TO DESCRIBE ITSELF.
 *
 * The export hardcoded `alt=""` on every image block, which is the markup for "this picture is decorative,
 * skip it". Every photo a school put on a page was therefore invisible to a screen reader and worthless to a
 * search engine, with no way for the user to change it (WCAG 1.1.1 Non-text Content).
 */

const pageWith = (patch: Partial<BoxNode>) => {
  const img = createElement("image", { id: "img", src: "https://example.org/garden.jpg", ...patch } as Partial<BoxNode>);
  const root = createContainer("column", { id: "r", children: [makeRowBand([img])] } as Partial<BoxNode>);
  return renderPageHTML(root, DEFAULT_THEME);
};

describe("image accessibility & loading", () => {
  it("carries the description the user wrote", () => {
    expect(pageWith({ alt: "Pupils planting in the school garden" }))
      .toContain('alt="Pupils planting in the school garden"');
  });

  it("escapes it, because it is typed by a person", () => {
    expect(pageWith({ alt: 'A "big" day & night' })).toContain("&quot;big&quot;");
    expect(pageWith({ alt: '"><script>x</script>' })).not.toContain("<script>");
  });

  it("still allows an empty alt, which is correct for a decorative image", () => {
    expect(pageWith({})).toContain('alt=""');
  });

  it("defers loading by default, so a page of photos does not block on all of them", () => {
    expect(pageWith({})).toContain('loading="lazy"');
    expect(pageWith({})).toContain('decoding="async"');
  });

  it("loads eagerly when asked, because a hero must not open blank", () => {
    expect(pageWith({ eager: true } as Partial<BoxNode>)).toContain('loading="eager"');
  });
});
