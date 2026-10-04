# Page grid · what 4,250 real pages split their rows into (R-3)

Source: the stored crawl, `docs/layout-benchmark/pages.tsv` (4,250 pages of awwwards, Webflow, Framer, One Page Love and
school sites, measured at 1440 px). Its `layout` field records every row and grid with the widths of its parts, e.g.
`inset|stack2{·,row2[55/25]} > full|grid3[33/33/33]`. Script: `node scripts/research/grid-splits.js` (re-runnable).

Method: every row / grid with widths (23,728 of them) is normalised so its parts fill the row (what is left is the gap),
then each part is expressed in twelfths and rounded to the nearest half.

## Results

- **Sections:** 6,399 full-width · 8,032 inset (a container) — both are common, so the page grid must serve both.
- **Parts per row:** 2 → 15,207 · 3 → 4,713 · 4 → 1,958 · 5 → 637 · 6 → 366 · 7 → 191 · 8 → 194 · more is rare.
- **Fit** (every part of the row on the step):

  | Grid | Rows that land on it |
  |---|---|
  | whole 12ths | **66.1%** |
  | half 12ths (24 tracks) | 66.3% |
  | 6 columns | 42.8% |
  | 8 columns | 38.3% |
  | 4 columns | 36.0% |

- **The 80/20:** 1,436 distinct splits; **32 of them cover 80%** of all rows.

  | Split (12ths) | Rows | Share | Running |
  |---|---|---|---|
  | 6 + 6 | 4,919 | 20.7% | 20.7% |
  | 4 + 4 + 4 | 2,320 | 9.8% | 30.5% |
  | 3 + 3 + 3 + 3 | 1,058 | 4.5% | 35.0% |
  | 5.5 + 6.5 · 6.5 + 5.5 | 1,630 | 6.9% | |
  | 5 + 7 · 7 + 5 | 1,591 | 6.7% | |
  | 4 + 8 · 8 + 4 | 1,579 | 6.6% | |
  | 3 + 9 · 9 + 3 | 1,049 | 4.4% | |
  | 4.5 + 7.5 · 7.5 + 4.5 | 804 | 3.4% | |
  | 3.5 + 8.5 · 8.5 + 3.5 | 730 | 3.1% | |
  | 2 + 10 · 10 + 2 | 590 | 2.5% | |
  | 1 + 11 · 11 + 1 · 0.5 + 11.5 · 11.5 + 0.5 · 1.5 + 10.5 · 10.5 + 1.5 | 1,498 | 6.3% | |
  | 2.5 + 9.5 · 9.5 + 2.5 | 567 | 2.4% | |
  | 5 × 2.4 (five across) | 191 | 0.8% | |
  | 6 × 2 | 136 | 0.6% | |
  | 3 + 6 + 3 | 96 | 0.4% | |
  | 8 × 1.5 (eight across) | 79 | 0.3% | |

## What it means for the page grid

1. **Twelve is right on desktop.** Two thirds of real rows land exactly on whole twelfths; nothing else comes close.
   Half-steps add almost nothing at this rounding (66.1 → 66.3%) — the "off" rows are not on half-steps either.
2. **Six splits are the core:** 6+6, 4+4+4, 3+3+3+3, 4+8 / 8+4, 5+7 / 7+5, 3+9 / 9+3 — ≈ 57% of all rows. These are the
   one-click choices. They match the Dribbble designs (`03`) and the builders (`01`).
3. **The "≈ half" splits (5.5 + 6.5, 4.5 + 7.5, 3.5 + 8.5…) are 13%.** They are content-sized rows — a picture beside words
   where the words take what is left — not a deliberate half-column. CONTENT DECIDES THE SPAN covers them: the builder
   rounds them to the nearest whole column; the measurement shows no need to store halves for them.
4. **The thin side splits (1 + 11, 0.5 + 11.5, 2 + 10…) are 9%.** Almost all are an icon, a number or a bullet beside a
   line of words — a component's INSIDE, not page layout. They belong to the component (flex), not to the page grid.
5. **8 and 4 columns do NOT describe desktop pages** (38% / 36%). They are only right as the rungs where a desktop split
   is re-laid: on 8, 6+6 → 4+4 and 3+3+3+3 → 2+2+2+2 are exact; 4+4+4 is not (2.67) — it becomes 2 across + 1 or keeps
   its own equal columns. On 4, everything stacks or goes 2 across. This is the open question for the user in `04`.
6. **Limits of this measure:** widths were taken at 1440 only (no tablet / phone splits in the crawl); a row's gap is
   folded into its parts; nested rows are counted like page rows (point 4). The per-rung behaviour comes from `02` / `03`.
