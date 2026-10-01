## Role

You are a performance-diagnostics engineer. Your job right now is **not to fix anything**. Your job is to establish a reliable baseline and trace each bad metric back to its actual cause. Fixing without this step is how metrics get shuffled around instead of improved — that stops today.

## Ground rules (read before starting)

1. **No code changes in this session.** Output is a written report only, saved as `perf-diagnosis.md` in the repo root.
2. **Never trust a single Lighthouse run.** Every measurement below must be a median of at least 3 runs, and you must report the spread (min–max), not just the median, so we know how noisy the number is.
3. **Mobile and desktop are separate investigations.** Do not average them, do not assume a mobile fix applies to desktop or vice versa. Report them side by side.
4. **Trace to the actual bottleneck node, not the nearest audit.** "LCP is high" is not a diagnosis. "LCP is high because the LCP element has a 2,560 ms render delay caused by X" is a diagnosis.
5. **If you don't know the cause with evidence, say so.** Do not guess-fix. List it as "unresolved — needs further trace" instead of proposing a random change.

## Step 1 — Establish a clean baseline

1. Confirm the production build is what's being tested (`next build && next start`, or the actual deployed URL — state which).
2. Run Lighthouse **5 times** for mobile (Moto G Power emulation, Slow 4G, matching the original report) and **5 times** for desktop, back to back, same machine, same network, no other heavy processes running.
3. Report a table:

| Metric | Mobile median | Mobile min–max | Desktop median | Desktop min–max |
|---|---|---|---|---|
| FCP | | | | |
| LCP | | | | |
| TBT | | | | |
| CLS | | | | |
| Speed Index | | | | |
| Performance score | | | | |

4. If min–max spread for any metric is wide (more than ~20% of the median), say so explicitly and treat that metric as unreliable for a single before/after comparison later — it will need more runs to detect a real change.

## Step 2 — Trace the LCP render delay to its root cause

The prior report showed the LCP resource loads fast (~510 ms total) but paints ~2,560 ms late. This gap is almost always caused by one identifiable thing. Find it — do not fix it yet.

1. Open the LCP element in the rendered HTML (view-source or SSR output, not devtools after hydration). Confirm: is the hero image present and visible (no `opacity-0`, `hidden`, `invisible`, `display:none`) in the **server-rendered** HTML, before any JS runs?
2. If yes: use the browser Performance panel (or `--trace` output from Lighthouse) to find what event/task immediately precedes the LCP paint. Is it blocked by a long task, a font swap, a layout recalculation, or something else? Name the specific task by its function name or file:line.
3. If no (something hides it until JS runs): find exactly which code hides it — grep for animation libraries, `useState`/`useEffect` mount gates, CSS classes toggled after hydration, `IntersectionObserver`-based reveal-on-scroll libraries, skeleton loaders. Name the specific file and line.
4. State the root cause as a single sentence with evidence (file/line or trace timestamp), e.g.: *"Root cause: `HeroSection.tsx` line 42 wraps the image in `<motion.div initial={{opacity:0}}>`, so Chrome does not register the LCP paint until the framer-motion animation fires at ~2.6s post-load."*

## Step 3 — Trace TBT and Speed Index separately, don't lump them with LCP

TBT and SI are driven by main-thread work, which is a different root cause path than LCP's render-delay path above, even though they interact.

1. From the trace, list the top 3–5 long tasks (>50ms) on the main thread during the load window, with their source file and approximate duration.
2. For each, identify: is this first-party app code, a specific third-party script (name it — e.g. GTM, an analytics SDK, a UI library's hydration), or React/Next's own hydration cost?
3. State which of these, if removed or deferred, would most reduce TBT — and separately, which would most reduce Speed Index (these are not always the same task).

## Step 4 — Separate mobile-only and desktop-only causes

1. Compare the Step 1 tables. For any metric where mobile and desktop disagree in direction (one good, one bad), find out why using the trace, don't assume.
2. Common real causes to check for, and confirm or rule out each with evidence rather than assuming:
   - CPU-bound work (heavy JS execution) — hits mobile far harder under 4x throttling; desktop may show no issue.
   - Network-bound work (many small requests, waterfall chains) — hits mobile harder under Slow 4G; desktop's fast connection hides it.
   - Viewport-based conditional rendering (different components/images actually load per breakpoint) — can cause the two profiles to not even be testing the same DOM.
3. Report explicitly: "Mobile-specific cause: ___" and "Desktop-specific cause: ___" and "Shared cause: ___", each with evidence.

## Step 5 — Rank causes by expected impact, don't just list them

Produce a single ranked list, root causes only (not audits), ordered by estimated impact on the worst metric (currently LCP):

1. Root cause — evidence — which metric(s) it affects — mobile/desktop/both — estimated fix complexity (small/medium/large)
2. ...

This list is what future fix prompts should work through **one item at a time**, not in a batch.

## Step 6 — Output

Save everything above as `perf-diagnosis.md`. Structure:

1. Baseline tables (mobile + desktop, median + spread)
2. LCP root cause (Step 2) — one paragraph, with evidence
3. TBT/SI root causes (Step 3) — short list, with evidence
4. Mobile vs desktop divergence explanation (Step 4)
5. Ranked cause list (Step 5)
6. Anything you could not trace with confidence — list as "unresolved," do not guess

**Do not modify any source file in this session.** Stop after producing `perf-diagnosis.md`.

---

## How to use this with the fix prompt

Once `perf-diagnosis.md` exists:

1. Take **one item** from the ranked cause list — the highest-impact one.
2. Apply only the change needed to address that specific cause.
3. Re-run Lighthouse 3–5 times (mobile and desktop separately) and compare medians against the Step 1 baseline for that specific metric.
4. Only if it actually improved (beyond the noise spread from Step 1) do you keep the change and move to the next item.
5. If a metric regresses elsewhere, trace *that* with the same rigor before deciding whether it's an acceptable trade-off or a new bug.

This turns "try things and hope" into a controlled experiment, one variable at a time — which is the only way to stop metrics from bouncing around unpredictably.