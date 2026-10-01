# Universal Agent Instructions

## 1. Core Rule

**Read this file before making any changes.**

This is an existing project. **Preserve the existing website/application unless the user explicitly requests a change.**

The goal is:

> **Make exactly the requested changes while preserving everything else.**

Do not redesign, refactor, remove, replace, or "improve" unrelated parts.

---

## 2. Preserve Existing UI & Structure — CRITICAL

**Never make existing content or UI disappear unless the user explicitly asks for it.**

Always preserve:

* Header / Navbar
* Footer
* Logo
* Existing sections
* Existing pages
* Existing components
* Navigation
* Buttons and links
* Forms
* Cards
* Modals
* Existing functionality
* Desktop layout
* Mobile layout
* Responsive behavior
* Existing styling

When updating a page, **do not accidentally remove sections, components, footer, header, or existing functionality.**

If modifying a component, preserve everything that is not part of the request.

Before replacing any component or section, verify that all existing functionality and content are carried over.

---

## 3. Follow the Exact User Scope

Do not make unrequested changes.

Unless explicitly requested, do NOT change:

* Colors
* Typography
* Spacing
* Layout
* Dimensions
* Borders/radius
* Shadows
* Animations
* Hover effects
* Responsive behavior
* Header
* Footer
* Navigation
* Components
* Content
* Images/assets
* URLs
* Functionality
* Data structures
* Architecture

Do not apply "better design", "modernization", or personal preferences without permission.

If the request is ambiguous, ask before making broad changes.

---

## 4. Minimal-Diff Principle

Make the **smallest change necessary**.

* Modify only relevant files.
* Modify only relevant code.
* Do not rewrite entire files for small changes.
* Do not reformat unrelated code.
* Do not rename unrelated variables/classes.
* Do not refactor unrelated code.
* Do not reorganize the project unnecessarily.

For visual changes, prefer **CSS over HTML/JavaScript** when possible.

For CSS-only requests, do not modify JavaScript unless technically required.

---

## 5. Assets & Images

When the user requests an asset update:

1. Inspect the relevant asset directories first.
2. Identify the correct actual files.
3. Match assets to their correct pages/components/content.
4. Update **every relevant reference**, not just the first occurrence.
5. Remove obsolete references only when they are part of the requested update.
6. Verify every referenced asset actually exists.

Never blindly replace image extensions or filenames.

### AVIF Conversion

If the user requests image conversion:

* Convert required images to `.avif`.
* Process images **strictly one at a time**.
* Never batch-convert or parallelize image processing.
* After each conversion, immediately verify:

  * File exists
  * File is readable
  * Filename is correct
  * Source-code reference is correct
  * Actual image matches the intended asset

Check:

* `assets/images`
* `assets/gallery`
* Other relevant asset directories

Audit image references across:

* `.jsx`
* `.tsx`
* `.js`
* `.ts`
* `.css`
* `.html`
* JSON/data/config files

Do not leave broken, missing, placeholder, obsolete, or incorrectly named image references.

---

## 6. Case Sensitivity — CRITICAL

Assume the project will run on **Linux/Vercel**, even if development is performed on Windows.

Filename casing must match exactly between:

* Filesystem
* Git
* Source code

When changing filename casing, use:

```bash
git mv OldName.avif temp-name.avif
git mv temp-name.avif oldname.avif
```

Then verify with:

```bash
git ls-files
```

Do not rely only on Windows Explorer or the local filesystem.

---

## 7. Content Updates

When the user provides new business/project information, update it consistently across every relevant location.

Check:

* Pages
* Header
* Footer
* Cards
* Modals
* Forms
* Contact sections
* Navigation
* Data files
* Metadata where applicable

Do not leave old information behind in another component.

---

## 8. Encoding Integrity

All edited files must remain **UTF-8 encoded**.

After edits, verify that emojis and special characters remain intact.

Watch for Mojibake such as:

```text
★

🤖
```

Do not allow encoding corruption during mass replacements or file rewrites.

---

## 9. Git Safety

Before pushing:

```bash
git status
git remote -v
git diff
git ls-files
```

Verify:

* Correct repository
* Correct branch
* Only intended files are changed
* No unrelated project files are staged
* No accidental deletions
* No incorrect filename casing

Never push to a repository that has not been verified as the intended project.

---

## 10. Verification

Do not assume the task is complete after editing.

Verify the actual result.

Depending on the request, check:

* All relevant pages
* Header
* Footer
* Existing sections
* Components
* Images
* Modals
* Navigation
* Desktop
* Mobile
* Responsive behavior
* Build
* Runtime behavior
* Asset paths
* File casing

For asset changes, verify:

`Reference → Correct Path → File Exists → Correct Asset → Correct Component`

For larger changes, run the project's build and fix all errors before finishing.

---

## 11. Persistence Rule — DO NOT STOP AFTER THE FIRST FIX

If verification discovers a problem:

**Fix it → verify again → repeat until resolved.**

Do not stop after saying:

> "The paths have been updated."

or:

> "The images have been converted."

