import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import AttendanceStatusBadge from "@/components/shared/AttendanceStatusBadge";

describe("AttendanceStatusBadge", () => {
  it.each([
    { type: "present" as const, label: "Present" },
    { type: "absent" as const, label: "Absent" },
    { type: "late" as const, label: "Late" },
    { type: "excused" as const, label: "Excused" },
    { type: "not-attended" as const, label: "Not Attended" },
    { type: "blocked" as const, label: "Blocked" },
  ])("renders $type badge with label", ({ type, label }) => {
    render(<AttendanceStatusBadge type={type} label={label} />);
    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it("hides label when showLabel is false", () => {
    render(
      <AttendanceStatusBadge
        type="present"
        label="Present"
        showLabel={false}
      />
    );
    expect(screen.queryByText("Present")).not.toBeInTheDocument();
  });

  it.each(["sm", "md", "lg"] as const)(
    "renders with size=%s",
    (size) => {
      render(
        <AttendanceStatusBadge type="present" label="Present" size={size} />
      );
      expect(screen.getByText("Present")).toBeInTheDocument();
    }
  );
});
