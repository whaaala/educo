import { test, expect, type Page } from "@playwright/test";

// ─── Helpers ────────────────────────────────────────────────

async function goto(page: Page, path: string) {
  await page.goto(path);
  await page.waitForLoadState("networkidle");
}

function editorArea(page: Page) {
  return page.locator("[data-doc-editor-root] [contenteditable='true']").first();
}

function htmlOutput(page: Page) {
  return page.locator("[data-testid='html-output']");
}

async function typeAndSelectAll(page: Page, text: string) {
  const editor = editorArea(page);
  await editor.click();
  await page.keyboard.type(text, { delay: 20 });
  await page.keyboard.press("Control+A");
  await page.waitForTimeout(100);
}

const viewports = {
  desktop: { width: 1280, height: 720 },
  tabletLandscape: { width: 1024, height: 768 },
  tabletPortrait: { width: 768, height: 1024 },
  mobile: { width: 375, height: 812 },
};

// ─── Section 1: Page Load & Initial State ───────────────────

test.describe("Doc Editor — Page Load & Initial State", () => {
  test("renders editor with title, toolbar, menubar, and page area", async ({ page }) => {
    await goto(page, "/doc-editor-test");
    await expect(page.locator("[data-doc-editor-root]")).toBeVisible();
    await expect(page.locator("input[aria-label='Document title']")).toBeVisible();
    await expect(page.locator("[data-doc-menubar]")).toBeVisible();
    await expect(page.locator('button[title="Bold"]')).toBeVisible();
    await expect(editorArea(page)).toBeVisible();
  });

  test("editor accepts text input", async ({ page }) => {
    await goto(page, "/doc-editor-test");
    const editor = editorArea(page);
    await editor.click();
    await page.keyboard.type("Hello world", { delay: 20 });
    await page.waitForTimeout(200);
    const output = await htmlOutput(page).textContent();
    expect(output).toContain("Hello world");
  });

  test("default title is 'Untitled document'", async ({ page }) => {
    await goto(page, "/doc-editor-test");
    const titleInput = page.locator("input[aria-label='Document title']");
    await expect(titleInput).toHaveValue("Untitled document");
  });
});

// ─── Section 2: Text Formatting ─────────────────────────────

test.describe("Doc Editor — Text Formatting", () => {
  test("bold applies <b> or <strong> tag", async ({ page }) => {
    await goto(page, "/doc-editor-test");
    await typeAndSelectAll(page, "bold text");
    await page.click('button[title="Bold"]');
    await page.waitForTimeout(200);
    const output = await htmlOutput(page).textContent();
    expect(output).toMatch(/<b>|<strong>/);
  });

  test("italic applies <i> or <em> tag", async ({ page }) => {
    await goto(page, "/doc-editor-test");
    await typeAndSelectAll(page, "italic text");
    await page.click('button[title="Italic"]');
    await page.waitForTimeout(200);
    const output = await htmlOutput(page).textContent();
    expect(output).toMatch(/<i>|<em>/);
  });

  test("underline applies <u> tag", async ({ page }) => {
    await goto(page, "/doc-editor-test");
    await typeAndSelectAll(page, "underline text");
    await page.click('button[title="Underline"]');
    await page.waitForTimeout(200);
    const output = await htmlOutput(page).textContent();
    expect(output).toContain("<u>");
  });

  test("strikethrough applies <strike> or <s> or <del> tag", async ({ page }) => {
    await goto(page, "/doc-editor-test");
    await typeAndSelectAll(page, "strike text");
    await page.click('button[title="Strikethrough"]');
    await page.waitForTimeout(200);
    const output = await htmlOutput(page).textContent();
    expect(output).toMatch(/<strike>|<s>|<del>/);
  });

  test("superscript applies <sup> tag", async ({ page }) => {
    await goto(page, "/doc-editor-test");
    await typeAndSelectAll(page, "super text");
    await page.click('button[title="Superscript"]');
    await page.waitForTimeout(200);
    const output = await htmlOutput(page).textContent();
    expect(output).toContain("<sup>");
  });

  test("subscript applies <sub> tag", async ({ page }) => {
    await goto(page, "/doc-editor-test");
    await typeAndSelectAll(page, "sub text");
    await page.click('button[title="Subscript"]');
    await page.waitForTimeout(200);
    const output = await htmlOutput(page).textContent();
    expect(output).toContain("<sub>");
  });
});

// ─── Section 3: New Toolbar Features ────────────────────────

