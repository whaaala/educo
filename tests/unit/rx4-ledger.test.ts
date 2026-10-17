import { describe, it, expect, vi, afterEach } from "vitest";
import {
  createContainer, createElement, pagerNavHTML, pagerWire, pinArrivalCss, pinArrivalKeyframes, pinArrivalHasEffect,
  floatHoldCSS, floatStacksOnMobile, pinArrivalPass, bandEdgeCSS, paintLayerCss, sanitizeCssDeclarations, refusedMotion,
  capturesFixed, fixedBlockedBy, bandScheme, pagerStripCss, type BoxNode,
} from "@/lib/box-model";
import { photoSlider, rotatingHero } from "@/lib/box-presets";
import { renderPageHTML } from "@/lib/box-export";
import { DEFAULT_THEME } from "@/lib/site-storage";
import { treeHoverCss } from "@/lib/interactions";
import { hexToRgb, contrastRatio } from "@/lib/educo-ui/color";
import { isLightColor } from "@/components/shared/ColorPalettePicker";

/**
 * LEDGER RX-4 — the bugs measured HEADED on 2026-10-17 (docs/web-anatomy/effects-tiers/03-ours-measured.md,
 * "Other bugs" and the defect verdicts). Each guard here was run RED on the code before its fix.
 */

const box = (extras: Partial<BoxNode>) => createContainer("column", extras as Partial<BoxNode>);
const textPager = (extra: Partial<BoxNode> = {}) => box({
  id: "p", pager: true, pagerNav: "both",
  children: [1, 2, 3].map((i) => createElement("text", { id: `t${i}`, text: `Slide ${i}` } as Partial<BoxNode>)),
  ...extra,
});
const photos = [1, 2, 3].map((i) => ({ src: `/p${i}.jpg`, imgW: 1600, imgH: 900, alt: `Photo ${i}` }));

/** The nav element's own inline style, out of the markup both renderers share. */
const navStyle = (html: string) => /<nav data-eu-pager-nav[^>]*style="([^"]*)"/.exec(html)?.[1] ?? "";

describe("RX4-9 — the pager's arrows and dots sit where a visitor can reach them", () => {
  it("a content-sized pager (three Texts) draws its controls BELOW the strip, in the flow — never lifted above it", () => {
    // Measured: absolutely placed 72px up from the bottom of a 39px strip, the nav sat at top −69px — above the page.
    const style = navStyle(pagerNavHTML(textPager()));
    expect(style, "the nav exists").not.toBe("");
    expect(style).not.toContain("position:absolute");
  });

  it("a tall pager (a photo Slider, a Rotating hero) overlays them — and the inset can never lift them out of the box", () => {
    for (const tall of [photoSlider(photos), rotatingHero(photos, "Welcome")]) {
      const style = navStyle(pagerNavHTML({ ...tall, pagerNav: "both" }));
      expect(style).toContain("position:absolute");
      // `bottom` is bounded by the box's own height (a `bottom` % is of the containing block's height), so the nav's
      // top edge is never above the box's top edge, however short the box comes out.
      expect(style).toMatch(/bottom:max\(0rem,\s*min\(clamp\(1rem,9vh,5rem\),\s*calc\(100% - 2\.25rem\)\)\)/);
    }
  });

  it("the export writes the very markup the canvas does — one emitter (canvas == export)", () => {
    const html = renderPageHTML(box({ id: "root", children: [textPager()] }), DEFAULT_THEME);
    expect(html).toContain(pagerNavHTML(textPager()));
  });
});

