"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DraggableAttributes,
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
import { Grip } from "lucide-react";

export interface DashboardCardDefinition {
  id: string;
  content: React.ReactNode;
  title?: string;
}

export interface ParentDashboardMasonryDnDProps {
  cards: DashboardCardDefinition[];
  order: string[];
  onOrderChange: (next: string[]) => void;
}

interface DragHandleContextValue {
  attributes: DraggableAttributes;
  listeners: SyntheticListenerMap | undefined;
  setActivatorNodeRef: (node: HTMLElement | null) => void;
  isDragging: boolean;
  title?: string;
}

const DragHandleContext = React.createContext<DragHandleContextValue | null>(null);

interface MeasuredSize {
  width: number;
  height: number;
}

export function DashboardDragHandle({
  className,
}: {
  className?: string;
}) {
  const ctx = React.useContext(DragHandleContext);
  // During SSR / first client render we intentionally render a "static" handle
  // (DnD is enabled after mount) to avoid hydration mismatches from @dnd-kit.
  if (!ctx) {
    return (
      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        className={
          className ??
          "inline-flex h-7 w-7 shrink-0 touch-none items-center justify-center rounded-md border border-gray-200/80 dark:border-gray-700/70 midnight:border-gray-700/50 purple:border-gray-700/50 bg-white/90 dark:bg-[#0f1115]/70 midnight:bg-[#0a0e27]/70 purple:bg-[#1a0b2e]/70 text-gray-700 dark:text-gray-200 midnight:text-gray-400 purple:text-gray-400 shadow-sm backdrop-blur transition-colors cursor-grab"
        }
      >
        <Grip className="h-4 w-4" />
      </button>
    );
  }

  return (
    <button
      ref={ctx.setActivatorNodeRef}
      type="button"
      className={
        className ??
        `inline-flex h-7 w-7 shrink-0 touch-none items-center justify-center rounded-md border border-gray-200/80 dark:border-gray-700/70 midnight:border-gray-700/50 purple:border-gray-700/50 bg-white/90 dark:bg-[#0f1115]/70 midnight:bg-[#0a0e27]/70 purple:bg-[#1a0b2e]/70 text-gray-700 dark:text-gray-200 midnight:text-gray-400 purple:text-gray-400 shadow-sm backdrop-blur transition-colors hover:bg-white dark:hover:bg-gray-900 midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 hover:text-gray-900 dark:hover:text-white midnight:hover:text-cyan-400 purple:hover:text-pink-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:focus:ring-blue-400/40 midnight:focus:ring-cyan-400/40 purple:focus:ring-pink-400/40 ${
          ctx.isDragging ? "cursor-grabbing" : "cursor-grab"
        }`
      }
      aria-label={ctx.title ? `Move widget: ${ctx.title}` : "Move widget"}
      {...ctx.attributes}
      {...ctx.listeners}
    >
      <Grip className="h-4 w-4" />
    </button>
  );
}

function useMeasuredSize() {
  const nodeRef = useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = useState<number>(0);
  const [width, setWidth] = useState<number>(0);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;

    const compute = () => {
      const rect = node.getBoundingClientRect();
      setHeight(rect.height);
      setWidth(rect.width);
    };

    compute();
    const ro = new ResizeObserver(() => compute());
    ro.observe(node);
    return () => ro.disconnect();
  }, []);

  return { nodeRef, height, width };
}

