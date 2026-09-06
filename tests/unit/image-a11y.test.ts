import { describe, it, expect } from "vitest";
import { createContainer, createElement, createComponent, makeRowBand, type BoxNode } from "@/lib/box-model";
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

describe("an accordion item's thumbnail", () => {
  const accordionWith = (media: string) => {
    const acc = createComponent("accordion", {
      id: "acc",
      items: [{ id: "i1", title: "Term dates", body: "The dates.", media, mediaAlt: "A calendar" }],
    } as Partial<BoxNode>);
    const root = createContainer("column", { id: "r", children: [makeRowBand([acc])] } as Partial<BoxNode>);
    return renderPageHTML(root, DEFAULT_THEME);
  };

  it("waits until the visitor has scrolled near it, like every other image", () => {
    // A list of twenty items should not fetch twenty pictures before the reader has seen any of them.
    // The thumbnail's box is fixed in CSS, so deferring it shifts nothing.
    const html = accordionWith("https://example.org/calendar.jpg");
    expect(html).toContain('class="eu-accordion__media"');
    expect(html).toMatch(/eu-accordion__media[^>]*loading="lazy"/);
    expect(html).toMatch(/eu-accordion__media[^>]*decoding="async"/);
  });

  it("still says what it shows", () => {
    expect(accordionWith("https://example.org/calendar.jpg")).toContain('alt="A calendar"');
  });
});

describe("an alert message's thumbnail", () => {
  const alertWith = (media: string) => {
    const al = createComponent("alert", {
      id: "al", alertSeverity: "info",
      items: [{ id: "i1", title: "Snow day", body: "School is closed.", media, mediaAlt: "A snowy playground" }],
    } as Partial<BoxNode>);
    const root = createContainer("column", { id: "r", children: [makeRowBand([al])] } as Partial<BoxNode>);
    return renderPageHTML(root, DEFAULT_THEME);
  };

  it("follows the same loading policy as every other image", () => {
    // Every image in the product answers this question the same way — an image block, an accordion item and
    // an alert message should not each have their own idea of when a picture is fetched.
    const html = alertWith("https://example.org/snow.jpg");
    expect(html).toMatch(/eu-alert__media[^>]*loading="lazy"/);
    expect(html).toMatch(/eu-alert__media[^>]*decoding="async"/);
    expect(html).toContain('alt="A snowy playground"');
  });
});
