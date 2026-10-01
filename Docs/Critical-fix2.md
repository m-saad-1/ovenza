# Prompt: Fix #2 — Page-Loader Gate + Duplicate/Dead Code

Two independent, low-risk fixes. Do them in order. Verify before deleting anything — some of this looks safe from a read-through, but confirm before acting.

## Ground rules

1. No other changes. Don't touch anything outside what's listed below.
2. For every deletion, confirm with evidence that the code is actually dead (never reachable, or fully superseded) before removing it. If you can't confirm, say so and leave it.
3. Measure before and after using PageSpeed Insights (https://pagespeed.web.dev) against the live/staging URL — no local Lighthouse needed.

---

## Task A — Fix the page-loader gate (highest impact)

**Current code** (end of the file):

```js
window.addEventListener("load", () => {
  let r = document.getElementById("page-loader");
  r && (
    (r.style.transition = "opacity 0.5s ease"),
    (r.style.opacity = "0"),
    setTimeout(() => { r.style.display = "none"; }, 500)
  );
});
```

**Problem:** `window.load` doesn't fire until *every* resource on the page — every image, video, iframe, font, stylesheet — has finished downloading. The loader overlay sits on top of the LCP element the entire time, so LCP can't be recorded until the single slowest resource on the page finishes. This is a heavier gate than `DOMContentLoaded`, not a lighter one.

### Step 1 — Identify the actual LCP element

Before changing the gate, confirm what's currently rendering as the LCP element on the homepage (PageSpeed Insights reports this directly, or check the Performance panel). Note whether it's the hero image, the hero carousel, or something else.

### Step 2 — Confirm the loader has no real dependency

Check whether anything meaningful happens between `DOMContentLoaded` and `window.load` that the loader is actually meant to hide (e.g., is the hero carousel's clone-node setup — the `ce()` function — actually called anywhere? If not, note that too, it's relevant to Task B). If nothing real depends on full resource load, proceed to Step 3.

### Step 3 — Replace the gate

Change the hide logic to fire on the earliest point that's actually safe, in this order of preference:

1. If nothing real depends on `load`: hide the loader as soon as `DOMContentLoaded` fires, or even earlier — immediately, right after the LCP element's own markup exists in the DOM — rather than waiting on any event tied to full-page resource completion.
2. If the LCP element specifically needs to finish loading first: hide the loader on that one element's own `load` event (e.g., the hero image's `load`), not on `window.load`.
3. Do not wait on anything involving videos, carousels, or other below-the-fold resources.

### Step 4 — Verify

- Confirm no flash of unstyled/broken content before the loader would have previously disappeared.
- Confirm all existing functionality still works once the page is fully interactive.

---

## Task B — Resolve the duplicate `ee()` function

Two functions are declared with the same name `ee` in the same scope:

1. An `IntersectionObserver`-based video lazy-loader (handles `source[data-src]` on `<video>` elements).
2. A social-proof toast popup, declared later — this one wins, silently overwriting the first. The video lazy-loader never runs.

### Step 1 — Check if this matters

Search the HTML for any `<video>` element containing a `<source data-src="...">`. 

- **If none exist:** the video lazy-loader was dead code even before the naming collision. Delete function #1 entirely (the `IntersectionObserver` video-loader) and rename nothing — just remove the unused function.
- **If any exist:** the lazy-load feature is currently broken — those videos never get their real `src` set, so they either never play or (check this) are being loaded some other way you should identify. Rename one of the two functions (e.g., the toast one to `showSocialProofToast`, keeping its call site updated) so both can coexist, and make sure both get called where they're needed.

### Step 2 — Verify

Confirm videos (if any) still behave as intended after the change, and that the social-proof toast still appears on `menu.html`/`offers.html` as before.

---

## Task C — Remove the duplicate orders-page renderer

`orders.html` currently has **two** separate systems rendering `.dynamic-orders-wrapper`:

1. The original `ie()` function, called inside the main `DOMContentLoaded` handler.
2. A later, separate IIFE explicitly commented `// CUSTOMER ORDERS PAGE — Enhanced Renderer (replaces old ie())`, with its own `renderOrders`/`buildCard`/`buildTimeline` functions and a `setInterval(renderOrders, 30000)`.

Both run. The second one's output ends up on screen since it runs after and overwrites the wrapper's `innerHTML`; the first's work is fully discarded every time.

There's also a **third** system in between — the `fixOrdersPage` IIFE (comment: `// 2. Orders page: comprehensive renderer...`) with its own `renderFullOrders` and `setInterval(renderFullOrders, 1500)`. Confirm whether this is actually a second duplicate or whether it's the one `ie()` was originally meant to replace — read all three before deciding.

### Step 1 — Compare the three implementations

For each of the three (`ie()`, `fixOrdersPage`'s `renderFullOrders`, and the "Enhanced Renderer"'s `renderOrders`), list what it does that the others don't — status labels, reorder flow, customer-detail display, timestamps, any localStorage writes. Confirm the `needsUpdate` flag inside `renderFullOrders` — it's declared but never appears to be set to `true` anywhere in that function; confirm whether it's genuinely inert before relying on that as justification to remove it.

### Step 2 — Keep exactly one, remove the other two

Keep whichever implementation is most complete (the comment suggests the "Enhanced Renderer" is intended to be the final one, but verify against Step 1 rather than assuming). Delete the other two function definitions and their call sites/interval timers entirely. Do not leave the old code commented out — remove it.

### Step 3 — Verify

Load `orders.html` with at least one saved order in `localStorage` and confirm:
- Orders render correctly, once (not duplicated, not conflicting).
- Reorder button still works.
- Only one polling interval remains.

---

## Measurement (after all three tasks)

1. **Homepage (Task A):** run PageSpeed Insights 3x mobile + 3x desktop. Report median LCP and Speed Index against whatever the last known baseline was.
2. **Orders page (Task C):** this is primarily a correctness fix, not a load-time one — but note in your report whether TBT or main-thread activity on that page visibly drops once the duplicate polling loop is gone (open DevTools Performance panel while the page sits idle for ~10s, before and after).
3. Report plainly: what changed, what you verified, and the numbers. If something couldn't be verified, say so rather than assuming it's fine.

## Output

One report with three sections (A, B, C), each stating: what was found, what was changed, what was verified, and the measurement result. Flag anything left unresolved.