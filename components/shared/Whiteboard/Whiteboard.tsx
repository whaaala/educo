"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import type {
  WhiteboardTool,
  WhiteboardElement,
  Viewport,
  WhiteboardProps,
  WhiteboardState,
} from "./whiteboard-types";
import { DEFAULT_VIEWPORT, STICKY_COLORS } from "./whiteboard-types";
import WhiteboardCanvas from "./WhiteboardCanvas";
import WhiteboardToolbar from "./WhiteboardToolbar";
import WhiteboardProperties from "./WhiteboardProperties";
import WhiteboardBottomBar from "./WhiteboardBottomBar";

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

  // Undo/redo stacks
  const [undoStack, setUndoStack] = useState<WhiteboardElement[][]>([]);
  const [redoStack, setRedoStack] = useState<WhiteboardElement[][]>([]);

  // Text editing overlay
  const [editingText, setEditingText] = useState<WhiteboardElement | null>(null);
  const textInputRef = useRef<HTMLTextAreaElement>(null);

  // Notify on change
  useEffect(() => {
    onChange?.({ elements, viewport });
  }, [elements, viewport, onChange]);

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
      pushUndo(elements);
      setElements((prev) => [...prev, element]);
    },
    [elements, pushUndo]
  );

  // Update element
  const handleUpdateElement = useCallback(
    (id: string, updates: Partial<WhiteboardElement>) => {
      setElements((prev) =>
        prev.map((el) => (el.id === id ? { ...el, ...updates } : el))
      );
    },
    []
  );

  // Remove element
  const handleRemoveElement = useCallback(
    (id: string) => {
      pushUndo(elements);
      setElements((prev) => prev.filter((el) => el.id !== id));
    },
    [elements, pushUndo]
  );

  // Select element
  const handleSelectElement = useCallback(
    (id: string | null) => {
      setElements((prev) =>
        prev.map((el) => ({ ...el, isSelected: el.id === id }))
      );
    },
    []
  );

  // Text edit handler
  const handleTextEdit = useCallback((element: WhiteboardElement) => {
    setEditingText(element);
    // Focus input after render
    setTimeout(() => textInputRef.current?.focus(), 50);
  }, []);

  // Commit text — update existing element or add new one
  const commitText = useCallback(() => {
    if (editingText && editingText.text?.trim()) {
      pushUndo(elements);
      const exists = elements.some((el) => el.id === editingText.id);
      if (exists) {
        setElements((prev) =>
          prev.map((el) =>
            el.id === editingText.id ? { ...el, text: editingText.text } : el
          )
        );
      } else {
        setElements((prev) => [...prev, editingText]);
      }
    }
    setEditingText(null);
  }, [editingText, elements, pushUndo]);

  // Undo
  const handleUndo = useCallback(() => {
    if (undoStack.length === 0) return;
    const previous = undoStack[undoStack.length - 1];
    setRedoStack((prev) => [...prev, elements]);
    setElements(previous);
    setUndoStack((prev) => prev.slice(0, -1));
  }, [undoStack, elements]);

  // Redo
  const handleRedo = useCallback(() => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setUndoStack((prev) => [...prev, elements]);
    setElements(next);
    setRedoStack((prev) => prev.slice(0, -1));
  }, [redoStack, elements]);

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

  // Clear all
  const handleClearAll = useCallback(() => {
    pushUndo(elements);
    setElements([]);
  }, [elements, pushUndo]);

  // Load template
  const handleLoadTemplate = useCallback(
    (templateElements: WhiteboardElement[]) => {
      pushUndo(elements);
      setElements(templateElements);
      setViewport({ x: 0, y: 0, zoom: 1 });
    },
    [elements, pushUndo]
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (readOnly) return;

      // Undo: Ctrl+Z
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }
      // Redo: Ctrl+Y or Ctrl+Shift+Z
      if (
        ((e.ctrlKey || e.metaKey) && e.key === "y") ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "z")
      ) {
        e.preventDefault();
        handleRedo();
      }
      // Delete selected
      if ((e.key === "Delete" || e.key === "Backspace") && !editingText) {
        const selected = elements.find((el) => el.isSelected);
        if (selected) {
          e.preventDefault();
          handleRemoveElement(selected.id);
        }
      }
      // Escape: deselect or cancel text edit
      if (e.key === "Escape") {
        if (editingText) {
          setEditingText(null);
        } else {
          handleSelectElement(null);
        }
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [readOnly, handleUndo, handleRedo, handleRemoveElement, handleSelectElement, elements, editingText]);

  // Save
  const handleSave = useCallback(() => {
    onSave?.({ elements, viewport });
  }, [elements, viewport, onSave]);

  return (
    <div className={`flex flex-col h-full overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 ${className}`}>
      {/* Main area: toolbar + properties + canvas */}
      <div className="flex flex-1 min-h-0">
        {/* Left toolbar */}
        <WhiteboardToolbar
          activeTool={activeTool}
          onToolChange={setActiveTool}
          onLoadTemplate={handleLoadTemplate}
          readOnly={readOnly}
        />

        {/* Properties panel */}
        {!readOnly && (
          <WhiteboardProperties
            activeTool={activeTool}
            activeColor={activeColor}
            activeStrokeWidth={activeStrokeWidth}
            activeFillColor={activeFillColor}
            activeFontSize={activeFontSize}
            activeStickyColor={activeStickyColor}
            onColorChange={setActiveColor}
            onStrokeWidthChange={setActiveStrokeWidth}
            onFillColorChange={setActiveFillColor}
            onFontSizeChange={setActiveFontSize}
            onStickyColorChange={setActiveStickyColor}
          />
        )}

        {/* Canvas */}
        <div className="flex-1 relative min-w-0">
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
            readOnly={readOnly}
            onAddElement={handleAddElement}
            onUpdateElement={handleUpdateElement}
            onRemoveElement={handleRemoveElement}
            onSelectElement={handleSelectElement}
            onViewportChange={setViewport}
            onTextEdit={handleTextEdit}
          />

          {/* Text editing overlay */}
          {editingText && (
            <div
              className="absolute z-20"
              style={{
                left: (editingText.x || 0) * viewport.zoom + viewport.x,
                top: (editingText.y || 0) * viewport.zoom + viewport.y,
              }}
            >
              <textarea
                ref={textInputRef}
                value={editingText.text || ""}
                onChange={(e) =>
                  setEditingText({ ...editingText, text: e.target.value })
                }
                onBlur={commitText}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    commitText();
                  }
                }}
                className="min-w-[120px] min-h-[40px] p-2 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 border-2 border-blue-500 dark:border-blue-400 midnight:border-cyan-400 purple:border-pink-400 rounded-lg text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 outline-none resize-both shadow-lg"
                style={{ fontSize: editingText.fontSize || 16 }}
                placeholder="Type here..."
              />
            </div>
          )}
        </div>
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
