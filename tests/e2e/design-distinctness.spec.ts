import { test, expect, type Page } from "@playwright/test";
import { ALERT_DESIGNS, ALERT_AXES } from "@/lib/educo-ui/alerts";
import { ACCORDION_DESIGNS, ACCORDION_AXES } from "@/lib/educo-ui/accordions";
import { stylesheet } from "@/lib/educo-ui/base";
import { DEFAULT_THEME } from "@/lib/site-storage";

/**
 * RULE T — every variation of every component must be VISIBLY DIFFERENT from every other.
 *
 * The Alert shipped a gallery of "54 designs" in which two thirds were modifiers — a corner shape, a density,
 * an icon treatment — presented as though they were designs. Two problems: many tiles were near-identical to
 * each other, and because they lived in one exclusive field the combination a user actually wanted (Ticket AND
 * compact) was unreachable. The axes fixed the second. This file enforces the first.
 *
 * It cannot be checked by reading CSS: two rules can differ textually and render identically, and two rules can
 * look different only because of a token that resolves the same in this theme. So each design is rendered and
 * the BROWSER is asked what it computed — background, border, radius, shadow, layout, type — and every pair
 * must differ somewhere.
 */

/**
 * What makes two looks different to a person — sampled across the whole component, not just its outer box.
 *
 * Two lessons are baked in here. Sampling only two corners reported the Alert's "Rounded" and "Leaning" as
 * identical, because Leaning differs on the OTHER two. And sampling only the root element reported 48 of the
 * Accordion's 55 designs as identical, because an accordion design mostly styles its ITEM and HEADER — the
 * container barely changes. A too-narrow signature does not make a lax test; it makes a loud, wrong one.
 */
const SIGNATURE = `(root, parts) => {
  const one = (el) => {
    if (!el) return "-";
    const c = getComputedStyle(el);
    const b = getComputedStyle(el, "::before");
    const a = getComputedStyle(el, "::after");
    return [
      c.backgroundColor, c.backgroundImage, c.color,
      c.borderTopWidth, c.borderTopStyle, c.borderTopColor,
      c.borderRightWidth, c.borderRightColor, c.borderBottomWidth, c.borderBottomColor,
      c.borderLeftWidth, c.borderLeftColor,
      c.borderTopLeftRadius, c.borderTopRightRadius, c.borderBottomRightRadius, c.borderBottomLeftRadius,
      c.boxShadow, c.outlineWidth, c.outlineColor, c.outlineOffset,
      c.padding, c.margin, c.gap, c.fontSize, c.fontWeight, c.fontFamily, c.letterSpacing, c.textTransform,
      c.flexDirection, c.alignItems, c.justifyContent, c.textAlign, c.opacity, c.clipPath, c.display,
      c.writingMode, c.transform, c.maxInlineSize,
      b.content, b.backgroundImage, b.backgroundColor, b.borderTopWidth, b.width, b.height, b.transform,
      a.content, a.backgroundImage, a.backgroundColor, a.borderTopWidth, a.width, a.height, a.transform,
    ].join("~");
  };
  return [root, ...parts.map((sel) => root.querySelector(sel))].map(one).join("||");
}`;

async function signatures(page: Page, base: string, prefix: string, ids: string[], markup: (cls: string) => string, parts: string[] = []) {
  return page.evaluate(
    ({ base, prefix, ids, markup, sigSrc, parts }) => {
      const sig = eval(sigSrc) as (el: Element, parts: string[]) => string;
      const host = document.createElement("div");
      host.className = "eu-root";
      host.style.cssText = "position:fixed;left:-9999px;top:0;width:420px";
      document.body.appendChild(host);
      const out: Record<string, string> = {};
      for (const id of ids) {
        host.innerHTML = markup.replace(/%CLS%/g, `${base}${id ? ` ${prefix}${id}` : ""}`);
        out[id || "(default)"] = sig(host.firstElementChild!, parts);
      }
      host.remove();
      return out;
    },
    { base, prefix, ids, markup: markup("%CLS%"), sigSrc: SIGNATURE, parts },
  );
}

/** Report every pair that renders identically, so a failure names the culprits rather than just counting. */
function duplicates(sigs: Record<string, string>): string[] {
  const bySig = new Map<string, string[]>();
  for (const [id, s] of Object.entries(sigs)) bySig.set(s, [...(bySig.get(s) ?? []), id]);
  return [...bySig.values()].filter((g) => g.length > 1).map((g) => g.join(" ≡ "));
}

