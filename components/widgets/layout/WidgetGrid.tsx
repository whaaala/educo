"use client";

import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DraggableAttributes,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

export interface WidgetDefinition {
  /** Unique widget identifier */
  id: string;
  /** Widget content to render */
  content: React.ReactNode;
  /** Widget title for accessibility */
  title?: string;
}

export interface WidgetGridProps {
  /** Array of widgets to display */
  widgets: WidgetDefinition[];
  /** Current order of widget IDs */
  order: string[];
  /** Callback when order changes */
  onOrderChange: (newOrder: string[]) => void;
  /** Additional class names for the grid container */
  className?: string;
  /** Grid column configuration */
  columns?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    "2xl"?: number;
  };
}

interface DragHandleContextValue {
  attributes: DraggableAttributes;
  listeners: SyntheticListenerMap | undefined;
  setActivatorNodeRef: (node: HTMLElement | null) => void;
  isDragging: boolean;
  title?: string;
}

interface MeasuredSize {
  width: number;
  height: number;
}

// ============================================================================
// Context for drag handle
// ============================================================================

const DragHandleContext = React.createContext<DragHandleContextValue | null>(null);

// ============================================================================
// Drag Handle Component
// ============================================================================

export function WidgetDragHandle({ className }: { className?: string }) {
  const ctx = React.useContext(DragHandleContext);

  // During SSR / first client render, render a static handle to avoid hydration mismatches
  if (!ctx) {
    return (
      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        className={
          className ??
          cn(
            "inline-flex h-7 w-7 shrink-0 touch-none items-center justify-center rounded-lg",
            "border border-gray-200/80 dark:border-gray-700/70 midnight:border-gray-700/50 purple:border-gray-700/50",
            "bg-white/90 dark:bg-gray-900/70 midnight:bg-gray-900/70 purple:bg-gray-900/70",
            "text-gray-500 dark:text-gray-400 midnight:text-gray-400 purple:text-gray-400",
            "shadow-sm backdrop-blur cursor-grab transition-all duration-200"
          )
        }
      >
        <GripVertical className="h-4 w-4" />
      </button>
    );
  }

  return (
    <button
      ref={ctx.setActivatorNodeRef}
      type="button"
      className={
        className ??
        cn(
          "inline-flex h-7 w-7 shrink-0 touch-none items-center justify-center rounded-lg",
          "border border-gray-200/80 dark:border-gray-700/70 midnight:border-gray-700/50 purple:border-gray-700/50",
          "bg-white/90 dark:bg-gray-900/70 midnight:bg-gray-900/70 purple:bg-gray-900/70",
          "text-gray-500 dark:text-gray-400 midnight:text-gray-400 purple:text-gray-400",
          "shadow-sm backdrop-blur transition-all duration-200",
          "hover:bg-white dark:hover:bg-gray-900 midnight:hover:bg-gray-800 purple:hover:bg-gray-800",
          "hover:text-gray-700 dark:hover:text-white midnight:hover:text-cyan-400 purple:hover:text-pink-400",
          "hover:border-gray-300 dark:hover:border-gray-600 midnight:hover:border-cyan-500/30 purple:hover:border-pink-500/30",
          "hover:shadow-md",
          "focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:focus:ring-blue-400/40 midnight:focus:ring-cyan-400/40 purple:focus:ring-pink-400/40",
          ctx.isDragging ? "cursor-grabbing scale-95" : "cursor-grab"
        )
      }
      aria-label={ctx.title ? `Move widget: ${ctx.title}` : "Move widget"}
      {...ctx.attributes}
      {...ctx.listeners}
    >
      <GripVertical className="h-4 w-4" />
    </button>
  );
}

// ============================================================================
// Hook for measuring widget size
// ============================================================================

function useMeasuredSize() {
  const nodeRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState<MeasuredSize>({ width: 0, height: 0 });

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;

    const compute = () => {
      const rect = node.getBoundingClientRect();
      setSize((prev) => {
        if (prev.width === rect.width && prev.height === rect.height) return prev;
        return { width: rect.width, height: rect.height };
      });
    };

    compute();
    const observer = new ResizeObserver(compute);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { nodeRef, ...size };
}

// ============================================================================
// Sortable Widget Card
// ============================================================================

interface SortableWidgetCardProps {
  id: string;
  title?: string;
  children: React.ReactNode;
  onMeasured: (id: string, size: MeasuredSize) => void;
}

function SortableWidgetCard({ id, title, children, onMeasured }: SortableWidgetCardProps) {
  const { nodeRef: measureRef, width, height } = useMeasuredSize();
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  // Prevent scaling during transform
  const transformNoScale = transform ? { ...transform, scaleX: 1, scaleY: 1 } : null;

  useEffect(() => {
    if (height > 0 && width > 0) {
      onMeasured(id, { height, width });
    }
  }, [height, id, onMeasured, width]);

  const style: React.CSSProperties = {
    // When dragging with overlay, keep original item as invisible placeholder
    transform: isDragging
      ? "none"
      : transformNoScale
        ? CSS.Transform.toString(transformNoScale)
        : undefined,
    transition: transition || "transform 250ms cubic-bezier(0.25, 1, 0.5, 1)",
    opacity: isDragging ? 0 : 1,
    pointerEvents: isDragging ? "none" : undefined,
    width: isDragging && width > 0 ? `${width}px` : undefined,
    height: isDragging && height > 0 ? `${height}px` : undefined,
    willChange: "transform",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group break-inside-avoid mb-3 inline-block w-full align-top"
    >
      <div ref={measureRef}>
        <DragHandleContext.Provider
          value={{
            attributes,
            listeners,
            setActivatorNodeRef,
            isDragging,
            title,
          }}
        >
          <div className="[&>*]:!m-0">{children}</div>
        </DragHandleContext.Provider>
      </div>
    </div>
  );
}

