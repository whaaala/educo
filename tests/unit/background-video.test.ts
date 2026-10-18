import { describe, it, expect } from "vitest";
import { createContainer, createElement, backgroundCss, bgVideoSrc, type BoxNode } from "@/lib/box-model";
import { renderSitePage, photosToFiles } from "@/lib/box-export";
import { siteFromRoot } from "@/lib/box-site";
import { DEFAULT_THEME } from "@/lib/site-storage";
import INSPECTOR from "@/config/inspector.json";

/**
 * MS-5b-c · a background video on the published page (BATCH LE-5). Scenarios: tests/features/components/website/background-video.feature
 * ("On the published page"). Whether it really plays, pauses and stays still is driven HEADED (scripts/uat/uat-le5-headed.js).
 */
const H = "b".repeat(64);
const POSTER = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDA==";
const band = (patch: Partial<BoxNode>) => ({ ...createContainer("column"), id: "hero", children: [{ ...createElement("heading"), id: "h", text: "Welcome" }], ...patch }) as BoxNode;
const page = (b: BoxNode) => {
  const root = { ...createContainer("column"), id: "r", children: [b] } as BoxNode;
  const site = siteFromRoot(root);
  return renderSitePage(site, DEFAULT_THEME, site.homeId, { inlineShared: true });
};
const videoTag = (html: string) => html.match(/<video class="eu-bgvideo"[^>]*>/)?.[0] ?? "";

describe("the published video", () => {
  const html = page(band({ bgVideo: `media:${H}.mp4`, bgVideoPoster: POSTER }));
  const tag = videoTag(html);

  it("is the block's first child, before its content", () => {
    expect(tag).not.toBe("");
    expect(html.indexOf(tag)).toBeLessThan(html.indexOf("Welcome"));
  });
  it("is silent, inline, looping, hidden from screen readers, out of the tab order, and loads nothing by itself", () => {
    for (const a of [" muted", " loop", " playsinline", ` preload="none"`, ` aria-hidden="true"`, ` tabindex="-1"`]) expect(tag).toContain(a);
  });
  it("has NO autoplay and NO src — the page's few lines start it, so without them it is the still poster", () => {
    expect(tag).not.toMatch(/\bautoplay\b/);
    expect(tag).not.toMatch(/\ssrc=/);
    expect(tag).toContain(`data-src="videos/${H}.mp4"`);
    expect(tag).toContain(`poster="${POSTER}"`);
  });
  it("a linked video plays from its link", () => {
    expect(videoTag(page(band({ bgVideo: "https://example.org/loop.webm" })))).toContain(`data-src="https://example.org/loop.webm"`);
  });
  it("a YouTube page (or anything that is not a video file) publishes no video", () => {
    expect(videoTag(page(band({ bgVideo: "https://www.youtube.com/watch?v=abc" })))).toBe("");
    expect(bgVideoSrc({ bgVideo: "javascript:alert(1)" } as BoxNode)).toBeNull();
  });
  it("Play / Pause is a real button on the block, named from config — Play until the script starts it, both words on it", () => {
    const btn = html.match(/<button type="button" class="eu-bgvideo__toggle"[^>]*>/)?.[0] ?? "";
    expect(btn).toContain(`aria-label="${INSPECTOR.bgVideo.play}"`);
    expect(btn).toContain(`data-eu-bgv-pause="${INSPECTOR.bgVideo.pause}"`);
    expect(btn).not.toMatch(/tabindex="-1"/);
  });
  it("the script plays it only when motion is allowed and the connection can carry it", () => {
    expect(html).toContain("prefers-reduced-motion: reduce");
    expect(html).toContain("saveData");
    expect(html).toMatch(/effectiveType/);
    expect(html).toContain("video.eu-bgvideo");
  });
  it("the script ships ONCE however many videos a page has", () => {
    const root = { ...createContainer("column"), id: "r", children: [band({ id: "a", bgVideo: `media:${H}.mp4` }), band({ id: "b", bgVideo: `media:${H}.mp4` })] } as BoxNode;
    const site = siteFromRoot(root);
    const two = renderSitePage(site, DEFAULT_THEME, site.homeId, { inlineShared: true });
    expect(two.match(/<video class="eu-bgvideo"/g)).toHaveLength(2);
    expect(two.match(/querySelectorAll\('video\.eu-bgvideo'\)/g)).toHaveLength(1);
  });
  it("a block with no video ships none of it", () => {
    const plain = page(band({}));
    expect(plain).not.toContain("eu-bgvideo");
    expect(plain).not.toContain("video.eu-bgvideo");
  });
  it("the poster becomes a file in the download", () => {
    const { files } = photosToFiles({ "index.html": html });
    expect(videoTag(files["index.html"])).toMatch(/poster="images\/[a-z0-9]+\.jpg"/);
  });
});

describe("a section shown one page at a time keeps its video behind the strip, never as a page", () => {
  it("the video comes before the strip, not inside it", () => {
    const html = page(band({ pager: true, bgVideo: `media:${H}.mp4`, children: [{ ...createContainer("column"), id: "p1" }, { ...createContainer("column"), id: "p2" }] } as Partial<BoxNode>));
    const strip = html.match(/<div data-eu-pager[^>]*>([\s\S]*?)<\/div><nav|<div data-eu-pager[^>]*>([\s\S]*)/)?.[0] ?? "";
    expect(strip).not.toBe("");
    expect(strip).not.toContain("<video");
    expect(html.indexOf(`<video class="eu-bgvideo"`)).toBeLessThan(html.indexOf("<div data-eu-pager"));
  });
});

describe("the overlay sits OVER the video, under the words", () => {
  const b = band({ bgVideo: `media:${H}.mp4`, bgOverlay: "#000000", background: "#112233" });
  it("the block's own background keeps its colour but not the overlay (the video would cover it)", () => {
    const css = backgroundCss(b);
    expect(css.backgroundColor).toBeTruthy();
    expect(String(css.backgroundImage ?? "")).toBe("");
  });
  it("a shade after the video carries it", () => {
    const html = page(b);
    const v = html.indexOf(`<video class="eu-bgvideo"`), s = html.indexOf(`<span class="eu-bgvideo__shade"`); // the tags — the CSS names them first
    expect(v).toBeGreaterThan(-1);
    expect(s).toBeGreaterThan(v);
    expect(html.indexOf("Welcome")).toBeGreaterThan(s);
  });
  it("without a video the overlay stays on the background, as before", () => {
    expect(String(backgroundCss(band({ bgOverlay: "#000000", bgImage: "https://e.org/a.jpg" })).backgroundImage)).toContain("linear-gradient");
  });
});

describe("the block holds the video without taking its own position away (LE5-4's lesson)", () => {
  it("relative only at zero specificity, isolated so the video stays inside", () => {
    const html = page(band({ bgVideo: `media:${H}.mp4` }));
    expect(html).toMatch(/:where\(\.bx-hero\)\{position:relative\}/);
    expect(html).toMatch(/\.bx-hero\{isolation:isolate\}/);
  });
});
