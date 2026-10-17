import { describe, it, expect } from "vitest";
import type { BoxNode } from "@/lib/box-model";
import { blockForKind, getPresets, presetKindFor, photoGallery, photoSlider, heroSection, rotatingHero, type GalleryPhoto } from "@/lib/box-presets";
import { siteFromRoot } from "@/lib/box-site";
import { renderSitePage } from "@/lib/box-export";
import { DEFAULT_THEME } from "@/lib/site-storage";
import { GROUPS } from "@/components/website/box/BlocksPanel";

/**
 * EVERY PICTURE KEEPS ITS SHAPE WHILE IT LOADS (BATCH LE-2; rule 16 flexible media; RULE AF — on 3G a page that jumps as each
 * photo lands loses the reader's line). Every `<img>` and `<video>` the export writes must reserve its box BEFORE a byte arrives —
 * `width`/`height` attributes, an `aspect-ratio`, or a set height — and a photo must be cropped (`object-fit`), never squashed.
 *
 * ENUMERATED, not listed: every tile of the blocks panel (GROUPS — the palette itself, so a block added there is covered the day it
 * appears) and every Styles preset of each, with sample photos wherever a block can hold one (a picture, its items' media, a
 * gallery's or slider's photos, a hero's photo, a video file).
 */
const PHOTO: GalleryPhoto = { src: "images/sample.jpg", imgW: 1600, imgH: 900, alt: "A sample photo" };
const KINDS = GROUPS.flatMap((g) => g.blocks.map((b) => b.kind));

/** Give every place a block can hold a picture one, as a person uploading photos would. */
function withPhotos(n: BoxNode): BoxNode {
  const out = { ...n } as BoxNode & { items?: { media?: string; mediaAlt?: string }[] };
  if (n.type === "image" && !n.src) Object.assign(out, { src: PHOTO.src, imgW: PHOTO.imgW, imgH: PHOTO.imgH, alt: PHOTO.alt });
  if (n.type === "video" && !n.src) out.src = "media/clip.mp4";
  if (out.items) out.items = out.items.map((it) => ({ ...it, media: it.media ?? PHOTO.src, mediaAlt: "A sample photo" }));
  if (n.component === "accordion") out.accSplitMedia = PHOTO.src;
  if (n.children) out.children = n.children.map(withPhotos);
  return out;
}
const build = (kind: string): BoxNode =>
  kind === "gallery" ? photoGallery([PHOTO, PHOTO, PHOTO], { across: 3 })
  : kind === "slider" ? photoSlider([PHOTO, PHOTO])
  : kind === "hero" ? heroSection(PHOTO, "Welcome")
  : kind === "rotatingHero" ? rotatingHero([PHOTO, PHOTO], "Welcome")
  : blockForKind(kind, { id: "probe" } as Partial<BoxNode>);

const render = (block: BoxNode) => {
  const site = siteFromRoot({ id: "root", type: "container", direction: "column", children: [withPhotos(block)] } as BoxNode);
  return renderSitePage(site, DEFAULT_THEME, site.homeId, { inlineShared: true });
};
/** The declarations the page's CSS gives a class (every rule naming it), for a picture shaped by its component's stylesheet. */
const classDecls = (html: string, cls: string) => [...html.matchAll(new RegExp(`\\.${cls}(?![\\w-])[^{]*\\{([^}]*)\\}`, "g"))].map((m) => m[1]).join(";");

/** What is wrong with each picture on the page: no box reserved, or a photo that would be squashed. */
function problems(html: string): string[] {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const out: string[] = [];
  for (const el of Array.from(doc.querySelectorAll("img, video"))) {
    const style = el.getAttribute("style") ?? "", cls = Array.from(el.classList).map((c) => classDecls(html, c)).join(";");
    const all = `${style};${cls}`;
    const reserved = (el.hasAttribute("width") && el.hasAttribute("height")) || /aspect-ratio\s*:/.test(all)
      || /(?:^|;)\s*(?:height|block-size)\s*:\s*(?!auto)[^;]+/.test(all);
    const cropped = el.tagName === "VIDEO" || /object-fit\s*:\s*(cover|contain)/.test(all);
    const name = `<${el.tagName.toLowerCase()}${el.className ? " ." + el.className : ""}>`;
    if (!reserved) out.push(`${name} reserves no box before it loads`);
    if (!cropped) out.push(`${name} has no object-fit — the photo is squashed to its box`);
  }
  return out;
}

describe("every picture keeps its shape while it loads — every palette tile and every design", () => {
  it("the palette is enumerated, not listed (a picture block is in it)", () => {
    expect(KINDS).toEqual(expect.arrayContaining(["image", "gallery", "slider", "hero", "video"]));
  });
  for (const kind of KINDS) {
    it(`${kind}: every design`, () => {
      const block = build(kind);
      const looks = [{ id: "as added", patch: {} as Partial<BoxNode> }, ...getPresets(presetKindFor(block), DEFAULT_THEME).map((p) => ({ id: p.id, patch: p.patch }))];
      const bad = looks.flatMap((l) => problems(render({ ...block, ...l.patch } as BoxNode)).map((p) => `${l.id}: ${p}`));
      expect(bad).toEqual([]);
    });
  }
  it("the guard sees a picture with no box (it can fail)", () => {
    expect(problems('<img src="a.jpg" style="width:100%">')).toHaveLength(2);
    expect(problems('<img src="a.jpg" width="4" height="3" style="object-fit:cover">')).toEqual([]);
  });
});
