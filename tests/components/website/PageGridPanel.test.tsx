import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import PageGridPanel from "@/components/website/box/PageGridPanel";
import BoxCanvas from "@/components/website/box/BoxCanvas";
import { DEFAULT_THEME } from "@/lib/site-storage";
import { u, pageSideSpace, SPACE_GRID, baseUnit } from "@/lib/box-model";
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
    expect(screen.getByText(/Default · 1.44rem/)).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Side space (padding)"), { target: { value: "0" } });
    expect(p.onChange).toHaveBeenCalledWith({ sideSpace: 0 }, "pagegrid:side");
    expect(screen.getAllByRole("button", { name: "At the default" })).toHaveLength(2);
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

  it.each([6, 12, 16])("draws %i columns from the one template, the side space as padding", (cols) => {
    const g = canvas({ cols, rowStepRem: 1.5, rows: false }).querySelector<HTMLElement>("[data-layout-guides]")!;
    expect(g.querySelectorAll("[data-guide-col]")).toHaveLength(cols);
    expect(g.style.gridTemplateColumns).toBe(`repeat(${cols}, minmax(0, 1fr))`);
    expect(g.style.paddingInline).toBe(u(SPACE_GRID.gutter));
    expect(g.getAttribute("aria-hidden")).toBe("true");
    expect(g.style.pointerEvents).toBe("none");
  });

  it("the side strips follow the site's own side space", () => {
    const root = { ...emptyPageRoot(), gridSpace: { gutter: 0 } };
    const g = canvas({ cols: 12, rowStepRem: 1.5, rows: true }, root).querySelector<HTMLElement>("[data-layout-guides]")!;
    expect(g.style.paddingInline).toBe(u(pageSideSpace(root)));
    expect(g.style.backgroundImage).toContain("repeating-linear-gradient"); // the row lines
  });

  it("G2-2 · the strips are measured in the page's own unit, not a fallback (23px on every screen in the HEADED UAT)", () => {
    const root = { ...emptyPageRoot(), baseFont: 12 };
    const g = canvas({ cols: 12, rowStepRem: 1.5, rows: false }, root).querySelector<HTMLElement>("[data-layout-guides]")!;
    expect(g.style.getPropertyValue("--box-u")).toBe(baseUnit(12));
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
