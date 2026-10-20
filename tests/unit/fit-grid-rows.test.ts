import { describe, it, expect } from "vitest";
import { containerStyle, createContainer, createGrid, gridRowTracks, type BoxNode } from "@/lib/box-model";

/**
 * A CARD GIVEN A HEIGHT OF ITS OWN IN A GRID OF "AS MANY AS FIT" (BATCH LE15k-ai — tests/features/components/website/box-builder-spacing.feature,
 * "A card in a grid of cards is sized…, Just this one instead"). Measured on the phone 2026-10-20: one quick-link card made taller alone,
 * and every other card stayed as tall — the rows were named from the grid's STORED columns (3), but an auto-fit grid draws one across on
 * a phone, so the names fell on the wrong rows and the rest kept the even `1fr`, which in a grid of no set height is the tallest row.
 * Such a grid's rows cannot be named from data (the browser decides how many fit), so once a card carries a height its rows follow
 * their content; untouched, the grid keeps its even rows.
 */
const cards = (n: number, sized: Partial<BoxNode>[] = []): BoxNode => {
  const g = createGrid(3, { minCard: "16rem", fitMost: 3 });
  g.children = Array.from({ length: n }, (_, i) => ({ ...createContainer("column"), ...(sized[i] ?? {}) }));
  return g;
};

describe("an auto-fit grid's rows", () => {
  it("stay even while no card has a height of its own", () => {
    expect(containerStyle(cards(6)).gridAutoRows).toBe("minmax(min-content, 1fr)");
  });
  it("follow their content once one card has a height of its own — on every screen, however many fit", () => {
    const g = cards(6, [{}, { minHeight: 140 }]);
    expect(containerStyle(g).gridAutoRows).toBe("auto");
    expect(gridRowTracks(g), "no row names guessed from stored columns").toBeNull();
    const phone = cards(6, [{}, { responsive: { phone: { minHeight: 140 } } }]);
    expect(containerStyle(phone, "phone").gridAutoRows).toBe("auto");
  });
  it("leave a fixed grid's named rows as they were", () => {
    const g = createGrid(3); g.children = Array.from({ length: 6 }, (_, i) => ({ ...createContainer("column"), ...(i === 0 ? { minHeight: 140 } : {}) }));
    expect(gridRowTracks(g)).toBe("auto minmax(min-content, 1fr)");
  });
});
