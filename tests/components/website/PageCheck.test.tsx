import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import PageCheck from "@/components/website/box/PageCheck";
import { createContainer, makeRowBand, markPageGrid, type BoxNode } from "@/lib/box-model";
import { blockForKind } from "@/lib/box-presets";
import { emptyPageRoot } from "@/lib/box-site";
import { EDGE_SPACE } from "@/lib/semantics";
import PAGE_CHECK_WORDS from "@/config/page-check.json";

/**
 * THE PAGE CHECK OFFERS THE FIX FOR WORDS AT THE PAGE'S EDGE (E-6, the user 2026-10-15). A page made now has no space until it is
 * added, so its words can sit on the edge; the check says so as a suggestion, and one click adds the site's side space.
 */
describe("Page check — words at the page's edge", () => {
  const page = () => markPageGrid({ ...emptyPageRoot(), children: [makeRowBand([createContainer("column", { children: [blockForKind("text", { text: "Welcome" } as Partial<BoxNode>)] })])] });

  it("says so, as a suggestion, and \"Add space at the sides\" sets the site's side space", () => {
    const onSideSpace = vi.fn();
    render(<PageCheck root={page()} isOpen onClose={() => {}} onShow={() => {}} onPatch={() => {}} onSideSpace={onSideSpace} />);
    expect(screen.getByText(/Words on this page touch its left or right edge/)).toBeInTheDocument();
    expect(screen.getByText(/a suggestion — it won't stop you publishing/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Add space at the sides" }));
    expect(onSideSpace).toHaveBeenCalledWith(EDGE_SPACE);
  });
});

describe("LE1-6 · the measuring frame is the width under measure, whatever the editor's width (found HEADED, probe-le1-space.js)", () => {
  it("lifts the stylesheet's `max-width: 100%` on iframes — from a 375 editor every width measured at 375", () => {
    render(<PageCheck root={emptyPageRoot()} html="<p>x</p>" isOpen onClose={() => {}} onShow={() => {}} onPatch={() => {}} />);
    const frame = document.querySelector<HTMLIFrameElement>('iframe[title="Page check measurement"]');
    expect(frame?.style.maxWidth).toBe("none");
    expect(frame?.style.minWidth).toBe("0");
  });
});

/** SE-4 · BATCH LE-9 — the reading order: named, a suggestion, and "Show me" selects the block an Order moved. */
describe("Page check — a screen that shows blocks in a different order from the one they are read in", () => {
  it("names the button moved on phones, as a suggestion, and Show me selects it", () => {
    const btn = blockForKind("button", { text: "Apply now", responsive: { phone: { order: -1 } } } as Partial<BoxNode>);
    const root = { ...emptyPageRoot(), children: [createContainer("column", { children: [blockForKind("heading", { text: "Welcome" } as Partial<BoxNode>), btn] })] };
    const onShow = vi.fn();
    render(<PageCheck root={root} isOpen onClose={() => {}} onShow={onShow} onPatch={() => {}} />);
    const line = screen.getByText(/On phones, the .*Apply now.* is shown in a different place from where it is read/);
    expect(line.textContent).toContain("a suggestion — it won't stop you publishing");
    fireEvent.click(line.closest("li")!.querySelector("button")!);
    expect(onShow).toHaveBeenCalledWith(btn.id);
  });
});

describe("LE15b-11 · the page's main title smaller than a heading under it (the user, 2026-10-19: warn, with the fix)", () => {
  it("says so as a suggestion, and the button gives the title the biggest heading's size", () => {
    const heading = (text: string, fontSize: number) => blockForKind("heading", { text, fontSize } as Partial<BoxNode>);
    const small = heading("Ready to join us?", 26);
    const root = { ...emptyPageRoot(), children: [makeRowBand([createContainer("column", { tag: "section", children: [small] })]), makeRowBand([createContainer("column", { tag: "section", children: [heading("Questions about fees?", 52)] })])] };
    const onPatch = vi.fn();
    render(<PageCheck root={root} isOpen onClose={() => {}} onShow={() => {}} onPatch={onPatch} />);
    expect(screen.getByText(/main title, but it is smaller than headings further down/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: PAGE_CHECK_WORDS.titleSmallerFix }));
    expect(onPatch).toHaveBeenCalledWith(small.id, { fontSize: 52 });
  });
});
