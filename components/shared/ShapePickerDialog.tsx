"use client";

/**
 * ShapePickerDialog — Shared shape picker with category tabs and clickable shape grid.
 * Works like Google Slides shape picker. Can be used by any editor.
 */

import React, { useState } from "react";
import { SHAPE_DEFS, getShapesByCategory, type ShapeDef } from "@/components/shared/SlideEditor/shapes";
import { EditorDialog } from "@/components/shared/EditorDialogs";

interface ShapePickerDialogProps {
  /** Initial category to show */
  initialCategory?: string;
  /** Called when user clicks a shape — receives the shape key */
  onInsert: (shapeKey: string) => void;
  /** Close the dialog */
  onClose: () => void;
}

const CATEGORIES: { key: ShapeDef["category"]; label: string }[] = [
  { key: "shapes", label: "Shapes" },
  { key: "arrows", label: "Arrows" },
  { key: "callouts", label: "Callouts" },
  { key: "equation", label: "Equation" },
];

export default function ShapePickerDialog({ initialCategory = "shapes", onInsert, onClose }: ShapePickerDialogProps) {
  const [category, setCategory] = useState<ShapeDef["category"]>(
    (initialCategory as ShapeDef["category"]) || "shapes"
  );

  const shapes = getShapesByCategory(category);

  return (
    <EditorDialog title="Insert Shape" onClose={onClose}>
      <div style={{ minWidth: 420 }}>
        {/* Category tabs */}
        <div className="flex gap-1 mb-3 border-b border-line pb-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat.key}
              onClick={() => setCategory(cat.key)}
              className={`px-3 py-1.5 rounded-lg text-[0.75rem] font-medium transition-colors cursor-pointer ${
                category === cat.key
                  ? "bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 text-blue-700 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400"
                  : "text-muted hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Shape grid */}
        <div className="grid grid-cols-6 gap-1.5 max-h-[300px] overflow-y-auto pr-1">
          {shapes.map(([key, def]) => (
            <button
              key={key}
              onClick={() => onInsert(key)}
              title={def.label}
              className="w-12 h-12 rounded-lg border border-line hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 midnight:hover:bg-cyan-900/20 purple:hover:bg-pink-900/20 hover:shadow-sm transition-all cursor-pointer flex items-center justify-center group"
            >
              <svg
                viewBox="0 0 100 100"
                className="w-8 h-8 text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                dangerouslySetInnerHTML={{
                  __html: def.svg
                    .replace(/fill="currentColor"/g, 'fill="currentColor"')
                    .replace(/stroke="currentColor"/g, 'stroke="currentColor"'),
                }}
              />
            </button>
          ))}
        </div>

        {/* Shape count */}
        <p className="text-[0.625rem] text-gray-400 text-center mt-2">{shapes.length} shapes · Click to insert</p>
      </div>
    </EditorDialog>
  );
}
