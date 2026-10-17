/**
 * LE12-1 (BATCH LE-12) · a field whose stored value only takes a WHOLE value (a length) could not be typed into one key at a time:
 * "2", "20", "20r" are not lengths, so the stored value came back on every key. `draft` keeps what is typed.
 */
import { describe, it, expect } from "vitest";
import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CompactField from "@/components/shared/CompactField";

function Length({ draft }: { draft?: boolean }) {
  const [v, setV] = useState("15rem");
  return (<>
    <CompactField draft={draft} ariaLabel="Set width" value={v} onChange={(t) => { if (/^\d+(\.\d+)?rem$/.test(t)) setV(t); }} />
    <output aria-label="stored">{v}</output>
  </>);
}

describe("LE12-1 · CompactField draft", () => {
  it("typed one key at a time, a length arrives whole; leaving the field shows what is stored", async () => {
    render(<Length draft />);
    const f = screen.getByLabelText("Set width");
    await userEvent.clear(f);
    await userEvent.type(f, "20r");
    expect(f).toHaveValue("20r"); // kept while typing, though not a length yet
    expect(screen.getByLabelText("stored")).toHaveTextContent("15rem");
    await userEvent.type(f, "em");
    expect(screen.getByLabelText("stored")).toHaveTextContent("20rem");
    await userEvent.type(f, "x");
    await userEvent.tab();
    expect(f).toHaveValue("20rem");
  });
  it("without it (the old behaviour) the same keys never make a length", async () => {
    render(<Length />);
    const f = screen.getByLabelText("Set width");
    await userEvent.clear(f);
    await userEvent.type(f, "20rem");
    expect(screen.getByLabelText("stored")).not.toHaveTextContent("20rem");
  });
});
