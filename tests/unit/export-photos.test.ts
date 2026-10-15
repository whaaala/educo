import { describe, it, expect } from "vitest";
import { renderSiteFiles, photosToFiles, addSrcset } from "@/lib/box-export";
import { DEFAULT_THEME } from "@/lib/site-storage";
import type { BoxSite } from "@/lib/box-site";
import type { BoxNode } from "@/lib/box-model";

/**
 * PHOTOS AS FILES (RA-8, BATCH A-1 change (3)) — the engine half. Scenarios: box-builder-site.feature
 * ("Photos arrive as files…"). The canvas half (narrower copies) is driven in the headed pass U3.
 */

const JPEG = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDA==";
const PNG = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

const page = (id: string, path: string, children: unknown[]) => ({
  id, name: path, path, root: { id: `root-${id}`, type: "container", direction: "column", children } as unknown as BoxNode,
});
const site = (): BoxSite => ({
  homeId: "p1",
  pages: [
    page("p1", "home", [
      { id: "a", type: "image", src: JPEG, alt: "Pupils at assembly", imgW: 1600, imgH: 900 },
      { id: "b", type: "container", direction: "column", bgImage: PNG, children: [{ id: "t", type: "text", text: "Welcome" }] },
    ]),
    page("p2", "about", [{ id: "c", type: "image", src: JPEG, alt: "Pupils at assembly", imgW: 1600, imgH: 900 }]),
  ],
} as unknown as BoxSite);

describe("photos leave the pages", () => {
  const { files, photos } = photosToFiles(renderSiteFiles(site(), DEFAULT_THEME));

  it("no data: photo is left in any file", () => {
    for (const [name, text] of Object.entries(files)) expect(text, name).not.toMatch(/data:image\/(jpeg|png)/);
  });

  it("the same photo on two pages is ONE file, so a visitor downloads it once", () => {
    const jpgs = Object.keys(photos).filter((f) => f.endsWith(".jpg"));
    expect(jpgs).toHaveLength(1);
    expect(files["index.html"]).toContain(`src="${jpgs[0]}"`);
    expect(files["about.html"]).toContain(`src="${jpgs[0]}"`);
    expect(photos[jpgs[0]]).toBe(JPEG);
  });

  it("a band's background photo becomes a file too", () => {
    const png = Object.keys(photos).find((f) => f.endsWith(".png"))!;
    expect(png).toMatch(/^images\/[a-z0-9]+\.png$/);
    expect(Object.values(files).join("\n")).toContain(png);
  });

  it("a site with no photos is untouched", () => {
    const plain = renderSiteFiles({ homeId: "p1", pages: [page("p1", "home", [{ id: "t", type: "text", text: "Hi" }])] } as unknown as BoxSite, DEFAULT_THEME);
    const out = photosToFiles(plain);
    expect(out.photos).toEqual({});
    expect(out.files).toEqual(plain);
  });
});

describe("srcset — a phone fetches the copy its screen needs", () => {
  const html = `<img src="images/x.jpg" alt="a" width="1600" height="900" loading="lazy" decoding="async" /><img src="images/y.jpg" alt="b" loading="eager" />`;
  const copies = {
    "images/x.jpg": [{ w: 480, file: "images/x-480.jpg" }, { w: 960, file: "images/x-960.jpg" }, { w: 1600, file: "images/x.jpg" }],
    "images/y.jpg": [{ w: 480, file: "images/y-480.jpg" }, { w: 900, file: "images/y.jpg" }],
  };
  const out = addSrcset({ "index.html": html, "styles.css": "a{background:url(images/x.jpg)}" }, copies)["index.html"];

  it("lists every copy with its width, the original last", () => {
    expect(out).toContain(`srcset="images/x-480.jpg 480w, images/x-960.jpg 960w, images/x.jpg 1600w"`);
  });
  it("a lazy picture is sized by its own box; an eager one by the window", () => {
    expect(out).toMatch(/src="images\/x\.jpg" srcset="[^"]+" sizes="auto, 100vw"/);
    expect(out).toMatch(/src="images\/y\.jpg" srcset="[^"]+" sizes="100vw"/);
  });
  it("keeps the picture's alt, width, height and loading", () => {
    expect(out).toContain(`alt="a" width="1600" height="900" loading="lazy"`);
  });
  it("leaves a photo with no narrower copy, and the stylesheet, alone", () => {
    const one = addSrcset({ "index.html": html, "styles.css": "a{}" }, { "images/x.jpg": [{ w: 400, file: "images/x.jpg" }] });
    expect(one["index.html"]).toBe(html);
    expect(one["styles.css"]).toBe("a{}");
  });
});
