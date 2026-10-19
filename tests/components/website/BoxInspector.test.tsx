import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, cleanup, within, waitFor } from "@testing-library/react";
import BoxInspector from "@/components/website/box/BoxInspector";
import { DEFAULT_THEME } from "@/lib/site-storage";
import { createContainer, createElement, createComponent, fluidRemRange, type BoxNode } from "@/lib/box-model";
import userEvent from "@testing-library/user-event";
import LAYOUT from "@/config/layout.json";
import { SPACE_STEPS } from "@/lib/educo-ui/tokens";
import INSPECTOR_WORDS from "@/config/inspector.json";

// FL-3b (LE-13b): jsdom draws no canvas, so the outline tracer answers for it — the tracing itself is tests/unit/flow.test.ts
const TRACED = "polygon(40% 0%, 60% 0%, 80% 50%, 60% 100%, 40% 100%, 20% 50%)";
vi.mock("@/lib/box-model", async (real) => ({ ...(await real<typeof import("@/lib/box-model")>()), traceOutline: vi.fn(async (src: string) => (src === "untraceable.png" ? undefined : TRACED)) }));

function renderFor(node: BoxNode, extra: Record<string, unknown> = {}) {
  const onPatch = vi.fn();
  render(<BoxInspector node={node} theme={DEFAULT_THEME} onPatch={onPatch} {...extra} />);
  return onPatch;
}
const openContent = () => fireEvent.click(screen.getByRole("tab", { name: "Content" }));
const openDevice = () => fireEvent.click(screen.getByRole("tab", { name: "Per-device" }));

