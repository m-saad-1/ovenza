# Agent Task: crustpk.vercel.app Performance — Round 4 (Mobile)

CLS is now the only real blocker, and this report narrows it to a single element. Fix Phase 0 first — it's the whole game. Phases 1–2 are fixes that have been requested twice already and still aren't live; treat those as non-negotiable this round.

## Status check

| Metric | Round 2 | Round 3 (Desktop) | Round 4 (Mobile, now) | Target | Status |
|---|---|---|---|---|---|
| Performance | 66 | 77 | 78 | ≥ 90 | CLS is the only thing left holding this back |
| FCP | 0.8s | 0.2s | 0.8s | < 1.8s | ✅ |
| **LCP** | 3.5s | 0.4s | **1.5s** | < 2.5s | ✅ **fixed** |
| TBT | 30ms | 0ms | 80ms | < 200ms | ✅ (fine, watch it) |
| **CLS** | 1.000 | 0.554 | **0.516** | < 0.1 | 🔴 still the blocker, now isolated to one cause |
| SI | 2.7s | 1.4s | 3.1s | < 3.4s | ✅ (close, will improve once CLS is fixed) |

---

## Phase 0 — Fix the `<main>` grid shift: 100% of remaining CLS

The report attributes the entire 0.516 CLS score to one element:
```
Combos Burgers Pizzas Rolls Fries Drinks Top Picks View All › Combo 1 1x Class…
<main>
0.516
```

The accessibility audit dump in this same report shows the DOM structure clearly: every product is a `<div class="product-card" data-category="Combos">` (or `"Burgers"`, `"Pizzas"`, etc.), and the tab bar above it lists `Combos Burgers Pizzas Rolls Fries Drinks Top Picks View All ›`. That `data-category` attribute plus a tab bar is the signature of a **client-side category filter**. The two most likely causes, in order of likelihood:

**Hypothesis A — the page renders all categories, then JS filters down to the default tab (e.g. "Top Picks") after load.** If the initial HTML shows every product across every category and a script then hides everything except the default tab's items, `<main>`'s height collapses dramatically right after paint — that alone could produce a shift this large.

**Hypothesis B — an "equal card height" script measures and re-applies card heights after images/fonts load.** The forced-reflow entries below (`script.bundle.min.js:2:3716`, `:1:1294`) are consistent with a script that reads layout (`offsetHeight` on cards) and writes it back (setting a uniform `min-height`) — if this runs after images finish loading, it would resize every card at once.

Don't guess — confirm which one it is first:

- [ ] Temporarily paste this into the console (or a temporary `<script>` tag) and reload the page:
  ```js
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      console.log('CLS shift:', entry.value, entry.sources?.map(s => s.node));
    }
  }).observe({ type: 'layout-shift', buffered: true });
  ```
  This prints the exact DOM node(s) responsible for each shift as it happens. That tells you immediately whether it's the category-filter logic collapsing `<main>`, a card-height-equalizer script, or something else entirely — don't apply a fix until you've seen this output.
- [ ] Cross-check with DevTools → Performance panel → record a reload → find the "Layout Shift" (red) marker → click it → "Summary" tab shows the triggering stack trace.

Once confirmed:
- [ ] **If it's Hypothesis A (category filter):** do the default-category filtering with CSS, not JS, so the correct final state is already true at first paint — no runtime shift possible:
  ```css
  /* Hide non-default categories immediately via CSS — no JS required for the initial state */
  [data-category]:not([data-category="Top Picks"]) { display: none; }
  ```
  Let JS only handle *switching* tabs after that (toggling this class/attribute on click) — it should never need to change anything on initial load.
- [ ] **If it's Hypothesis B (height-equalizer script):** don't measure-then-set heights with JS at all — use CSS Grid (`grid-auto-rows: 1fr` on the container, or `align-items: stretch`) so equal card heights happen automatically via layout, with zero JS and zero reflow.
- [ ] Whichever it is, re-run the console snippet above after the fix and confirm it logs nothing (or a near-zero value) on reload.

---

## Phase 1 — WhatsApp icon: flagged 3 rounds running, still not done

This has appeared in round 2, round 3, and now round 4 with the identical fix needed. Do it now, and after deploying, **check the live production URL directly** (not just the code) to confirm the change actually shipped — if it shows up unfixed a 4th time, the problem is the deploy/cache pipeline, not the fix itself.

- [ ] Convert `/assets/images/whatsapp.png` (7.4 KiB) to AVIF or WebP.
- [ ] It's rendered at a small icon size — export it at the actual display size (no larger than ~120×120 for @2x at a 60px display slot), not the current oversized master.
- [ ] Update the `<img>` tag's `src` and delete the old `.png` from the repo so it can't accidentally get referenced again.

## Phase 2 — Non-composited animations: 112 elements, unchanged for 2 rounds straight

Flagged at 55 in round 2, 112 in round 3, still 112 now — this has not been touched despite being called out twice.

