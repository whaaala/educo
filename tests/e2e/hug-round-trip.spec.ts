import { test, expect, type Page } from "@playwright/test";

/**
 * A BLOCK DRAGGED BACK TO ITS WORDS' WIDTH HUGS THEM AGAIN (L4-f, 2026-10-03) — built through the UI (RULE Y).
 *
 * Found by BATCH L-4's headed pass: a Heading that hugs "New heading", its right edge dragged 40px narrower (the words
 * wrap) and then 40px back, came home at the same pixel width — but as a STORED width a fraction under its words, so they
 * never unwrapped and the heading stayed 25px taller. "Resizing never restructures — fully reversible" (the agreed rules).
 */
const clickTile = async (page: Page, text: string) => {
  await page.evaluate((t) => {
    const tile = Array.from(document.querySelectorAll<HTMLElement>('[draggable="true"]')).find((e) => (e.textContent || "").trim().startsWith(t));
    if (!tile) throw new Error(`no tile ${t}`);
    tile.click();
  }, text);
  await page.waitForTimeout(750);
};
/** The real HTML5 drop pipeline: dragstart on the tile, dragover + drop at a point on the canvas. */
const dropTileAt = async (page: Page, text: string, x: number, y: number) => {
  await page.evaluate(({ text, x, y }) => {
    const tile = Array.from(document.querySelectorAll<HTMLElement>('[draggable="true"]')).find((e) => (e.textContent || "").trim().startsWith(text))!;
    const dt = new DataTransfer();
    tile.dispatchEvent(new DragEvent("dragstart", { bubbles: true, cancelable: true, dataTransfer: dt }));
    const el = document.elementFromPoint(x, y)!;
    const at = { clientX: x, clientY: y, bubbles: true, cancelable: true, dataTransfer: dt };
    el.dispatchEvent(new DragEvent("dragover", at));
    el.dispatchEvent(new DragEvent("drop", at));
    tile.dispatchEvent(new DragEvent("dragend", { bubbles: true, dataTransfer: dt }));
  }, { text, x, y });
  await page.waitForTimeout(800);
};
const leaves = (page: Page) => page.evaluate(() => Array.from(document.querySelectorAll("[data-box-id]")).filter((e) => !e.querySelector("[data-box-id]")).map((e) => e.getAttribute("data-box-id")!));

async function drag(page: Page, label: string, dx: number) {
  const h = (await page.locator(`[aria-label="Resize ${label}"]`).first().boundingBox())!;
  const cx = h.x + h.width / 2, cy = h.y + h.height / 2;
  await page.mouse.move(cx, cy); await page.mouse.down();
  for (let i = 1; i <= 12; i++) { await page.mouse.move(cx + (dx * i) / 12, cy); await page.waitForTimeout(12); }
  await page.mouse.up(); await page.waitForTimeout(600);
}

test.describe("a block dragged back to its words' width hugs them again (L4-f)", () => {
  for (const [label, d] of [["right edge", -40], ["left edge", 40]] as const) {
    test(`the ${label} in ${d > 0 ? "+" : ""}${d}px and back`, async ({ page }) => {
      const errs: string[] = []; page.on("pageerror", (e) => errs.push(e.message.split("\n")[0]));
      await page.setViewportSize({ width: 1240, height: 820 }); // a laptop window: the Desktop page is drawn SCALED (~61%), where it was found
      await page.addInitScript(() => { try { if (!sessionStorage.getItem("kept")) { localStorage.clear(); sessionStorage.setItem("kept", "1"); } } catch { /* private mode */ } });
      await page.goto("/website/box-demo", { waitUntil: "load" });
      await page.waitForFunction(() => { const b = Array.from(document.querySelectorAll("button")).find((x) => x.getAttribute("aria-label") === "Open blocks panel"); return !!b && Object.keys(b).some((k) => k.startsWith("__reactProps")); }, null, { timeout: 60_000 });
      await page.getByRole("button", { name: "Open blocks panel" }).click(); await page.waitForTimeout(600);
      await clickTile(page, "Stack");
      const stack = (await leaves(page)).at(-1)!; const sb = (await page.locator(`[data-box-id="${stack}"]`).boundingBox())!;
      await dropTileAt(page, "Heading", Math.round(sb.x + sb.width / 2), Math.round(sb.y + sb.height / 2));
      const head = (await leaves(page)).find((x) => x !== stack)!;
      expect(head, "the Heading dropped into the Stack").toBeTruthy();
      await page.getByRole("button", { name: "Close blocks panel" }).click(); await page.waitForTimeout(500);
      await page.getByRole("button", { name: "Desktop (1280px)" }).first().click(); await page.waitForTimeout(700);
      const rect = async () => { const b = (await page.locator(`[data-box-id="${head}"]`).boundingBox())!; return { w: Math.round(b.width), h: Math.round(b.height) }; };
      // select it (click the words), as a person does
      const b = (await page.locator(`[data-box-id="${head}"]`).boundingBox())!; await page.mouse.click(b.x + b.width / 2, b.y + b.height / 2); await page.keyboard.press("Escape"); await page.waitForTimeout(300);
      if (!(await page.locator(`[aria-label="Resize ${label}"]`).count())) { await page.mouse.click(b.x + b.width / 2, b.y + b.height / 2); await page.waitForTimeout(300); }
      const r0 = await rect();
      await drag(page, label, d);
      const r1 = await rect();
      expect(r1.h, "dragged narrower than its words, the heading wraps (the precondition)").toBeGreaterThan(r0.h);
      await drag(page, label, -d);
      const r2 = await rect();
      expect(r2.w, "the width comes back").toBeLessThanOrEqual(r0.w + 2);
      expect(r2.h, "…and the words unwrap: the height comes back too").toBe(r0.h);
      expect(errs).toEqual([]);
    });
  }
});