describe("BoxInspector — Accordion component editing (Content tab)", () => {
  const acc = () => createComponent("accordion", { id: "a", items: [
    { id: "i1", title: "Q1", body: "A1" }, { id: "i2", title: "Q2", body: "A2" },
  ] } as Partial<BoxNode>);

  it("changes the accordion design from the visual picker", () => {
    const onPatch = renderFor(acc());
    openContent();
    fireEvent.click(screen.getByRole("button", { name: "Solid panel design" }));
    expect(onPatch).toHaveBeenCalledWith({ variant: "--panel" });
    // every design is offered
    expect(screen.getByRole("button", { name: "Horizontal design" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Dark glossy design" })).toBeInTheDocument();
  });

  it("toggles multi-open and adds an item", () => {
    const onPatch = renderFor(acc());
    openContent();
    fireEvent.click(screen.getByLabelText("Allow more than one open at once"));
    expect(onPatch).toHaveBeenCalledWith({ accMultiOpen: true });
    fireEvent.click(screen.getByRole("button", { name: "Add item" }));
    expect(onPatch).toHaveBeenCalledWith(expect.objectContaining({ items: expect.arrayContaining([expect.objectContaining({ title: "New question" })]) }));
  });

  it("toggles the opt-in 'Expand all / Collapse all' controls", () => {
    const onPatch = renderFor(acc());
    openContent();
    fireEvent.click(screen.getByLabelText(/Expand all/));
    expect(onPatch).toHaveBeenCalledWith({ accShowAll: true });
  });

  it("edits an item title; remove is enabled with two items", () => {
    const onPatch = renderFor(acc());
    openContent();
    fireEvent.change(screen.getByLabelText("Item 1 title"), { target: { value: "Changed" } });
    expect(onPatch).toHaveBeenCalledWith(expect.objectContaining({ items: expect.arrayContaining([expect.objectContaining({ title: "Changed" })]) }));
    expect(screen.getByLabelText("Remove item 1")).not.toBeDisabled();
  });

  it("edits a per-item Advanced CSS override (each item can override any CSS)", () => {
    const onPatch = renderFor(acc());
    openContent();
    fireEvent.change(screen.getByLabelText("Item 1 CSS"), { target: { value: "background: #fef3c7;" } });
    expect(onPatch).toHaveBeenCalledWith(expect.objectContaining({ items: expect.arrayContaining([expect.objectContaining({ css: "background: #fef3c7;" })]) }));
  });

  it("cannot remove the last remaining item", () => {
    renderFor(createComponent("accordion", { id: "a2", items: [{ id: "i1", title: "only", body: "b" }] } as Partial<BoxNode>));
    openContent();
    expect(screen.getByLabelText("Remove item 1")).toBeDisabled();
  });

  it("re-skins the component through design-token colour overrides", () => {
    const onPatch = renderFor(acc());
    openContent();
    fireEvent.click(screen.getByRole("button", { name: "Component colours" })); // expand the section
    // ColorRow drives ColorPickerPopover; assert the section + reset wiring exist by editing advanced CSS instead
    fireEvent.click(screen.getByRole("button", { name: "Advanced CSS" }));
    fireEvent.change(screen.getByLabelText("Advanced CSS"), { target: { value: "letter-spacing: .02em;" } });
    expect(onPatch).toHaveBeenCalledWith({ advancedCss: "letter-spacing: .02em;" });
  });
});

describe("BoxInspector — styling primitives (Design tab)", () => {
  it("edits border width, shadow strength and tilt", () => {
    const onPatch = renderFor(createContainer("column", { id: "b" } as Partial<BoxNode>));
    fireEvent.change(screen.getByLabelText("Border"), { target: { value: "4" } });
    expect(onPatch).toHaveBeenCalledWith({ borderWidth: 4 });
    fireEvent.click(screen.getByRole("button", { name: "Strong" }));
    expect(onPatch).toHaveBeenCalledWith({ shadow: "lg" }); // "Strong" → lg under the hood
    fireEvent.change(screen.getByLabelText("Tilt"), { target: { value: "30" } });
    expect(onPatch).toHaveBeenCalledWith({ rotate: 30 });
  });

  it("edits a single rounded corner (per-corner override)", () => {
    const onPatch = renderFor(createContainer("column", { id: "b", radius: 8 } as Partial<BoxNode>));
    fireEvent.change(screen.getByLabelText("Rounded corner top-left"), { target: { value: "0" } });
    expect(onPatch).toHaveBeenCalledWith({ radiusTopLeft: 0 });
  });

  it("exposes grid cell span only when the box is inside a grid", () => {
    const onPatch = renderFor(createContainer("column", { id: "c" } as Partial<BoxNode>), { inGrid: true });
    fireEvent.change(screen.getByLabelText("Columns wide"), { target: { value: "2" } });
    expect(onPatch).toHaveBeenCalledWith({ colSpan: 2 });
  });

  // R4-2 (BATCH P-0): the cell's "Line up (across)" and the nine squares both place the cell across; the squares used to
  // win silently, so "Left" did nothing while the control said "Left". Whichever is used last wins, and both show it.
  // LE-4: the cell's own "Line up (across)" folded into the Position section's Across row — one control, still in step.
  it("keeps the cell's Across and the nine squares in step (R4-2, LE-4)", () => {
    const onPatch = renderFor(createContainer("column", { id: "c", placeX: "center", placeY: "center", justifySelf: "end" } as Partial<BoxNode>), { inGrid: true });
    expect(screen.queryByRole("button", { name: "Line up (across)" })).toBeNull(); // no second control for the same thing
    const across = screen.getByRole("group", { name: "Across" });
    expect(within(across).getByRole("button", { name: "Middle" })).toHaveAttribute("aria-pressed", "true"); // the squares' choice, not the stale "end"
    fireEvent.click(within(across).getByRole("button", { name: "Start" }));
    expect(onPatch).toHaveBeenLastCalledWith({ placeX: "start", justifySelf: undefined, push: undefined });
    cleanup();
    renderFor(createContainer("column", { id: "c", justifySelf: "end" } as Partial<BoxNode>), { inGrid: true });
    expect(within(screen.getByRole("group", { name: "Across" })).getByRole("button", { name: "End" })).toHaveAttribute("aria-pressed", "true"); // a saved cell's place reads as its Across
    cleanup();
    const onSquare = renderFor(createContainer("column", { id: "c", justifySelf: "end" } as Partial<BoxNode>), { inGrid: true });
    fireEvent.click(screen.getByRole("button", { name: "Top left" }));
    expect(onSquare).toHaveBeenLastCalledWith({ placeX: "start", placeY: "start", justifySelf: undefined, push: undefined }); // a square clears it the other way
  });

  // R4-4 (BATCH P-0): `align-items` moves blocks DOWN in a side-by-side row and in a grid — measured, "End" moved the
  // words 236px down and 0 across while the label said "across".
  it("names the direction the container's 'Line up' really moves (R4-4)", () => {
    const label = (node: BoxNode) => { renderFor(node); const t = screen.getByRole("button", { name: "Line up" }).closest("label, div")?.textContent ?? ""; cleanup(); return t; };
    expect(label(createContainer("column", { id: "s" } as Partial<BoxNode>))).toMatch(/Line up \(across\)/);
    expect(label(createContainer("row", { id: "r" } as Partial<BoxNode>))).toMatch(/Line up \(down\)/);
    expect(label(createContainer("column", { id: "g", layout: "grid", columns: 3 } as Partial<BoxNode>))).toMatch(/Line up \(down\)/);
  });

  // R4-5 (BATCH P-0): a typed "300px" and the picture's "don't crop" toggle stored pixels that reached the page.
  it("stores rem, never px, from the Height field and the picture toggle (R4-5)", () => {
    const onPatch = renderFor(createElement("text", { id: "t" } as Partial<BoxNode>));
    fireEvent.change(screen.getByLabelText("Height"), { target: { value: "300px" } });
    expect(onPatch).toHaveBeenLastCalledWith({ height: "18.75rem", contentScale: undefined });
    cleanup();
    const onImg = renderFor(createElement("image", { id: "i", height: "auto", src: "data:image/png;base64,AA==", imgW: 800, imgH: 600 } as Partial<BoxNode>)); openContent();
    fireEvent.click(screen.getByRole("checkbox", { name: /Show the whole picture/ }));
    expect(onImg).toHaveBeenLastCalledWith({ height: "16.25rem" });
  });

  // R4-3 (BATCH P-0): Floating (and its front / back order) changes every screen; while another screen is edited the
  // control says so, and the Per-device promise says "except a control marked every screen".
  it("says 'every screen' on structural controls while another screen is edited (R4-3)", () => {
    renderFor(createElement("text", { id: "t" } as Partial<BoxNode>), { breakpoint: "phone" });
    expect(screen.getAllByRole("note").some((n) => /Applies to every screen, not only/.test(n.textContent ?? ""))).toBe(true);
    cleanup();
    renderFor(createElement("text", { id: "t" } as Partial<BoxNode>), { breakpoint: "base" });
    expect(screen.queryAllByRole("note").some((n) => /Applies to every screen/.test(n.textContent ?? ""))).toBe(false);
  });

  it("hides grid span controls when NOT in a grid", () => {
    renderFor(createContainer("column", { id: "c" } as Partial<BoxNode>), { inGrid: false });
    expect(screen.queryByLabelText("Columns wide")).not.toBeInTheDocument();
  });

  it("uses plain-language layout labels (Free arrange / Grid, Top-to-bottom / Side-by-side)", () => {
    const onPatch = renderFor(createContainer("column", { id: "c" } as Partial<BoxNode>));
    fireEvent.click(screen.getByRole("button", { name: "Grid" }));
    expect(onPatch).toHaveBeenCalledWith({ layout: "grid" });
  });

  it("shows a Styles gallery of variations that apply a whole look in one tap", () => {
    // Style presets moved onto the shared DesignGallery (RULE S), so tiles are named the same way in every
    // gallery — "<name> design" — instead of "Style <name>" here and something else elsewhere.
    const onPatch = renderFor(createElement("button", { id: "b", text: "Go" } as Partial<BoxNode>));
    fireEvent.click(screen.getByLabelText("Outline style"));
    expect(onPatch).toHaveBeenCalledWith(expect.objectContaining({ borderWidth: expect.any(Number), borderColor: expect.any(String) }));
  });

  it("the icon picker has a search box that filters the library", () => {
    renderFor(createElement("icon", { id: "i" } as Partial<BoxNode>));
    openContent();
    fireEvent.click(screen.getByLabelText("Icon")); // open the reusable IconPicker popover
    // a broad library is searchable
    fireEvent.change(screen.getByLabelText("Search icons"), { target: { value: "rocket" } });
    expect(screen.getByLabelText("Rocket")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Search icons"), { target: { value: "heart" } });
    expect(screen.getByLabelText("Heart")).toBeInTheDocument();
    expect(screen.queryByLabelText("Rocket")).not.toBeInTheDocument(); // filtered out
  });
});

describe("BoxInspector — content types & links (Content tab)", () => {
  it("shows typography controls for a text element and patches them", () => {
    const onPatch = renderFor(createElement("text", { id: "t", text: "Hi" } as Partial<BoxNode>));
    openContent();
    fireEvent.change(screen.getByLabelText("Line spacing"), { target: { value: "1.6" } });
    expect(onPatch).toHaveBeenCalledWith({ lineHeight: 1.6 });
    fireEvent.change(screen.getByLabelText("Letter spacing"), { target: { value: "1.5" } });
    expect(onPatch).toHaveBeenCalledWith({ letterSpacing: 1.5 });
    fireEvent.click(screen.getByLabelText("Italic"));
    expect(onPatch).toHaveBeenCalledWith({ italic: true });
    fireEvent.click(screen.getByLabelText("Underline"));
    expect(onPatch).toHaveBeenCalledWith({ underline: true });
  });

  it("edits a video link", () => {
    const onPatch = renderFor(createElement("video", { id: "v" } as Partial<BoxNode>));
    openContent();
    fireEvent.change(screen.getByLabelText("Video URL"), { target: { value: "https://youtu.be/abc" } });
    expect(onPatch).toHaveBeenCalledWith({ src: "https://youtu.be/abc" });
  });

  it("edits embed code", () => {
    const onPatch = renderFor(createElement("embed", { id: "e" } as Partial<BoxNode>));
    openContent();
    fireEvent.change(screen.getByLabelText("Embed code"), { target: { value: "<iframe></iframe>" } });
    expect(onPatch).toHaveBeenCalledWith({ html: "<iframe></iframe>" });
  });

  it("edits list items (one per line) and marker style", () => {
    const onPatch = renderFor(createElement("list", { id: "l" } as Partial<BoxNode>));
    openContent();
    fireEvent.change(screen.getByLabelText("List items"), { target: { value: "a\nb\nc" } });
    expect(onPatch).toHaveBeenCalledWith({ listItems: ["a", "b", "c"] });
    fireEvent.click(screen.getByRole("button", { name: "Numbered" }));
    expect(onPatch).toHaveBeenCalledWith({ listStyle: "number" });
  });

  it("picks an icon", () => {
    const onPatch = renderFor(createElement("icon", { id: "i" } as Partial<BoxNode>));
    openContent();
    fireEvent.click(screen.getByLabelText("Icon")); // open the reusable IconPicker popover
    fireEvent.change(screen.getByLabelText("Search icons"), { target: { value: "heart" } });
    fireEvent.click(screen.getByLabelText("Heart"));
    expect(onPatch).toHaveBeenCalledWith({ icon: "Heart" });
  });

  it("sets a button link target + new-tab, and a bookmark name on any box", () => {
    const onPatch = renderFor(createElement("button", { id: "b", text: "Go" } as Partial<BoxNode>));
    openContent();
    fireEvent.change(screen.getByLabelText("Bookmark name"), { target: { value: "My Section" } });
    expect(onPatch).toHaveBeenCalledWith({ anchor: "my-section" }); // slugified
    fireEvent.click(screen.getByLabelText("Open in a new tab"));
    expect(onPatch).toHaveBeenCalledWith({ newTab: true });
  });

  it("links a button to another PAGE via the page picker", () => {
    const onPatch = renderFor(createElement("button", { id: "b", text: "Go" } as Partial<BoxNode>), {
      pages: [{ id: "home", name: "Home" }, { id: "about", name: "About" }],
      currentPageId: "home",
    });
    openContent();
    fireEvent.click(screen.getByLabelText("Link to page")); // open the custom dropdown
    expect(screen.queryByRole("option", { name: "Home" })).not.toBeInTheDocument(); // current page excluded
    fireEvent.click(screen.getByRole("option", { name: "About" }));
    expect(onPatch).toHaveBeenCalledWith({ href: "page:about" });
  });
});

describe("BoxInspector — per-device", () => {
  it("shows a breakpoint banner + reset when editing a non-base breakpoint with an override", () => {
    const onReset = vi.fn();
    renderFor(createContainer("column", { id: "c" } as Partial<BoxNode>), { breakpoint: "phone", overridden: true, onResetOverride: onReset });
    expect(screen.getByText(/Editing Phone/)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/Reset phone changes/));
    expect(onReset).toHaveBeenCalled();
  });

  it("has no breakpoint banner on the base", () => {
    renderFor(createContainer("column", { id: "c" } as Partial<BoxNode>), { breakpoint: "base" });
    expect(screen.queryByText(/Editing Phone|Editing Tablet/)).not.toBeInTheDocument();
  });

  it("toggles hidden (labelled per breakpoint) in the Per-device tab", () => {
    const onPatch = renderFor(createContainer("column", { id: "c" } as Partial<BoxNode>), { breakpoint: "phone" });
    openDevice();
    fireEvent.click(screen.getByLabelText(/Hidden on phone/));
    expect(onPatch).toHaveBeenCalledWith({ hidden: true });
  });
});

// ── Functionality AUDIT: every core control fires the right patch. Because these controls are shared across
//    all block/component types, verifying them here proves they work for every current AND future component. ──
describe("BoxInspector — functionality audit (controls act)", () => {
  const heading = () => createElement("heading", { id: "h", text: "Hi" } as Partial<BoxNode>);

  it("Design › Width: Full / Fit fire the width patch", () => {
    const onPatch = renderFor(heading());
    fireEvent.click(screen.getByRole("button", { name: "Full" }));
    expect(onPatch).toHaveBeenCalledWith(expect.objectContaining({ width: "fill" }));
    fireEvent.click(screen.getByRole("button", { name: "Fit" }));
    expect(onPatch).toHaveBeenCalledWith(expect.objectContaining({ width: "auto" }));
  });

  it("Design › Outline & effects: Rounded/Border/Tilt/See-through sliders fire", () => {
    const onPatch = renderFor(heading());
    fireEvent.change(screen.getByLabelText("Rounded corners"), { target: { value: "12" } });
    expect(onPatch).toHaveBeenCalledWith({ radius: 12 });
    fireEvent.change(screen.getByLabelText("Border"), { target: { value: "3" } });
    expect(onPatch).toHaveBeenCalledWith({ borderWidth: 3 });
    fireEvent.change(screen.getByLabelText("Tilt"), { target: { value: "10" } });
    expect(onPatch).toHaveBeenCalledWith({ rotate: 10 });
    fireEvent.change(screen.getByLabelText("See-through"), { target: { value: "50" } });
    expect(onPatch).toHaveBeenCalledWith({ opacity: 50 });
  });

  it("Design › Spacing: Inner + Outer sliders fire padding/margin", () => {
    const onPatch = renderFor(createContainer("column", { id: "s" } as Partial<BoxNode>));
    // per-side padding/margin number inputs (rem → px)
    fireEvent.change(screen.getByLabelText("Inner spacing top"), { target: { value: "1.5" } }); // real rem (S1-b): 1.5rem = 24
    expect(onPatch).toHaveBeenCalledWith({ paddingTop: 24 });
    fireEvent.change(screen.getByLabelText("Outer spacing left"), { target: { value: "1" } }); // real rem: 1rem = 16
    expect(onPatch).toHaveBeenCalledWith({ marginLeft: 16 });
  });

  it("RX3-7: the side fields say their unit and hold to the slider's range — no negative, nothing past its max", () => {
    // Measured 2026-10-16 (HEADED): "40" stored 40rem (729.6px of padding) beside a 0–6rem slider, "-1.5" stored a
    // negative margin through a field marked min=0, and nothing said the fields were in rem.
    const onPatch = renderFor(createContainer("column", { id: "s" } as Partial<BoxNode>));
    const top = screen.getByLabelText("Inner spacing top");
    fireEvent.change(top, { target: { value: "40" } });
    expect(onPatch).toHaveBeenLastCalledWith({ paddingTop: 96 }); // the slider's max, 6rem
    fireEvent.change(screen.getByLabelText("Outer spacing top"), { target: { value: "-1.5" } });
    expect(onPatch).toHaveBeenLastCalledWith({ marginTop: 0 });
    // the unit is SEEN, and read out with the field
    const hint = document.getElementById(top.getAttribute("aria-describedby") ?? "");
    expect(hint?.textContent).toMatch(/in rem/i);
    // RX3-29: and it does not promise a fixed pixel size — a side is drawn in the fluid page unit (3 → 54.72px at 1280, 67.2 at 1920)
    expect(hint?.textContent).not.toMatch(/\d+\s*px/);
    expect(top.getAttribute("max")).toBe("6");
  });

  it("RX3-22: a row its blocks already fill says so under Position blocks — and says nothing while there is room", () => {
    // Measured HEADED 2026-10-16: blocks added with "+" store 50 % each, so End / Spread out had no room to place them and did
    // nothing, silently. The user's decision 2026-10-17: the Inspector says so, rather than overriding a width the person chose.
    const kid = (id: string, width?: string) => createContainer("column", { id, width } as Partial<BoxNode>);
    const note = /These blocks fill the row — give one a width to place them/;
    const row = (kids: BoxNode[], direction: "row" | "column" = "row") => createContainer(direction, { id: "r", children: kids } as Partial<BoxNode>);
    renderFor(row([kid("a", "50%"), kid("b", "50%")]));
    expect(screen.getByText(note)).toBeTruthy();
    cleanup(); renderFor(row([kid("a", "fill"), kid("b", "30%")]));
    expect(screen.getByText(note), "a Fill block takes all that is left").toBeTruthy();
    cleanup(); renderFor(row([kid("a", "40%"), kid("b", "30%")]));
    expect(screen.queryByText(note), "30 % is spare — End / Spread out can place them").toBeNull();
    cleanup(); renderFor(row([kid("a", "50%"), kid("b")]));
    expect(screen.queryByText(note), "a width-less block is not a claim on the row").toBeNull();
    cleanup(); renderFor(row([kid("a", "50%"), kid("b", "50%")], "column"));
    expect(screen.queryByText(note), "down a stack the widths say nothing about the room").toBeNull();
  });

  it("a Style preset applies its whole patch (Heading → Display)", () => {
    const onPatch = renderFor(heading());
    fireEvent.click(screen.getByRole("button", { name: "Display style" }));
    expect(onPatch).toHaveBeenCalled();
  });

  it("Content › Text edits heading/text/button copy", () => {
    for (const t of ["heading", "text", "button"] as const) {
      const onPatch = renderFor(createElement(t, { id: t } as Partial<BoxNode>));
      openContent();
      fireEvent.change(screen.getByLabelText("Text"), { target: { value: "Changed" } });
      expect(onPatch).toHaveBeenCalledWith({ text: "Changed" });
      cleanup();
    }
  });

  it("Content › Button: Link + open-in-new-tab fire", () => {
    const onPatch = renderFor(createElement("button", { id: "b" } as Partial<BoxNode>));
    openContent();
    fireEvent.change(screen.getByLabelText("Link"), { target: { value: "#pricing" } });
    expect(onPatch).toHaveBeenCalledWith({ href: "#pricing" });
    fireEvent.click(screen.getByLabelText("Open in a new tab"));
    expect(onPatch).toHaveBeenCalledWith({ newTab: true });
  });

  it("Content › List: style + items fire", () => {
    const onPatch = renderFor(createElement("list", { id: "l", listItems: ["a"] } as Partial<BoxNode>));
    openContent();
    fireEvent.click(screen.getByRole("button", { name: "Numbered" }));
    expect(onPatch).toHaveBeenCalledWith({ listStyle: "number" });
    fireEvent.change(screen.getByLabelText("List items"), { target: { value: "one\ntwo" } });
    expect(onPatch).toHaveBeenCalledWith({ listItems: ["one", "two"] });
  });

  it("Content › Video / Embed / Divider / Icon controls fire", () => {
    let onPatch = renderFor(createElement("video", { id: "v" } as Partial<BoxNode>));
    openContent();
    fireEvent.change(screen.getByLabelText("Video URL"), { target: { value: "https://youtu.be/x" } });
    expect(onPatch).toHaveBeenCalledWith({ src: "https://youtu.be/x" });
    cleanup();

    onPatch = renderFor(createElement("embed", { id: "e" } as Partial<BoxNode>));
    openContent();
    fireEvent.change(screen.getByLabelText("Embed code"), { target: { value: "<iframe>" } });
    expect(onPatch).toHaveBeenCalledWith({ html: "<iframe>" });
    cleanup();

    onPatch = renderFor(createElement("divider", { id: "d" } as Partial<BoxNode>));
    openContent();
    fireEvent.change(screen.getByLabelText("Thickness"), { target: { value: "5" } });
    expect(onPatch).toHaveBeenCalledWith({ borderWidth: 5 });
    cleanup();

    onPatch = renderFor(createElement("icon", { id: "i" } as Partial<BoxNode>));
    openContent();
    fireEvent.change(screen.getByLabelText("Icon size"), { target: { value: "40" } });
    expect(onPatch).toHaveBeenCalledWith({ fontSize: 40 });
  });
});

// A custom <CompactSelect> is a button + a portaled listbox: open it, then click an option.
const pickSelect = (name: string, option: string) => {
  fireEvent.click(screen.getByRole("button", { name })); // the trigger (aria-label = the field label)
  fireEvent.click(screen.getByRole("option", { name: option }));
};

describe("BoxInspector — another finish for a ready-made section (LE-15f, RF-1)", () => {
  const S = INSPECTOR_WORDS.sections;
  it("a ready-made section shows its Finish, offers the Wireframe and the seven, and choosing one asks for it", () => {
    const onChange = vi.fn();
    renderFor(createContainer("column", { id: "s", tag: "section" } as Partial<BoxNode>), { sectionFinish: { value: "calm", onChange } });
    expect(screen.getByRole("button", { name: S.finishOnPage })).toHaveTextContent("Calm");
    expect(screen.getByText(S.finishHint)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: S.finishOnPage }));
    for (const name of ["Wireframe", "Serious", "Minimalist", "Plain", "Bold", "Calm", "Startup", "Playful"]) expect(screen.getByRole("option", { name })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("option", { name: "Bold" }));
    expect(onChange).toHaveBeenCalledWith("bold");
  });

  it("a section built from blocks shows no Finish", () => {
    renderFor(createContainer("column", { id: "s", tag: "section" } as Partial<BoxNode>));
    expect(screen.queryByRole("button", { name: S.finishOnPage })).not.toBeInTheDocument();
  });
});

describe("BoxInspector — functionality audit (every remaining control)", () => {
  const heading = () => createElement("heading", { id: "h", text: "Hi" } as Partial<BoxNode>);

  // ── PLACEMENT ──
  it("Placement: Floating / In-the-layout / Lock fire their handlers", () => {
    const onFloat = vi.fn(), onUnfloat = vi.fn();
    const onPatch = renderFor(heading(), { canFloat: true, onFloat, onUnfloat });
    fireEvent.click(screen.getByRole("button", { name: "Floating" }));
    expect(onFloat).toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "In the layout" }));
    expect(onUnfloat).toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: /Lock position/ }));
    expect(onPatch).toHaveBeenCalledWith({ locked: true });
  });

  it("Placement (floating): Left% + layer buttons fire", () => {
    const onLayer = vi.fn();
    const onPatch = renderFor(createElement("heading", { id: "f", position: "absolute", left: 10, top: 10 } as Partial<BoxNode>), { canFloat: true, onLayer });
    fireEvent.change(screen.getByLabelText("Left % position"), { target: { value: "25" } });
    expect(onPatch).toHaveBeenCalledWith({ left: 25 });
    fireEvent.click(screen.getByLabelText("Bring to front"));
    expect(onLayer).toHaveBeenCalledWith("front");
    fireEvent.click(screen.getByLabelText("Send to back"));
    expect(onLayer).toHaveBeenCalledWith("back");
  });

  // ── ARRANGE (containers) ──
  it("Arrange: grid toggle, direction, position, wrap, line-up, gap fire", () => {
    const onPatch = renderFor(createContainer("column", { id: "c" } as Partial<BoxNode>));
    fireEvent.click(screen.getByRole("button", { name: "Side-by-side" }));
    expect(onPatch).toHaveBeenCalledWith({ direction: "row" });
    fireEvent.click(screen.getByLabelText("Let blocks wrap to a new line"));
    expect(onPatch).toHaveBeenCalledWith({ wrap: true });
    fireEvent.change(screen.getByLabelText("Space between blocks"), { target: { value: String(SPACE_STEPS.indexOf(20)) } }); // SP-4: the slider moves on the spacing scale
    expect(onPatch).toHaveBeenCalledWith({ gap: 20 });
    pickSelect("Position blocks", "Center");
    expect(onPatch).toHaveBeenCalledWith({ justify: "center" });
    pickSelect("Line up", "Center");
    expect(onPatch).toHaveBeenCalledWith({ align: "center" });
    fireEvent.click(screen.getByRole("button", { name: "Grid" }));
    expect(onPatch).toHaveBeenCalledWith({ layout: "grid" });
  });

  // ── THE TWELVE-COLUMN GRID (Phase 2) — tests/features/…/box-builder-columns.feature ──

  it("Arrange (grid): the named counts and the raw slider both re-cut the row", () => {
    const grid = createContainer("column", { id: "g", layout: "grid", columns: 3 } as Partial<BoxNode>);
    // With no `onRetrack` the count is a plain patch — which is what a per-device edit is.
    const onPatch = renderFor(grid);
    fireEvent.change(screen.getByLabelText("Columns in the row"), { target: { value: "4" } });
    expect(onPatch).toHaveBeenCalledWith({ columns: 4 });
    cleanup();
    // With one, BOTH controls go through it, so every child's placement comes across and the row does not move.
    const onRetrack = vi.fn();
    renderFor(grid, { onRetrack });
    fireEvent.click(screen.getByRole("button", { name: "Twelve" }));
    expect(onRetrack).toHaveBeenCalledWith(12);
    fireEvent.change(screen.getByLabelText("Columns in the row"), { target: { value: "6" } });
    expect(onRetrack).toHaveBeenCalledWith(6);
  });

  it("Arrange (grid): Position blocks writes justifyItems, NOT the flex justify", () => {
    // `justify-content` cannot move anything in a row of 1fr tracks, so the grid gets its own field. Reusing
    // `justify` would have read the `justify: "start"` every container is born with as a real choice.
    const onPatch = renderFor(createContainer("column", { id: "g", layout: "grid", columns: 3 } as Partial<BoxNode>));
    pickSelect("Position blocks", "Center");
    expect(onPatch).toHaveBeenCalledWith({ justifyItems: "center" });
  });

  it("Grid cell: width, offset, rows and per-cell alignment fire (only when inside a grid)", () => {
    const onPatch = renderFor(createContainer("column", { id: "gc" } as Partial<BoxNode>), { inGrid: true, gridTrack: 12 });
    fireEvent.change(screen.getByLabelText("Columns wide"), { target: { value: "2" } });
    expect(onPatch).toHaveBeenCalledWith({ colSpan: 2 });
    fireEvent.change(screen.getByLabelText("Rows tall"), { target: { value: "3" } });
    expect(onPatch).toHaveBeenCalledWith({ rowSpan: 3 });
    fireEvent.change(screen.getByLabelText("Start at column"), { target: { value: "5" } });
    expect(onPatch).toHaveBeenCalledWith({ colStart: 5 });
    fireEvent.change(screen.getByLabelText("Start at row"), { target: { value: "3" } });
    expect(onPatch).toHaveBeenCalledWith({ rowStart: 3 });
    fireEvent.click(within(screen.getByRole("group", { name: "Across" })).getByRole("button", { name: "End" }));
    expect(onPatch).toHaveBeenCalledWith({ placeX: "end", justifySelf: undefined, push: undefined });
    cleanup();
    // Emptying the field means auto-place after the block before it — never column 1, which would PIN a block
    // the user never pinned and quietly stack it on top of whatever already sits there.
    const cleared = renderFor(createContainer("column", { id: "gc", colStart: 5 } as Partial<BoxNode>), { inGrid: true, gridTrack: 12 });
    fireEvent.change(screen.getByLabelText("Start at column"), { target: { value: "" } });
    expect(cleared).toHaveBeenCalledWith({ colStart: undefined });
  });

  it("Grid cell: the named fractions offer only what the row can express, and report the span", () => {
    const onSetFraction = vi.fn();
    renderFor(createContainer("column", { id: "gc", colSpan: 6 } as Partial<BoxNode>), { inGrid: true, gridTrack: 12, onSetFraction });
    fireEvent.click(screen.getByRole("button", { name: "Half" }));
    expect(onSetFraction).toHaveBeenCalledWith(1, 2);
    expect(screen.getByRole("button", { name: "Half" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("6 of 12 columns")).toBeInTheDocument();
    cleanup();
    // On a DEVICE a row of thirds cannot be re-cut, so a half is not offered rather than silently rounded.
    renderFor(createContainer("column", { id: "gc" } as Partial<BoxNode>), { inGrid: true, gridTrack: 3, onSetFraction, breakpoint: "phone" });
    expect(screen.queryByRole("button", { name: "Half" })).toBeNull();
    expect(screen.getByRole("button", { name: "Third" })).toBeInTheDocument();
  });

  it("Position: the nine-point positioner and Order fire for a block in ANY container", () => {
    const onPatch = renderFor(heading());
    fireEvent.change(screen.getByLabelText("Order"), { target: { value: "-1" } });
    expect(onPatch).toHaveBeenCalledWith({ order: -1 });
    // One control, nine positions — `placeCSS` turns the pair into whatever the parent's engine needs.
    fireEvent.click(screen.getByRole("button", { name: "Bottom right" }));
    expect(onPatch).toHaveBeenCalledWith({ placeX: "end", placeY: "end" });
    fireEvent.click(screen.getByRole("button", { name: "Middle centre" }));
    expect(onPatch).toHaveBeenCalledWith({ placeX: "center", placeY: "center" });
    cleanup();
    // Clicking the CHOSEN square again clears it, so a block can go back to sitting where the layout puts it.
    const chosen = renderFor(createElement("heading", { id: "h", text: "Hi", placeX: "start", placeY: "end" } as Partial<BoxNode>));
    fireEvent.click(screen.getByRole("button", { name: "Bottom left" }));
    expect(chosen).toHaveBeenCalledWith({ placeX: undefined, placeY: undefined });
    cleanup();
    // Emptying the order returns the block to document order rather than pinning it at 0, which is a real
    // position: a sibling with order -1 would still jump ahead of it, but everything at 0 would not.
    const cleared = renderFor(createElement("heading", { id: "h", text: "Hi", order: -1 } as Partial<BoxNode>));
    fireEvent.change(screen.getByLabelText("Order"), { target: { value: "" } });
    expect(cleared).toHaveBeenCalledWith({ order: undefined });
  });

  // ── SIZE ──
  it("Size: Custom width, Height, Content position, Trim, Position-in-row fire", () => {
    const onAlignInRow = vi.fn();
    const onPatch = renderFor(heading(), { onAlignInRow, rowJustify: "start" });
    fireEvent.click(screen.getByRole("button", { name: "Custom" }));
    expect(onPatch).toHaveBeenCalledWith(expect.objectContaining({ width: expect.any(String) }));
    fireEvent.change(screen.getByLabelText("Height"), { target: { value: "300px" } });
    expect(onPatch).toHaveBeenCalledWith(expect.objectContaining({ height: "18.75rem" })); // a typed px is stored as rem (R4-5)
    fireEvent.click(screen.getByLabelText("Content middle center"));
    expect(onPatch).toHaveBeenCalledWith({ contentX: "center", contentY: "center" });
    fireEvent.click(screen.getByLabelText(/Trim to size/));
    expect(onPatch).toHaveBeenCalledWith({ clip: true });
    fireEvent.click(screen.getByRole("button", { name: "Center" }));
    expect(onAlignInRow).toHaveBeenCalledWith("center");
  });

  // ── OUTLINE ──
  it("Outline: Border style select fires", () => {
    const onPatch = renderFor(heading());
    pickSelect("Border style", "Dashed");
    expect(onPatch).toHaveBeenCalledWith({ borderStyle: "dashed" });
  });

  // ── TYPOGRAPHY (text elements) ──
  it("Typography: size, font, boldness, capitalisation, align, bold fire", () => {
    const onPatch = renderFor(createElement("text", { id: "t", text: "Hi" } as Partial<BoxNode>));
    openContent();
    fireEvent.change(screen.getByLabelText("Text size"), { target: { value: "22" } });
    expect(onPatch).toHaveBeenCalledWith({ fontSize: 22 });
    pickSelect("Boldness", "Bold");
    expect(onPatch).toHaveBeenCalledWith({ fontWeight: 700 });
    pickSelect("Capitalisation", "UPPERCASE");
    expect(onPatch).toHaveBeenCalledWith({ textTransform: "uppercase" });
    fireEvent.click(screen.getByLabelText("Align center"));
    expect(onPatch).toHaveBeenCalledWith({ textAlign: "center" });
    fireEvent.click(screen.getByLabelText("Bold"));
    expect(onPatch).toHaveBeenCalledWith(expect.objectContaining({ bold: expect.any(Boolean) }));
  });

  // ── BOOKMARK (any block) ──
  it("Bookmark name patches the anchor", () => {
    const onPatch = renderFor(heading());
    openContent();
    fireEvent.change(screen.getByLabelText("Bookmark name"), { target: { value: "Pricing Table" } });
    expect(onPatch).toHaveBeenCalledWith({ anchor: "pricing-table" });
  });

  // ── COMPONENT content slots (registry-generated, e.g. Card) ──
  it("a registry component (Card) edits its auto-generated content fields", () => {
    const onPatch = renderFor(createComponent("card", { id: "cd" } as Partial<BoxNode>));
    openContent();
    fireEvent.change(screen.getByLabelText("Title"), { target: { value: "My card" } });
    expect(onPatch).toHaveBeenCalledWith(expect.objectContaining({ componentFields: expect.objectContaining({ title: "My card" }) }));
    // and its design variants apply
    fireEvent.click(screen.getByRole("button", { name: "Raised design" }));
    expect(onPatch).toHaveBeenCalledWith({ variant: "--raised" });
  });
});

