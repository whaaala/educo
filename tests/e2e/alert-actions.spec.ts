import { test, expect, type Page } from "@playwright/test";
import type { BoxNode } from "@/lib/box-model";
import { siteFromRoot } from "@/lib/box-site";
import { renderSitePage } from "@/lib/box-export";
import { DEFAULT_THEME } from "@/lib/site-storage";

/**
 * One page, rendered through the SHIPPING export path.
 *
 * These used to call `renderSiteHTML`, which put every page in one document. The app no longer emits that
 * shape — so the tests were validating a code path that could not reach a user, which is exactly the failure
 * these invariants exist to catch. `inlineShared` is set because `setContent` has no styles.css to fetch.
 */
const exportDoc = (root: BoxNode) => {
  const site = siteFromRoot(root);
  return renderSitePage(site, DEFAULT_THEME, site.homeId, { inlineShared: true });
};

/**
 * ALERT ACTIONS — buttons and links on a message.
 *
 * The single biggest gap the source galleries showed: a cookie banner (Manage / Accept), a promo bar, an
 * "Update information" notice, "Learn more →" — nearly every real-world alert carries one, and ours could not.
 *
 * Per RULE U this exercises the feature the way a person meets it: every style, both placements, the keyboard
 * path, the look at each breakpoint, and the rules that constrain it — not a sample of them.
 */

const alertWith = (extra: Record<string, unknown>, actions: Record<string, unknown>[]) => ({
  id: "tgt", anchor: "tgt", type: "component", component: "alert", width: "fill",
  alertSeverity: "info", alertForm: "inline",
  items: [{ id: "i1", title: "Term dates have changed", body: "The autumn term now ends a week earlier.", actions }],
  ...extra,
});

async function loadExport(page: Page, node: Record<string, unknown>) {
  const root = { id: "root", type: "container", direction: "column", children: [
    { id: "band", type: "container", direction: "row", rowBand: true, width: "fill", children: [node] },
  ] } as unknown as BoxNode;
  await page.setContent(exportDoc(root), { waitUntil: "domcontentloaded" });
  await page.waitForSelector("#tgt", { state: "attached", timeout: 10_000 });
}