test.describe("Doc Editor — New Toolbar Features", () => {
  test("font family dropdown opens and shows categories", async ({ page }) => {
    await goto(page, "/doc-editor-test");
    await page.click('button[title="Font family"]');
    await page.waitForTimeout(200);
    await expect(page.getByText("Sans-serif")).toBeVisible();
    await expect(page.getByText("Serif", { exact: true })).toBeVisible();
    await expect(page.getByText("Monospace")).toBeVisible();
  });

  test("selecting a font applies font-family in HTML output", async ({ page }) => {
    await goto(page, "/doc-editor-test");
    await typeAndSelectAll(page, "font test");
    await page.click('button[title="Font family"]');
    await page.waitForTimeout(200);
    // Click "Georgia" in the Serif category
    await page.locator("button").filter({ hasText: /^Georgia$/ }).click();
    await page.waitForTimeout(300);
    const output = await htmlOutput(page).textContent();
    expect(output).toMatch(/font-family|face="Georgia"/i);
  });

  test("font size dropdown opens with presets", async ({ page }) => {
    await goto(page, "/doc-editor-test");
    await page.click('button[title="Font size"]');
    await page.waitForTimeout(200);
    await expect(page.locator("button").filter({ hasText: /^12$/ })).toBeVisible();
    await expect(page.locator("button").filter({ hasText: /^24$/ })).toBeVisible();
    await expect(page.locator("button").filter({ hasText: /^48$/ })).toBeVisible();
  });

  test("text color picker opens with solid tab", async ({ page }) => {
    await goto(page, "/doc-editor-test");
    await page.click('button[title="Text color"]');
    await page.waitForTimeout(200);
    // The TabbedColorPalette shows tabs including "solid" (capitalized in the button)
    await expect(page.locator("button").filter({ hasText: /^solid$/i })).toBeVisible();
  });

  test("highlight color picker opens", async ({ page }) => {
    await goto(page, "/doc-editor-test");
    await page.click('button[title="Highlight color"]');
    await page.waitForTimeout(200);
    // The highlight picker has a "Remove highlight" button
    await expect(page.getByText("Remove highlight")).toBeVisible();
  });

  test("line spacing dropdown shows Single and Double options", async ({ page }) => {
    await goto(page, "/doc-editor-test");
    await page.click('button[title="Line spacing"]');
    await page.waitForTimeout(200);
    await expect(page.locator("button").filter({ hasText: /^Single$/ })).toBeVisible();
    await expect(page.locator("button").filter({ hasText: /^Double$/ })).toBeVisible();
  });

  test("zoom dropdown changes label to 150%", async ({ page }) => {
    await goto(page, "/doc-editor-test");
    const zoomBtn = page.locator('button[title="Zoom"]');
    await zoomBtn.click();
    await page.waitForTimeout(200);
    await page.locator("button").filter({ hasText: /^150%$/ }).click();
    await page.waitForTimeout(200);
    // After selecting 150%, the dropdown label should update
    await expect(zoomBtn).toContainText("150%");
  });

  test("checklist inserts checkbox element", async ({ page }) => {
    await goto(page, "/doc-editor-test");
    const editor = editorArea(page);
    await editor.click();
    await page.click('button[title="Checklist"]');
    await page.waitForTimeout(200);
    const output = await htmlOutput(page).textContent();
    expect(output).toMatch(/checkbox/i);
  });

  test("indent increases indentation", async ({ page }) => {
    await goto(page, "/doc-editor-test");
    const editor = editorArea(page);
    await editor.click();
    await page.keyboard.type("indented text", { delay: 20 });
    await page.keyboard.press("Control+A");
    await page.waitForTimeout(100);
    await page.click('button[title="Increase indent"]');
    await page.waitForTimeout(200);
    const output = await htmlOutput(page).textContent();
    expect(output).toMatch(/blockquote|margin-left|padding-left/i);
  });
});

// ─── Section 4: Menu System ─────────────────────────────────

