"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import type {
  WhiteboardTool,
  WhiteboardElement,
  Viewport,
  WhiteboardProps,
  WhiteboardState,
  FontFamily,
  TextAlign,
  StrokeDashPattern,
} from "./whiteboard-types";
import { DEFAULT_VIEWPORT, STICKY_COLORS } from "./whiteboard-types";
import { generateId, preloadImage } from "./whiteboard-utils";
import WhiteboardCanvas from "./WhiteboardCanvas";
import type { ContextMenuEvent } from "./WhiteboardCanvas";
import WhiteboardToolbar from "./WhiteboardToolbar";
import WhiteboardBottomBar from "./WhiteboardBottomBar";
import FloatingTextToolbar from "./FloatingTextToolbar";
import WhiteboardContextMenu, { buildContextMenuActions } from "./WhiteboardContextMenu";
import type { ContextMenuAction } from "./WhiteboardContextMenu";

const MAX_UNDO = 50;

export default function Whiteboard({
  className = "",
  readOnly = false,
  initialData,
  onSave,
  onChange,
}: WhiteboardProps) {
  // Element state
  const [elements, setElements] = useState<WhiteboardElement[]>(
    initialData?.elements || []
  );
  const [viewport, setViewport] = useState<Viewport>(
    initialData?.viewport || { ...DEFAULT_VIEWPORT }
  );

  // Tool state
  const [activeTool, setActiveTool] = useState<WhiteboardTool>("pen");
  const [activeColor, setActiveColor] = useState("#000000");
  const [activeStrokeWidth, setActiveStrokeWidth] = useState(4);
  const [activeOpacity, setActiveOpacity] = useState(1);
  const [activeFontSize, setActiveFontSize] = useState(16);
  const [activeFillColor, setActiveFillColor] = useState<string | null>(null);
  const [activeStickyColor, setActiveStickyColor] = useState(STICKY_COLORS[0]);
  const [activeFontFamily, setActiveFontFamily] = useState<FontFamily>("Inter");
  const [activeFontWeight, setActiveFontWeight] = useState<"normal" | "bold">("normal");
  const [activeFontStyle, setActiveFontStyle] = useState<"normal" | "italic">("normal");
  const [activeTextDecoration, setActiveTextDecoration] = useState<"none" | "underline">("none");
  const [activeTextAlign, setActiveTextAlign] = useState<TextAlign>("left");
  const [activeLineSpacing, setActiveLineSpacing] = useState(1.4);
  const [activeStrokeDash, setActiveStrokeDash] = useState<StrokeDashPattern>("solid");

  // Undo/redo stacks
  const [undoStack, setUndoStack] = useState<WhiteboardElement[][]>([]);
  const [redoStack, setRedoStack] = useState<WhiteboardElement[][]>([]);

  // Text editing overlay
  const [editingText, setEditingText] = useState<WhiteboardElement | null>(null);
  const textInputRef = useRef<HTMLDivElement>(null);
  const editingTextContentRef = useRef("");

  // Context menu state
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    canvasPoint: { x: number; y: number };
    actions: ContextMenuAction[];
  } | null>(null);

  // Clipboard for copy/paste
  const clipboardRef = useRef<WhiteboardElement[]>([]);
  const lastPastePointRef = useRef<{ x: number; y: number } | null>(null);

  // Image file input ref
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Stable ref for onChange to avoid infinite re-render loops
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  // Stable ref for elements — ensures action handlers always access the latest state
  const elementsRef = useRef(elements);
  elementsRef.current = elements;

  // Stable ref for viewport
  const viewportRef = useRef(viewport);
  viewportRef.current = viewport;

  // Stable refs for handlers used in keyboard/paste effects
  // Declared here, updated after handlers are defined below
  const handleUndoRef = useRef<() => void>(() => {});
  const handleRedoRef = useRef<() => void>(() => {});
  const handleCopyRef = useRef<() => void>(() => {});
  const handlePasteRef = useRef<() => void>(() => {});
  const handleDuplicateRef = useRef<() => void>(() => {});
  const handleGroupRef = useRef<() => void>(() => {});
  const handleUngroupRef = useRef<() => void>(() => {});
  const handleDeleteSelectedRef = useRef<() => void>(() => {});
  const handleBringToFrontRef = useRef<() => void>(() => {});
  const handleBringForwardRef = useRef<() => void>(() => {});
  const handleSendToBackRef = useRef<() => void>(() => {});
  const handleSendBackwardRef = useRef<() => void>(() => {});
  const handleSelectElementRef = useRef<(id: string | null, add?: boolean) => void>(() => {});
  const handleAddElementRef = useRef<(el: WhiteboardElement) => void>(() => {});
  const editingTextRef = useRef(editingText);
  const contextMenuRef = useRef(contextMenu);

  // Notify on change (only when elements/viewport actually change)
  useEffect(() => {
    onChangeRef.current?.({ elements, viewport });
  }, [elements, viewport]);

  // Push to undo stack before mutating elements
  const pushUndo = useCallback(
    (currentElements: WhiteboardElement[]) => {
      setUndoStack((prev) => {
        const next = [...prev, currentElements];
        return next.length > MAX_UNDO ? next.slice(-MAX_UNDO) : next;
      });
      setRedoStack([]);
    },
    []
  );

  // Add element
  const handleAddElement = useCallback(
    (element: WhiteboardElement) => {
      pushUndo(elementsRef.current);
      setElements((prev) => [...prev, element]);
    },
    [pushUndo]
  );

  // Update single element (used by commitText)
  const handleUpdateElement = useCallback(
    (id: string, updates: Partial<WhiteboardElement>) => {
      setElements((prev) =>
        prev.map((el) => (el.id === id ? { ...el, ...updates } : el))
      );
    },
    []
  );

  // Batch update multiple elements at once (used for multi-element drag)
  const handleBatchUpdate = useCallback(
    (updates: Map<string, Partial<WhiteboardElement>>) => {
      setElements((prev) =>
        prev.map((el) => {
          const u = updates.get(el.id);
          return u ? { ...el, ...u } : el;
        })
      );
    },
    []
  );

  // Remove element
  const handleRemoveElement = useCallback(
    (id: string) => {
      pushUndo(elementsRef.current);
      setElements((prev) => prev.filter((el) => el.id !== id));
    },
    [pushUndo]
  );

  // Select element — supports group-aware selection and shift+click multi-select
  const handleSelectElement = useCallback(
    (id: string | null, addToSelection = false) => {
      if (id === null) {
        setElements((prev) =>
          prev.map((el) => ({ ...el, isSelected: false }))
        );
        return;
      }
      setElements((prev) => {
        const clickedEl = prev.find((el) => el.id === id);
        if (!clickedEl) return prev;

        if (addToSelection) {
          const wasSelected = clickedEl.isSelected;
          const groupId = clickedEl.groupId;
          return prev.map((el) => {
            if (el.id === id) return { ...el, isSelected: !wasSelected };
            if (groupId && el.groupId === groupId)
              return { ...el, isSelected: !wasSelected };
            return el;
          });
        } else {
          const groupId = clickedEl.groupId;
          return prev.map((el) => {
            if (el.id === id) return { ...el, isSelected: true };
            if (groupId && el.groupId === groupId)
              return { ...el, isSelected: true };
            return { ...el, isSelected: false };
          });
        }
      });
    },
    []
  );

  // Select multiple elements by IDs (used by marquee selection)
  const handleSelectMultiple = useCallback(
    (ids: string[]) => {
      const idSet = new Set(ids);
      // Also include group members for any selected element that has a groupId
      setElements((prev) => {
        const groupIds = new Set<string>();
        for (const el of prev) {
          if (idSet.has(el.id) && el.groupId) {
            groupIds.add(el.groupId);
          }
        }
        return prev.map((el) => ({
          ...el,
          isSelected: idSet.has(el.id) || (!!el.groupId && groupIds.has(el.groupId)),
        }));
      });
    },
    []
  );

  // Text edit handler — also syncs formatting state from the element
  const handleTextEdit = useCallback((element: WhiteboardElement) => {
    editingTextContentRef.current = element.text || "";
    setEditingText(element);
    // Sync formatting state from element being edited
    if (element.fontFamily) setActiveFontFamily(element.fontFamily);
    if (element.fontWeight) setActiveFontWeight(element.fontWeight);
    if (element.fontStyle) setActiveFontStyle(element.fontStyle);
    if (element.textDecoration) setActiveTextDecoration(element.textDecoration);
    if (element.textAlign) setActiveTextAlign(element.textAlign);
    if (element.lineSpacing) setActiveLineSpacing(element.lineSpacing);
    setTimeout(() => {
      const el = textInputRef.current;
      if (el) {
        // Load rich text (HTML) if available, otherwise plain text
        if (element.richText) {
          el.innerHTML = element.richText;
        } else {
          el.textContent = element.text || "";
        }
        el.focus();
        // Place cursor at end
        const range = document.createRange();
        const sel = window.getSelection();
        range.selectNodeContents(el);
        range.collapse(false);
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
    }, 50);
  }, []);

  // Commit text — update existing element or add new one
  const commitText = useCallback(() => {
    // Read text from ref (not state) to avoid stale closure
    const currentText = editingTextContentRef.current;
    if (editingText && currentText.trim()) {
      // Capture rich text (HTML) from the contentEditable
      const richHTML = textInputRef.current?.innerHTML || "";
      const hasRichFormatting = richHTML !== currentText && /<[a-z][\s\S]*>/i.test(richHTML);

      // Capture editor dimensions before committing
      let finalEl = {
        ...editingText,
        text: currentText,
        richText: hasRichFormatting ? richHTML : undefined,
        fontFamily: activeFontFamily,
        fontWeight: activeFontWeight,
        fontStyle: activeFontStyle,
        textDecoration: activeTextDecoration,
        textAlign: activeTextAlign,
        lineSpacing: activeLineSpacing,
      };
      if (textInputRef.current) {
        finalEl.width = textInputRef.current.offsetWidth / viewport.zoom;
        finalEl.height = textInputRef.current.offsetHeight / viewport.zoom;
      }
      pushUndo(elementsRef.current);
      const exists = elementsRef.current.some((el) => el.id === finalEl.id);
      if (exists) {
        setElements((prev) =>
          prev.map((el) =>
            el.id === finalEl.id
              ? {
                  ...el,
                  text: finalEl.text,
                  richText: finalEl.richText,
                  width: finalEl.width,
                  height: finalEl.height,
                  fontSize: finalEl.fontSize,
                  fontFamily: finalEl.fontFamily,
                  fontWeight: finalEl.fontWeight,
                  fontStyle: finalEl.fontStyle,
                  textDecoration: finalEl.textDecoration,
                  textAlign: finalEl.textAlign,
                  lineSpacing: finalEl.lineSpacing,
                }
              : el
          )
        );
      } else {
        setElements((prev) => [...prev, finalEl]);
      }
    }
    setEditingText(null);
  }, [editingText, pushUndo, viewport.zoom, activeFontFamily, activeFontWeight, activeFontStyle, activeTextDecoration, activeTextAlign, activeLineSpacing]);

  // Undo — uses functional updates to avoid depending on undoStack/redoStack
  const handleUndo = useCallback(() => {
    setUndoStack((prevUndo) => {
      if (prevUndo.length === 0) return prevUndo;
      const previous = prevUndo[prevUndo.length - 1];
      setRedoStack((prevRedo) => [...prevRedo, elementsRef.current]);
      setElements(previous);
      return prevUndo.slice(0, -1);
    });
  }, []);

  // Redo — uses functional updates to avoid depending on undoStack/redoStack
  const handleRedo = useCallback(() => {
    setRedoStack((prevRedo) => {
      if (prevRedo.length === 0) return prevRedo;
      const next = prevRedo[prevRedo.length - 1];
      setUndoStack((prevUndo) => [...prevUndo, elementsRef.current]);
      setElements(next);
      return prevRedo.slice(0, -1);
    });
  }, []);

  // Zoom helpers
  const handleZoomIn = useCallback(() => {
    setViewport((v) => ({ ...v, zoom: Math.min(5, v.zoom * 1.2) }));
  }, []);

  const handleZoomOut = useCallback(() => {
    setViewport((v) => ({ ...v, zoom: Math.max(0.1, v.zoom / 1.2) }));
  }, []);

  const handleFitToScreen = useCallback(() => {
    setViewport({ x: 0, y: 0, zoom: 1 });
  }, []);

  // Push undo before a drag-move begins (called once per drag)
  const handleMoveStart = useCallback(() => {
    pushUndo(elementsRef.current);
  }, [pushUndo]);

  // Clear all
  const handleClearAll = useCallback(() => {
    pushUndo(elementsRef.current);
    setElements([]);
  }, [pushUndo]);

  // ── Z-ordering ──────────────────────────────────────────────────────

  const handleBringToFront = useCallback(() => {
    pushUndo(elementsRef.current);
    setElements((prev) => {
      const selected = prev.filter((el) => el.isSelected);
      const rest = prev.filter((el) => !el.isSelected);
      if (selected.length === 0) return prev;
      return [...rest, ...selected];
    });
  }, [pushUndo]);

  const handleSendToBack = useCallback(() => {
    pushUndo(elementsRef.current);
    setElements((prev) => {
      const selected = prev.filter((el) => el.isSelected);
      const rest = prev.filter((el) => !el.isSelected);
      if (selected.length === 0) return prev;
      return [...selected, ...rest];
    });
  }, [pushUndo]);

  const handleBringForward = useCallback(() => {
    pushUndo(elementsRef.current);
    setElements((prev) => {
      const result = [...prev];
      let moved = false;
      for (let i = result.length - 2; i >= 0; i--) {
        if (result[i].isSelected && !result[i + 1].isSelected) {
          [result[i], result[i + 1]] = [result[i + 1], result[i]];
          moved = true;
        }
      }
      return moved ? result : prev;
    });
  }, [pushUndo]);

  const handleSendBackward = useCallback(() => {
    pushUndo(elementsRef.current);
    setElements((prev) => {
      const result = [...prev];
      let moved = false;
      for (let i = 1; i < result.length; i++) {
        if (result[i].isSelected && !result[i - 1].isSelected) {
          [result[i], result[i - 1]] = [result[i - 1], result[i]];
          moved = true;
        }
      }
      return moved ? result : prev;
    });
  }, [pushUndo]);

  // ── Rotation & Flip ─────────────────────────────────────────────────

  const handleRotateCW = useCallback(() => {
    pushUndo(elementsRef.current);
    setElements((prev) =>
      prev.map((el) =>
        el.isSelected
          ? { ...el, rotation: ((el.rotation || 0) + 90) % 360 }
          : el
      )
    );
  }, [pushUndo]);

  const handleRotateCCW = useCallback(() => {
    pushUndo(elementsRef.current);
    setElements((prev) =>
      prev.map((el) =>
        el.isSelected
          ? { ...el, rotation: ((el.rotation || 0) - 90 + 360) % 360 }
          : el
      )
    );
  }, [pushUndo]);

  const handleFlipH = useCallback(() => {
    pushUndo(elementsRef.current);
    setElements((prev) =>
      prev.map((el) =>
        el.isSelected ? { ...el, flipH: !el.flipH } : el
      )
    );
  }, [pushUndo]);

  const handleFlipV = useCallback(() => {
    pushUndo(elementsRef.current);
    setElements((prev) =>
      prev.map((el) =>
        el.isSelected ? { ...el, flipV: !el.flipV } : el
      )
    );
  }, [pushUndo]);

  // ── Grouping ──────────────────────────────────────────────────────────

  const handleGroup = useCallback(() => {
    const cur = elementsRef.current;
    const selected = cur.filter((el) => el.isSelected);
    if (selected.length < 2) return;
    pushUndo(cur);
    const groupId = generateId();
    setElements((prev) =>
      prev.map((el) => (el.isSelected ? { ...el, groupId } : el))
    );
  }, [pushUndo]);

  const handleUngroup = useCallback(() => {
    const cur = elementsRef.current;
    const hasGrouped = cur.some((el) => el.isSelected && el.groupId);
    if (!hasGrouped) return;
    pushUndo(cur);
    setElements((prev) =>
      prev.map((el) =>
        el.isSelected ? { ...el, groupId: undefined } : el
      )
    );
  }, [pushUndo]);

  // ── Delete selected ───────────────────────────────────────────────────

  const handleDeleteSelected = useCallback(() => {
    const cur = elementsRef.current;
    const selected = cur.filter((el) => el.isSelected);
    if (selected.length === 0) return;
    pushUndo(cur);
    const selectedIds = new Set(selected.map((el) => el.id));
    setElements((prev) => prev.filter((el) => !selectedIds.has(el.id)));
  }, [pushUndo]);

  // ── Copy / Paste / Duplicate ──────────────────────────────────────────

  const handleCopy = useCallback(() => {
    const selected = elementsRef.current.filter((el) => el.isSelected);
    if (selected.length > 0) {
      clipboardRef.current = selected.map((el) => ({ ...el, isSelected: false }));
    }
  }, []);

  const handlePaste = useCallback(() => {
    if (clipboardRef.current.length === 0) return;
    pushUndo(elementsRef.current);

    const v = viewportRef.current;
    const offsetX = 20;
    const offsetY = 20;

    const newElements = clipboardRef.current.map((el) => {
      const newEl: WhiteboardElement = {
        ...el,
        id: generateId(),
        isSelected: true,
      };
      if (newEl.x !== undefined) {
        newEl.x = (newEl.x ?? 0) + offsetX;
        newEl.y = (newEl.y ?? 0) + offsetY;
      }
      if (newEl.startX !== undefined) {
        newEl.startX = (newEl.startX ?? 0) + offsetX;
        newEl.startY = (newEl.startY ?? 0) + offsetY;
        if (newEl.endX !== undefined) {
          newEl.endX = (newEl.endX ?? 0) + offsetX;
          newEl.endY = (newEl.endY ?? 0) + offsetY;
        }
      }
      if (newEl.points) {
        newEl.points = newEl.points.map((p) => ({
          x: p.x + offsetX,
          y: p.y + offsetY,
        }));
      }
      return newEl;
    });

    // Update clipboard for next paste to offset further
    clipboardRef.current = newElements.map((el) => ({ ...el, isSelected: false }));

    // Deselect existing, add new selected
    setElements((prev) => [
      ...prev.map((el) => ({ ...el, isSelected: false })),
      ...newElements,
    ]);
  }, [pushUndo]);

  const handleDuplicate = useCallback(() => {
    const selected = elementsRef.current.filter((el) => el.isSelected);
    if (selected.length === 0) return;
    pushUndo(elementsRef.current);

    const newElements = selected.map((el) => {
      const newEl: WhiteboardElement = {
        ...el,
        id: generateId(),
        isSelected: true,
      };
      const offset = 20;
      if (newEl.x !== undefined) {
        newEl.x = (newEl.x ?? 0) + offset;
        newEl.y = (newEl.y ?? 0) + offset;
      }
      if (newEl.startX !== undefined) {
        newEl.startX = (newEl.startX ?? 0) + offset;
        newEl.startY = (newEl.startY ?? 0) + offset;
        if (newEl.endX !== undefined) {
          newEl.endX = (newEl.endX ?? 0) + offset;
          newEl.endY = (newEl.endY ?? 0) + offset;
        }
      }
      if (newEl.points) {
        newEl.points = newEl.points.map((p) => ({
          x: p.x + offset,
          y: p.y + offset,
        }));
      }
      return newEl;
    });

    setElements((prev) => [
      ...prev.map((el) => ({ ...el, isSelected: false })),
      ...newElements,
    ]);
  }, [pushUndo]);

  // ── Image upload ──────────────────────────────────────────────────────

  const handleInsertImage = useCallback(() => {
    imageInputRef.current?.click();
  }, []);

  const handleImageFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      const v = viewportRef.current;
      const targetX = -v.x / v.zoom + 40;
      const targetY = -v.y / v.zoom + 40;

      Array.from(files).forEach((file, i) => {
        if (!file.type.startsWith("image/")) return;
        const reader = new FileReader();
        reader.onload = () => {
          const dataUrl = reader.result as string;
          const img = new Image();
          img.onload = () => {
            let w = img.naturalWidth;
            let h = img.naturalHeight;
            const maxDim = 500;
            if (w > maxDim || h > maxDim) {
              const scale = maxDim / Math.max(w, h);
              w = Math.round(w * scale);
              h = Math.round(h * scale);
            }
            // Preload into cache
            preloadImage(dataUrl);
            handleAddElement({
              id: generateId(),
              type: "image",
              x: targetX + i * 30,
              y: targetY + i * 30,
              width: w,
              height: h,
              imageUrl: dataUrl,
              color: "#d1d5db",
              strokeWidth: 0,
              opacity: 1,
            });
          };
          img.src = dataUrl;
        };
        reader.readAsDataURL(file);
      });
      // Reset input so same file can be selected again
      e.target.value = "";
    },
    [handleAddElement]
  );

  // ── Insert table ──────────────────────────────────────────────────────

  const handleInsertTable = useCallback(
    (rows: number, cols: number) => {
      const v = viewportRef.current;
      const targetX = -v.x / v.zoom + 60;
      const targetY = -v.y / v.zoom + 60;
      const emptyData: string[][] = Array.from({ length: rows }, (_, r) =>
        Array.from({ length: cols }, (_, c) =>
          r === 0 ? `Col ${c + 1}` : ""
        )
      );
      handleAddElement({
        id: generateId(),
        type: "table",
        x: targetX,
        y: targetY,
        width: cols * 120,
        height: rows * 36,
        tableRows: rows,
        tableCols: cols,
        tableData: emptyData,
        color: "#3b82f6",
        fillColor: "#ffffff",
        strokeWidth: 1,
        opacity: 1,
        fontSize: 13,
      });
    },
    [handleAddElement]
  );

  // ── Insert chart ──────────────────────────────────────────────────────

  const handleInsertChart = useCallback(
    (chartType: "bar" | "column" | "line" | "pie") => {
      const v = viewportRef.current;
      const targetX = -v.x / v.zoom + 60;
      const targetY = -v.y / v.zoom + 60;
      handleAddElement({
        id: generateId(),
        type: "chart",
        x: targetX,
        y: targetY,
        width: 360,
        height: 240,
        chartType,
        chartData: {
          labels: ["Q1", "Q2", "Q3", "Q4"],
          values: [35, 65, 45, 80],
        },
        color: "#3b82f6",
        strokeWidth: 1,
        opacity: 1,
      });
    },
    [handleAddElement]
  );

  // ── Color / Fill / Stroke change (update selected elements too) ──────

  const handleColorChange = useCallback(
    (color: string) => {
      setActiveColor(color);
      const selected = elementsRef.current.filter((el) => el.isSelected);
      if (selected.length > 0) {
        pushUndo(elementsRef.current);
        // Collect all group IDs from selection so entire groups are updated
        const groupIds = new Set<string>();
        for (const el of selected) {
          if (el.groupId) groupIds.add(el.groupId);
        }
        const selectedIds = new Set(selected.map((el) => el.id));
        setElements((prev) =>
          prev.map((el) =>
            selectedIds.has(el.id) || (el.groupId && groupIds.has(el.groupId))
              ? { ...el, color }
              : el
          )
        );
      }
    },
    [pushUndo]
  );

  const handleFillColorChange = useCallback(
    (fillColor: string | null) => {
      setActiveFillColor(fillColor);
      const selected = elementsRef.current.filter((el) => el.isSelected);
      if (selected.length > 0) {
        pushUndo(elementsRef.current);
        const groupIds = new Set<string>();
        for (const el of selected) {
          if (el.groupId) groupIds.add(el.groupId);
        }
        const selectedIds = new Set(selected.map((el) => el.id));
        setElements((prev) =>
          prev.map((el) =>
            selectedIds.has(el.id) || (el.groupId && groupIds.has(el.groupId))
              ? { ...el, fillColor }
              : el
          )
        );
      }
    },
    [pushUndo]
  );

  const handleStrokeWidthChange = useCallback(
    (strokeWidth: number) => {
      setActiveStrokeWidth(strokeWidth);
      const selected = elementsRef.current.filter((el) => el.isSelected);
      if (selected.length > 0) {
        pushUndo(elementsRef.current);
        const groupIds = new Set<string>();
        for (const el of selected) {
          if (el.groupId) groupIds.add(el.groupId);
        }
        const selectedIds = new Set(selected.map((el) => el.id));
        setElements((prev) =>
          prev.map((el) =>
            selectedIds.has(el.id) || (el.groupId && groupIds.has(el.groupId))
              ? { ...el, strokeWidth }
              : el
          )
        );
      }
    },
    [pushUndo]
  );

  const handleFontSizeChange = useCallback(
    (size: number) => {
      setActiveFontSize(size);
      // Update selected text/sticky elements
      const selected = elementsRef.current.filter((el) => el.isSelected);
      const textEls = selected.filter((el) => el.type === "text" || el.type === "sticky");
      if (textEls.length > 0) {
        pushUndo(elementsRef.current);
        const ids = new Set(textEls.map((el) => el.id));
        setElements((prev) =>
          prev.map((el) =>
            ids.has(el.id) ? { ...el, fontSize: size } : el
          )
        );
      }
    },
    [pushUndo]
  );

  // ── Text formatting handlers ──────────────────────────────────────────

  const handleFontFamilyChange = useCallback(
    (font: FontFamily) => {
      setActiveFontFamily(font);
      const selected = elementsRef.current.filter((el) => el.isSelected);
      const textEls = selected.filter((el) => el.type === "text" || el.type === "sticky");
      if (textEls.length > 0) {
        pushUndo(elementsRef.current);
        const ids = new Set(textEls.map((el) => el.id));
        setElements((prev) =>
          prev.map((el) =>
            ids.has(el.id) ? { ...el, fontFamily: font } : el
          )
        );
      }
    },
    [pushUndo]
  );

  // Helper: check if we're actively editing text and should use inline formatting
  const applyInlineCommand = useCallback((command: string): boolean => {
    if (!editingText || !textInputRef.current) return false;
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && textInputRef.current.contains(sel.anchorNode)) {
      document.execCommand(command, false);
      // Update the ref with new text content (innerText preserves line breaks)
      editingTextContentRef.current = textInputRef.current.innerText || "";
      // Refocus the editor
      textInputRef.current.focus();
      return true;
    }
    return false;
  }, [editingText]);

  const handleFontWeightToggle = useCallback(() => {
    // If editing text, apply inline bold
    if (applyInlineCommand("bold")) return;
    const newWeight = activeFontWeight === "bold" ? "normal" : "bold";
    setActiveFontWeight(newWeight);
    const selected = elementsRef.current.filter((el) => el.isSelected);
    const textEls = selected.filter((el) => el.type === "text" || el.type === "sticky");
    if (textEls.length > 0) {
      pushUndo(elementsRef.current);
      const ids = new Set(textEls.map((el) => el.id));
      setElements((prev) =>
        prev.map((el) =>
          ids.has(el.id) ? { ...el, fontWeight: newWeight } : el
        )
      );
    }
  }, [activeFontWeight, pushUndo, applyInlineCommand]);

  const handleFontStyleToggle = useCallback(() => {
    // If editing text, apply inline italic
    if (applyInlineCommand("italic")) return;
    const newStyle = activeFontStyle === "italic" ? "normal" : "italic";
    setActiveFontStyle(newStyle);
    const selected = elementsRef.current.filter((el) => el.isSelected);
    const textEls = selected.filter((el) => el.type === "text" || el.type === "sticky");
    if (textEls.length > 0) {
      pushUndo(elementsRef.current);
      const ids = new Set(textEls.map((el) => el.id));
      setElements((prev) =>
        prev.map((el) =>
          ids.has(el.id) ? { ...el, fontStyle: newStyle } : el
        )
      );
    }
  }, [activeFontStyle, pushUndo, applyInlineCommand]);

  const handleTextDecorationToggle = useCallback(() => {
    // If editing text, apply inline underline
    if (applyInlineCommand("underline")) return;
    const newDeco = activeTextDecoration === "underline" ? "none" : "underline";
    setActiveTextDecoration(newDeco);
    const selected = elementsRef.current.filter((el) => el.isSelected);
    const textEls = selected.filter((el) => el.type === "text" || el.type === "sticky");
    if (textEls.length > 0) {
      pushUndo(elementsRef.current);
      const ids = new Set(textEls.map((el) => el.id));
      setElements((prev) =>
        prev.map((el) =>
          ids.has(el.id) ? { ...el, textDecoration: newDeco } : el
        )
      );
    }
  }, [activeTextDecoration, pushUndo, applyInlineCommand]);

  const handleTextAlignChange = useCallback(
    (align: TextAlign) => {
      setActiveTextAlign(align);
      const selected = elementsRef.current.filter((el) => el.isSelected);
      const textEls = selected.filter((el) => el.type === "text" || el.type === "sticky");
      if (textEls.length > 0) {
        pushUndo(elementsRef.current);
        const ids = new Set(textEls.map((el) => el.id));
        setElements((prev) =>
          prev.map((el) =>
            ids.has(el.id) ? { ...el, textAlign: align } : el
          )
        );
      }
    },
    [pushUndo]
  );

  const handleLineSpacingChange = useCallback(
    (spacing: number) => {
      setActiveLineSpacing(spacing);
      const selected = elementsRef.current.filter((el) => el.isSelected);
      const textEls = selected.filter((el) => el.type === "text" || el.type === "sticky");
      if (textEls.length > 0) {
        pushUndo(elementsRef.current);
        const ids = new Set(textEls.map((el) => el.id));
        setElements((prev) =>
          prev.map((el) =>
            ids.has(el.id) ? { ...el, lineSpacing: spacing } : el
          )
        );
      }
    },
    [pushUndo]
  );

  const handleStrokeDashChange = useCallback(
    (pattern: StrokeDashPattern) => {
      setActiveStrokeDash(pattern);
      const selected = elementsRef.current.filter((el) => el.isSelected);
      if (selected.length > 0) {
        pushUndo(elementsRef.current);
        const groupIds = new Set<string>();
        for (const el of selected) {
          if (el.groupId) groupIds.add(el.groupId);
        }
        const selectedIds = new Set(selected.map((el) => el.id));
        setElements((prev) =>
          prev.map((el) =>
            selectedIds.has(el.id) || (el.groupId && groupIds.has(el.groupId))
              ? { ...el, strokeDash: pattern }
              : el
          )
        );
      }
    },
    [pushUndo]
  );

  // ── Context menu handler ──────────────────────────────────────────────

  const handleContextMenu = useCallback(
    (event: ContextMenuEvent) => {
      const cur = elementsRef.current;
      const selectedEls = cur.filter((el) => el.isSelected);
      const hasSelection = selectedEls.length > 0;
      const allSameGroup =
        selectedEls.length > 1 &&
        selectedEls.every(
          (el) => el.groupId && el.groupId === selectedEls[0].groupId
        );
      const canGroup = selectedEls.length > 1 && !allSameGroup;
      const canUngroup = selectedEls.some((el) => el.groupId);

      lastPastePointRef.current = event.canvasPoint;

      const actions = buildContextMenuActions({
        hasSelection,
        selectionCount: selectedEls.length,
        canGroup,
        canUngroup,
        onBringToFront: handleBringToFront,
        onBringForward: handleBringForward,
        onSendBackward: handleSendBackward,
        onSendToBack: handleSendToBack,
        onRotateCW: handleRotateCW,
        onRotateCCW: handleRotateCCW,
        onFlipH: handleFlipH,
        onFlipV: handleFlipV,
        onCopy: handleCopy,
        onPaste: handlePaste,
        onDuplicate: handleDuplicate,
        onGroup: handleGroup,
        onUngroup: handleUngroup,
        onDelete: handleDeleteSelected,
        onInsertImage: handleInsertImage,
      });

      setContextMenu({
        x: event.x,
        y: event.y,
        canvasPoint: event.canvasPoint,
        actions,
      });
    },
    [
      handleBringToFront, handleBringForward, handleSendBackward, handleSendToBack,
      handleRotateCW, handleRotateCCW, handleFlipH, handleFlipV,
      handleCopy, handlePaste, handleDuplicate,
      handleGroup, handleUngroup, handleDeleteSelected, handleInsertImage,
    ]
  );

  const closeContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  // ── Load template ─────────────────────────────────────────────────────

  const handleLoadTemplate = useCallback(
    (templateElements: WhiteboardElement[]) => {
      pushUndo(elementsRef.current);

      let minX = Infinity;
      let minY = Infinity;
      for (const el of templateElements) {
        if (el.x !== undefined) {
          minX = Math.min(minX, el.x);
          minY = Math.min(minY, el.y ?? 0);
        }
        if (el.startX !== undefined) {
          minX = Math.min(minX, el.startX);
          minY = Math.min(minY, el.startY ?? 0);
        }
        if (el.points) {
          for (const p of el.points) {
            minX = Math.min(minX, p.x);
            minY = Math.min(minY, p.y);
          }
        }
      }
      if (!isFinite(minX)) minX = 0;
      if (!isFinite(minY)) minY = 0;

      const targetX = -viewport.x / viewport.zoom;
      const targetY = -viewport.y / viewport.zoom;
      const offsetX = targetX - minX + 40;
      const offsetY = targetY - minY + 40;

      const newElements = templateElements.map((el) => {
        const newEl: WhiteboardElement = { ...el, id: generateId() };
        if (newEl.x !== undefined) {
          newEl.x = (newEl.x ?? 0) + offsetX;
          newEl.y = (newEl.y ?? 0) + offsetY;
        }
        if (newEl.startX !== undefined) {
          newEl.startX = (newEl.startX ?? 0) + offsetX;
          newEl.startY = (newEl.startY ?? 0) + offsetY;
          if (newEl.endX !== undefined) {
            newEl.endX = (newEl.endX ?? 0) + offsetX;
            newEl.endY = (newEl.endY ?? 0) + offsetY;
          }
        }
        if (newEl.points) {
          newEl.points = newEl.points.map((p) => ({
            x: p.x + offsetX,
            y: p.y + offsetY,
          }));
        }
        return newEl;
      });

      setElements((prev) => [...prev, ...newElements]);
    },
    [viewport, pushUndo]
  );

  // ── Save / Export ─────────────────────────────────────────────────────

  const handleSave = useCallback(() => {
    onSave?.({ elements, viewport });
  }, [elements, viewport, onSave]);

  const handleExportPNG = useCallback(() => {
    // Find the static canvas and export it
    const canvas = document.querySelector<HTMLCanvasElement>(
      ".whiteboard-static-canvas"
    );
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `whiteboard-${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }, []);

  const handleExportJSON = useCallback(() => {
    const data: WhiteboardState = { elements, viewport };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `whiteboard-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [elements, viewport]);

  const handleCopyToClipboard = useCallback(async () => {
    const canvas = document.querySelector<HTMLCanvasElement>(
      ".whiteboard-static-canvas"
    );
    if (!canvas) return;
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      try {
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);
      } catch {
        // Fallback: download instead
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `whiteboard-${Date.now()}.png`;
        a.click();
        URL.revokeObjectURL(url);
      }
    });
  }, []);

  // ── Sync handler refs (must be after all handler definitions) ──────────
  handleUndoRef.current = handleUndo;
  handleRedoRef.current = handleRedo;
  handleCopyRef.current = handleCopy;
  handlePasteRef.current = handlePaste;
  handleDuplicateRef.current = handleDuplicate;
  handleGroupRef.current = handleGroup;
  handleUngroupRef.current = handleUngroup;
  handleDeleteSelectedRef.current = handleDeleteSelected;
  handleBringToFrontRef.current = handleBringToFront;
  handleBringForwardRef.current = handleBringForward;
  handleSendToBackRef.current = handleSendToBack;
  handleSendBackwardRef.current = handleSendBackward;
  handleSelectElementRef.current = handleSelectElement;
  handleAddElementRef.current = handleAddElement;
  editingTextRef.current = editingText;
  contextMenuRef.current = contextMenu;

  // ── Clipboard paste (Ctrl+V for images from clipboard) ────────────────

  useEffect(() => {
    const handlePasteEvent = (e: ClipboardEvent) => {
      if (readOnly || editingTextRef.current) return;
      const items = e.clipboardData?.items;
      if (!items) return;

      for (const item of items) {
        if (item.type.startsWith("image/")) {
          e.preventDefault();
          const file = item.getAsFile();
          if (!file) continue;
          const reader = new FileReader();
          reader.onload = () => {
            const dataUrl = reader.result as string;
            const img = new Image();
            img.onload = () => {
              let w = img.naturalWidth;
              let h = img.naturalHeight;
              const maxDim = 500;
              if (w > maxDim || h > maxDim) {
                const scale = maxDim / Math.max(w, h);
                w = Math.round(w * scale);
                h = Math.round(h * scale);
              }
              const v = viewportRef.current;
              const targetX = -v.x / v.zoom + 60;
              const targetY = -v.y / v.zoom + 60;
              preloadImage(dataUrl);
              handleAddElementRef.current({
                id: generateId(),
                type: "image",
                x: targetX,
                y: targetY,
                width: w,
                height: h,
                imageUrl: dataUrl,
                color: "#d1d5db",
                strokeWidth: 0,
                opacity: 1,
              });
            };
            img.src = dataUrl;
          };
          reader.readAsDataURL(file);
          return;
        }
      }
    };

    window.addEventListener("paste", handlePasteEvent);
    return () => window.removeEventListener("paste", handlePasteEvent);
  }, [readOnly]);

  // ── Keyboard shortcuts ────────────────────────────────────────────────

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (readOnly) return;

      // Close context menu on any key
      if (contextMenuRef.current) {
        setContextMenu(null);
      }

      const isEditing = editingTextRef.current;

      // Undo: Ctrl+Z (skip when editing text — let browser handle it)
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey && !isEditing) {
        e.preventDefault();
        handleUndoRef.current();
      }
      // Redo: Ctrl+Y or Ctrl+Shift+Z (skip when editing text)
      if (
        (((e.ctrlKey || e.metaKey) && e.key === "y") ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "z")) && !isEditing
      ) {
        e.preventDefault();
        handleRedoRef.current();
      }
      // Copy: Ctrl+C
      if ((e.ctrlKey || e.metaKey) && e.key === "c" && !isEditing) {
        handleCopyRef.current();
      }
      // Paste: Ctrl+V (element paste — image paste handled in paste event listener)
      if ((e.ctrlKey || e.metaKey) && e.key === "v" && !isEditing) {
        if (clipboardRef.current.length > 0) {
          e.preventDefault();
          handlePasteRef.current();
        }
      }
      // Duplicate: Ctrl+D
      if ((e.ctrlKey || e.metaKey) && e.key === "d" && !isEditing) {
        e.preventDefault();
        handleDuplicateRef.current();
      }
      // Group: Ctrl+G
      if ((e.ctrlKey || e.metaKey) && e.key === "g" && !e.shiftKey && !isEditing) {
        e.preventDefault();
        handleGroupRef.current();
      }
      // Ungroup: Ctrl+Shift+G
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "G" && !isEditing) {
        e.preventDefault();
        handleUngroupRef.current();
      }
      // Delete all selected
      if ((e.key === "Delete" || e.key === "Backspace") && !isEditing) {
        const hasSelected = elementsRef.current.some((el) => el.isSelected);
        if (hasSelected) {
          e.preventDefault();
          handleDeleteSelectedRef.current();
        }
      }
      // Z-ordering shortcuts
      if ((e.ctrlKey || e.metaKey) && e.key === "ArrowUp" && !isEditing) {
        e.preventDefault();
        if (e.shiftKey) {
          handleBringToFrontRef.current();
        } else {
          handleBringForwardRef.current();
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "ArrowDown" && !isEditing) {
        e.preventDefault();
        if (e.shiftKey) {
          handleSendToBackRef.current();
        } else {
          handleSendBackwardRef.current();
        }
      }
      // Escape: deselect or cancel text edit
      if (e.key === "Escape") {
        if (isEditing) {
          setEditingText(null);
        } else {
          handleSelectElementRef.current(null);
        }
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [readOnly]);

  return (
    <div className={`flex flex-col h-full overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 ${className}`}>
      {/* Hidden file input for image upload */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleImageFileChange}
      />

      {/* Canvas area — all layers use absolute positioning within this container */}
      <div className="relative flex-1 min-h-0" style={{ isolation: "isolate" }}>
        <WhiteboardCanvas
          elements={elements}
          viewport={viewport}
          activeTool={activeTool}
          activeColor={activeColor}
          activeStrokeWidth={activeStrokeWidth}
          activeOpacity={activeOpacity}
          activeFillColor={activeFillColor}
          activeFontSize={activeFontSize}
          activeStickyColor={activeStickyColor}
          activeFontFamily={activeFontFamily}
          activeFontWeight={activeFontWeight}
          activeFontStyle={activeFontStyle}
          activeTextDecoration={activeTextDecoration}
          activeTextAlign={activeTextAlign}
          activeLineSpacing={activeLineSpacing}
          activeStrokeDash={activeStrokeDash}
          readOnly={readOnly}
          onAddElement={handleAddElement}
          onBatchUpdate={handleBatchUpdate}
          onRemoveElement={handleRemoveElement}
          onSelectElement={handleSelectElement}
          onSelectMultiple={handleSelectMultiple}
          onViewportChange={setViewport}
          onTextEdit={handleTextEdit}
          onMoveStart={handleMoveStart}
          onContextMenu={handleContextMenu}
        />

        {/* Floating toolbar — absolutely positioned over the canvas */}
        <WhiteboardToolbar
          activeTool={activeTool}
          onToolChange={setActiveTool}
          activeColor={activeColor}
          activeStrokeWidth={activeStrokeWidth}
          activeFillColor={activeFillColor}
          activeFontSize={activeFontSize}
          activeStickyColor={activeStickyColor}
          activeFontFamily={activeFontFamily}
          activeFontWeight={activeFontWeight}
          activeFontStyle={activeFontStyle}
          activeTextDecoration={activeTextDecoration}
          activeTextAlign={activeTextAlign}
          activeLineSpacing={activeLineSpacing}
          activeStrokeDash={activeStrokeDash}
          onColorChange={handleColorChange}
          onStrokeWidthChange={handleStrokeWidthChange}
          onFillColorChange={handleFillColorChange}
          onFontSizeChange={handleFontSizeChange}
          onStickyColorChange={setActiveStickyColor}
          onFontFamilyChange={handleFontFamilyChange}
          onFontWeightToggle={handleFontWeightToggle}
          onFontStyleToggle={handleFontStyleToggle}
          onTextDecorationToggle={handleTextDecorationToggle}
          onTextAlignChange={handleTextAlignChange}
          onLineSpacingChange={handleLineSpacingChange}
          onStrokeDashChange={handleStrokeDashChange}
          onLoadTemplate={handleLoadTemplate}
          onInsertImage={handleInsertImage}
          onInsertTable={handleInsertTable}
          onInsertChart={handleInsertChart}
          onExportPNG={handleExportPNG}
          onExportJSON={handleExportJSON}
          onCopyToClipboard={handleCopyToClipboard}
          readOnly={readOnly}
        />

        {/* Floating text toolbar — above selected text/sticky */}
        {(() => {
          const selectedTextEl = elements.find(
            (el) => el.isSelected && (el.type === "text" || el.type === "sticky")
          );
          if (!selectedTextEl || editingText) return null;
          return (
            <FloatingTextToolbar
              element={selectedTextEl}
              viewport={viewport}
              activeFontFamily={activeFontFamily}
              activeFontSize={activeFontSize}
              activeFontWeight={activeFontWeight}
              activeFontStyle={activeFontStyle}
              activeTextDecoration={activeTextDecoration}
              activeTextAlign={activeTextAlign}
              onFontFamilyChange={handleFontFamilyChange}
              onFontSizeChange={handleFontSizeChange}
              onFontWeightToggle={handleFontWeightToggle}
              onFontStyleToggle={handleFontStyleToggle}
              onTextDecorationToggle={handleTextDecorationToggle}
              onTextAlignChange={handleTextAlignChange}
            />
          );
        })()}

        {/* Text editing overlay */}
        {editingText && (
          <div
            className="absolute z-[60]"
            style={{
              left: (editingText.x || 0) * viewport.zoom + viewport.x,
              top: (editingText.y || 0) * viewport.zoom + viewport.y,
            }}
            onPointerDown={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div
              ref={textInputRef}
              contentEditable
              suppressContentEditableWarning
              onInput={(e) => {
                editingTextContentRef.current = (e.target as HTMLDivElement).innerText || "";
              }}
              onBlur={(e) => {
                // Don't commit if focus moves to a toolbar button or within the editing overlay
                const related = e.relatedTarget as HTMLElement | null;
                if (related && e.currentTarget.parentElement?.contains(related)) return;
                // Use timeout so toolbar button clicks can fire before commit
                // The button handler (e.g. bold) can refocus the editor, cancelling the commit
                const editorEl = textInputRef.current;
                setTimeout(() => {
                  // Only commit if the editor is no longer focused
                  if (document.activeElement !== editorEl && !editorEl?.contains(document.activeElement)) {
                    commitText();
                  }
                }, 150);
              }}
              onKeyDown={(e) => {
                e.stopPropagation();
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  commitText();
                }
              }}
              className="p-1 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 border-2 border-blue-500 dark:border-blue-400 midnight:border-cyan-400 purple:border-pink-400 rounded-lg text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 outline-none shadow-lg whitespace-pre-wrap break-words cursor-text"
              style={{
                fontSize: (editingText.fontSize || 16) * viewport.zoom,
                fontFamily: `${activeFontFamily || "Inter"}, system-ui, sans-serif`,
                fontWeight: activeFontWeight || "normal",
                fontStyle: activeFontStyle || "normal",
                textDecoration: activeTextDecoration === "underline" ? "underline" : "none",
                textAlign: activeTextAlign || "left",
                lineHeight: activeLineSpacing || 1.4,
                minWidth: 120,
                maxWidth: 600,
                minHeight: 40,
              }}
            />
          </div>
        )}

        {/* Context menu */}
        {contextMenu && (
          <WhiteboardContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            actions={contextMenu.actions}
            onClose={closeContextMenu}
          />
        )}
      </div>

      {/* Bottom bar */}
      <WhiteboardBottomBar
        viewport={viewport}
        canUndo={undoStack.length > 0}
        canRedo={redoStack.length > 0}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onFitToScreen={handleFitToScreen}
        onClearAll={handleClearAll}
        readOnly={readOnly}
      />
    </div>
  );
}
