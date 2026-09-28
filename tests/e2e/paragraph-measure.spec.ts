import { test, expect } from "@playwright/test";
import { BASE_CSS } from "@/lib/educo-ui/base";
import { FONT_FAMILIES } from "@/lib/educo-ui/fonts";

/**
 * A COMFORTABLE MEASURE, COUNTED — design foundation, Web Design Rule #1.9 (p. 102): under ~75 characters a line.
 *
 * Behaviours: tests/features/components/website/box-builder-layout.feature ("Paragraphs keep a comfortable measure").
 *
 * The published page's own stylesheet (`BASE_CSS`) is applied to a paragraph of ordinary English in every body font of
 * the library, and the characters on each line are COUNTED with a Range — the only honest way to check the rule, since
 * the unit (`ch`, `em`) is exactly what went wrong before: "68ch" set 76–99 characters a line in every one of them (#86).
 * Run on the builder page because it already loads the whole library, so no line is measured in a fallback face.
 */
const TEXT = "Our pupils learn in small classes where every teacher knows every child by name, and families are welcomed into school life from the very first week. Term dates, uniform, clubs and trips are all here in one place, kept up to date by the office so you never have to hunt for a letter again. Science, art and sport sit side by side in a timetable built around curiosity: a morning in the lab, an afternoon on the field, and time to read every day of the week.";

test("every body font of the library sets 45–75 characters a line under the published measure (#86)", async ({ page }) => {
  await page.goto("/website/box-demo");
  const fonts = FONT_FAMILIES.filter((f) => f.category === "Sans" || f.category === "Serif").map((f) => f.name);
  const rows = await page.evaluate(async ({ css, fonts, text }) => {
    const style = document.createElement("style"); style.textContent = css; document.head.appendChild(style);
    const host = document.createElement("div"); host.className = "eu-root"; Object.assign(host.style, { position: "absolute", top: "0", left: "0", width: "1600px", visibility: "hidden" });
    document.body.appendChild(host);
    const out: { font: string; loaded: boolean; avg: number; max: number; maxWidth: string }[] = [];
    for (const font of fonts) {
      await document.fonts.load(`16px "${font}"`).catch(() => undefined);
      const p = document.createElement("p"); p.textContent = text; Object.assign(p.style, { fontFamily: `"${font}"`, fontSize: "16px" });
      host.appendChild(p);
      const node = p.firstChild as Text; const r = document.createRange(); const lines: number[] = []; let top: number | null = null; let n = 0;
      for (let i = 0; i < node.length; i++) { r.setStart(node, i); r.setEnd(node, i + 1); const b = r.getClientRects()[0]; if (!b) continue; if (top === null || Math.abs(b.top - top) > 3) { if (top !== null) lines.push(n); top = b.top; n = 0; } n++; }
      const full = lines; // the last line is short by nature and is not counted
      out.push({ font, loaded: document.fonts.check(`16px "${font}"`), avg: full.reduce((a, b) => a + b, 0) / Math.max(1, full.length), max: Math.max(...full), maxWidth: getComputedStyle(p).maxWidth });
      p.remove();
    }
    return out;
  }, { css: BASE_CSS, fonts, text: TEXT });
  expect(rows.length).toBeGreaterThan(20);
  for (const r of rows) {
    expect(r.maxWidth, `${r.font}: the measure is not applied`).not.toBe("none");
    expect(r.max, `${r.font}: a line of ${r.max} characters`).toBeLessThanOrEqual(75);
    expect(r.avg, `${r.font}: ${r.avg.toFixed(0)} characters a line on average`).toBeGreaterThanOrEqual(45);
  }
});
