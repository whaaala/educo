/**
 * THE SCREENS THE PREVIEW CAN BE SET TO — one list, read by the builder AND by the guards.
 *
 * It lives here rather than inside the page so a test can ENUMERATE it: "everything works on every model"
 * has to be checked against the same list the person is choosing from, or the two drift and the promise
 * becomes a hope. The corner-radius guard works the same way, for the same reason.
 *
 * ── THE PREVIEW'S OWN SIZE LIST — named screens, the way a browser's device mode offers them.
 *
 * The icon row this replaces could only ever say "Tablet". A person checking their school's site wants to
 * know it works on the phone in their pocket, and "768px" is not an answer to that question — "iPad Mini" is.
 *
 * Both kinds are here, in that order, because they answer different questions. The FIRST group is this
 * project's own responsive ladder (see `DEVICE_RUNG`): one width sitting safely inside each rung, so stepping
 * down the group walks you through every layout the site can produce. The rest are real devices at their real
 * CSS-pixel sizes, for checking the one screen you actually care about.
 *
 * Heights are given too, and they matter: a hero built to be "one screen tall" is a different thing on a
 * 667px-tall iPhone SE than on a 1080px desktop, and a width-only preview could never show you that.
 */
/**
 * A device may share a size with one of this site's own rungs (Mobile is 375 × 812, so is an iPhone 13
 * mini). That is not a duplicate to remove: the rung answers "does my layout work at this step of the
 * ladder" and the device answers "does it work on the phone in my pocket". Within a group, no two entries
 * share a size, so the menu can never highlight the wrong name.
 */
