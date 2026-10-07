# 🛡️ Universal Agent Blueprint: Mastery & Execution

This document contains the non-negotiable operational guidelines for all workspace agents. **Read this completely before making any changes.** You are evaluated on your absolute adherence to these principles.

---

## 🛑 Phase 1: Core Philosophy & Boundaries

### 1. The Zero-Destruction Guarantee (Core Rule)
This is an existing, functional project. Your primary directive is to **make exactly the requested changes while preserving everything else.**
- Do not redesign, refactor, reorganize, or "clean up" unrelated code.
- Never let existing functionality, styling, or content disappear accidentally.

### 2. Follow the Exact User Scope
Make the **smallest change necessary** to achieve the user's exact request. 
- **Do not modify**: Colors, typography, spacing, layouts, animations, logic, or component structures unless explicitly instructed.
- **Do not modernize**: Do not rewrite vanilla CSS into Tailwind or refactor functional JS into modern frameworks without permission.
- **Prefer CSS**: For visual changes, prefer CSS over modifying HTML structures.

### 3. Protect Existing UI Components
When updating any page or component, you must rigorously protect the surroundings.
- **Always preserve**: Header/Navbar, Footer, Logo, existing routing, responsive mobile/desktop layouts, and interactive elements (modals/forms).
- Verify that your edits do not bleed into or accidentally delete neighboring components.

---

## ⚡ Phase 2: Performance Guardrails (CRITICAL)

*Performance is not an afterthought. You must proactively guard the Lighthouse scores (LCP, FCP, SI) during every task.*

### 4. Strict Asset Sizing & Scaling
- **Rule 0: KB ≠ Render Cost**: Never judge an image by file size alone. Check actual pixel dimensions. A highly compressed 4000x3000px image will still destroy decode times.
- **Rule 1: Match Display Bounds**: Never serve an image significantly larger than its rendered size.
  - If a hero banner renders at `800x400`, the source asset must be resized to `~800x400` (e.g., `ffmpeg -vf scale=800:-1`).
  - If a menu grid displays items at `320x320`, do not serve `640x640` images.
- **Rule 2: Priorities**: Above-the-fold images (Hero) must have `fetchpriority="high"`. Below-the-fold images must have `loading="lazy"`.

### 5. The Loader & Splash Screen Bottleneck
If a project uses a loading overlay/splash screen that waits for `window.onload`:
- **Never use massive lossless images**: A 1.2MB lossless loader logo will halt the entire page render and tank the LCP to <60.
- **Aggressive Compression**: Always use lossy compression (`-q:v 70` or `80`) and scale the loader logo down to its exact display size (e.g., `200x200`). 

### 6. AVIF / WebP Conversion & Transparency
When instructed to convert images to modern formats (`.avif`):
- **Process Sequentially**: Process images strictly one at a time. Never batch-process or parallelize to avoid CPU/RAM limits.
- **Transparency Preservation (CRITICAL)**: If the local `ffmpeg` build (e.g., `libaom-av1`) drops the alpha channel and outputs a black/white background, you **MUST** fallback to `.webp` (using `-c:v libwebp`) or retain the `.png`. *Never output broken opaque images.*

---

## 🛠️ Phase 3: Integrity & Environment

### 7. File System Case-Sensitivity
Assume the project is deployed on **Linux/Vercel**.
- Filename casing must match exactly across the Filesystem, Git, and Source code.
- If fixing a casing error, you **must** use `git mv OldName.ext temp-name.ext` followed by `git mv temp-name.ext oldname.ext`. Do not rely on Windows Explorer renames.

### 8. Encoding Integrity (No Mojibake)
All files must remain **UTF-8 encoded**.
- Be extremely careful during mass-text replacements (e.g., PowerShell scripts). 
- Verify that special characters, emojis (`🤖`), and icons (`★`, `✓`) do not corrupt into Mojibake.

### 9. Holistic Content Updates
When given new business details (locations, names, emails, phone numbers):
- Update them consistently across the **entire app**: Footer, Header, Modals, Contact pages, configuration files (`config.js`), and SEO meta tags.
- Do not leave conflicting outdated information in obscure components.

---

## 🔍 Phase 4: Verification & Git Safety

### 10. The Persistence Rule (Do Not Stop)
Do not declare a task "done" just because you ran a script.
- **Verify**: `Reference → Correct Path → File Exists → Correct Asset → Correct Component`.
- **Fix & Repeat**: If a build fails, a path 404s, or a dimension is wrong, fix it and verify again. Do not stop until the implementation is flawless.

### 11. Measure, Don't Guess
- **Text & Layouts**: New text lengths can break flexboxes or push content below the fold. Measure the layout shift.
- **Audits**: If possible, verify the baseline LCP/Speed Index before and after your changes. If it drops by >10%, investigate the root cause immediately.

### 12. Git Safety Protocol
Before pushing any code, verify:
- `git status` / `git diff`: Ensure no unrelated files are staged and no accidental deletions occurred.
- `git remote -v`: Ensure you are pushing to the correct repository.

---

## 🧠 The Golden Directives

### Before Editing (The Agent Checklist)
1. **REQUEST**: What exactly did the user ask for?
2. **SCOPE**: Which specific files/components actually need changes?
3. **PROTECTED**: What existing content, header/footer, and functionality must survive?
4. **METHOD**: What is the smallest, safest way to implement this?
5. **VERIFICATION**: How will I verify the result?

### After Editing (The Report)
Keep your final report concise and actionable:
- **Changed**: [Files] — [Brief description]
- **Preserved**: Explicitly state that surrounding architecture was protected.
- **Verification**: [Brief result of your integrity/performance checks]

**You are an elite agent. Do exactly what is requested, protect the performance baseline, and never break the existing implementation.**
