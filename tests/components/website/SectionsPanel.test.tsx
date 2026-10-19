import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import SectionsPanel from "@/components/website/box/SectionsPanel";
import { DEFAULT_THEME } from "@/lib/site-storage";
import COPY from "@/config/section-copy.json";
import FINISHES from "@/config/section-finishes.json";
import SECTIONS from "@/config/sections.json";
import INSPECTOR from "@/config/inspector.json";
import type { BoxNode } from "@/lib/box-model";

/** The Sections group (BATCH LE-15) — box-builder-sections.feature: categories, adding, wireframe / designed, finish, search. */

const texts = (n: BoxNode): string[] => [...(n.text ? [n.text] : []), ...(n.children ?? []).flatMap(texts)];
const first = (n: BoxNode, type: string): BoxNode | undefined => (n.type === type ? n : (n.children ?? []).map((c) => first(c, type)).find(Boolean));
// jsdom has no ResizeObserver
globalThis.ResizeObserver ??= class { observe() {} disconnect() {} unobserve() {} } as unknown as typeof ResizeObserver;

async function open(q = "") {
  const onInsert = vi.fn();
  const utils = render(<SectionsPanel theme={DEFAULT_THEME} q={q} onInsert={onInsert} />);
  await screen.findByRole("tablist", { name: "Section categories" }, { timeout: 4000 }).catch(() => null);
  return { onInsert, ...utils };
}

