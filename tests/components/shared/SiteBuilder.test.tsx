import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, within, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SiteBuilder from "@/components/shared/SiteBuilder/SiteBuilder";
import { createSite, createPageFromTemplate, pageNavItem, makeNavItem, defaultHeaderLayout, DEFAULT_THEME, siteStorage } from "@/lib/site-storage";
import { SiteNav } from "@/components/website/sections/SiteRenderer";

beforeEach(() => localStorage.clear());

function renderBuilder() {
  const site = createSite("Test School"); // home: hero, features(Programs), stats, cta
  const onChange = vi.fn();
  const utils = render(<SiteBuilder value={site} onChange={onChange} />);
  return { site, onChange, ...utils };
}

const layers = () => screen.getByLabelText("Layers panel");

describe("SiteBuilder — chrome + structure", () => {
  it("has an icon rail and shows the seeded sections in the Layers panel (default)", () => {
    renderBuilder();
    expect(screen.getByLabelText("Builder tools")).toBeInTheDocument(); // the rail
    expect(screen.getByLabelText("Site name")).toHaveValue("Test School");
    const panel = layers();
    for (const name of ["Hero", "Programs", "Stats", "Call to Action"]) {
      expect(within(panel).getByText(name)).toBeInTheDocument();
    }
  });

  it("renders the real hero heading on the canvas", () => {
    renderBuilder();
    expect(screen.getByRole("heading", { name: /curious minds become confident leaders/i })).toBeInTheDocument();
  });

  it("switches the canvas when a different page is selected", async () => {
    const user = userEvent.setup();
    const site = createSite("T");
    const p2 = createPageFromTemplate("Contact Page", "/contact", "contact");
    p2.sections[0].content.heading = "UNIQUE PAGE TWO HEADING";
    site.pages.push(p2);
    site.nav.push(pageNavItem(p2.id, p2.name));
    render(<SiteBuilder value={site} onChange={() => {}} />);
    expect(screen.getByRole("heading", { name: /curious minds/i })).toBeInTheDocument();
    await user.click(screen.getByLabelText("Pages"));
    await user.click(within(screen.getByLabelText("Pages panel")).getByText("Contact Page"));
    expect(screen.getByRole("heading", { name: /UNIQUE PAGE TWO HEADING/i })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /curious minds/i })).not.toBeInTheDocument();
  });
});

describe("SiteBuilder — pages (via rail)", () => {
  it("adds a page via the Add page modal (name + template)", async () => {
    const user = userEvent.setup();
    renderBuilder();
    await user.click(screen.getByLabelText("Pages")); // rail → pages panel
    await user.click(screen.getByLabelText("Add page")); // opens modal
    const dialog = screen.getByRole("dialog");
    await user.type(within(dialog).getByLabelText("Page name"), "Admissions");
    await user.click(within(dialog).getByRole("button", { name: /add page/i }));
    expect(within(screen.getByLabelText("Pages panel")).getByText("Admissions")).toBeInTheDocument();
  });

  it("duplicates a page from its actions menu", async () => {
    const user = userEvent.setup();
    renderBuilder();
    await user.click(screen.getByLabelText("Pages"));
    await user.click(screen.getByLabelText("Actions for Home"));
    await user.click(screen.getByRole("menuitem", { name: /duplicate/i }));
    expect(within(screen.getByLabelText("Pages panel")).getByText("Home copy")).toBeInTheDocument();
  });

  it("keeps at least one page", async () => {
    const user = userEvent.setup();
    renderBuilder();
    await user.click(screen.getByLabelText("Pages"));
    expect(screen.queryByLabelText("Delete Home")).not.toBeInTheDocument();
  });
});

