import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { windowClass, RUNG_PX, HEIGHT_PX, NARROWEST_PHONE_PX } from "@/lib/educo-ui/layout";

/**
 * A-2 (2) — what a window IS: its width rung, its height class, the navigation it gets and how many panes a list-detail shows.
 * The edges come from config/layout.json (RULE CFG); the behaviour asserted is M3's NavigationSuiteScaffold, which the user
 * signed (decisions 1–2): a BAR when the width or the height is compact, a RAIL between, a SIDEBAR from the desktop rung;
 * two panes from tablet landscape. Each line is a device a person holds, then both sides of every edge.
 */
const TP = RUNG_PX.tabletPortrait, TL = RUNG_PX.tabletLandscape, DT = RUNG_PX.desktop, MED = HEIGHT_PX.medium;

describe("windowClass — the devices people hold", () => {
  it.each([
    ["a low-cost phone upright", NARROWEST_PHONE_PX, 800, "phone", "bar", 1],
    ["the same phone on its side", 800, NARROWEST_PHONE_PX, "tabletPortrait", "bar", 1],
    ["a tablet upright", TL - 1, 1024, "tabletPortrait", "rail", 1],
    ["a tablet on its side", 1024, TL - 1, "tabletLandscape", "rail", 2],
    ["a laptop", 1280, 720, "desktop", "sidebar", 2],
  ] as const)("%s (%i × %i) → %s, a %s, %i pane(s)", (_who, w, h, rung, shell, panes) => {
    expect(windowClass(w, h)).toMatchObject({ width: rung, shell, panes });
  });
});

describe("windowClass — both sides of every edge", () => {
  it("the bar gives way to the rail at the tablet-portrait rung, never one px before", () => {
    expect(windowClass(TP - 1, 1000).shell).toBe("bar");
    expect(windowClass(TP, 1000).shell).toBe("rail");
  });
  it("a window under the medium HEIGHT keeps the bar at any width short of the sidebar", () => {
    expect(windowClass(TL, MED - 1)).toMatchObject({ shell: "bar", height: "compact" });
    expect(windowClass(TL, MED)).toMatchObject({ shell: "rail", height: "medium" });
  });
  it("the sidebar starts at the desktop rung", () => {
    expect(windowClass(DT - 1, 900).shell).toBe("rail");
    expect(windowClass(DT, 900).shell).toBe("sidebar");
  });
  it("list and detail split at tablet landscape — one pane with Back below it", () => {
    expect(windowClass(TL - 1, 900).panes).toBe(1);
    expect(windowClass(TL, 900).panes).toBe(2);
  });
  it("the height classes climb: compact · medium · expanded", () => {
    expect([0, MED - 1, MED, HEIGHT_PX.expanded].map((h) => windowClass(1000, h).height)).toEqual(["compact", "compact", "medium", "expanded"]);
  });
});

// The feature file's table IS a test (tests/features/components/app-shell/app-layout.feature): the scenarios and the code cannot drift.
const FEATURE = readFileSync("tests/features/components/app-shell/app-layout.feature", "utf8").replace(/\r\n/g, "\n");
const examples = [...FEATURE.matchAll(/^\s*\|\s*(\d+)\s*\|\s*(\d+)\s*\|\s*(\w+)\s*\|\s*(\d)\s*\|\s*$/gm)].map((m) => [+m[1], +m[2], m[3], +m[4]] as const);
describe("app-layout.feature — every row of its table", () => {
  it("has its rows", () => expect(examples.length).toBeGreaterThanOrEqual(9));
  it.each(examples)("%i × %i → a %s, %i pane(s)", (w, h, shell, panes) => expect(windowClass(w, h)).toMatchObject({ shell, panes }));
});

describe("windowClass — how many places a bar holds (barFits)", () => {
  it("a 375 phone holds five at normal text, two at 200 % (the CSS sees 187 px); never under two or over barMax", () => {
    expect(windowClass(375, 812).barFits).toBe(5);
    expect(windowClass(187, 406).barFits).toBe(2);
    expect(windowClass(100, 400).barFits).toBe(2);
    expect(windowClass(3000, 2000).barFits).toBe(5);
  });
});
