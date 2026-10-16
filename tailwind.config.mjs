// Tailwind's breakpoints and the sheet width, read from config/layout.json (RULE CFG — the user, 2026-10-16: nothing
// hard-coded). Loaded by `@config` in both globals.css, so a class names its line (`lg:`, `labels:`, `sheet:`) and the
// number lives only in the config. Guarded by tests/unit/layout-config.test.ts.
import { readFileSync } from "node:fs";

const LAYOUT = JSON.parse(readFileSync(new URL("./config/layout.json", import.meta.url), "utf8"));
const rem = (px) => `${px / 16}rem`;
const { editor, webApp } = LAYOUT;

const config = {
  theme: {
    extend: {
      screens: {
        ...Object.fromEntries(Object.entries(webApp.screens).map(([k, px]) => [k, rem(px)])),
        labels: rem(editor.labelsFrom), "labels-wide": rem(editor.labelsWideFrom), brand: rem(editor.brandFrom),
        sheet: rem(editor.sheetWidth),
      },
      maxWidth: { sheet: rem(editor.sheetWidth) },
      // the app shell's rail and sidebar (A-2 change 3)
      width: { rail: rem(LAYOUT.shell.railWidth), sidebar: rem(LAYOUT.shell.sidebarWidth), "list-pane": rem(LAYOUT.listDetail.listWidth) },
    },
  },
};

export default config;