// ══ ACCORDION — FINAL AUDIT: every control in all THREE tabs acts on the component AND its items ══
describe("Accordion — full three-tab audit (Design · Content · Per-device)", () => {
  const acc = () => createComponent("accordion", { id: "a", items: [
    { id: "i1", title: "Q1", body: "A1" }, { id: "i2", title: "Q2", body: "A2" }, { id: "i3", title: "Q3", body: "A3" },
  ] } as Partial<BoxNode>);

  it("DESIGN › Placement — Floating / In-the-layout / Lock", () => {
    const onFloat = vi.fn(), onUnfloat = vi.fn();
    const onPatch = renderFor(acc(), { canFloat: true, onFloat, onUnfloat });
    fireEvent.click(screen.getByRole("button", { name: "Floating" }));      expect(onFloat).toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "In the layout" })); expect(onUnfloat).toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: /Lock position/ })); expect(onPatch).toHaveBeenCalledWith({ locked: true });
  });

  it("DESIGN › Size — Width, Position-in-row, Height, Content position, Trim", () => {
    const onAlignInRow = vi.fn();
    const onPatch = renderFor(acc(), { onAlignInRow, rowJustify: "start" });
    fireEvent.click(screen.getByRole("button", { name: "Full" }));   expect(onPatch).toHaveBeenCalledWith(expect.objectContaining({ width: "fill" }));
    fireEvent.click(screen.getByRole("button", { name: "Center" })); expect(onAlignInRow).toHaveBeenCalledWith("center");
    fireEvent.change(screen.getByLabelText("Height"), { target: { value: "320px" } }); expect(onPatch).toHaveBeenCalledWith(expect.objectContaining({ height: "20rem" })); // stored as rem (R4-5)
    fireEvent.click(screen.getByLabelText("Content middle center"));  expect(onPatch).toHaveBeenCalledWith({ contentX: "center", contentY: "center" });
    fireEvent.click(screen.getByLabelText(/Trim to size/));           expect(onPatch).toHaveBeenCalledWith({ clip: true });
  });

  it("DESIGN › Spacing — Inner + Outer (per-side)", () => {
    const onPatch = renderFor(acc());
    fireEvent.change(screen.getByLabelText("Inner spacing top"), { target: { value: "1.5" } }); expect(onPatch).toHaveBeenCalledWith({ paddingTop: 24 }); // real rem (S1-b): 1.5rem = 24
    fireEvent.change(screen.getByLabelText("Outer spacing bottom"), { target: { value: "1" } }); expect(onPatch).toHaveBeenCalledWith({ marginBottom: 16 }); // real rem: 1rem = 16
  });

  it("DESIGN › Outline & effects — rounded, per-corner, border, border-style, shadow, tilt, see-through", () => {
    const onPatch = renderFor(acc());
    fireEvent.change(screen.getByLabelText("Rounded corners"), { target: { value: "16" } });        expect(onPatch).toHaveBeenCalledWith({ radius: 16 });
    fireEvent.change(screen.getByLabelText("Rounded corner top-left"), { target: { value: "4" } }); expect(onPatch).toHaveBeenCalledWith({ radiusTopLeft: 4 });
    fireEvent.change(screen.getByLabelText("Border"), { target: { value: "2" } });                   expect(onPatch).toHaveBeenCalledWith({ borderWidth: 2 });
    pickSelect("Border style", "Dashed");                                                            expect(onPatch).toHaveBeenCalledWith({ borderStyle: "dashed" });
    fireEvent.click(screen.getByRole("button", { name: "Medium" }));                                 expect(onPatch).toHaveBeenCalledWith({ shadow: "md" });
    fireEvent.change(screen.getByLabelText("Tilt"), { target: { value: "5" } });                     expect(onPatch).toHaveBeenCalledWith({ rotate: 5 });
    fireEvent.change(screen.getByLabelText("See-through"), { target: { value: "80" } });             expect(onPatch).toHaveBeenCalledWith({ opacity: 80 });
  });

  it("CONTENT › Bookmark + design gallery + multi-open + expand-all", { timeout: 60_000 }, () => {
    const onPatch = renderFor(acc());
    openContent();
    fireEvent.change(screen.getByLabelText("Bookmark name"), { target: { value: "Our FAQ" } }); expect(onPatch).toHaveBeenCalledWith({ anchor: "our-faq" });
    fireEvent.click(screen.getByRole("button", { name: "Solid panel design" }));                 expect(onPatch).toHaveBeenCalledWith({ variant: "--panel" });
    fireEvent.click(screen.getByLabelText("Allow more than one open at once"));                   expect(onPatch).toHaveBeenCalledWith({ accMultiOpen: true });
    fireEvent.click(screen.getByLabelText(/Expand all/));                                         expect(onPatch).toHaveBeenCalledWith({ accShowAll: true });
  });

  // ~13s of real work — it drives every per-item field on several items. That is 43% of the default
  // budget, so one contended run under the full suite tipped it over and it failed while passing alone.
  // The headroom goes HERE, where the cost is, rather than widening the timeout for 2,851 fast tests.
  it("CONTENT › Items — EVERY per-item field works on ANY item (title, body, meta, image, CSS, open)", { timeout: 90_000 }, () => {
    const onPatch = renderFor(acc());
    openContent();
    const hasItem = (m: Record<string, unknown>) => expect.objectContaining({ items: expect.arrayContaining([expect.objectContaining(m)]) });
    fireEvent.change(screen.getByLabelText("Item 2 title"), { target: { value: "New Q" } });           expect(onPatch).toHaveBeenCalledWith(hasItem({ id: "i2", title: "New Q" }));
    fireEvent.change(screen.getByLabelText("Item 2 body"), { target: { value: "New A" } });            expect(onPatch).toHaveBeenCalledWith(hasItem({ id: "i2", body: "New A" }));
    fireEvent.change(screen.getByLabelText("Item 2 meta"), { target: { value: "$5" } });               expect(onPatch).toHaveBeenCalledWith(hasItem({ id: "i2", meta: "$5" }));
    fireEvent.change(screen.getByLabelText("Item 2 image"), { target: { value: "https://x/y.png" } }); expect(onPatch).toHaveBeenCalledWith(hasItem({ id: "i2", media: "https://x/y.png" }));
    fireEvent.change(screen.getByLabelText("Item 2 CSS"), { target: { value: "color: red;" } });       expect(onPatch).toHaveBeenCalledWith(hasItem({ id: "i2", css: "color: red;" }));
    fireEvent.click(screen.getAllByLabelText("Open by default")[0]);                                    expect(onPatch).toHaveBeenCalledWith(hasItem({ id: "i1", open: true }));
  });

  it("CONTENT › Items — add, remove, reorder", () => {
    const onPatch = renderFor(acc());
    openContent();
    fireEvent.click(screen.getByRole("button", { name: "Add item" }));
    expect(onPatch).toHaveBeenCalledWith(expect.objectContaining({ items: expect.arrayContaining([expect.objectContaining({ title: "New question" })]) }));
    fireEvent.click(screen.getByLabelText("Remove item 2"));
    expect(onPatch).toHaveBeenCalledWith(expect.objectContaining({ items: expect.not.arrayContaining([expect.objectContaining({ id: "i2" })]) }));
    fireEvent.click(screen.getAllByLabelText("Move item down")[0]);
    const reordered = onPatch.mock.calls.map((c) => c[0]).reverse().find((p) => p.items);
    expect(reordered.items[0].id).toBe("i2");
  });

  // CONTENT › Typography — one control per test, deliberately.
  //
  // These were a single test driving all five, and it was the slowest in the suite by a distance: every
  // control re-renders the whole inspector — every panel, every gallery preview — which costs seconds each
  // in jsdom. It grew to 23.5s alone and TIMED OUT at 30s in a full run. Raising its timeout only moved the
  // failure: one test then held its worker for ~25s without yielding and Vitest's own progress channel timed
  // out instead ("Timeout calling onTaskUpdate"), so the whole run exited non-zero with 2941 tests passing.
  // Split, each is a few seconds, the worker reports between them, and a failure names the control that broke.
  it("CONTENT › Typography — text size", () => {
    const onPatch = renderFor(acc());
    openContent();
    fireEvent.change(screen.getByLabelText("Text size"), { target: { value: "20" } });
    expect(onPatch).toHaveBeenCalledWith({ fontSize: 20 });
  });

  it("CONTENT › Typography — boldness", () => {
    const onPatch = renderFor(acc());
    openContent();
    pickSelect("Boldness", "Bold");
    expect(onPatch).toHaveBeenCalledWith({ fontWeight: 700 });
  });

  it("CONTENT › Typography — capitalisation", () => {
    const onPatch = renderFor(acc());
    openContent();
    pickSelect("Capitalisation", "UPPERCASE");
    expect(onPatch).toHaveBeenCalledWith({ textTransform: "uppercase" });
  });

  it("CONTENT › Typography — line and letter spacing", () => {
    const onPatch = renderFor(acc());
    openContent();
    fireEvent.change(screen.getByLabelText("Line spacing"), { target: { value: "1.5" } });
    expect(onPatch).toHaveBeenCalledWith({ lineHeight: 1.5 });
    fireEvent.change(screen.getByLabelText("Letter spacing"), { target: { value: "1" } });
    expect(onPatch).toHaveBeenCalledWith({ letterSpacing: 1 });
  });

  it("CONTENT › whole-component Advanced CSS (sanitised)", () => {
    const onPatch = renderFor(acc());
    openContent();
    fireEvent.click(screen.getByRole("button", { name: "Advanced CSS" }));
    fireEvent.change(screen.getByLabelText("Advanced CSS"), { target: { value: "backdrop-filter: blur(4px);" } });
    expect(onPatch).toHaveBeenCalledWith({ advancedCss: "backdrop-filter: blur(4px);" });
  });

  it("PER-DEVICE › Hidden toggle", () => {
    const onPatch = renderFor(acc());
    openDevice();
    fireEvent.click(screen.getByLabelText(/Hidden everywhere/));
    expect(onPatch).toHaveBeenCalledWith({ hidden: true });
  });

  const hasItem = (m: Record<string, unknown>) => expect.objectContaining({ items: expect.arrayContaining([expect.objectContaining(m)]) });

  it("CONTENT › Float — the toggle detaches an item (gives it a default position)", () => {
    const onPatch = renderFor(acc());
    openContent();
    fireEvent.click(screen.getByLabelText("Item 1 float"));
    expect(onPatch).toHaveBeenCalledWith(hasItem({ id: "i1", float: expect.objectContaining({ x: expect.any(Number), y: expect.any(Number) }) }));
  });

  it("CONTENT › Float — X/Y inputs drive a floated item's position (rem)", () => {
    const floated = createComponent("accordion", { id: "a", items: [
      { id: "i1", title: "Q1", body: "A1", float: { x: 4, y: 4, z: 1 } }, { id: "i2", title: "Q2", body: "A2" },
    ] } as Partial<BoxNode>);
    const onPatch = renderFor(floated);
    openContent();
    fireEvent.change(screen.getByLabelText("Item 1 float X"), { target: { value: "12" } });
    expect(onPatch).toHaveBeenCalledWith(hasItem({ id: "i1", float: expect.objectContaining({ x: 12 }) }));
    fireEvent.change(screen.getByLabelText("Item 1 float Y"), { target: { value: "8" } });
    expect(onPatch).toHaveBeenCalledWith(hasItem({ id: "i1", float: expect.objectContaining({ y: 8 }) }));
  });

  // ── EVERY design variant: the controls are variant-independent, so the audit holds for ALL 54 looks ──
  it("holds for EVERY accordion design variant (a control + an item edit fire regardless of the look)", () => {
    for (const v of ["", "--panel", "--flush", "--invert", "--timeline", "--glass", "--numbered", "--pill", "--horizontal"]) {
      const onPatch = renderFor(createComponent("accordion", { id: "a", variant: v, items: [{ id: "i1", title: "Q", body: "A" }] } as Partial<BoxNode>));
      fireEvent.change(screen.getByLabelText("Rounded corners"), { target: { value: "8" } });
      expect(onPatch).toHaveBeenCalledWith({ radius: 8 });
      openContent();
      fireEvent.change(screen.getByLabelText("Item 1 title"), { target: { value: "Z" } });
      expect(onPatch).toHaveBeenCalledWith(expect.objectContaining({ items: expect.arrayContaining([expect.objectContaining({ title: "Z" })]) }));
      cleanup();
    }
  });
});

