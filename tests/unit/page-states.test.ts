import { describe, it, expect } from "vitest";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * LE-15, store once (the user, 2026-10-19): what every page DOES is recorded in the same pass as its layout, so no later
 * session researches hover, focus, opening, scroll, reduced motion, its elements or its flow again. The pure parts —
 * the style diff, the look-alike grouping and the configuration — are pinned here; the browser parts run in the pass.
 */
const require = createRequire(import.meta.url);
const { styleDiff, distinct, CENSUS, INIT, pickLink } = require("../../scripts/research/page-states.js") as {
  INIT: (cfg: { maxShaders: number; shaderMaxChars: number }) => void;
  pickLink: (links: { href: string; inNav: boolean }[], here: string, archived: Set<string>) => string | null;
  styleDiff: (a: Record<string, Record<string, string>>, b: Record<string, Record<string, string>>) => Record<string, Record<string, [string, string]>>;
  distinct: <T extends { sig: string }>(xs: T[], max: number) => (T & { alike: number })[];
  CENSUS: (attrs: string[]) => { tags: Record<string, number>; roles: Record<string, number>; attrs: Record<string, number> };
};
const config = require("../../config/research.json") as {
  states: { censusAttrs: string[]; maxTargets: number; hoverWaitMs: number; props: string[]; hoverKinds: Record<string, string>; clickKinds: string[]; scrollSteps: number };
};

