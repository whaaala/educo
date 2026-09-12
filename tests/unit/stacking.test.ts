import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import {
  PAGE_Z, CHROME_Z, PAGE_Z_CEILING, CHROME_Z_FLOOR, clampPageZ, laddersAreDisjoint,
} from "@/lib/educo-ui/stacking";
import { createContainer, createElement, makeRowBand, floatBox, bringToFront, sendToBack, alertToastCss } from "@/lib/box-model";
import type { BoxNode } from "@/lib/box-model";
import { renderSiteFiles } from "@/lib/box-export";
import { siteFromRoot } from "@/lib/box-site";
import { DEFAULT_THEME } from "@/lib/site-storage";

/**
 * PHASE 2 — the two stacking ladders.
 *
 * Behaviours live in tests/features/components/website/box-builder-stacking.feature. The bug these guards
 * exist for: the editor's furniture sat at z-20…z-50, the same numbers a page uses, and "Bring to front" was
 * `max + 1` with no ceiling — so a float raised enough times covered the handles that resize it and the
 * toolbar that deletes it, with no way back using the mouse.
 */

describe("the two ladders never meet", () => {
  it("every page tier sits below the ceiling and every chrome tier above the floor", () => {
    for (const [name, z] of Object.entries(PAGE_Z)) {
      expect(z, `page tier "${name}" must stay under the ceiling`).toBeLessThanOrEqual(PAGE_Z_CEILING);
    }
    for (const [name, z] of Object.entries(CHROME_Z)) {
      expect(z, `chrome tier "${name}" must stay above the floor`).toBeGreaterThanOrEqual(CHROME_Z_FLOOR);
    }
    expect(PAGE_Z_CEILING).toBeLessThan(CHROME_Z_FLOOR);
    expect(laddersAreDisjoint()).toBe(true);
  });

  it("leaves a gap wide enough that a hand-typed number cannot cross it", () => {
    // A near-miss ladder (page to 99, chrome from 100) fails the first time someone types 150.
    expect(CHROME_Z_FLOOR - PAGE_Z_CEILING).toBeGreaterThan(1000);
  });

  it("orders the chrome tiers the way the gestures need them", () => {
    // Not arbitrary: a drag ghost must clear the drop indicator it is aimed at, and the cursor veil must clear
    // everything or the pointer flickers back to default whenever it crosses a handle.
    expect(CHROME_Z.itemBox).toBeLessThan(CHROME_Z.itemBar);
    expect(CHROME_Z.handle).toBeLessThan(CHROME_Z.toolbar);
    expect(CHROME_Z.marquee).toBeLessThan(CHROME_Z.snapGuide);
    expect(CHROME_Z.snapGuide).toBeLessThan(CHROME_Z.dropZone);
    expect(CHROME_Z.dropZone).toBeLessThan(CHROME_Z.dragGhost);
    expect(CHROME_Z.dragGhost).toBeLessThan(CHROME_Z.veil);
    expect(Math.max(...Object.values(CHROME_Z))).toBe(CHROME_Z.veil);
  });

  it("orders the page tiers the way a reader needs them", () => {
    expect(PAGE_Z.base).toBeLessThan(PAGE_Z.raised);
    expect(PAGE_Z.raised).toBeLessThan(PAGE_Z.sticky);
    expect(PAGE_Z.sticky).toBeLessThan(PAGE_Z.overlay);
    expect(PAGE_Z.overlay).toBeLessThan(PAGE_Z.scrim);
    expect(PAGE_Z.scrim).toBeLessThan(PAGE_Z.toast);
  });
});

describe("clampPageZ", () => {
  it("keeps a sane number exactly as it is", () => {
    expect(clampPageZ(0)).toBe(0);
    expect(clampPageZ(7)).toBe(7);
    expect(clampPageZ(PAGE_Z_CEILING)).toBe(PAGE_Z_CEILING);
  });

  it("cannot return a value that reaches the chrome ladder", () => {
    for (const n of [999, 1000, 9000, 9999, 250_000, Number.MAX_SAFE_INTEGER]) {
      expect(clampPageZ(n), `${n} must be pulled back into the page ladder`).toBeLessThan(CHROME_Z_FLOOR);
      expect(clampPageZ(n)).toBe(PAGE_Z_CEILING);
    }
  });

  it("keeps a negative order — 'behind its siblings' is a real request — but bounds it too", () => {
    expect(clampPageZ(-3)).toBe(-3);
    expect(clampPageZ(-50_000)).toBe(-PAGE_Z_CEILING);
  });

  it("falls back rather than emitting a broken value", () => {
    expect(clampPageZ(undefined)).toBe(PAGE_Z.raised);
    expect(clampPageZ(Number.NaN)).toBe(PAGE_Z.raised);
    expect(clampPageZ(Number.POSITIVE_INFINITY)).toBe(PAGE_Z.raised);
    expect(clampPageZ(undefined, PAGE_Z.base)).toBe(PAGE_Z.base);
  });

  it("truncates a fraction, because a z-index is an integer", () => {
    expect(clampPageZ(4.9)).toBe(4);
    expect(Number.isInteger(clampPageZ(4.9))).toBe(true);
  });
});

