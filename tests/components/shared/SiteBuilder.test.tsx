import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SiteBuilder from "@/components/shared/SiteBuilder/SiteBuilder";
import { createSite } from "@/lib/site-storage";

beforeEach(() => localStorage.clear());

function renderBuilder() {
  const site = createSite("Test School"); // home page: hero, features(Programs), stats, cta
  const onChange = vi.fn();
  const utils = render(<SiteBuilder value={site} onChange={onChange} />);
  return { site, onChange, ...utils };
}

const tree = () => screen.getByLabelText("Pages and sections");

describe("SiteBuilder — structure", () => {
  it("renders the site name and the seeded sections in the tree", () => {
    renderBuilder();
    expect(screen.getByLabelText("Site name")).toHaveValue("Test School");
    const t = tree();
    expect(within(t).getByText("Home")).toBeInTheDocument();
    for (const name of ["Hero", "Programs", "Stats", "Call to Action"]) {
      expect(within(t).getByText(name)).toBeInTheDocument();
    }
  });

  it("renders the actual section content on the canvas (brand-driven components)", () => {
    renderBuilder();
    // Hero heading copy is rendered by the real HeroSection component as a heading element.
    expect(screen.getByRole("heading", { name: /curious minds become confident leaders/i })).toBeInTheDocument();
  });
});

describe("SiteBuilder — page + section actions", () => {
  it("adds a page", async () => {
    const user = userEvent.setup();
    renderBuilder();
    await user.click(screen.getByLabelText("Add page"));
    expect(within(tree()).getByText("Page 2")).toBeInTheDocument();
  });

  it("adds a section from the catalog", async () => {
    const user = userEvent.setup();
    renderBuilder();
    await user.click(screen.getByLabelText("Add section"));
    const menu = screen.getByRole("menu", { name: "Section types" });
    await user.click(within(menu).getByText("Contact"));
    expect(within(tree()).getByText("Contact Us")).toBeInTheDocument();
  });

  it("deletes a section", async () => {
    const user = userEvent.setup();
    renderBuilder();
    await user.click(screen.getByLabelText("Delete Hero"));
    expect(within(tree()).queryByText("Hero")).not.toBeInTheDocument();
  });

  it("hides a section", async () => {
    const user = userEvent.setup();
    renderBuilder();
    await user.click(screen.getByLabelText("Hide Programs"));
    expect(screen.getByLabelText("Show Programs")).toBeInTheDocument();
  });

  it("keeps at least one page (no delete control when only one)", () => {
    renderBuilder();
    expect(screen.queryByLabelText("Delete Home")).not.toBeInTheDocument();
  });
});

describe("SiteBuilder — content editing", () => {
  it("shows the active section's heading and lets it be edited", async () => {
    const user = userEvent.setup();
    renderBuilder();
    // Hero is active by default; its heading appears in the Content panel textarea.
    const heading = screen.getByDisplayValue(/curious minds become confident leaders/i);
    await user.clear(heading);
    await user.type(heading, "Our New Headline");
    expect(screen.getByDisplayValue("Our New Headline")).toBeInTheDocument();
  });
});

describe("SiteBuilder — design (brand) panel", () => {
  it("exposes brand colour controls under the Design tab", async () => {
    const user = userEvent.setup();
    renderBuilder();
    await user.click(screen.getByRole("button", { name: "Design" }));
    expect(screen.getByLabelText("Primary colour")).toHaveValue("#4f46e5");
    expect(screen.getByLabelText("Accent colour")).toBeInTheDocument();
  });
});

describe("SiteBuilder — preview + device", () => {
  it("preview mode hides the side panels", async () => {
    const user = userEvent.setup();
    renderBuilder();
    expect(screen.getByLabelText("Pages and sections")).toBeInTheDocument();
    await user.click(screen.getByLabelText("Preview"));
    expect(screen.queryByLabelText("Pages and sections")).not.toBeInTheDocument();
  });

  it("device toggle marks the chosen width as pressed", async () => {
    const user = userEvent.setup();
    renderBuilder();
    await user.click(screen.getByLabelText("tablet preview"));
    expect(screen.getByLabelText("tablet preview")).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByLabelText("desktop preview")).toHaveAttribute("aria-pressed", "false");
  });

  it("Publish is disabled (publishing deferred)", () => {
    renderBuilder();
    expect(screen.getByLabelText("Publish (coming soon)")).toBeDisabled();
  });
});
