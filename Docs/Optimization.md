# Agent Task: crustpk.vercel.app Performance — Round 3 (Desktop)

FCP, LCP, TBT and SI are now excellent on desktop (0.2s / 0.4s / 0ms / 1.4s). The only real problem left is CLS (0.554, target < 0.1), and this report finally names the exact elements responsible — fix these in order.

## Status check

| Metric (Desktop) | Value | Target | Status |
|---|---|---|---|
| Performance | 77 | ≥ 90 | CLS is the only thing holding this back |
| FCP | 0.2s | < 1.8s | ✅ |
| LCP | 0.4s | < 2.5s | ✅ |
| TBT | 0ms | < 200ms | ✅ |
| **CLS** | **0.554** | **< 0.1** | **🔴 still the blocker** |
| SI | 1.4s | < 3.4s | ✅ |

---

## Phase 0 — Confirm the body-scroll-lock fix actually shipped (0.200 of the CLS total)

`<body style="overflow: hidden;">` is still causing a 0.200 shift — this is the exact same signature flagged in round 2. Before doing anything new:

- [ ] Verify `scrollbar-gutter: stable` was actually added to `html` in the deployed CSS (check the live site's computed styles, not just the source — it's possible this got lost in a merge, or the minified CSS build ran from a branch that didn't have it).
- [ ] This site has **three separate modals** — Special Offer, Delivery & Pickup Info, and Contact Us. Confirm all three use the *same* scroll-lock/unlock function. It's common for a modal added later (e.g. Delivery Info or Contact Us) to have its own inline `overflow: hidden` that bypasses whatever fix was applied to the main modal. Grep the whole codebase for `overflow` + `hidden` again, specifically inside modal open/close handlers — there are likely 2-3 separate implementations that need the same fix, not one.
- [ ] Re-confirm with DevTools Rendering → "Layout Shift Regions" while opening each of the three modals individually.

## Phase 1 — Fix the `<main>` menu grid shift (0.314 — the single biggest culprit, new this round)

This is the largest chunk of CLS and wasn't visible in earlier reports. The shifting element is described as `Combos Burgers Pizzas Rolls Fries Drinks Top Picks View All › Combo 1 1x Class…` — i.e. the category tab bar plus the menu grid underneath it moves after initial render. Two likely causes, check both:

- [ ] **Web font swap reflowing text.** Two `.woff2` fonts are flagged as layout-shift culprits in this same report. If the fallback font's character widths differ meaningfully from the real font, every card title/price in the grid re-wraps and re-sizes when the real font finishes loading, which cascades into the whole grid shifting. Fix:
  ```html
  <link rel="preload" href="/fonts/your-font.woff2" as="font" type="font/woff2" crossorigin>
  ```
  ```css
  @font-face {
    font-family: 'YourFont';
    src: url('/fonts/your-font.woff2') format('woff2');
    font-display: optional; /* prevents a visible swap entirely — falls back if not cached in time */
    /* or font-display: swap combined with size-adjust/ascent-override tuned to match the fallback metrics, if you need the custom font to always eventually show */
  }
  ```
  `font-display: optional` is the safer choice here since it guarantees zero layout shift from font swap (it just won't show the custom font on a slow load), at the cost of occasionally using the fallback font.

- [ ] **JS re-rendering/re-sorting the grid after first paint.** If any script filters, sorts, or re-injects the menu items on `DOMContentLoaded` (e.g. a "category" filter running client-side after the initial HTML renders), that will shift the entire grid downward/upward once it runs. Check for this specifically — if present, either:
  - Do the filtering/sorting server-side or at build time so the HTML is already in final order on first paint, or
  - Reserve the grid's final height up front (skeleton/placeholder cards sized to the real card dimensions) so the swap-in doesn't change total page height.

- [ ] Check that menu **card containers** (not just the `<img>` tags inside them) have explicit dimensions or `aspect-ratio` set. Round 1 fixed image `width`/`height`, but if the card text (title, price, description) wraps differently before/after font load, the card height itself changes even with the image locked — audit the `.category-circle-btn`/menu-card CSS for this.

## Phase 2 — Modal-open shifts (0.040 combined, all 3 modals)

Each `.modal-sheet` (Offer, Delivery Info, Contact Us) shifts slightly when it opens — likely because its content (image, text) finishes loading/rendering after the modal is already positioned, changing its height.

- [ ] Give each modal-sheet a fixed or `min-height` matching its expected final content size, or use `aspect-ratio` on the image slot inside it, so the modal doesn't resize once its content is in.
- [ ] If the modal animates in (slide/fade), make sure that animation only uses `transform`/`opacity` (ties into Phase 4 below) rather than animating `height`.

## Phase 3 — Finish the responsive-image work (still ~199 KiB of waste)

Round 1's fix used a single fixed "safe" size (640×640) for the burger/combo/pizza images. That was right for the mobile breakpoint (display ~319px) but this desktop breakpoint displays them at **298px**, and the category icons display at **66px on desktop vs ~116px on mobile** — one fixed image can't be correct for both. This is why the same images are still flagged as oversized here even though they were "fixed" in round 1.

- [ ] Replace the single fixed-size images with real `srcset`/`sizes`, so each breakpoint pulls the right file:
  ```html
  <img
    src="combo-2-600.avif"
    srcset="combo-2-300.avif 300w, combo-2-600.avif 600w"
    sizes="(max-width: 640px) 319px, 298px"
    width="298" height="298"
    loading="lazy" decoding="async"
    alt="Combo 2">
  ```
- [ ] Apply the same treatment to the category-circle icons (`cheese-fries.avif` etc.) — they need a smaller desktop variant (~132px for 66px @2x) separate from the mobile variant (~232px for 116px @2x).
- [ ] `whatsapp.png` still hasn't been touched since round 2 — convert to AVIF/WebP and size it correctly per breakpoint (120×120 shipped for a 60×60 desktop display). Small in isolation (~12 KiB) but easy and still outstanding.

## Phase 4 — Non-composited animations: 112 elements now (was 55, was 5)

This count keeps climbing in proportion to how many elements are visible/loaded on a given run, which strongly points to one global rule rather than 112 individual problems — almost certainly the `.is-loaded` class (present on nearly every image/element across every report so far) or a similar broad hover/fade rule.

- [ ] Find the CSS rule tied to `.is-loaded` (and any other transition applied broadly — search for `transition: all`).
- [ ] Constrain it to `transform`/`opacity` only, as covered in round 2 — this was flagged then too and the count has since gotten worse, so it still hasn't been fixed:
  ```css
  .is-loaded { transition: opacity 0.3s ease, transform 0.3s ease; }
  ```
- [ ] Re-run the "Avoid non-composited animations" insight and confirm the count drops sharply — if it doesn't, the rule you found isn't the actual source; keep searching rather than assuming it's fixed.

## Phase 5 — Forced reflow (still present, now in `loader.min.js`)

- [ ] `loader.min.js?v=20` lines `2:67072` and `1:67142`, ~50ms each, plus 92ms unattributed. Since this is minified, pull the source map (or the unminified `loader.js` source) to identify the actual read-after-write pattern rather than debugging the minified output directly.
- [ ] Same fix pattern as before: batch all `offsetWidth`/`offsetHeight`/`getBoundingClientRect()` reads before any DOM/style writes; if it's in a loop over the menu grid items, that's very likely connected to Phase 1's grid-shift investigation — worth checking whether this reflow and the `<main>` shift share a root cause (e.g. the same script that measures-then-repositions grid items on load).

## Phase 6 — Unused CSS (still open, smaller now)

- [ ] `style.bundle.min.css` — 11.9 KiB of 21.3 KiB (56%) still unused. Continue the PurgeCSS work from round 2 against this desktop render specifically (desktop and mobile may use different class sets, so purge against both viewport renders, not just one).

---

## Definition of done (round 3)

- [ ] CLS < 0.1 on desktop (currently 0.554)
- [ ] `body overflow:hidden` shift confirmed fixed across **all three** modals, not just one
- [ ] `<main>` grid shift resolved (font-display fix and/or grid re-render fix)
- [ ] Responsive `srcset`/`sizes` in place so mobile and desktop each get correctly-sized images — no more single fixed-size "safe" masters
- [ ] Non-composited animation count near 0 (currently 112 — same root cause flagged twice before and still not fixed)
- [ ] Forced reflow resolved (verify via source map, not the minified file)
- [ ] Unused CSS < 5 KiB
- [ ] Performance score ≥ 90 on desktop re-run