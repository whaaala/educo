import { describe, it, expect, beforeEach } from "vitest";
import SECTIONS from "@/config/sections.json";
import { listSaved, saveSection, renameSaved, deleteSaved, savedAsNode, MY_SECTIONS_KEY } from "@/lib/saved-sections";
import { createContainer, createElement, type BoxNode } from "@/lib/box-model";

/** PS-5 (1) · "Save a section to reuse" — box-builder-sections.feature (My sections, in every site; a copy; rename / delete; the limit). */

const section = (words: string) => { const s = createContainer("column", { tag: "section" }); s.children = [createElement("heading", { text: words })]; return s; };
const words = (n: BoxNode): string[] => [...(n.text ? [n.text] : []), ...(n.children ?? []).flatMap(words)];
const ids = (n: BoxNode): string[] => [n.id, ...(n.children ?? []).flatMap(ids)];

describe("my sections", () => {
  beforeEach(() => localStorage.clear());

  it("saving keeps it under its name, in a store of its own — not inside any one site (D4: every site on the account)", () => {
    const r = saveSection(section("Open day"), "Open day banner");
    expect(r.ok).toBe(true);
    expect(listSaved().map((s) => s.name)).toEqual(["Open day banner"]);
    expect(Object.keys(localStorage)).toEqual([MY_SECTIONS_KEY]);
  });

  it("a saved section is a COPY: changing the one on the page changes neither the saved one nor another copy", () => {
    const s = section("Open day");
    saveSection(s, "Open day banner");
    s.children![0].text = "Changed on the page";
    const a = savedAsNode(listSaved()[0].id)!;
    const b = savedAsNode(listSaved()[0].id)!;
    expect(words(a)).toEqual(["Open day"]);
    a.children![0].text = "Changed in one copy";
    expect(words(b)).toEqual(["Open day"]);
    expect(ids(a).some((id) => ids(b).includes(id)), "each copy has its own ids").toBe(false);
  });

  it("renaming and deleting", () => {
    saveSection(section("A"), "Open day banner");
    const id = listSaved()[0].id;
    renameSaved(id, "Open day");
    expect(listSaved()[0].name).toBe("Open day");
    deleteSaved(id);
    expect(listSaved()).toEqual([]);
  });

  it("a blank name is refused, and nothing is saved", () => {
    expect(saveSection(section("A"), "   ").ok).toBe(false);
    expect(listSaved()).toEqual([]);
  });

  it("the limit comes from config/sections.json; the one past it is refused and says why, and nothing is lost", () => {
    const limit = SECTIONS.limits.mySections;
    const many = Array.from({ length: limit }, (_, i) => ({ id: `s${i}`, name: `S${i}`, savedAt: 0, node: section(`S${i}`) }));
    localStorage.setItem(MY_SECTIONS_KEY, JSON.stringify(many));
    const r = saveSection(section("one more"), "One more");
    expect(r).toEqual({ ok: false, reason: "limit", limit });
    expect(listSaved().length).toBe(limit);
  });

  it("a store that cannot be read (private window, damaged) reads as empty instead of breaking the panel", () => {
    localStorage.setItem(MY_SECTIONS_KEY, "{not json");
    expect(listSaved()).toEqual([]);
  });
});
