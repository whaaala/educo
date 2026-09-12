import type { Page } from "@playwright/test";

/**
 * SEEDING THE BUILDER, without a race.
 *
 * Twenty specs each hand-rolled the same three steps: open `/website/box-demo`, write a site into
 * `localStorage` with `page.evaluate`, then `reload`. That sequence is a race, and it is the kind that hides
 * for a long time because the slower server wins it.
 *
 * The builder writes a STARTER document to `educo_box_site_v1` as soon as it mounts and finds nothing there.
 * Against `next dev` the page is slow enough that it had always mounted before `goto` returned, so the seed
 * was written afterwards and won. Against `next start` the load event fires first, so the order inverted: the
 * seed landed, the app then mounted, read the storage it had queued before the seed existed, found nothing,
 * and saved its starter straight over the top. The reload showed an empty canvas and every test died waiting
 * for a box that was never going to appear. Running four workers widens the same window on dev too, which is
 * why the layout invariants had to be forced serial and were blamed on the dev server's throughput.
 *
 * `addInitScript` closes the window: it runs before the page's own scripts, so storage is already populated
 * the first time the builder looks. No reload is needed either, which removes a whole page load per seed.
 *
 * SEEDS ONCE EACH, deliberately. An init script runs on EVERY navigation and they accumulate, which pulls in
 * two opposite directions:
 *   • several specs RELOAD to prove that what the user did survives a refresh. Re-running the seed there
 *     would wipe exactly the state under test.
 *   • a few specs seed TWICE in one test (narrow, then full width). The second seed must win.
 *
 * A plain "already seeded this tab" flag satisfies the first and breaks the second — it made the second seed
 * stand down and the test measure the first site twice. So each call carries a GENERATION, and a script acts
 * only when its own generation is higher than the last one applied: the newest seed always wins, an older
 * script never fires again behind it, and a plain reload runs neither. After its seed lands the page owns its
 * storage, exactly as it does for a real user.
 */

export const BUILDER_PATH = "/website/box-demo";

const SITE_KEY = "educo_box_site_v1";
const CLEANED_KEY = "educo_box_site_cleaned_v1";
const LEGACY_KEY = "educo_box_demo_v9";
const GEN_KEY = "educo_test_seed_generation";

/** How many times this page has been seeded — see the generation rule above. Per Page, so tests cannot collide. */
const generations = new WeakMap<Page, number>();
const nextGeneration = (page: Page) => {
  const n = (generations.get(page) ?? 0) + 1;
  generations.set(page, n);
  return n;
};

/**
 * Install `site` as the builder's saved document, then open the builder.
 *
 * Pass `path` to land somewhere else that reads the same storage — the preview and the export both do.
 * Nothing is awaited beyond the navigation: what counts as "ready" differs per spec, so each one keeps its
 * own wait rather than inheriting a guess made here.
 */
export async function seedSite(page: Page, site: unknown, path: string = BUILDER_PATH) {
  await page.addInitScript(
    ({ site, gen, keys }) => {
      // Strictly greater: an older seed never fires again behind a newer one, and a plain reload fires none.
      if (gen <= Number(sessionStorage.getItem(keys.gen) ?? 0)) return;
      sessionStorage.setItem(keys.gen, String(gen));
      localStorage.setItem(keys.site, JSON.stringify(site));
      localStorage.setItem(keys.cleaned, "1"); // skip the one-time prune, which would rewrite the seeded tree
      localStorage.removeItem(keys.legacy); // only read when the modern key is absent, but leave nothing to chance
    },
    { site, gen: nextGeneration(page), keys: { site: SITE_KEY, cleaned: CLEANED_KEY, legacy: LEGACY_KEY, gen: GEN_KEY } },
  );
  await page.goto(path);
}

/**
 * Open the builder with NOTHING saved, so it draws its own starter — the state a first-time user meets.
 *
 * Same reasoning as `seedSite`, in reverse: clearing storage from an already-open page and reloading races
 * the app's own first save, so on a fast server the clear could land before the app had even written the
 * document being cleared. Wiping before any script runs cannot lose that race, and saves a page load.
 */
export async function clearSite(page: Page, path: string = BUILDER_PATH) {
  await page.addInitScript(
    ({ gen, keys }) => {
      if (gen <= Number(sessionStorage.getItem(keys.gen) ?? 0)) return;
      sessionStorage.setItem(keys.gen, String(gen)); // a separate store, so `clear()` below cannot take it
      localStorage.clear();
      localStorage.setItem(keys.cleaned, "1");
    },
    { gen: nextGeneration(page), keys: { cleaned: CLEANED_KEY, gen: GEN_KEY } },
  );
  await page.goto(path);
}

/** The usual shape: one full-width band on the home page, holding `children`. */
export function sitePage(children: unknown[], rootExtras: Record<string, unknown> = {}) {
  return {
    pages: [
      {
        id: "p1",
        name: "Home",
        path: "/",
        root: {
          id: "root",
          type: "container",
          direction: "column",
          padding: 0,
          gap: 0,
          ...rootExtras,
          children: [
            { id: "band", type: "container", direction: "row", rowBand: true, width: "fill", gap: 0, padding: 0, children },
          ],
        },
      },
    ],
    homeId: "p1",
  };
}