test.describe("Doc Editor — Menu System", () => {
  test("File menu shows New, Open, Share, Download items", async ({ page }) => {
    await goto(page, "/doc-editor-test");
    // Click the File menu label in the menubar
    await page.locator("[data-doc-menubar]").getByText("File").click();
    await page.waitForTimeout(200);
    const panel = page.locator("[data-doc-menu-panel]").first();
    await expect(panel).toBeVisible();
    await expect(panel.getByText("New")).toBeVisible();
    await expect(panel.getByText("Open")).toBeVisible();
    await expect(panel.getByText("Share")).toBeVisible();
    await expect(panel.getByText("Download")).toBeVisible();
  });

  test("Edit menu shows Undo, Redo, Find and replace", async ({ page }) => {
    await goto(page, "/doc-editor-test");
    await page.locator("[data-doc-menubar]").getByText("Edit").click();
    await page.waitForTimeout(200);
    const panel = page.locator("[data-doc-menu-panel]").first();
    await expect(panel).toBeVisible();
    await expect(panel.getByText("Undo")).toBeVisible();
    await expect(panel.getByText("Redo")).toBeVisible();
    await expect(panel.getByText("Find and replace")).toBeVisible();
  });

  test("View menu opens with menu panel visible", async ({ page }) => {
    await goto(page, "/doc-editor-test");
    await page.locator("[data-doc-menubar]").getByText("View").click();
    await page.waitForTimeout(200);
    const panel = page.locator("[data-doc-menu-panel]").first();
    await expect(panel).toBeVisible();
  });

  test("Insert menu opens with menu panel visible", async ({ page }) => {
    await goto(page, "/doc-editor-test");
    await page.locator("[data-doc-menubar]").getByText("Insert").click();
    await page.waitForTimeout(200);
    const panel = page.locator("[data-doc-menu-panel]").first();
    await expect(panel).toBeVisible();
  });

  test("menu closes on outside click", async ({ page }) => {
    await goto(page, "/doc-editor-test");
    await page.locator("[data-doc-menubar]").getByText("File").click();
    await page.waitForTimeout(200);
    await expect(page.locator("[data-doc-menu-panel]").first()).toBeVisible();
    // Click the editor area to close the menu
    await editorArea(page).click();
    await page.waitForTimeout(300);
    await expect(page.locator("[data-doc-menu-panel]")).toHaveCount(0);
  });
});

// ─── Section 5: Templates ───────────────────────────────────

test.describe("Doc Editor — Templates", () => {
  test("default template chips are visible", async ({ page }) => {
    await goto(page, "/doc-editor-test");
    await expect(page.locator("button[title='Meeting notes']")).toBeVisible();
    await expect(page.locator("button[title='Email draft']")).toBeVisible();
  });

  test("clicking Meeting notes template inserts content", async ({ page }) => {
    await goto(page, "/doc-editor-test");
    await page.locator("button[title='Meeting notes']").click();
    await page.waitForTimeout(300);
    const output = await htmlOutput(page).textContent();
    expect(output).toContain("Meeting notes");
    expect(output).toContain("Attendees");
  });
});

// ─── Section 6: Tables ──────────────────────────────────────

test.describe("Doc Editor — Tables", () => {
  test("Insert > Table shows submenu with grid picker", async ({ page }) => {
    await goto(page, "/doc-editor-test");
    await page.locator("[data-doc-menubar]").getByText("Insert").click();
    await page.waitForTimeout(200);
    // Hover over the Table menu item to open its submenu
    const tableItem = page.locator("[data-doc-menu-panel]").getByText("Table");
    await tableItem.hover();
    await page.waitForTimeout(400);
    // The submenu should contain the TableGridPicker (rendered in a SubmenuPanel)
    const submenuPanels = page.locator("[data-doc-menu-panel]");
    await expect(submenuPanels.last()).toBeVisible();
  });
});

// ─── Section 7: Find & Replace ──────────────────────────────

test.describe("Doc Editor — Find & Replace", () => {
  test("opens from Edit > Find and replace", async ({ page }) => {
    await goto(page, "/doc-editor-test");
    await page.locator("[data-doc-menubar]").getByText("Edit").click();
    await page.waitForTimeout(200);
    await page.locator("[data-doc-menu-panel]").getByText("Find and replace").click();
    await page.waitForTimeout(200);
    await expect(page.getByPlaceholder("Find\u2026")).toBeVisible();
  });

  test("find highlights text and replace all works", async ({ page }) => {
    await goto(page, "/doc-editor-test");
    const editor = editorArea(page);
    await editor.click();
    await page.keyboard.type("foo bar foo", { delay: 20 });
    await page.waitForTimeout(200);
    // Open Find and Replace dialog
    await page.locator("[data-doc-menubar]").getByText("Edit").click();
    await page.waitForTimeout(200);
    await page.locator("[data-doc-menu-panel]").getByText("Find and replace").click();
    await page.waitForTimeout(200);
    // Fill in find and replace fields
    await page.getByPlaceholder("Find\u2026").fill("foo");
    await page.getByPlaceholder("Replace with\u2026").fill("baz");
    await page.waitForTimeout(100);
    // Click Replace all
    await page.getByText("Replace all").click();
    await page.waitForTimeout(300);
    const output = await htmlOutput(page).textContent();
    expect(output).toContain("baz");
    expect(output).not.toContain("foo");
  });

  test("find next shows Found or Not found toast", async ({ page }) => {
    await goto(page, "/doc-editor-test");
    const editor = editorArea(page);
    await editor.click();
    await page.keyboard.type("hello world", { delay: 20 });
    await page.waitForTimeout(200);
    // Open Find and Replace dialog
    await page.locator("[data-doc-menubar]").getByText("Edit").click();
    await page.waitForTimeout(200);
    await page.locator("[data-doc-menu-panel]").getByText("Find and replace").click();
    await page.waitForTimeout(200);
    await page.getByPlaceholder("Find\u2026").fill("hello");
    await page.getByText("Find next").click();
    await page.waitForTimeout(300);
    // Toast should show "Found"
    await expect(page.getByText("Found")).toBeVisible();
  });
});

