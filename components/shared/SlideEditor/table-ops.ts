/**
 * Pure table-structure operations (Table Tools): insert/delete rows & columns,
 * distribute, plus row/col size arrays. Each returns a Partial<TableObject> patch so
 * the caller can apply it with a single update. Sizes are redistributed evenly.
 */

import type { TableObject, TableCell } from "@/lib/slide-storage";

const emptyCell = (): TableCell => ({ content: "" });
const even = (n: number): number[] => Array(Math.max(1, n)).fill(100 / Math.max(1, n));

export function insertRow(t: TableObject, at: number): Partial<TableObject> {
  const idx = Math.max(0, Math.min(at, t.rows));
  const cells = t.cells.map(r => [...r]);
  cells.splice(idx, 0, Array.from({ length: t.cols }, emptyCell));
  const rows = t.rows + 1;
  return { cells, rows, rowHeights: even(rows) };
}

export function insertCol(t: TableObject, at: number): Partial<TableObject> {
  const idx = Math.max(0, Math.min(at, t.cols));
  const cells = t.cells.map(r => { const nr = [...r]; nr.splice(idx, 0, emptyCell()); return nr; });
  const cols = t.cols + 1;
  return { cells, cols, colWidths: even(cols) };
}

export function deleteRow(t: TableObject, at: number): Partial<TableObject> {
  if (t.rows <= 1) return {};
  const idx = Math.max(0, Math.min(at, t.rows - 1));
  const cells = t.cells.filter((_, i) => i !== idx);
  const rows = t.rows - 1;
  return { cells, rows, rowHeights: even(rows) };
}

export function deleteCol(t: TableObject, at: number): Partial<TableObject> {
  if (t.cols <= 1) return {};
  const idx = Math.max(0, Math.min(at, t.cols - 1));
  const cells = t.cells.map(r => r.filter((_, i) => i !== idx));
  const cols = t.cols - 1;
  return { cells, cols, colWidths: even(cols) };
}

export function distributeRows(t: TableObject): Partial<TableObject> {
  return { rowHeights: even(t.rows) };
}

export function distributeCols(t: TableObject): Partial<TableObject> {
  return { colWidths: even(t.cols) };
}
