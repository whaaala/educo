import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ThemeSwitcher from "@/components/shared/ThemeSwitcher";
import { ThemeProvider } from "@/contexts/ThemeContext";

function renderSwitcher() {
  return render(
    <ThemeProvider>
      <ThemeSwitcher />
    </ThemeProvider>,
  );
}

beforeEach(() => {
  localStorage.clear();
  document.documentElement.className = "";
});

describe("ThemeSwitcher", () => {
  it("shows the current theme (Light by default) and is closed initially", () => {
    renderSwitcher();
    expect(screen.getByLabelText("Change theme")).toHaveTextContent("Light");
    expect(screen.queryByRole("menu", { name: "Themes" })).not.toBeInTheDocument();
  });

  it("opens a menu listing all four themes", async () => {
    const user = userEvent.setup();
    renderSwitcher();
    await user.click(screen.getByLabelText("Change theme"));
    const menu = screen.getByRole("menu", { name: "Themes" });
    for (const label of ["Light", "Dark", "Midnight", "Purple Dream"]) {
      expect(within(menu).getByText(label)).toBeInTheDocument();
    }
  });

  it("switches the theme when an option is chosen", async () => {
    const user = userEvent.setup();
    renderSwitcher();
    await user.click(screen.getByLabelText("Change theme"));
    await user.click(screen.getByRole("menuitemradio", { name: /Midnight/ }));
    // Trigger reflects the new theme and the menu closes.
    expect(screen.getByLabelText("Change theme")).toHaveTextContent("Midnight");
    expect(screen.queryByRole("menu", { name: "Themes" })).not.toBeInTheDocument();
    // ThemeContext applied the class to the document root.
    expect(document.documentElement.classList.contains("midnight")).toBe(true);
  });

  it("marks the active theme as checked", async () => {
    const user = userEvent.setup();
    renderSwitcher();
    await user.click(screen.getByLabelText("Change theme"));
    expect(screen.getByRole("menuitemradio", { name: /Light/ })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("menuitemradio", { name: /Purple/ })).toHaveAttribute("aria-checked", "false");
  });
});
