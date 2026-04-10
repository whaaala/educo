# Theme Guide

## Available Themes (defined in `lib/theme-config.ts`)
- **Light**: default, no CSS class
- **Dark**: `dark` class — bg `#0f1115`, text light
- **Midnight**: `dark midnight` classes — bg `#0a0e27`, cyan accents
- **Purple**: `dark purple` classes — bg `#1a0b2e`, pink accents
- More themes may be added — always check `lib/theme-config.ts` for the current list
- When adding a new theme: add to `theme-config.ts`, add `@variant` in `globals.css`, add variant classes to all components

## Color Mapping

| Element | Light | Dark | Midnight | Purple |
|---------|-------|------|----------|--------|
| Page bg | `bg-white` | `dark:bg-[#0f1115]` | `midnight:bg-[#0a0e27]` | `purple:bg-[#1a0b2e]` |
| Card bg | `bg-gray-50` | `dark:bg-[#1a1d24]` | `midnight:bg-[#0f1330]` | `purple:bg-[#251340]` |
| Hover | `hover:bg-gray-100` | `dark:hover:bg-[#22262e]` | `midnight:hover:bg-cyan-500/10` | `purple:hover:bg-pink-500/10` |
| Text | `text-gray-700` | `dark:text-gray-200` | `midnight:text-cyan-100` | `purple:text-pink-100` |
| Muted text | `text-gray-500` | `dark:text-gray-400` | `midnight:text-cyan-300` | `purple:text-pink-300` |
| Border | `border-gray-200` | `dark:border-gray-700` | `midnight:border-cyan-500/20` | `purple:border-pink-500/20` |
| Primary btn | `bg-blue-600 text-white` | `dark:bg-[#1a1d24] dark:text-gray-100 dark:border dark:border-gray-700` | `midnight:bg-cyan-500/15 midnight:text-cyan-400 midnight:border midnight:border-cyan-500/30` | `purple:bg-pink-500/15 purple:text-pink-400 purple:border purple:border-pink-500/30` |

## Rules
- Every `dark:` class MUST have `midnight:` and `purple:` variants
- NO hardcoded hex colors — use Tailwind theme classes
- Use `scripts/add-theme-variants.js <file>` to bulk-add missing variants
- Test in all available themes before reporting done
- Buttons use `Button` component (already themed) — never hardcode button styles

## CSS Setup (globals.css)
```css
@variant dark (&:where(.dark, .dark *));
@variant midnight (&:where(.midnight, .midnight *));
@variant purple (&:where(.purple, .purple *));
```