// ─── Section 8: Export ──────────────────────────────────────

test.describe("Doc Editor — Export", () => {
  test("File > Download shows format options", async ({ page }) => {
    await goto(page, "/doc-editor-test");
    await page.locator("[data-doc-menubar]").getByText("File").click();
    await page.waitForTimeout(200);
    // Hover over Download to open its submenu
    const downloadItem = page.locator("[data-doc-menu-panel]").getByText("Download");
    await downloadItem.hover();
    await page.waitForTimeout(400);
    // Check that format options are visible in the submenu
    await expect(page.getByText("Web page (.html)")).toBeVisible();
    await expect(page.getByText("PDF document (.pdf)")).toBeVisible();
  });
});

// ─── Section 9: Document Title ──────────────────────────────

test.describe("Doc Editor — Document Title", () => {
  test("title input is editable", async ({ page }) => {
    await goto(page, "/doc-editor-test");
    const titleInput = page.locator("input[aria-label='Document title']");
    await titleInput.click();
    await titleInput.fill("My Document");
    await expect(titleInput).toHaveValue("My Document");
  });

  test("default title is 'Untitled document'", async ({ page }) => {
    await goto(page, "/doc-editor-test");
    const titleInput = page.locator("input[aria-label='Document title']");
    await expect(titleInput).toHaveValue("Untitled document");
  });
});

// ─── Section 10: Page Setup ─────────────────────────────────

test.describe("Doc Editor — Page Setup", () => {
  test("File > Page setup opens dialog", async ({ page }) => {
    await goto(page, "/doc-editor-test");
    await page.locator("[data-doc-menubar]").getByText("File").click();
    await page.waitForTimeout(200);
    await page.locator("[data-doc-menu-panel]").getByText("Page setup").click();
    await page.waitForTimeout(200);
    await expect(page.getByText("Width (px)")).toBeVisible();
  });
});

// ─── Section 11: Fullscreen ─────────────────────────────────

test.describe("Doc Editor — Fullscreen", () => {
  test("View > Full screen fills viewport with exit button", async ({ page }) => {
    await goto(page, "/doc-editor-test");
    await page.locator("[data-doc-menubar]").getByText("View").click();
    await page.waitForTimeout(200);
    await page.locator("[data-doc-menu-panel]").getByText("Full screen").click();
    await page.waitForTimeout(300);
    // The "Exit full screen" button should appear
    await expect(page.getByText("Exit full screen")).toBeVisible();
  });

  test("pressing Escape exits fullscreen", async ({ page }) => {
    await goto(page, "/doc-editor-test");
    await page.locator("[data-doc-menubar]").getByText("View").click();
    await page.waitForTimeout(200);
    await page.locator("[data-doc-menu-panel]").getByText("Full screen").click();
    await page.waitForTimeout(300);
    await expect(page.getByText("Exit full screen")).toBeVisible();
    // Press Escape to exit fullscreen
    await page.keyboard.press("Escape");
    await page.waitForTimeout(300);
    await expect(page.getByText("Exit full screen")).toHaveCount(0);
  });
});

// ─── Section 12: Keyboard Shortcuts ─────────────────────────

