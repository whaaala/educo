// Drive mock data — matches desktop DriveItem interface from lib/drive-storage.ts

export interface DriveItem {
  id: string;
  parentId: string;
  name: string;
  type: "file" | "folder";
  mimeType?: string;
  size?: number;
  readOnly?: boolean;
  sourceId?: string;
  sourceType?: "document" | "presentation" | "spreadsheet" | "upload";
  previousParentId?: string;
  createdAt: string;
  updatedAt: string;
  owner: string;
  starred?: boolean;
}

export type DriveSection = "home" | "myDrive" | "shared" | "recent" | "starred" | "bin";

export interface SidebarSection {
  id: DriveSection;
  label: string;
  icon: string; // Ionicons name
}

export const SIDEBAR_SECTIONS: SidebarSection[] = [
  { id: "myDrive", label: "My Drive", icon: "folder-outline" },
  { id: "shared", label: "Shared with me", icon: "people-outline" },
  { id: "recent", label: "Recent", icon: "time-outline" },
  { id: "starred", label: "Starred", icon: "star-outline" },
  { id: "bin", label: "Bin", icon: "trash-outline" },
];

const now = new Date().toISOString();
const daysAgo = (d: number) => new Date(Date.now() - d * 86400000).toISOString();
const hoursAgo = (h: number) => new Date(Date.now() - h * 3600000).toISOString();

