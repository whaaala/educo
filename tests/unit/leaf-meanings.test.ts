import { describe, it, expect } from "vitest";
import { createContainer, createElement, insertBox, type BoxNode } from "@/lib/box-model";
import { siteFromRoot } from "@/lib/box-site";
import { renderSitePage } from "@/lib/box-export";
import { DEFAULT_THEME } from "@/lib/site-storage";
import WORDS from "@/config/inspector.json";

/**
 * THE USEFUL FEW TAKE ANOTHER MEANING (BATCH LE-15l LE15l-g / LE15l-6 — template-fully-editable.feature, "A <kind> takes another
 * meaning, and the page publishes it"). Decided by the user 2026-10-20: a Text → paragraph / quote / small print; a Picture → plain
 * or a figure with a caption; a List → bulleted / numbered; a Button → link or button. html-semantics.md: `blockquote` is quoted
 * content, `figure` is a figure only WITH its `figcaption`, `small` is fine print inside a paragraph, `button` performs an action.
 */
const M = WORDS.meaning;
const page = (el: BoxNode) => { const root = insertBox(createContainer("column", { id: "pg" }), "pg", 0, el); const s = siteFromRoot(root); return renderSitePage(s, DEFAULT_THEME, s.pages[0].id); };

describe("a Text", () => {
  it("is a paragraph by default, a quote or small print by choice", () => {
    expect(page(createElement("text", { text: "Hello" }))).toMatch(/<p [^>]*>Hello<\/p>/);
    expect(page(createElement("text", { text: "Wise words", textTag: "blockquote" }))).toMatch(/<blockquote [^>]*>Wise words<\/blockquote>/);
    expect(page(createElement("text", { text: "Terms apply", textTag: "small" }))).toMatch(/<p [^>]*><small>Terms apply<\/small><\/p>/);
  });
});
describe("a Picture", () => {
  it("is an image, or a figure holding it with its caption", () => {
    const pic = createElement("image", { src: "/sections/classroom-800.webp", alt: "A classroom" });
    expect(page(pic)).not.toContain("<figure");
    const fig = page({ ...pic, figure: true, caption: "Year 4 at work" });
    expect(fig).toMatch(/<figure[^>]*>\s*<img [^>]*alt="A classroom"[^>]*\/>\s*<figcaption[^>]*>Year 4 at work<\/figcaption>\s*<\/figure>/);
  });
  it("a figure with no caption yet is not a figure (html-semantics: only WITH its figcaption)", () => {
    expect(page({ ...createElement("image", { src: "/a.webp" }), figure: true, caption: "" })).not.toContain("<figure");
  });
});
describe("a List", () => {
  it("is bulleted or numbered", () => {
    expect(page(createElement("list", { listItems: ["a", "b"], listStyle: "bullet" }))).toContain("<ul");
    expect(page(createElement("list", { listItems: ["a", "b"], listStyle: "number" }))).toContain("<ol");
  });
});
describe("a Button", () => {
  it("is a link by default, a button that does something on the page by choice", () => {
    expect(page(createElement("button", { text: "Apply", href: "page:p2" }))).toMatch(/<a href[^>]*>Apply<\/a>/);
    const b = page(createElement("button", { text: "Open the form", asButton: true }));
    expect(b).toMatch(/<button type="button"[^>]*>Open the form<\/button>/);
    expect(b).not.toMatch(/<a href[^>]*>Open the form/);
  });
});
describe("the words", () => {
  it("are in configuration, one choice list per kind (RULE CFG)", () => {
    expect(M.text.map((o) => o.label)).toEqual(["Paragraph", "Quote", "Small print"]);
    expect(M.image.length).toBe(2); expect(M.list.length).toBe(2); expect(M.button.length).toBe(2);
    expect(M.caption).toBeTruthy();
  });
});
