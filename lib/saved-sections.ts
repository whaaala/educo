/**
 * MY SECTIONS (BATCH LE-15, PS-5 (1); signed D4 2026-10-19 — box-builder-sections.feature).
 *
 * A section a person saves to reuse. Kept in its OWN store, beside the sites rather than inside one, so every site built on
 * this account sees it (D4). A saved section is a COPY (as Wix's Save as Asset, Squarespace's saved sections): placing it
 * gives fresh ids, and changing a placed one never reaches the saved one or another copy. The limit is config
 * (config/sections.json limits.mySections, Squarespace's 250).
 * ponytail: the account's store is this browser's, as the sites are today (lib/box-site persists to localStorage too); it moves
 * with them when sites are saved to the server.
 */
import SECTIONS from "@/config/sections.json";
import { cloneBox, newBoxId, type BoxNode } from "@/lib/box-model";

export const MY_SECTIONS_KEY = "educo:my-sections";
export interface SavedSection { id: string; name: string; savedAt: number; node: BoxNode }
export type SaveResult = { ok: true; id: string } | { ok: false; reason: "name" } | { ok: false; reason: "limit"; limit: number };

/** Every saved section, oldest first. A store that cannot be read is an empty one (a private window, a damaged value). */
export function listSaved(): SavedSection[] {
  try {
    const v = JSON.parse(localStorage.getItem(MY_SECTIONS_KEY) ?? "[]") as unknown;
    return Array.isArray(v) ? (v as SavedSection[]).filter((s) => s && typeof s.id === "string" && typeof s.name === "string" && !!s.node) : [];
  } catch { return []; }
}
/** Said on `window` after every change, so an open Sections panel shows a section saved from the Inspector at once. */
export const MY_SECTIONS_EVENT = "educo:my-sections";
function write(all: SavedSection[]) {
  localStorage.setItem(MY_SECTIONS_KEY, JSON.stringify(all));
  if (typeof window !== "undefined") window.dispatchEvent(new Event(MY_SECTIONS_EVENT));
}

export function saveSection(node: BoxNode, name: string): SaveResult {
  const clean = name.trim();
  if (!clean) return { ok: false, reason: "name" };
  const all = listSaved();
  const limit = SECTIONS.limits.mySections;
  if (all.length >= limit) return { ok: false, reason: "limit", limit };
  const id = newBoxId();
  write([...all, { id, name: clean, savedAt: Date.now(), node: cloneBox(node) }]);
  return { ok: true, id };
}

export function renameSaved(id: string, name: string): void {
  const clean = name.trim();
  if (clean) write(listSaved().map((s) => (s.id === id ? { ...s, name: clean } : s)));
}

export function deleteSaved(id: string): void { write(listSaved().filter((s) => s.id !== id)); }

/** A saved section ready to place: a fresh copy, its own ids. */
export function savedAsNode(id: string): BoxNode | null {
  const s = listSaved().find((x) => x.id === id);
  return s ? cloneBox(s.node) : null;
}
