/**
 * MY SECTIONS and MY PAGE TEMPLATES (BATCH LE-15, PS-5 (1) and (3); signed D4 2026-10-19 — box-builder-sections.feature).
 *
 * What a person saves to reuse. Kept in its OWN store, beside the sites rather than inside one, so every site built on this
 * account sees it (D4). A saved thing is a COPY (as Wix's Save as Asset, Squarespace's saved sections, Webflow's page
 * templates): placing it gives fresh ids, and changing a placed one never reaches the saved one or another copy. The limits
 * are config (config/sections.json limits: Squarespace's 250 sections, Webflow's 40 page templates).
 * ponytail: the account's store is this browser's, as the sites are today (lib/box-site persists to localStorage too); it moves
 * with them when sites are saved to the server.
 */
import SECTIONS from "@/config/sections.json";
import { cloneBox, newBoxId, type BoxNode } from "@/lib/box-model";

export interface SavedSection { id: string; name: string; savedAt: number; node: BoxNode }
export type SaveResult = { ok: true; id: string } | { ok: false; reason: "name" } | { ok: false; reason: "limit"; limit: number };

/** Said on `window` after every change, so an open panel shows something saved from elsewhere at once. */
export const MY_SECTIONS_EVENT = "educo:my-sections";

function store(key: string, limit: () => number) {
  /** Everything saved, oldest first. A store that cannot be read is an empty one (a private window, a damaged value). */
  const list = (): SavedSection[] => {
    try {
      const v = JSON.parse(localStorage.getItem(key) ?? "[]") as unknown;
      return Array.isArray(v) ? (v as SavedSection[]).filter((s) => s && typeof s.id === "string" && typeof s.name === "string" && !!s.node) : [];
    } catch { return []; }
  };
  const write = (all: SavedSection[]) => {
    localStorage.setItem(key, JSON.stringify(all));
    if (typeof window !== "undefined") window.dispatchEvent(new Event(MY_SECTIONS_EVENT));
  };
  return {
    key,
    list,
    save(node: BoxNode, name: string): SaveResult {
      const clean = name.trim();
      if (!clean) return { ok: false, reason: "name" };
      const all = list();
      if (all.length >= limit()) return { ok: false, reason: "limit", limit: limit() };
      const id = newBoxId();
      write([...all, { id, name: clean, savedAt: Date.now(), node: cloneBox(node) }]);
      return { ok: true, id };
    },
    rename(id: string, name: string) { const clean = name.trim(); if (clean) write(list().map((s) => (s.id === id ? { ...s, name: clean } : s))); },
    remove(id: string) { write(list().filter((s) => s.id !== id)); },
    /** A saved one ready to place: a fresh copy, its own ids. */
    copy(id: string): BoxNode | null { const s = list().find((x) => x.id === id); return s ? cloneBox(s.node) : null; },
  };
}

export const mySections = store("educo:my-sections", () => SECTIONS.limits.mySections);
export const myTemplates = store("educo:my-templates", () => SECTIONS.limits.myTemplates);

// My sections, by the names the Sections panel and the page use.
export const MY_SECTIONS_KEY = mySections.key;
export const listSaved = mySections.list;
export const saveSection = (node: BoxNode, name: string) => mySections.save(node, name);
export const renameSaved = (id: string, name: string) => mySections.rename(id, name);
export const deleteSaved = (id: string) => mySections.remove(id);
export const savedAsNode = (id: string) => mySections.copy(id);
