import { describe, it, expect, beforeEach } from "vitest";
import { HOVER_EFFECTS, hoverCss, revealCss, REVEAL_DUR, scrollRevealNeeded, revealOnceScript } from "@/lib/interactions";
import { BASE_CSS } from "@/lib/educo-ui/base";
import { tokensFromTheme } from "@/lib/educo-ui/tokens";
import { createContainer, createElement, type BoxNode } from "@/lib/box-model";
import { siteFromRoot } from "@/lib/box-site";
import { renderSitePage } from "@/lib/box-export";
import { DEFAULT_THEME } from "@/lib/site-storage";

/**
 * BATCH RX-4 — the effects bugs measured HEADED on 2026-10-17 (docs/web-anatomy/effects-tiers/03-ours-measured.md).
 * Each guard was run RED against the code before its fix, then green, then mutation-proven.
 */
const page = (kids: BoxNode[]) => createContainer("column", { id: "page", children: kids } as Partial<BoxNode>);
const doc = (root: BoxNode) => { const site = siteFromRoot(root, "P"); return renderSitePage(site, DEFAULT_THEME, site.homeId, { inlineShared: true }); };

/** Every style rule of a stylesheet string, with the @media text it sits inside ("" at top level). */
function rules(css: string): { sel: string; media: string; decls: string }[] {
  const out: { sel: string; media: string; decls: string }[] = [];
  const re = /@media\s*([^{]+)\{((?:[^{}]*\{[^}]*\})*)\s*\}|([^{}@]+)\{([^}]*)\}/g;
  for (let m; (m = re.exec(css)); ) {
    if (m[1] !== undefined) for (const r of rules(m[2])) out.push({ ...r, media: m[1].trim() });
    else out.push({ sel: m[3].trim(), media: "", decls: m[4] });
  }
  return out;
}

