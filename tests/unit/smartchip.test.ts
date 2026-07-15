import { describe, it, expect } from "vitest";
import {
  buildChipHtml, formatChipDate, nextDropdownValue, statusChip, CHIP_CLASS, type SmartChip,
} from "@/lib/smartchip/chips";

describe("smartchip — buildChipHtml", () => {
  it("builds a contenteditable=false pill with data attributes", () => {
    const html = buildChipHtml({ kind: "person", value: "Ada Lovelace" });
    expect(html).toContain(`class="${CHIP_CLASS}"`);
    expect(html).toContain('contenteditable="false"');
    expect(html).toContain('data-chip="person"');
    expect(html).toContain('data-value="Ada Lovelace"');
    expect(html).toContain("Ada Lovelace");
  });
  it("adds label prefix for variable chips", () => {
    expect(buildChipHtml({ kind: "variable", value: "My Doc", label: "Title" })).toContain("Title: My Doc");
  });
  it("dropdown chips carry their options and a caret", () => {
    const html = buildChipHtml(statusChip("In progress"));
    expect(html).toContain('data-chip="dropdown"');
    expect(html).toContain('data-options="Not started|In progress|Blocked|Done"');
    expect(html).toContain('data-value="In progress"');
    expect(html).toContain("▾");
  });
  it("escapes HTML in values (no injection)", () => {
    const html = buildChipHtml({ kind: "person", value: '<img src=x onerror=alert(1)>' });
    expect(html).not.toContain("<img");
    expect(html).toContain("&lt;img");
  });
});

describe("smartchip — formatChipDate", () => {
  it("formats as 'Mon D, YYYY'", () => {
    expect(formatChipDate(new Date(2025, 0, 2))).toBe("Jan 2, 2025");
    expect(formatChipDate(new Date(2025, 11, 25))).toBe("Dec 25, 2025");
  });
});

describe("smartchip — nextDropdownValue", () => {
  const opts = ["Not started", "In progress", "Blocked", "Done"];
  it("cycles to the next option and wraps", () => {
    expect(nextDropdownValue("Not started", opts)).toBe("In progress");
    expect(nextDropdownValue("Done", opts)).toBe("Not started");
  });
  it("starts from the first option when current is unknown", () => {
    expect(nextDropdownValue("???", opts)).toBe("Not started");
  });
  it("returns the current value when there are no options", () => {
    expect(nextDropdownValue("x", [])).toBe("x");
  });
});
