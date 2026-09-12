import { describe, it, expect } from "vitest";
import { photoGallery, blockForKind, type GalleryPhoto } from "@/lib/box-presets";
import { GRID_MAX, isContainer } from "@/lib/box-model";

/**
 * THE PHOTO GALLERY IS A GRID, NOT A COMPONENT.
 *
 * Behaviours: tests/features/components/website/box-builder-columns.feature.
 *
 * The whole design rests on that sentence, so it is what these assert. A component's content is a flat
 * `ComponentItem` — title, body, one `media` URL, no `BoxNode` anywhere — so a gallery built that way could
 * never hold a cell you design, and the twelve-column grid would stop applying inside it. What the tile
 * removes is the TYPING (twelve drags and twelve file dialogs), never the freedom.
 */

const photos = (n: number): GalleryPhoto[] =>
  Array.from({ length: n }, (_, i) => ({ src: `data:image/jpeg;base64,AA${i}`, imgW: 600, imgH: 400, alt: `photo ${i}` }));

describe("photoGallery", () => {
  it("is an ordinary twelve-column grid of ordinary containers", () => {
    const g = photoGallery(photos(6), { across: 3 });
    expect(g.layout, "a grid, so every column control still applies").toBe("grid");
    expect(g.columns, "the twelve underneath, as everywhere else").toBe(GRID_MAX);
    expect(g.type).toBe("container");
    for (const cell of g.children ?? []) {
      expect(isContainer(cell), "a cell is a container you can put anything in, not a fixed item").toBe(true);
      expect(cell.children?.[0]?.type, "holding an ordinary Image block").toBe("image");
    }
  });

  it("gives one cell per photograph, spanning the twelve exactly", () => {
    for (const across of [2, 3, 4, 6]) {
      const g = photoGallery(photos(7), { across });
      expect(g.children, `${across} across: one cell per photo`).toHaveLength(7);
      expect(new Set((g.children ?? []).map((c) => c.colSpan)), `${across} across: every cell the same span`).toEqual(new Set([GRID_MAX / across]));
      expect((GRID_MAX / across) * across, "and the row adds up to the twelve").toBe(GRID_MAX);
    }
  });

  it("carries each photograph's source, measured shape and alt text onto its Image block", () => {
    const g = photoGallery(photos(3), { across: 3 });
    const imgs = (g.children ?? []).map((c) => c.children?.[0]);
    expect(imgs.map((i) => i?.src)).toEqual(["data:image/jpeg;base64,AA0", "data:image/jpeg;base64,AA1", "data:image/jpeg;base64,AA2"]);
    expect(imgs.every((i) => i?.imgW === 600 && i?.imgH === 400), "the shape, so the box exists before the bytes do").toBe(true);
    expect(imgs.map((i) => i?.alt), "alt text, which is the half people forget").toEqual(["photo 0", "photo 1", "photo 2"]);
  });

  it("shows the whole picture rather than cropping it to a common height", () => {
    const g = photoGallery(photos(2), { across: 2 });
    expect((g.children ?? [])[0].children?.[0]?.height, "height auto — the photo keeps its own proportions").toBe("auto");
  });

  it("has NO spacing and NO rounding unless the setup asked for them", () => {
    // The standing rule: a box is square, flush and unspaced until somebody says otherwise. A gallery is
    // not an exception — the setup screen shows a spacing slider that starts at nothing, so whatever
    // arrives is what the user watched themselves choose.
    const bare = photoGallery(photos(4), { across: 4 });
    expect(bare.gap, "no gap invented").toBe(0);
    expect(bare.padding, "no padding invented").toBe(0);
    expect(bare.rowFlow, "and no masonry unless asked").toBeUndefined();
    for (const cell of bare.children ?? []) {
      expect(cell.radius, "no radius on a cell").toBeUndefined();
      expect(cell.children?.[0]?.radius, "and none on the picture").toBeUndefined();
    }
  });

  it("passes the chosen spacing and row heights straight through", () => {
    const g = photoGallery(photos(4), { across: 4, stagger: true, gap: 24 });
    expect(g.gap).toBe(24);
    expect(g.rowFlow, "Follow the picture is the masonry row flow — the same one the Arrange panel sets").toBe("masonry");
  });

  it("rounds an impossible count to one the twelve can express exactly", () => {
    // Five across cannot be twelfths (12/5 = 2.4) and a row of five where two are wider is worse than four.
    const g = photoGallery(photos(5), { across: 5 });
    expect(GRID_MAX % (g.children ?? [])[0].colSpan!, "every span divides the twelve").toBe(0);
  });

  it("gives every gallery its own ids, so adding two never makes them share one", () => {
    const a = photoGallery(photos(3), { across: 3 });
    const b = photoGallery(photos(3), { across: 3 });
    const ids = (n: typeof a): string[] => [n.id, ...(n.children ?? []).flatMap(ids)];
    expect(new Set([...ids(a), ...ids(b)]).size).toBe(ids(a).length + ids(b).length);
  });

  it("is reachable from the palette kind, so a drop that skips the setup still gets a real grid", () => {
    const g = blockForKind("gallery");
    expect(g.layout).toBe("grid");
    expect(g.children, "empty — the setup replaces it wholesale, and a route that skips it adds nothing odd").toHaveLength(0);
  });
});
