# Mobile performance audit — 2026-10-04

## Scope and method

Baseline: commit `b014bfa`. Tests use the actual minified production bundles,
not the unminified development files. Lighthouse 13.5.0 runs in installed Chrome
against a local static server with gzip for HTML/CSS/JS. Mobile uses Lighthouse's
default simulated network/CPU throttling; desktop uses the settings in
`scripts/performance-audit.mjs`.

The homepage has three fresh-browser mobile runs before and after; values below
are medians. Desktop and menu results are single runs and less conclusive.
Machine load caused substantial variation. These local scores are **not directly
comparable to the reported live scores of 85 mobile and 99 desktop**, and do not
establish a new live-site score. Recheck PageSpeed after Vercel serves this commit.

## Confirmed bottlenecks and changes

- The mobile hero requested a 1600px image (115,160 bytes). Responsive preloading
  and matching `srcset`/`sizes` now select an 800px image (32,973 bytes) on the
  tested mobile screen: 71% less image data. A 480px option serves smaller/low-DPR
  screens; desktop retains the original image.
- Product/deal/category thumbnails used their original images. Added display-size
  AVIF variants for 41 sources on home, menu, and offers. Width descriptors match
  actual intrinsic dimensions, including sources smaller than a requested width.
  Original artwork, fallback files, frame CSS, prices, and product content remain.
- Many menu images, plus the footer logo and a closed offer-dialog image, used
  high priority and synchronous decoding. Only the first banner retains high
  priority. Catalogue/footer/closed-dialog images load lazily and decode async.
- The menu's full-screen loader masked content and delayed its appearance. Removed
  that overlay and unused inline loader CSS from home/menu; other pages' loaders
  remain unchanged. The homepage already had no loader element at baseline.
- The homepage hero-frame shimmer could remain animated after its image loaded.
  Both fresh load events and cached-image initialization now stop the frame
  placeholder. Offscreen image placeholders are static, avoiding perpetual pulses.
- Closed shared dialogs were being laid out/rendered and pre-promoted with blanket
  `will-change`. Their content now skips rendering while closed and becomes visible
  when active; discrete transitions retain the closing fade in supporting browsers.
  This follows [MDN's content-visibility transition guidance](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/content-visibility).
- The document-wide modal observer rescanned every dialog on unrelated image,
  carousel, and style updates. It now reacts only to dialog-container changes or
  insertion/removal, retaining modal scroll locking and restoration.
- Carousel loop copies duplicated the primary hero ID and high request priority.
  Copies now omit that ID, are accessibility-hidden, and have low priority. Timing,
  indicators, swipe handling, slide order, and loop transitions are unchanged.
- Interaction testing found an existing search exception from updating a label
  absent from the current overlay. Guarded that optional label update.
- Rebuilt production bundles and updated shared CSS/loader/search cache versions
  across public pages so cached visitors receive the fixes.

## Results

| Metric | Mobile home before | Mobile home after |
| --- | ---: | ---: |
| Performance score | 51 | 72 |
| FCP | 1.054s | 0.987s |
| LCP | 5.228s | 3.281s |
| Total blocking time | 3.136s | 0.895s |
| CLS | 0.01585 | 0 |
| Speed index | 3.044s | 2.402s |

Mobile-home score ranges: 49–61 before, 70–73 after. Recorded image transfer
totals in representative home runs fell from 703,743 to 391,602 bytes (~44%).
These totals include response overhead and depend on native lazy-load decisions.

Desktop home (single runs): score 70 → 100, LCP 1.280s → 0.607s, TBT 676ms → 45ms.
Mobile menu (single runs): score 41 → 71, LCP 12.648s → 2.312s, TBT 2.922s → 1.819s,
CLS remains 0. Do not treat single-run comparisons as reliable percentage gains.

## Verification

- All generated image paths exist; every srcset width descriptor is verified with Sharp.
- Chrome tests at 390px/DPR 2 and 1440px/DPR 1: banners load correctly and fill
  their frames; no horizontal page overflow; desktop retains original hero sources;
  mobile uses responsive sources; no duplicate primary hero ID.
- Home/menu carousel indicator navigation still works with the original transition.
- Home/menu/offers: adding a product updates the cart, closes the item dialog,
  and preserves page scroll position. Search returns results and closes normally.
- Dashboard demo, about demo, and delivery-info dialogs open with visible content,
  retain useful sheet height, release scroll locks, and preserve scroll on closure.
- All 13 public HTML pages passed mobile and desktop startup checks without
  JavaScript exceptions. The standalone admin dashboard assets were not modified.
- Production build, JavaScript syntax checks, and `git diff --check` passed.

These checks do not exercise every checkout submission, admin workflow, or browser.

## Remaining considerations

Mobile blocking time is still above Lighthouse's good threshold in this local
environment. Runtime-created components and the shared stylesheet remain areas
for future profiling. Much of the stylesheet is unused on any one page, but serves
other pages and runtime dialogs; indiscriminate purging could break those features
and was not applied. Production CDN/TTFB and field Core Web Vitals cannot be inferred
from these localhost tests. No server/deployment settings were changed.

## Repeat the checks

```sh
npm install
npm run build:images
npm run build:assets
npm install --no-save --package-lock=false lighthouse playwright
node scripts/verify-performance.mjs
node scripts/performance-audit.mjs after
```

The browser scripts currently use the installed Windows Chrome path. Adjust that
path for another environment. Local Lighthouse JSON reports are stored in
`.perf-results/` (gitignored); a `before` argument labels reports but does not
automatically switch the source code to the baseline commit.
