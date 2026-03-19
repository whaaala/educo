import { describe, it, expect, beforeEach, vi } from "vitest";
import { slideStorage } from "@/lib/slide-storage";

const store: Record<string, string> = {};
const localStorageMock = {
  getItem: vi.fn((key: string) => store[key] || null),
  setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
  removeItem: vi.fn((key: string) => { delete store[key]; }),
  clear: vi.fn(() => { Object.keys(store).forEach(k => delete store[k]); }),
};
Object.defineProperty(globalThis, "localStorage", { value: localStorageMock, writable: true });

describe("slide-storage — Presentation Persistence Layer", () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  describe("create()", () => {
    it("creates a presentation with a unique ID", () => {
      const id = slideStorage.create({});
      expect(id).toMatch(/^pres-/);
    });

    it("default presentation has 1 slide", () => {
      const id = slideStorage.create({});
      const pres = slideStorage.get(id);
      expect(pres).not.toBeNull();
      expect(pres!.slides.length).toBeGreaterThanOrEqual(1);
    });

    it("stores title, owner, timestamps", () => {
      const id = slideStorage.create({ title: "My Deck" });
      const pres = slideStorage.get(id);
      expect(pres!.title).toBe("My Deck");
      expect(pres!.owner).toBe("Me");
      expect(pres!.starred).toBe(false);
      expect(new Date(pres!.createdAt).toISOString()).toBe(pres!.createdAt);
    });
  });

  describe("list()", () => {
    it("returns empty array when no presentations exist", () => {
      expect(slideStorage.list()).toEqual([]);
    });

    it("returns all presentations", () => {
      slideStorage.create({ title: "A" });
      slideStorage.create({ title: "B" });
      expect(slideStorage.list().length).toBe(2);
    });
  });

  describe("get()", () => {
    it("returns presentation by ID", () => {
      const id = slideStorage.create({ title: "Find Me" });
      expect(slideStorage.get(id)!.title).toBe("Find Me");
    });

    it("returns null for missing ID", () => {
      expect(slideStorage.get("pres-nonexistent")).toBeNull();
    });
  });

  describe("update()", () => {
    it("updates title", () => {
      const id = slideStorage.create({ title: "Old" });
      slideStorage.update(id, { title: "New" });
      expect(slideStorage.get(id)!.title).toBe("New");
    });

    it("updates slides", () => {
      const id = slideStorage.create({});
      const newSlides = [slideStorage.makeSlide("<h1>Updated</h1>")];
      slideStorage.update(id, { slides: newSlides });
      expect(slideStorage.get(id)!.slides[0].content).toContain("Updated");
    });
  });

  describe("toggleStar()", () => {
    it("toggles starred", () => {
      const id = slideStorage.create({});
      expect(slideStorage.get(id)!.starred).toBe(false);
      slideStorage.toggleStar(id);
      expect(slideStorage.get(id)!.starred).toBe(true);
      slideStorage.toggleStar(id);
      expect(slideStorage.get(id)!.starred).toBe(false);
    });
  });

  describe("remove()", () => {
    it("removes the presentation", () => {
      const id = slideStorage.create({});
      slideStorage.remove(id);
      expect(slideStorage.get(id)).toBeNull();
    });
  });

  describe("makeSlide()", () => {
    it("creates a slide with all required fields", () => {
      const slide = slideStorage.makeSlide("<p>Test</p>", "#f0f0f0");
      expect(slide.id).toMatch(/^slide-/);
      expect(slide.content).toBe("<p>Test</p>");
      expect(slide.background).toBe("#f0f0f0");
      expect(slide.notes).toBe("");
      expect(slide.transition).toBe("fade");
    });
  });
});