// ══ PINNING — reachable on every block, shown as pictures, and described truthfully ══
describe("BoxInspector — Stays put while scrolling", () => {
  const heading = (extra: Partial<BoxNode> = {}) => createElement("heading", { id: "h", text: "Hi", ...extra } as Partial<BoxNode>);
  const gallery = () => screen.queryByRole("group", { name: "Stays put while scrolling" });

  it("is offered on an ELEMENT, not only a container — a heading or a button can be pinned", () => {
    // It lived under Arrange, which only containers have, so "Floats on screen" could never reach the very
    // button it exists for.
    renderFor(heading(), { canFloat: true });
    expect(gallery()).toBeInTheDocument();
  });

  it("is offered on a COMPONENT too", () => {
    renderFor(createComponent("card", { id: "c" } as Partial<BoxNode>), { canFloat: true });
    expect(gallery()).toBeInTheDocument();
  });

  it("shows each behaviour as a PICTURE, never a bare label (RULE S)", () => {
    renderFor(heading(), { canFloat: true });
    for (const name of ["Scrolls away", "Sticks when reached", "Floats on screen"]) {
      const tile = screen.getByRole("button", { name: `${name} option` });
      expect(tile.querySelector("[data-pin-preview]"), `${name} draws its before-and-after`).not.toBeNull();
    }
  });

  it("each picture is a DIFFERENT drawing (RULE T) — the moving bar sits somewhere else in every one", () => {
    const { container } = render(<BoxInspector node={heading()} theme={DEFAULT_THEME} onPatch={vi.fn()} canFloat />);
    const shapeOf = (mode: string) => [...container.querySelectorAll(`button [data-pin-preview="${mode}"] [data-pin-bar]`)]
      .map((el) => el.className).join("|");
    const shapes = ["off", "sticky", "fixed"].map(shapeOf);
    expect(new Set(shapes).size, shapes.join("  vs  ")).toBe(3);
  });

  it("picking a behaviour writes it, and Scrolls away clears both fields", () => {
    const onPatch = renderFor(heading(), { canFloat: true });
    fireEvent.click(screen.getByRole("button", { name: "Floats on screen option" }));
    expect(onPatch).toHaveBeenCalledWith({ pin: "top", hold: "fixed" });
    fireEvent.click(screen.getByRole("button", { name: "Sticks when reached option" }));
    expect(onPatch).toHaveBeenCalledWith({ pin: "top", hold: undefined });
    fireEvent.click(screen.getByRole("button", { name: "Scrolls away option" }));
    expect(onPatch).toHaveBeenCalledWith({ pin: undefined, hold: undefined });
  });

  describe("the line underneath says what THIS block will do", () => {
    const summary = () => document.querySelector("[data-pin-summary]")?.textContent ?? "";

    it("placed straight on the page, it holds for the rest of the page — not 'leaves with its section'", () => {
      renderFor(heading({ pin: "top" }), { canFloat: true, pinScope: "page" });
      expect(summary()).toMatch(/for the rest of the page/);
      expect(summary()).not.toMatch(/section/);
    });

    it("inside a block, it NAMES the block it lets go with", () => {
      renderFor(heading({ pin: "top" }), { canFloat: true, pinScope: { around: "Stack" } });
      expect(summary()).toMatch(/until the Stack around it scrolls away/);
    });

    it("beside a neighbour, it lets go with that row of blocks", () => {
      renderFor(heading({ pin: "top" }), { canFloat: true, pinScope: "row" });
      expect(summary()).toMatch(/until the row of blocks it sits in scrolls away/);
    });

    it("held to the BOTTOM it waits at the bottom until you reach it — a different behaviour, a different sentence", () => {
      renderFor(heading({ pin: "bottom" }), { canFloat: true, pinScope: "page" });
      expect(summary()).toMatch(/Waits at the bottom of the window until you scroll down to where it sits/);
    });

    it("floating on screen, it names the edge or corner and says the page runs underneath", () => {
      renderFor(heading({ pin: "bottom-right", hold: "fixed" }), { canFloat: true });
      expect(summary()).toMatch(/in the bottom-right corner of the window/);
      expect(summary()).toMatch(/page scrolls underneath it/);
    });

    it("not pinned, it scrolls with the page", () => {
      renderFor(heading(), { canFloat: true });
      expect(summary()).toBe("It scrolls with the rest of the page.");
    });
  });

  it("a FLOATING block IS offered the one that can work — floating on screen — and not the one that cannot", () => {
    // Measured: emitted as fixed, a floated block travelled 0px over a 900px scroll. Sticky is the one that
    // cannot hold a freely placed block, because it holds against a place in the flow that the block gave up.
    renderFor(heading({ position: "absolute", left: 5, top: 5 }), { canFloat: true });
    expect(screen.getByRole("button", { name: "Floats on screen option" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Sticks when reached option" })).toBeNull();
    expect(document.querySelector("[data-float-pin-note]")?.textContent).toMatch(/needs it back in the layout/);
  });

  it("picking it writes the fixed hold, and the note then says it holds where it was placed", () => {
    const onPatch = renderFor(heading({ position: "absolute", left: 5, top: 5 }), { canFloat: true });
    fireEvent.click(screen.getByRole("button", { name: "Floats on screen option" }));
    expect(onPatch).toHaveBeenCalledWith({ pin: "top", hold: "fixed" });
    cleanup();
    // Measured at the switch (box-demo writes pinX / pinY); RX4-12 keeps that place inside the window on a smaller screen.
    renderFor(heading({ position: "absolute", left: 5, top: 5, pin: "top", hold: "fixed", pinX: 40, pinY: 60 }), { canFloat: true });
    expect(document.querySelector("[data-float-pin-note]")?.textContent).toMatch(/holds where you placed it/);
  });
});

// ══ A block that floats on screen covers what is under it — said out loud, with the alternative ══
describe("BoxInspector — “Floats on screen” warns about what it covers", () => {
  const bar = (extra: Partial<BoxNode>) => createContainer("column", { id: "bar", ...extra } as Partial<BoxNode>);
  const covers = () => screen.queryByText(/covers the top of your page|sits over the bottom of every screen/);

  it("held to the TOP, it says it covers the top of the page", () => {
    renderFor(bar({ pin: "top", hold: "fixed" }), { canFloat: true });
    expect(screen.getByText(/covers the top of your page when it opens/)).toBeInTheDocument();
  });

  it("held to the BOTTOM, it says it sits over the footer", () => {
    renderFor(bar({ pin: "bottom", hold: "fixed" }), { canFloat: true });
    expect(screen.getByText(/your footer included/)).toBeInTheDocument();
  });

  it("“Keep its space instead” switches it to the mechanism that does", () => {
    const onPatch = renderFor(bar({ pin: "top", hold: "fixed" }), { canFloat: true });
    fireEvent.click(screen.getByRole("button", { name: "Keep its space instead" }));
    expect(onPatch).toHaveBeenCalledWith({ hold: undefined });
  });

  it("says nothing for a block that KEEPS its space, or one in a corner where it covers little", () => {
    renderFor(bar({ pin: "top" }), { canFloat: true });
    expect(covers(), "sticky keeps its place in the layout").toBeNull();
    cleanup();
    renderFor(bar({ pin: "bottom-right", hold: "fixed" }), { canFloat: true });
    expect(covers(), "a corner button is not a bar across the page").toBeNull();
  });
});

// ══ THE ARRIVAL (Step 2b) — offered only to a pinned block, shown as pictures, honest about condense ══
describe("BoxInspector — When it takes hold", () => {
  const navBar = (extra: Partial<BoxNode> = {}) =>
    createContainer("column", { id: "nav", minHeight: 64, padding: 16, ...extra } as Partial<BoxNode>);
  const gallery = () => screen.queryByRole("group", { name: "When it takes hold" });

  it("is offered once a block is pinned, and not before — there is nothing to arrive at", () => {
    renderFor(navBar(), { canFloat: true });
    expect(gallery()).toBeNull();
    cleanup();
    renderFor(navBar({ pin: "top" }), { canFloat: true });
    expect(gallery()).toBeInTheDocument();
  });

  it("shows all six as PICTURES, Nothing included (RULE S)", () => {
    renderFor(navBar({ pin: "top" }), { canFloat: true });
    for (const name of ["Nothing", "Shadow", "Solid", "Glass", "Rule", "Condense"]) {
      const tile = screen.getByRole("button", { name: `${name} arrival` });
      expect(tile.querySelector("[data-arrival-preview]"), `${name} draws what it does`).not.toBeNull();
    }
  });

  it("every picture is a different drawing (RULE T)", () => {
    const { container } = render(<BoxInspector node={navBar({ pin: "top" })} theme={DEFAULT_THEME} onPatch={vi.fn()} canFloat />);
    const shapes = ["none", "shadow", "solid", "glass", "rule", "condense"].map((fx) =>
      [...container.querySelectorAll(`[data-arrival-preview="${fx}"] [data-arrival-bar]`)].map((el) => el.className).join("|"));
    expect(new Set(shapes).size, shapes.join("\n")).toBe(6);
  });

  it("picking one writes it; Nothing clears it", () => {
    const onPatch = renderFor(navBar({ pin: "top" }), { canFloat: true });
    fireEvent.click(screen.getByRole("button", { name: "Glass arrival" }));
    expect(onPatch).toHaveBeenCalledWith({ pinArrival: "glass" });
    fireEvent.click(screen.getByRole("button", { name: "Nothing arrival" }));
    expect(onPatch).toHaveBeenCalledWith({ pinArrival: undefined });
  });

  it("the distance it takes is offered only once an arrival is chosen", () => {
    renderFor(navBar({ pin: "top" }), { canFloat: true });
    expect(screen.queryByText(/Takes hold over/)).toBeNull();
    cleanup();
    renderFor(navBar({ pin: "top", pinArrival: "shadow" }), { canFloat: true });
    expect(screen.getByText(/Takes hold over/)).toBeInTheDocument();
  });

  it("CONDENSE says so when the block has nothing to condense, and stops saying it once it has", () => {
    // A control that appears to work and does nothing is the defect this project meets most often.
    renderFor(createContainer("column", { id: "bar", pin: "top", pinArrival: "condense" } as Partial<BoxNode>), { canFloat: true });
    expect(screen.getByText(/nothing to condense yet/)).toBeInTheDocument();
    cleanup();
    renderFor(navBar({ pin: "top", pinArrival: "condense" }), { canFloat: true });
    expect(screen.queryByText(/nothing to condense yet/)).toBeNull();
  });
});

describe("G-3b (2) · placing on the page's lines in the Size section", () => {
  const lines = { from: 1, to: 7, first: true, last: false, cols: 12 };
  it("From line / To line call back with the edge that moved; Whole line and To the last line too", () => {
    const onSetLines = vi.fn();
    renderFor(createContainer("column", { id: "c" }), { pageLines: lines, onSetLines });
    fireEvent.change(screen.getByLabelText("To line"), { target: { value: "9" } });
    expect(onSetLines).toHaveBeenLastCalledWith({ to: 9 });
    fireEvent.change(screen.getByLabelText("From line"), { target: { value: "3" } });
    expect(onSetLines).toHaveBeenLastCalledWith({ from: 3 });
    fireEvent.click(screen.getByRole("button", { name: "Whole line" }));
    expect(onSetLines).toHaveBeenLastCalledWith("full");
    expect(screen.queryByRole("button", { name: "Full width" }), "G3b-9: the toolbar's device button is called Full width").toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "To the last line" }));
    expect(onSetLines).toHaveBeenLastCalledWith({ to: 13 });
  });
  it("To the last line is off when the block already ends there; Whole line shows as on when it is", () => {
    renderFor(createContainer("column", { id: "c" }), { pageLines: { ...lines, to: 13, last: true }, onSetLines: vi.fn() });
    expect(screen.getByRole("button", { name: "To the last line" })).toBeDisabled();
    cleanup();
    renderFor(createContainer("column", { id: "c" }), { pageLines: { from: 1, to: 13, first: true, last: true, cols: 12 }, onSetLines: vi.fn() });
    expect(screen.getByRole("button", { name: "Whole line" })).toHaveAttribute("aria-pressed", "true");
  });
  it("Bleed writes the side, and Off clears it", () => {
    const onPatch = renderFor(createContainer("column", { id: "c", bleed: "right" } as Partial<BoxNode>), { pageLines: lines, onSetLines: vi.fn() });
    const bleed = within(screen.getByRole("group", { name: "Bleed to the page edge" }));
    expect(bleed.getByRole("button", { name: "Right" })).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(bleed.getByRole("button", { name: "Both" }));
    expect(onPatch).toHaveBeenLastCalledWith({ bleed: "both" });
    fireEvent.click(bleed.getByRole("button", { name: "Off" }));
    expect(onPatch).toHaveBeenLastCalledWith({ bleed: undefined });
  });
  it("not shown for a block that is not on a row of the page", () => {
    renderFor(createContainer("column", { id: "c" }));
    expect(screen.queryByLabelText("From line")).toBeNull();
    expect(screen.queryByLabelText(/Free space on the left/)).toBeNull();
  });
  it("G3b-24: where the fit rule steps the row, the Size section says what is drawn here", () => {
    renderFor(createContainer("column", { id: "c" }), { pageLines: { ...lines, drawnAcross: 1 }, onSetLines: vi.fn() });
    expect(screen.getByRole("note")).toHaveTextContent("drawn on a line of its own");
    cleanup();
    renderFor(createContainer("column", { id: "c" }), { pageLines: { ...lines, drawnAcross: 2 }, onSetLines: vi.fn() });
    expect(screen.getByRole("note")).toHaveTextContent("drawn 2 across");
    cleanup();
    renderFor(createContainer("column", { id: "c" }), { pageLines: lines, onSetLines: vi.fn() });
    expect(screen.queryByRole("note")).toBeNull();
  });
  it("G-3b (6): Rows tall in the Size section writes the span; 1 clears it", () => {
    const onPatch = renderFor(createContainer("column", { id: "c" }), { pageLines: lines, onSetLines: vi.fn() });
    fireEvent.change(screen.getByLabelText("Rows tall"), { target: { value: "2" } });
    expect(onPatch).toHaveBeenLastCalledWith({ rowSpan: 2 });
    cleanup();
    const again = renderFor(createContainer("column", { id: "c", rowSpan: 2 } as Partial<BoxNode>), { pageLines: lines, onSetLines: vi.fn() });
    expect(screen.getByLabelText("Rows tall")).toHaveValue(2);
    fireEvent.change(screen.getByLabelText("Rows tall"), { target: { value: "1" } });
    expect(again).toHaveBeenLastCalledWith({ rowSpan: undefined });
  });
  it("G3b-20: a grid cell on a page-grid page has ONE control named Rows tall, and the height its own name", () => {
    const onPatch = renderFor(createContainer("column", { id: "gc" }), { inGrid: true, gridTrack: 12, rowStepRem: 1.5 });
    expect(screen.getAllByLabelText("Rows tall")).toHaveLength(1);
    fireEvent.change(screen.getByLabelText("At least this many rows tall"), { target: { value: "3" } });
    expect(onPatch).toHaveBeenLastCalledWith(expect.objectContaining({ minHeight: expect.any(Number) }));
  });
  it("L6-11: a re-render keeps the Text style section — the same slider — rather than building it anew", () => {
    const h = createElement("heading", { id: "h1" });
    const { rerender } = render(<BoxInspector node={h} theme={DEFAULT_THEME} onPatch={vi.fn()} />);
    openContent();
    const slider = screen.getByLabelText("Text size");
    rerender(<BoxInspector node={{ ...h }} theme={DEFAULT_THEME} onPatch={vi.fn()} />); // a new object, as every canvas commit makes
    expect(screen.getByLabelText("Text size"), "the same element: not thrown away and rebuilt").toBe(slider);
  });
  it("L6-4 → AC-30: on a row of the page a Custom width says a % shares and a set width stays — off the page grid it says nothing", () => {
    const say = /A set width \(e\.g\. 20rem\) stays that wide/;
    renderFor(createElement("image", { id: "i", width: "25%" }), { pageLines: lines, onSetLines: vi.fn(), onSetFreeInset: vi.fn() });
    expect(screen.getByText(say)).toBeInTheDocument();
    cleanup();
    // LE3-2: a set width takes the row off the page's lines (no `pageLines` any more) — the hint stays, it is still a row of the page
    renderFor(createElement("image", { id: "i", width: "20rem" }), { rowOfPage: true });
    expect(screen.getByText(say), "still on a row of the page").toBeInTheDocument();
    cleanup();
    renderFor(createElement("image", { id: "i", width: "3.5rem" }));
    expect(screen.queryByText(say), "in a flex row inside a block a rem width is drawn as typed").toBeNull();
  });
  it("G-3b (3): the free margin is shown, changed per side, and put back on the lines in one go", () => {
    const onSetFreeInset = vi.fn();
    renderFor(createContainer("column", { id: "c", freeInset: { right: 20 } } as Partial<BoxNode>), { pageLines: lines, onSetLines: vi.fn(), onSetFreeInset });
    expect(screen.getByLabelText("Free space on the right, percent of its columns")).toHaveValue(20);
    expect(screen.getByLabelText("Free space on the left, percent of its columns")).toHaveValue(0);
    fireEvent.change(screen.getByLabelText("Free space on the left, percent of its columns"), { target: { value: "15" } });
    expect(onSetFreeInset).toHaveBeenLastCalledWith("left", 15);
    fireEvent.change(screen.getByLabelText("Free space on the right, percent of its columns"), { target: { value: "0" } });
    expect(onSetFreeInset).toHaveBeenLastCalledWith("right", undefined);
    fireEvent.click(screen.getByRole("button", { name: "Back on the lines" }));
    expect(onSetFreeInset).toHaveBeenLastCalledWith("both", undefined);
    cleanup();
    renderFor(createContainer("column", { id: "c" }), { pageLines: lines, onSetLines: vi.fn(), onSetFreeInset });
    expect(screen.getByRole("button", { name: "Back on the lines" })).toBeDisabled();
  });
});

