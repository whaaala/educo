import { describe, it, expect } from "vitest";
import { formatElapsed, formatClock } from "@/lib/presenter/timer";

describe("presenter timer — formatElapsed", () => {
  it("shows M:SS under an hour", () => {
    expect(formatElapsed(0)).toBe("0:00");
    expect(formatElapsed(5_000)).toBe("0:05");
    expect(formatElapsed(65_000)).toBe("1:05");
    expect(formatElapsed(11 * 60_000 + 9_000)).toBe("11:09");
  });
  it("shows H:MM:SS once past an hour", () => {
    expect(formatElapsed(3_600_000)).toBe("1:00:00");
    expect(formatElapsed(3_661_000)).toBe("1:01:01");
  });
  it("never goes negative", () => {
    expect(formatElapsed(-5000)).toBe("0:00");
  });
});

describe("presenter timer — formatClock", () => {
  it("formats 12-hour time with AM/PM", () => {
    expect(formatClock(new Date(2025, 0, 1, 9, 5))).toBe("9:05 AM");
    expect(formatClock(new Date(2025, 0, 1, 13, 30))).toBe("1:30 PM");
    expect(formatClock(new Date(2025, 0, 1, 0, 0))).toBe("12:00 AM");
    expect(formatClock(new Date(2025, 0, 1, 12, 0))).toBe("12:00 PM");
  });
});
