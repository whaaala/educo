import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { containerLabel, createContainer } from "@/lib/box-model";

/**
 * THE THREE LAYOUT BLOCKS ARE NAMED FOR WHAT THEY DO — in every place they are named.
 *
 * Behaviours: tests/features/components/website/blocks-panel.feature.
 *
 * They were Section / Columns / Row, and UAT produced four separate complaints about that in one sitting:
 *   1. "Section" meant a plain transparent box in the palette and a tinted, 48px-padded band on the top bar;
 *   2. the palette's own hint — "A band you fill with anything" — described the TOP BAR, not the tile;
 *   3. "Columns" named a picker that sweeps across AND down, which is a grid;
 *   4. the three names gave a reader no way to tell them apart.
 *
 * The last one matters most, because they are ONE object: the same node goes column → row → grid with a
 * single click in "Arrange as". Naming each for its arrangement is what makes that switch legible.
 *
 * The drift this guards is mechanical: the inspector, the drag preview and the palette each computed the
 * name from their own copy of the same expression. They are `containerLabel` now, and this asserts the
 * palette agrees with it — a rename that reaches two of the three is the failure mode.
 */

// Normalised at the point of reading: a CRLF checkout otherwise breaks any match spanning a line break.
const read = (p: string) => readFileSync(resolve(process.cwd(), p), "utf8").replace(/\r\n/g, "\n");
const panel = read("components/website/box/BlocksPanel.tsx");
const feature = read("tests/features/components/website/blocks-panel.feature");

/** The palette's Layout tiles, in the order a user meets them. */
const layoutTiles = [...panel.matchAll(/\{ kind: "(container|row|grid)", label: "([^"]+)", Icon: \w+, hint: "([^"]+)" \}/g)]
  .map((m) => ({ kind: m[1], label: m[2], hint: m[3] }));

describe("a container is named for its arrangement", () => {
  it("resolves each arrangement to the name the user was promised", () => {
    expect(containerLabel(createContainer("column", { direction: "column" }))).toBe("Stack");
    expect(containerLabel(createContainer("column", { direction: "row" }))).toBe("Side by side");
    expect(containerLabel(createContainer("column", { layout: "grid" }))).toBe("Grid");
  });

  it("calls a grid a Grid whichever way its direction happens to be set", () => {
    // `layout` wins: a grid with `direction:"row"` left over from a switch is still a grid.
    expect(containerLabel(createContainer("column", { layout: "grid", direction: "row" }))).toBe("Grid");
  });

  it("defaults to Stack when no direction is stored, rather than to nothing", () => {
    expect(containerLabel({ id: "x", type: "container" })).toBe("Stack");
  });
});

describe("the palette agrees with the resolver", () => {
  it("finds the three Layout tiles at all, so an empty match cannot pass this file", () => {
    expect(layoutTiles.map((t) => t.kind)).toEqual(["container", "row", "grid"]);
  });

  it("labels each tile with exactly what the inspector and the drag preview will call it", () => {
    const expected: Record<string, string> = { container: "Stack", row: "Side by side", grid: "Grid" };
    for (const tile of layoutTiles) {
      expect(tile.label, `the "${tile.kind}" tile must match containerLabel`).toBe(expected[tile.kind]);
    }
  });

  it("orders them down the page, across the page, then both — the same order the feature file states", () => {
    expect(layoutTiles.map((t) => t.label)).toEqual(["Stack", "Side by side", "Grid"]);
  });

  it("gives each tile a hint that describes ITSELF", () => {
    const hints = Object.fromEntries(layoutTiles.map((t) => [t.kind, t.hint]));
    expect(hints.container, "the old hint described the top bar's band instead").toBe("Blocks one under the other");
    expect(hints.row).toBe("Blocks in a row, across the page");
    expect(hints.grid, "it sweeps across AND down, so say so").toContain("across and down");
    // The specific wording that was wrong, named so it cannot quietly come back.
    expect(Object.values(hints).join(" ")).not.toContain("A band you fill with anything");
  });

  it("uses none of the three old names for a tile, since each caused a reported problem", () => {
    const labels = layoutTiles.map((t) => t.label);
    for (const old of ["Section", "Columns", "Row"]) {
      expect(labels, `"${old}" was renamed for a reason recorded in the feature file`).not.toContain(old);
    }
  });

  it("is stated in the feature file, which is the source of truth", () => {
    for (const name of ["Stack", "Side by side", "Grid", "Add a band"]) {
      expect(feature, `the behaviour file must state "${name}"`).toContain(name);
    }
  });
});
