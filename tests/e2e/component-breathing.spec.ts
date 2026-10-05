import { test, expect } from "@playwright/test";
import { type BoxNode, u } from "@/lib/box-model";
import { COMPONENT_CATALOGUE, addChoices } from "@/lib/component-catalogue";
import { blockForKind } from "@/lib/box-presets";
import { siteFromRoot } from "@/lib/box-site";
import { renderSitePage } from "@/lib/box-export";
import { DEFAULT_THEME } from "@/lib/site-storage";

/**
 * COMPONENTS BREATHE — S-2 (1), CLAUDE.md rule 3 (tests/features/components/website/box-builder-spacing.feature).
 *
 * Every component in the catalogue, in EVERY design it offers — enumerated from the catalogue, so a component or a
 * design added later is covered the day it appears — rendered through the shipping export and measured:
 *   • words are never closer than FLOOR to the visible edge of the box they sit in (a background or a border);
 *   • two parts laid out one after another are never closer than FLOOR.
 * The floor is "never touch", not the page's own defaults: each design keeps the spacing it was drawn with (the
 * user, 2026-09-30).
 */
const FLOOR = 4; // 0.25rem, stored px — measured in the fluid unit the designs use (see `floor` below); a Rating's 4px gap sits on it

const CASES = COMPONENT_CATALOGUE.flatMap((c) =>
  [{ id: "default", label: "Default", patch: {} as Partial<BoxNode> }, ...addChoices(c.name)].map((d) => ({ name: c.name, design: d.label, patch: d.patch as Partial<BoxNode> })));

const pageFor = (node: BoxNode) => {
  const root = { id: "root", type: "container", direction: "column", children: [node] } as BoxNode;
  const site = siteFromRoot(root);
  return renderSitePage(site, DEFAULT_THEME, site.homeId, { inlineShared: true });
};

test.describe("components breathe", () => {
  for (const c of CASES) {
    for (const width of [375, 1280]) {
      test(`${c.name} · ${c.design} @ ${width}`, async ({ page }) => {
        const node = { ...blockForKind(c.name, c.patch), id: "tgt", anchor: "tgt" } as BoxNode;
        await page.setViewportSize({ width, height: 900 });
        await page.setContent(pageFor(node), { waitUntil: "domcontentloaded" });
        await page.waitForSelector("#tgt");
        // The floor in the designs' own fluid unit, as it renders at this screen (0.25rem is 2.8px on a phone).
        const floor = await page.evaluate((len) => {
          const p = document.createElement("div"); p.style.width = len;
          document.querySelector("#tgt")!.parentElement!.appendChild(p);
          const w = p.getBoundingClientRect().width; p.remove(); return w - 0.5; // less sub-pixel rounding
        }, u(FLOOR));
        const found = await page.evaluate((floor) => {
          const tgt = document.querySelector("#tgt") as HTMLElement;
          const out: string[] = [];
          const shown = (el: Element) => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return r.width > 0 && r.height > 0 && s.visibility !== "hidden" && s.display !== "none"; };
          const edged = (el: Element) => {
            const s = getComputedStyle(el);
            const bg = s.backgroundColor !== "rgba(0, 0, 0, 0)" && s.backgroundColor !== "transparent";
            return bg || s.backgroundImage !== "none" || ["Top", "Right", "Bottom", "Left"].some((k) => parseFloat(s.getPropertyValue(`border-${k.toLowerCase()}-width`)) > 0);
          };
          const name = (el: Element) => `${el.tagName.toLowerCase()}${el.className && typeof el.className === "string" ? "." + el.className.split(" ")[0] : ""}`;
          // Words: every text run against the nearest box with a visible edge, up to the component itself.
          const walker = document.createTreeWalker(tgt, NodeFilter.SHOW_TEXT);
          for (let t = walker.nextNode(); t; t = walker.nextNode()) {
            if (!t.textContent?.trim() || !t.parentElement?.checkVisibility() || !shown(t.parentElement)) continue; // a closed item's answer is not drawn
            let box: Element | null = t.parentElement;
            while (box && box !== tgt.parentElement && !edged(box)) box = box.parentElement;
            if (!box || box === tgt.parentElement) continue;
            const range = document.createRange(); range.selectNodeContents(t);
            const w = range.getBoundingClientRect(), b = box.getBoundingClientRect();
            if (w.width === 0) continue;
            const d = Math.min(w.left - b.left, b.right - w.right, w.top - b.top, b.bottom - w.bottom);
            if (d < floor) out.push(`"${t.textContent.trim().slice(0, 24)}" is ${d.toFixed(1)}px from the edge of ${name(box)}`);
          }
          // Parts: what a reader SEES of two parts — their words and icons — never closer than the floor. Boxes may
          // meet (a divided list, a timeline): the divider or the part's own padding is what keeps the words apart.
          const content: { el: Element; r: DOMRect }[] = [];
          const walk2 = document.createTreeWalker(tgt, NodeFilter.SHOW_TEXT);
          for (let t = walk2.nextNode(); t; t = walk2.nextNode()) {
            if (!t.textContent?.trim() || !t.parentElement?.checkVisibility()) continue;
            const range = document.createRange(); range.selectNodeContents(t);
            const r = range.getBoundingClientRect(); if (r.width > 0) content.push({ el: t.parentElement, r });
          }
          for (const svg of tgt.querySelectorAll("svg")) if (svg.checkVisibility() && svg.getBoundingClientRect().width > 0) content.push({ el: svg, r: svg.getBoundingClientRect() });
          for (let i = 0; i < content.length; i++) for (let j = i + 1; j < content.length; j++) {
            const a = content[i], b = content[j];
            if (a.el.contains(b.el) || b.el.contains(a.el)) continue; // one part's own words
            const d = Math.max(b.r.left - a.r.right, a.r.left - b.r.right, b.r.top - a.r.bottom, a.r.top - b.r.bottom);
            if (d < floor) out.push(`${name(a.el)} "${a.el.textContent?.trim().slice(0, 16)}" and ${name(b.el)} "${b.el.textContent?.trim().slice(0, 16)}" are ${d.toFixed(1)}px apart`);
          }
          return out;
        }, floor);
        expect(found, `${c.name} · ${c.design} @ ${width}`).toEqual([]);
      });
    }
  }
});