describe("G3c-10 · a size or a space says what it really is, phone → wide (the user: \"phone → wide range\")", () => {
  it("the gaps of a stack read 0.7–1.4rem, never \"1rem\" (a box's Band height stays real rem: it is stored as px)", () => {
    renderFor(createContainer("column", { id: "c", gap: 16 })); // a gap the user set (a new stack has none, 2026-10-15)
    expect(screen.getAllByText("0.7–1.4rem").length).toBeGreaterThanOrEqual(3); // Space between blocks, across, down
    expect(screen.queryByText("1rem")).toBeNull();
  });
});

describe("BoxInspector — G-3d (2) \"Fill the block's height\" (only where it does something)", () => {
  const photo = () => createElement("image", { id: "i", src: "data:image/png;base64,AA==", imgW: 800, imgH: 600 } as Partial<BoxNode>);
  const name = /Fill the block's height/;
  it("is absent when the page says it does not apply", () => {
    renderFor(photo()); openContent();
    expect(screen.queryByRole("checkbox", { name })).toBeNull();
    cleanup();
  });
  it("shown on: switching it off stores false; shown off: on clears it", () => {
    const onPatch = renderFor(photo(), { fillHeight: { on: true } }); openContent();
    const box = screen.getByRole("checkbox", { name });
    expect(box).toBeChecked();
    fireEvent.click(box);
    expect(onPatch).toHaveBeenLastCalledWith({ fillHeight: false });
    cleanup();
    const onPatch2 = renderFor(photo(), { fillHeight: { on: false } }); openContent();
    fireEvent.click(screen.getByRole("checkbox", { name }));
    expect(onPatch2).toHaveBeenLastCalledWith({ fillHeight: undefined });
    cleanup();
  });
});