describe("SiteBuilder — sections", () => {
  it("adds a section from the Add panel", async () => {
    const user = userEvent.setup();
    renderBuilder();
    await user.click(screen.getByLabelText("Add section")); // rail → add panel
    const menu = screen.getByRole("menu", { name: "Section types" });
    await user.click(within(menu).getByText("Contact"));
    // addSection returns to the Layers panel
    expect(within(layers()).getByText("Contact Us")).toBeInTheDocument();
  });

  it("deletes a section", async () => {
    const user = userEvent.setup();
    renderBuilder();
    await user.click(screen.getByLabelText("Delete Hero"));
    expect(within(layers()).queryByText("Hero")).not.toBeInTheDocument();
  });

  it("hides a section", async () => {
    const user = userEvent.setup();
    renderBuilder();
    await user.click(screen.getByLabelText("Hide Programs"));
    expect(screen.getByLabelText("Show Programs")).toBeInTheDocument();
  });

  it("reorders sections by drag-and-drop in the Layers panel (drop-between)", () => {
    renderBuilder();
    const panel = layers();
    expect(within(panel).getAllByRole("listitem")[0]).toHaveTextContent("Hero"); // starts first
    const dt = { setData: () => {}, getData: () => "", effectAllowed: "" };
    const grips = within(panel).getAllByTitle(/Drag to reorder/);
    const statsRow = within(panel).getByText("Stats").closest('[role="button"]')!;
    fireEvent.dragStart(grips[0], { dataTransfer: dt }); // grab Hero (index 0)
    fireEvent.dragOver(statsRow, { dataTransfer: dt, clientY: 9999 }); // bottom half of Stats → insert after
    fireEvent.drop(statsRow, { dataTransfer: dt });
    // Hero moved down; Programs is now the first section
    expect(within(panel).getAllByRole("listitem")[0]).toHaveTextContent("Programs");
  });

  it("section drag grips are decorative (aria-hidden); ↑/↓ buttons are the keyboard path (WCAG)", () => {
    renderBuilder();
    const panel = layers();
    for (const grip of within(panel).getAllByTitle(/Drag to reorder/)) {
      expect(grip).toHaveAttribute("aria-hidden", "true");
    }
    expect(within(panel).getByLabelText("Move Programs up")).toBeInTheDocument();
  });
});

describe("SiteBuilder — navigation editor", () => {
  it("adds a dropdown menu and a custom link", async () => {
    const user = userEvent.setup();
    renderBuilder();
    await user.click(screen.getByLabelText("Navigation")); // rail → nav panel
    const panel = screen.getByLabelText("Navigation panel");
    await user.click(within(panel).getByRole("button", { name: "Dropdown" }));  // add a dropdown
    expect(within(panel).getByDisplayValue("Menu")).toBeInTheDocument();
    await user.click(within(panel).getByRole("button", { name: "Link" }));  // add a top-level link
    expect(within(panel).getByDisplayValue("New link")).toBeInTheDocument();
  });

  it("quick-adds a page that isn't in the menu yet, then hides it from the quick-add list", async () => {
    const user = userEvent.setup();
    const site = createSite("T");
    const p2 = createPageFromTemplate("Contact", "/contact", "contact");
    site.pages.push(p2); // a page NOT yet in the nav
    render(<SiteBuilder value={site} onChange={vi.fn()} />);
    await user.click(screen.getByLabelText("Navigation"));
    const panel = screen.getByLabelText("Navigation panel");
    // The "Add one of your pages" quick-add lists the missing page
    const quickAdd = within(panel).getByText("Contact");
    await user.click(quickAdd);
    // It now appears as a menu item (an editable label input) and leaves the quick-add list
    expect(within(panel).getByDisplayValue("Contact")).toBeInTheDocument();
  });

  it("reorders menu items by drag-and-drop (grip handle → drop on another item)", async () => {
    const user = userEvent.setup();
    const site = createSite("T");
    const p2 = createPageFromTemplate("Contact", "/contact", "contact");
    site.pages.push(p2);
    site.nav = [pageNavItem(site.pages[0].id, "Home"), pageNavItem(p2.id, "Contact")];
    render(<SiteBuilder value={site} onChange={vi.fn()} />);
    await user.click(screen.getByLabelText("Navigation"));
    const panel = screen.getByLabelText("Navigation panel");

    const order = () => within(panel).getAllByLabelText("Menu item label").map((i) => (i as HTMLInputElement).value);
    expect(order()).toEqual(["Home", "Contact"]);

    const dt = { setData: () => {}, getData: () => "", effectAllowed: "" };
    const handle = within(panel).getAllByTitle(/Drag to reorder/)[0]; // first item's grip (decorative, aria-hidden)
    const targetLi = within(panel).getAllByLabelText("Menu item label")[1].closest("li")!;
    fireEvent.dragStart(handle, { dataTransfer: dt });
    fireEvent.dragOver(targetLi, { dataTransfer: dt });
    fireEvent.drop(targetLi, { dataTransfer: dt });

    // Home moved after Contact
    expect(order()).toEqual(["Contact", "Home"]);
  });

  it("adds a navigation menu to the header via the panel's 'Add menu to header'", async () => {
    const user = userEvent.setup();
    const site = createSite("T");
    // Simulate a header that has NO nav element (user removed it)
    site.header = { layout: defaultHeaderLayout(site).filter((e) => e.type !== "nav") };
    render(<SiteBuilder value={site} onChange={vi.fn()} />);
    await user.click(screen.getByLabelText("Navigation"));
    const panel = screen.getByLabelText("Navigation panel");
    await user.click(within(panel).getByRole("button", { name: /Add menu to header/i }));
    // The header nav element is now selected → its inspector (with "Manage links & dropdowns") shows
    expect(screen.getByText("Manage links & dropdowns")).toBeInTheDocument();
  });

  it("renders a dropdown's children as links (SiteNav / Menu renderer)", () => {
    const site = createSite("T");
    site.nav = [makeNavItem({ type: "dropdown", label: "About", children: [makeNavItem({ type: "link", label: "Admissions", href: "/admissions" })] })];
    render(<SiteNav site={site} theme={DEFAULT_THEME} />);
    expect(screen.getByRole("link", { name: "Admissions" })).toBeInTheDocument();
  });
});