describe("RX4-1 · a scroll entrance plays ONCE as the block enters (never scrubbed backwards)", () => {
  it("emits no scroll-driven timeline — that is what ran the entrance backwards on scrolling up", () => {
    const css = revealCss(".b", { revealEffect: "rise", revealScroll: true });
    expect(css).not.toContain("animation-timeline");
    expect(css).not.toContain("view()");
  });

  it("without script the block still arrives on load: the resting rule plays, only a script-set class pauses it", () => {
    const css = revealCss(".b", { revealEffect: "fade", revealScroll: true });
    expect(css).toContain(".b{animation:eu-reveal-fade");
    expect(css).toContain(".b.eu-wait{animation-play-state:paused}");
    expect(css).not.toMatch(/\.b\{[^}]*opacity:0/);
  });

  it("the stagger form gates each CHILD, so a row arrives one after another as it enters", () => {
    const css = revealCss(".b", { revealEffect: "rise", revealScroll: true, revealStagger: true });
    expect(css).toContain(".b > *.eu-wait{animation-play-state:paused}");
  });

  describe("the shared observer script", () => {
    type Entry = { target: Element; isIntersecting: boolean };
    let observers: { cb: (e: Entry[]) => void; watched: Set<Element> }[];
    beforeEach(() => {
      observers = [];
      document.head.innerHTML = ""; document.body.innerHTML = "";
      delete (window as unknown as Record<string, unknown>).__euReveal;
      (window as unknown as Record<string, unknown>).IntersectionObserver = class {
        watched = new Set<Element>();
        constructor(public cb: (e: Entry[]) => void) { observers.push(this); }
        observe(el: Element) { this.watched.add(el); }
        unobserve(el: Element) { this.watched.delete(el); }
        disconnect() { this.watched.clear(); }
      };
    });
    const run = () => {
      const src = revealOnceScript().replace(/^<script>/, "").replace(/<\/script>$/, "");
      new Function(src)();
    };

    it("waits for each block, releases it once as it enters, and never again when it leaves", () => {
      const css = revealCss(".a", { revealEffect: "rise", revealScroll: true })
        + revealCss(".row", { revealEffect: "fade", revealScroll: true, revealStagger: true })
        + revealCss(".onload", { revealEffect: "fade" });
      document.head.innerHTML = `<style>${css}</style>`;
      document.body.innerHTML = `<div class="a"></div><div class="row"><i></i><i></i></div><div class="onload"></div>`;
      run();
      const a = document.querySelector(".a")!; const kids = [...document.querySelectorAll(".row > i")];
      expect(a.classList.contains("eu-wait"), "a scroll block waits").toBe(true);
      for (const k of kids) expect(k.classList.contains("eu-wait"), "each staggered child waits").toBe(true);
      expect(document.querySelector(".onload")!.classList.contains("eu-wait"), "an on-load entrance is not held").toBe(false);
      const io = observers[0];
      io.cb([{ target: a, isIntersecting: true }]);
      expect(a.classList.contains("eu-wait"), "released as it enters").toBe(false);
      expect(io.watched.has(a), "and forgotten — it plays once").toBe(false);
      io.cb([{ target: a, isIntersecting: false }]);
      expect(a.classList.contains("eu-wait"), "scrolling away never re-arms it").toBe(false);
    });

    it("without IntersectionObserver nothing is held, so nothing is ever left hidden", () => {
      document.head.innerHTML = `<style>${revealCss(".a", { revealEffect: "rise", revealScroll: true })}</style>`;
      document.body.innerHTML = `<div class="a"></div>`;
      delete (window as unknown as Record<string, unknown>).IntersectionObserver;
      run();
      expect(document.querySelector(".a")!.classList.contains("eu-wait")).toBe(false);
    });
  });

  it("the export ships the script once, only on a page that uses a scroll entrance", () => {
    const withScroll = doc(page([
      createContainer("column", { id: "x", revealEffect: "rise", revealScroll: true } as Partial<BoxNode>),
      createContainer("column", { id: "y", revealEffect: "fade", revealScroll: true } as Partial<BoxNode>),
    ]));
    expect(withScroll.split("window.__euReveal)return").length - 1).toBe(1);
    expect(withScroll).not.toContain("animation-timeline:view()");
    expect(doc(page([createContainer("column", { id: "x", revealEffect: "rise" } as Partial<BoxNode>)]))).not.toContain("__euReveal");
    expect(scrollRevealNeeded({ children: [{ items: [{ revealEffect: "fade", revealScroll: true }] }] })).toBe(true);
    expect(scrollRevealNeeded({ children: [{ revealEffect: "fade" }] })).toBe(false);
  });
});

describe("RX4-2 · a hover look only where a pointer can hover — a tapped card does not stay lifted", () => {
  it("every :hover rule sits inside @media (hover:hover); focus twins stay ungated", () => {
    for (const fx of HOVER_EFFECTS.filter((f) => f.id)) {
      const rs = rules(hoverCss(".b", fx.id));
      const hov = rs.filter((r) => r.sel === ".b:hover" && r.media !== "(prefers-reduced-motion:reduce)"); // calming one is not a look
      for (const r of hov) expect(r.media, `${fx.label}: :hover must be gated`).toBe("(hover:hover)");
      if (fx.decls) {
        expect(hov.length, `${fx.label} has a hover look`).toBe(1);
        expect(rs.some((r) => r.sel === ".b:focus-visible" && r.media === ""), `${fx.label}: keyboard focus still shows`).toBe(true);
        expect(rs.some((r) => r.sel === ".b:has(:focus-visible)" && r.media === "")).toBe(true);
      }
    }
  });
});

