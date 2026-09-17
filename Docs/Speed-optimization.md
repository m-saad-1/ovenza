# Agent Task: Fix crustpk.vercel.app Performance (Mobile + Desktop)

You are a senior front-end/performance engineer. Your job is to take this Lighthouse report analysis and implement every fix below in the codebase for **crustpk.vercel.app**. Work top-to-bottom by priority. After each phase, note the estimated KB/ms saved. At the end, re-run Lighthouse (mobile, Slow 4G, Moto G Power emulation) and confirm the target metrics are met.

## Baseline (current state)

| Metric | Current | Target |
|---|---|---|
| Performance score | 67 | ≥ 90 |
| Accessibility | 91 | ≥ 95 |
| Best Practices | 96 | 100 |
| SEO | 100 | 100 (maintain) |
| First Contentful Paint (FCP) | 2.6 s | < 1.8 s |
| **Largest Contentful Paint (LCP)** | **14.6 s** | **< 2.5 s** |
| Total Blocking Time (TBT) | 80 ms | < 200 ms (already OK) |
| Cumulative Layout Shift (CLS) | 0.068 | < 0.1 (already OK) |
| Speed Index (SI) | 4.6 s | < 3.4 s |
| Total page weight | ~3,008 KiB | < 1,500 KiB |

LCP at 14.6s is the single biggest problem and the main reason the score is 67. TBT and CLS are already healthy — do not spend time there.

---

## Root cause analysis

1. **Every hero-area image is marked `fetchpriority="high"`.** Tower Burger, Offer Image, Mountain Dew icon, App Install banner, Combo 2, Smash Burger, BBQ Burger, Combo 1, Hero, Gallery images, Logo, Chicken Pizza, Special Pizza, Crown Crust Pizza — essentially the whole first screen — all compete for bandwidth at "high" priority simultaneously. This defeats the purpose of priority hints and starves the actual LCP element, which is why LCP is 14.6s despite a fast initial HTML/CSS response (~55–79ms).
2. **Images are shipped far larger than their display size**, and it's the same waste on both the hero images and the small 116×116 category icons. Total identified savings: **1,832.5 KiB**, ~61% of total page weight, from oversized dimensions and AVIF encoded at too high a quality/compression setting.
3. **Google Maps embed loads eagerly on first paint** and ships 405.7 KiB of JS, of which 229.2 KiB is unused on load.
4. **Forced synchronous reflows** in `loader.js` and `script.bundle.js` (133ms total) — DOM geometry reads (e.g. `offsetWidth`) happening right after style/DOM mutations.
5. **Render-blocking CSS**: `style.bundle.css` (26.6 KiB) blocks first paint for 310ms and contains 15.1 KiB (58%) of unused rules.
6. 5 long main-thread tasks and 5 non-composited animations, likely driven by #3 and #4.

---

## Phase 1 — Fix LCP and image weight (highest impact, do this first)