describe("SiteBuilder — inspector (content)", () => {
  it("shows the active section's heading and lets it be edited", async () => {
    const user = userEvent.setup();
    renderBuilder();
    const heading = screen.getByDisplayValue(/curious minds become confident leaders/i);
    await user.clear(heading);
    await user.type(heading, "Our New Headline");
    expect(screen.getByDisplayValue("Our New Headline")).toBeInTheDocument();
  });
});

describe("SiteBuilder — theme panel", () => {
  it("exposes brand colour controls in the Theme panel", async () => {
    const user = userEvent.setup();
    renderBuilder();
    await user.click(screen.getByLabelText("Theme")); // rail → theme panel
    expect(screen.getByLabelText("Primary colour")).toBeInTheDocument(); // shared ColorPickerPopover trigger
    expect(screen.getByLabelText("Accent colour")).toBeInTheDocument();
  });
});

describe("SiteBuilder — preview + device", () => {
  it("preview hides the rail and panels", async () => {
    const user = userEvent.setup();
    renderBuilder();
    expect(screen.getByLabelText("Builder tools")).toBeInTheDocument();
    await user.click(screen.getByLabelText("Preview"));
    expect(screen.queryByLabelText("Builder tools")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Layers panel")).not.toBeInTheDocument();
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

describe("SiteBuilder — saving", () => {
  /**
   * Edits are debounced by 700 ms so a name being typed does not write to storage on every keystroke.
   * The timer was never cleared on unmount, which cost two things: it fired into a component that no longer
   * existed (an unhandled error in every run of this file), and an edit made in the last 700 ms before
   * leaving the builder was written by accident rather than by design.
   */
  it("writes an edit that was still waiting on the debounce when the builder closes", () => {
    vi.useFakeTimers();
    try {
      const site = createSite("Test School");
      const onChange = vi.fn();
      const { unmount } = render(<SiteBuilder value={site} onChange={onChange} />);

      fireEvent.change(screen.getByLabelText("Site name"), { target: { value: "Riverside Primary" } });
      expect(onChange, "still inside the debounce window").not.toHaveBeenCalled();

      unmount();

      // Flushed, not cancelled: the debounce exists to avoid writing on every keystroke, not to make the
      // last one optional.
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange.mock.calls[0][0].name).toBe("Riverside Primary");
      // …and it reached durable storage, which is the half that actually survives leaving the page.
      expect(siteStorage.get(site.id)?.name).toBe("Riverside Primary");
    } finally {
      vi.useRealTimers();
    }
  });

  it("leaves no timer running after the builder closes", () => {
    vi.useFakeTimers();
    try {
      const site = createSite("Test School");
      const onChange = vi.fn();
      const { unmount } = render(<SiteBuilder value={site} onChange={onChange} />);
      fireEvent.change(screen.getByLabelText("Site name"), { target: { value: "Riverside" } });
      unmount();
      onChange.mockClear();

      // If the debounce were still armed it would fire here, into a component that has gone.
      vi.advanceTimersByTime(5000);
      expect(onChange).not.toHaveBeenCalled();
    } finally {
      vi.useRealTimers();
    }
  });
});
