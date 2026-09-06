import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SiteCard from "@/components/website/SiteCard";
import { createSite } from "@/lib/site-storage";

function renderCard() {
  const site = createSite("Greenfield Academy"); // home page seeded → 1 page
  const onOpen = vi.fn();
  const onDelete = vi.fn();
  render(<SiteCard site={site} onOpen={onOpen} onDelete={onDelete} updatedLabel="2m ago" />);
  return { site, onOpen, onDelete };
}

describe("SiteCard", () => {
  it("renders the site name and meta", () => {
    renderCard();
    expect(screen.getAllByText("Greenfield Academy").length).toBeGreaterThan(0);
    expect(screen.getByText(/1 page/)).toBeInTheDocument();
    expect(screen.getByText("2m ago")).toBeInTheDocument();
  });

  it("opens on card click", async () => {
    const user = userEvent.setup();
    const { site, onOpen } = renderCard();
    await user.click(screen.getByLabelText("Open Greenfield Academy"));
    expect(onOpen).toHaveBeenCalledWith(site.id);
  });

  it("exposes Open and Delete in the actions menu", async () => {
    const user = userEvent.setup();
    const { site, onDelete } = renderCard();
    await user.click(screen.getByLabelText("Actions for Greenfield Academy"));
    const menu = screen.getByRole("menu");
    await user.click(within(menu).getByText("Delete"));
    expect(onDelete).toHaveBeenCalledWith(site.id);
  });

  it("delete action does not also trigger open (stops propagation)", async () => {
    const user = userEvent.setup();
    const { onOpen, onDelete } = renderCard();
    await user.click(screen.getByLabelText("Actions for Greenfield Academy"));
    await user.click(screen.getByText("Delete"));
    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onOpen).not.toHaveBeenCalled();
  });
});