describe("BoxInspector — Advanced CSS on EVERY block (A2-12, RULE UI)", () => {
  // the canvas (advancedCssStyle) and the export (box-export's node rule) apply it to every block, so every block offers it
  const blocks: [string, () => BoxNode][] = [
    ["text", () => createElement("text", { id: "t" })],
    ["heading", () => createElement("heading", { id: "h" })],
    ["stack", () => createContainer("column", { id: "s" })],
    ["accordion", () => createComponent("accordion", { id: "a" } as Partial<BoxNode>)],
  ];
  it.each(blocks)("a %s block: the Content tab's Advanced CSS writes advancedCss", (_k, make) => {
    const onPatch = renderFor(make());
    openContent();
    fireEvent.click(screen.getByRole("button", { name: /Advanced CSS/ }));
    fireEvent.change(screen.getByLabelText("Advanced CSS"), { target: { value: "letter-spacing: .1em;" } });
    expect(onPatch).toHaveBeenCalledWith({ advancedCss: "letter-spacing: .1em;" });
    cleanup();
  });
});

// ══ LEDGER RX-4 (measured HEADED 2026-10-17) — the Inspector's half ══
describe("BoxInspector — RX4-11 · a Height under Size is something to condense", () => {
  it("does not tell a bar with a Size → Height that it has nothing to condense", () => {
    renderFor(createContainer("column", { id: "bar", pin: "top", pinArrival: "condense", height: "8rem" } as Partial<BoxNode>), { canFloat: true });
    expect(screen.queryByText(/nothing to condense yet/)).toBeNull();
  });

  it("when it does warn, it names every control that works — Size's Height, Spacing, the Band height", () => {
    renderFor(createContainer("column", { id: "bar", pin: "top", pinArrival: "condense" } as Partial<BoxNode>), { canFloat: true });
    const note = screen.getByText(/nothing to condense yet/).textContent ?? "";
    expect(note).toMatch(/Height/);
    expect(note).toMatch(/Band height/);
  });
});

describe("BoxInspector — RX4-12 · a Floating block floating on screen gets the window's edges and corners", () => {
  const floatedOn = (extra: Partial<BoxNode> = {}) =>
    createElement("button", { id: "b", text: "Apply", position: "absolute", left: 5, top: 5, pin: "top", hold: "fixed", ...extra } as Partial<BoxNode>);

  it("offers where it was placed, the four edges and the four corners", () => {
    renderFor(floatedOn({ pinX: 10, pinY: 20 }), { canFloat: true });
    const group = screen.getByRole("group", { name: "Held against" });
    for (const t of ["Where you placed it, kept inside the window", "Top", "Bottom", "Left", "Right", "Top-left corner", "Top-right corner", "Bottom-left corner", "Bottom-right corner"]) {
      expect(within(group).getByTitle(t)).toBeInTheDocument();
    }
    expect(within(group).getByTitle("Where you placed it, kept inside the window")).toHaveAttribute("aria-pressed", "true");
  });

  it("a corner writes the pin; “Where I put it” asks for the fixed hold again, so the place is measured", () => {
    const onPatch = renderFor(floatedOn({ pinX: 10, pinY: 20 }), { canFloat: true });
    fireEvent.click(screen.getByTitle("Bottom-right corner"));
    expect(onPatch).toHaveBeenCalledWith({ pin: "bottom-right" });
    cleanup();
    const again = renderFor(floatedOn({ pin: "bottom-right" }), { canFloat: true });
    expect(screen.getByText(/bottom right corner of the window/)).toBeInTheDocument();
    fireEvent.click(screen.getByTitle("Where you placed it, kept inside the window"));
    expect(again).toHaveBeenCalledWith({ pin: "top", hold: "fixed" });
  });
});

describe("BoxInspector — RX4-18 · the Press tile draws its press (RULE T)", () => {
  it("the Press tile does not look like None", () => {
    renderFor(createContainer("column", { id: "s" }));
    const look = (name: string) => screen.getByRole("button", { name }).querySelector(".eu-root > span")!.getAttribute("style");
    expect(look("Press hover effect")).not.toBe(look("None hover effect"));
    expect(look("Press hover effect")).toMatch(/translateY\(0\.125rem\) scale\(0?\.97\)/);
  });
});

describe("BoxInspector — RX4-16 · a pattern opens its pattern editor, never the gradient one", () => {
  // Measured HEADED: the 4th pattern, "Dot grid" — TWO radial layers, which the gradient parser read as one gradient.
  it.each([
    ["Dot grid (two layers)", "radial-gradient(circle at 0 0, currentColor 1.5px, transparent 1.6px), radial-gradient(circle at 12px 12px, currentColor 1.5px, transparent 1.6px)", "24px 24px"],
    ["Dots (one layer)", "radial-gradient(currentColor 1.5px, transparent 1.6px)", "20px 20px"],
  ])("%s shows “Edit pattern CSS”", (_n, bgImage, bgTile) => {
    renderFor(createContainer("column", { id: "s", bgImage, bgTile } as Partial<BoxNode>));
    expect(screen.getByText("Edit pattern CSS")).toBeInTheDocument();
    expect(screen.queryByText("Edit gradient")).toBeNull();
  });

  it("a plain gradient still opens the gradient editor", () => {
    renderFor(createContainer("column", { id: "s", bgImage: "linear-gradient(135deg, #6a11cb, #2575fc)" } as Partial<BoxNode>));
    expect(screen.getByText("Edit gradient")).toBeInTheDocument();
  });
});

describe("BoxInspector — RX4-15 · Advanced CSS says what it refused", () => {
  it("names a layout transition and a never-ending animation as not applied", () => {
    renderFor(createContainer("column", { id: "s", advancedCss: "color: red; transition: height 1s; animation: spin 1s infinite" } as Partial<BoxNode>));
    openContent();
    fireEvent.click(screen.getByRole("button", { name: /Advanced CSS/ }));
    const msg = screen.getByRole("status", { name: "Advanced CSS not applied" });
    expect(msg).toHaveTextContent("transition: height 1s");
    expect(msg).toHaveTextContent("animation: spin 1s infinite");
  });

  it("says nothing when every line is applied", () => {
    renderFor(createContainer("column", { id: "s", advancedCss: "transition: transform .3s" } as Partial<BoxNode>));
    openContent();
    fireEvent.click(screen.getByRole("button", { name: /Advanced CSS/ }));
    expect(screen.queryByRole("status", { name: "Advanced CSS not applied" })).toBeNull();
  });
});

describe("LE1-4 · the Columns control tells the truth at a screen (found HEADED, uat-le1-headed.js U5)", () => {
  const grid = () => createContainer("row", { id: "g", layout: "grid", columns: 4 } as Partial<BoxNode>);
  it("at Phone a desktop Quarters grid is drawn ONE across — the control does not claim Quarters", () => {
    renderFor(grid(), { breakpoint: "phone" });
    expect(within(screen.getByRole("group", { name: "Columns" })).getByRole("button", { name: "Quarters" })).toHaveAttribute("aria-pressed", "false");
  });
  it("…so picking Quarters there sets four across for phones", () => {
    const onPatch = renderFor(grid(), { breakpoint: "phone" });
    fireEvent.click(within(screen.getByRole("group", { name: "Columns" })).getByRole("button", { name: "Quarters" }));
    expect(onPatch).toHaveBeenCalledWith({ columns: 4 });
  });
  it("on the base the control shows the stored count", () => {
    renderFor(grid(), { breakpoint: "base" });
    expect(within(screen.getByRole("group", { name: "Columns" })).getByRole("button", { name: "Quarters" })).toHaveAttribute("aria-pressed", "true");
  });
});

