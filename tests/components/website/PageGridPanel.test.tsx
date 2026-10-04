import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import PageGridPanel from "@/components/website/box/PageGridPanel";
import BoxCanvas from "@/components/website/box/BoxCanvas";
import { DEFAULT_THEME } from "@/lib/site-storage";
import { u, pageSideSpace, SPACE_GRID, FRAME_CSS, baseUnit, createContainer, markPageGrid, normalizeRowBands, makeRowBand, type BoxNode } from "@/lib/box-model";
import { blockForKind } from "@/lib/box-presets";
import { emptyPageRoot } from "@/lib/box-site";
import { guideColor, guideInk } from "@/lib/page-grid";
import { contrastRatio } from "@/lib/educo-ui/color";
import { resolveSiteTheme } from "@/lib/site-storage";

/** G-2 · the page-grid panel and the layout guides. Scenarios: tests/features/components/website/page-grid.feature. */
const panel = (over: Partial<Parameters<typeof PageGridPanel>[0]> = {}) => {
  const props = { grid: {}, ownPage: false, breakpoint: "base" as const, rows: false, onRows: vi.fn(), onChange: vi.fn(), onOwnPage: vi.fn(), onClose: vi.fn(), ...over };
  render(<PageGridPanel {...props} />);
  return props;
};

