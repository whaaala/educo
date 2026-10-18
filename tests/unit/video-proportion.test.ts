import { describe, it, expect } from "vitest";
import type { BoxNode } from "@/lib/box-model";
import { createElement } from "@/lib/box-model";
import { getPresets } from "@/lib/box-presets";
import { siteFromRoot } from "@/lib/box-site";
import { renderSitePage, videoScript } from "@/lib/box-export";
import { DEFAULT_THEME } from "@/lib/site-storage";
import LAYOUT from "@/config/layout.json";

/**
 * A VIDEO IS SIZED BY ITS WIDTH AND ITS PROPORTION, never by a stored height (RX3-2, LE-1, rule 16).
 * Measured 2026-10-16 (HEADED, RX-3): the "16:9" preset stored `height: 315px` and the export fell back to 315px when a
 * video had no height — drawn 1.19 wide-to-tall at 375 and 6.10 at 1920, against 1.78. A box that is a proportion of its
 * own width is the same shape on every screen.
 */
const YT = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
const style = (v: BoxNode): string => {
  const site = siteFromRoot({ id: "root", type: "container", direction: "column", children: [v] } as unknown as BoxNode);
  return renderSitePage(site, DEFAULT_THEME, site.homeId, { inlineShared: true }).match(/<a [^>]*data-eu-video="[^"]*"[^>]*style="([^"]*)"/)?.[1] ?? "";
};
const page = (v: BoxNode): string => {
  const site = siteFromRoot({ id: "root", type: "container", direction: "column", children: [v] } as unknown as BoxNode);
  return renderSitePage(site, DEFAULT_THEME, site.homeId, { inlineShared: true });
};

describe("RX3-9: a YouTube or Vimeo video costs nothing until the visitor asks for it (RULE AF)", () => {
  // Measured 2026-10-16 (RX-3): one YouTube embed took a page from 5.1 KB to 993.5 KB compressed — the player
  // loads on arrival whether or not anyone presses play. A link with the video's picture loads first; the player only
  // on a click, and without script the link still opens the video.
  it("publishes a link to the video, its picture lazy, and no player", () => {
    const html = page({ ...createElement("video"), src: YT });
    expect(html).not.toContain("<iframe");
    expect(html).toMatch(/<a href="https:\/\/www\.youtube\.com\/watch\?v=dQw4w9WgXcQ"[^>]*data-eu-video="https:\/\/www\.youtube\.com\/embed\/dQw4w9WgXcQ"[^>]*aria-label="Play the video"/);
    expect(html).toMatch(/<img src="https:\/\/i\.ytimg\.com\/vi\/dQw4w9WgXcQ\/hqdefault\.jpg"[^>]*loading="lazy"/);
    expect(html).toContain("window.__euVideo");
  });
  it("the script ships once however many videos the page holds, and not at all without one", () => {
    const two = { id: "root", type: "container", direction: "column", children: [{ ...createElement("video"), src: YT }, { ...createElement("video"), src: "https://vimeo.com/76979871" }] } as unknown as BoxNode;
    const site = siteFromRoot(two);
    const html = renderSitePage(site, DEFAULT_THEME, site.homeId, { inlineShared: true });
    // BDD1-30: counted as the script the product ships (videoScript()), so a reformat of its source cannot redden this
    expect(html.split(videoScript()).length - 1, "one copy of the video script for two videos").toBe(1);
    expect(page({ ...createElement("text") } as BoxNode)).not.toContain("__euVideo");
  });
});

describe("a video keeps its proportion on every screen", () => {
  it("a NEW video block takes the configured proportion and no height", () => {
    const s = style({ ...createElement("video"), src: YT });
    expect(s).toContain(`aspect-ratio:${LAYOUT.media.videoRatio}`);
    expect(s).not.toMatch(/(^|;)\s*height:/);
  });

  it("each proportion preset publishes its ratio — none stores a height", () => {
    for (const p of getPresets("video", DEFAULT_THEME).filter((x) => x.id !== "rounded")) {
      const s = style({ ...createElement("video"), height: "19.6875rem", src: YT, ...p.patch } as BoxNode);
      expect(s, p.label).toMatch(/aspect-ratio:\d+ \/ \d+/);
      expect(s, p.label).not.toMatch(/(^|;)\s*height:/);
    }
  });

  it("RX3-23: 16:9 after Portrait is full width again — a style undoes the other style's width", () => {
    const [wide, tall] = ["wide", "tall"].map((id) => getPresets("video", DEFAULT_THEME).find((p) => p.id === id)!.patch);
    const v = { ...createElement("video"), src: YT, ...tall, ...wide } as BoxNode;
    expect(v.width).toBe("100%");
  });

  it("RX3-24: the video's still carries its own size, so nothing waits on it to know its shape", () => {
    expect(page({ ...createElement("video"), src: YT })).toMatch(/<img src="https:\/\/i\.ytimg\.com[^>]*width="480" height="360"/);
  });

  it("a height the user typed is still honoured (pages already saved keep theirs)", () => {
    const s = style({ ...createElement("video"), src: YT, height: "20rem" });
    expect(s).toContain("height:20rem");
    expect(s).not.toContain("aspect-ratio");
  });
});