describe("RX4-5 — an auto-advancing pager has a visible, labelled Pause (WCAG 2.2.2)", () => {
  it("ships a real button when it moves on its own, and none when it does not", () => {
    const html = pagerNavHTML(textPager({ pagerAuto: 3 }));
    expect(html).toMatch(/<button type="button" hidden data-eu-pager-pause aria-label="Pause"/);
    expect(pagerNavHTML(textPager())).not.toContain("data-eu-pager-pause");
  });

  it("…even when no navigation was chosen — the Pause is not navigation, it is the right to make it stop", () => {
    expect(pagerNavHTML(textPager({ pagerNav: "none", pagerAuto: 3 }))).toContain("data-eu-pager-pause");
    expect(pagerNavHTML(textPager({ pagerNav: "none" }))).toBe("");
  });

  describe("the script", () => {
    afterEach(() => { vi.useRealTimers(); document.body.innerHTML = ""; });
    const mount = (reduced: boolean) => {
      vi.useFakeTimers();
      window.matchMedia = ((q: string) => ({ matches: reduced && q.includes("reduce"), media: q, addEventListener() {}, removeEventListener() {} })) as unknown as typeof window.matchMedia;
      const node = textPager({ pagerAuto: 3 });
      const host = document.createElement("div");
      host.innerHTML = `<div data-eu-pager data-eu-pager-auto="3">${(node.children ?? []).map((c) => `<section data-eu-slide id="slide-${c.id}"></section>`).join("")}</div>${pagerNavHTML(node)}`;
      document.body.appendChild(host);
      const strip = host.querySelector<HTMLElement>("[data-eu-pager]")!;
      const scrolls: number[] = [];
      strip.scrollTo = ((o: ScrollToOptions) => { scrolls.push(o.left ?? 0); }) as typeof strip.scrollTo;
      pagerWire(strip);
      return { strip, scrolls, pause: host.querySelector<HTMLButtonElement>("[data-eu-pager-pause]")! };
    };

    it("reveals the Pause, which stops the moving and turns into Play — and Play starts it again", () => {
      const { scrolls, pause } = mount(false);
      expect(pause.hidden, "visible once the script runs").toBe(false);
      vi.advanceTimersByTime(3100);
      expect(scrolls.length, "it moves on its own").toBe(1);
      pause.click();
      expect(pause.getAttribute("aria-label")).toBe("Play");
      vi.advanceTimersByTime(9000);
      expect(scrolls.length, "paused: nothing moves").toBe(1);
      // A mouse leaving the strip must not undo a Pause the reader chose.
      pause.closest("nav")!.dispatchEvent(Object.assign(new Event("pointerleave"), { pointerType: "mouse" }));
      vi.advanceTimersByTime(9000);
      expect(scrolls.length, "a mouse leaving does not overrule the Pause").toBe(1);
      pause.click();
      expect(pause.getAttribute("aria-label")).toBe("Pause");
      vi.advanceTimersByTime(3100);
      expect(scrolls.length, "Play starts it again").toBe(2);
    });

    it("under reduced motion nothing moves and no Pause is offered for a stillness that is already there", () => {
      const { scrolls, pause } = mount(true);
      vi.advanceTimersByTime(9000);
      expect(scrolls.length).toBe(0);
      expect(pause.hidden).toBe(true);
    });
  });
});

