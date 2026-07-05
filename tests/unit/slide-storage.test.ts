import { describe, it, expect, beforeEach, vi } from "vitest";
import { slideStorage, DEFAULT_PERMISSIONS, createMediaObj, fitDrawingToStroke, createImageObj, createShapeObj } from "@/lib/slide-storage";

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

  describe("moveToFolder()", () => {
    it("moves a presentation to a specified folder", () => {
      const id = slideStorage.create({ title: "Test" });
      slideStorage.moveToFolder(id, "Documents");
      expect(slideStorage.getFolder(id)).toBe("Documents");
    });

    it("updates the updatedAt timestamp", () => {
      const id = slideStorage.create({ title: "Test" });
      const before = slideStorage.get(id)!.updatedAt;
      slideStorage.moveToFolder(id, "Images");
      const after = slideStorage.get(id)!.updatedAt;
      expect(new Date(after).getTime()).toBeGreaterThanOrEqual(new Date(before).getTime());
    });
  });

  describe("getFolder()", () => {
    it("returns 'Presentations' as default folder", () => {
      const id = slideStorage.create({});
      expect(slideStorage.getFolder(id)).toBe("Presentations");
    });

    it("returns the assigned folder", () => {
      const id = slideStorage.create({});
      slideStorage.moveToFolder(id, "My Drive");
      expect(slideStorage.getFolder(id)).toBe("My Drive");
    });
  });

  describe("moveToBin()", () => {
    it("moves a presentation to the Bin folder", () => {
      const id = slideStorage.create({ title: "Delete Me" });
      slideStorage.moveToBin(id);
      expect(slideStorage.getFolder(id)).toBe("Bin");
    });

    it("does not permanently delete the presentation", () => {
      const id = slideStorage.create({ title: "Still Here" });
      slideStorage.moveToBin(id);
      expect(slideStorage.get(id)).not.toBeNull();
      expect(slideStorage.get(id)!.title).toBe("Still Here");
    });
  });

  describe("permissions", () => {
    it("returns default permissions for new presentations", () => {
      const id = slideStorage.create({});
      const perms = slideStorage.getPermissions(id);
      expect(perms.preventAccessChange).toBe(false);
      expect(perms.disableCopyPrintDownload).toBe(false);
      expect(perms.requireSignIn).toBe(true);
    });

    it("saves and retrieves permissions", () => {
      const id = slideStorage.create({});
      slideStorage.setPermissions(id, {
        preventAccessChange: true,
        disableCopyPrintDownload: true,
        requireSignIn: false,
      });
      const perms = slideStorage.getPermissions(id);
      expect(perms.preventAccessChange).toBe(true);
      expect(perms.disableCopyPrintDownload).toBe(true);
      expect(perms.requireSignIn).toBe(false);
    });

    it("persists permissions across get calls", () => {
      const id = slideStorage.create({});
      slideStorage.setPermissions(id, { ...DEFAULT_PERMISSIONS, disableCopyPrintDownload: true });
      const perms1 = slideStorage.getPermissions(id);
      const perms2 = slideStorage.getPermissions(id);
      expect(perms1.disableCopyPrintDownload).toBe(true);
      expect(perms2.disableCopyPrintDownload).toBe(true);
    });

    it("returns default permissions for non-existent presentation", () => {
      const perms = slideStorage.getPermissions("nonexistent");
      expect(perms).toEqual(DEFAULT_PERMISSIONS);
    });

    it("updates the updatedAt timestamp when setting permissions", () => {
      const id = slideStorage.create({});
      const before = slideStorage.get(id)!.updatedAt;
      slideStorage.setPermissions(id, { ...DEFAULT_PERMISSIONS, preventAccessChange: true });
      const after = slideStorage.get(id)!.updatedAt;
      expect(new Date(after).getTime()).toBeGreaterThanOrEqual(new Date(before).getTime());
    });
  });
});

describe("createMediaObj (audio/video)", () => {
  it("creates an audio object", () => {
    const m = createMediaObj("audio", "https://x/a.mp3");
    expect(m.type).toBe("media");
    expect(m.mediaKind).toBe("audio");
    expect(m.src).toBe("https://x/a.mp3");
    expect(m.height).toBeLessThan(20); // audio is a short bar
  });
  it("creates a video object with overrides", () => {
    const m = createMediaObj("video", "https://x/v.mp4", { loop: true, x: 5 });
    expect(m.mediaKind).toBe("video");
    expect(m.loop).toBe(true);
    expect(m.x).toBe(5);
  });
});

describe("fitDrawingToStroke — tight bounding box for freeform strokes", () => {
  it("shrinks a mid-slide stroke to a tight box instead of the whole page", () => {
    // A small stroke in the 40–60 region should NOT produce a 0,0,100,100 box.
    const { x, y, width, height } = fitDrawingToStroke("M 40 40 L 60 50 L 50 60");
    expect(x).toBeGreaterThan(30);
    expect(y).toBeGreaterThan(30);
    expect(width).toBeLessThan(40);
    expect(height).toBeLessThan(40);
  });

  it("keeps the box within the slide (0–100) even with padding", () => {
    const box = fitDrawingToStroke("M 0 0 L 100 100");
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.y).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(100);
    expect(box.y + box.height).toBeLessThanOrEqual(100);
  });

  it("rewrites path coordinates into the box's local 0–100 space", () => {
    const { paths } = fitDrawingToStroke("M 40 40 L 60 60", 0);
    // With pad 0 the box is exactly 40–60; endpoints map to 0 and 100 locally.
    const nums = (paths.match(/-?\d+(?:\.\d+)?/g) || []).map(Number);
    expect(Math.min(...nums)).toBeCloseTo(0, 1);
    expect(Math.max(...nums)).toBeCloseTo(100, 1);
  });

  it("preserves visual position (local coords map back to the original point)", () => {
    const src = "M 30 20 L 70 80";
    const { x, y, width, height, paths } = fitDrawingToStroke(src, 0);
    const [lx, ly] = (paths.match(/-?\d+(?:\.\d+)?/g) || []).slice(0, 2).map(Number);
    // First point back-projected: x + (local/100)*width should equal the original 30.
    expect(x + (lx / 100) * width).toBeCloseTo(30, 1);
    expect(y + (ly / 100) * height).toBeCloseTo(20, 1);
  });

  it("handles a degenerate (single-point / straight) stroke without zero size", () => {
    const box = fitDrawingToStroke("M 50 50");
    expect(box.width).toBeGreaterThan(0);
    expect(box.height).toBeGreaterThan(0);
  });

  it("returns a full-page box when there is no coordinate data", () => {
    expect(fitDrawingToStroke("")).toEqual({ paths: "", x: 0, y: 0, width: 100, height: 100 });
  });
});

describe("createImageObj — full image never cropped by default", () => {
  it("defaults objectFit to 'contain' so the whole image stays visible when resized", () => {
    const img = createImageObj("https://x/pic.png");
    expect(img.objectFit).toBe("contain");
  });
  it("still lets callers opt into 'cover'", () => {
    const img = createImageObj("https://x/pic.png", { objectFit: "cover" });
    expect(img.objectFit).toBe("cover");
  });
});

describe("createShapeObj", () => {
  it("creates a shape with the given key and a fill", () => {
    const s = createShapeObj("line-h", { fill: "#ff0000" });
    expect(s.type).toBe("shape");
    expect(s.shape).toBe("line-h");
    expect(s.fill).toBe("#ff0000");
  });
});