export type Preset = { id: string; label: string; w: number; h: number };
export const PREVIEW_PRESETS: { group: string; items: Preset[] }[] = [
  {
    group: "This site's screen sizes",
    items: [
      { id: "rung-mobile", label: "Mobile — 375 × 812", w: 375, h: 812 },
      { id: "rung-tablet", label: "Tablet — 768 × 1024", w: 768, h: 1024 },
      { id: "rung-laptop", label: "Laptop — 1024 × 768", w: 1024, h: 768 },
      { id: "rung-desktop", label: "Desktop — 1280 × 800", w: 1280, h: 800 },
      { id: "rung-wide", label: "Wide — 1920 × 1080", w: 1920, h: 1080 },
    ],
  },
  /**
   * THE REAL CATALOGUE — every size in CSS (logical) pixels, which is what a stylesheet actually meets.
   *
   * Asked for directly: "get me all the models you can find… mobile, tablets, laptops and monitors… and make
   * sure everything works in all of them". These are looked up rather than guessed, because a device list
   * that is approximately right is worse than none: it says a layout was checked on an iPhone 16 when the
   * width it used belonged to nothing.
   *
   * Sources: screensizechecker.com (iPhone · Android · iPad viewport charts, 2026), BrowserStack and
   * Statcounter for the desktop/laptop resolutions people actually browse at. Portrait for anything held in
   * a hand, landscape for anything on a desk — and the Rotate button covers the other way round.
   */
  {
    group: "iPhone",
    items: [
      { id: "iphone-5-se1", label: "iPhone 5 · SE (1st gen) — 320 × 568", w: 320, h: 568 },
      { id: "iphone-se-3", label: "iPhone SE (3rd gen) — 375 × 667", w: 375, h: 667 },
      { id: "iphone-xr-11", label: "iPhone XR · 11 — 414 × 896", w: 414, h: 896 },
      { id: "iphone-13-mini", label: "iPhone 13 mini · 12 mini — 375 × 812", w: 375, h: 812 },
      { id: "iphone-16", label: "iPhone 14 · 15 · 16 · 16e — 390 × 844", w: 390, h: 844 },
      { id: "iphone-16-pro", label: "iPhone 16 Pro — 393 × 852", w: 393, h: 852 },
      { id: "iphone-17", label: "iPhone 17 · 17 Pro — 402 × 874", w: 402, h: 874 },
      { id: "iphone-17-air", label: "iPhone 17 Air — 420 × 912", w: 420, h: 912 },
      { id: "iphone-16-plus", label: "iPhone 15 · 16 Plus — 428 × 926", w: 428, h: 926 },
      { id: "iphone-16-pro-max", label: "iPhone 15 · 16 Pro Max — 430 × 932", w: 430, h: 932 },
      { id: "iphone-17-pro-max", label: "iPhone 17 Pro Max — 440 × 956", w: 440, h: 956 },
    ],
  },
  {
    group: "Android phones",
    items: [
      { id: "galaxy-s25", label: "Galaxy S23 · S24 · S25 — 360 × 780", w: 360, h: 780 },
      { id: "galaxy-a55", label: "Galaxy A55 — 360 × 800", w: 360, h: 800 },
      { id: "galaxy-s23-plus", label: "Galaxy S21 · S23+ — 384 × 854", w: 384, h: 854 },
      { id: "oppo-find-x8", label: "OPPO Find X8 Pro — 395 × 869", w: 395, h: 869 },
      { id: "pixel-9-pro", label: "Pixel 9 · 10 Pro — 410 × 914", w: 410, h: 914 },
      { id: "galaxy-s25-ultra", label: "Galaxy S24 · S25 Ultra — 412 × 891", w: 412, h: 891 },
      { id: "pixel-8", label: "Pixel 6 · 7 · 8 — 412 × 915", w: 412, h: 915 },
      { id: "pixel-9", label: "Pixel 9 · 10 — 412 × 923", w: 412, h: 923 },
      { id: "pixel-9-pro-xl", label: "Pixel 9 · 10 Pro XL — 414 × 921", w: 414, h: 921 },
      { id: "vivo-x200-pro", label: "vivo X200 Pro — 394 × 875", w: 394, h: 875 },
      { id: "honor-magic7", label: "Honor Magic7 Pro — 400 × 875", w: 400, h: 875 },
      { id: "huawei-mate70", label: "Huawei Mate 70 Pro — 411 × 885", w: 411, h: 885 },
      { id: "xiaomi-15-pro", label: "Xiaomi 15 Pro — 412 × 914", w: 412, h: 914 },
    ],
  },
  {
    group: "Foldables",
    items: [
      { id: "fold-6-closed", label: "Galaxy Z Fold 6 — folded, 323 × 792", w: 323, h: 792 },
      { id: "flip-6", label: "Galaxy Z Flip 6 — 393 × 960", w: 393, h: 960 },
      { id: "fold-6-open", label: "Galaxy Z Fold 6 — open, 619 × 720", w: 619, h: 720 },
      { id: "pixel-fold-open", label: "Pixel 10 Pro Fold — open, 692 × 717", w: 692, h: 717 },
    ],
  },
  {
    group: "Tablets",
    items: [
      { id: "ipad-mini-a17", label: "iPad mini (A17 Pro) — 744 × 1133", w: 744, h: 1133 },
      { id: "ipad-mini-2019", label: "iPad mini (2019) · iPad 6 — 768 × 1024", w: 768, h: 1024 },
      { id: "galaxy-tab-s9", label: "Galaxy Tab S9 · A9+ · Pixel Tablet · Fire HD 10 — 800 × 1280", w: 800, h: 1280 },
      { id: "galaxy-tab-s6-lite", label: "Galaxy Tab S6 Lite · Lenovo Tab P11 — 800 × 1333", w: 800, h: 1333 },
      { id: "galaxy-tab-s10-plus", label: "Galaxy Tab S9+ · S10+ — 876 × 1400", w: 876, h: 1400 },
      { id: "xiaomi-pad-6", label: "Xiaomi Pad 6 — 900 × 1440", w: 900, h: 1440 },
      { id: "galaxy-tab-ultra", label: "Galaxy Tab S9 · S10 Ultra — 924 × 1480", w: 924, h: 1480 },
      { id: "ipad-9", label: "iPad (9th gen) — 810 × 1080", w: 810, h: 1080 },
      { id: "ipad-air-11", label: "iPad Air 11″ · iPad (A16) — 820 × 1180", w: 820, h: 1180 },
      { id: "ipad-pro-11", label: "iPad Pro 11″ (M4) — 834 × 1210", w: 834, h: 1210 },
      { id: "ipad-air-13", label: "iPad Air 13″ · Pro 12.9″ — 1024 × 1366", w: 1024, h: 1366 },
      { id: "ipad-pro-13", label: "iPad Pro 13″ (M4) — 1032 × 1376", w: 1032, h: 1376 },
      { id: "surface-pro-11", label: "Surface Pro 11 — 1440 × 960", w: 1440, h: 960 },
    ],
  },
  {
    group: "Laptops",
    items: [
      { id: "laptop-1280", label: "Small laptop — 1280 × 720", w: 1280, h: 720 },
      { id: "laptop-1366", label: "Windows laptop — 1366 × 768", w: 1366, h: 768 },
      { id: "laptop-1440-900", label: "MacBook Air (M1) · mid monitor — 1440 × 900", w: 1440, h: 900 },
      { id: "macbook-air-13", label: 'MacBook Air 13" — 1280 × 832', w: 1280, h: 832 },
      { id: "laptop-1536", label: "Windows laptop at 125% — 1536 × 864", w: 1536, h: 864 },
      { id: "surface-laptop", label: "Surface Laptop — 1500 × 1000", w: 1500, h: 1000 },
      { id: "macbook-pro-14", label: 'MacBook Pro 14" — 1512 × 982', w: 1512, h: 982 },
      { id: "macbook-pro-16", label: 'MacBook Pro 16" — 1728 × 1117', w: 1728, h: 1117 },
    ],
  },
  {
    group: "Monitors",
    items: [
      { id: "monitor-1600", label: "HD+ — 1600 × 900", w: 1600, h: 900 },
      { id: "monitor-1680", label: "16:10 — 1680 × 1050", w: 1680, h: 1050 },
      { id: "monitor-1080", label: "1080p — 1920 × 1080", w: 1920, h: 1080 },
      { id: "monitor-1920-1200", label: "16:10 — 1920 × 1200", w: 1920, h: 1200 },
      { id: "monitor-1440", label: "1440p — 2560 × 1440", w: 2560, h: 1440 },
      { id: "monitor-2560-1600", label: "16:10 QHD+ — 2560 × 1600", w: 2560, h: 1600 },
      { id: "monitor-ultrawide", label: "Ultrawide 21:9 — 3440 × 1440", w: 3440, h: 1440 },
      { id: "monitor-4k", label: "4K — 3840 × 2160", w: 3840, h: 2160 },
      { id: "monitor-super", label: "Super ultrawide 32:9 — 5120 × 1440", w: 5120, h: 1440 },
    ],
  },
];
export const PRESETS_FLAT: Preset[] = PREVIEW_PRESETS.flatMap((g) => g.items);
