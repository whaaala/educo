import { describe, it, expect } from "vitest";
import { ALERT_DESIGNS, ALERT_DESIGN_COUNT, ALERT_DESIGN_IDS, ALERT_ALL_IDS, ALERT_AXES, ALERT_COMBINATIONS } from "@/lib/educo-ui/alerts";
import { ACCORDION_DESIGN_COUNT } from "@/lib/educo-ui/accordions";
import { COMPONENT_CSS } from "@/lib/educo-ui/components";

/**
 * The Alert's design catalogue. It grew from 7 to 54 because the Alert is the block a school reaches for most
 * and had the thinnest wardrobe in the builder — the Accordion already offered 54.
 */
describe("alert designs", () => {
  it("offers far MORE than the Accordion, because its looks combine", () => {
    // The number that matters to a user is what they can REACH, not how many tiles are in one list. The
    // Accordion still has one exclusive field of 55; the Alert has 22 designs times six independent axes.
    expect(ALERT_DESIGN_COUNT, "distinct designs in the gallery").toBeGreaterThanOrEqual(20);
    expect(ALERT_COMBINATIONS, "reachable looks").toBeGreaterThan(ACCORDION_DESIGN_COUNT * 100);
  });

  it("keeps the DESIGN axis to genuinely distinct looks — modifiers live on their own axes", () => {
    // A shape, a border style or a density is not a design. Mixing them into the gallery is what made two
    // thirds of the old 54 near-identical to each other.
    const designIds = ALERT_DESIGN_IDS.join(" ");
    for (const modifier of ["--compact", "--sharp", "--pill", "--dashed", "--icon-circle", "--centred", "--large"]) {
      expect(designIds, `${modifier} is a modifier, not a design`).not.toContain(modifier);
    }
    for (const axis of ALERT_AXES) {
      expect(axis.options[0].id, `${axis.label} starts with a "leave it alone" option`).toBe("");
      expect(axis.options.length, `${axis.label} needs real choices`).toBeGreaterThan(1);
    }
  });

  it("EVERY design AND axis option has CSS behind it — one that renders nothing is a lie in the picker", () => {
    const missing = ALERT_ALL_IDS.filter((id) => id && !COMPONENT_CSS.includes(`.eu-alert${id}`));
    expect(missing, `these designs have no CSS: ${missing.join(", ")}`).toEqual([]);
  });

  it("every CSS design is offered in the picker — no orphans nobody can reach", () => {
    // Anything styled but unlisted is dead code the user can never select.
    const inCss = [...COMPONENT_CSS.matchAll(/\.eu-alert--([a-z-]+)/g)].map((m) => `--${m[1]}`);
    // severities are chosen separately; banner/callout are FORM factors, not designs
    // Reachable, but not through a design or axis list: severities have their own control, banner/callout are
    // FORM factors, and --actions-right comes from the Actions placement field.
    const notDesigns = ["--info", "--success", "--warning", "--danger", "--neutral", "--brand", "--banner", "--callout", "--actions-right"];
    // ALL ids, across every axis — an axis option is reachable too, just from a different control.
    const orphans = [...new Set(inCss)].filter((id) => !notDesigns.includes(id) && !ALERT_ALL_IDS.includes(id));
    expect(orphans, `styled but unreachable: ${orphans.join(", ")}`).toEqual([]);
  });

  it("ids and labels are unique, and the default comes first", () => {
    expect(ALERT_DESIGN_IDS[0], "the default look leads the gallery").toBe("");
    expect(new Set(ALERT_DESIGN_IDS).size).toBe(ALERT_DESIGN_IDS.length);
    const labels = ALERT_DESIGNS.flatMap((g) => g.items.map((i) => i.label));
    expect(new Set(labels).size, "two designs sharing a name would be indistinguishable").toBe(labels.length);
  });

  it("is grouped, so 54 designs stay navigable", () => {
    expect(ALERT_DESIGNS.length).toBeGreaterThanOrEqual(4);
    for (const g of ALERT_DESIGNS) {
      expect(g.group, "every group is named").toBeTruthy();
      expect(g.items.length, `${g.group} must not be empty`).toBeGreaterThan(0);
    }
  });

  it("stays token-driven — the severity supplies the colour, so one rule serves all six", () => {
    // A design hardcoding a colour would break in the other three themes and ignore the chosen severity.
    const alertCss = COMPONENT_CSS.split(".eu-alert").slice(1).join(".eu-alert");
    expect(alertCss).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
    expect(COMPONENT_CSS).toContain("--al-c");
  });
});
