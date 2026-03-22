/**
 * Virtual file system storage layer — persists a hierarchical folder/file
 * structure to localStorage, scoped per tenant + user.
 *
 * Every item has:
 *   id        — unique identifier
 *   parentId  — id of the parent folder ("root" for top-level items)
 *   name      — display name
 *   type      — "file" | "folder"
 *   mimeType  — optional MIME type (files only)
 *   size      — optional byte size (files only)
 *   readOnly  — if true, no files can be moved into this folder
 *   sourceId  — optional reference to an external object (doc / presentation)
 *   sourceType— "document" | "presentation" | "spreadsheet" | "upload" etc.
 *
 * The "root" parentId is a virtual root — it is never stored as an item.
 */

export interface DriveItem {
  id: string;
  parentId: string; // "root" for top-level
  name: string;
  type: "file" | "folder";
  mimeType?: string;
  size?: number;
  readOnly?: boolean;
  sourceId?: string;
  sourceType?: "document" | "presentation" | "spreadsheet" | "upload";
  createdAt: string;
  updatedAt: string;
  owner: string;
  starred?: boolean;
}

const STORAGE_KEY = "educo_drive_items";

// ── Helpers ──

function getAll(): DriveItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveAll(items: DriveItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function generateId(prefix = "drv"): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/** Seed default folders on first use */
function ensureDefaults(): DriveItem[] {
  let items = getAll();
  if (items.length > 0) return items;

  const now = new Date().toISOString();
  const defaults: DriveItem[] = [
    { id: "folder-my-drive", parentId: "root", name: "My Drive", type: "folder", createdAt: now, updatedAt: now, owner: "Me" },
    { id: "folder-documents", parentId: "folder-my-drive", name: "Documents", type: "folder", createdAt: now, updatedAt: now, owner: "Me" },
    { id: "folder-presentations", parentId: "folder-my-drive", name: "Presentations", type: "folder", createdAt: now, updatedAt: now, owner: "Me" },
    { id: "folder-spreadsheets", parentId: "folder-my-drive", name: "Spreadsheets", type: "folder", createdAt: now, updatedAt: now, owner: "Me" },
    { id: "folder-images", parentId: "folder-my-drive", name: "Images", type: "folder", createdAt: now, updatedAt: now, owner: "Me" },
    { id: "folder-shared", parentId: "root", name: "Shared with me", type: "folder", readOnly: true, createdAt: now, updatedAt: now, owner: "System" },
    { id: "folder-starred", parentId: "root", name: "Starred", type: "folder", readOnly: true, createdAt: now, updatedAt: now, owner: "System" },
    { id: "folder-recent", parentId: "root", name: "Recent", type: "folder", readOnly: true, createdAt: now, updatedAt: now, owner: "System" },
    { id: "folder-bin", parentId: "root", name: "Bin", type: "folder", readOnly: true, createdAt: now, updatedAt: now, owner: "System" },
  ];
  saveAll(defaults);
  return defaults;
}

// ── Recursive helpers ──

/** Get all descendant IDs of a folder (to prevent moving a folder into itself) */
function getDescendantIds(items: DriveItem[], folderId: string): Set<string> {
  const ids = new Set<string>();
  const queue = [folderId];
  while (queue.length) {
    const current = queue.shift()!;
    for (const item of items) {
      if (item.parentId === current && !ids.has(item.id)) {
        ids.add(item.id);
        if (item.type === "folder") queue.push(item.id);
      }
    }
  }
  return ids;
}

/** Build the breadcrumb path from root to a given folder */
function buildPath(items: DriveItem[], folderId: string): DriveItem[] {
  const path: DriveItem[] = [];
  let current = folderId;
  while (current && current !== "root") {
    const item = items.find(i => i.id === current);
    if (!item) break;
    path.unshift(item);
    current = item.parentId;
  }
  return path;
}

// ── Public API ──

export const driveStorage = {
  /** Get all items (ensures defaults exist) */
  list(): DriveItem[] {
    return ensureDefaults();
  },

  /** Get a single item by ID */
  get(id: string): DriveItem | null {
    return ensureDefaults().find(i => i.id === id) || null;
  },

  /** Get children of a parent folder */
  getChildren(parentId: string): DriveItem[] {
    return ensureDefaults()
      .filter(i => i.parentId === parentId)
      .sort((a, b) => {
        // Folders first, then alphabetical
        if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
        return a.name.localeCompare(b.name);
      });
  },

  /** Get only folder children of a parent */
  getFolders(parentId: string): DriveItem[] {
    return this.getChildren(parentId).filter(i => i.type === "folder");
  },

  /** Get all folders (flat list) */
  getAllFolders(): DriveItem[] {
    return ensureDefaults().filter(i => i.type === "folder");
  },

  /** Get breadcrumb path from root to folder */
  getPath(folderId: string): DriveItem[] {
    return buildPath(ensureDefaults(), folderId);
  },

  /** Get the folder name for display */
  getFolderName(folderId: string): string {
    if (folderId === "root") return "My Drive";
    const item = this.get(folderId);
    return item?.name || "Unknown";
  },

  /** Create a new item (file or folder) */
  create(data: {
    parentId: string;
    name: string;
    type: "file" | "folder";
    mimeType?: string;
    size?: number;
    sourceId?: string;
    sourceType?: DriveItem["sourceType"];
    readOnly?: boolean;
  }): string {
    const items = ensureDefaults();
    const id = generateId(data.type === "folder" ? "folder" : "file");
    const now = new Date().toISOString();
    items.push({
      id,
      parentId: data.parentId,
      name: data.name,
      type: data.type,
      mimeType: data.mimeType,
      size: data.size,
      readOnly: data.readOnly,
      sourceId: data.sourceId,
      sourceType: data.sourceType,
      createdAt: now,
      updatedAt: now,
      owner: "Me",
    });
    saveAll(items);
    return id;
  },

  /** Create a new folder */
  createFolder(parentId: string, name: string): string {
    return this.create({ parentId, name, type: "folder" });
  },

  /**
   * Move an item to a new parent folder.
   *
   * Returns { success, error? } — enforces:
   *   - Cannot move a folder into itself or its descendants
   *   - Cannot move into a read-only folder
   */
  move(itemId: string, newParentId: string): { success: boolean; error?: string; oldParentName?: string; newParentName?: string } {
    const items = ensureDefaults();
    const idx = items.findIndex(i => i.id === itemId);
    if (idx === -1) return { success: false, error: "Item not found" };

    const item = items[idx];

    // Cannot move to same location
    if (item.parentId === newParentId) {
      return { success: false, error: "Item is already in this folder" };
    }

    // Check destination exists and is a folder
    if (newParentId !== "root") {
      const dest = items.find(i => i.id === newParentId);
      if (!dest) return { success: false, error: "Destination folder not found" };
      if (dest.type !== "folder") return { success: false, error: "Destination is not a folder" };
      if (dest.readOnly) return { success: false, error: `"${dest.name}" is read-only` };
    }

    // Prevent moving a folder into itself or its descendants
    if (item.type === "folder") {
      const descendants = getDescendantIds(items, itemId);
      if (newParentId === itemId || descendants.has(newParentId)) {
        return { success: false, error: "Cannot move a folder into itself or its subfolder" };
      }
    }

    const oldParentName = this.getFolderName(item.parentId);
    const newParentName = this.getFolderName(newParentId);

    items[idx].parentId = newParentId;
    items[idx].updatedAt = new Date().toISOString();
    saveAll(items);

    return { success: true, oldParentName, newParentName };
  },

  /** Rename an item */
  rename(itemId: string, newName: string) {
    const items = ensureDefaults();
    const idx = items.findIndex(i => i.id === itemId);
    if (idx === -1) return;
    items[idx].name = newName;
    items[idx].updatedAt = new Date().toISOString();
    saveAll(items);
  },

  /** Delete an item (and all descendants if folder) */
  remove(itemId: string) {
    const items = ensureDefaults();
    const toRemove = new Set([itemId]);
    const item = items.find(i => i.id === itemId);
    if (item?.type === "folder") {
      const descendants = getDescendantIds(items, itemId);
      descendants.forEach(id => toRemove.add(id));
    }
    saveAll(items.filter(i => !toRemove.has(i.id)));
  },

  /** Find a drive item by sourceId (e.g., a presentation ID) */
  findBySourceId(sourceId: string): DriveItem | null {
    return ensureDefaults().find(i => i.sourceId === sourceId) || null;
  },

  /**
   * Ensure a file entry exists in the drive for a document/presentation.
   * If it doesn't exist, create it in the appropriate default folder.
   */
  ensureFileEntry(sourceId: string, name: string, sourceType: DriveItem["sourceType"]): DriveItem {
    const existing = this.findBySourceId(sourceId);
    if (existing) {
      // Update name if changed
      if (existing.name !== name) this.rename(existing.id, name);
      return this.get(existing.id)!;
    }

    // Determine default parent folder
    let parentId = "folder-my-drive";
    if (sourceType === "presentation") parentId = "folder-presentations";
    else if (sourceType === "document") parentId = "folder-documents";
    else if (sourceType === "spreadsheet") parentId = "folder-spreadsheets";

    const id = this.create({
      parentId,
      name,
      type: "file",
      sourceId,
      sourceType,
    });
    return this.get(id)!;
  },

  /** Dispatch a custom event so other components can react to drive changes */
  notifyChange() {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("driveChanged"));
    }
  },
};
