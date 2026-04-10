"use client";

import {
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Maximize,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import type { Viewport } from "./whiteboard-types";

interface WhiteboardBottomBarProps {
  viewport: Viewport;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitToScreen: () => void;
  onClearAll: () => void;
  readOnly?: boolean;
}

export default function WhiteboardBottomBar({
  viewport,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onZoomIn,
  onZoomOut,
  onFitToScreen,
  onClearAll,
  readOnly = false,
}: WhiteboardBottomBarProps) {
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const zoomPercent = Math.round(viewport.zoom * 100);

  return (
    <div className="flex items-center justify-between px-3 py-1.5 bg-white dark:bg-[#1a1d24] midnight:bg-[#0f1729] purple:bg-[#2a1a3e] border-t border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
      {/* Undo / Redo */}
      <div className="flex items-center gap-1">
        {!readOnly && (
          <>
            <BarButton
              icon={<Undo2 className="w-3.5 h-3.5" />}
              onClick={onUndo}
              disabled={!canUndo}
              title="Undo (Ctrl+Z)"
            />
            <BarButton
              icon={<Redo2 className="w-3.5 h-3.5" />}
              onClick={onRedo}
              disabled={!canRedo}
              title="Redo (Ctrl+Y)"
            />
          </>
        )}
      </div>

      {/* Zoom controls */}
      <div className="flex items-center gap-1">
        <BarButton
          icon={<ZoomOut className="w-3.5 h-3.5" />}
          onClick={onZoomOut}
          disabled={viewport.zoom <= 0.1}
          title="Zoom out"
        />
        <button
          onClick={onFitToScreen}
          className="px-2 py-1 text-[10px] font-bold text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 rounded transition-colors cursor-pointer"
          title="Fit to screen"
        >
          {zoomPercent}%
        </button>
        <BarButton
          icon={<ZoomIn className="w-3.5 h-3.5" />}
          onClick={onZoomIn}
          disabled={viewport.zoom >= 5}
          title="Zoom in"
        />
        <BarButton
          icon={<Maximize className="w-3.5 h-3.5" />}
          onClick={onFitToScreen}
          title="Fit to screen"
        />
      </div>

      {/* Clear all */}
      <div className="flex items-center gap-1 relative">
        {!readOnly && (
          <>
            <BarButton
              icon={<Trash2 className="w-3.5 h-3.5" />}
              onClick={() => setShowClearConfirm(true)}
              title="Clear all"
              danger
            />
            {showClearConfirm && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowClearConfirm(false)} />
                <div className="absolute bottom-full right-0 mb-2 z-50 p-3 bg-white dark:bg-[#1a1d24] midnight:bg-[#0f1729] purple:bg-[#2a1a3e] border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 rounded-xl shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-150 min-w-[180px]">
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 mb-2">
                    Clear all elements?
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowClearConfirm(false)}
                      className="flex-1 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-[#22262e] rounded-lg hover:bg-gray-200 dark:hover:bg-[#2a2d35] transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        onClearAll();
                        setShowClearConfirm(false);
                      }}
                      className="flex-1 px-3 py-1.5 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function BarButton({
  icon,
  onClick,
  disabled = false,
  title,
  danger = false,
}: {
  icon: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  title: string;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`p-1.5 rounded-lg transition-all duration-150 cursor-pointer ${
        disabled
          ? "opacity-30 cursor-not-allowed"
          : danger
          ? "text-gray-500 dark:text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 midnight:hover:bg-red-900/20 purple:hover:bg-red-900/20"
          : "text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10"
      }`}
      title={title}
    >
      {icon}
    </button>
  );
}