// Mutable so actions can modify items
export let MOCK_DRIVE_ITEMS: DriveItem[] = [
  // ── System folders ──
  { id: "folder-my-drive", parentId: "root", name: "My Drive", type: "folder", readOnly: true, createdAt: daysAgo(30), updatedAt: daysAgo(0), owner: "Me" },
  { id: "folder-bin", parentId: "root", name: "Bin", type: "folder", readOnly: true, createdAt: daysAgo(30), updatedAt: daysAgo(0), owner: "System" },

  // ── User folders ──
  { id: "folder-documents", parentId: "folder-my-drive", name: "Documents", type: "folder", createdAt: daysAgo(20), updatedAt: daysAgo(1), owner: "Me" },
  { id: "folder-presentations", parentId: "folder-my-drive", name: "Presentations", type: "folder", createdAt: daysAgo(20), updatedAt: daysAgo(1), owner: "Me" },
  { id: "folder-images", parentId: "folder-my-drive", name: "Images", type: "folder", createdAt: daysAgo(20), updatedAt: daysAgo(2), owner: "Me" },
  { id: "folder-spreadsheets", parentId: "folder-my-drive", name: "Spreadsheets", type: "folder", createdAt: daysAgo(20), updatedAt: daysAgo(3), owner: "Me" },

  // ── Files in Documents ──
  { id: "file-001", parentId: "folder-documents", name: "School Policy 2025.pdf", type: "file", sourceType: "document", size: 2400000, createdAt: daysAgo(10), updatedAt: daysAgo(1), owner: "Me", starred: true },
  { id: "file-002", parentId: "folder-documents", name: "Staff Meeting Notes.docx", type: "file", sourceType: "document", size: 156000, createdAt: daysAgo(5), updatedAt: hoursAgo(3), owner: "Me" },
  { id: "file-003", parentId: "folder-documents", name: "Student Report Template.docx", type: "file", sourceType: "document", size: 89000, createdAt: daysAgo(15), updatedAt: daysAgo(7), owner: "Mrs. Nkechi Eze" },

  // ── Files in Presentations ──
  { id: "file-004", parentId: "folder-presentations", name: "Term 2 Assembly.pptx", type: "file", sourceType: "presentation", size: 5200000, createdAt: daysAgo(3), updatedAt: hoursAgo(1), owner: "Me", starred: true },
  { id: "file-005", parentId: "folder-presentations", name: "Parent Teacher Day.pptx", type: "file", sourceType: "presentation", size: 3100000, createdAt: daysAgo(8), updatedAt: daysAgo(2), owner: "Mr. Chidi Okafor" },

  // ── Files in Images ──
  { id: "file-006", parentId: "folder-images", name: "School Event Photo.jpg", type: "file", sourceType: "upload", size: 4300000, createdAt: daysAgo(2), updatedAt: daysAgo(1), owner: "Me" },
  { id: "file-007", parentId: "folder-images", name: "Class Group Photo.png", type: "file", sourceType: "upload", size: 3800000, createdAt: daysAgo(4), updatedAt: daysAgo(3), owner: "Me" },

  // ── Files in Spreadsheets ──
  { id: "file-008", parentId: "folder-spreadsheets", name: "Fee Collection Report.xlsx", type: "file", sourceType: "spreadsheet", size: 890000, createdAt: daysAgo(1), updatedAt: hoursAgo(5), owner: "Me" },
  { id: "file-009", parentId: "folder-spreadsheets", name: "Student Grades Term 2.xlsx", type: "file", sourceType: "spreadsheet", size: 1200000, createdAt: daysAgo(6), updatedAt: daysAgo(2), owner: "Me", starred: true },

  // ── Files in root My Drive ──
  { id: "file-010", parentId: "folder-my-drive", name: "Recording 2026-03-21.mp4", type: "file", sourceType: "upload", size: 45000000, createdAt: daysAgo(2), updatedAt: daysAgo(1), owner: "Me" },
  { id: "file-011", parentId: "folder-my-drive", name: "Quick Notes.txt", type: "file", sourceType: "document", size: 12000, createdAt: hoursAgo(2), updatedAt: hoursAgo(1), owner: "Me" },

  // ── Shared files (owned by others) ──
  { id: "file-012", parentId: "folder-my-drive", name: "Shared Curriculum Plan.docx", type: "file", sourceType: "document", size: 340000, createdAt: daysAgo(12), updatedAt: daysAgo(4), owner: "Mrs. Nkechi Eze" },
  { id: "file-013", parentId: "folder-my-drive", name: "Budget Proposal 2026.xlsx", type: "file", sourceType: "spreadsheet", size: 780000, createdAt: daysAgo(7), updatedAt: daysAgo(3), owner: "Mr. Chidi Okafor" },

  // ── More files in root My Drive ──
  { id: "file-014", parentId: "folder-my-drive", name: "Parent Newsletter March.docx", type: "file", sourceType: "document", size: 230000, createdAt: daysAgo(1), updatedAt: hoursAgo(6), owner: "Me" },
  { id: "file-015", parentId: "folder-my-drive", name: "Class Timetable.xlsx", type: "file", sourceType: "spreadsheet", size: 145000, createdAt: daysAgo(5), updatedAt: daysAgo(2), owner: "Me", starred: true },
  { id: "file-016", parentId: "folder-my-drive", name: "Sports Day Photos.zip", type: "file", sourceType: "upload", size: 89000000, createdAt: daysAgo(3), updatedAt: daysAgo(1), owner: "Me" },
  { id: "file-017", parentId: "folder-my-drive", name: "Science Fair Presentation.pptx", type: "file", sourceType: "presentation", size: 4200000, createdAt: daysAgo(4), updatedAt: daysAgo(2), owner: "Mrs. Nkechi Eze" },
  { id: "file-018", parentId: "folder-my-drive", name: "Exam Schedule Term 3.pdf", type: "file", sourceType: "document", size: 320000, createdAt: daysAgo(1), updatedAt: hoursAgo(4), owner: "Mr. Chidi Okafor" },
  { id: "file-019", parentId: "folder-my-drive", name: "Art Class Project.jpg", type: "file", sourceType: "upload", size: 5600000, createdAt: daysAgo(6), updatedAt: daysAgo(3), owner: "Me" },
  { id: "file-020", parentId: "folder-my-drive", name: "Library Book List.xlsx", type: "file", sourceType: "spreadsheet", size: 98000, createdAt: daysAgo(8), updatedAt: daysAgo(5), owner: "Me" },

  // ── More files in Documents ──
  { id: "file-021", parentId: "folder-documents", name: "Homework Guidelines.pdf", type: "file", sourceType: "document", size: 178000, createdAt: daysAgo(9), updatedAt: daysAgo(4), owner: "Me" },
  { id: "file-022", parentId: "folder-documents", name: "Field Trip Permission.docx", type: "file", sourceType: "document", size: 95000, createdAt: daysAgo(3), updatedAt: daysAgo(1), owner: "Me" },

  // ── Bin items ──
  { id: "file-bin-001", parentId: "folder-bin", name: "Old Timetable.pdf", type: "file", sourceType: "document", size: 560000, createdAt: daysAgo(30), updatedAt: daysAgo(5), owner: "Me", previousParentId: "folder-documents" },
  { id: "file-bin-002", parentId: "folder-bin", name: "Draft Letter.docx", type: "file", sourceType: "document", size: 45000, createdAt: daysAgo(20), updatedAt: daysAgo(8), owner: "Me", previousParentId: "folder-documents" },
];

