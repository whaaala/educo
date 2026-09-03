import { describe, it, expect } from "vitest";
import { COMPONENT_REGISTRY, isRegistryComponent, defaultComponentFields, renderComponent } from "@/lib/educo-ui/registry";

describe("component registry (single-node design-system components)", () => {
  it("registers Card/Quote/Stat/Badge/Rating", () => {
    for (const name of ["card", "quote", "stat", "badge", "rating"]) {
      expect(isRegistryComponent(name)).toBe(true);
      expect(COMPONENT_REGISTRY[name]).toBeTruthy();
    }
    expect(isRegistryComponent("accordion")).toBe(false); // accordion has its own bespoke model
    expect(isRegistryComponent(undefined)).toBe(false);
  });

  it("defaultComponentFields returns each component's slot defaults", () => {
    const card = defaultComponentFields("card");
    expect(card).toMatchObject({ title: "Card title", buttonText: "Learn more" });
    expect(defaultComponentFields("rating")).toMatchObject({ value: 4, max: 5 });
    expect(defaultComponentFields("nope")).toEqual({});
  });

  it("renderComponent renders ONE .eu-* node from fields + variant (no wrapper container)", () => {
    const card = renderComponent("card", { title: "Hi", body: "B", buttonText: "Go", buttonHref: "#", image: "" }, "--flat");
    expect(card).toBe('<div class="eu-card--flat"><div class="eu-card__title">Hi</div><div class="eu-card__body">B</div><a class="eu-btn eu-btn--primary eu-card__action" href="#">Go</a></div>');
    // rating draws N filled + (max−N) empty stars
    const rating = renderComponent("rating", { value: 3, max: 5 }, "");
    expect((rating.match(/eu-rating__star is-on/g) ?? []).length).toBe(3);
    expect((rating.match(/eu-rating__star/g) ?? []).length).toBe(5);
  });

  it("renderComponent escapes user content (no HTML injection)", () => {
    const html = renderComponent("badge", { text: "<b>x</b>" }, "");
    expect(html).toContain("&lt;b&gt;x&lt;/b&gt;");
    expect(html).not.toContain("<b>x</b>");
  });

  it("missing fields fall back to defaults (a bare node still renders fully)", () => {
    const card = renderComponent("card", undefined, "");
    expect(card).toContain("Card title");        // default title
    expect(card).toContain("Learn more");        // default button
  });
});