// ============================================================================
// Static Widget Card (for SSR)
// ============================================================================

function StaticWidgetCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative group break-inside-avoid mb-3 inline-block w-full align-top">
      <div className="[&>*]:!m-0">{children}</div>
    </div>
  );
}

// ============================================================================
// Drag Overlay Content
// ============================================================================

interface DragOverlayContentProps {
  widget: WidgetDefinition;
  size: MeasuredSize | undefined;
}

function DragOverlayContent({ widget, size }: DragOverlayContentProps) {
  return (
    <div
      className="pointer-events-none"
      style={{
        width: size?.width ? `${size.width}px` : undefined,
        height: size?.height ? `${size.height}px` : undefined,
      }}
    >
      <DragHandleContext.Provider
        value={{
          attributes: {
            role: "button",
            tabIndex: 0,
            "aria-disabled": false,
            "aria-pressed": undefined,
            "aria-roledescription": "sortable",
            "aria-describedby": "",
          },
          listeners: undefined,
          setActivatorNodeRef: () => {},
          isDragging: true,
          title: widget.title,
        }}
      >
        <div
          className={cn(
            "[&>*]:!m-0",
            // Overlay styling for smooth drag effect
            "[&>*]:!shadow-2xl [&>*]:!scale-[1.02]",
            "[&>*]:!ring-2 [&>*]:!ring-blue-500/30 dark:[&>*]:!ring-blue-400/30",
            "midnight:[&>*]:!ring-cyan-400/30 purple:[&>*]:!ring-pink-400/30"
          )}
        >
          {widget.content}
        </div>
      </DragHandleContext.Provider>
    </div>
  );
}

// ============================================================================
// Main Widget Grid Component
// ============================================================================

export function WidgetGrid({
  widgets,
  order,
  onOrderChange,
  className,
  columns = { sm: 2, lg: 3, "2xl": 4 },
}: WidgetGridProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [sizesById, setSizesById] = useState<Record<string, MeasuredSize>>({});

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Configure drag sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Create widget lookup map
  const widgetsById = useMemo(
    () => new Map(widgets.map((w) => [w.id, w])),
    [widgets]
  );

  // Compute ordered widgets list
  const orderedWidgets = useMemo(() => {
    const seen = new Set<string>();
    const validOrder = order.filter((id) => {
      const exists = widgetsById.has(id);
      if (exists) seen.add(id);
      return exists;
    });
    // Add any new widgets not in the order
    for (const widget of widgets) {
      if (!seen.has(widget.id)) {
        validOrder.push(widget.id);
      }
    }
    return validOrder.map((id) => widgetsById.get(id)!).filter(Boolean);
  }, [widgets, widgetsById, order]);

  const orderedIds = useMemo(
    () => orderedWidgets.map((w) => w.id),
    [orderedWidgets]
  );

  const activeWidget = useMemo(
    () => (activeId ? widgetsById.get(activeId) : undefined),
    [activeId, widgetsById]
  );

  const activeSize = activeId ? sizesById[activeId] : undefined;

  // Handle measurement callback
  const handleMeasured = useCallback((id: string, size: MeasuredSize) => {
    setSizesById((prev) => {
      const current = prev[id];
      if (current && current.width === size.width && current.height === size.height) {
        return prev;
      }
      return { ...prev, [id]: size };
    });
  }, []);

  // Drag event handlers
  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (over && active.id !== over.id) {
        const oldIndex = orderedIds.indexOf(String(active.id));
        const newIndex = orderedIds.indexOf(String(over.id));
        if (oldIndex >= 0 && newIndex >= 0) {
          onOrderChange(arrayMove(orderedIds, oldIndex, newIndex));
        }
      }
      setActiveId(null);
    },
    [orderedIds, onOrderChange]
  );

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
  }, []);

  // Build column classes
  const columnClasses = cn(
    "columns-1",
    columns.sm && `sm:columns-${columns.sm}`,
    columns.md && `md:columns-${columns.md}`,
    columns.lg && `lg:columns-${columns.lg}`,
    columns.xl && `xl:columns-${columns.xl}`,
    columns["2xl"] && `2xl:columns-${columns["2xl"]}`,
    "gap-3 [column-fill:balance]"
  );

  // SSR: Render static layout until mounted
  if (!isMounted) {
    return (
      <div className={cn(columnClasses, className)}>
        {orderedWidgets.map((widget) => (
          <StaticWidgetCard key={widget.id}>{widget.content}</StaticWidgetCard>
        ))}
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <SortableContext items={orderedIds} strategy={rectSortingStrategy}>
        <div className={cn(columnClasses, className)}>
          {orderedWidgets.map((widget) => (
            <SortableWidgetCard
              key={widget.id}
              id={widget.id}
              title={widget.title}
              onMeasured={handleMeasured}
            >
              {widget.content}
            </SortableWidgetCard>
          ))}
        </div>
      </SortableContext>

      <DragOverlay
        adjustScale={false}
        dropAnimation={{
          duration: 250,
          easing: "cubic-bezier(0.25, 1, 0.5, 1)",
        }}
      >
        {activeWidget && (
          <DragOverlayContent widget={activeWidget} size={activeSize} />
        )}
      </DragOverlay>
    </DndContext>
  );
}

// ============================================================================
// Exports
// ============================================================================

export default WidgetGrid;
export { DragHandleContext };
