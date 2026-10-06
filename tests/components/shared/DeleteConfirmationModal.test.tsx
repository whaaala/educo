import { describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import DeleteConfirmationModal from "@/components/shared/DeleteConfirmationModal";

describe("DeleteConfirmationModal", () => {
  it("is announced as a dialog named by its title, described by its warning, with focus on Cancel (D3-18)", () => {
    render(<DeleteConfirmationModal isOpen onClose={() => {}} onConfirm={() => {}} title="Start over?" warningMessage="Every page goes." />);
    const d = screen.getByRole("alertdialog", { name: "Start over?" });
    expect(d).toHaveAttribute("aria-modal", "true");
    expect(d).toHaveAccessibleDescription("Every page goes.");
    expect(screen.getByRole("button", { name: "Cancel" })).toHaveFocus();
  });

  it("draws no item card when there is no item (D3-18)", () => {
    render(<DeleteConfirmationModal isOpen onClose={() => {}} onConfirm={() => {}} title="Start over?" />);
    expect(screen.getByRole("alertdialog").querySelectorAll("p:empty")).toHaveLength(0);
  });

  /**
   * D3-19 — the builder's own Escape listener, registered on document BEFORE the dialog opened, re-renders the page; the
   * page hands the dialog a new onClose; a listener keyed on onClose was removed mid-event and Escape did nothing.
   */
  it("Escape closes it even when an earlier document listener re-renders its parent", () => {
    const closed = vi.fn();
    function Page() {
      const [, setTick] = useState(0);
      const [open, setOpen] = useState(false);
      useEffect(() => {
        // flushSync = what Chrome does between two listeners: it runs the microtask in which React renders and commits
        const onKey = () => flushSync(() => setTick((t) => t + 1));
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
      }, []);
      useEffect(() => setOpen(true), []);
      return <DeleteConfirmationModal isOpen={open} onClose={() => { closed(); setOpen(false); }} onConfirm={() => {}} title="Start over?" />;
    }
    render(<Page />);
    fireEvent.keyDown(document, { key: "Escape" });
    act(() => {});
    expect(closed).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("alertdialog")).toBeNull();
  });
});
