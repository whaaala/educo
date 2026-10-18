/**
 * ED-7 · "set here / from a wider screen" and its own reset (BATCH LE-14; tests/features/components/website/box-builder-set-here.feature).
 * Values are written the way the Inspector writes them: `updateBoxResponsive` on the screen being edited.
 */
import { describe, it, expect } from "vitest";
import { type BoxNode, createContainer, findBox, updateBoxResponsive, resolveResponsive, fieldSource, ownFields, resetField } from "@/lib/box-model";

const page = () => createContainer("column", { id: "root", children: [createContainer("column", { id: "s", radius: 8, children: [] } as Partial<BoxNode>)] } as Partial<BoxNode>);
const at = (root: BoxNode) => findBox(root, "s")!;

describe("ED-7 where a value comes from", () => {
  const tablet = updateBoxResponsive(page(), "s", { radius: 24 }, "tabletLandscape");
  const phone = updateBoxResponsive(tablet, "s", { radius: 4, opacity: 50 }, "phone");
  it("set on this screen → here", () => { expect(fieldSource(at(phone), "phone", "radius")).toBe("here"); });
  it("set on a wider screen → that screen", () => {
    expect(fieldSource(at(tablet), "phone", "radius")).toBe("tabletLandscape");
    expect(fieldSource(at(tablet), "tabletPortrait", "radius")).toBe("tabletLandscape");
  });
  it("the desktop, or nothing set → no mark", () => {
    expect(fieldSource(at(phone), "base", "radius")).toBe("base");
    expect(fieldSource(at(phone), "phone", "shadow")).toBe("base");
    expect(fieldSource(at(phone), "wide", "radius")).toBe("base");
  });
  it("a clear made on this screen is set here too (it overrides)", () => {
    expect(fieldSource(at(updateBoxResponsive(page(), "s", { radius: undefined }, "phone")), "phone", "radius")).toBe("here");
  });
  it("an old saved `mobile` slot is the phone's own", () => {
    const old = createContainer("column", { id: "s", responsive: { mobile: { radius: 2 } } } as Partial<BoxNode>);
    expect(fieldSource(old, "phone", "radius")).toBe("here");
    expect(ownFields(old, "phone")).toEqual(["radius"]);
  });
  it("the values set on this screen, and only those", () => {
    expect(ownFields(at(phone), "phone")).toEqual(["radius", "opacity"]);
    expect(ownFields(at(phone), "tabletLandscape")).toEqual(["radius"]);
    expect(ownFields(at(phone), "base")).toEqual([]);
  });
});

describe("ED-7 reset one value", () => {
  const tablet = updateBoxResponsive(page(), "s", { radius: 24 }, "tabletLandscape");
  const phone = updateBoxResponsive(tablet, "s", { radius: 4, opacity: 50 }, "phone");
  it("the phone shows the tablet's corners again; its see-through stays; the tablet and desktop untouched", () => {
    const r = at(resetField(phone, "s", "radius", "phone"));
    expect(resolveResponsive(r, "phone").radius).toBe(24);
    expect(resolveResponsive(r, "phone").opacity).toBe(50);
    expect(resolveResponsive(r, "tabletLandscape").radius).toBe(24);
    expect(r.radius).toBe(8);
  });
  it("the last value of a screen leaves no empty slot behind", () => {
    const r = at(resetField(tablet, "s", "radius", "tabletLandscape"));
    expect(r.responsive?.tabletLandscape).toBeUndefined();
  });
  it("nothing to reset → the same page", () => {
    expect(resetField(phone, "s", "shadow", "phone")).toBe(phone);
    expect(resetField(phone, "s", "radius", "base")).toBe(phone);
  });
});
