import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { PRESETS_FLAT } from "@/lib/preview-devices";
import { RUNG_PX } from "@/lib/educo-ui/layout";

/**
 * EVERY UAT CHECKS THE PREVIEW AT EVERY DEVICE AND EVERY BREAKPOINT (RULE Z, the user 2026-10-04: "don't just check one,
 * check all of the devices… always check all of the breakpoints… that must be a rule… for all of our UAT testing").
 * The list is `scripts/uat/screens.js`; this holds it to the Preview's own device menu and the rung ladder, and holds
 * every new headed UAT script to it.
 */
const { SCREENS, WIDTHS } = require("../../scripts/uat/screens.js") as { SCREENS: { w: number; h: number }[]; WIDTHS: number[] };

/** Headed UAT scripts written before the rule (2026-10-04): their passes were reported when they ran. */
const BEFORE_THE_RULE = new Set(["uat-f1-headed.js", "uat-l3-headed.js", "uat-l4-headed.js"]);

describe("the UAT screen list", () => {
  it.each(PRESETS_FLAT.map((p) => [p.label, p.w, p.h] as const))("holds the Preview's %s", (_label, w, h) => {
    expect(SCREENS.some((s) => s.w === w && s.h === h)).toBe(true);
  });

  it.each(Object.entries(RUNG_PX).filter(([, px]) => px > 0))("holds both sides of the %s breakpoint", (_name, px) => {
    expect(WIDTHS).toContain(px - 1);
    expect(WIDTHS).toContain(px);
  });

  it("every headed UAT script written from now on checks the Preview against it", () => {
    const dir = join(__dirname, "..", "..", "scripts", "uat");
    const scripts = readdirSync(dir).filter((f) => /^uat-.*-headed\.js$/.test(f) && !BEFORE_THE_RULE.has(f));
    expect(scripts.length).toBeGreaterThan(0);
    for (const f of scripts) expect(readFileSync(join(dir, f), "utf8").replace(/\r\n/g, "\n"), `${f} must use ./screens.js`).toMatch(/require\(['"]\.\/screens(\.js)?['"]\)/);
  });
});
