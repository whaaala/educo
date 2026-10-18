/**
 * ED-3b · copy a block's style and paste it (BATCH LE-14; tests/features/components/website/box-builder-copy-style.feature).
 * What counts as the look is config/inspector.json `style`, read here — never re-typed (RULE CFG).
 */
import { describe, it, expect } from "vitest";
import { type BoxNode, createContainer, createElement, insertBox, normalizeRowBands, findBox, copyStyle, pasteStyle, resolveResponsive } from "@/lib/box-model";
import WORDS from "@/config/inspector.json";

const page = (...blocks: BoxNode[]) => {
  let root = createContainer("column", { id: "root", padding: 0, gap: 0, children: [] } as Partial<BoxNode>);
  for (const b of blocks) root = normalizeRowBands(insertBox(root, "root", root.children!.length, b));
  return root;
};
const styled = createContainer("column", { id: "s1", background: "#ffeedd", radius: 16, borderWidth: 1, borderColor: "#333333", padding: 24, gap: 8, children: [createElement("text", { id: "in1", text: "mine" } as Partial<BoxNode>)] } as Partial<BoxNode>);
const plain = createContainer("column", { id: "s2", width: "50%", children: [createElement("text", { id: "in2", text: "yours" } as Partial<BoxNode>)] } as Partial<BoxNode>);
const head = createElement("heading", { id: "h", text: "Title", fontFamily: "Lora", fontSize: 40, color: "#112233", radius: 4 } as Partial<BoxNode>);
const text = createElement("text", { id: "t", text: "Body words" } as Partial<BoxNode>);

describe("ED-3b copy and paste a style", () => {
  it("what is copied is exactly the configured look — no content, no size, no place", () => {
    const st = copyStyle(styled, "base");
    expect(Object.keys(st).sort()).toEqual([...WORDS.style.box, ...WORDS.style.words, ...WORDS.style.container].sort());
    for (const k of ["text", "children", "width", "id", "type", "layout"]) expect(st).not.toHaveProperty(k);
  });
  it("a Stack's look onto a plain Stack: background, corners, border, spacing — its blocks and width its own", () => {
    const root = page(styled, plain);
    const out = findBox(pasteStyle(root, ["s2"], copyStyle(findBox(root, "s1")!, "base"), "base"), "s2")!;
    expect([out.background, out.radius, out.borderWidth, out.borderColor, out.padding, out.gap]).toEqual(["#ffeedd", 16, 1, "#333333", 24, 8]);
    expect(out.width).toBe(findBox(root, "s2")!.width);
    expect(out.children!.flatMap((c) => c.children ?? [c]).map((c) => c.text)).toEqual(["yours"]);
  });
  it("the look of the words comes too, and the words stay", () => {
    const root = page(head, text);
    const out = findBox(pasteStyle(root, ["t"], copyStyle(findBox(root, "h")!, "base"), "base"), "t")!;
    expect([out.fontFamily, out.fontSize, out.color, out.text]).toEqual(["Lora", 40, "#112233", "Body words"]);
  });
  it("a container's gap is never written to a Heading; its background and corners are", () => {
    const root = page(styled, head);
    const out = findBox(pasteStyle(root, ["h"], copyStyle(findBox(root, "s1")!, "base"), "base"), "h")!;
    expect(out.gap).toBeUndefined();
    expect([out.background, out.radius]).toEqual(["#ffeedd", 16]);
  });
  it("what the copied block did not have is taken off: the look is the copied one", () => {
    const root = page(head, text);
    const out = findBox(pasteStyle(root, ["h"], copyStyle(findBox(root, "t")!, "base"), "base"), "h")!;
    expect([out.fontFamily, out.radius]).toEqual([undefined, undefined]);
  });
  it("pasted on the phone: the phone shows it, the desktop keeps its own", () => {
    const root = page(styled, plain);
    const out = findBox(pasteStyle(root, ["s2"], copyStyle(findBox(root, "s1")!, "base"), "phone"), "s2")!;
    expect(resolveResponsive(out, "phone").radius).toBe(16);
    expect(out.radius).toBeUndefined();
  });
  it("onto several at once; nothing written where it is already alike", () => {
    const root = page(styled, plain, text);
    const st = copyStyle(findBox(root, "s1")!, "base");
    const out = pasteStyle(root, ["s2", "t"], st, "base");
    expect(findBox(out, "s2")!.radius).toBe(16); expect(findBox(out, "t")!.radius).toBe(16);
    expect(pasteStyle(root, ["s1"], st, "base")).toBe(root);
  });
});