function SortableMasonryCard({
  id,
  title,
  children,
  onMeasured,
}: {
  id: string;
  title?: string;
  children: React.ReactNode;
  onMeasured: (id: string, size: MeasuredSize) => void;
}) {
  const { nodeRef: measureRef, height, width } = useMeasuredSize();
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const transformNoScale = transform ? { ...transform, scaleX: 1, scaleY: 1 } : null;

  useEffect(() => {
    if (height > 0 && width > 0) onMeasured(id, { height, width });
  }, [height, id, onMeasured, width]);

  const style: React.CSSProperties = {
    // When using DragOverlay, keep the *original* item in place (invisible placeholder),
    // so it doesn't animate/stretch into the drop position.
    transform: isDragging
      ? "none"
      : transformNoScale
        ? CSS.Transform.toString(transformNoScale)
        : undefined,
    transition,
    opacity: isDragging ? 0 : undefined,
    pointerEvents: isDragging ? "none" : undefined,
    width: isDragging && width > 0 ? `${width}px` : undefined,
    height: isDragging && height > 0 ? `${height}px` : undefined,
    willChange: "transform",
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group break-inside-avoid mb-3 inline-block w-full align-top">
      <div ref={measureRef} className={isDragging ? "cursor-grabbing" : undefined}>
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

function StaticMasonryCard({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative group break-inside-avoid mb-3 inline-block w-full align-top">
      <div className="[&>*]:!m-0">{children}</div>
    </div>
  );
}

export function ParentDashboardMasonryDnD({ cards, order, onOrderChange }: ParentDashboardMasonryDnDProps) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const cardsById = useMemo(() => new Map(cards.map((c) => [c.id, c])), [cards]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [sizesById, setSizesById] = useState<Record<string, MeasuredSize>>({});

  const orderedCards = useMemo(() => {
    const seen = new Set<string>();
    const valid = order.filter((id) => {
      const ok = cardsById.has(id);
      if (ok) seen.add(id);
      return ok;
    });
    for (const c of cards) {
      if (!seen.has(c.id)) valid.push(c.id);
    }
    return valid.map((id) => cardsById.get(id)!).filter(Boolean);
  }, [cards, cardsById, order]);

  const orderedIds = useMemo(() => orderedCards.map((c) => c.id), [orderedCards]);
  const activeCard = useMemo(() => (activeId ? cardsById.get(activeId) : undefined), [activeId, cardsById]);
  const activeSize = activeId ? sizesById[activeId] : undefined;

  // Avoid SSR hydration mismatch: @dnd-kit generates non-deterministic ids for a11y elements.
  // Render a static masonry layout until the component is mounted on the client.
  if (!isMounted) {
    return (
      <div className="columns-1 sm:columns-2 lg:columns-3 2xl:columns-4 gap-3 [column-fill:balance]">
        {orderedCards.map((card) => (
          <StaticMasonryCard key={card.id}>{card.content}</StaticMasonryCard>
        ))}
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={(event) => setActiveId(String(event.active.id))}
      onDragEnd={(event) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
          const oldIndex = orderedIds.indexOf(String(active.id));
          const newIndex = orderedIds.indexOf(String(over.id));
          if (oldIndex >= 0 && newIndex >= 0) onOrderChange(arrayMove(orderedIds, oldIndex, newIndex));
        }
        setActiveId(null);
      }}
      onDragCancel={() => setActiveId(null)}
    >
      <SortableContext items={orderedIds} strategy={rectSortingStrategy}>
        <div className="columns-1 sm:columns-2 lg:columns-3 2xl:columns-4 gap-3 [column-fill:balance]">
          {orderedCards.map((card) => (
            <SortableMasonryCard
              key={card.id}
              id={card.id}
              title={card.title}
              onMeasured={(id, size) => {
                setSizesById((prev) => {
                  const cur = prev[id];
                  if (cur && cur.height === size.height && cur.width === size.width) return prev;
                  return { ...prev, [id]: size };
                });
              }}
            >
              {card.content}
            </SortableMasonryCard>
          ))}
        </div>
      </SortableContext>

      <DragOverlay adjustScale={false}>
        {activeCard ? (
          <div
            className="pointer-events-none"
            style={{
              width: activeSize?.width ? `${activeSize.width}px` : undefined,
              height: activeSize?.height ? `${activeSize.height}px` : undefined,
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
                title: activeCard.title,
              }}
            >
              {activeCard.content}
            </DragHandleContext.Provider>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}


