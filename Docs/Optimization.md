# Agent Task: crustpk.vercel.app Performance — Round 2

Round 1 fixed LCP and image weight successfully. This round has one critical regression to fix (CLS) plus cleanup items that were flagged but not actually resolved last time. Work in priority order.

## Progress since round 1

| Metric | Round 1 | Round 2 (now) | Target | Status |
|---|---|---|---|---|
| Performance score | 67 | 66 | ≥ 90 | ⚠️ flat — CLS is masking real gains |
| Accessibility | 91 | 95 | ≥ 95 | ✅ met |
| Best Practices | 96 | 96 | 100 | — |
| SEO | 100 | 100 | 100 | ✅ |
| FCP | 2.6s | 0.8s | < 1.8s | ✅ met |
| LCP | 14.6s | 3.5s | < 2.5s | ⚠️ close, needs one more pass |
| TBT | 80ms | 30ms | < 200ms | ✅ met |
| **CLS** | **0.068** | **1.000** | **< 0.1** | **🔴 severe new regression** |
| SI | 4.6s | 2.7s | < 3.4s | ✅ met |
| Image waste | 1,832.5 KiB | 11 KiB | — | ✅ essentially solved |

Do not touch image sizing/fetchpriority again — that work is done. Focus entirely on the items below.

---

## Phase 0 — Fix the CLS regression (blocking everything else, do this first)

The report's entire layout-shift score (1.000 — the max) is attributed to a single element:
```
body
<body style="overflow: hidden;">
```

This is the textbook cause: some JS sets `document.body.style.overflow = 'hidden'`, which removes the vertical scrollbar. Removing the scrollbar shifts every element on the page rightward to fill the space it used to occupy — Lighthouse sees that as a single catastrophic shift affecting ~100% of the viewport.