test.describe("RULE T — variations must be visibly different", () => {
  test.beforeEach(async ({ page }) => {
    // Inject the SHIPPED stylesheet into a blank page rather than relying on the builder to have injected it:
    // the canvas only injects when the page holds a component, so an empty canvas produced no styles at all and
    // every design measured identical — the whole suite passing or failing on an unrelated condition.
    // Scoped to `.eu-root`, exactly as the canvas scopes it.
    await page.setContent("<div id=\"host\"></div>", { waitUntil: "domcontentloaded" });
    await page.addStyleTag({ content: stylesheet(DEFAULT_THEME).replaceAll(":root", ".eu-root") });
  });

  test("every ALERT design renders differently from every other", async ({ page }) => {
    const ids = ALERT_DESIGNS.flatMap((g) => g.items.map((i) => i.id));
    const sigs = await signatures(page, "eu-alert eu-alert--info", "eu-alert", ids, (cls) =>
      `<div class="${cls}"><span class="eu-alert__icon">i</span><div class="eu-alert__content">` +
      `<div class="eu-alert__title">Heads up</div><div class="eu-alert__body">A message.</div></div></div>`, [".eu-alert__icon", ".eu-alert__content", ".eu-alert__title", ".eu-alert__body"]);
    const dupes = duplicates(sigs);
    expect(dupes, `these designs are indistinguishable: ${dupes.join(" | ")}`).toEqual([]);
    expect(Object.keys(sigs).length, "and there are plenty of them").toBeGreaterThanOrEqual(20);
  });

  test("every option WITHIN each Alert axis renders differently", async ({ page }) => {
    // An axis whose options do nothing is the same lie in a smaller box.
    for (const axis of ALERT_AXES) {
      const sigs = await signatures(page, "eu-alert eu-alert--info", "eu-alert", axis.options.map((o) => o.id), (cls) =>
        `<div class="${cls}"><span class="eu-alert__icon">i</span><div class="eu-alert__content">` +
        `<div class="eu-alert__title">Heads up</div><div class="eu-alert__body">A message.</div></div></div>`, [".eu-alert__icon", ".eu-alert__content", ".eu-alert__title", ".eu-alert__body"]);
      const dupes = duplicates(sigs);
      expect(dupes, `${axis.label}: indistinguishable options — ${dupes.join(" | ")}`).toEqual([]);
    }
  });

  test("the axes actually COMBINE — a modifier changes a design without replacing it", async ({ page }) => {
    // The whole reason for splitting them up. "Ticket" plus "Compact" must be both, not one or the other.
    const seen = await page.evaluate(() => {
      const host = document.createElement("div");
      host.className = "eu-root";
      host.style.cssText = "position:fixed;left:-9999px;top:0;width:420px";
      document.body.appendChild(host);
      const make = (cls: string) => {
        host.innerHTML = `<div class="${cls}"><div class="eu-alert__content"><div class="eu-alert__body">A message.</div></div></div>`;
        const c = getComputedStyle(host.firstElementChild!);
        return { padding: c.padding, borderStyle: c.borderTopStyle };
      };
      const ticket = make("eu-alert eu-alert--info eu-alert--ticket");
      const both = make("eu-alert eu-alert--info eu-alert--ticket eu-alert--compact");
      const compact = make("eu-alert eu-alert--info eu-alert--compact");
      host.remove();
      return { ticket, both, compact };
    });
    expect(seen.both.borderStyle, "it keeps the Ticket's dashed border").toBe(seen.ticket.borderStyle);
    expect(seen.both.padding, "and takes Compact's padding").toBe(seen.compact.padding);
    expect(seen.both.padding, "which is not the Ticket's own padding").not.toBe(seen.ticket.padding);
  });

  test("every option WITHIN each Accordion axis renders differently", async ({ page }) => {
    for (const axis of ACCORDION_AXES) {
      const sigs = await signatures(page, "eu-accordion", "eu-accordion", axis.options.map((o) => o.id),
        (cls) =>
      `<div class="${cls}">` +
      `<details class="eu-accordion__item" open><summary class="eu-accordion__header">One</summary><div class="eu-accordion__body">An answer.</div></details>` +
      `<details class="eu-accordion__item"><summary class="eu-accordion__header">Two</summary><div class="eu-accordion__body">Another.</div></details>` +
      `<details class="eu-accordion__item"><summary class="eu-accordion__header">Three</summary><div class="eu-accordion__body">A third.</div></details>` +
      `</div>`, [
        ".eu-accordion__item", ".eu-accordion__item:nth-child(2)", ".eu-accordion__item:nth-child(3)",
        ".eu-accordion__header", ".eu-accordion__item:nth-child(2) .eu-accordion__header",
        ".eu-accordion__body",
      ]);
      const dupes = duplicates(sigs);
      expect(dupes, `${axis.label}: indistinguishable options — ${dupes.join(" | ")}`).toEqual([]);
    }
  });

  test("Accordion axes COMBINE — a design keeps its character while a modifier applies", async ({ page }) => {
    const seen = await page.evaluate(() => {
      const host = document.createElement("div");
      host.className = "eu-root";
      host.style.cssText = "position:fixed;left:-9999px;top:0;width:460px";
      document.body.appendChild(host);
      const make = (cls: string) => {
        host.innerHTML = `<div class="${cls}"><details class="eu-accordion__item" open>` +
          `<summary class="eu-accordion__header">One</summary><div class="eu-accordion__body">An answer.</div></details></div>`;
        const item = host.querySelector(".eu-accordion__item")!;
        const header = host.querySelector(".eu-accordion__header")!;
        return { itemBg: getComputedStyle(item).backgroundColor, headerPad: getComputedStyle(header).padding };
      };
      const timeline = make("eu-accordion eu-accordion--timeline");
      const compact = make("eu-accordion eu-accordion--compact");
      const both = make("eu-accordion eu-accordion--timeline eu-accordion--compact");
      host.remove();
      return { timeline, compact, both };
    });
    expect(seen.both.itemBg, "it keeps the Timeline design").toBe(seen.timeline.itemBg);
    expect(seen.both.headerPad, "and takes Compact's density").toBe(seen.compact.headerPad);
    expect(seen.both.headerPad, "which is not Timeline's own").not.toBe(seen.timeline.headerPad);
  });

  test("an axis is never defeated by the DESIGN or by the FORM FACTOR", async ({ page }) => {
    // Reported from the UI: choosing a design and then fine-tuning it appeared to do nothing. Two causes, both
    // real. The BORDER options were setting a background, so picking "Thick left" erased the design's own
    // surface — the opposite of an orthogonal axis. And the banner form factor zeroes the side borders at a
    // higher specificity than an axis rule, so "Thick left" could never appear on a banner at all.
    //
    // A fine-tuning choice is an explicit instruction from the user and must win over both.
    const seen = await page.evaluate(() => {
      const host = document.createElement("div");
      host.className = "eu-root";
      host.style.cssText = "position:fixed;left:-9999px;top:0;width:460px";
      document.body.appendChild(host);
      const make = (stackCls: string, alertCls: string) => {
        host.innerHTML = `<div class="eu-alert-stack ${stackCls}"><div class="eu-alert ${alertCls}">` +
          `<div class="eu-alert__content"><div class="eu-alert__body">A message.</div></div></div></div>`;
        const c = getComputedStyle(host.querySelector(".eu-alert")!);
        return { left: c.borderLeftWidth, pad: c.padding, bg: c.backgroundColor, shadow: c.boxShadow };
      };
      const noteAlone = make("", "eu-alert--info eu-alert--note");
      const tuned = make("eu-alert-stack--banner", "eu-alert--info eu-alert--note eu-alert--thick-left eu-alert--spacious");
      const spaciousAlone = make("", "eu-alert--info eu-alert--spacious");
      host.remove();
      return { noteAlone, tuned, spaciousAlone };
    });

    expect(parseFloat(seen.tuned.left), "Thick left must apply even on a banner").toBeGreaterThanOrEqual(6);
    expect(seen.tuned.pad, "Spacious must set the padding").toBe(seen.spaciousAlone.pad);
    expect(seen.tuned.bg, "and the DESIGN must keep its own background — a border axis must not repaint it")
      .toBe(seen.noteAlone.bg);
    expect(seen.tuned.shadow, "and its shadow").toBe(seen.noteAlone.shadow);
  });

  test("every ACCORDION design renders differently from every other", async ({ page }) => {
    const ids = ACCORDION_DESIGNS.flatMap((g) => g.items.map((i) => i.id));
    // THREE items, the first open — because an accordion design is mostly about the difference between an
    // open row and a closed one. A single open item made "Filled" and "Brand header" look identical (one tints
    // the header always, the other only when open) and the same for "Accent" and "Rail". Zebra needs three
    // rows before its alternation exists at all. A sample that cannot show a difference reports a false one.
    const sigs = await signatures(page, "eu-accordion", "eu-accordion", ids, (cls) =>
      `<div class="${cls}">` +
      `<details class="eu-accordion__item" open><summary class="eu-accordion__header">One</summary><div class="eu-accordion__body">An answer.</div></details>` +
      `<details class="eu-accordion__item"><summary class="eu-accordion__header">Two</summary><div class="eu-accordion__body">Another.</div></details>` +
      `<details class="eu-accordion__item"><summary class="eu-accordion__header">Three</summary><div class="eu-accordion__body">A third.</div></details>` +
      `</div>`, [
        ".eu-accordion__item", ".eu-accordion__item:nth-child(2)", ".eu-accordion__item:nth-child(3)",
        ".eu-accordion__header", ".eu-accordion__item:nth-child(2) .eu-accordion__header",
        ".eu-accordion__body",
      ]);
    const dupes = duplicates(sigs);
    expect(dupes, `these accordion designs are indistinguishable: ${dupes.join(" | ")}`).toEqual([]);
  });
});