describe("RX4-3 · every hover effect answers a PRESS, and Press is a press", () => {
  it("every effect has an :active state that dips, transform only", () => {
    for (const fx of HOVER_EFFECTS.filter((f) => f.id)) {
      const act = rules(hoverCss(".b", fx.id)).filter((r) => r.sel === ".b:active" && r.media === "");
      expect(act.length, `${fx.label} must answer a press`).toBe(1);
      const props = act[0].decls.split(";").filter(Boolean).map((d) => d.split(":")[0].trim());
      expect(props, `${fx.label}: a press moves by transform only`).toEqual(["transform"]);
    }
  });

  it("the press comes after the hover, so pressing a hovered block still dips", () => {
    const css = hoverCss(".b", "lift");
    expect(css.lastIndexOf(".b:active{")).toBeGreaterThan(css.indexOf(".b:hover{"));
  });

  it("'Press' is no longer a hover look — it moves only when pressed", () => {
    const rs = rules(hoverCss(".b", "press"));
    expect(rs.some((r) => r.sel === ".b:hover" && r.media !== "(prefers-reduced-motion:reduce)"), "Press has no hover look").toBe(false);
    expect(rs.some((r) => r.sel === ".b:active")).toBe(true);
  });

  it("reduced motion stops the dip for every effect (the non-moving part stays)", () => {
    for (const fx of HOVER_EFFECTS.filter((f) => f.id)) {
      const calm = rules(hoverCss(".b", fx.id)).filter((r) => r.media === "(prefers-reduced-motion:reduce)");
      expect(calm.some((r) => r.sel === ".b:active" && r.decls.includes("transform:none")), fx.label).toBe(true);
    }
    expect(hoverCss(".b", "glow")).toContain("box-shadow:0 0 0 0.25rem");
  });
});

describe("RX4-7 · a duration's fallback IS its token (one value — tokens are configuration)", () => {
  it("every var(--eu-dur-*, fallback) the effects emit falls back to the token's own value", () => {
    const dur = tokensFromTheme(DEFAULT_THEME).duration;
    const css = REVEAL_DUR + HOVER_EFFECTS.map((f) => hoverCss(".b", f.id)).join("") + revealCss(".b", { revealEffect: "fade" });
    const uses = [...css.matchAll(/var\(--eu-dur-([\w-]+),\s*([^)]+)\)/g)];
    expect(uses.length).toBeGreaterThan(0);
    for (const [, name, fallback] of uses) expect(fallback.trim(), `--eu-dur-${name}`).toBe(dur[name]);
  });
});

describe("RX4-14 · a Link's own hover changes something a person can see", () => {
  it("a hover rule reaches the published Link (not the Button) and changes its underline over its inline style", () => {
    const html = doc(page([
      createElement("link", { id: "l", text: "Term dates" } as Partial<BoxNode>),
      createElement("link", { id: "m", text: "About", underline: false } as Partial<BoxNode>),
      createElement("button", { id: "btn", text: "Apply" } as Partial<BoxNode>),
    ]));
    document.body.className = "eu-root"; // the exported <body class="eu-root">
    document.body.innerHTML = html.slice(html.indexOf(">", html.indexOf("<body")) + 1);
    const as = [...document.querySelectorAll("a[href]")];
    const link = as.find((a) => a.textContent === "Term dates")!;
    const plain = as.find((a) => a.textContent === "About")!;
    const btn = as.find((a) => a.textContent?.includes("Apply"))!;
    expect(link && plain && btn).toBeTruthy();
    const hov = rules(BASE_CSS.replace(/\/\*[\s\S]*?\*\//g, "")).filter((r) => r.sel.endsWith(":hover") && r.media === "(hover:hover)");
    const forLink = hov.filter((r) => link.matches(r.sel.replace(/:hover$/, "")));
    expect(forLink.length, "a gated hover rule matches the Link").toBeGreaterThan(0);
    const decls = forLink.map((r) => r.decls).join(";");
    expect(decls).toMatch(/text-decoration-line:\s*underline\s*!important/);
    expect(decls).toMatch(/text-decoration-thickness:[^;]*rem[^;]*!important/);
    expect(decls).not.toMatch(/#[0-9a-f]{3,8}\b/i);
    expect(forLink.every((r) => plain.matches(r.sel.replace(/:hover$/, ""))), "an un-underlined link gains one on hover").toBe(true);
    expect(hov.some((r) => btn.matches(r.sel.replace(/:hover$/, ""))), "a Button is not underlined on hover").toBe(false);
  });
});
