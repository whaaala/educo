import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CreateSiteModal from "@/components/website/CreateSiteModal";

describe("CreateSiteModal", () => {
  it("does not render when closed", () => {
    render(<CreateSiteModal isOpen={false} onClose={() => {}} onCreate={() => {}} />);
    expect(screen.queryByLabelText("Site name")).not.toBeInTheDocument();
  });

  it("creates with the typed name and default starter", async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn();
    render(<CreateSiteModal isOpen onClose={() => {}} onCreate={onCreate} />);
    await user.type(screen.getByLabelText("Site name"), "Sunrise School");
    await user.click(screen.getByRole("button", { name: /Create/ }));
    expect(onCreate).toHaveBeenCalledWith("Sunrise School", "starter");
  });

  it("falls back to a default name when left blank", async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn();
    render(<CreateSiteModal isOpen onClose={() => {}} onCreate={onCreate} />);
    await user.click(screen.getByRole("button", { name: /Create/ }));
    expect(onCreate).toHaveBeenCalledWith("My School", "starter");
  });

  it("can switch the starter to Blank", async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn();
    render(<CreateSiteModal isOpen onClose={() => {}} onCreate={onCreate} />);
    await user.click(screen.getByRole("button", { name: /Blank/ }));
    await user.type(screen.getByLabelText("Site name"), "Blank Co");
    await user.click(screen.getByRole("button", { name: /Create/ }));
    expect(onCreate).toHaveBeenCalledWith("Blank Co", "blank");
  });

  it("calls onClose from Cancel", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<CreateSiteModal isOpen onClose={onClose} onCreate={() => {}} />);
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onClose).toHaveBeenCalled();
  });
});