### 1a. Fix `fetchpriority` and `loading` misuse
- [ ] Identify the actual LCP element (almost certainly the hero image or the offer modal image — confirm via Lighthouse's "LCP element" trace or DevTools Performance panel).
- [ ] Set `fetchpriority="high"` and `loading="eager"` on **only that one image**.
- [ ] Remove `fetchpriority="high"` from every other image. Default priority is fine for anything in the first viewport; everything below the fold gets `loading="lazy"`.
- [ ] Change `decoding="sync"` → `decoding="async"` on every image except the LCP element.

Apply this pattern:
```html
<!-- The one true LCP image -->
<img src="hero.avif" fetchpriority="high" loading="eager" decoding="async" width="693" height="417" alt="…">

<!-- Everything else above the fold -->
<img src="offer-1.avif" decoding="async" width="849" height="399" alt="…">

<!-- Everything below the fold (gallery, combos, category icons, etc.) -->
<img src="combo-2.avif" loading="lazy" decoding="async" width="319" height="319" alt="…">
```

### 1b. Resize/re-encode every oversized image
Do NOT just recompress — first ship images at (display-size × 2 for retina), then recompress AVIF at a reasonable quality (~50-60 for photos, higher for logos/icons with flat color). Add real `srcset`/`sizes` so the browser doesn't over-fetch on smaller viewports.

| Asset | Current | Displayed at | Fix | Est. savings |
|---|---|---|---|---|
| `burger-7.avif` (Tower Burger) | 1254×1254, 272.9 KiB | 319×319 | Resize to ~640×640 + recompress | 256.4 KiB |
| `offer-1.avif` (Offer modal) | 1557×860, 306.3 KiB | 849×399 | Resize to ~1700×800 + recompress | 251.2 KiB |
| `mountain-dew.avif` (category icon) | 1254×1254, 165.6 KiB | **116×116** | Resize to ~232×232 + recompress | 164.2 KiB |
| `app-install.avif` | 1829×860, 160.8 KiB | 665×313 | Resize to ~1330×626 + recompress | 139.5 KiB |
| `combo-2.avif` | 1254×1254, 143.6 KiB | 319×319 | Resize to ~640×640 + recompress | 134.4 KiB |
| `burger-4.avif` (Smash Burger) | 1254×1254, 137.3 KiB | 319×319 | Resize to ~640×640 + recompress | 128.5 KiB |
| `burger-5.avif` (BBQ Burger) | 1254×1254, 131.7 KiB | 319×319 | Resize to ~640×640 + recompress | 123.2 KiB |
| `combo-1.avif` | 1254×1254, 120.6 KiB | 319×319 | Resize to ~640×640 + recompress | 112.8 KiB |
| `hero.avif` | 1616×809, 139.3 KiB | 693×417 | Resize to ~1386×834 + recompress | 108.5 KiB |
| `roll-1.avif` (category icon) | 800×800, 53.9 KiB | **116×116** | Resize to ~232×232 + recompress | 52.8 KiB |
| `playstore-btn.avif` | 2159×728, 51.3 KiB | 259×88 | Resize to ~520×176 + recompress | 50.6 KiB |
| `gallery-6.avif` | 466×581, 68.7 KiB | 321×401 | Recompress (already near-correct size) | 47.8 KiB |
| `logo.avif` | 2172×724, 51.5 KiB | 630×210 | Resize to ~1260×420 + recompress | 47.2 KiB |
| `gallery-1.avif` | 465×567, 52.3 KiB | 321×392 | Recompress | 31.8 KiB |
| `chicken-pizza.avif` | 500×500, 48.0 KiB | 319×319 | Recompress / mild resize | 31.4 KiB |
| `special-pizza.avif` | 500×500, 46.1 KiB | 319×319 | Recompress / mild resize | 29.6 KiB |
| `crown-crust-pizza.avif` | 500×500, 43.4 KiB | 319×319 | Recompress / mild resize | 26.9 KiB |
| `gallery-5.avif` | 462×583, 47.8 KiB | 321×405 | Recompress | 26.6 KiB |
| `gallery-2.avif` | 470×596, 40.4 KiB | 321×407 | Recompress | 21.5 KiB |
| `cheese-fries.avif` (category icon) | 500×500, 19.4 KiB | **116×116** | Resize to ~232×232 + recompress | 18.4 KiB |
| `gallery-3.avif` | 465×581, 34.1 KiB | 321×401 | Recompress | 17.8 KiB |
| `burger-1.avif` (category icon) | 360×360, 12.8 KiB | **116×116** | Resize to ~232×232 + recompress | 11.5 KiB |
| **Total** | | | | **~1,832.5 KiB** |

Note the recurring pattern: every "category circle" icon (mountain-dew, roll-1, cheese-fries, burger-1) is shipping a full-size product photo master (up to 1254×1254) to render a 116×116 circle. Fix the image source at the pipeline level, not just via CSS.

- [ ] Build an image pipeline (e.g. `sharp` at build time, or Vercel's Image Optimization / `next/image` if this is a Next.js app) that generates the correctly-sized AVIF variant + a `srcset` for each breakpoint, instead of hand-placing full-resolution masters.
- [ ] Add explicit `width`/`height` (already present on most — keep them, they help CLS) matching the real intrinsic size of the new resized asset.

**Expected result of Phase 1 alone: total page weight drops from ~3,008 KiB to roughly ~1,175 KiB, and LCP should drop dramatically since the true LCP image is no longer contending with ~15 other "high priority" images.**

---

## Phase 2 — Stop loading Google Maps on initial page load

Currently: 405.7 KiB of JS from `maps.googleapis.com`/`maps.gstatic.com`, of which 229.2 KiB is unused at load, plus it contributes to long main-thread tasks.

- [ ] Remove the Maps `<script>`/embed from the initial render path entirely.
- [ ] Replace the visible "map" on first load with a static placeholder (a lightweight static map image, or just a "View on Google Maps" link/button) that looks identical to the real map.
- [ ] Load the real interactive Maps JS **only** when the user scrolls the map into view (IntersectionObserver) or clicks the placeholder — whichever fits the UX better.

```js
const mapPlaceholder = document.querySelector('#map-placeholder');
const loadRealMap = () => {
  if (window.__mapsLoaded) return;
  window.__mapsLoaded = true;
  const script = document.createElement('script');
  script.src = 'https://maps.googleapis.com/maps/api/js?key=YOUR_KEY&callback=initMap';
  document.head.appendChild(script);
};

// Option A: load when scrolled into view
const observer = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) { loadRealMap(); observer.disconnect(); }
}, { rootMargin: '200px' });
observer.observe(mapPlaceholder);

// Option B: load on click instead, if the map isn't critical to the page
mapPlaceholder.addEventListener('click', loadRealMap, { once: true });
```

- [ ] Confirm this removes ~230–405 KiB of JS transfer and the associated long tasks from the initial load entirely (not just the "unused" portion — the whole script moves off the critical path).

---

## Phase 3 — Fix forced reflows in `loader.js` / `script.bundle.js`

Report shows 133ms of forced reflow attributed to `loader.js:573:851`, `loader.js:572:1267`, and `script.bundle.js:2:3663`. This is layout thrashing: JS is reading a geometric property (`offsetWidth`, `offsetHeight`, `getBoundingClientRect`, `scrollHeight`, etc.) immediately after a DOM/style mutation, forcing the browser to synchronously recalculate layout.

- [ ] Open `loader.js` around lines 572–573 and `script.bundle.js` around line 2 (or their un-minified source) and find the pattern:
  ```js
  // BAD: write, then read, in a loop or in sequence — forces reflow each time
  el.style.width = '100px';
  const h = el.offsetHeight; // <- forces synchronous layout recalculation
  ```
- [ ] Refactor to batch all reads before any writes ("read-then-write" / FastDOM pattern):
  ```js
  // GOOD: read first, write after
  const h = el.offsetHeight;
  el.style.width = '100px';
  ```
- [ ] If the reflow happens inside a loop over multiple elements, read all needed measurements into an array first, then apply all writes in a second pass.
- [ ] Where possible, wrap layout-dependent writes in `requestAnimationFrame` to let the browser batch them naturally.
- [ ] Re-profile with the DevTools Performance panel after the fix to confirm the forced-reflow warnings are gone.

---

## Phase 4 — Render-blocking CSS + unused CSS/JS

- [ ] `style.bundle.css` (26.6 KiB) blocks render for 310ms and has 15.1 KiB (58%) unused.
  - Extract critical, above-the-fold CSS and inline it in `<head>` (a `<style>` block).
  - Load the rest of `style.bundle.css` non-blocking:
    ```html
    <link rel="preload" href="/css/style.bundle.css?v=16" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <noscript><link rel="stylesheet" href="/css/style.bundle.css?v=16"></noscript>
    ```
  - Run the CSS through a purge/tree-shake step (PurgeCSS, or your bundler's built-in unused-CSS removal) against the actual rendered HTML to cut the 15.1 KiB of dead rules.
- [ ] Google Maps unused JS (229.2 KiB) is resolved by Phase 2 (deferred loading) — no separate action needed here.

---

## Phase 5 — Caching and payload housekeeping

- [ ] Google Maps static image / JS responses are cached only 30m–1d. This is third-party and mostly out of your control, but confirm you're not setting a shorter cache policy yourself anywhere for first-party static assets (images, CSS, JS bundles). First-party static assets under `/assets/` and `/css/`, `/js/` should have a long `Cache-Control: public, max-age=31536000, immutable` policy with content-hashed filenames (the `?v=16` query-string cache-busting works too, but a hashed filename is more robust).
- [ ] After Phases 1–4, confirm total transferred payload is under ~1,500 KiB (from 3,008 KiB).

---

## Phase 6 — Layout stability & main-thread cleanup (lower priority — CLS/TBT are already passing, but clean these up while you're in the code)

- [ ] **5 non-composited animations** were flagged. Find them and make sure they animate only `transform` and `opacity` (GPU-composited), never `width`, `height`, `top`, `left`, `margin`, etc. Add `will-change: transform` only where an animation is actually running, not globally.
- [ ] **5 long main-thread tasks** — after Phase 2 (removing Maps from initial load) and Phase 3 (fixing reflows), re-check the Performance panel. Any remaining long tasks should be broken up with `requestIdleCallback`/chunking or deferred until after first paint.
- [ ] Layout shift culprits — CLS is already good (0.068) but double check the offer modal and any dynamically-injected banners reserve their space (fixed `width`/`height` or `aspect-ratio` on the container) before their image loads, so nothing shifts existing content when they appear.

---

## Out of scope for this report but flagged for follow-up

Accessibility (91/100) and Best Practices (96/100) weren't broken down in this report excerpt. After finishing Phases 1–6:
- [ ] Run a full Lighthouse Accessibility audit and fix whatever it flags (common culprits: color contrast on buttons/badges, missing/insufficient `alt` text on informative images — note several icons currently have empty `alt=""`, which is correct only if they're purely decorative, and missing form labels).
- [ ] Run a full Lighthouse Best Practices audit and fix whatever it flags (common culprits: console errors, missing `rel="noopener"` on external links, image aspect-ratio mismatches).

---

## Definition of done

- [ ] Mobile Performance score ≥ 90 (Slow 4G, Moto G Power emulation, matching the original test conditions)
- [ ] Desktop Performance score ≥ 90
- [ ] LCP < 2.5s
- [ ] FCP < 1.8s
- [ ] TBT stays < 200ms
- [ ] CLS stays < 0.1
- [ ] Total transferred payload < 1,500 KiB
- [ ] No forced-reflow warnings in DevTools Performance panel
- [ ] Google Maps JS does not load until user interaction/intersection
- [ ] Exactly one image on the page has `fetchpriority="high"`
- [ ] Re-run Lighthouse and paste the new report scores for verification