describe("BATCH LE-12 · sizes and grids in the Inspector", () => {
  const stack = (extra: Partial<BoxNode> = {}) => createContainer("column", { id: "s", ...extra });
  it("SZ-4: the Proportion gallery offers Free, every configured shape and Custom; a shape gives up the Height", () => {
    const onPatch = renderFor(stack({ height: "20rem" }));
    for (const r of LAYOUT.sizes.ratios) expect(screen.getByRole("button", { name: `${r.label} proportion` })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "16:9 proportion" }));
    expect(onPatch).toHaveBeenLastCalledWith({ ratio: "16 / 9", height: undefined, contentScale: undefined });
    fireEvent.click(screen.getByRole("button", { name: "Free proportion" }));
    expect(onPatch).toHaveBeenLastCalledWith({ ratio: undefined });
    fireEvent.click(screen.getByRole("button", { name: "Custom proportion" }));
    expect(onPatch).toHaveBeenLastCalledWith(expect.objectContaining({ ratio: LAYOUT.sizes.customStart }));
  });
  it("LE12-4: every shape is drawn to fit its tile both ways (an SVG of its own proportion), so a wide one is never clipped to look like another", () => {
    renderFor(stack());
    for (const r of LAYOUT.sizes.ratios) {
      const svg = screen.getByRole("button", { name: `${r.label} proportion` }).querySelector("svg[data-shape]");
      expect(svg?.getAttribute("viewBox")).toBe(`0 0 ${r.value.replace(" / ", " ")}`);
    }
  });
  it("SZ-4: Custom shows its two numbers; a typed Height clears the proportion", () => {
    const onPatch = renderFor(stack({ ratio: "5 / 2" }));
    expect(screen.getByLabelText("Proportion width")).toHaveValue(5);
    fireEvent.change(screen.getByLabelText("Proportion height"), { target: { value: "1" } });
    expect(onPatch).toHaveBeenLastCalledWith({ ratio: "5 / 1" });
    fireEvent.change(screen.getByLabelText("Height"), { target: { value: "10rem" } });
    expect(onPatch).toHaveBeenLastCalledWith(expect.objectContaining({ height: "10rem", ratio: undefined }));
  });
  it("SZ-3: Limits take a length (px made rem), refuse anything else, and clear when emptied", () => {
    const onPatch = renderFor(stack({ maxHeight: "30rem" }));
    fireEvent.change(screen.getByLabelText("Max width"), { target: { value: "640px" } });
    expect(onPatch).toHaveBeenLastCalledWith({ maxWidth: "40rem" });
    fireEvent.change(screen.getByLabelText("Min width"), { target: { value: "wide" } });
    expect(onPatch).toHaveBeenCalledTimes(1);
    fireEvent.change(screen.getByLabelText("Min height"), { target: { value: "20rem" } });
    expect(onPatch).toHaveBeenLastCalledWith({ minHeight: 320 });
    fireEvent.change(screen.getByLabelText("Max height"), { target: { value: "" } });
    expect(onPatch).toHaveBeenLastCalledWith({ maxHeight: undefined });
  });
  it("GR-2: a Grid's Columns — a set number or As many as fit; with As many as fit the count, the ladder and Column widths stand aside", () => {
    const cell = (id: string) => createContainer("column", { id, colSpan: 4 });
    const grid = (extra: Partial<BoxNode> = {}) => createContainer("row", { id: "g", layout: "grid", columns: 12, children: [cell("a"), cell("b"), cell("c")], ...extra });
    const onPatch = renderFor(grid());
    fireEvent.click(screen.getByRole("button", { name: "As many as fit" }));
    expect(onPatch).toHaveBeenLastCalledWith({ minCard: LAYOUT.sizes.autoFitStart });
    expect(screen.getByLabelText("Columns in the row")).toBeInTheDocument();
    cleanup();
    const onFit = renderFor(grid({ minCard: "16rem" }));
    expect(screen.queryByLabelText("Columns in the row")).toBeNull();
    expect(screen.queryByRole("group", { name: "Column widths" })).toBeNull();
    expect(screen.getByText(/at 16rem each/)).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Each at least"), { target: { value: "20rem" } });
    expect(onFit).toHaveBeenLastCalledWith({ minCard: "20rem" });
    fireEvent.click(screen.getByRole("button", { name: "A set number" }));
    expect(onFit).toHaveBeenLastCalledWith({ minCard: undefined });
  });
  it("GR-2: a cell of an As many as fit grid is not offered a span, a start or rows", () => {
    renderFor(createContainer("column", { id: "c" }), { inGrid: true, gridTrack: 12, inFitGrid: true });
    expect(screen.queryByLabelText("Columns wide")).toBeNull();
    expect(screen.queryByLabelText("Start at column")).toBeNull();
    expect(screen.getAllByLabelText("Line up (across)").length).toBeGreaterThan(0);
  });
  it("SZ-3: a Grid column Between two widths; LE12-1: its set width typed key by key arrives whole", async () => {
    const cell = (id: string) => createContainer("column", { id, colSpan: 4 });
    const onPatch = renderFor(createContainer("row", { id: "g", layout: "grid", columns: 12, colSizes: ["12rem 18rem", "15rem"], children: [cell("a"), cell("b"), cell("c")] }));
    expect(screen.getByLabelText("Column 1: at least")).toHaveValue("12rem");
    fireEvent.change(screen.getByLabelText("Column 1: at most"), { target: { value: "20rem" } });
    expect(onPatch).toHaveBeenLastCalledWith({ colSizes: ["12rem 20rem", "15rem", null] });
    const set = screen.getByLabelText("Column 2: set width");
    await userEvent.clear(set);
    await userEvent.type(set, "22rem");
    expect(onPatch).toHaveBeenLastCalledWith({ colSizes: ["12rem 18rem", "22rem", null] });
  });
  it("SP-4: the spacing sliders move on the spacing scale", () => {
    const onPatch = renderFor(stack());
    const inner = screen.getByLabelText("Inner spacing");
    expect(inner).toHaveAttribute("max", String(SPACE_STEPS.length - 1));
    fireEvent.change(inner, { target: { value: "3" } });
    expect(onPatch).toHaveBeenLastCalledWith({ padding: SPACE_STEPS[3] });
    fireEvent.change(screen.getByLabelText("Space between blocks"), { target: { value: "4" } });
    expect(onPatch).toHaveBeenLastCalledWith(expect.objectContaining({ gap: SPACE_STEPS[4] }));
  });
});

// BATCH LE-4 · the alignment panel — Across / Down with Fill (AC-27), Position blocks + Wrapped lines (AC-25), Text lines up (AL-5),
// Push to the far end (AL-6). Words: config/inspector.json `align`. Engine: tests/unit/alignment.test.ts.
describe("BoxInspector — LE-4 the alignment panel", () => {
  const A = (INSPECTOR_WORDS as { align: Record<string, unknown> }).align as { [k: string]: Record<string, string> & string };
  it("Across and Down: Fill and Auto, and the nine squares light the rows", () => {
    const onPatch = renderFor(createElement("heading", { id: "h", text: "x", placeX: "end", placeY: "start" } as Partial<BoxNode>), { parentFlow: "column" });
    const across = screen.getByRole("group", { name: A.across as string }), down = screen.getByRole("group", { name: A.down as string });
    expect(within(across).getByRole("button", { name: A.acrossChoices.end })).toHaveAttribute("aria-pressed", "true");
    expect(within(down).getByRole("button", { name: A.downChoices.start })).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(within(across).getByRole("button", { name: A.acrossChoices.stretch }));
    expect(onPatch).toHaveBeenLastCalledWith({ placeX: "stretch", justifySelf: undefined, push: undefined });
    fireEvent.click(within(down).getByRole("button", { name: A.downChoices.stretch }));
    expect(onPatch).toHaveBeenLastCalledWith({ placeY: "stretch" }); // LE4-7: Down never touches the legacy push (a left / right margin)
    expect(onPatch).not.toHaveBeenLastCalledWith(expect.objectContaining({ push: undefined }));
    fireEvent.click(within(across).getByRole("button", { name: A.acrossChoices.auto }));
    expect(onPatch).toHaveBeenLastCalledWith({ placeX: undefined, justifySelf: undefined, push: undefined });
  });
  it("LE4-8: the nine squares' label sits on its own line, never run into the squares", () => {
    renderFor(createElement("text", { id: "t", text: "x" } as Partial<BoxNode>), { parentFlow: "column" });
    expect(screen.getByText("Where this block sits").className.split(" ")).toContain("block");
  });
  it("Push to the far end: the main axis of a row is Across, of a stack Down; a grid cell is not offered it", () => {
    const row = renderFor(createElement("text", { id: "t", text: "x" } as Partial<BoxNode>), { parentFlow: "row" });
    const box = screen.getByRole("checkbox", { name: new RegExp(A.push as string) });
    expect(box).not.toBeChecked();
    expect(box).toHaveAccessibleDescription(A.pushHint as string);
    fireEvent.click(box); expect(row).toHaveBeenLastCalledWith({ placeX: "end", push: undefined });
    cleanup();
    const col = renderFor(createElement("button", { id: "b", text: "Go", placeY: "end" } as Partial<BoxNode>), { parentFlow: "column" });
    const on = screen.getByRole("checkbox", { name: new RegExp(A.push as string) });
    expect(on).toBeChecked();
    fireEvent.click(on); expect(col).toHaveBeenLastCalledWith({ placeY: undefined }); // LE4-7: a stack's push is Down — the legacy across push stays
    expect(col).not.toHaveBeenLastCalledWith(expect.objectContaining({ push: undefined }));
    cleanup();
    renderFor(createElement("text", { id: "t", text: "x" } as Partial<BoxNode>), { parentFlow: "grid", inGrid: true });
    expect(screen.queryByRole("checkbox", { name: new RegExp(A.push as string) })).toBeNull();
  });
  it("Text lines up is offered where blocks line up DOWN (a row, a grid), never in a top-to-bottom stack", () => {
    const has = (node: BoxNode) => { renderFor(node); fireEvent.click(screen.getByRole("button", { name: "Line up" })); const n = screen.queryAllByRole("option", { name: A.lineUp.baseline }).length; cleanup(); return n; };
    expect(has(createContainer("row", { id: "r" } as Partial<BoxNode>))).toBe(1);
    expect(has(createContainer("column", { id: "g", layout: "grid", columns: 3 } as Partial<BoxNode>))).toBe(1);
    expect(has(createContainer("column", { id: "s" } as Partial<BoxNode>))).toBe(0);
    const onPatch = renderFor(createContainer("row", { id: "r" } as Partial<BoxNode>)); pickSelect("Line up", A.lineUp.baseline);
    expect(onPatch).toHaveBeenLastCalledWith({ align: "baseline" });
  });
  it("Position blocks: Even spacing is evenly, and Space around is named for what it does", () => {
    const onPatch = renderFor(createContainer("row", { id: "r" } as Partial<BoxNode>));
    pickSelect("Position blocks", A.justify.evenly); expect(onPatch).toHaveBeenLastCalledWith({ justify: "evenly" });
    pickSelect("Position blocks", A.justify.around); expect(onPatch).toHaveBeenLastCalledWith({ justify: "around" });
  });
  it("Wrapped lines: offered only while a side-by-side row wraps; Fill stores nothing", () => {
    renderFor(createContainer("row", { id: "r", wrap: false } as Partial<BoxNode>));
    expect(screen.queryByRole("button", { name: A.wrappedLines as string })).toBeNull(); cleanup();
    renderFor(createContainer("column", { id: "s", wrap: true } as Partial<BoxNode>));
    expect(screen.queryByRole("button", { name: A.wrappedLines as string })).toBeNull(); cleanup();
    const onPatch = renderFor(createContainer("row", { id: "r", wrap: true } as Partial<BoxNode>));
    pickSelect(A.wrappedLines as string, A.wrappedChoices.end); expect(onPatch).toHaveBeenLastCalledWith({ alignContent: "end" });
    pickSelect(A.wrappedLines as string, A.wrappedChoices.stretch); expect(onPatch).toHaveBeenLastCalledWith({ alignContent: undefined });
  });
});

