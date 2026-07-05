import { describe, it, expect } from "vitest";
import { insertRow, insertCol, deleteRow, deleteCol, distributeRows, distributeCols } from "@/components/shared/SlideEditor/table-ops";
import { createTableObj } from "@/lib/slide-storage";

describe("table-ops", () => {
  const base = () => createTableObj(3, 4); // 3 rows × 4 cols

  it("inserts a row at the given index", () => {
    const p = insertRow(base(), 1);
    expect(p.rows).toBe(4);
    expect(p.cells!.length).toBe(4);
    expect(p.cells![1].length).toBe(4);        // new row spans all cols
    expect(p.cells![1].every(c => c.content === "")).toBe(true);
    expect(p.rowHeights!.length).toBe(4);
  });

  it("inserts a column at the given index", () => {
    const p = insertCol(base(), 2);
    expect(p.cols).toBe(5);
    expect(p.cells!.every(r => r.length === 5)).toBe(true);
    expect(p.colWidths!.length).toBe(5);
  });

  it("deletes a row / column", () => {
    const r = deleteRow(base(), 0);
    expect(r.rows).toBe(2);
    expect(r.cells!.length).toBe(2);
    const c = deleteCol(base(), 3);
    expect(c.cols).toBe(3);
    expect(c.cells!.every(row => row.length === 3)).toBe(true);
  });

  it("never deletes the last row or column", () => {
    const t = createTableObj(1, 1);
    expect(deleteRow(t, 0)).toEqual({});
    expect(deleteCol(t, 0)).toEqual({});
  });

  it("distributes rows and columns evenly", () => {
    const t = base();
    expect(distributeRows(t).rowHeights).toEqual([100 / 3, 100 / 3, 100 / 3]);
    expect(distributeCols(t).colWidths).toEqual([25, 25, 25, 25]);
  });

  it("clamps out-of-range indices", () => {
    const p = insertRow(base(), 99);
    expect(p.rows).toBe(4);
    expect(p.cells!.length).toBe(4);
  });
});
