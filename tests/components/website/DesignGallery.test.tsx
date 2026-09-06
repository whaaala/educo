import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import BoxInspector from "@/components/website/box/BoxInspector";
import DesignGallery from "@/components/website/box/DesignGallery";
import { DEFAULT_THEME } from "@/lib/site-storage";
import { createComponent, createContainer, type BoxNode } from "@/lib/box-model";
import { blockForKind } from "@/lib/box-presets";
import { ALL_COMPONENTS, presetVariants } from "@/lib/component-catalogue";

/**
 * RULE S — every component SHOWS its designs instead of naming them.
 *
 * The Alert listed "Soft · Solid · Outline · Left accent · Top accent · Card · Glass" as plain text chips, which
 * asks the user to imagine each result and click to find out. The accordion had solved this properly a while
 * back with real markup scaled into a thumbnail; the Alert, the registry components and the tree presets never
 * got it. These tests hold the shared gallery to that bar for EVERY component, so a future one cannot quietly
 * ship a wall of text chips.
 */

const openContent = () => fireEvent.click(screen.getByRole("tab", { name: "Content" }));

function renderFor(node: BoxNode) {
  const onPatch = vi.fn();
  render(<BoxInspector node={node} theme={DEFAULT_THEME} onPatch={onPatch} />);
  return onPatch;
}

