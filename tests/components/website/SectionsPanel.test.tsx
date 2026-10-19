import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import SectionsPanel from "@/components/website/box/SectionsPanel";
import { DEFAULT_THEME } from "@/lib/site-storage";
import COPY from "@/config/section-copy.json";
import FINISHES from "@/config/section-finishes.json";
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

  it("a search finds sections by name or category, across every category", async () => {
    await open("footer");
    expect((await screen.findAllByRole("button", { name: /Footers$/ })).length).toBeGreaterThan(0);
    expect(screen.queryByRole("button", { name: /Hero \/ Welcome$/ })).toBeNull();
    expect(screen.queryByRole("tablist", { name: "Section categories" })).toBeNull();
  });
});