// ── Helper functions ──

export function getChildren(parentId: string): DriveItem[] {
  return MOCK_DRIVE_ITEMS
    .filter(i => i.parentId === parentId)
    .sort((a, b) => {
      if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
}

export function getItem(id: string): DriveItem | undefined {
  return MOCK_DRIVE_ITEMS.find(i => i.id === id);
}

export function getBreadcrumbPath(folderId: string): { id: string; name: string }[] {
  const path: { id: string; name: string }[] = [];
  let current = MOCK_DRIVE_ITEMS.find(i => i.id === folderId);
  while (current && current.id !== "root") {
    path.unshift({ id: current.id, name: current.name });
    current = MOCK_DRIVE_ITEMS.find(i => i.id === current!.parentId);
  }
  return path;
}

export function getRecentItems(): DriveItem[] {
  return MOCK_DRIVE_ITEMS
    .filter(i => i.type === "file" && i.parentId !== "folder-bin")
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 20);
}

export function getStarredItems(): DriveItem[] {
  return MOCK_DRIVE_ITEMS.filter(i => i.starred && i.parentId !== "folder-bin");
}

export function getSharedItems(): DriveItem[] {
  return MOCK_DRIVE_ITEMS.filter(i =>
    i.parentId !== "folder-bin" && i.owner !== "Me" && i.owner !== "System"
  );
}

export function getBinItems(): DriveItem[] {
  return MOCK_DRIVE_ITEMS.filter(i => i.parentId === "folder-bin");
}

export function getChildCount(folderId: string): number {
  return MOCK_DRIVE_ITEMS.filter(i => i.parentId === folderId).length;
}

export function formatFileSize(bytes?: number): string {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// File type config — Ionicons only (guaranteed to load)
export interface FileTypeConfig {
  icon: string;
  color: string;
  bgColor: string;
  previewBg: string;
  label: string;
}

export function getFileTypeConfig(item: DriveItem): FileTypeConfig {
  if (item.type === "folder") {
    return { icon: "folder", color: "#f59e0b", bgColor: "#fef3c7", previewBg: "#fffbeb", label: "Folder" };
  }

  const ext = item.name.split('.').pop()?.toLowerCase();

  if (ext === 'pdf') return { icon: "document-text", color: "#dc2626", bgColor: "#fee2e2", previewBg: "#fef2f2", label: "PDF" };
  if (ext === 'docx' || ext === 'doc') return { icon: "document-text", color: "#2563eb", bgColor: "#dbeafe", previewBg: "#eff6ff", label: "Document" };
  if (ext === 'txt') return { icon: "document", color: "#6366f1", bgColor: "#e0e7ff", previewBg: "#eef2ff", label: "Text" };
  if (ext === 'xlsx' || ext === 'xls' || ext === 'csv') return { icon: "grid", color: "#059669", bgColor: "#d1fae5", previewBg: "#ecfdf5", label: "Spreadsheet" };
  if (ext === 'pptx' || ext === 'ppt') return { icon: "easel", color: "#ea580c", bgColor: "#fed7aa", previewBg: "#fff7ed", label: "Slides" };
  if (ext === 'mp4' || ext === 'mov' || ext === 'avi' || ext === 'mkv') return { icon: "videocam", color: "#dc2626", bgColor: "#fee2e2", previewBg: "#fef2f2", label: "Video" };
  if (ext === 'mp3' || ext === 'wav' || ext === 'aac') return { icon: "musical-notes", color: "#d946ef", bgColor: "#f5d0fe", previewBg: "#fdf4ff", label: "Audio" };
  if (ext === 'jpg' || ext === 'jpeg' || ext === 'png' || ext === 'gif' || ext === 'webp' || ext === 'svg') return { icon: "image", color: "#7c3aed", bgColor: "#ddd6fe", previewBg: "#f5f3ff", label: "Image" };
  if (ext === 'zip' || ext === 'rar' || ext === '7z') return { icon: "archive", color: "#78716c", bgColor: "#e7e5e4", previewBg: "#f5f5f4", label: "Archive" };

  switch (item.sourceType) {
    case "document": return { icon: "document-text", color: "#2563eb", bgColor: "#dbeafe", previewBg: "#eff6ff", label: "Document" };
    case "presentation": return { icon: "easel", color: "#ea580c", bgColor: "#fed7aa", previewBg: "#fff7ed", label: "Slides" };
    case "spreadsheet": return { icon: "grid", color: "#059669", bgColor: "#d1fae5", previewBg: "#ecfdf5", label: "Spreadsheet" };
    case "upload": return { icon: "cloud-upload", color: "#0891b2", bgColor: "#cffafe", previewBg: "#ecfeff", label: "Upload" };
    default: return { icon: "document-outline", color: "#94a3b8", bgColor: "#e2e8f0", previewBg: "#f8fafc", label: "File" };
  }
}

// ── Mutation helpers (mock — in production these would call an API) ──

let _changeCounter = 0;
export function getChangeCounter() { return _changeCounter; }

export function renameItem(id: string, newName: string): boolean {
  const item = MOCK_DRIVE_ITEMS.find(i => i.id === id);
  if (!item) return false;
  item.name = newName;
  item.updatedAt = new Date().toISOString();
  _changeCounter++;
  return true;
}

export function toggleStar(id: string): boolean {
  const item = MOCK_DRIVE_ITEMS.find(i => i.id === id);
  if (!item) return false;
  item.starred = !item.starred;
  item.updatedAt = new Date().toISOString();
  _changeCounter++;
  return true;
}

export function moveToFolder(id: string, newParentId: string): boolean {
  const item = MOCK_DRIVE_ITEMS.find(i => i.id === id);
  if (!item) return false;
  item.parentId = newParentId;
  item.updatedAt = new Date().toISOString();
  _changeCounter++;
  return true;
}

export function moveToBin(id: string): boolean {
  const item = MOCK_DRIVE_ITEMS.find(i => i.id === id);
  if (!item) return false;
  item.previousParentId = item.parentId;
  item.parentId = "folder-bin";
  item.updatedAt = new Date().toISOString();
  _changeCounter++;
  return true;
}

export function restoreFromBin(id: string): boolean {
  const item = MOCK_DRIVE_ITEMS.find(i => i.id === id);
  if (!item || !item.previousParentId) return false;
  item.parentId = item.previousParentId;
  item.previousParentId = undefined;
  item.updatedAt = new Date().toISOString();
  _changeCounter++;
  return true;
}

export function deletePermanently(id: string): boolean {
  const idx = MOCK_DRIVE_ITEMS.findIndex(i => i.id === id);
  if (idx === -1) return false;
  MOCK_DRIVE_ITEMS.splice(idx, 1);
  _changeCounter++;
  return true;
}

export function createFolder(name: string, parentId: string): DriveItem {
  const newFolder: DriveItem = {
    id: `folder-${Date.now()}`,
    parentId,
    name,
    type: "folder",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    owner: "Me",
  };
  MOCK_DRIVE_ITEMS.push(newFolder);
  _changeCounter++;
  return newFolder;
}

export function getAllFolders(): DriveItem[] {
  return MOCK_DRIVE_ITEMS.filter(i => i.type === "folder" && i.id !== "folder-bin");
}