If broken references, missing assets, deleted sections, build errors, runtime errors, incorrect casing, or outdated content remain, the task is **not complete**.

---

## 12. Before Editing

Determine:

```text
REQUEST:
What exactly did the user ask for?

SCOPE:
Which files/components actually need changes?

PROTECTED:
What existing content, styling, sections, header, footer, and functionality must remain?

METHOD:
What is the smallest safe way to implement it?

VERIFICATION:
How will the result be verified?
```

Do not scan or modify the entire project unnecessarily.

---

## 13. Final Report

After completing the task, provide a concise report:

```text
Changed:
- [file/component] — [change]

Preserved:
- Existing header, footer, sections, styling, and functionality unless explicitly changed.

Verification:
- [brief verification result]
```

Do not provide a long explanation unless requested.

---

# Golden Rule

**Do exactly what the user asks.**

**Do not redesign, refactor, remove, replace, optimize, reorganize, or "fix" anything outside the requested scope.**

**Never allow existing header, footer, sections, components, styling, content, or functionality to disappear accidentally.**

When in doubt:

> **Preserve the existing implementation.**




# IMPORTANT

# Standing Instruction: Performance Guardrails for Every Change

Attach this to every task where you ask the agent to swap text, images, or any other content into a project — especially a duplicated/templated project. The agent must follow this on its own, without being reminded each time.

---

## Rule 0 — A "small file" is not the same as "cheap to render"

Never judge an image by its KB size alone. Before adding or replacing any image, check its **actual pixel dimensions** (not the file size) using whatever tool is available in the environment (`identify` from ImageMagick, Python `PIL.Image.open(path).size`, `exiftool`, or the OS file inspector — pick one that exists). A well-compressed 80KB file can still be 4000×3000px, and decode cost scales with pixel count, not byte size. This is the single most common cause of "I used a smaller image and performance still dropped."

## Rule 1 — Every image swap must pass this checklist before being considered done

For each image added or replaced:

1. Get the image's **actual rendered width and height** in the layout (check the CSS/container at the relevant breakpoints — mobile, tablet, desktop), not just "it looks fine."
2. Resize the source file so its largest dimension does not meaningfully exceed the largest rendered width across breakpoints (roughly 1.5–2x for retina, not more).
3. Confirm the image is served through whatever optimization pipeline the project already has (framework image component, a build-time image plugin, a CDN transform) — never bypass it with a raw `<img src>` pointing straight at an unprocessed file, if the project has such a pipeline.
4. Confirm `width` and `height` (or equivalent aspect-ratio CSS) are set explicitly, so the layout doesn't shift when the image loads.
5. Confirm format: prefer AVIF/WebP with a fallback if the pipeline supports it; don't ship raw PNG/JPEG for photographic content if better options exist in this project's stack.
6. If the image is above the fold / is the likely LCP element, it should load eagerly with high priority; if it's below the fold, it should lazy-load. Don't flip these by accident when swapping content.
7. If this project has a loader/splash-screen overlay (check for one before assuming it doesn't), confirm the new image doesn't get stuck behind it — verify the overlay's removal isn't gated on anything that got heavier because of this change (e.g., a bigger bundle now takes longer to hit `DOMContentLoaded`).

## Rule 2 — Text/content changes aren't free either

- Longer text can push new elements below the fold or change wrap points — check for new layout shift, not just "the text fits."
- New text must not silently pull in new font weights/subsets that weren't already loaded. If a new weight or style is now used, it has a real cost — flag it, don't add it silently.

## Rule 3 — Never trust "it looks the same" — measure

Any change that touches images, fonts, above-the-fold markup, or third-party scripts requires a before/after check, even if the agent is confident it's harmless:

1. Before the change: note the current LCP, Speed Index, and Performance score (use PageSpeed Insights — https://pagespeed.web.dev — against the live/staging URL if local Lighthouse isn't available; run it at least twice and use the better-supported number, not a single run).
2. Make the change.
3. After the change: re-run the same check.
4. If LCP or Speed Index regress by more than ~10%, do not consider the task done — investigate why before moving on, using the same root-cause tracing discipline as the diagnostic protocol (find the actual mechanism, don't guess).
5. Report the before/after numbers alongside the change, every time. "I swapped the image" is not a complete report; "I swapped the image, LCP went from X to Y" is.

## Rule 4 — When duplicating a project as a starting point

Before changing any content in a cloned/templated project, first confirm you understand what's already driving its performance profile — do not assume a copy inherits good performance just because the original was fine, and do not assume a copy inherits bad performance just because a past version had issues. Specifically check:

- Is there a loader/overlay pattern, and what does it wait on?
- What's already wired into the image-optimization pipeline, and what isn't?
- What's the current baseline (LCP/SI/TBT, mobile and desktop) **before you touch anything** — so any later regression can be attributed correctly instead of blamed on "the images," "the text," or guessed at.

## Non-negotiable

If any of the checks above can't be completed (no tool available to check pixel dimensions, no way to measure before/after), say so explicitly instead of proceeding anyway. A skipped check reported honestly is fine; a skipped check reported as "done" is how regressions stack up silently over multiple rounds of edits.