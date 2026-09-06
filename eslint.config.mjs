import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";
import { defineConfig, globalIgnores } from "eslint/config";

/**
 * `npm run lint` had never once run.
 *
 * This file imported `eslint-config-next/core-web-vitals` as a flat config, but the version installed here
 * (15.1.3) ships the LEGACY eslintrc shape — a plain object with `extends` — and no `exports` map, so the
 * import failed to resolve at all (ERR_MODULE_NOT_FOUND) and, once resolved, was not iterable. Both failures
 * happen before a single file is linted, so the command errored rather than reporting anything.
 *
 * `FlatCompat` is the bridge Next's own migration guide prescribes for exactly this pairing. It is used here
 * rather than upgrading `eslint-config-next`, because a dependency bump is a separate decision with its own
 * lockfile and rule-set churn.
 */
const compat = new FlatCompat({ baseDirectory: dirname(fileURLToPath(import.meta.url)) });

const eslintConfig = defineConfig([
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // A leading underscore is this codebase's existing way of saying "deliberately discarded" — as in
      // `const { id: _id, type: _type, ...patch } = node`, which is the only way to omit required keys from
      // an object. Without this the rule reports the convention itself as an error.
      "@typescript-eslint/no-unused-vars": ["error", {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
        destructuredArrayIgnorePattern: "^_",
        ignoreRestSiblings: true,
      }],
    },
  },
  {
    // ── Rules relaxed deliberately, each with its reason ──
    // The bar for anything here (RULE W): the rule must be WRONG about this codebase — not merely
    // inconvenient, and never "there are too many of them".
    rules: {
      // WRONG HERE. The rule's advice is to use `next/image`. Almost every <img> in this app renders a
      // user-supplied photo — a pupil's avatar, a staff portrait, a file thumbnail, a builder upload — with a
      // src that is a data: URL or an arbitrary remote URL. next/image needs each host declared in
      // `images.remotePatterns` and bills per optimisation, neither of which fits a school uploading its own
      // photographs. Revisit when images are served from a known pipeline: that is the same decision that is
      // currently blocking srcset in the website builder's export.
      "@next/next/no-img-element": "off",

      // NOT relaxed — listed here so nobody assumes it is. `no-explicit-any` is an ERROR everywhere (it comes
      // in at that level from next/typescript). The repo carried 227 of them; they are now all typed, which
      // means the count can only ever go up by someone adding one deliberately, and the build will say so.
      // If a value genuinely is not knowable, `unknown` is the answer — it forces the check that `any` skips.
    },
  },
  {
    // ── React Native is not the DOM ──
    // apps/mobile is an Expo / React Native app. Its `<Image>` comes from `react-native` and has no `alt`
    // (accessibility there is `accessibilityLabel`), and the whole `@next/next/*` ruleset is about a framework
    // this app does not use. These rules do not describe a defect here, so they are off — narrowly, for this
    // app only. Native accessibility still matters; the tool for it is eslint-plugin-react-native-a11y, which
    // is a separate decision, not something jsx-a11y was ever going to cover.
    files: ["apps/mobile/**"],
    rules: {
      "jsx-a11y/alt-text": "off",
      "@next/next/no-img-element": "off",
      "@next/next/no-html-link-for-pages": "off",
      "@next/next/no-page-custom-font": "off",
    },
  },
  {
    // ── Node CommonJS tooling ──
    // Build scripts, Metro and Tailwind configs run in Node as CommonJS. `require` is not a legacy import
    // there, it is the module system, and `import` would not work at all.
    files: ["scripts/**", "**/*.cjs", "**/*.config.js", "**/*.config.cjs"],
    rules: { "@typescript-eslint/no-require-imports": "off" },
  },
  {
    // ── Tests ──
    // Tests reach for Node's own modules (`require("fs")` to read a source file and assert on it) and for
    // lazily-required mocks inside factories, where a top-level import would run in every environment.
    files: ["tests/**", "**/__tests__/**", "**/*.test.ts", "**/*.test.tsx", "**/*.spec.ts", "**/*.spec.tsx"],
    rules: { "@typescript-eslint/no-require-imports": "off" },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // …but the workspace apps build into their OWN .next, which the patterns above do not reach. Linting
    // build output is meaningless — it is minified vendor polyfills and generated route types, not code
    // anyone writes — and it was contributing well over a third of the repo's reported errors, which is how
    // 4,755 "problems" hid the handful of real ones.
    "**/.next/**",
    "**/dist/**",
    "**/out/**",
    "**/build/**",
    "**/coverage/**",
    "**/*.tsbuildinfo",
    // Test and tooling OUTPUT, not sources.
    "playwright-report/**",
    "test-results/**",
    ".playwright-mcp/**",
    // Generated code — regenerate it, do not hand-edit it, and do not lint it. `npm run gen:icons` and
    // `npm run gen:photos` own these files.
    "**/*.generated.ts",
  ]),
]);

export default eslintConfig;
