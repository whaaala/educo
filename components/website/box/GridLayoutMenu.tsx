"use client";

/**
 * "Choose a layout" — the ONE popup that decides a Columns block's shape.
 *
 * It lives here, on its own, because both routes to adding a grid have to show it. Clicking the palette tile
 * opens it; dropping the tile onto the page opens it too. When the picker belonged to the palette, the drag
 * route had to invent a shape instead of asking — which is how a dragged Columns block came to arrive as two
 * equal cells nobody chose. A drag and a click are the same instruction, so they get the same question.
 *
 * Sweeping the squares covers the even shapes; the gallery underneath covers the uneven ones a sweep cannot
 * express. Both hand back a PATCH, so the caller decides where the grid goes.
 */

import type { BoxNode } from "@/lib/box-model";
import { GRID_MAX } from "@/lib/box-model";
import { GRID_LAYOUTS, PICKER_COLUMNS, gridLayoutPatch, tableGrid } from "@/lib/box-presets";
import { PortalMenu, TablePicker, SplitGallery } from "./ui";

/** Wide enough for six columns of squares plus the two-across split gallery. */
export const GRID_MENU_WIDTH = 268;

export type MenuAnchor = { top: number; left: number; bottom: number; right: number };

export default function GridLayoutMenu({ anchor, onClose, onPick }: {
  anchor: MenuAnchor;
  onClose: () => void;
  onPick: (patch: Partial<BoxNode>) => void;
}) {
  const pick = (patch: Partial<BoxNode>) => { onPick(patch); onClose(); };
  return (
    <PortalMenu anchor={anchor} onClose={onClose} width={GRID_MENU_WIDTH} ariaLabel="Choose a layout">
      <div className="p-1.5">
        <p className="px-0.5 pb-2 text-[0.8125rem] font-semibold text-ink">Choose a layout</p>
        <TablePicker
          columns={PICKER_COLUMNS}
          onPick={(cols, rows) => pick({ children: tableGrid(cols, rows).children, columns: GRID_MAX })}
          label="Sweep to choose columns across and rows down"
        />
        <div className="my-2.5 flex items-center gap-2">
          <span className="h-px flex-1 bg-line" />
          <span className="text-[0.625rem] font-medium uppercase tracking-wide text-muted">or an uneven split</span>
          <span className="h-px flex-1 bg-line" />
        </div>
        <SplitGallery splits={GRID_LAYOUTS} onPick={(id) => { const p = gridLayoutPatch(id); if (p) pick(p); }} />
      </div>
    </PortalMenu>
  );
}
