import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import PageCheck from "@/components/website/box/PageCheck";
import { createContainer, makeRowBand, markPageGrid, type BoxNode } from "@/lib/box-model";
import { blockForKind } from "@/lib/box-presets";
import { emptyPageRoot } from "@/lib/box-site";
import { EDGE_SPACE } from "@/lib/semantics";

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
