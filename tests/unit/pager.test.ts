import { describe, it, expect } from "vitest";
import {
  isPager, pagerSlideId, pagerStripCss, pagerNavHTML, pagerScript, pagerWire,
  containerStyle, childStyle, createContainer, createElement,
} from "@/lib/box-model";
import { photoSlider, heroSection, rotatingHero, nodeForPhotos, PHOTO_SETUP, HERO_SCRIM, blockForKind } from "@/lib/box-presets";

/**
 * SHOW ONE AT A TIME — a mode on any container, not a component.
 *
 * Behaviours: tests/features/components/website/box-builder-columns.feature.
 */

const pager = (kids: number, extra: Record<string, unknown> = {}) => {
  const n = createContainer("column", { width: "100%", padding: 0, gap: 0, pager: true, ...extra });
  n.children = Array.from({ length: kids }, (_, i) => createContainer("column", { width: "100%", padding: 0, gap: 0, background: `#${i}${i}${i}` }));
  return n;
};

describe("the pager mode", () => {
  it("is off unless asked for, and only ever applies to a container", () => {
    expect(isPager(createContainer("column"))).toBe(false);
    expect(isPager(createElement("heading", { pager: true }))).toBe(false); // a heading has no pages
    expect(isPager(pager(2))).toBe(true);
  });

  it("makes every page fill the box, whatever is in it", () => {
    const css = pagerStripCss();
    expect(css.gridAutoColumns, "a page is a PAGE — as wide as the box, not as wide as its content").toBe("100%");
    expect(css.gridAutoFlow).toBe("column");
    expect(css.scrollSnapType).toBe("x mandatory");
    expect(css.overflowX).toBe("auto");
    expect(css.overflowY, "or a tall page turns the strip into a two-way scroller and the snap points fight").toBe("hidden");
  });

  it("beats the box's ordinary layout instead of fighting it", () => {
    // A grid that becomes a pager must stop being twelve columns, or the page columns and the track list
    // both try to place the same children.
    const grid = pager(3, { layout: "grid", columns: 12 });
    const css = containerStyle(grid);
    expect(css.gridTemplateColumns, "no twelve-column track list survives underneath").toBeUndefined();
    expect(css.position, "the box stays a box — the strip is an element inside it, so the nav can sit outside").toBe("relative");
  });

  it("gives a page snap alignment and no leftover grid placement", () => {
    const p = pager(2, { layout: "grid", columns: 12 });
    p.children![0].colSpan = 6; // left over from before the mode was switched on
    const css = childStyle(p.children![0], p);
    expect(css.scrollSnapAlign).toBe("start");
    expect(css.gridColumn, "an old span is IGNORED, not re-fitted — or the page keeps half its old shape").toBeUndefined();
    expect(css.minWidth, "so a wide page scrolls inside the strip instead of widening it").toBe(0);
  });
});

describe("the navigation", () => {
  it("is a set of real links to real pages", () => {
    const p = pager(3);
    const html = pagerNavHTML(p);
    for (const s of p.children!) expect(html, "every dot points at a page that exists").toContain(`href="#${pagerSlideId(s)}"`);
    expect(html).toContain("<nav");
    expect(html, "and is labelled, so it can be skipped").toContain("aria-label");
  });

  it("uses a bookmark the user set, so a link they made elsewhere keeps working", () => {
    const s = createContainer("column", { anchor: "open-day" });
    expect(pagerSlideId(s)).toBe("open-day");
  });

  it("offers nothing when there is nothing to move between", () => {
    expect(pagerNavHTML(pager(1)), "one page is not a pager; controls would be a lie").toBe("");
    expect(pagerNavHTML(pager(3, { pagerNav: "none" })), "and none means none").toBe("");
  });

  it("ships arrows HIDDEN, because a static href cannot mean 'one back from here'", () => {
    const html = pagerNavHTML(pager(3, { pagerNav: "both" }));
    expect(html).toMatch(/data-eu-pager-prev/);
    expect(html.match(/<a [^>]*data-eu-pager-prev/)?.[0], "hidden until the script can give them a meaning").toContain("hidden");
    // And no inline `display`, or it would beat the `hidden` attribute's rule and show anyway.
    const prev = html.slice(html.indexOf("data-eu-pager-prev"));
    expect(prev.slice(0, prev.indexOf(">")), "an inline display would defeat `hidden`").not.toMatch(/display\s*:/);
  });

  it("still gives dots when arrows are chosen, so something works with no script", () => {
    // Arrows cannot work without the script. An arrows-only nav therefore ALSO ships the dots, marked as
    // the fallback they are, and the script hides them the moment it can reveal the arrows.
    const html = pagerNavHTML(pager(3, { pagerNav: "arrows" }));
    expect(html, "arrows alone would leave a no-JS reader nothing").toContain("data-eu-pager-dot");
    expect(html, "…and they are marked, so the script knows to put them away").toContain("data-eu-pager-dots-fallback");
    expect(pagerNavHTML(pager(3, { pagerNav: "dots" })), "dots asked for outright are not a fallback").not.toContain("dots-fallback");
  });
});