describe("SectionsPanel", () => {
  it("lists the categories that hold layouts, each with its count, and opens on Hero", async () => {
    await open();
    const tabs = within(await screen.findByRole("tablist", { name: "Section categories" })).getAllByRole("tab");
    const names = tabs.map((t) => t.textContent);
    for (const label of ["Headers", "Hero / Welcome", "Footers", "Blank"]) expect(names.some((n) => n?.startsWith(label)), label).toBe(true);
    expect(tabs.find((t) => t.getAttribute("aria-selected") === "true")?.textContent).toMatch(/^Hero/);
  });

  // LE15b-15 (the user, 2026-10-19: "about us… could be a page on their own… should it not be known as a section")
  it("a section is never mistaken for a page: the tab says so, offers Add a page, names its kinds as sections, under their groups", async () => {
    const onAddPage = vi.fn();
    render(<SectionsPanel theme={DEFAULT_THEME} q="" onInsert={vi.fn()} onAddPage={onAddPage} />);
    const tabs = within(await screen.findByRole("tablist", { name: "Section categories" }, { timeout: 4000 })).getAllByRole("tab").map((t) => t.textContent ?? "");
    expect(screen.getByText(INSPECTOR.sections.wholePage)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: INSPECTOR.sections.wholePageButton }));
    expect(onAddPage).toHaveBeenCalledTimes(1);
    for (const c of SECTIONS.categories.filter((c) => tabs.some((t) => t.startsWith(c.label)) || c.batch === "LE-15b")) expect(tabs.some((t) => t.startsWith(c.label)), c.label).toBe(true);
    // no kind is named as a page a site would have
    for (const page of ["About", "Contact", "News", "Events", "Pricing / Fees", "Admissions steps", "FAQ"]) expect(SECTIONS.categories.map((c) => c.label), page).not.toContain(page);
    for (const g of SECTIONS.groups.filter((g) => SECTIONS.categories.some((c) => c.group === g && tabs.some((t) => t.startsWith(c.label))))) expect(screen.getByText(g), g).toBeInTheDocument();
  });

  it("a tile says what it adds, and a click adds that section as a landmark", async () => {
    const { onInsert } = await open();
    const tile = await screen.findByRole("button", { name: /^Add Centred words and two buttons, Hero \/ Welcome$/ });
    fireEvent.click(tile);
    const node = onInsert.mock.calls[0][0] as BoxNode;
    expect(node.tag).toBe("section");
    expect(texts(node)).toContain("A school where every child is known");
  });

  it("Wireframe gives the placeholders; Designed the school's words", async () => {
    const { onInsert } = await open();
    fireEvent.click(await screen.findByRole("radio", { name: "Wireframe" }).catch(() => screen.getByRole("button", { name: "Wireframe" })));
    fireEvent.click(await screen.findByRole("button", { name: /^Add Centred words and two buttons,/ }));
    expect(texts(onInsert.mock.calls[0][0] as BoxNode)).toContain(COPY.title);
  });

  it("the Finish changes the look of what is added (the size comes from config/section-finishes.json)", async () => {
    const { onInsert } = await open();
    fireEvent.click(await screen.findByRole("button", { name: /^Add Centred words and two buttons,/ }));
    const firstFinish = first(onInsert.mock.calls[0][0] as BoxNode, "heading")!.fontSize;
    expect(firstFinish).toBe(FINISHES.serious.roles.title.size);
    const select = document.querySelector<HTMLButtonElement>('button[aria-haspopup="listbox"]')!; // CompactSelect: a button that opens a listbox
    fireEvent.click(select);
    fireEvent.click(await screen.findByRole("option", { name: "Bold" }));
    fireEvent.click(screen.getByRole("button", { name: /^Add Centred words and two buttons,/ }));
    expect(first(onInsert.mock.calls[1][0] as BoxNode, "heading")!.fontSize).toBe(FINISHES.bold.roles.title.size);
  });

  it("PS-5 (1) · My sections: shown once one is saved; a tile adds a copy; Rename and Delete ask first", async () => {
    localStorage.clear();
    const { createContainer, createElement } = await import("@/lib/box-model");
    const { saveSection, listSaved } = await import("@/lib/saved-sections");
    const s = createContainer("column", { tag: "section" }); s.children = [createElement("heading", { text: "Open day is Saturday" })];
    saveSection(s, "Open day banner");
    const { onInsert } = await open();
    fireEvent.click(await screen.findByRole("tab", { name: /^My sections/ }));
    fireEvent.click(await screen.findByRole("button", { name: "Add Open day banner, My sections" }));
    expect(texts(onInsert.mock.calls[0][0] as BoxNode)).toContain("Open day is Saturday");
    fireEvent.click(screen.getByRole("button", { name: "Rename" }));
    const field = await screen.findByRole("textbox");
    fireEvent.change(field, { target: { value: "Open day" } });
    fireEvent.click(screen.getAllByRole("button", { name: "Rename" }).at(-1)!);
    expect(listSaved()[0].name).toBe("Open day");
    fireEvent.click(await screen.findByRole("button", { name: "Delete" }));
    expect(listSaved().length, "not before the person confirms").toBe(1);
    const confirm = await screen.findAllByRole("button", { name: "Delete" });
    fireEvent.click(confirm.at(-1)!);
    expect(listSaved()).toEqual([]);
    localStorage.clear();
  });

  it("PS-5 (2) · Global sections: listed with the pages that use them; a tile adds another copy (still global); Stop being global asks first", async () => {
    const { createContainer, createElement } = await import("@/lib/box-model");
    const node = createContainer("column", { tag: "section", globalId: "g1", globalName: "Admissions banner" }); node.children = [createElement("heading", { text: "Admissions open" })];
    const onInsert = vi.fn(), onRemoveGlobal = vi.fn();
    render(<SectionsPanel theme={DEFAULT_THEME} q="" onInsert={onInsert} globals={[{ id: "g1", name: "Admissions banner", pages: 3, node }]} onRemoveGlobal={onRemoveGlobal} />);
    fireEvent.click(await screen.findByRole("tab", { name: /^Global sections/ }));
    expect(screen.getByText("used on 3 pages")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Add Admissions banner, Global sections" }));
    const added = onInsert.mock.calls[0][0] as BoxNode;
    expect(added.globalId, "still a copy of the global").toBe("g1");
    expect(added.id, "its own id").not.toBe(node.id);
    fireEvent.click(screen.getByRole("button", { name: "Stop being global" }));
    expect(onRemoveGlobal).not.toHaveBeenCalled();
    fireEvent.click((await screen.findAllByRole("button", { name: "Stop being global" })).at(-1)!);
    expect(onRemoveGlobal).toHaveBeenCalledWith("g1");
  });

  it("a search finds sections by name or category, across every category", async () => {
    await open("footer");
    expect((await screen.findAllByRole("button", { name: /Footers$/ })).length).toBeGreaterThan(0);
    expect(screen.queryByRole("button", { name: /Hero \/ Welcome$/ })).toBeNull();
    expect(screen.queryByRole("tablist", { name: "Section categories" })).toBeNull();
  });
});
