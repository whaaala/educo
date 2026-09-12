import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FormDropdown from "@/components/shared/FormDropdown";

const options = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

describe("FormDropdown", () => {
  it("renders with label", () => {
    render(
      <FormDropdown
        label="Gender"
        value=""
        onChange={vi.fn()}
        options={options}
      />
    );
    expect(screen.getByText("Gender")).toBeInTheDocument();
  });

  it("shows placeholder when no value selected", () => {
    render(
      <FormDropdown
        label="Gender"
        value=""
        onChange={vi.fn()}
        options={options}
        placeholder="Choose gender"
      />
    );
    expect(screen.getByText("Choose gender")).toBeInTheDocument();
  });

  it("displays the selected option label", () => {
    render(
      <FormDropdown
        label="Gender"
        value="female"
        onChange={vi.fn()}
        options={options}
      />
    );
    expect(screen.getByText("Female")).toBeInTheDocument();
  });

  it("opens dropdown on click and shows options", async () => {
    const user = userEvent.setup();
    render(
      <FormDropdown
        label="Gender"
        value=""
        onChange={vi.fn()}
        options={options}
      />
    );
    const trigger = screen.getByText("Select an option");
    await user.click(trigger);
    expect(screen.getByText("Male")).toBeInTheDocument();
    expect(screen.getByText("Female")).toBeInTheDocument();
    expect(screen.getByText("Other")).toBeInTheDocument();
  });

  it("calls onChange when an option is selected", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <FormDropdown
        label="Gender"
        value=""
        onChange={onChange}
        options={options}
      />
    );
    await user.click(screen.getByText("Select an option"));
    await user.click(screen.getByText("Male"));
    expect(onChange).toHaveBeenCalledWith("male");
  });

  it("shows required asterisk when required", () => {
    render(
      <FormDropdown
        label="Gender"
        value=""
        onChange={vi.fn()}
        options={options}
        required
      />
    );
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("shows error message", () => {
    render(
      <FormDropdown
        label="Gender"
        value=""
        onChange={vi.fn()}
        options={options}
        error="Please select gender"
      />
    );
    expect(screen.getByText("Please select gender")).toBeInTheDocument();
  });

  it("renders icon when provided", () => {
    render(
      <FormDropdown
        label="Gender"
        value=""
        onChange={vi.fn()}
        options={options}
        icon={<span data-testid="icon">icon</span>}
      />
    );
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });
});
