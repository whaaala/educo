import { describe, it, expect, beforeEach, vi } from "vitest";
import { driveStorage } from "@/lib/drive-storage";

// Mock localStorage
const store: Record<string, string> = {};
const localStorageMock = {
  getItem: vi.fn((key: string) => store[key] || null),
  setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
  removeItem: vi.fn((key: string) => { delete store[key]; }),
  clear: vi.fn(() => { Object.keys(store).forEach(k => delete store[k]); }),
};
Object.defineProperty(globalThis, "localStorage", { value: localStorageMock, writable: true });

describe("drive-storage — Virtual File System", () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  describe("Default folder seeding", () => {
    it("creates default folders on first access", () => {
      const items = driveStorage.list();
      expect(items.length).toBeGreaterThanOrEqual(9);
      const names = items.map(i => i.name);
      expect(names).toContain("My Drive");
      expect(names).toContain("Documents");
      expect(names).toContain("Presentations");
      expect(names).toContain("Spreadsheets");
      expect(names).toContain("Images");
      expect(names).toContain("Shared with me");
      expect(names).toContain("Bin");
    });

    it("marks system folders as readOnly", () => {
      const items = driveStorage.list();
      const sharedFolder = items.find(i => i.name === "Shared with me");
      expect(sharedFolder?.readOnly).toBe(true);
      const binFolder = items.find(i => i.name === "Bin");
      expect(binFolder?.readOnly).toBe(true);
    });

    it("does not re-seed if items already exist", () => {
      driveStorage.list(); // first access seeds
      const count1 = driveStorage.list().length;
      const count2 = driveStorage.list().length;
      expect(count1).toBe(count2);
    });
  });

  describe("createFolder()", () => {
    it("creates a folder with a unique id", () => {
      const id = driveStorage.createFolder("folder-my-drive", "Reports");
      expect(id).toMatch(/^folder-/);
      const folder = driveStorage.get(id);
      expect(folder).not.toBeNull();
      expect(folder!.name).toBe("Reports");
      expect(folder!.type).toBe("folder");
      expect(folder!.parentId).toBe("folder-my-drive");
    });
  });

  describe("create() for files", () => {
    it("creates a file with sourceId and sourceType", () => {
      const id = driveStorage.create({
        parentId: "folder-documents",
        name: "Budget.xlsx",
        type: "file",
        sourceId: "doc-123",
        sourceType: "spreadsheet",
      });
      const file = driveStorage.get(id);
      expect(file).not.toBeNull();
      expect(file!.name).toBe("Budget.xlsx");
      expect(file!.type).toBe("file");
      expect(file!.sourceId).toBe("doc-123");
      expect(file!.sourceType).toBe("spreadsheet");
    });
  });

  describe("getChildren()", () => {
    it("returns children of a folder sorted folders-first then alphabetically", () => {
      driveStorage.list(); // ensure defaults
      const children = driveStorage.getChildren("folder-my-drive");
      expect(children.length).toBe(4); // Documents, Images, Presentations, Spreadsheets
      // All should be folders
      expect(children.every(c => c.type === "folder")).toBe(true);
      // Should be alphabetically sorted
      const names = children.map(c => c.name);
      expect(names).toEqual([...names].sort());
    });
  });

  describe("getFolders()", () => {
    it("returns only folder children", () => {
      driveStorage.list();
      // Add a file to My Drive
      driveStorage.create({ parentId: "folder-my-drive", name: "readme.txt", type: "file" });
      const folders = driveStorage.getFolders("folder-my-drive");
      expect(folders.every(f => f.type === "folder")).toBe(true);
    });
  });

  describe("getPath()", () => {
    it("builds breadcrumb path from root to folder", () => {
      driveStorage.list();
      const path = driveStorage.getPath("folder-documents");
      const names = path.map(p => p.name);
      expect(names).toEqual(["My Drive", "Documents"]);
    });

    it("builds deeper path for nested folders", () => {
      driveStorage.list();
      const archiveId = driveStorage.createFolder("folder-documents", "Archive");
      const path = driveStorage.getPath(archiveId);
      const names = path.map(p => p.name);
      expect(names).toEqual(["My Drive", "Documents", "Archive"]);
    });
  });

  describe("rename()", () => {
    it("renames an item", () => {
      driveStorage.list();
      const id = driveStorage.create({ parentId: "folder-documents", name: "Old.txt", type: "file" });
      driveStorage.rename(id, "New.txt");
      const item = driveStorage.get(id);
      expect(item!.name).toBe("New.txt");
    });
  });

  describe("remove()", () => {
    it("removes a file", () => {
      driveStorage.list();
      const id = driveStorage.create({ parentId: "folder-documents", name: "Temp.txt", type: "file" });
      expect(driveStorage.get(id)).not.toBeNull();
      driveStorage.remove(id);
      expect(driveStorage.get(id)).toBeNull();
    });

    it("removes a folder and all its descendants", () => {
      driveStorage.list();
      const folderId = driveStorage.createFolder("folder-my-drive", "Project");
      const subId = driveStorage.createFolder(folderId, "Sub");
      const fileId = driveStorage.create({ parentId: subId, name: "data.csv", type: "file" });
      driveStorage.remove(folderId);
      expect(driveStorage.get(folderId)).toBeNull();
      expect(driveStorage.get(subId)).toBeNull();
      expect(driveStorage.get(fileId)).toBeNull();
    });
  });

  describe("move()", () => {
    it("moves a file to a different folder", () => {
      driveStorage.list();
      const fileId = driveStorage.create({ parentId: "folder-presentations", name: "Slides.pptx", type: "file" });
      const result = driveStorage.move(fileId, "folder-documents");
      expect(result.success).toBe(true);
      expect(result.oldParentName).toBe("Presentations");
      expect(result.newParentName).toBe("Documents");
      expect(driveStorage.get(fileId)!.parentId).toBe("folder-documents");
    });

    it("fails when moving to the same location", () => {
      driveStorage.list();
      const fileId = driveStorage.create({ parentId: "folder-presentations", name: "Slides.pptx", type: "file" });
      const result = driveStorage.move(fileId, "folder-presentations");
      expect(result.success).toBe(false);
      expect(result.error).toBe("Item is already in this folder");
    });

    it("fails when moving to a read-only folder", () => {
      driveStorage.list();
      const fileId = driveStorage.create({ parentId: "folder-presentations", name: "Slides.pptx", type: "file" });
      const sharedFolder = driveStorage.list().find(i => i.name === "Shared with me");
      const result = driveStorage.move(fileId, sharedFolder!.id);
      expect(result.success).toBe(false);
      expect(result.error).toContain("read-only");
    });

    it("fails when moving a folder into itself", () => {
      driveStorage.list();
      const folderId = driveStorage.createFolder("folder-my-drive", "Project");
      const result = driveStorage.move(folderId, folderId);
      expect(result.success).toBe(false);
      expect(result.error).toContain("Cannot move a folder into itself");
    });

    it("fails when moving a folder into its own descendant", () => {
      driveStorage.list();
      const parentId = driveStorage.createFolder("folder-my-drive", "Parent");
      const childId = driveStorage.createFolder(parentId, "Child");
      const result = driveStorage.move(parentId, childId);
      expect(result.success).toBe(false);
      expect(result.error).toContain("Cannot move a folder into itself");
    });

    it("fails when item does not exist", () => {
      driveStorage.list();
      const result = driveStorage.move("nonexistent-id", "folder-documents");
      expect(result.success).toBe(false);
      expect(result.error).toBe("Item not found");
    });
  });

  describe("ensureFileEntry()", () => {
    it("creates a new entry if source not found", () => {
      driveStorage.list();
      const item = driveStorage.ensureFileEntry("pres-123", "My Deck", "presentation");
      expect(item.name).toBe("My Deck");
      expect(item.sourceId).toBe("pres-123");
      expect(item.parentId).toBe("folder-presentations");
    });

    it("returns existing entry without duplicating", () => {
      driveStorage.list();
      const item1 = driveStorage.ensureFileEntry("pres-123", "My Deck", "presentation");
      const item2 = driveStorage.ensureFileEntry("pres-123", "My Deck", "presentation");
      expect(item1.id).toBe(item2.id);
    });

    it("updates name if source exists with different name", () => {
      driveStorage.list();
      driveStorage.ensureFileEntry("pres-123", "Old Name", "presentation");
      const updated = driveStorage.ensureFileEntry("pres-123", "New Name", "presentation");
      expect(updated.name).toBe("New Name");
    });

    it("places documents in Documents folder", () => {
      driveStorage.list();
      const item = driveStorage.ensureFileEntry("doc-456", "My Doc", "document");
      expect(item.parentId).toBe("folder-documents");
    });

    it("places spreadsheets in Spreadsheets folder", () => {
      driveStorage.list();
      const item = driveStorage.ensureFileEntry("ss-789", "My Sheet", "spreadsheet");
      expect(item.parentId).toBe("folder-spreadsheets");
    });
  });

  describe("findBySourceId()", () => {
    it("finds an item by sourceId", () => {
      driveStorage.list();
      driveStorage.create({ parentId: "folder-documents", name: "Test", type: "file", sourceId: "doc-999" });
      const found = driveStorage.findBySourceId("doc-999");
      expect(found).not.toBeNull();
      expect(found!.sourceId).toBe("doc-999");
    });

    it("returns null if not found", () => {
      driveStorage.list();
      expect(driveStorage.findBySourceId("nonexistent")).toBeNull();
    });
  });

  describe("notifyChange()", () => {
    it("dispatches a driveChanged event", () => {
      const handler = vi.fn();
      window.addEventListener("driveChanged", handler);
      driveStorage.notifyChange();
      expect(handler).toHaveBeenCalledTimes(1);
      window.removeEventListener("driveChanged", handler);
    });
  });
});
