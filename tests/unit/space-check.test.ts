/** LE-1 · what the Page check calls a block it measured (`spaceName`, lib/space-check.ts). */
import { describe, it, expect } from "vitest";
import { createContainer, createElement, createComponent } from "@/lib/box-model";
import { spaceName, screensInWords } from "@/lib/space-check";

describe("spaceName", () => {
  it("LE1-5: a page band is a SECTION to a person — never \"Side by side\" (found HEADED, U4)", () => {
    expect(spaceName(createContainer("row", { rowBand: true }))).toBe("section");
  });
  it("a Side by side, a Stack and a Grid by the panel's names", () => {
    expect(spaceName(createContainer("row"))).toBe("Side by side");
    expect(spaceName(createContainer("column"))).toBe("Stack");
    expect(spaceName(createContainer("row", { layout: "grid" }))).toBe("Grid");
  });
  it("an element by its kind, a component by its name", () => {
    expect(spaceName(createElement("text", { text: "" }))).toBe("Text");
    expect(spaceName(createComponent("accordion"))).toBe("Accordion");
  });
});

describe("screensInWords", () => {
  it("joins the screens as a sentence", () => {
    expect(screensInWords(["phone"])).toBe("phones");
    expect(screensInWords(["phone", "tabletPortrait", "desktop"])).toBe("phones, tablets held upright and desktops");
  });
});

describe("LE1-7 · two measured blocks of one kind can be told apart (found reading the U5 screenshot: four identical lines)", () => {
  it("a block with words is named with its first words", () => {
    expect(spaceName(createElement("heading", { text: "Admissions are open for <b>September</b> 2027 today" }))).toBe("Heading (“Admissions are open for…”)");
  });
  it("a short one whole", () => {
    expect(spaceName(createElement("text", { text: "Our values" }))).toBe("Text (“Our values”)");
  });
});

describe("LE1-7 · a section is quoted by the first words inside it (found reading the guide's screenshot: two identical section lines)", () => {
  it("a band with no words of its own takes its first block's", () => {
    const band = createContainer("row", { rowBand: true, children: [createContainer("column", { children: [createElement("heading", { text: "Our school" })] })] });
    expect(spaceName(band)).toBe("section (“Our school”)");
  });
});