describe("what every page does (LE-15)", () => {
  it("a hover's changes are listed property by property, and nothing that stayed the same", () => {
    const before = { self: { color: "red", transform: "none", opacity: "1" }, "child:0": { color: "blue" } };
    const after = { self: { color: "red", transform: "matrix(1.05, 0, 0, 1.05, 0, 0)", opacity: "0.8" }, "child:0": { color: "white" } };
    expect(styleDiff(before, after)).toEqual({ self: { transform: ["none", "matrix(1.05, 0, 0, 1.05, 0, 0)"], opacity: ["1", "0.8"] }, "child:0": { color: ["blue", "white"] } });
    expect(styleDiff(before, before)).toEqual({});
  });

  it("look-alikes are tried once, their count kept", () => {
    const cards = Array.from({ length: 20 }, (_, i) => ({ sig: "article.card", id: i }));
    const picked = distinct([...cards, { sig: "button.cta", id: 99 }], 8);
    expect(picked).toHaveLength(2);
    expect(picked[0]).toMatchObject({ sig: "article.card", alike: 20 });
    expect(distinct(Array.from({ length: 30 }, (_, i) => ({ sig: "s" + i })), 8)).toHaveLength(8);
  });

  it("every tag, role and key attribute is counted", () => {
    document.body.innerHTML = '<nav role="navigation"><a href="#" aria-current="page">a</a></nav><img loading="lazy" srcset="a 1x"><img>';
    const c = CENSUS(config.states.censusAttrs);
    expect(c.tags).toMatchObject({ nav: 1, a: 1, img: 2 });
    expect(c.roles).toMatchObject({ navigation: 1 });
    expect(c.attrs).toMatchObject({ loading: 1, srcset: 1, "aria-current": 1 });
  });

  it("the limits and the kinds tried are in the configuration", () => {
    const s = config.states;
    expect(s.maxTargets).toBeGreaterThan(0);
    expect(s.props).toEqual(expect.arrayContaining(["transform", "opacity", "color", "background-color", "box-shadow", "filter", "clip-path", "outline"]));
    for (const k of ["button", "card", "nav-link", "menu-button", "tab", "accordion", "slider-arrow"]) expect(s.hoverKinds[k], k).toBeTruthy();
    expect(s.clickKinds).toEqual(expect.arrayContaining(["menu-button", "tab", "accordion"]));
    for (const sel of Object.values(s.hoverKinds)) expect(() => document.querySelectorAll(sel)).not.toThrow();
  });

  it("an SVG's class is read from its attribute, in every research script (LE15-17)", () => {
    for (const f of ["page-states.js", "section-kinds.js", "extract.js", "cp-tag.js"]) {
      const src = readFileSync(resolve(__dirname, "../../scripts/research", f), "utf8").replace(/\r\n/g, "\n");
      expect(src.includes(".className"), f).toBe(false);
    }
    document.body.innerHTML = '<svg class="icon big"></svg>';
    expect(CENSUS([]).tags.svg).toBe(1);
  });

  it("canvas kinds, shader code and view transitions are caught as the page makes them", () => {
    type W = Window & { __educo: { ctx: { t: string }[]; shaders: string[]; vt: number }; WebGLRenderingContext: unknown };
    const w = window as unknown as W;
    class FakeGL { shaderSource(_s: unknown, _src: string) { return undefined; } }
    w.WebGLRenderingContext = FakeGL;
    HTMLCanvasElement.prototype.getContext = function () { return new FakeGL(); } as unknown as typeof HTMLCanvasElement.prototype.getContext;
    (document as unknown as { startViewTransition: (f: () => void) => void }).startViewTransition = (f) => f();
    INIT({ maxShaders: 2, shaderMaxChars: 10 });
    const gl = document.createElement("canvas").getContext("webgl") as unknown as FakeGL;
    gl.shaderSource(null, "void main(){gl_FragColor=vec4(1);}");
    gl.shaderSource(null, "b"); gl.shaderSource(null, "c");
    (document as unknown as { startViewTransition: (f: () => void) => void }).startViewTransition(() => undefined);
    expect(w.__educo.ctx.map((c) => c.t)).toEqual(["webgl"]);
    expect(w.__educo.shaders).toEqual(["void main(", "b"]);
    expect(w.__educo.vt).toBe(1);
  });

  it("the transition link is the site's own, to a page the archive holds, never the page shown", () => {
    const here = "https://s.com/";
    const archived = new Set(["https://s.com/about", "https://s.com/work"]);
    const links = [{ href: "https://s.com/", inNav: true }, { href: "https://x.com/a", inNav: true }, { href: "https://s.com/blog", inNav: true }, { href: "https://s.com/work", inNav: false }, { href: "https://s.com/about", inNav: true }];
    expect(pickLink(links, here, archived)).toBe("https://s.com/about");
    expect(pickLink(links.filter((l) => l.href !== "https://s.com/about"), here, archived)).toBe("https://s.com/work");
    expect(pickLink([{ href: "https://s.com/", inNav: true }], here, archived)).toBeNull();
  });

  it("an Awwwards recording is named by its item, the same every time", () => {
    const { clipFile } = require("../../scripts/research/aw-clips.js") as { clipFile: (item: string, video: string) => string };
    const a = clipFile("https://www.awwwards.com/inspiration/layout-switch-kin-2", "https://assets.awwwards.com/x/clip.mp4?v=1");
    expect(a).toBe("layout-switch-kin-2.mp4");
    expect(clipFile("https://www.awwwards.com/inspiration/layout-switch-kin-2", "https://a.com/v.webm")).toBe("layout-switch-kin-2.webm");
    expect(clipFile("https://www.awwwards.com/inspiration/x", "https://a.com/stream")).toBe("x.mp4");
  });

  it("a dead snapshot canvas is recorded live (LE15-21)", () => {
    const src = readFileSync(resolve(__dirname, "../../scripts/research/section-kinds.js"), "utf8").replace(/\r\n/g, "\n");
    expect(src).toContain("(st.canvas.canvases || []).some((c) => !c.t)");
    expect(src).toContain("!live && byUrl.has(norm(url.href))");
    // LE15-22: the LIVE fallbacks (LE15-7, LE15-14) must really load the live page, not the archive
    expect(src.split("live = true; try { await open(p, an.url);").length - 1).toBe(2);
  });
});
