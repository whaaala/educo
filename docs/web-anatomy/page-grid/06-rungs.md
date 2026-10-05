# Page grid · what a desktop row does on a tablet and a phone (R-3, gap G10)

Source: 300 crawled pages (shuffled from the 4,243 in `docs/layout-benchmark/`), re-measured at 768 and 375 by
`scripts/research/skeleton.js --widths=768,375 --limit=300 --jobs=6 --headed` (14 min, 0 failed), compared with the
same pages' 1440 skeletons by `node scripts/research/grid-rungs.js`. Each section of a page is paired in order across
the three widths; its "across" is the first row / grid at its top level, else the widest row inside it.

## Results (all 300 pages)

| Desktop row | Sections | TABLET 768: keeps · fewer · stacks | PHONE 375: keeps · fewer · stacks |
|---|---|---|---|
| 2 across | 519 | 59% · — · 28% | 45% · — · 48% |
| 3 across | 246 | 25% · 45% · 23% | 15% · 39% · 41% |
| 4 across | 106 | 19% · 42% · 32% | 13% · 47% · 38% |
| 5+ across | 80 | 30% · 44% · 20% | 18% · 61% · 21% |

The remainder of each row (to 100%) are sections measured WIDER at the smaller size — menus and small parts the
skeleton reads differently; not a layout behaviour.

**Saturated:** the shares after 100 / 200 / 300 pages moved by at most ≈ 5 points between 200 and 300 (e.g. 2 across on
the phone: keeps 42 → 47 → 45%; 4 across on the phone: fewer 52 → 46 → 47%).

## What it means

1. **Tablets keep the split or go to fewer across** (2 across keeps 59%; 3+ across → fewer ≈ 45%). Matches the tablet
   rung (12 columns from 600 px, splits by ratio, the content minimum re-splitting a row that no longer fits).
2. **Phones do NOT simply stack.** Rows of 4 and 5+ go to FEWER across (mostly 2) 47–61% of the time, more often than
   they stack (38% / 21%). Rows of 3: fewer 39% · stack 41%. Rows of 2: keep 45% · stack 48%.
3. **Caution:** the measure counts every side-by-side row inside a section — a pair of buttons, an icon beside a line,
   a label beside a value — which stay side by side on any phone. So "keeps 2 across" overstates whole page rows; the
   "fewer across" of 4 / 5+ rows (cards, logos, stats, galleries) is the solid signal.
4. **The rule real sites follow is the engine's re-split** (proven in `examples/combos.html`, ledger #28): a row that
   cannot keep its shares becomes the most EQUAL columns whose words still fit — 4 → 2 → 1 — never a staircase.
   Evidence for revisiting the phone default (Q2) — put to the user.