- [ ] Search the CSS for `.is-loaded` (present on nearly every image tag in every report so far) and for any bare `transition: all`.
- [ ] Replace with an explicit, composited-only property list:
  ```css
  .is-loaded { transition: opacity 0.3s ease, transform 0.3s ease; }
  ```
- [ ] After deploying, re-run Lighthouse's "Avoid non-composited animations" insight specifically and confirm the count actually drops. If it's still ~112, the rule you edited isn't the real source — go find the actual one rather than re-submitting the same fix.

---

## Phase 3 — Fix a bug introduced by round 3's own image fix

The `cheese-fries` category icon now has a `srcset`, but the `sizes` attribute is wrong — it was copied from the food-photo card markup instead of being set for this icon's actual size:

```html
<!-- Current — wrong: "sizes" claims this renders at 298–319px, but it's a 116px icon -->
<img src="https://crustpk.vercel.app/assets/images/cheese-fries-600.avif"
     srcset="./assets/images/cheese-fries-300.avif 300w, ./assets/images/cheese-fries-600.avif 600w"
     sizes="(max-width: 640px) 319px, 298px" ...>
```
Because `sizes` tells the browser it needs ~298–319px, it picks the 600w variant (13.7 KiB) for what actually displays at 116×116 — 13.2 KiB of pure waste.

- [ ] Fix `sizes` to match this icon's real rendered width at each breakpoint (116px mobile, 66px desktop per the earlier desktop report), and add a smaller candidate to the `srcset` (e.g. a ~150w variant) so there's an appropriately small option to pick from:
  ```html
  <img src="./assets/images/cheese-fries-300.avif"
       srcset="./assets/images/cheese-fries-150.avif 150w, ./assets/images/cheese-fries-300.avif 300w"
       sizes="(max-width: 640px) 116px, 66px" ...>
  ```
- [ ] Audit every other category-circle icon (`mountain-dew`, `roll-1`, `burger-1`, etc.) for the same copy-pasted `sizes` mistake — this was very likely applied to all of them at once in round 3's fix, not just this one.

---

## Phase 4 — New accessibility findings (Accessibility: 95 → identify what's left)

This report's full accessibility detail surfaced two concrete, fixable issues:

### 4a. Insufficient color contrast — several elements failing
- [ ] `#loc-status-dot` ("● Closed" status indicator in the header)
- [ ] The card description text (`<p class="card-desc">` — every menu item's description line)
- [ ] Both button styles (`.btn.btn-primary` — "Add", "View Full Menu"; `.btn.btn-outline` — "All Reviews")
- [ ] Review timestamps (`.review-timestamp` — "2 weeks ago", "1 month ago")
- [ ] Delivery/location UI (`#btn-use-location`, `#loc-delivery-trigger-text`, `.loc-trigger-bar`)

These are almost certainly controlled by a small number of shared CSS variables (a muted-text color and a brand/primary button color). Run each foreground/background pair through a contrast checker and adjust until every one hits **4.5:1** for normal text or **3:1** for large/bold text (≥24px, or ≥19px bold). Fixing the shared variable(s) once should resolve most of these at once rather than patching each element individually.

### 4b. Heading order skips a level
- [ ] `<h4 class="adm-customize-title">Customized For Your Restaurant</h4>` — check what heading level precedes it in that section. Headings must descend sequentially (h1→h2→h3→h4) with no skipped levels. Renumber this heading to match its actual position in the hierarchy (likely h2 or h3, not h4, unless there's a genuine h3 sibling immediately before it).

### 4c. Keyboard navigation
The report notes "opportunities to improve keyboard navigation" but the detail was cut off in this excerpt — pull the full accessibility report section and address whatever it lists (commonly: missing focus outlines, tab order on the category tabs/`loc-tab-delivery` buttons, or missing `role`/`aria-selected` on the tab bar).

---

## Phase 5 — Remaining smaller items

- [ ] Forced reflow (`script.bundle.min.js:2:3716`, `:1:1294`, ~87ms attributed + 83ms unattributed) — this is very likely the same script you identify in Phase 0's investigation. Fix it as part of that work rather than separately.
- [ ] 3 long main-thread tasks — re-check after Phase 0 and Phase 2 land; both are plausible causes.
- [ ] Unused CSS: 11 KiB remaining — continue the purge pass from earlier rounds; this is now a small, low-priority remainder.

---

## Definition of done (round 4)

- [ ] Console CLS-logging snippet shows no meaningful shift on reload
- [ ] CLS < 0.1
- [ ] WhatsApp icon confirmed converted **on the live production URL**, not just in code
- [ ] Non-composited animation count confirmed dropped from 112 (not just re-submitted)
- [ ] `cheese-fries` and all other category icons have correct `sizes` values matching their real display width
- [ ] Contrast fixed on card-desc, buttons, status dot, timestamps, delivery UI
- [ ] Heading order fixed (no h-level skips)
- [ ] Performance score ≥ 90