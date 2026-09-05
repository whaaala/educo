import { ALL_COMPONENTS, COMPONENT_CATALOGUE, presetVariants, applyPresetVariant } from "@/lib/component-catalogue";
import { blockForKind, getAddChoices } from "@/lib/box-presets";
import { DEFAULT_THEME } from "@/lib/site-storage";
import { COMPONENT_ICONS } from "@/components/website/box/BlocksPanel";
import type { BoxNode } from "@/lib/box-model";
import { describe, it, expect } from "vitest";
import { COMPONENT_REGISTRY, isRegistryComponent, defaultComponentFields, renderComponent, componentScripts } from "@/lib/educo-ui/registry";

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
    expect(card).not.toContain("eu-card__icon");  // no icon by default (empty)
  });

  it("componentScripts returns '' for components without a script (opt-in only)", () => {
    expect(componentScripts("card", {}, "", "c1")).toBe("");
  });

  it("Card / Stat / Badge render an inline-SVG icon when their icon field is set (IconPicker-driven)", () => {
    const card = renderComponent("card", { icon: "Star", title: "T", body: "B", buttonText: "", image: "" }, "");
    expect(card).toContain('<span class="eu-card__icon" aria-hidden="true"><svg');
    const stat = renderComponent("stat", { icon: "Users", value: "1k", label: "x" }, "");
    expect(stat).toContain('<span class="eu-stat__icon" aria-hidden="true"><svg');
    const badge = renderComponent("badge", { icon: "Check", text: "New" }, "--success");
    expect(badge).toContain('<span class="eu-badge__icon" aria-hidden="true"><svg');
    expect(badge).toContain("New");
  });
});

/** Ids are random per build, so compare shape rather than identity. */
const strip = (n: BoxNode): unknown => ({ ...n, id: undefined, children: (n.children ?? []).map(strip) });