- [ ] Find every place in the codebase that sets `body.style.overflow = 'hidden'` or toggles a class that does the same (grep for `overflow: hidden` in JS files, and for `overflow:hidden`/`overflow: hidden` applied to `body`/`html` in CSS classes). The prime suspect is whatever opens the **offer modal** (`#offer-modal-img`'s parent modal) — check if it auto-opens on page load or on a timer.
- [ ] Fix it with `scrollbar-gutter`, which reserves the scrollbar's space permanently so hiding/showing the scrollbar never shifts layout:
  ```css
  html {
    scrollbar-gutter: stable;
  }
  ```
  This is the cleanest fix and needs no JS changes — add it once, globally, and the shift disappears regardless of how many places toggle `overflow: hidden`.
- [ ] If broader browser support is a concern, the fallback is to measure the scrollbar width once and compensate with padding when locking scroll:
  ```js
  function lockScroll() {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    document.body.style.overflow = 'hidden';
  }
  function unlockScroll() {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  }
  ```
  Prefer `scrollbar-gutter: stable` if your browser support matrix allows it (all evergreen browsers support it) — it's one line and can't be forgotten in a future modal.
- [ ] After the fix, manually trigger whatever opens the modal and confirm in DevTools (Rendering tab → "Layout Shift Regions") that no shift occurs.
- [ ] Re-run Lighthouse and confirm CLS is back under 0.1.

---

## Phase 1 — Actually fix the forced reflow (round 1 did not resolve this)

Same magnitude as before (131ms vs. 133ms), now at slightly different line numbers because the bundle changed — meaning either the previous fix targeted the wrong code, or the refactor didn't remove the read-after-write pattern. Re-investigate from scratch:

- [ ] `script.bundle.js?v=20:69:158` — 131ms
- [ ] `script.bundle.js?v=20:2:3663` — 131ms (this exact line number, `2:3663`, also appeared in the round-1 report — this specific code path was never actually fixed)
- [ ] `loader.js?v=20:586:1297` — 27ms

For each: open the un-minified source, find where a geometric read (`offsetWidth`, `offsetHeight`, `getBoundingClientRect()`, `scrollHeight`, `clientWidth`, etc.) happens right after a style/class/DOM mutation, and reorder to read-before-write:
```js
// BAD — write then read forces a synchronous layout recalculation
el.classList.add('is-loaded');
const height = el.offsetHeight;

// GOOD — read first, write after
const height = el.offsetHeight;
el.classList.add('is-loaded');
```
If this is happening inside a loop (likely, given `script.bundle.js:2:3663` keeps recurring and the site has many `.is-loaded` image elements), batch all reads into an array first, then apply all writes in a second pass — never interleave them per-element in a loop.

- [ ] Verify with DevTools Performance panel (record a trace, look for "Forced reflow" purple warnings) that this is actually gone this time, not just moved.

---

## Phase 2 — Finish off LCP (3.5s → target < 2.5s)

Small remaining items:
- [ ] `hero.avif` is now 801×400 shipped for a 736×347 display — resize to match display size (or 2x for retina, ~1472×694) and re-encode. Est. savings: 5 KiB, plus it removes one more render dependency from the LCP path.
- [ ] `whatsapp.png` — still a PNG (7.4 KiB). Convert to AVIF/WebP and compress. Est. savings: 5.6 KiB.
- [ ] These two are small in isolation, but combined with Phase 0 (removing the CLS-driven repaint) they should be enough to pull LCP under 2.5s. Re-measure after Phase 0 before doing more LCP work — the modal-driven layout shift may itself be delaying LCP by repainting the hero image's position.

---

## Phase 3 — Build pipeline: minification isn't running

Both bundles are shipping unminified in production:
- [ ] `style.bundle.css?v=20` — 29.2 KiB, minifiable to ~24 KiB (5 KiB savings). Check whether your CSS build step (PostCSS/cssnano, or your bundler's CSS minifier) is actually enabled for the production build — right now it looks like it isn't running at all.
- [ ] `script.bundle.js?v=20` — 27.0 KiB, minifiable to ~24 KiB (3.1 KiB savings). Same check: confirm your bundler is running in production mode (e.g. Webpack `mode: 'production'`, or Terser/esbuild minify step enabled) rather than a dev/unminified build being deployed.
- [ ] This is likely a one-line config fix (build mode or a missing minifier plugin), not a code change — check your build script / `vercel.json` / bundler config first before touching source.

---

## Phase 4 — Unused CSS and JS (still unresolved from round 1)

- [ ] `style.bundle.css` — 16.9 KiB of 28.6 KiB (59%) unused. Run it through PurgeCSS (or your bundler's unused-CSS elimination) against the actual rendered HTML to strip dead rules. Combine with Phase 3 minification.
- [ ] `script.bundle.js` — **20.3 KiB of 27 KiB (75%) unused.** This is a lot of dead code for a 27 KiB file. Use DevTools → Sources → Coverage (record while loading the page) to see exactly which functions never execute. Likely candidates: leftover code paths for features not used on this page, or code that only runs after an interaction that never happens during the initial-load trace. Code-split anything not needed for first paint (dynamic `import()` on interaction) rather than shipping it all in the initial bundle.

---

## Phase 5 — Non-composited animations (55 elements — up from 5 in round 1)

This jump is suspicious and worth checking as one root cause rather than 55 separate ones: every image on the page gets an `is-loaded` class added after load (visible throughout both reports — `class="is-loaded"` is on nearly every `<img>`). If the CSS transition tied to `.is-loaded` (or its parent) animates a non-composited property — `box-shadow`, `top`/`left`, `margin`, `filter`, `width`/`height`, or a bare `transition: all` — every one of those images/elements gets flagged individually, which would explain a count in the 50s matching roughly the number of images on the page.

- [ ] Find the `.is-loaded` CSS rule (and any other global fade-in/hover transition rules) and check what properties it transitions.
- [ ] Replace `transition: all …` with an explicit property list.
- [ ] Ensure only `transform` and `opacity` are animated — these are the only properties the compositor can handle without triggering layout/paint on the main thread.
  ```css
  /* BAD */
  .is-loaded { transition: all 0.3s ease; }

  /* GOOD */
  .is-loaded { transition: opacity 0.3s ease, transform 0.3s ease; }
  ```
- [ ] Re-run Lighthouse's "Avoid non-composited animations" insight and confirm the count drops close to 0.

---

## Definition of done (round 2)

- [ ] CLS < 0.1 (currently 1.000 — this is the priority)
- [ ] LCP < 2.5s (currently 3.5s)
- [ ] No forced-reflow entries in DevTools Performance panel
- [ ] CSS and JS bundles confirmed minified in the deployed build
- [ ] Unused CSS < 5 KiB, unused JS < 5 KiB
- [ ] Non-composited animation count near 0
- [ ] Performance score ≥ 90 on re-run (Slow 4G, Moto G Power, matching original test conditions)