/** A page root holding one floating block, which is the only way a user can set a stacking order. */
function pageWithFloat(): BoxNode {
  const root = createContainer("column", {
    id: "root", width: "100%",
    children: [makeRowBand([createElement("text", { id: "b1", text: "Hello" })])],
  } as Partial<BoxNode>);
  return floatBox(root, "b1", "root", 10, 10, "40%", 120);
}

/** The floating block, wherever `floatBox` re-parented it to. */
function floatZ(root: BoxNode): number {
  const find = (n: BoxNode): BoxNode | null =>
    n.id === "b1" ? n : (n.children ?? []).reduce<BoxNode | null>((hit, c) => hit ?? find(c), null);
  return find(root)?.zIndex ?? 0;
}

describe("a user cannot raise a block into the editor's range", () => {
  it("survives a hundred presses of Bring to front", () => {
    let root = pageWithFloat();
    for (let i = 0; i < 100; i++) root = bringToFront(root, "b1");
    expect(floatZ(root)).toBeLessThanOrEqual(PAGE_Z_CEILING);
    expect(floatZ(root)).toBeLessThan(CHROME_Z_FLOOR);
  });

  it("survives a hundred presses of Send to back", () => {
    let root = pageWithFloat();
    for (let i = 0; i < 100; i++) root = sendToBack(root, "b1");
    expect(floatZ(root)).toBeGreaterThanOrEqual(-PAGE_Z_CEILING);
  });

  it("clamps a value that arrived from outside the controls — a pasted or imported tree", () => {
    // Every path in has to land inside the ladder, not just the button, or a hand-edited store re-opens the bug.
    const root = createContainer("column", {
      id: "root", width: "100%",
      children: [makeRowBand([createElement("text", { id: "b1", text: "x", position: "absolute", zIndex: 500_000 } as Partial<BoxNode>)])],
    } as Partial<BoxNode>);
    expect(floatZ(bringToFront(root, "b1"))).toBeLessThanOrEqual(PAGE_Z_CEILING);
  });
});

describe("what a page emits stays on the page ladder", () => {
  it("a toast sits on the toast tier, not on a hand-picked number", () => {
    const toast = createElement("component", { id: "a", component: "alert", alertForm: "toast", alertToast: "top-right" } as Partial<BoxNode>);
    expect(alertToastCss(toast, ".x")).toContain(`z-index:${PAGE_Z.toast}`);
  });

  it("no rule in an exported site reaches the editor's range", () => {
    const root = createContainer("column", {
      id: "root", width: "100%",
      children: [makeRowBand([
        createElement("heading", { id: "h", text: "Welcome" }),
        createElement("text", { id: "t", text: "Body", position: "absolute", zIndex: 40_000 } as Partial<BoxNode>),
      ])],
    } as Partial<BoxNode>);
    const files = renderSiteFiles(siteFromRoot(root, "Home"), DEFAULT_THEME);

    const all = Object.values(files).join("\n");
    for (const m of all.matchAll(/z-index\s*:\s*(-?\d+)/g)) {
      const z = Number(m[1]);
      expect(z, `an exported rule used z-index:${z}, which is inside the editor's range`).toBeLessThan(CHROME_Z_FLOOR);
      expect(z).toBeLessThanOrEqual(PAGE_Z_CEILING);
    }
  });
});

/**
 * The regression guard with the longest reach: a bare number written anywhere in the builder is how the two
 * ladders interleaved in the first place, and a constant is only a convention until something enforces it.
 */
describe("no bare stacking number survives in the builder", () => {
  const ROOTS = ["components/website/box", "lib/educo-ui"];
  const FILES = ["lib/box-model.ts", "lib/box-export.ts", "components/website/sections/Menu.tsx", "components/website/sections/SiteRenderer.tsx"];

  function walk(dir: string): string[] {
    const abs = path.join(process.cwd(), dir);
    if (!fs.existsSync(abs)) return [];
    return fs.readdirSync(abs, { withFileTypes: true }).flatMap((e) => {
      const rel = path.join(dir, e.name);
      if (e.isDirectory()) return walk(rel);
      return /\.tsx?$/.test(e.name) ? [rel] : [];
    });
  }

  const sources = [...ROOTS.flatMap(walk), ...FILES]
    .filter((f) => !f.endsWith("stacking.ts"))            // the ladder itself is where the numbers live
    .filter((f) => !f.includes(".generated."));            // machine-written icon maps

  it("scans a real set of files, so a passing result means something", () => {
    expect(sources.length).toBeGreaterThan(10);
  });

  for (const file of sources) {
    it(`${file} takes its stacking order from the ladder`, () => {
      const src = fs.readFileSync(path.join(process.cwd(), file), "utf8");
      const offenders = [
        ...src.matchAll(/zIndex\s*:\s*(-?\d+)/g),
        ...src.matchAll(/z-index\s*:\s*(-?\d+)/g),
        ...src.matchAll(/(?:^|[^\w-])z-\[(-?\d+)\]/g),
        ...src.matchAll(/(?:className|class)="[^"]*?(?:^|\s)z-(\d+)(?:\s|")/g),
      ].map((m) => m[1]);
      expect(offenders, `${file} writes a stacking number directly — import PAGE_Z or CHROME_Z instead`).toEqual([]);
    });
  }
});
