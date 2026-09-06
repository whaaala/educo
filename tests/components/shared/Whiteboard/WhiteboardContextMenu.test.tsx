import { describe, expect, it, vi } from "vitest";
import { buildContextMenuActions } from "@/components/shared/Whiteboard/WhiteboardContextMenu";
// Test the action builder function (pure logic, no portal needed)
const noop = vi.fn();

function buildActions(overrides: Record<string, unknown> = {}) {
  return buildContextMenuActions({
    hasSelection: true,
    selectionCount: 1,
    canGroup: false,
    canUngroup: false,
    onBringToFront: noop,
    onBringForward: noop,
    onSendBackward: noop,
    onSendToBack: noop,
    onRotateCW: noop,
    onRotateCCW: noop,
    onFlipH: noop,
    onFlipV: noop,
    onCopy: noop,
    onPaste: noop,
    onDuplicate: noop,
    onGroup: noop,
    onUngroup: noop,
    onDelete: noop,
    onInsertImage: noop,
    ...overrides,
  });
}

describe("buildContextMenuActions", () => {
  describe("with selection", () => {
    it("includes Order submenu", () => {
      const actions = buildActions();
      const order = actions.find((a) => a.id === "order");
      expect(order).toBeDefined();
      expect(order!.children).toBeDefined();
      expect(order!.label).toBe("Order");
    });

    it("Order submenu has 4 items", () => {
      const actions = buildActions();
      const order = actions.find((a) => a.id === "order")!;
      expect(order.children).toHaveLength(4);
      const ids = order.children!.map((c) => c.id);
      expect(ids).toContain("bring-to-front");
      expect(ids).toContain("bring-forward");
      expect(ids).toContain("send-backward");
      expect(ids).toContain("send-to-back");
    });

    it("includes Rotate submenu", () => {
      const actions = buildActions();
      const rotate = actions.find((a) => a.id === "rotate");
      expect(rotate).toBeDefined();
      expect(rotate!.children).toBeDefined();
    });

    it("Rotate submenu has 4 items (rotate CW/CCW, flip H/V)", () => {
      const actions = buildActions();
      const rotate = actions.find((a) => a.id === "rotate")!;
      expect(rotate.children).toHaveLength(4);
      const ids = rotate.children!.map((c) => c.id);
      expect(ids).toContain("rotate-cw");
      expect(ids).toContain("rotate-ccw");
      expect(ids).toContain("flip-h");
      expect(ids).toContain("flip-v");
    });

    it("includes Copy and Duplicate", () => {
      const actions = buildActions();
      expect(actions.find((a) => a.id === "copy")).toBeDefined();
      expect(actions.find((a) => a.id === "duplicate")).toBeDefined();
    });

    it("includes Delete with danger flag", () => {
      const actions = buildActions();
      const del = actions.find((a) => a.id === "delete");
      expect(del).toBeDefined();
      expect(del!.danger).toBe(true);
    });

    it("does not include Group when canGroup is false", () => {
      const actions = buildActions({ canGroup: false });
      expect(actions.find((a) => a.id === "group")).toBeUndefined();
    });

    it("includes Group when canGroup is true", () => {
      const actions = buildActions({ canGroup: true });
      const group = actions.find((a) => a.id === "group");
      expect(group).toBeDefined();
      expect(group!.label).toBe("Group");
    });

    it("includes Ungroup when canUngroup is true", () => {
      const actions = buildActions({ canUngroup: true });
      const ungroup = actions.find((a) => a.id === "ungroup");
      expect(ungroup).toBeDefined();
      expect(ungroup!.label).toBe("Ungroup");
    });

    it("does not include Paste when selection exists", () => {
      const actions = buildActions();
      expect(actions.find((a) => a.id === "paste")).toBeUndefined();
    });
  });

  describe("without selection", () => {
    it("includes Paste", () => {
      const actions = buildActions({ hasSelection: false });
      const paste = actions.find((a) => a.id === "paste");
      expect(paste).toBeDefined();
      expect(paste!.label).toBe("Paste");
    });

    it("includes Insert image", () => {
      const actions = buildActions({ hasSelection: false });
      const insertImage = actions.find((a) => a.id === "insert-image");
      expect(insertImage).toBeDefined();
      expect(insertImage!.label).toBe("Insert image");
    });

    it("does not include Order, Rotate, Copy, Delete", () => {
      const actions = buildActions({ hasSelection: false });
      expect(actions.find((a) => a.id === "order")).toBeUndefined();
      expect(actions.find((a) => a.id === "rotate")).toBeUndefined();
      expect(actions.find((a) => a.id === "copy")).toBeUndefined();
      expect(actions.find((a) => a.id === "delete")).toBeUndefined();
    });

    it("returns exactly 2 actions (Paste + Insert image)", () => {
      const actions = buildActions({ hasSelection: false });
      expect(actions).toHaveLength(2);
    });
  });

  describe("action shortcuts", () => {
    it("Copy has Ctrl+C shortcut", () => {
      const actions = buildActions();
      const copy = actions.find((a) => a.id === "copy");
      expect(copy!.shortcut).toBe("Ctrl+C");
    });

    it("Duplicate has Ctrl+D shortcut", () => {
      const actions = buildActions();
      const dup = actions.find((a) => a.id === "duplicate");
      expect(dup!.shortcut).toBe("Ctrl+D");
    });

    it("Delete has Del shortcut", () => {
      const actions = buildActions();
      const del = actions.find((a) => a.id === "delete");
      expect(del!.shortcut).toBe("Del");
    });

    it("Paste has Ctrl+V shortcut", () => {
      const actions = buildActions({ hasSelection: false });
      const paste = actions.find((a) => a.id === "paste");
      expect(paste!.shortcut).toBe("Ctrl+V");
    });

    it("Group has Ctrl+G shortcut", () => {
      const actions = buildActions({ canGroup: true });
      const group = actions.find((a) => a.id === "group");
      expect(group!.shortcut).toBe("Ctrl+G");
    });

    it("Ungroup has Ctrl+Shift+G shortcut", () => {
      const actions = buildActions({ canUngroup: true });
      const ungroup = actions.find((a) => a.id === "ungroup");
      expect(ungroup!.shortcut).toBe("Ctrl+Shift+G");
    });
  });

  describe("action callbacks", () => {
    it("calls onCopy when copy action is invoked", () => {
      const onCopy = vi.fn();
      const actions = buildActions({ onCopy });
      const copy = actions.find((a) => a.id === "copy")!;
      copy.action!();
      expect(onCopy).toHaveBeenCalled();
    });

    it("calls onDelete when delete action is invoked", () => {
      const onDelete = vi.fn();
      const actions = buildActions({ onDelete });
      const del = actions.find((a) => a.id === "delete")!;
      del.action!();
      expect(onDelete).toHaveBeenCalled();
    });

    it("calls onBringToFront from Order submenu", () => {
      const onBringToFront = vi.fn();
      const actions = buildActions({ onBringToFront });
      const order = actions.find((a) => a.id === "order")!;
      const btf = order.children!.find((c) => c.id === "bring-to-front")!;
      btf.action!();
      expect(onBringToFront).toHaveBeenCalled();
    });

    it("calls onRotateCW from Rotate submenu", () => {
      const onRotateCW = vi.fn();
      const actions = buildActions({ onRotateCW });
      const rotate = actions.find((a) => a.id === "rotate")!;
      const cw = rotate.children!.find((c) => c.id === "rotate-cw")!;
      cw.action!();
      expect(onRotateCW).toHaveBeenCalled();
    });

    it("calls onPaste from no-selection menu", () => {
      const onPaste = vi.fn();
      const actions = buildActions({ hasSelection: false, onPaste });
      const paste = actions.find((a) => a.id === "paste")!;
      paste.action!();
      expect(onPaste).toHaveBeenCalled();
    });
  });
});