describe("DesignGallery (shared)", () => {
  const groups = [
    { items: [
      { id: "", label: "Soft", preview: (size: string) => <span data-testid={`p-soft-${size}`} /> },
      { id: "--solid", label: "Solid", preview: (size: string) => <span data-testid={`p-solid-${size}`} /> },
    ] },
  ];

  it("shows the APPLIED design large, so what is selected is always visible", () => {
    render(<DesignGallery value="--solid" onPick={() => {}} groups={groups} ariaLabel="Test designs" />);
    // the hero slot asks for the bigger preview of the design that is currently on
    expect(screen.getByTestId("p-solid-hero")).toBeInTheDocument();
    expect(screen.getByText("Applied")).toBeInTheDocument();
    expect(screen.queryByTestId("p-soft-hero")).not.toBeInTheDocument();
  });

  it("falls back to the first design when the applied one is unknown", () => {
    render(<DesignGallery value="--nope" onPick={() => {}} groups={groups} ariaLabel="Test designs" />);
    expect(screen.getByTestId("p-soft-hero")).toBeInTheDocument();
  });

  it("renders a PREVIEW for every option, not just a label", () => {
    render(<DesignGallery value="" onPick={() => {}} groups={groups} ariaLabel="Test designs" />);
    expect(screen.getByTestId("p-soft-tile")).toBeInTheDocument();
    expect(screen.getByTestId("p-solid-tile")).toBeInTheDocument();
  });

  it("marks the applied design for assistive tech and reports the pick", () => {
    const onPick = vi.fn();
    render(<DesignGallery value="" onPick={onPick} groups={groups} ariaLabel="Test designs" />);
    expect(screen.getByRole("button", { name: "Soft design" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Solid design" })).toHaveAttribute("aria-pressed", "false");
    fireEvent.click(screen.getByRole("button", { name: "Solid design" }));
    expect(onPick).toHaveBeenCalledWith("--solid");
  });

  it("labels each group so a long gallery stays navigable", () => {
    render(<DesignGallery value="" onPick={() => {}} ariaLabel="Test designs"
      groups={[{ group: "Signature", items: groups[0].items }]} />);
    expect(screen.getByRole("group", { name: "Signature — Test designs" })).toBeInTheDocument();
  });
});

describe("RULE S — every component shows its designs", () => {
  /**
   * A design tile is a button whose accessible name ends in "design". The STYLE PRESETS row uses the same
   * gallery — and therefore the same tile shape — so it is excluded here: this block is about the COMPONENT
   * gallery, and counting both together silently inflated every expectation.
   */
  const designTiles = () => {
    const styles = screen.queryByRole("group", { name: "Style presets" });
    return screen
      .queryAllByRole("button")
      .filter((b) => /design$/.test(b.getAttribute("aria-label") ?? ""))
      .filter((b) => !styles || !styles.contains(b));
  };

  for (const component of ALL_COMPONENTS) {
    it(`${component}: offers a gallery of previews rather than text chips`, () => {
      cleanup();
      const node = component === "accordion" || component === "alert"
        ? createComponent(component, { id: "n", items: [{ id: "i1", title: "Heads up", body: "A message." }] } as Partial<BoxNode>)
        : ({ ...blockForKind(component), id: "n" } as BoxNode);

      renderFor(node);
      openContent();

      const tiles = designTiles();
      const expected = node.type === "component" ? null : presetVariants(component).length;
      expect(tiles.length, `${component} must offer designs`).toBeGreaterThan(1);
      if (expected) expect(tiles.length).toBe(expected);

      // Each tile must actually SHOW something — a label alone is the thing this rule exists to prevent.
      for (const tile of tiles) {
        const preview = tile.firstElementChild;
        expect(preview?.childElementCount, `${component}: "${tile.getAttribute("aria-label")}" needs a preview`)
          .toBeGreaterThan(0);
      }
    });
  }

  it("STYLE PRESETS are shown too, with the block's CURRENT look as the reference", () => {
    // The same rule, a different control. The Styles row listed "Plain · Card · Outline · Tinted" as chips and
    // passed `chipCls(false)` for every one, so it could not even show which look was on. A preset is a one-shot
    // patch with nothing recording it, so the hero shows the block as it is NOW and each tile shows what that
    // style would make of it.
    cleanup();
    const section = createContainer("column", { id: "s", width: "100%", padding: 24 });
    const onPatch = renderFor(section);

    const group = screen.getByRole("group", { name: "Style presets" });
    const tiles = [...group.querySelectorAll("button")];
    expect(tiles.length, "a container offers style presets").toBeGreaterThan(1);
    for (const tile of tiles) {
      expect(tile.firstElementChild?.childElementCount, `"${tile.textContent}" needs a preview`).toBeGreaterThan(0);
    }
    expect(screen.getByText("Now")).toBeInTheDocument();   // the hero is the block itself, not a claimed selection

    fireEvent.click(screen.getByRole("button", { name: "Card style" }));
    expect(onPatch).toHaveBeenCalledWith(expect.objectContaining({ shadow: "md" }));
  });

  it("the inspector names what the user actually selected, not what it is made of", () => {
    // A Card is structurally a container, so the header read "Editing: Section" — telling a user they had
    // picked something they had not. RULE V: found while auditing, fixed in the same change.
    for (const component of ALL_COMPONENTS) {
      cleanup();
      const node = component === "accordion" || component === "alert"
        ? createComponent(component, { id: "n", items: [{ id: "i1", title: "T", body: "B" }] } as Partial<BoxNode>)
        : ({ ...blockForKind(component), id: "n" } as BoxNode);
      renderFor(node);
      const label = screen.getByText(/^Editing:/).textContent ?? "";
      const expected = component.charAt(0).toUpperCase() + component.slice(1);
      expect(label, `${component} should be named, not called a Section`).toContain(expected);
    }
  });

  it("a plain container is still called a Section", () => {
    // The fallback must survive: only a catalogue component gets its own name.
    cleanup();
    renderFor(createContainer("column", { id: "plain", width: "100%" }));
    expect(screen.getByText(/^Editing:/).textContent).toContain("Section");
  });

  it("the applied design is previewed at hero size for a component too", () => {
    cleanup();
    renderFor(createComponent("alert", { id: "n", alertSeverity: "info", variant: "--solid",
      items: [{ id: "i1", title: "Heads up", body: "A message." }] } as Partial<BoxNode>));
    openContent();
    expect(screen.getByText("Applied")).toBeInTheDocument();
  });
});
