import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import TimetableSettingsModal from "@/components/settings/TimetableSettingsModal";
import type { TimetableConfig } from "@/lib/timetableConfig";

/**
 * A BREAK MUST BE SAVED WHOLE.
 *
 * Setting a break time spread `...config.breakSchedule?.morningBreak!` — an optional chain overridden by a
 * non-null assertion. The `?.` says "this may not exist"; the `!` tells the compiler to stop worrying. When
 * the school genuinely had no break configured, that spread contributed nothing and the object saved was
 * `{ start: "10:00" }` — a break with a start and no end, which the type says is impossible.
 *
 * The assertion was hiding the case rather than handling it. Removing it made the compiler surface exactly
 * that: `end` is required and might be missing. These assert the behaviour that replaced it.
 */

const withoutBreaks: TimetableConfig = {
  calendarType: "5-day",
  weekStructure: "standard",
  daysOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  periodsPerDay: 7,
  periodDuration: 60,
  schoolStartTime: "08:00",
  schoolEndTime: "15:00",
  includeFree: false,
  includeBreaks: true,
  // Deliberately absent — this is the state the `!` was papering over.
  breakSchedule: undefined,
} as unknown as TimetableConfig;

afterEach(cleanup);

/** The break fields live behind the modal's "Breaks" tab; the General tab is shown first. */
function openBreaksTab() {
  fireEvent.click(screen.getByRole("button", { name: /breaks/i }));
}

/** On the Breaks tab the time inputs are morning start/end, lunch start/end, evening start/end. */
const morningBreakStart = () =>
  Array.from(document.querySelectorAll<HTMLInputElement>('input[type="time"]'))[0];

describe("TimetableSettingsModal — break times", () => {
  it("saves a complete break when the school had none configured", () => {
    const onSave = vi.fn();
    render(<TimetableSettingsModal isOpen onClose={vi.fn()} initialConfig={withoutBreaks} onSave={onSave} />);

    openBreaksTab();
    const morningStart = morningBreakStart();
    expect(morningStart, "the morning break inputs are on the form").toBeTruthy();
    fireEvent.change(morningStart, { target: { value: "10:00" } });

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    expect(onSave).toHaveBeenCalledTimes(1);
    const saved = onSave.mock.calls[0][0] as TimetableConfig;
    // The half the assertion used to drop.
    expect(saved.breakSchedule?.morningBreak).toEqual({ start: "10:00", end: "" });
  });

  it("keeps the other half of a break that already exists", () => {
    const onSave = vi.fn();
    const config = {
      ...withoutBreaks,
      breakSchedule: { morningBreak: { start: "10:00", end: "10:15" }, lunch: { start: "12:00", end: "13:00" } },
    } as TimetableConfig;
    render(<TimetableSettingsModal isOpen onClose={vi.fn()} initialConfig={config} onSave={onSave} />);

    openBreaksTab();
    fireEvent.change(morningBreakStart(), { target: { value: "10:30" } });
    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    // Editing the start must not blank the end.
    expect((onSave.mock.calls[0][0] as TimetableConfig).breakSchedule?.morningBreak)
      .toEqual({ start: "10:30", end: "10:15" });
  });
});