describe("the component catalogue is the one source of truth", () => {
  // These exist so "applies to all components, existing and future" stops depending on anyone remembering.
  // A component added to the catalogue is listed in the palette, built by blockForKind, and covered by both
  // browser invariant harnesses automatically — and if any of those links breaks, one of these fails.

  it("lists every component exactly once", () => {
    expect(new Set(ALL_COMPONENTS).size).toBe(ALL_COMPONENTS.length);
    expect(ALL_COMPONENTS).toEqual(COMPONENT_CATALOGUE.map((c) => c.name));
  });

  it("covers the bespoke components AND every registry one", () => {
    // Neither list alone is complete: the registry deliberately excludes accordion and alert (they have their
    // own models), which is exactly why the catalogue exists separately from it.
    expect(ALL_COMPONENTS).toContain("accordion");
    expect(ALL_COMPONENTS).toContain("alert");
    for (const name of Object.keys(COMPONENT_REGISTRY)) expect(ALL_COMPONENTS).toContain(name);
  });

  it("gives the palette a real icon for every component — never a silent fallback", () => {
    const missing = COMPONENT_CATALOGUE.filter((c) => !COMPONENT_ICONS[c.icon]).map((c) => c.name);
    expect(missing, `add these icons to COMPONENT_ICONS in BlocksPanel: ${missing.join(", ")}`).toEqual([]);
  });

  it("builds a usable node for every component through the real insertion path", () => {
    // blockForKind is what the palette click AND the drag both call. If a catalogue entry does not build here,
    // the component is unreachable in the product no matter what else is wired up.
    for (const name of ALL_COMPONENTS) {
      const node = blockForKind(name);
      expect(node, `${name} must build`).toBeTruthy();
      expect(node.id, `${name} must get an id`).toBeTruthy();
      const isTree = node.type !== "component";
      if (isTree) expect(node.preset, `${name} tree must be tagged with its preset`).toBe(name);
      else expect(node.component, `${name} must record its component name`).toBe(name);
    }
  });

  it("offers a design gallery for every tree component", () => {
    for (const entry of COMPONENT_CATALOGUE) {
      const node = entry.build();
      if (node.type === "component") continue; // those get their designs from COMPONENT_REGISTRY
      expect(presetVariants(entry.name).length, `${entry.name} needs designs`).toBeGreaterThan(1);
      expect(presetVariants(entry.name)[0].id, `${entry.name}'s first design is the default`).toBe("");
    }
  });

  it("keeps designs STYLE-ONLY — switching one can never destroy what the user wrote", () => {
    const textOf = (n: BoxNode): string[] => [n.text ?? "", ...(n.children ?? []).flatMap(textOf)].filter(Boolean);
    for (const entry of COMPONENT_CATALOGUE) {
      const built = entry.build();
      if (built.type === "component") continue;
      const before = textOf(built);
      for (const v of presetVariants(entry.name)) {
        const after = applyPresetVariant(built, v.id);
        expect(textOf(after), `${entry.name}/${v.id || "default"} must not change content`).toEqual(before);
        expect((after.children ?? []).length, `${entry.name}/${v.id || "default"} must not change structure`)
          .toBe((built.children ?? []).length);
        expect(after.variant, `${entry.name}/${v.id || "default"} records which design is on`).toBe(v.id);
      }
    }
  });

  it("applies designs through the canvas's WRAPPERS, not just to a freshly built tree", () => {
    // The canvas wraps each inserted element in its own container, so a real card on the page is
    // container > container > heading. A variant that matched only DIRECT children passed every test built
    // from build() and did nothing whatsoever on an actual card. This asserts the shape users really have.
    const wrap = (n: BoxNode): BoxNode =>
      n.children ? { ...n, children: n.children.map((c) => ({ id: `w-${c.id}`, type: "container", children: [wrap(c)] } as BoxNode)) } : n;

    const card = wrap(blockForKind("card"));
    const wide = applyPresetVariant(card, "horizontal");
    const imageOf = (n: BoxNode): BoxNode | undefined =>
      n.type === "image" ? n : (n.children ?? []).reduce<BoxNode | undefined>((a, c) => a ?? imageOf(c), undefined);
    expect(imageOf(wide)?.width, "the side-by-side design must reach the card's image").toBe("40%");

    const rating = wrap(blockForKind("rating"));
    const big = applyPresetVariant(rating, "large");
    const icons: BoxNode[] = [];
    (function walk(n: BoxNode) { if (n.type === "icon") icons.push(n); (n.children ?? []).forEach(walk); })(big);
    expect(icons.length, "the stars must still be found through the wrappers").toBe(5);
    expect(icons.every((i) => i.fontSize === 36), "every star must resize").toBe(true);
  });

  it("keeps designs INDEPENDENT — picking one never inherits leftovers from the last", () => {
    // Applying A then B must equal applying B on its own. Without this, a design only sets the properties it
    // "cares about" and silently inherits the rest: switching Side by side → Raised left the card's image at
    // 40% width, producing a card that matched no design in the gallery. Caught live in the browser first.
    const strip = (n: BoxNode): unknown => ({ ...n, id: undefined, children: (n.children ?? []).map(strip) });
    for (const entry of COMPONENT_CATALOGUE) {
      const built = entry.build();
      if (built.type === "component") continue;
      for (const a of presetVariants(entry.name)) {
        for (const b of presetVariants(entry.name)) {
          const viaA = applyPresetVariant(applyPresetVariant(built, a.id), b.id);
          const direct = applyPresetVariant(built, b.id);
          expect(strip(viaA), `${entry.name}: ${a.id || "default"} → ${b.id || "default"} must equal ${b.id || "default"} alone`)
            .toEqual(strip(direct));
        }
      }
    }
  });

  it("ASK-ON-ADD: every component offers real starting points, and each one changes what you get", () => {
    // Rule F. `getPresets` returned [] for every component, so the blocks with the most looks to choose from
    // were the only ones that never asked. Components answer from the catalogue now, so a future component
    // gets this by declaring designs — nothing extra to wire.
    for (const name of ALL_COMPONENTS) {
      const choices = getAddChoices(name, DEFAULT_THEME);
      expect(choices.length, `${name} must offer starting points when added`).toBeGreaterThan(1);
      expect(new Set(choices.map((c) => c.label)).size, `${name}: no duplicate labels`).toBe(choices.length);
      expect(choices.some((c) => c.label === "Default"), `${name}: the menu already offers Default`).toBe(false);

      const plain = JSON.stringify(strip(blockForKind(name)));
      for (const choice of choices) {
        const built = blockForKind(name, choice.patch);
        expect(built.id, `${name}/${choice.id} must build`).toBeTruthy();
        // The choice has to DO something — a menu entry that yields the default block is a lie.
        expect(JSON.stringify(strip(built)), `${name}/${choice.id} must differ from the default`).not.toBe(plain);
      }
    }
  });

  it("ASK-ON-ADD applies a chosen design, rather than only recording its name", () => {
    // For a tree the variant id is just a label until applyPresetVariant restyles the tree, so picking
    // "Side by side" at add time has to produce a side-by-side card, not a default one that claims to be one.
    const card = blockForKind("card", { variant: "horizontal" });
    expect(card.direction).toBe("row");
    const image = (function find(n: BoxNode): BoxNode | undefined {
      return n.type === "image" ? n : (n.children ?? []).reduce<BoxNode | undefined>((a, c) => a ?? find(c), undefined);
    })(card);
    expect(image?.width).toBe("40%");
  });

  it("leaves a node alone when the design is unknown", () => {
    const card = blockForKind("card");
    expect(applyPresetVariant(card, "no-such-design")).toBe(card);
  });
});