test.describe("Alert actions", () => {
  test("an action with a destination is a LINK; one without is a BUTTON", async ({ page }) => {
    // A link that goes nowhere is a lie to a screen reader, and a button cannot be opened in a new tab or
    // copied. Getting this wrong is invisible on screen and obvious to anyone not using a mouse.
    await loadExport(page, alertWith({}, [
      { id: "a1", label: "Read the letter", href: "https://example.school/letter" },
      { id: "a2", label: "Dismiss" },
    ]));
    const linked = page.locator("#tgt .eu-alert__action").first();
    const plain = page.locator("#tgt .eu-alert__action").nth(1);
    expect(await linked.evaluate((n) => n.tagName)).toBe("A");
    expect(await linked.getAttribute("href")).toBe("https://example.school/letter");
    expect(await plain.evaluate((n) => n.tagName)).toBe("BUTTON");
    expect(await plain.getAttribute("href"), "a button must not pretend to be a link").toBeNull();
  });

  test("opening in a new tab carries the security attributes with it", async ({ page }) => {
    await loadExport(page, alertWith({}, [{ id: "a1", label: "Pay now", href: "https://pay.example", newTab: true }]));
    const a = page.locator("#tgt .eu-alert__action");
    expect(await a.getAttribute("target")).toBe("_blank");
    // Without noopener the opened page gets a handle back to this one — a real, if quiet, vulnerability.
    expect(await a.getAttribute("rel")).toContain("noopener");
  });

  test("EVERY style renders differently — filled, outlined and text link", async ({ page }) => {
    await loadExport(page, alertWith({}, [
      { id: "a1", label: "Filled", kind: "primary" },
      { id: "a2", label: "Outlined", kind: "secondary" },
    ]));
    const look = (i: number) => page.locator("#tgt .eu-alert__action").nth(i).evaluate((n) => {
      const c = getComputedStyle(n);
      return [c.backgroundColor, c.color, c.borderTopWidth, c.borderTopColor, c.textDecorationLine].join("|");
    });
    const filled = await look(0);
    const outlined = await look(1);
    expect(filled, "filled and outlined must not look the same").not.toBe(outlined);

    await loadExport(page, alertWith({}, [{ id: "a1", label: "Learn more", kind: "link" }]));
    const linkLook = await look(0);
    expect(linkLook).not.toBe(filled);
    expect(linkLook).not.toBe(outlined);
    // the arrow is the affordance that says "this goes somewhere"
    const after = await page.locator("#tgt .eu-alert__action").evaluate((n) => getComputedStyle(n, "::after").content);
    expect(after).toContain("→");
  });

  test("an action stays legible on a SOLID alert, where the surface is already the severity colour", async ({ page }) => {
    // Painting the action in --al-c on a --al-c background would make it vanish. This is the case a
    // token-driven system gets wrong silently, because every rule still "uses tokens".
    await loadExport(page, alertWith({ variant: "--solid" }, [{ id: "a1", label: "Pay now", kind: "primary" }]));
    const seen = await page.locator("#tgt .eu-alert__action").evaluate((n) => {
      const a = getComputedStyle(n);
      const surface = getComputedStyle(n.closest(".eu-alert")!);
      return { actionBg: a.backgroundColor, alertBg: surface.backgroundColor };
    });
    expect(seen.actionBg, "the action must not be the same colour as what it sits on").not.toBe(seen.alertBg);
  });

  test("KEYBOARD: every action is reachable and shows a visible focus ring", async ({ page }) => {
    await loadExport(page, alertWith({}, [
      { id: "a1", label: "Read the letter", href: "#letter" },
      { id: "a2", label: "Dismiss" },
    ]));
    const reached: string[] = [];
    for (let i = 0; i < 12; i++) {
      await page.keyboard.press("Tab");
      const label = await page.evaluate(() => {
        const el = document.activeElement;
        return el?.closest("#tgt .eu-alert__action") ? (el.textContent ?? "").trim() : null;
      });
      if (label && !reached.includes(label)) reached.push(label);
      if (reached.length === 2) break;
    }
    expect(reached, "both actions must be reachable by keyboard alone").toEqual(["Read the letter", "Dismiss"]);

    const ring = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement;
      const c = getComputedStyle(el);
      return { width: c.outlineWidth, style: c.outlineStyle };
    });
    expect(ring.style, "focus must be visible, not removed").not.toBe("none");
    expect(parseFloat(ring.width), "and thick enough to see").toBeGreaterThan(0);
  });

  test("a TOAST gets ONE action, however many are configured", async ({ page }) => {
    // Carbon's rule, and a sound one: a floating message that hides itself is the worst place to put a
    // decision, and two buttons in a corner is how people miss both.
    await loadExport(page, alertWith({ alertForm: "toast" }, [
      { id: "a1", label: "Undo" }, { id: "a2", label: "Dismiss" },
    ]));
    expect(await page.locator("#tgt .eu-alert__action").count()).toBe(1);

    await loadExport(page, alertWith({ alertForm: "inline" }, [
      { id: "a1", label: "Undo" }, { id: "a2", label: "Dismiss" },
    ]));
    expect(await page.locator("#tgt .eu-alert__action").count(), "but an inline alert may carry two").toBe(2);
  });

  test("an action with no label is not rendered at all", async ({ page }) => {
    // A half-filled form should not put an empty button on a school's live site.
    await loadExport(page, alertWith({}, [{ id: "a1", label: "  " }, { id: "a2", label: "Read on" }]));
    const labels = await page.locator("#tgt .eu-alert__action").allTextContents();
    expect(labels).toEqual(["Read on"]);
  });

  test("PLACEMENT: on the right beside the text, and stacked underneath on a phone", async ({ page }) => {
    const node = alertWith({ alertActionPlacement: "right" }, [{ id: "a1", label: "Update details", href: "#x" }]);

    await page.setViewportSize({ width: 1280, height: 800 });
    await loadExport(page, node);
    const wide = await page.evaluate(() => {
      const body = document.querySelector("#tgt .eu-alert__body")!.getBoundingClientRect();
      const act = document.querySelector("#tgt .eu-alert__action")!.getBoundingClientRect();
      return { besideIt: act.left > body.right - 2, sameRow: Math.abs(act.top - body.top) < act.height * 2 };
    });
    expect(wide.besideIt, "on a desktop it sits beside the message").toBe(true);

    await page.setViewportSize({ width: 375, height: 812 });
    await loadExport(page, node);
    const narrow = await page.evaluate(() => {
      const body = document.querySelector("#tgt .eu-alert__body")!.getBoundingClientRect();
      const act = document.querySelector("#tgt .eu-alert__action")!.getBoundingClientRect();
      return { below: act.top >= body.bottom - 2 };
    });
    expect(narrow.below, "on a phone it stacks underneath rather than being pushed off the side").toBe(true);
  });

  test("actions never push the page sideways, at any width", async ({ page }) => {
    for (const width of [375, 768, 1280]) {
      await page.setViewportSize({ width, height: 800 });
      await loadExport(page, alertWith({ alertActionPlacement: "right" }, [
        { id: "a1", label: "Update your information now" }, { id: "a2", label: "Remind me later" },
      ]));
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow, `${width}px: no horizontal scroll`).toBeLessThanOrEqual(1);
    }
  });

  test("an action can be styled COMPLETELY — text, colour, font, shape, spacing and position", async ({ page }) => {
    // Every property the inspector offers has to reach the rendered button. A control that writes a field
    // nothing reads is the "offered but does nothing" failure this project keeps meeting.
    const styled = {
      color: "#102030", background: "#f0e0d0", fontFamily: "Georgia, serif", fontSize: "1.8rem",
      fontWeight: 800, letterSpacing: "0.12rem", textTransform: "uppercase" as const,
      radius: "999rem", padding: "0.9rem 2rem", border: "2px solid #204060",
      pos: { x: 1.5, y: -0.5 },
    };
    await loadExport(page, alertWith({}, [{ id: "a1", label: "Book a place", href: "#book", style: styled }]));
    const seen = await page.locator("#tgt .eu-alert__action").evaluate((n) => {
      const c = getComputedStyle(n);
      return {
        text: (n.textContent ?? "").trim(),
        color: c.color, background: c.backgroundColor, font: c.fontFamily, size: c.fontSize,
        weight: c.fontWeight, spacing: c.letterSpacing, transform: c.textTransform,
        radius: c.borderTopLeftRadius, padding: c.padding, border: c.borderTopWidth + " " + c.borderTopStyle,
        moved: c.transform,
      };
    });
    expect(seen.text, "the label is the text you typed").toBe("Book a place");
    expect(seen.color).toBe("rgb(16, 32, 48)");
    expect(seen.background).toBe("rgb(240, 224, 208)");
    expect(seen.font).toContain("Georgia");
    expect(parseFloat(seen.size), "size is stored in rem so it scales with the base size").toBeGreaterThan(16);
    expect(seen.weight).toBe("800");
    expect(parseFloat(seen.spacing)).toBeGreaterThan(0);
    expect(seen.transform).toBe("uppercase");
    expect(parseFloat(seen.radius), "a pill").toBeGreaterThan(100);
    expect(seen.padding).toBe("14.4px 32px");
    expect(seen.border).toBe("2px solid");
    expect(seen.moved, "and it can be nudged anywhere inside the alert").not.toBe("none");
  });

  test("an action's Advanced CSS is applied, and cannot break out of the button", async ({ page }) => {
    await loadExport(page, alertWith({}, [{
      id: "a1", label: "Pay now",
      // The second and third declarations are the reason everything user-typed goes through the sanitiser:
      // a selector or an at-rule would escape this button and restyle the page.
      css: "box-shadow: 0 0.25rem 0.5rem rgba(0,0,0,.4); } body { display:none; @media print { color: red }",
    }]));
    const seen = await page.locator("#tgt .eu-alert__action").evaluate((n) => ({
      shadow: getComputedStyle(n).boxShadow,
      bodyVisible: getComputedStyle(document.body).display,
    }));
    expect(seen.shadow, "the declaration applies").not.toBe("none");
    expect(seen.bodyVisible, "and the escape attempt does not").not.toBe("none");
  });

  test("the CANVAS applies every LOOK AXIS, exactly as the export does", async ({ page }) => {
    // The builder renders alerts through its own React view so the text can be edited in place, and that view
    // had been quietly missing the axis classes: a fine-tuned alert looked right once published and plain while
    // you were editing it. Nothing catches that except comparing the two.
    const node = {
      id: "tgt", anchor: "tgt", type: "component", component: "alert", width: "fill",
      alertSeverity: "info", alertForm: "inline", variant: "--ticket",
      alertShape: "--pill", alertBorder: "--dashed", alertIconStyle: "--icon-circle",
      alertDensity: "--compact", alertEmphasis: "--strong-title", alertLayout: "--centred",
      items: [{ id: "i1", title: "Sports day", body: "Now on the 12th." }],
    };
    const expected = [
      "eu-alert--ticket", "eu-alert--pill", "eu-alert--dashed",
      "eu-alert--icon-circle", "eu-alert--compact", "eu-alert--strong-title", "eu-alert--centred",
    ];

    // EXPORT
    await loadExport(page, node);
    const exportClasses = (await page.locator("#tgt .eu-alert").getAttribute("class")) ?? "";
    for (const c of expected) expect(exportClasses, `export is missing ${c}`).toContain(c);
    const exportLook = await page.locator("#tgt .eu-alert").evaluate((n) => {
      const c = getComputedStyle(n);
      return [c.borderTopStyle, c.borderTopLeftRadius, c.padding, c.textAlign, c.alignItems].join("|");
    });

    // CANVAS
    await page.goto("/website/box-demo");
    await page.evaluate((n) => {
      const rid = () => "b" + Math.random().toString(36).slice(2, 9);
      const site = { pages: [{ id: "p1", name: "Home", path: "/", root: { id: "root", type: "container", direction: "column", children: [
        { id: rid(), type: "container", direction: "row", rowBand: true, width: "fill", children: [n] },
      ] } }], homeId: "p1" };
      localStorage.setItem("educo_box_site_v1", JSON.stringify(site));
      localStorage.setItem("educo_box_site_cleaned_v1", "1");
    }, node);
    await page.reload();
    // Wait for the BUILDER first, then for the alert inside it. A single wait on the alert conflates two very
    // different things — "the dev server has not finished serving the page yet" and "the alert rendered but
    // without its axis classes" — and it made this test time out once in a full invariants run, where it sits
    // eight minutes deep and the server is under load. Staging the wait removes the race and makes a genuine
    // failure say which half broke.
    await page.waitForSelector('[data-box-id="root"]', { timeout: 30000 });
    await page.waitForSelector('[data-box-id="tgt"] .eu-alert', { timeout: 20000 });
    const canvasClasses = (await page.locator('[data-box-id="tgt"] .eu-alert').getAttribute("class")) ?? "";
    for (const c of expected) expect(canvasClasses, `the CANVAS is missing ${c}`).toContain(c);

    const canvasLook = await page.locator('[data-box-id="tgt"] .eu-alert').evaluate((n) => {
      const c = getComputedStyle(n);
      return [c.borderTopStyle, c.borderTopLeftRadius, c.padding, c.textAlign, c.alignItems].join("|");
    });
    // Classes matching is not enough — what matters is that they RESOLVE to the same rendering.
    expect(canvasLook, "the builder must render what the site will").toBe(exportLook);
  });

  test("the CANVAS shows the same actions as the export — canvas = export", async ({ page }) => {
    await page.goto("/website/box-demo");
    await page.evaluate((n) => {
      const rid = () => "b" + Math.random().toString(36).slice(2, 9);
      const site = { pages: [{ id: "p1", name: "Home", path: "/", root: { id: "root", type: "container", direction: "column", children: [
        { id: rid(), type: "container", direction: "row", rowBand: true, width: "fill", children: [n] },
      ] } }], homeId: "p1" };
      localStorage.setItem("educo_box_site_v1", JSON.stringify(site));
      localStorage.setItem("educo_box_site_cleaned_v1", "1");
    }, alertWith({}, [{ id: "a1", label: "Read the letter", href: "#letter" }, { id: "a2", label: "Dismiss" }]));
    await page.reload();
    await page.waitForSelector('[data-box-id="tgt"] .eu-alert__action', { timeout: 20000 });
    const onCanvas = await page.locator('[data-box-id="tgt"] .eu-alert__action').allTextContents();
    expect(onCanvas).toEqual(["Read the letter", "Dismiss"]);
  });
});