describe("RX4-4 — Condense animates nothing that moves the page below", () => {
  it("its keyframes touch no layout property — only clip-path / translate (compositor or paint)", () => {
    const kf = pinArrivalKeyframes(new Set(["condense"]));
    expect(kf).toContain("@keyframes eu-arrive-condense");
    expect(kf).not.toMatch(/padding|min-height|(^|[{;])height|margin|top:|bottom:/);
    expect(kf).toMatch(/clip-path/);
  });

  it("the block keeps its layout box: the arrival writes only how much is cut and where the bar moves", () => {
    const css = pinArrivalCss(".bx-a", box({ pin: "top", pinArrival: "condense", padding: 20 }));
    expect(css).toContain("--eu-arrive-cut-t:");
    expect(css).not.toMatch(/--eu-arrive-(pad|h)-/);
  });
});

describe("RX4-11 — a Height set under Size is something Condense can condense", () => {
  it("Size → Height counts, so the Inspector does not say there is nothing to condense", () => {
    expect(pinArrivalHasEffect(box({ pin: "top", pinArrival: "condense", height: "128px" }))).toBe(true);
    expect(pinArrivalHasEffect(box({ pin: "top", pinArrival: "condense", height: "8rem" }))).toBe(true);
    const css = pinArrivalCss(".bx-a", box({ pin: "top", pinArrival: "condense", height: "8rem" }));
    expect(css, "the arrival is emitted").toContain("eu-arrive-condense");
    expect(css).toContain("8rem");
  });

  it("a height that is not a length (auto, fill, a %) still has nothing definite to condense", () => {
    for (const height of ["auto", "fill", "50%"]) expect(pinArrivalHasEffect(box({ pin: "top", pinArrival: "condense", height }))).toBe(false);
  });
});

describe("RX4-12 — a Floating block set to “Floats on screen”", () => {
  const floated = (extra: Partial<BoxNode> = {}) => box({ position: "absolute", left: 20, top: 30, height: "60px", width: "200px", ...extra });

  it("is kept INSIDE the window where it was placed — 873px down an 800px window is clamped back on screen", () => {
    const css = floatHoldCSS(floated({ pin: "top", hold: "fixed", pinX: 256, pinY: 873 }));
    expect(css.position).toBe("fixed");
    expect(String(css.top)).toBe("max(0rem, min(54.563rem, calc(var(--canvas-h, 100dvh) - 3.75rem)))");
    expect(String(css.left)).toBe("max(0rem, min(16rem, calc(100% - 12.5rem)))");
  });

  it("is held on a PHONE too — it does not drop back into the flow and scroll away", () => {
    expect(floatStacksOnMobile(floated({ pin: "top", hold: "fixed" }))).toBe(false);
    expect(floatStacksOnMobile(floated()), "an ordinary float still stacks on a phone").toBe(true);
  });

  it("can be held in a CORNER or against an edge of the window, at the distance chosen", () => {
    const br = floatHoldCSS(floated({ pin: "bottom-right", hold: "fixed", pinOffset: 16 }));
    expect(br.position).toBe("fixed");
    expect(br.bottom).toBeDefined();
    expect(br.right).toBeDefined();
    expect("top" in br && br.top === undefined, "the float's own top% is cleared, or it would fight the bottom inset").toBe(true);
    expect("left" in br && br.left === undefined).toBe(true);
    const bottom = floatHoldCSS(floated({ pin: "bottom", hold: "fixed" }));
    expect(bottom.bottom).toBeDefined();
    expect(bottom.left, "an edge keeps the float's own place along it").toBeUndefined();
    expect("left" in bottom).toBe(false);
  });
});

describe("RX4-13 — a lower bar's arrival starts when the bar takes hold, not at the top of the page", () => {
  it("the range starts at the measured hold point, falling back to the top of the page", () => {
    const css = pinArrivalCss(".bx-a", box({ pin: "top", pinArrival: "shadow" }));
    expect(css).toContain("animation-range:var(--eu-hold-at,0%) calc(var(--eu-hold-at,0%) + 7.5rem)");
  });

  it("the export marks the block and ships the measuring pass only when there is an arrival", () => {
    const withIt = renderPageHTML(box({ id: "root", children: [box({ id: "bar", pin: "top", pinArrival: "shadow" })] }), DEFAULT_THEME);
    expect(withIt, "the BLOCK carries the marker, not only the script's selector").toMatch(/<(?!script)[a-z]+[^>]* data-eu-arrive[\s>]/);
    expect(withIt).toContain("__euArrive");
    const without = renderPageHTML(box({ id: "root", children: [box({ id: "bar", pin: "top" })] }), DEFAULT_THEME);
    expect(without).not.toContain("__euArrive");
  });

  it("the pass writes where the bar's holder sticks: its place in the page less its top inset", () => {
    document.body.innerHTML = `<div id="band" style="position:sticky;top:10px"><div id="bar" data-eu-arrive></div></div>`;
    const band = document.getElementById("band")!, bar = document.getElementById("bar")!;
    const seen: string[] = [];
    // jsdom has no layout: the band sits 920px down the page, and the pass must measure it UNSTUCK (position static).
    band.getBoundingClientRect = () => { seen.push(band.style.position); return { top: 920, left: 0, width: 100, height: 40, bottom: 960, right: 100, x: 0, y: 920, toJSON() {} } as DOMRect; };
    pinArrivalPass(document);
    expect(seen).toContain("static");
    expect(band.style.position, "put back as it was").toBe("sticky");
    expect(bar.style.getPropertyValue("--eu-hold-at")).toBe("910px");
  });

  it("a bar held at the bottom, or by nothing at this width, arrives from the first pixel (no hold point)", () => {
    document.body.innerHTML = `<div id="band" style="position:sticky;bottom:0"><div id="bar" data-eu-arrive></div></div><div id="b2" data-eu-arrive></div>`;
    pinArrivalPass(document);
    expect(document.getElementById("bar")!.style.getPropertyValue("--eu-hold-at")).toBe("");
    expect(document.getElementById("b2")!.style.getPropertyValue("--eu-hold-at")).toBe("");
  });
});

// ══ RX4-6 … RX4-19, the last nine (2026-10-17) — each guard run RED on the code before its fix ══

describe("RX4-19 — an entrance on a PINNED block plays once, like every other entrance", () => {
  const pinnedReveal = () => box({ pin: "top", pinArrival: "shadow", revealEffect: "rise", revealScroll: true });

  it("no view() timeline is left: the entrance runs on the document timeline, the arrival on the scroll", () => {
    const css = pinArrivalCss(".bx-a", pinnedReveal());
    expect(css).not.toContain("view()");
    expect(css).toContain("animation-timeline:auto,scroll()");
    expect(css).toContain("animation-range:normal,");
  });

  it("while it waits only the ENTRANCE is held — the arrival keeps following the scroll", () => {
    const css = pinArrivalCss(".bx-a", pinnedReveal());
    expect(css).toContain(".bx-a.eu-wait{animation-play-state:paused,running}");
    // an entrance that plays on load is never held, so it needs no such rule
    expect(pinArrivalCss(".bx-a", box({ pin: "top", pinArrival: "shadow", revealEffect: "rise" }))).not.toContain("eu-wait");
  });
});

describe("RX4-10 — “Curve out” draws a curve: the shape stays inside the band", () => {
  const pts = (css: string) => [...css.matchAll(/(-?[\d.]+)% (-?[\d.]+)%/g)].map((m) => [Number(m[1]), Number(m[2])]);

  it("every point of a curve-out edge is inside the box — nothing is promised outside it, where nothing paints", () => {
    for (const edge of [{ edgeBottom: "curve-out" }, { edgeTop: "curve-out" }] as Partial<BoxNode>[]) {
      const p = pts(String(bandEdgeCSS(box({ ...edge, edgeDepth: 30 })).clipPath));
      expect(p.length).toBeGreaterThan(4);
      for (const [x, y] of p) { expect(x).toBeGreaterThanOrEqual(0); expect(y).toBeGreaterThanOrEqual(0); expect(y).toBeLessThanOrEqual(100); }
    }
  });

  it("it bulges: the ends are cut in by the depth and the middle reaches the edge — the mirror of Curve in", () => {
    const out = pts(String(bandEdgeCSS(box({ edgeBottom: "curve-out", edgeDepth: 20 })).clipPath)).filter(([, y]) => y > 50);
    const inn = pts(String(bandEdgeCSS(box({ edgeBottom: "curve-in", edgeDepth: 20 })).clipPath)).filter(([, y]) => y > 50);
    const at = (p: number[][], x: number) => p.find(([px]) => px === x)![1];
    expect(at(out, 0)).toBe(80); expect(at(out, 50)).toBe(100); expect(at(out, 100)).toBe(80);
    expect(at(inn, 0)).toBe(100); expect(at(inn, 50)).toBe(80);
  });
});

describe("RX4-8 — a shaped edge keeps its band's own shadow", () => {
  const shaped = () => box({ id: "b", background: "#111827", shadow: "lg", edgeBottom: "curve-out", edgeDepth: 10 });

  it("the band itself is not clipped (a clip cuts its shadow): the SHAPE moves to its paint layer", () => {
    const own = bandEdgeCSS(shaped());
    expect(own.clipPath, "a clip-path on the band cuts every shadow it casts").toBeUndefined();
    const layer = paintLayerCss(".b", shaped());
    expect(layer).toMatch(/\.b::before\{[^}]*clip-path:polygon\(/);
    expect(layer).toMatch(/\.b::before\{[^}]*background-color:#111827/);
  });

  it("the shadow follows the shape — a drop-shadow per box-shadow layer, the box-shadow itself off", () => {
    const own = bandEdgeCSS(shaped());
    expect(String(own.filter)).toMatch(/^drop-shadow\(0 0\.75rem 1\.5rem rgba\(0,0,0,0\.12\)\) drop-shadow\(0 0\.25rem 0\.5rem rgba\(0,0,0,0\.08\)\)$/);
    expect(own.boxShadow).toBe("none");
  });

  it("canvas == export: the published page carries the same layer and the same filter", () => {
    const html = renderPageHTML(box({ id: "root", children: [shaped()] }), DEFAULT_THEME);
    expect(html).toMatch(/::before\{[^}]*clip-path:polygon\(/);
    expect(html).toContain("drop-shadow(0 0.75rem 1.5rem rgba(0,0,0,0.12))");
  });

  it("a shaped band with NO shadow keeps the plain clip (nothing to keep, nothing changes)", () => {
    const plain = box({ background: "#111827", edgeBottom: "slope-left" });
    expect(String(bandEdgeCSS(plain).clipPath)).toMatch(/^polygon\(/);
    expect(paintLayerCss(".b", plain)).toBe("");
  });
});

describe("RX4-15 — Advanced CSS refuses motion that hurts, and SAYS so", () => {
  it("refuses a layout transition and an animation that never stops (WCAG 2.2.2), keeps the rest", () => {
    const raw = "backdrop-filter: blur(4px); transition: height 1s, width 1s; animation: spin 1s infinite; animation-iteration-count: infinite; transition: opacity .2s";
    const kept = sanitizeCssDeclarations(raw);
    expect(kept).toContain("backdrop-filter: blur(4px);");
    expect(kept).toContain("transition: opacity .2s;");
    expect(kept).not.toMatch(/height 1s|infinite/);
  });

  it("names every refused declaration, so the Inspector can tell the person what was left out", () => {
    expect(refusedMotion("color: red; transition: height 1s; animation: spin 1s infinite")).toEqual(["transition: height 1s", "animation: spin 1s infinite"]);
    expect(refusedMotion("transition: transform .3s; animation: fade 1s 2")).toEqual([]);
    expect(refusedMotion(undefined)).toEqual([]);
  });
});

// ══ RX4-21 … RX4-24 (found fixing RX4-6 … RX4-16, 2026-10-17) ══

describe("RX4-22 — a hover effect on a shaped band with a shadow composes with the shape's drop-shadow", () => {
  const band = (hoverEffect: string) => box({ id: "b", background: "#111827", shadow: "lg", edgeBottom: "curve-out", hoverEffect });
  const rest = () => String(bandEdgeCSS(band("lift")).filter);
  const hoverRule = (css: string) => /@media \(hover:hover\)\{[^{]*:hover\{([^}]*)\}\}/.exec(css)?.[1] ?? "";

  it("Lift / Glow add a drop-shadow to the shape's own filter — never a rectangular box-shadow", () => {
    const lift = hoverRule(treeHoverCss(band("lift"), (id) => `.${id}`));
    expect(lift).not.toContain("box-shadow");
    expect(lift).toContain(`filter:${rest()} drop-shadow(0 0.75rem 1.5rem rgba(0,0,0,.32)) !important`);
    const glow = hoverRule(treeHoverCss(band("glow"), (id) => `.${id}`));
    expect(glow).not.toContain("box-shadow");
    expect(glow).toContain(`filter:${rest()} drop-shadow(0 0 0.25rem color-mix(in oklab, var(--eu-color-brand) 32%, transparent)) !important`);
  });

  it("Brighten adds its brightness AFTER the shape's drop-shadow instead of replacing it", () => {
    expect(hoverRule(treeHoverCss(band("brighten"), (id) => `.${id}`))).toContain(`filter:${rest()} brightness(1.06) saturate(1.05) !important`);
  });

  it("the same rules reach the published page (one emitter), and a plain band keeps its box-shadow hover", () => {
    const html = renderPageHTML(box({ id: "root", children: [band("lift")] }), DEFAULT_THEME);
    expect(html).toContain(`${rest()} drop-shadow(0 0.75rem 1.5rem rgba(0,0,0,.32)) !important`);
    expect(hoverRule(treeHoverCss(box({ id: "p", shadow: "lg", hoverEffect: "lift" }), (id) => `.${id}`))).toContain("box-shadow:");
  });
});

describe("RX4-23 — a shaped band captures a block held on screen inside it, and the engine says so", () => {
  // CSS: a non-none `filter` makes an element the containing block of its FIXED descendants (Filter Effects §5), and a
  // `clip-path` clips every descendant, fixed ones included — either way a "Floats on screen" block inside a shaped band
  // is held to the band, not the window. capturesFixed() is the engine's one answer to that question (it already counts a
  // tilt and Glass), and it is what the Inspector's "will not stay on screen" warning and the canvas both read.
  it("a shaped band — with or without a shadow — captures a fixed child", () => {
    expect(capturesFixed(box({ edgeBottom: "curve-out", shadow: "lg" }))).toBe(true);
    expect(capturesFixed(box({ edgeTop: "slope-left" }))).toBe(true);
    expect(capturesFixed(box({ shadow: "lg" })), "a straight band does not").toBe(false);
  });

  it("fixedBlockedBy names the shaped band above a block that floats on screen", () => {
    const float = box({ id: "f", position: "absolute", pin: "top", hold: "fixed", left: 10, top: 10 });
    const root = box({ id: "root", children: [box({ id: "band", edgeBottom: "curve-out", shadow: "lg", children: [float] })] });
    expect(fixedBlockedBy(root, "f")?.id).toBe("band");
  });
});

describe("RX4-24 — every colour reader takes a colour that carries transparency", () => {
  it("hexToRgb reads #rgba as its colour (it read the four digits as one number)", () => {
    expect(hexToRgb("#f008")).toEqual({ r: 255, g: 0, b: 0 });
    expect(hexToRgb("#ff000080")).toEqual({ r: 255, g: 0, b: 0 });
    expect(contrastRatio("#000f", "#ffffff")).toBe(21);
  });

  it("isLightColor reads every hex form", () => {
    for (const c of ["#fff", "#ffff", "#ffffff", "#ffffff80"]) expect(isLightColor(c), c).toBe(true);
    for (const c of ["#000", "#0008", "#000000", "#00000080"]) expect(isLightColor(c), c).toBe(false);
  });

  it("a band painted with an opaque #rgba gets its reading scheme, like its #rrggbbaa twin", () => {
    expect(bandScheme("#111f")).toEqual(bandScheme("#111111ff"));
    expect(bandScheme("#111f")).not.toBeNull();
    expect(bandScheme("#1118"), "see-through imposes nothing").toBeNull();
  });
});

describe("RX4-25 — a pager with its own arrows or dots draws no scrollbar under its pages", () => {
  it("hides the native scrollbar when it has controls, in the canvas and the export alike", () => {
    expect(pagerStripCss(textPager()).scrollbarWidth).toBe("none");
    expect(pagerStripCss(textPager({ pagerNav: "dots" })).scrollbarWidth).toBe("none");
    const page = box({ id: "root", children: [textPager()] });
    expect(renderPageHTML(page, DEFAULT_THEME)).toMatch(/data-eu-pager[^>]*style="[^"]*scrollbar-width:none/);
  });
  it("keeps it when the pager has no way between pages — then it is a mouse's only way to move it", () => {
    expect(pagerStripCss(textPager({ pagerNav: "none" })).scrollbarWidth).toBeUndefined();
    expect(pagerStripCss(textPager({ pagerNav: "none", pagerAuto: 3 })).scrollbarWidth).toBeUndefined();
  });
});

describe("RX4-26 — Condense keeps the bar's content: it cuts where the empty space is", () => {
  const vars = (extra: Partial<BoxNode>) => {
    const css = pinArrivalCss(".bx-a", box({ pin: "top", pinArrival: "condense", height: "8rem", ...extra }));
    const get = (k: string) => new RegExp(`--eu-arrive-${k}:([^;}]+)`).exec(css)?.[1] ?? "";
    return { t: get("cut-t"), b: get("cut-b"), shift: get("shift") };
  };
  it("blocks at the top (the default): nothing comes off the top, the empty space below is what goes", () => {
    const v = vars({});
    expect(v.t).toBe("0rem");
    expect(v.b).toContain("8rem");
    expect(v.shift, "a top bar slides up only by what came off its top").toBe("calc(-1 * 0rem)");
  });
  it("blocks centred: an equal slice off each end", () => {
    const v = vars({ justify: "center" });
    expect(v.t).toContain("8rem");
    expect(v.t).toBe(v.b);
  });
  it("blocks at the bottom: nothing comes off the bottom", () => {
    const v = vars({ justify: "end" });
    expect(v.b).toBe("0rem");
    expect(v.t).toContain("8rem");
  });
  it("in a row the vertical is align, not justify", () => {
    expect(vars({ direction: "row", justify: "end" }).b).toContain("8rem");
    expect(vars({ direction: "row", align: "end" }).b).toBe("0rem");
  });
  it("inner spacing is cut from both ends, whatever the alignment", () => {
    const v = pinArrivalCss(".bx-a", box({ pin: "top", pinArrival: "condense", padding: 20 }));
    expect(v).not.toContain("--eu-arrive-cut-t:0rem");
    expect(v).not.toContain("--eu-arrive-cut-b:0rem");
  });
  it("the keyframes clip each end by its own amount", () => {
    expect(pinArrivalKeyframes(new Set(["condense"]))).toContain("inset(var(--eu-arrive-cut-t,0) 0 var(--eu-arrive-cut-b,0) 0)");
  });
});

describe("RX4-27 — a full-screen slide inside the builder's plain wrapper still makes the pager tall", () => {
  it("the nav is laid over the hero, not dropped under it, when each slide sits in a bare row (as every slide added through the UI does)", () => {
    const hero = (i: number) => box({ id: `h${i}`, screenHeight: "full", children: [createElement("heading", { id: `t${i}`, text: `Hero ${i}` } as Partial<BoxNode>)] });
    const wrapped = (i: number) => createContainer("row", { id: `w${i}`, bare: true, spaced: true, width: "fill", children: [hero(i)] } as Partial<BoxNode>);
    expect(navStyle(pagerNavHTML(box({ id: "rh", pager: true, children: [wrapped(0), wrapped(1), wrapped(2)] })))).toContain("position:absolute");
    // and a wrapper around words alone is still content-sized
    const words = (i: number) => createContainer("row", { id: `v${i}`, bare: true, children: [createElement("text", { id: `x${i}`, text: "Slide" } as Partial<BoxNode>)] } as Partial<BoxNode>);
    expect(navStyle(pagerNavHTML(box({ id: "rp", pager: true, children: [words(0), words(1)] })))).not.toContain("position:absolute");
  });
});
