# Developing countries first — Africa facing, world ready (RULE AF)

Decided by the user on 2026-09-28: the builder, and everything built with it, is made first for Nigeria, Ghana and the rest
of Africa, and for developing countries generally — and works everywhere else as a consequence. This file holds the
reasoning and the measurable targets; `CLAUDE.md` (RULE AF) holds the rule every change is checked against.

## Why it changes the design, not only the marketing

- Most visitors are on low-cost Android phones (360px wide screens, 2–4 GB of memory, older browsers), on 3G or a throttled
  4G, paying for data by the megabyte. A page that is light, fluid and readable at 360px is worth more than a prettier canvas.
- Schools, clinics, churches, small businesses and local government mostly have no site, or a dead social page. A correct,
  accessible site without a developer removes a real barrier; a site that also takes enquiries and payments is a product.
- Power and connectivity drop. A page — and later the app — must open with no signal and finish a form when the signal returns.

## The rules, each measurable

1. **Weight budget, measured by the sweep at every rung.** Per published page: HTML + CSS + JS ≤ 100 KB compressed;
   first view on a 360px phone ≤ 500 KB with images; every image resized to the width it is shown at, `width`/`height`
   set, lazy below the fold; at most two font families, subset, `font-display: swap`; nothing loaded that is not used.
   The page report prints the numbers; a page over budget is a finding.
2. **Slow network is a test profile.** Every browser suite that opens a Preview also runs once under a Slow-3G profile;
   the page must render its first band within 5 s and stay usable.
3. **Low-cost devices are in the device list.** Tecno, Infinix, itel and Samsung A-series screen sizes (360 × 640 up to
   393 × 851) sit beside the iPhones and iPads in the Preview and in every sweep.
4. **Offline first, for the app side.** A service worker caches published pages and assets; a form queues when the network
   drops and sends when it returns, telling the person which it did. Term dates and fees open with no signal.
5. **Payments and messaging people use.** Paystack and Flutterwave (cards, bank transfer, mobile money) before Stripe;
   WhatsApp and SMS links before email as the contact channel; phone numbers formatted for the country.
6. **Cheap to host, cheap to own.** Static export to free or near-free hosts; `.ng` / `.com.gh` and other local domains in
   the flow; plans that work on prepaid money, not only a monthly card.
7. **Languages are content, not an afterthought.** English first; every page and every component supports a second
   language version (Yoruba, Hausa, Igbo, Twi, Ga, Ewe, Swahili, French, Arabic, Portuguese…) with `lang` set per page and
   per block, right-to-left where the language needs it, and the same semantic and design rules applied to each. The
   builder's own interface is translatable the same way.
8. **Templates from the region.** The template library draws real Nigerian and Ghanaian schools, businesses and public
   bodies beside the awwwards catalogue, so the personalities and copy fit.
9. **Distribution through the people who already serve these institutions** — school-management vendors, parent groups,
   church networks — is planned as product work, not left to chance.

## How it lands

- Rules 1–3 are engine and harness rules, enforced by the page audit and the sweeps as soon as the weight audit is added
  (the next harness change after the tier-99 sweep). Rules 4–6 are the application layer, built on the same foundation.
  Rules 7–9 shape the templates, the components and the product plan.
- Every feature's definition of done asks: does it work on a 360px phone on 3G, does it cost data it need not, does it
  read in a second language, does it work with no signal — and the answer is measured, never assumed.