test.describe("Doc Editor — Keyboard Shortcuts", () => {
  test("Ctrl+B toggles bold", async ({ page }) => {
    await goto(page, "/doc-editor-test");
    await typeAndSelectAll(page, "kb bold");
    await page.keyboard.press("Control+B");
    await page.waitForTimeout(200);
    const output = await htmlOutput(page).textContent();
    expect(output).toMatch(/<b>|<strong>/);
  });

  test("Ctrl+I toggles italic", async ({ page }) => {
    await goto(page, "/doc-editor-test");
    await typeAndSelectAll(page, "kb italic");
    await page.keyboard.press("Control+I");
    await page.waitForTimeout(200);
    const output = await htmlOutput(page).textContent();
    expect(output).toMatch(/<i>|<em>/);
  });

  test("Ctrl+U toggles underline", async ({ page }) => {
    await goto(page, "/doc-editor-test");
    await typeAndSelectAll(page, "kb underline");
    await page.keyboard.press("Control+U");
    await page.waitForTimeout(200);
    const output = await htmlOutput(page).textContent();
    expect(output).toContain("<u>");
  });

  test("Ctrl+Z performs undo", async ({ page }) => {
    await goto(page, "/doc-editor-test");
    const editor = editorArea(page);
    await editor.click();
    await page.keyboard.type("first ", { delay: 20 });
    await page.waitForTimeout(100);
    await page.keyboard.type("second", { delay: 20 });
    await page.waitForTimeout(200);
    const beforeUndo = await htmlOutput(page).textContent();
    expect(beforeUndo).toContain("second");
    // Undo the last typed word
    await page.keyboard.press("Control+Z");
    await page.waitForTimeout(300);
    const afterUndo = await htmlOutput(page).textContent();
    // After undo, content should have changed (some text removed)
    expect(afterUndo).not.toBe(beforeUndo);
  });
});

// ─── Section 13: Responsive ─────────────────────────────────

test.describe("Doc Editor — Responsive", () => {
  for (const [name, vp] of Object.entries(viewports)) {
    test(`editor renders and is visible at ${name} (${vp.width}x${vp.height})`, async ({
      page,
    }) => {
      await page.setViewportSize(vp);
      await goto(page, "/doc-editor-test");
      await expect(page.locator("[data-doc-editor-root]")).toBeVisible();
      await expect(editorArea(page)).toBeVisible();
    });
  }

  test("on mobile toolbar wraps but Bold button is still visible", async ({ page }) => {
    await page.setViewportSize(viewports.mobile);
    await goto(page, "/doc-editor-test");
    await expect(page.locator('button[title="Bold"]')).toBeVisible();
  });
});

// ─── Section 14: Themes ─────────────────────────────────────

test.describe("Doc Editor — Themes", () => {
  const themes = ["light", "dark", "midnight", "purple"] as const;

  for (const theme of themes) {
    test(`editor is visible in ${theme} theme`, async ({ page }) => {
      await goto(page, "/doc-editor-test");
      if (theme !== "light") {
        await page.evaluate((t) => {
          document.documentElement.classList.add("dark");
          if (t !== "dark") {
            document.documentElement.classList.add(t);
          }
        }, theme);
        await page.waitForTimeout(300);
      }
      await expect(page.locator("[data-doc-editor-root]")).toBeVisible();
    });
  }
});

// ─── Section 15: Visual Regression ──────────────────────────

test.describe("Doc Editor — Visual Regression (Viewports)", () => {
  for (const [name, vp] of Object.entries(viewports)) {
    test(`screenshot at ${name} viewport`, async ({ page }) => {
      await page.setViewportSize(vp);
      await goto(page, "/doc-editor-test");
      await expect(page.locator("[data-doc-editor-root]")).toBeVisible();
      await expect(page).toHaveScreenshot(`doc-editor-${name}.png`, {
        maxDiffPixelRatio: 0.05,
        fullPage: true,
      });
    });
  }
});

test.describe("Doc Editor — Visual Regression (Themes)", () => {
  const themes = ["light", "dark", "midnight", "purple"] as const;

  for (const theme of themes) {
    test(`screenshot in ${theme} theme`, async ({ page }) => {
      await page.setViewportSize(viewports.desktop);
      await goto(page, "/doc-editor-test");
      if (theme !== "light") {
        await page.evaluate((t) => {
          document.documentElement.classList.add("dark");
          if (t !== "dark") {
            document.documentElement.classList.add(t);
          }
        }, theme);
        await page.waitForTimeout(300);
      }
      await expect(page.locator("[data-doc-editor-root]")).toBeVisible();
      await expect(page).toHaveScreenshot(`doc-editor-theme-${theme}.png`, {
        maxDiffPixelRatio: 0.05,
        fullPage: true,
      });
    });
  }
});
