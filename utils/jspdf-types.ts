import type jsPDF from "jspdf";

/**
 * The parts of jsPDF our exports use that its published types do not describe.
 *
 * Two gaps, both real:
 *  - `internal.getNumberOfPages()` exists at runtime but is not on the `jsPDF` type.
 *  - `lastAutoTable.finalY` is added by the `jspdf-autotable` plugin, which augments the instance at runtime.
 *
 * Eight export files each reached for these through `(doc as any)`, which switched off checking for the whole
 * expression — so a typo in `getNumberOfPages` or `finalY` would have been a runtime `undefined`, and the page
 * numbering or the vertical offset would have been silently wrong on a printed report. Naming the two members
 * keeps everything either side of them checked.
 */
export type JsPdfWithPlugins = jsPDF & {
  internal: jsPDF["internal"] & {
    getNumberOfPages(): number;
  };
  /** Set by jspdf-autotable after each table is drawn; absent before the first one. */
  lastAutoTable?: {
    finalY: number;
  };
};

/** Narrow a jsPDF instance to the members above. Prefer this to a cast at each call site. */
export function withPlugins(doc: jsPDF): JsPdfWithPlugins {
  return doc as JsPdfWithPlugins;
}
