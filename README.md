# Creative Inkers — redesign prototype

Static HTML/CSS/JS prototype of the full ALPHA redesign for creativeinkers.com,
built from the 13 Stitch mockups (Desktop, 31 Aug 2026) with the drift corrected
back to the design system.

## Run

```bash
python3 -m http.server 4870 -d ~/StudioProjects/creative-inkers
```

Or via the Claude Code preview: server name `creative-inkers`, port 4870.

## Pages

| File | Screen |
|---|---|
| index.html | Homepage |
| category.html | Category / browse with filter rail |
| product.html | Product detail (3-view viewer incl. print-size drawing) |
| bundles.html | Vaults + All-Access + build-your-own-5 |
| checkout.html | 4-field digital checkout (chrome-stripped, own header by design) |
| order-complete.html | Download screen |
| library.html | Account file library |
| licence.html | Plain-English licence + tiers + seller FAQ |
| search.html / zero-results.html | Search states |
| learn.html | Content stub |

## Honest status

- **REAL**: layout, design system (assets/css/system.css), responsive behaviour,
  viewer tabs, filter/chip interactions, bundle price math, cart count + toasts
  (localStorage only).
- **MOCKED**: cart/checkout (no payment), downloads (no files), search, email
  capture, membership billing. Every inert form says so when submitted.
- **PLACEHOLDER**: all 8 design artworks (assets/img/designs/*.svg — authored
  stand-ins, NOT client artwork); all prices; licence terms (tiers, 500-unit
  limit, 14-day refund); "Printed by buyers" quotes and shop names are invented
  and labelled as mockups on-page; catalog counts beyond the real 215 total.
- **DECISIONS THE CLIENT STILL OWNS**: licence wording, pricing, drop cadence
  (page says 12/month minimum), refund policy, keep-after-cancel promise.

## Spacing system

8pt grid throughout. Tokens in `:root`: 4 (half-step) / 8 / 16 / 24 / 40 / 64 / 104.
Every padding, margin, gap and control height is a multiple of 8 (4 for
hairline-adjacent nudges). Exempt by design: type sizes, 1-2px rules, the 13px
registration crosshair, and drawn glyphs (check marks, select arrows).
Touch targets: 48px on coarse pointers, 40px minimum on desktop.

Safe areas: every page meta sets `viewport-fit=cover`; `--safe-t/r/b/l` tokens
wrap `env(safe-area-inset-*)`. `.wrap`/`.wrap-narrow` add the side insets, and
the fixed bars (buy bar, cookie bar, toast) add the bottom inset. Verified by
inspection — env() resolves to 0 in the desktop preview, so test on a notched
device before shipping.

## Review log & handoff notes

The build has been through four independent review lenses (2026-08-31):
no-ai-slop-ui, a premium-UX + forensic pass, AccessLint WCAG 2.2 (checkout
scanned+fixed; product/category still to sample), and the Vercel Web Interface
Guidelines. Deliberate divergences, kept on purpose: mono-uppercase buttons
(design system, not Title Case) and mechanical-only motion.

Removed by design-audit reduction filter, not forgotten: the library page's
sort control and grid/list toggle. They were dead decoration at 8 mock items;
if the real library grows into hundreds of files they return as WORKING
controls, specced in the build.

Still open, needs a human or the client:
- Device pass on a real iPhone: safe areas, keyboard, screen reader, 200% zoom.
- Client artwork + real customer photos replace all placeholder SVGs/mockups.
- Official Apple Pay / Google Pay button assets before payments go live
  (branding specs are mandatory; the styled stand-ins are pitch-only).
- Licence terms, prices, unit limits, refund window: business decisions,
  placeholders throughout are labelled.

## Editing

Shared header/footer live in `_build/partials.sh`; page bodies in
`_build/body-*.html`, page styles in `_build/head-*.html`. Rebuild a page with:

```bash
cd ~/StudioProjects/creative-inkers && source _build/partials.sh && \
emit_page "<title>" "<desc>" <designs|bundles|licence|learn|none> \
  _build/body-index.html index.html "$(cat _build/head-index.html)"
```

checkout.html is standalone (edit directly) — it strips site chrome on purpose.
