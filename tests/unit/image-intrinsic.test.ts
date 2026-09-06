import { describe, it, expect, vi, afterEach } from "vitest";
import {
  createContainer, createElement, makeRowBand, imageSizing, hasIntrinsicSize, measureImage,
  MEASURE_TIMEOUT_MS, type BoxNode,
} from "@/lib/box-model";
import { renderPageHTML } from "@/lib/box-export";
import { DEFAULT_THEME } from "@/lib/site-storage";

/**
 * AN IMAGE MUST HOLD ITS OWN SHAPE BEFORE IT ARRIVES.
 *
 * Until the intrinsic size was measured, the builder had no idea what shape a photo was, so every image was
 * forced into a 260px letterbox and "auto" in the Height field silently did nothing. Two consequences: a school
 * could never show a portrait photo uncropped, and the browser could not reserve the right box before the bytes
 * landed — the text beneath a picture jumps as it loads (Cumulative Layout Shift).
 *
 * See tests/features/components/website/box-builder-images.feature.
 */

const imageNode = (patch: Partial<BoxNode>): BoxNode =>
  createElement("image", { id: "img", src: "https://example.org/garden.jpg", ...patch } as Partial<BoxNode>);

const pageWith = (patch: Partial<BoxNode>) => {
  const root = createContainer("column", { id: "r", children: [makeRowBand([imageNode(patch)])] } as Partial<BoxNode>);
  return renderPageHTML(root, DEFAULT_THEME);
};

describe("hasIntrinsicSize", () => {
  it("is true only when both dimensions are real pixels", () => {
    expect(hasIntrinsicSize(imageNode({ imgW: 1600, imgH: 900 }))).toBe(true);
  });

  it("rejects a missing dimension, so half a measurement never reaches the page", () => {
    expect(hasIntrinsicSize(imageNode({ imgW: 1600 }))).toBe(false);
    expect(hasIntrinsicSize(imageNode({ imgH: 900 }))).toBe(false);
    expect(hasIntrinsicSize(imageNode({}))).toBe(false);
  });

  it("rejects zero — an SVG with no intrinsic size reports it, and 0/0 is not an aspect ratio", () => {
    expect(hasIntrinsicSize(imageNode({ imgW: 0, imgH: 0 }))).toBe(false);
    expect(hasIntrinsicSize(imageNode({ imgW: 300, imgH: 0 }))).toBe(false);
  });
});

describe("imageSizing", () => {
  it("keeps a height the user set, because cropping to a shape is a design choice", () => {
    expect(imageSizing(imageNode({ height: "420px", imgW: 1600, imgH: 900 })))
      .toEqual({ height: "420px" });
  });

  it("takes the photo's own shape when no height is asked for", () => {
    expect(imageSizing(imageNode({ height: "auto", imgW: 1600, imgH: 900 })))
      .toEqual({ height: "auto", aspectRatio: "1600 / 900" });
  });

  it("treats a cleared height the same as 'auto' — both mean 'do not crop it'", () => {
    expect(imageSizing(imageNode({ height: undefined, imgW: 800, imgH: 1200 })))
      .toEqual({ height: "auto", aspectRatio: "800 / 1200" });
  });

  it("falls back to the letterbox when the shape is unknown, or the box would collapse to nothing", () => {
    // `object-fit: cover` inside a `height: auto` box with no aspect-ratio has no height at all: the picture
    // would vanish. The old fixed height is the only safe answer without a measurement.
    expect(imageSizing(imageNode({ height: "auto" }))).toEqual({ height: "260px" });
    expect(imageSizing(imageNode({}))).toEqual({ height: "260px" });
  });

  it("resolves 'fill' like any other explicit size", () => {
    expect(imageSizing(imageNode({ height: "fill", imgW: 4, imgH: 3 }))).toEqual({ height: "100%" });
  });
});

describe("the exported <img>", () => {
  it("carries the intrinsic width and height, which is what reserves the box", () => {
    const html = pageWith({ imgW: 1600, imgH: 900 });
    expect(html).toContain('width="1600"');
    expect(html).toContain('height="900"');
  });

  it("omits them when the photo has never been measured, rather than guessing", () => {
    // A wrong guess is worse than no attribute: the browser would reserve the wrong box and shift ANYWAY.
    const html = pageWith({});
    expect(html).not.toContain('width="');
    expect(html).not.toContain('height="');
  });

  it("holds the shape open with aspect-ratio when it is not cropped", () => {
    expect(pageWith({ height: "auto", imgW: 1600, imgH: 900 })).toContain("aspect-ratio:1600 / 900");
  });

  it("does not emit an aspect-ratio that a fixed height would override anyway", () => {
    expect(pageWith({ height: "420px", imgW: 1600, imgH: 900 })).not.toContain("aspect-ratio");
  });

  it("still crops to the height the user chose", () => {
    const html = pageWith({ height: "420px", imgW: 1600, imgH: 900 });
    expect(html).toContain("height:420px");
    expect(html).toContain("object-fit:cover");
  });

  it("keeps the alt and loading behaviour it already had", () => {
    const html = pageWith({ imgW: 1600, imgH: 900, alt: "Pupils in the garden" });
    expect(html).toContain('alt="Pupils in the garden"');
    expect(html).toContain('loading="lazy"');
    expect(html).toContain('decoding="async"');
  });
});

describe("measureImage", () => {
  const originalImage = globalThis.Image;
  afterEach(() => { globalThis.Image = originalImage; });

  /** jsdom never decodes an image, so the browser's half is stubbed here and proven for real in
   *  tests/e2e/image-intrinsic.spec.ts, which uploads an actual file through the actual builder. */
  function stubImage(behaviour: (img: Record<string, unknown>) => void) {
    class FakeImage {
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      naturalWidth = 0;
      naturalHeight = 0;
      set src(_v: string) { setTimeout(() => behaviour(this as unknown as Record<string, unknown>), 0); }
    }
    globalThis.Image = FakeImage as unknown as typeof Image;
  }

  it("reports the size the browser decoded", async () => {
    stubImage((img) => { img.naturalWidth = 1600; img.naturalHeight = 900; (img.onload as () => void)(); });
    await expect(measureImage("data:image/png;base64,xx")).resolves.toEqual({ imgW: 1600, imgH: 900 });
  });

  it("gives up quietly on a file the browser cannot decode", async () => {
    // Not an error: the picture still goes on the page, it just keeps the fixed height.
    stubImage((img) => (img.onerror as () => void)());
    await expect(measureImage("data:image/png;base64,broken")).resolves.toEqual({});
  });

  it("rejects a zero-sized decode rather than storing 0 as a shape", async () => {
    stubImage((img) => { img.naturalWidth = 0; img.naturalHeight = 0; (img.onload as () => void)(); });
    await expect(measureImage("data:image/svg+xml,<svg/>")).resolves.toEqual({});
  });

  it("settles even if the decode never finishes, so the upload can never hang", async () => {
    vi.useFakeTimers();
    try {
      stubImage(() => { /* never calls back */ });
      const pending = measureImage("data:image/png;base64,hangs");
      await vi.advanceTimersByTimeAsync(MEASURE_TIMEOUT_MS + 1);
      await expect(pending).resolves.toEqual({});
    } finally {
      vi.useRealTimers();
    }
  });

  it("answers immediately with nothing when there is no picture, or no browser to decode in", async () => {
    await expect(measureImage("")).resolves.toEqual({});
    globalThis.Image = undefined as unknown as typeof Image;
    await expect(measureImage("data:image/png;base64,xx")).resolves.toEqual({});
  });
});
