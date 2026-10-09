# Meldough Mobile Performance: 89 to 100

This document records the production-first approach used to raise the Meldough homepage's reported mobile PageSpeed performance score from **89 to 100**. It is also a maintenance guide: future changes should preserve the principles and checks below rather than treating the score as a one-time result.

## Result

- Starting production mobile score: **89**
- Final production mobile score reported after deployment: **100**
- Production site: `https://meldough.vercel.app/`
- Optimization commits:
  - `2bdac51` — Improve mobile loading performance
  - `9b2de2e` — Reduce production homepage payload
  - `1fb1df1` — Self-host homepage fonts

The decisive improvement came from reducing real production startup work: fewer initial image requests, less homepage CSS, no Google Fonts connection, less image decoding, and stable first-paint geometry.

## 1. Measure Production, Not Just Localhost

Local Lighthouse initially scored the optimized page at 96–97, while the deployed site still showed 89. That difference was important. Localhost did not reproduce production DNS, TLS, third-party font connections, CDN behavior, or the same network timing.

The next audit therefore focused on the deployed URL and its request waterfall rather than chasing the local score alone.

The useful production baseline was:

| Metric | Before the production-focused pass |
| --- | ---: |
| Requests | 37 |
| Total transfer | 469,089 bytes |
| Image requests / transfer | 26 / 320,463 bytes |
| Google Fonts requests / transfer | 3 / 57,687 bytes |
| Shared stylesheet | 154,719 raw bytes / 25,272 gzip bytes |
| Unused shared CSS | About 73% on the homepage |
| DOM elements | About 1,341 |

One live Lighthouse run was heavily affected by runner load and produced an unrealistically low score and high blocking time. It was still valuable as a diagnostic trace, but not as a trustworthy final score. The reliable method was to compare concrete payload and request changes, then confirm with fresh PageSpeed runs after Vercel deployed the exact commit.

## 2. Stabilize the First Paint

The theme boot code and the loader previously disagreed about the default theme. That can cause a light-to-dark or dark-to-light correction during startup, adding visual instability and unnecessary paint work.

The inline code in `index.html` and every page was aligned so that:

- Stored `light` preference renders light.
- Otherwise the first paint defaults to dark.
- The loader and document use the same decision before the page becomes visible.

This removed the theme mismatch from the critical startup path and helped keep cumulative layout shift at effectively zero in local validation.

## 3. Remove Redundant Hero Work

The hero carousel contained three visually identical images plus indicators. Even when the browser avoided downloading every duplicate, the DOM, responsive image selection, decoding, carousel initialization, and layout work were unnecessary.

The carousel was replaced with one responsive hero image while preserving the existing appearance. Its intrinsic dimensions were corrected to `1600x750`, which gives the browser the correct aspect ratio before the image finishes loading.

The mobile hero AVIF files were then recompressed:

| Asset | Before | After |
| --- | ---: | ---: |
| `hero-main-480.avif` | 27,026 bytes | 13,613 bytes |
| `hero-main-800.avif` | 60,808 bytes | 29,252 bytes |

The existing responsive `srcset` remained in use so mobile devices receive the right-sized asset rather than the full desktop image.

## 4. Ship Homepage-Specific CSS

The homepage was downloading the complete shared stylesheet even though most of its selectors belonged to other routes. The full stylesheet was kept as the source of truth, but the homepage now receives a generated, route-specific bundle:

- Source stylesheet: `assets/css/style.bundle.css`
- Homepage output: `assets/css/style.home.min.css`
- Generator: `scripts/build-home-css.mjs`
- Command: `npm run build:home-css`

The generator uses PurgeCSS against the actual homepage and its JavaScript files, then minifies the result with CleanCSS. It scans:

- `index.html`
- `assets/js/loader.js`
- `assets/js/script.bundle.js`
- `assets/js/search.js`

Runtime-only classes are safelisted in the generator. At the time of this work, the homepage stylesheet compressed to about 18,058 bytes over the network, compared with about 25,272 bytes for the full shared stylesheet.

### Maintenance rule

Run this command whenever homepage markup, CSS, or JavaScript-controlled class names change:

```powershell
npm.cmd run build:home-css
```

Then inspect the homepage and all interactive states. If a new class only appears dynamically, add it to the PurgeCSS safelist before rebuilding. When the generated file changes, update the stylesheet query version in `index.html` if a cache-busting version is present.

## 5. Defer Only Genuinely Offscreen Images

Native lazy loading was still allowing too many menu images into the initial production request burst. The offscreen product images were changed to a controlled lazy-loading pattern:

- Keep the visible combo section's images immediately loadable.
- Store later product URLs in `data-src` and `data-srcset`.
- Use a transparent 1×1 placeholder before activation.
- Promote images with an `IntersectionObserver` using a `300px` root margin.
- Preserve `width`, `height`, responsive source widths, and aspect ratios.
- Give the six category icon images `fetchpriority="low"`.

This reduced the initial browser image requests from 26 to 11 in the measured production flow while still beginning downloads shortly before the user scrolls to each section. Browser testing confirmed deferred images appeared correctly when scrolled into view.