// BATCH LE-13 · flow and overlap — Wrap words round it (FL-3), When it doesn't fit (FL-6), Overlap the section above (PO-4).
// Words: config/inspector.json `flow`, steps: config/layout.json `flow.overlapSteps`. Engine: tests/unit/flow.test.ts.
describe("BoxInspector — LE-13 flow and overlap", () => {
  const W = INSPECTOR_WORDS.flow;
  const pic = (extra: Partial<BoxNode> = {}) => createElement("image", { id: "p", ...extra } as Partial<BoxNode>);
  it("FL-3: Wrap words round it, only where it can work; Off on a screen whose base wraps is stored as off", () => {
    const onPatch = renderFor(pic(), { parentFlow: "column", canWrapWords: true });
    const g = screen.getByRole("group", { name: W.wrap });
    expect(within(g).getByRole("button", { name: W.wrapChoices.off })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText(W.wrapHint)).toBeInTheDocument();
    fireEvent.click(within(g).getByRole("button", { name: W.wrapChoices.start })); expect(onPatch).toHaveBeenLastCalledWith({ wrapAround: "start" });
    fireEvent.click(within(g).getByRole("button", { name: W.wrapChoices.off })); expect(onPatch).toHaveBeenLastCalledWith({ wrapAround: undefined });
    cleanup();
    const atPhone = renderFor(pic({ wrapAround: "end" }), { parentFlow: "column", canWrapWords: true, breakpoint: "phone" });
    const g2 = screen.getByRole("group", { name: W.wrap });
    expect(within(g2).getByRole("button", { name: W.wrapChoices.end })).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(within(g2).getByRole("button", { name: W.wrapChoices.off })); expect(atPhone).toHaveBeenLastCalledWith({ wrapAround: "off" });
    cleanup();
    renderFor(pic(), { parentFlow: "row" });
    expect(screen.queryByRole("group", { name: W.wrap })).toBeNull();
  });
  it("FL-3b (LE-13b): Words follow, only with the wrap on — its box, its round corners, a cut-out's outline (traced); its box stored as unset", async () => {
    renderFor(pic(), { parentFlow: "column", canWrapWords: true });
    expect(screen.queryByRole("group", { name: W.shape })).toBeNull(); // the wrap is Off: there is nothing for the words to follow
    cleanup();
    const onPatch = renderFor(pic({ wrapAround: "start" }), { parentFlow: "column", canWrapWords: true });
    const g = screen.getByRole("group", { name: W.shape });
    expect(within(g).getAllByRole("button").map((b) => b.textContent)).toEqual(Object.values(W.shapeChoices));
    expect(within(g).getByRole("button", { name: W.shapeChoices.box })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText(W.shapeHint)).toBeInTheDocument();
    fireEvent.click(within(g).getByRole("button", { name: W.shapeChoices.round })); expect(onPatch).toHaveBeenLastCalledWith({ wrapShape: "round" });
    fireEvent.click(within(g).getByRole("button", { name: W.shapeChoices.box })); expect(onPatch).toHaveBeenLastCalledWith({ wrapShape: undefined });
    cleanup();
    // A cut-out's outline: the picture is traced, and the shape and its outline land in ONE patch (one undo step)
    const traced = renderFor(pic({ wrapAround: "start", src: "cutout.png" }), { parentFlow: "column", canWrapWords: true });
    fireEvent.click(within(screen.getByRole("group", { name: W.shape })).getByRole("button", { name: W.shapeChoices.outline }));
    await waitFor(() => expect(traced).toHaveBeenLastCalledWith({ wrapShape: "outline", wrapOutline: TRACED }));
    cleanup();
    // already traced: not traced again · cannot be traced: the choice is still kept (the words keep to its box)
    const kept = renderFor(pic({ wrapAround: "start", src: "cutout.png", wrapOutline: TRACED }), { parentFlow: "column", canWrapWords: true });
    fireEvent.click(within(screen.getByRole("group", { name: W.shape })).getByRole("button", { name: W.shapeChoices.outline }));
    expect(kept).toHaveBeenLastCalledWith({ wrapShape: "outline" });
    cleanup();
    const plain = renderFor(pic({ wrapAround: "start", src: "untraceable.png" }), { parentFlow: "column", canWrapWords: true });
    fireEvent.click(within(screen.getByRole("group", { name: W.shape })).getByRole("button", { name: W.shapeChoices.outline }));
    await waitFor(() => expect(plain).toHaveBeenLastCalledWith({ wrapShape: "outline" }));
    cleanup();
    const atPhone = renderFor(pic({ wrapAround: "end", wrapShape: "round" }), { parentFlow: "column", canWrapWords: true, breakpoint: "phone" });
    const g2 = screen.getByRole("group", { name: W.shape });
    expect(within(g2).getByRole("button", { name: W.shapeChoices.round })).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(within(g2).getByRole("button", { name: W.shapeChoices.box })); expect(atPhone).toHaveBeenLastCalledWith({ wrapShape: "box" }); // its box on this screen only
  });
  it("LE-13c: Space round it, only with the wrap on — on the spacing scale, the default shown, Back to default unsets it", () => {
    renderFor(pic(), { parentFlow: "column", canWrapWords: true });
    expect(screen.queryByLabelText(W.gap)).toBeNull(); // the wrap is Off: there is no space round it to set
    cleanup();
    const onPatch = renderFor(pic({ wrapAround: "start" }), { parentFlow: "column", canWrapWords: true });
    const s = screen.getByLabelText(W.gap);
    expect(s).toHaveAttribute("aria-valuetext", `${W.gapDefault} · ${LAYOUT.flow.wrapGapRem}rem`);
    expect(screen.getByText(W.gapHint)).toBeInTheDocument();
    const back = screen.getByRole("button", { name: `${W.gap} — ${W.gapBack}` });
    expect(back).toBeDisabled(); // nothing of its own yet
    fireEvent.change(s, { target: { value: String(SPACE_STEPS.indexOf(24)) } }); expect(onPatch).toHaveBeenLastCalledWith({ wrapGap: 24 });
    fireEvent.change(s, { target: { value: "0" } }); expect(onPatch).toHaveBeenLastCalledWith({ wrapGap: 0 });
    cleanup();
    const own = renderFor(pic({ wrapAround: "end", wrapGap: 24 }), { parentFlow: "column", canWrapWords: true });
    expect(screen.getByLabelText(W.gap)).toHaveAttribute("aria-valuetext", fluidRemRange(24));
    fireEvent.click(screen.getByRole("button", { name: `${W.gap} — ${W.gapBack}` })); expect(own).toHaveBeenLastCalledWith({ wrapGap: undefined });
  });
  it("FL-6: When it doesn't fit on a Side by side — Scroll sideways, and back to new lines (Off stored on a screen)", () => {
    const sbs = (extra: Partial<BoxNode> = {}) => createContainer("row", { id: "s", children: [], ...extra });
    const onPatch = renderFor(sbs());
    const g = screen.getByRole("group", { name: W.fit });
    fireEvent.click(within(g).getByRole("button", { name: W.fitChoices.scroll })); expect(onPatch).toHaveBeenLastCalledWith({ scrollX: true });
    expect(screen.getByText(W.fitHint)).toBeInTheDocument();
    cleanup();
    const atPhone = renderFor(sbs({ scrollX: true }), { breakpoint: "phone" });
    const g2 = screen.getByRole("group", { name: W.fit });
    expect(within(g2).getByRole("button", { name: W.fitChoices.scroll })).toHaveAttribute("aria-pressed", "true");
    expect(screen.queryByRole("checkbox", { name: /Let blocks wrap/ })).toBeNull(); // a strip does not wrap — the old box would contradict it
    fireEvent.click(within(g2).getByRole("button", { name: W.fitChoices.wrap })); expect(atPhone).toHaveBeenLastCalledWith({ scrollX: false, wrap: true });
    cleanup();
    renderFor(createContainer("column", { id: "c", children: [] }));
    expect(screen.queryByRole("group", { name: W.fit })).toBeNull();
  });
  it("PO-4: Overlap the section above — Off and config's steps in their words; only where it can work", () => {
    const sec = (extra: Partial<BoxNode> = {}) => createContainer("row", { id: "s", children: [], ...extra });
    const onPatch = renderFor(sec(), { canOverlapUp: true });
    const g = screen.getByRole("group", { name: W.overlap });
    expect(within(g).getAllByRole("button").map((b) => b.textContent)).toEqual([W.overlapOff, ...W.overlapSteps]);
    fireEvent.click(within(g).getByRole("button", { name: W.overlapSteps[1] })); expect(onPatch).toHaveBeenLastCalledWith({ overlapUp: LAYOUT.flow.overlapSteps[1] });
    cleanup();
    const atPhone = renderFor(sec({ overlapUp: LAYOUT.flow.overlapSteps[2] }), { canOverlapUp: true, breakpoint: "phone" });
    const g2 = screen.getByRole("group", { name: W.overlap });
    expect(within(g2).getByRole("button", { name: W.overlapSteps[2] })).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(within(g2).getByRole("button", { name: W.overlapOff })); expect(atPhone).toHaveBeenLastCalledWith({ overlapUp: 0 });
    cleanup();
    renderFor(sec());
    expect(screen.queryByRole("group", { name: W.overlap })).toBeNull();
  });
});

// ED-2 (BATCH LE-10) — where am I: the blocks round the selection, named and clickable (box-builder-where-am-i.feature).
describe("BoxInspector — the trail of blocks round the selection (LE-10)", () => {
  const T = INSPECTOR_WORDS.trail;
  const stack = createContainer("column", { id: "stack" });
  const sbs = createContainer("row", { id: "sbs" });
  const heading = createElement("heading", { id: "h", text: "Welcome" });

  it("names the blocks round it outermost first, after the lead, and marks the selection as where you are", () => {
    cleanup();
    renderFor(heading, { trail: [stack, sbs], onSelectBlock: vi.fn() });
    const nav = screen.getByRole("navigation", { name: T.label });
    const items = within(nav).getAllByRole("listitem").map((li) => li.textContent?.trim());
    expect(items).toEqual(["Stack", "Side by side", "Heading"]); // the words as drawn — LE10-1: CSS capitalize showed "Side By Side"
    expect(within(nav).getByText("Heading")).toHaveAttribute("aria-current", "location");
    // …and drawn as written: a `capitalize` class turns "Side by side" into "Side By Side", which jsdom cannot see
    expect(screen.getByText(new RegExp(`^${T.lead}`)).querySelector(".capitalize")).toBeNull();
    expect(screen.getByText(new RegExp(`^${T.lead}`)).textContent).toContain("Side by side");
  });

  it("a block in the trail is a button that selects it", () => {
    cleanup();
    const onSelectBlock = vi.fn();
    renderFor(heading, { trail: [stack, sbs], onSelectBlock });
    fireEvent.click(screen.getByRole("button", { name: "Stack" }));
    expect(onSelectBlock).toHaveBeenCalledWith("stack");
    fireEvent.click(screen.getByRole("button", { name: "Side by side" }));
    expect(onSelectBlock).toHaveBeenLastCalledWith("sbs");
  });

  it("the selection itself is not a button — it is where you already are", () => {
    cleanup();
    renderFor(heading, { trail: [stack, sbs], onSelectBlock: vi.fn() });
    expect(screen.queryByRole("button", { name: /heading/i })).toBeNull();
  });

  it("a block at the top of the page shows the lead and its name, and no trail", () => {
    cleanup();
    renderFor(heading, { trail: [], onSelectBlock: vi.fn() });
    expect(screen.queryByRole("navigation", { name: T.label })).toBeNull();
    expect(screen.getByText(new RegExp(`^${T.lead}`)).textContent).toContain("Heading");
  });

  it("after a click the keyboard focus lands on the newly selected block's name", async () => {
    cleanup();
    const onSelectBlock = vi.fn();
    const { rerender } = render(<BoxInspector node={heading} theme={DEFAULT_THEME} onPatch={vi.fn()} trail={[stack, sbs]} onSelectBlock={onSelectBlock} />);
    fireEvent.click(screen.getByRole("button", { name: "Side by side" }));
    rerender(<BoxInspector node={sbs} theme={DEFAULT_THEME} onPatch={vi.fn()} trail={[stack]} onSelectBlock={onSelectBlock} />);
    await waitFor(() => expect(document.activeElement?.textContent).toBe("Side by side"));
    expect(document.activeElement).toHaveAttribute("aria-current", "location");
  });
});

// LE-14 RC-7: a Stack, a Side by side or a Grid changes kind in one choice; what is left behind is said, aloud
describe("BoxInspector — RC-7 · Kind (LE-14)", () => {
  const K = INSPECTOR_WORDS.kind;
  it("a Stack shows Kind with Stack chosen, in place of Arrange as and Direction", () => {
    renderFor(createContainer("column", { id: "s" } as Partial<BoxNode>), { onKind: vi.fn(() => []) });
    const kind = screen.getByRole("group", { name: K.label });
    expect(within(kind).getByRole("button", { name: K.choices.stack })).toHaveAttribute("aria-pressed", "true");
    expect(screen.queryByRole("group", { name: "Arrange as" })).not.toBeInTheDocument();
    expect(screen.queryByRole("group", { name: "Direction" })).not.toBeInTheDocument();
  });
  it("choosing Grid asks for a Grid, and what was left behind is read out", () => {
    const onKind = vi.fn(() => ["spans"]);
    renderFor(createContainer("column", { id: "s" } as Partial<BoxNode>), { onKind });
    fireEvent.click(within(screen.getByRole("group", { name: K.label })).getByRole("button", { name: K.choices.grid }));
    expect(onKind).toHaveBeenCalledWith("grid");
    expect(screen.getByRole("status")).toHaveTextContent(K.left.replace("{list}", K.dropped.spans));
  });
  it("nothing left behind: the status line is empty", () => {
    renderFor(createContainer("column", { id: "s" } as Partial<BoxNode>), { onKind: vi.fn(() => []) });
    fireEvent.click(within(screen.getByRole("group", { name: K.label })).getByRole("button", { name: K.choices.row }));
    expect(screen.getByRole("status")).toHaveTextContent("");
  });
});

// LE-14 ED-7: a value on a screen other than the desktop says where it comes from; "Set here" resets that one value
describe("BoxInspector — ED-7 · Set here / From a wider screen (LE-14)", () => {
  const M = INSPECTOR_WORDS.marks;
  const SCREEN = Object.fromEntries(Object.entries(LAYOUT.rungs).map(([k, v]) => [k, v.label])) as Record<string, string>;
  const card = (responsive: BoxNode["responsive"]) => createContainer("column", { id: "s", radius: 8, opacity: 90, responsive } as Partial<BoxNode>);
  const resetName = (name: string, screen: string) => M.resetLabel.replace("{name}", name).replace("{screen}", screen);
  it("set on the phone: Rounded corners shows Set here, a button naming it and the screen, that resets it", () => {
    const onResetField = vi.fn();
    renderFor(card({ phone: { radius: 4 } }), { breakpoint: "phone", onResetField });
    const b = screen.getByRole("button", { name: resetName("Rounded corners", SCREEN.phone) });
    expect(b).toHaveTextContent(M.here);
    fireEvent.click(b);
    expect(onResetField).toHaveBeenCalledWith("radius");
  });
  it("set on the tablet, seen on the phone: names the tablet, and is no button", () => {
    renderFor(card({ tabletLandscape: { radius: 24 } }), { breakpoint: "phone", onResetField: vi.fn() });
    expect(screen.getByText(M.from.replace("{screen}", SCREEN.tabletLandscape))).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: resetName("Rounded corners", SCREEN.phone) })).not.toBeInTheDocument();
  });
  it("on the desktop: no mark at all", () => {
    renderFor(card({ phone: { radius: 4 } }), { breakpoint: "base", onResetField: vi.fn() });
    expect(screen.queryByText(M.here)).not.toBeInTheDocument();
  });
  it("the Per-device tab lists what is set on this screen, each with its reset; nothing set says so", () => {
    const onResetField = vi.fn();
    renderFor(card({ phone: { radius: 4, opacity: 50 } }), { breakpoint: "phone", onResetField });
    openDevice();
    const list = screen.getByRole("region", { name: M.listTitle.replace("{screen}", SCREEN.phone) });
    expect(within(list).getAllByRole("listitem").map((li) => li.textContent)).toEqual([`${M.names.radius}${M.reset}`, `${M.names.opacity}${M.reset}`]);
    fireEvent.click(within(list).getByRole("button", { name: resetName(M.names.opacity, SCREEN.phone) }));
    expect(onResetField).toHaveBeenCalledWith("opacity");
    cleanup();
    renderFor(card(undefined), { breakpoint: "phone", onResetField });
    openDevice();
    expect(screen.getByText(M.none.replace("{screen}", SCREEN.phone))).toBeInTheDocument();
  });
});
