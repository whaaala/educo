import { describe, it, expect } from "vitest";
import { getAddChoices, getPresets } from "@/lib/box-presets";
import { DEFAULT_THEME } from "@/lib/site-storage";

/**
 * WHAT A TILE ASKS BEFORE IT ADDS.
 *
 * Behaviours: tests/features/components/website/blocks-panel.feature.
 *
 * The test a question has to pass: is the answer STRUCTURAL, does it SUPPLY THE CONTENT, or does it name
 * the block's ROLE? Columns' shape is structural — changing three cells to four later means redoing the
 * content. A gallery's photographs are the content. A heading's Display-vs-Eyebrow is its place in the
 * document. All three earn an interruption.
 *
 * A LOOK on an EMPTY BOX does not. Adding a Section used to put a menu in the way of the commonest action
 * in the palette, asking which of four styles an invisible container should wear — with nothing inside it
 * to judge the answer against, and while the inspector already showed the same four presets as live
 * previews of the block with the user's own content in it.
 */

const theme = DEFAULT_THEME;

describe("tiles that add without asking", () => {
  it.each(["container", "row", "image", "icon"])(
    "%s adds straight away — its presets are a look, not a decision", (kind) => {
      expect(getAddChoices(kind, theme), "no question before there is anything to look at").toEqual([]);
    });

  it.each(["heading", "text", "button", "divider"])(
    "%s still asks — its choice is the block's role, not decoration", (kind) => {
      expect(getAddChoices(kind, theme).length, `${kind} should still offer its starting points`).toBeGreaterThan(0);
    });

  it("a grid still asks for its SHAPE, which is structural", () => {
    const choices = getAddChoices("grid", theme);
    expect(choices.length).toBeGreaterThan(0);
    expect(choices.every((c) => Array.isArray(c.patch.children)), "every one lays out real cells").toBe(true);
  });
});

describe("the looks are not lost — they move to where they can be judged", () => {
  it.each(["container", "image", "icon"])("%s keeps every preset in the inspector", (kind) => {
    expect(getPresets(kind, theme).length, "the styles still exist; only the moment of choosing changed").toBeGreaterThan(0);
  });

  it("a container keeps all four of its looks", () => {
    expect(getPresets("container", theme).map((p) => p.id)).toEqual(["plain", "card", "outline", "tinted"]);
  });

  it("and the looks are genuinely different from one another", () => {
    // RULE T, at the level this can be checked without a browser: no two presets write the same patch.
    const seen = new Map<string, string>();
    for (const p of getPresets("container", theme)) {
      const key = JSON.stringify(p.patch);
      expect(seen.has(key), `${p.label} and ${seen.get(key)} produce the same block`).toBe(false);
      seen.set(key, p.label);
    }
  });

  it("'Plain' earns its place HERE, because here there is something to clear", () => {
    // At add-time it was pixel-identical to "Default": clearing a background, border and radius from a box
    // that has none is doing nothing. On a block somebody has styled, it is the way back.
    const plain = getPresets("container", theme).find((p) => p.id === "plain")!;
    expect(plain.patch).toMatchObject({ background: undefined, borderWidth: 0, shadow: undefined, radius: 0 });
  });
});