Do not defer above-the-fold assets. The logo, hero, and immediately visible product images need predictable discovery and should remain normal image requests.

## 6. Self-Host the Exact Fonts

The homepage previously opened third-party connections to Google Fonts. That added DNS, connection, and stylesheet latency to the rendering path.

The exact WOFF2 files already used by the page were stored locally:

- `assets/fonts/inter-latin.woff2` — 48,432 bytes
- `assets/fonts/poppins-latin.woff2` — 7,848 bytes

Matching `@font-face` declarations were added to the source stylesheet, the homepage CSS was rebuilt, and the Google Fonts DNS-prefetch, preconnect, and external stylesheet tags were removed from `index.html`.

This preserved the intended typography while eliminating an external origin and its three production requests. Keep these fonts local unless there is a strong product reason to add another third-party dependency.

## 7. Experiments That Were Reverted

Not every standard performance technique helped this page. These experiments were tested and removed because their measured behavior was worse.

### Partial critical CSS plus asynchronous full CSS

Inlining a small critical stylesheet and loading the full CSS asynchronously created unstable early layout because the partial CSS did not fully describe the above-the-fold menu content. It also introduced duplicate CSS parsing and style recalculation. The result was worse layout shift and blocking time.

The safer solution was a complete but purged homepage stylesheet loaded normally.

### `content-visibility` on menu grids

Applying `content-visibility` to variable-height menu sections caused the browser's estimated offscreen sizes to disagree with the final layout. The test produced roughly `0.52` CLS, so the change was reverted.

Explicit image dimensions and controlled request deferral provided the benefit without speculative section heights.

### Treating a single Lighthouse run as truth

Lighthouse scores vary with CPU load, network conditions, cache state, and the audit runner. A single live run in this work showed severe host contention despite the payload being substantially improved. Use scores as a user-facing checkpoint, but diagnose with the waterfall, transfer sizes, main-thread tasks, LCP element, CLS sources, and multiple fresh runs.

## 8. Verification Process

The final implementation was checked at several levels.

### Build and source checks

```powershell
npm.cmd run build:home-css
git diff --check
```

The generated stylesheet must be committed with the source stylesheet and generator changes.

### Browser checks

The homepage was exercised in a real browser to confirm:

- Responsive hero loads at mobile width.
- No horizontal overflow appears.
- Only one hero image/carousel instance exists.
- The homepage stylesheet loads successfully.
- Initial image requests remain limited.
- Deferred menu images load as the page is scrolled.
- Product modal and cart flow still work.
- No JavaScript or asset-loading errors occur.

### Deployment checks

After every push:

1. Wait for Vercel to deploy the commit.
2. Confirm the live HTML contains the expected deployment signature, such as the new stylesheet or self-hosted font reference.
3. Confirm Google Fonts is absent from the homepage response.
4. Run PageSpeed/Lighthouse in a fresh session, preferably more than once.
5. Compare the median result and resource waterfall, not only the best score.

After the payload pass, the same production inspection recorded:

| Metric | Before | After |
| --- | ---: | ---: |
| Requests | 37 | 22 |
| Total transfer | 469,089 bytes | 278,139 bytes |
| Image requests / transfer | 26 / 320,463 bytes | 11 / 137,255 bytes |
| Stylesheet transfer | 25,272 bytes for shared CSS | 22,378 bytes total in that trace |
| Blocking time in the same noisy runner | 13.8 seconds | 0.45 seconds |

The font self-hosting pass then removed the remaining Google Fonts origin and requests. Following deployment, the reported mobile PageSpeed score reached **100**.

## 9. Rules for Keeping the Score

1. Keep critical assets first-party, compact, and easy for the preload scanner to discover.
2. Preserve explicit `width` and `height` on images and keep `srcset` descriptors accurate.
3. Defer only genuinely offscreen images; do not hide or lazy-load the LCP candidate.
4. Rebuild `style.home.min.css` after relevant HTML, CSS, or JavaScript changes.
5. Safelist every class that JavaScript adds at runtime.
6. Avoid reintroducing identical carousel slides or decorative work with no user value.
7. Avoid third-party font stylesheets on the critical path.
8. Test interactions after every purge or loading-strategy change.
9. Verify the deployed commit before judging a production score.
10. Use several fresh measurements and compare production payloads; never optimize around one anomalous run.

## Practical Checklist for Future Homepage Changes

```powershell
# Regenerate route-specific CSS
npm.cmd run build:home-css

# Confirm patches have no whitespace errors
git diff --check

# Review exactly what will ship
git status --short
git diff -- index.html assets/css/style.bundle.css assets/css/style.home.min.css scripts/build-home-css.mjs
```

Before merging or deploying, also verify the mobile viewport manually, scroll through every deferred menu group, open a product, add it to the cart, and check the browser console and network panel for failures.

The key lesson is straightforward: the final jump did not come from gaming Lighthouse. It came from making the first production render smaller, more local, more stable, and more intentional.