describe("the script", () => {
  it("ships this file's own function, so the page runs what the builder ran", () => {
    // The masonry rule, applied again: one algorithm, never two that have to be kept in step.
    expect(pagerScript()).toContain(String(pagerWire).slice(0, 60));
  });
  it("is guarded, so ten pagers on a page still run one copy", () => {
    expect(pagerScript()).toContain("window.__euPager");
  });
});

describe("the tiles that use it", () => {
  it("a slider is a pager of ordinary boxes, each holding an ordinary image", () => {
    const s = photoSlider([{ src: "data:,a" }, { src: "data:,b" }]);
    expect(isPager(s)).toBe(true);
    expect(s.children).toHaveLength(2);
    expect(s.children![0].type, "a page is a container you can redesign, not a fixed item").toBe("container");
    expect(s.children![0].children![0].type).toBe("image");
  });

  it("a hero is one screen, with a scrim over the photograph", () => {
    const h = heroSection({ src: "data:,a" }, "Open day");
    expect(h.screenHeight).toBe("full");
    expect(h.bgImage).toBe("data:,a");
    expect(h.bgOverlay, "white words on an unknown photograph need one — this is not decoration").toBe(HERO_SCRIM);
    expect(h.children![0].text).toBe("Open day");
  });

  it("a hero with no photograph still has a readable background", () => {
    const h = heroSection(null, "Open day");
    expect(h.bgImage).toBeUndefined();
    expect(h.background, "or white text would sit on nothing").toBeTruthy();
  });

  it("a rotating hero is a pager whose every page is a whole hero", () => {
    const r = rotatingHero([{ src: "data:,a" }, { src: "data:,b" }], "Welcome");
    expect(isPager(r)).toBe(true);
    expect(r.children!.every((c) => c.screenHeight === "full" && !!c.bgOverlay)).toBe(true);
  });

  it("one list says which tiles ask for photographs, and one function says what each builds", () => {
    expect(Object.keys(PHOTO_SETUP).sort()).toEqual(["gallery", "hero", "rotatingHero", "slider"]);
    const photos = [{ src: "data:,a" }, { src: "data:,b" }];
    const o = { across: 3, stagger: false, gap: 0, nav: "dots" as const, auto: 0, headline: "Hi" };
    expect(isPager(nodeForPhotos("slider", photos, o))).toBe(true);
    expect(isPager(nodeForPhotos("rotatingHero", photos, o))).toBe(true);
    expect(nodeForPhotos("hero", photos, o).screenHeight, "a still hero has no pages").toBe("full");
    expect(isPager(nodeForPhotos("hero", photos, o))).toBe(false);
    expect(nodeForPhotos("gallery", photos, o).layout).toBe("grid");
  });

  it("every new tile builds something real even if the setup is skipped", () => {
    for (const kind of ["slider", "hero", "rotatingHero"]) {
      const n = blockForKind(kind);
      expect(n.type, `${kind} must still produce a block`).toBe("container");
    }
  });

  it("nothing carries spacing or rounding nobody asked for", () => {
    const s = photoSlider([{ src: "data:,a" }, { src: "data:,b" }]);
    expect(s.gap).toBe(0);
    expect(s.padding).toBe(0);
    expect(s.radius).toBeUndefined();
  });
});

describe("the controls read over any photograph", () => {
  // They sit ON the pages now, and a school chooses the photograph — so nothing the theme knows can
  // predict what is behind them. `currentColor` is actively wrong here: a dot is an `<a>`, so it takes
  // the LINK colour, which came out indigo on a dark navy hero.
  const nav3 = () => {
    const n = createContainer("column", { pager: true, pagerNav: "both" });
    n.children = [createContainer("column"), createContainer("column"), createContainer("column")];
    return pagerNavHTML(n);
  };

  it("never leans on currentColor, which on a link is the link colour", () => {
    expect(nav3()).not.toContain("currentColor");
  });

  it("pairs a light mark with a dark edge, so it survives a dark photo AND a pale one", () => {
    const html = nav3();
    expect(html, "white fill for a dark picture").toContain("background:#fff");
    expect(html, "and a dark ring for a pale one").toContain("rgba(0,0,0,.45)");
  });

  it("sits clear of the bottom edge, so a full-screen page does not hide it under the fold", () => {
    // Measured on a real published page: flush against the bottom, a 100svh page under a 57px site nav
    // put the only control 65px past the fold and entirely out of sight.
    expect(nav3()).toContain("bottom:clamp(1rem,9vh,5rem)");
  });

  it("lets clicks through everywhere except the controls themselves", () => {
    const html = nav3();
    expect(html, "the bar spans the whole box, so it must not eat clicks on the page under it").toContain("pointer-events:none");
    expect(html, "…while the controls still take them").toContain("pointer-events:auto");
  });
});
