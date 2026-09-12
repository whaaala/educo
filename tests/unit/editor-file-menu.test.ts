import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  buildFileMenu,
  newMenuItems,
  openItem,
  shareMenuItems,
  emailMenuItems,
  downloadItem,
  convertToVideoItem,
  renameItem,
  moveItem,
  starItem,
  locationItem,
  moveToBinItem,
  versionHistoryMenuItems,
  detailsItem,
  sharingPermissionsItem,
  languageItem,
  pageSetupItem,
  printPreviewItem,
  printItem,
  fileManagementItems,
  infoItems,
  printItems,
} from "@/components/shared/EditorFileMenu";

const mockAction = vi.fn();
const act = (action: string) => () => mockAction(action);

describe("EditorFileMenu — Reusable File Menu Factories", () => {
  beforeEach(() => vi.clearAllMocks());

  // ── Individual Item Factories ──

  describe("newMenuItems()", () => {
    it("returns a simple item when no config is provided", () => {
      const item = newMenuItems(act);
      expect(item.label).toBe("New");
      expect(item.submenu).toBeUndefined();
    });

    it("returns a submenu when config provides items", () => {
      const item = newMenuItems(act, {
        items: [
          { label: "Presentation", onClick: act("file:new") },
          { label: "From template", onClick: act("file:newFromTemplate") },
        ],
      });
      expect(item.label).toBe("New");
      expect(item.submenu).toHaveLength(2);
      expect(item.submenu![0].label).toBe("Presentation");
    });
  });

  describe("openItem()", () => {
    it("returns Open with Ctrl+O shortcut", () => {
      const item = openItem(act);
      expect(item.label).toBe("Open");
      expect(item.shortcut).toBe("Ctrl+O");
    });
  });

  describe("shareMenuItems()", () => {
    it("returns Share with two submenu items", () => {
      const item = shareMenuItems(act);
      expect(item.label).toBe("Share");
      expect(item.submenu).toHaveLength(2);
      expect(item.submenu![0].label).toBe("Share with others");
      expect(item.submenu![1].label).toBe("Publish");
    });
  });

  describe("emailMenuItems()", () => {
    it("returns Email with two submenu items", () => {
      const item = emailMenuItems(act);
      expect(item.label).toBe("Email");
      expect(item.submenu).toHaveLength(2);
      expect(item.submenu![0].label).toBe("Email this file");
      expect(item.submenu![1].label).toBe("Email collaborators");
    });
  });

  describe("downloadItem()", () => {
    it("returns Download item", () => {
      expect(downloadItem(act).label).toBe("Download");
    });
  });

  describe("convertToVideoItem()", () => {
    it("returns Convert to video item", () => {
      expect(convertToVideoItem(act).label).toBe("Convert to video");
    });
  });

  describe("renameItem()", () => {
    it("returns Rename item", () => {
      expect(renameItem(act).label).toBe("Rename");
    });
  });

  describe("moveItem()", () => {
    it("returns Move item", () => {
      expect(moveItem(act).label).toBe("Move");
    });
  });

  describe("starItem()", () => {
    it("shows 'Add to starred' when not starred", () => {
      expect(starItem(act, false).label).toBe("Add to starred");
    });

    it("shows 'Remove from starred' when starred", () => {
      expect(starItem(act, true).label).toBe("Remove from starred");
    });
  });

  describe("locationItem()", () => {
    it("shows the current folder name", () => {
      expect(locationItem(act, "Presentations").label).toBe("Location: Presentations");
    });

    it("shows different folder names", () => {
      expect(locationItem(act, "Documents").label).toBe("Location: Documents");
    });
  });

  describe("moveToBinItem()", () => {
    it("returns Move to bin item", () => {
      expect(moveToBinItem(act).label).toBe("Move to bin");
    });
  });

  describe("versionHistoryMenuItems()", () => {
    it("returns Version history with two submenu items", () => {
      const item = versionHistoryMenuItems(act);
      expect(item.label).toBe("Version history");
      expect(item.submenu).toHaveLength(2);
      expect(item.submenu![0].label).toBe("Name current version");
      expect(item.submenu![1].label).toBe("See version history");
      expect(item.submenu![1].shortcut).toBe("Ctrl+Alt+Shift+H");
    });
  });

  describe("detailsItem()", () => {
    it("returns Details item", () => {
      expect(detailsItem(act).label).toBe("Details");
    });
  });

  describe("sharingPermissionsItem()", () => {
    it("returns Sharing permissions item", () => {
      expect(sharingPermissionsItem(act).label).toBe("Sharing permissions");
    });
  });

  describe("languageItem()", () => {
    it("uses default label 'Language'", () => {
      expect(languageItem(act).label).toBe("Language");
    });

    it("uses custom label", () => {
      expect(languageItem(act, "Slide language").label).toBe("Slide language");
      expect(languageItem(act, "Document language").label).toBe("Document language");
    });
  });

  describe("pageSetupItem()", () => {
    it("returns Page setup item", () => {
      expect(pageSetupItem(act).label).toBe("Page setup");
    });
  });

  describe("printPreviewItem()", () => {
    it("returns Print preview item", () => {
      expect(printPreviewItem(act).label).toBe("Print preview");
    });
  });

  describe("printItem()", () => {
    it("returns Print with Ctrl+P shortcut", () => {
      const item = printItem(act);
      expect(item.label).toBe("Print");
      expect(item.shortcut).toBe("Ctrl+P");
    });
  });

  // ── Group Factories ──

  describe("fileManagementItems()", () => {
    it("returns 5 items: Rename, Move, Star, Location, Bin", () => {
      const items = fileManagementItems(act, { isStarred: false, currentFolder: "My Drive" });
      expect(items).toHaveLength(5);
      expect(items.map(i => i.label)).toEqual([
        "Rename", "Move", "Add to starred", "Location: My Drive", "Move to bin",
      ]);
    });

    it("respects isStarred flag", () => {
      const items = fileManagementItems(act, { isStarred: true, currentFolder: "Documents" });
      expect(items[2].label).toBe("Remove from starred");
    });
  });

  describe("infoItems()", () => {
    it("includes language and page setup when configured", () => {
      const items = infoItems(act, { languageLabel: "Slide language", showPageSetup: true });
      expect(items.map(i => i.label)).toEqual([
        "Details", "Sharing permissions", "Slide language", "Page setup",
      ]);
    });

    it("excludes language when not configured", () => {
      const items = infoItems(act, {});
      expect(items.map(i => i.label)).toEqual(["Details", "Sharing permissions", "Page setup"]);
    });

    it("excludes page setup when showPageSetup is false", () => {
      const items = infoItems(act, { showPageSetup: false });
      expect(items.map(i => i.label)).toEqual(["Details", "Sharing permissions"]);
    });
  });

  describe("printItems()", () => {
    it("returns Print preview and Print", () => {
      const items = printItems(act);
      expect(items).toHaveLength(2);
      expect(items[0].label).toBe("Print preview");
      expect(items[1].label).toBe("Print");
    });
  });

  // ── buildFileMenu() ──

  describe("buildFileMenu()", () => {
    it("builds a complete file menu for presentations", () => {
      const onAction = vi.fn();
      const menu = buildFileMenu({
        onAction,
        isStarred: false,
        currentFolder: "Presentations",
        workspace: {
          newMenu: {
            items: [
              { label: "Presentation", onClick: () => onAction("file:new") },
              { label: "From template gallery", onClick: () => onAction("file:newFromTemplate") },
            ],
          },
          importItem: { label: "Import slides", onClick: () => onAction("file:import") },
          copyMenu: [
            { label: "Entire presentation", onClick: () => onAction("file:copyAll") },
            { label: "Selected slides", onClick: () => onAction("file:copySelected") },
          ],
          showConvertToVideo: true,
          languageLabel: "Slide language",
          showPageSetup: true,
        },
      });

      const labels = menu.filter(i => !i.divider).map(i => i.label);
      expect(labels).toContain("New");
      expect(labels).toContain("Open");
      expect(labels).toContain("Import slides");
      expect(labels).toContain("Make a copy");
      expect(labels).toContain("Share");
      expect(labels).toContain("Email");
      expect(labels).toContain("Download");
      expect(labels).toContain("Convert to video");
      expect(labels).toContain("Rename");
      expect(labels).toContain("Move");
      expect(labels).toContain("Add to starred");
      expect(labels).toContain("Location: Presentations");
      expect(labels).toContain("Move to bin");
      expect(labels).toContain("Version history");
      expect(labels).toContain("Details");
      expect(labels).toContain("Sharing permissions");
      expect(labels).toContain("Slide language");
      expect(labels).toContain("Page setup");
      expect(labels).toContain("Print preview");
      expect(labels).toContain("Print");
    });

    it("builds a minimal file menu for documents (no video, no import)", () => {
      const onAction = vi.fn();
      const menu = buildFileMenu({
        onAction,
        isStarred: true,
        currentFolder: "Documents",
        workspace: {
          newMenu: {
            items: [{ label: "Document", onClick: () => onAction("file:new") }],
          },
          showConvertToVideo: false,
          languageLabel: "Document language",
        },
      });

      const labels = menu.filter(i => !i.divider).map(i => i.label);
      expect(labels).not.toContain("Convert to video");
      expect(labels).not.toContain("Import slides");
      expect(labels).not.toContain("Make a copy");
      expect(labels).toContain("Document language");
      expect(labels).toContain("Remove from starred");
      expect(labels).toContain("Location: Documents");
    });

    it("uses defaults when no workspace config provided", () => {
      const onAction = vi.fn();
      const menu = buildFileMenu({ onAction });

      const labels = menu.filter(i => !i.divider).map(i => i.label);
      expect(labels).toContain("New");
      expect(labels).toContain("Open");
      expect(labels).toContain("Download");
      expect(labels).toContain("Rename");
      expect(labels).toContain("Print");
      expect(labels).toContain("Location: My Drive");
      expect(labels).not.toContain("Convert to video");
    });

    it("includes dividers between sections", () => {
      const menu = buildFileMenu({ onAction: vi.fn() });
      const dividerCount = menu.filter(i => i.divider).length;
      expect(dividerCount).toBeGreaterThanOrEqual(5);
    });

    it("fires correct actions when items are clicked", () => {
      const onAction = vi.fn();
      const menu = buildFileMenu({ onAction });

      const downloadBtn = menu.find(i => i.label === "Download");
      downloadBtn?.onClick?.();
      expect(onAction).toHaveBeenCalledWith("file:download");

      const renameBtn = menu.find(i => i.label === "Rename");
      renameBtn?.onClick?.();
      expect(onAction).toHaveBeenCalledWith("file:rename");

      const printBtn = menu.find(i => i.label === "Print");
      printBtn?.onClick?.();
      expect(onAction).toHaveBeenCalledWith("file:print");
    });

    it("supports extra workspace-specific items", () => {
      const onAction = vi.fn();
      const menu = buildFileMenu({
        onAction,
        workspace: {
          extraItems: [
            { label: "Custom Action", onClick: () => onAction("file:custom") },
          ],
        },
      });

      const labels = menu.filter(i => !i.divider).map(i => i.label);
      expect(labels).toContain("Custom Action");
    });
  });
});
