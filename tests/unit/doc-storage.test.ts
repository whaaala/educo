import { describe, it, expect, beforeEach, vi } from "vitest";
import { docStorage } from "@/lib/doc-storage";

// Mock localStorage
const store: Record<string, string> = {};
const localStorageMock = {
  getItem: vi.fn((key: string) => store[key] || null),
  setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
  removeItem: vi.fn((key: string) => { delete store[key]; }),
  clear: vi.fn(() => { Object.keys(store).forEach(k => delete store[k]); }),
};
Object.defineProperty(globalThis, "localStorage", { value: localStorageMock, writable: true });

describe("doc-storage — Document Persistence Layer", () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  describe("create()", () => {
    it("creates a document with a unique ID", () => {
      const id = docStorage.create({ title: "Test Doc", html: "<p>Hello</p>" });
      expect(id).toMatch(/^doc-/);
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });

    it("stores the document with correct fields", () => {
      const id = docStorage.create({ title: "My Doc", html: "<p>Content</p>", language: "en" });
      const doc = docStorage.get(id);
      expect(doc).not.toBeNull();
      expect(doc!.title).toBe("My Doc");
      expect(doc!.html).toBe("<p>Content</p>");
      expect(doc!.language).toBe("en");
      expect(doc!.owner).toBe("Me");
      expect(doc!.starred).toBe(false);
    });

    it("uses defaults for missing fields", () => {
      const id = docStorage.create({});
      const doc = docStorage.get(id);
      expect(doc!.title).toBe("Untitled document");
      expect(doc!.html).toBe("");
      expect(doc!.language).toBe("en");
    });

    it("sets createdAt and updatedAt as ISO strings", () => {
      const id = docStorage.create({ title: "Test" });
      const doc = docStorage.get(id);
      expect(new Date(doc!.createdAt).toISOString()).toBe(doc!.createdAt);
      expect(new Date(doc!.updatedAt).toISOString()).toBe(doc!.updatedAt);
    });
  });

  describe("list()", () => {
    it("returns empty array when no documents exist", () => {
      expect(docStorage.list()).toEqual([]);
    });

    it("returns all documents", () => {
      docStorage.create({ title: "First" });
      docStorage.create({ title: "Second" });
      docStorage.create({ title: "Third" });
      const list = docStorage.list();
      expect(list.length).toBe(3);
      expect(list.map(d => d.title)).toContain("First");
      expect(list.map(d => d.title)).toContain("Third");
    });
  });

  describe("get()", () => {
    it("returns the document by ID", () => {
      const id = docStorage.create({ title: "Find Me" });
      const doc = docStorage.get(id);
      expect(doc).not.toBeNull();
      expect(doc!.title).toBe("Find Me");
    });

    it("returns null for non-existent ID", () => {
      expect(docStorage.get("doc-nonexistent")).toBeNull();
    });
  });

  describe("update()", () => {
    it("updates the title", () => {
      const id = docStorage.create({ title: "Old Title" });
      docStorage.update(id, { title: "New Title" });
      expect(docStorage.get(id)!.title).toBe("New Title");
    });

    it("updates the html", () => {
      const id = docStorage.create({ html: "<p>Old</p>" });
      docStorage.update(id, { html: "<p>New</p>" });
      expect(docStorage.get(id)!.html).toBe("<p>New</p>");
    });

    it("updates updatedAt timestamp", () => {
      const id = docStorage.create({ title: "Test" });
      const before = docStorage.get(id)!.updatedAt;
      docStorage.update(id, { title: "Updated" });
      const after = docStorage.get(id)!.updatedAt;
      // updatedAt should be same or newer (may be same ms)
      expect(new Date(after).getTime()).toBeGreaterThanOrEqual(new Date(before).getTime());
    });

    it("does nothing for non-existent ID", () => {
      docStorage.update("doc-fake", { title: "Ghost" });
      expect(docStorage.get("doc-fake")).toBeNull();
    });
  });

  describe("toggleStar()", () => {
    it("toggles starred from false to true", () => {
      const id = docStorage.create({ title: "Star Me" });
      expect(docStorage.get(id)!.starred).toBe(false);
      docStorage.toggleStar(id);
      expect(docStorage.get(id)!.starred).toBe(true);
    });

    it("toggles starred from true to false", () => {
      const id = docStorage.create({ title: "Unstar Me" });
      docStorage.toggleStar(id);
      expect(docStorage.get(id)!.starred).toBe(true);
      docStorage.toggleStar(id);
      expect(docStorage.get(id)!.starred).toBe(false);
    });
  });

  describe("remove()", () => {
    it("removes the document", () => {
      const id = docStorage.create({ title: "Delete Me" });
      expect(docStorage.get(id)).not.toBeNull();
      docStorage.remove(id);
      expect(docStorage.get(id)).toBeNull();
    });

    it("does not affect other documents", () => {
      const id1 = docStorage.create({ title: "Keep" });
      const id2 = docStorage.create({ title: "Delete" });
      docStorage.remove(id2);
      expect(docStorage.get(id1)).not.toBeNull();
      expect(docStorage.list().length).toBe(1);
    });
  });

  describe("Edge cases", () => {
    it("handles corrupted localStorage gracefully", () => {
      store["educo_documents"] = "NOT VALID JSON{{{";
      expect(docStorage.list()).toEqual([]);
    });

    it("handles empty localStorage", () => {
      expect(docStorage.list()).toEqual([]);
    });
  });
});