describe("the page-grid panel", () => {
  it("opens on the screen being edited and steps that screen's columns", () => {
    const p = panel({ breakpoint: "phone" });
    expect(screen.getByLabelText("Columns on Phone")).toHaveValue(6);
    fireEvent.click(screen.getByLabelText("Columns on Phone: one fewer"));
    expect(p.onChange).toHaveBeenCalledWith({ phoneColumns: 5 }, "pagegrid:phone");
  });

  it("Desktop sets the count; another screen sets its own, and can follow Desktop again", () => {
    const p = panel({ grid: { perRung: { wide: 16 } }, breakpoint: "wide" });
    expect(screen.getByLabelText("Columns on Wide")).toHaveValue(16);
    fireEvent.click(screen.getByRole("button", { name: "Follow Desktop" }));
    expect(p.onChange).toHaveBeenCalledWith({ perRung: {} }, "pagegrid:wide");
    fireEvent.click(screen.getByRole("button", { name: "Desktop" }));
    fireEvent.click(screen.getByLabelText("Columns on Desktop: one more"));
    expect(p.onChange).toHaveBeenLastCalledWith({ perRung: { wide: 16 }, columns: 13 }, "pagegrid:columns");
  });

  it("the side space reads its default, can go to zero and back", () => {
    const p = panel();
    expect(screen.getByText("Default · 1–1.25rem")).toBeInTheDocument(); // G-3c: the frame as it really is, phone → wide (G3c-1)
    expect(screen.getByText(`Default · ${+(SPACE_GRID.columns / 10 * 0.4375).toFixed(2)}–${+(SPACE_GRID.columns / 10 * 0.875).toFixed(2)}rem`)).toBeInTheDocument(); // the gap across, never "value / 16"
    fireEvent.change(screen.getByLabelText("Side space (padding)"), { target: { value: "0" } });
    expect(p.onChange).toHaveBeenCalledWith({ sideSpace: 0 }, "pagegrid:side");
    expect(screen.getAllByRole("button", { name: "At the default" })).toHaveLength(1);
    expect(screen.getByRole("button", { name: "Space between columns — at the default" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Space between rows — at the default" })).toBeDisabled();
  });

  it("G-3b (5): space between columns and between rows, each its own, each back to its default", () => {
    const p = panel();
    expect(screen.getByLabelText("Space between columns")).toHaveValue(String(SPACE_GRID.columns));
    expect(screen.getByLabelText("Space between rows")).toHaveValue(String(SPACE_GRID.stack));
    fireEvent.change(screen.getByLabelText("Space between columns"), { target: { value: "40" } });
    expect(p.onChange).toHaveBeenLastCalledWith({ columnGap: 40 }, "pagegrid:columnGap");
    fireEvent.change(screen.getByLabelText("Space between rows"), { target: { value: "0" } });
    expect(p.onChange).toHaveBeenLastCalledWith({ rowGap: 0 }, "pagegrid:rowGap");
  });

  it("G-3b (5): a site that set G-2's one gap keeps it in the direction NOT moved, and 'back to default' clears one only", () => {
    const p = panel({ grid: { blockGap: 24 } });
    expect(screen.getByLabelText("Space between columns")).toHaveValue("24");
    expect(screen.getByLabelText("Space between rows")).toHaveValue("24");
    fireEvent.change(screen.getByLabelText("Space between columns"), { target: { value: "8" } });
    expect(p.onChange).toHaveBeenLastCalledWith({ columnGap: 8, rowGap: 24 }, "pagegrid:columnGap");
    fireEvent.click(screen.getByRole("button", { name: "Space between rows — back to default" }));
    expect(p.onChange).toHaveBeenLastCalledWith({ columnGap: 24 }, "pagegrid:rowGap");
  });

  it("this page's own grid, Reset, and Escape returning focus", () => {
    const p = panel();
    fireEvent.click(screen.getByLabelText("This page uses its own grid"));
    expect(p.onOwnPage).toHaveBeenCalledWith(true);
    fireEvent.click(screen.getByRole("button", { name: "Reset to default" }));
    expect(p.onChange).toHaveBeenCalledWith(undefined);
    fireEvent.keyDown(screen.getByRole("dialog", { name: "Page grid" }), { key: "Escape" });
    expect(p.onClose).toHaveBeenCalled();
  });

  it("row lines are a viewing choice; the row step shows only with them", () => {
    const p = panel();
    expect(screen.queryByLabelText("Row step")).toBeNull();
    fireEvent.click(screen.getByLabelText("Row lines in the guides"));
    expect(p.onRows).toHaveBeenCalledWith(true);
  });
});

describe("the layout guides on the canvas", () => {
  const canvas = (guides: Parameters<typeof BoxCanvas>[0]["guides"], root = emptyPageRoot()) =>
    render(<BoxCanvas root={root} theme={DEFAULT_THEME} onChange={() => {}} guides={guides} />).container;

  it.each([6, 12, 16])("draws %i columns from the one template, EDGE TO EDGE, the side space shaded inside the first and last (G-3 (1))", (cols) => {
    const g = canvas({ cols, rowStepRem: 1.5, rows: false }).querySelector<HTMLElement>("[data-layout-guides]")!;
    expect(g.querySelectorAll("[data-guide-col]")).toHaveLength(cols);
    expect(g.style.gridTemplateColumns).toBe(`repeat(${cols}, minmax(0, 1fr))`);
    expect(g.style.paddingInline).toBe(""); // the columns run to the page's edges
    expect(g.style.backgroundImage).toContain(`0 ${FRAME_CSS}`); // …and the default margin is drawn inside them
    expect(g.getAttribute("aria-hidden")).toBe("true");
    expect(g.style.pointerEvents).toBe("none");
  });

  it("the side strips follow the site's own side space", () => {
    const root = { ...emptyPageRoot(), gridSpace: { gutter: 0 } };
    const g = canvas({ cols: 12, rowStepRem: 1.5, rows: true }, root).querySelector<HTMLElement>("[data-layout-guides]")!;
    expect(g.style.backgroundImage).toContain(`0 ${u(pageSideSpace(root))}`);
    expect(g.dataset.rowStep).toBe("1.5"); // the row lines: drawn on screen pixels from this step (G3-7)
  });

  it("G2-2 · the strips are measured in the page's own unit, not a fallback (23px on every screen in the HEADED UAT)", () => {
    const root = { ...emptyPageRoot(), baseFont: 12 };
    const g = canvas({ cols: 12, rowStepRem: 1.5, rows: false }, root).querySelector<HTMLElement>("[data-layout-guides]")!;
    expect(g.style.getPropertyValue("--box-u")).toBe(baseUnit(12));
  });

  it("G3-5 / G3-7 · the in-page guides draw no lines of their own (they are drawn on whole screen pixels by GuideLines)", () => {
    const g = canvas({ cols: 12, rowStepRem: 1.5, rows: true }).querySelector<HTMLElement>("[data-layout-guides]")!;
    expect(g.querySelector<HTMLElement>("[data-guide-col]")!.getAttribute("style")).toBeNull();
    expect(g.style.backgroundImage).not.toContain("repeating-linear-gradient");
    expect(g.dataset.rowStep).toBe("1.5");
  });

  it("off: nothing drawn", () => {
    expect(canvas(null).querySelector("[data-layout-guides]")).toBeNull();
  });

  it.each(["light", "dark", "midnight", "purple"])("on the %s website theme the lines show (≥ 3:1) and the chip reads (≥ 4.5:1)", (id) => {
    const bg = resolveSiteTheme(DEFAULT_THEME, id).background;
    const c = guideColor(bg);
    expect(contrastRatio(c, bg)).toBeGreaterThanOrEqual(3);
    expect(contrastRatio(guideInk(c), c)).toBeGreaterThanOrEqual(4.5);
  });
});

describe("G-3 (3) · Alt ← / → on a column of a page row", () => {
  const page = () => {
    const cols = ["50%", "50%"].map((w) => createContainer("column", { width: w, children: [blockForKind("text")] } as Partial<BoxNode>));
    return markPageGrid(normalizeRowBands({ ...emptyPageRoot(), children: [makeRowBand(cols)] } as BoxNode));
  };
  it.each([[{ key: "ArrowRight" }, "58.33%", "7 of 12 columns"], [{ key: "ArrowLeft" }, "41.67%", "5 of 12 columns"], [{ key: "ArrowRight", shiftKey: true }, "54.17%", "6½ of 12 columns"]])(
    "%o → %s, and a screen reader hears \"%s\"", (keys, width, said) => {
      const root = page(); const a = root.children![0].children![0]; const onChange = vi.fn();
      const { container } = render(<BoxCanvas root={root} theme={DEFAULT_THEME} selectedIds={[a.id]} onSelectIds={() => {}} onChange={onChange} pageGrid={{ columns: 12 }} />);
      fireEvent.keyDown(document, { ...keys, altKey: true });
      const next = onChange.mock.calls[0][0] as BoxNode;
      expect(next.children![0].children![0].width).toBe(width);
      expect(container.querySelector('[role="status"][aria-live="polite"]')!.textContent).toBe(said);
    });
  it("G3-3 · it works while a toolbar button still holds the focus (the click on the block kept it there)", () => {
    const root = page(); const a = root.children![0].children![0]; const onChange = vi.fn();
    render(<><button>Mobile</button><BoxCanvas root={root} theme={DEFAULT_THEME} selectedIds={[a.id]} onSelectIds={() => {}} onChange={onChange} pageGrid={{ columns: 12 }} /></>);
    screen.getByRole("button", { name: "Mobile" }).focus();
    fireEvent.keyDown(document, { key: "ArrowRight", altKey: true });
    expect((onChange.mock.calls[0]?.[0] as BoxNode | undefined)?.children![0].children![0].width).toBe("58.33%");
  });
  it("without the page grid nothing happens", () => {
    const root = page(); const a = root.children![0].children![0]; const onChange = vi.fn();
    render(<BoxCanvas root={root} theme={DEFAULT_THEME} selectedIds={[a.id]} onSelectIds={() => {}} onChange={onChange} />);
    fireEvent.keyDown(document, { key: "ArrowRight", altKey: true });
    expect(onChange).not.toHaveBeenCalled();
  });
});
