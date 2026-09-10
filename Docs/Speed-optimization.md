````md
# Website Performance Optimization Prompt — Mobile & Desktop

## Objective

Audit and optimize the entire website for **maximum real-world performance, fast loading, excellent Core Web Vitals, low JavaScript overhead, optimized images, efficient rendering, and smooth interactions** across both mobile and desktop.

The goal is not merely to achieve a high Lighthouse score.

The website should **actually feel fast** on:

- Mid-range mobile devices
- Slow/average 4G connections
- High-latency networks
- Older laptops
- Modern desktops
- High-resolution displays

Prioritize **real user performance** over synthetic score manipulation.

Do not sacrifice:

- UI quality
- readability
- accessibility
- SEO
- functionality
- responsiveness
- visual fidelity

for small benchmark improvements.

---

# 1. Performance Targets

Optimize toward:

### Core Web Vitals

- **LCP:** ideally < 2.5s
- **INP:** < 200ms
- **CLS:** < 0.1

### Additional goals

- Fast first content rendering
- Minimal main-thread blocking
- Minimal JavaScript execution
- Efficient network requests
- Optimized image delivery
- Minimal layout shifting
- Smooth scrolling
- Smooth animations
- Fast navigation
- Fast mobile interaction

Do not hard-code or falsely advertise a guaranteed "95+ PageSpeed" result.

Use performance optimization language that can be backed by testing.

---

# 2. First Step — Audit Before Changing Anything

Do not immediately rewrite the application.

First inspect the existing implementation.

Audit:

- Framework
- Routing
- Rendering strategy
- Client components
- Server components where applicable
- JavaScript bundle size
- CSS size
- Fonts
- Images
- SVGs
- Third-party scripts
- Analytics
- Tracking
- API calls
- Data fetching
- Caching
- Static assets
- Hydration
- DOM size
- Animation usage
- Layout shifts
- Mobile behavior

Identify the biggest performance bottlenecks first.

Create a performance baseline for:

### Mobile

- Lighthouse mobile
- Chrome DevTools throttled CPU
- Slow 4G / Fast 3G where useful

### Desktop

- Lighthouse desktop
- Normal broadband
- Throttled CPU tests where useful

Record:

- Performance score
- LCP
- INP
- CLS
- TTFB
- FCP
- Speed Index
- Total Blocking Time
- Total transferred bytes
- JavaScript execution time
- Number of requests

Do not optimize blindly.

---

# 3. Performance Budget

Establish practical budgets.

Target:

### Initial JavaScript

Keep initial JS as small as reasonably possible.

Avoid shipping large libraries to every page unnecessarily.

### Images

Do not ship oversized images.

### Fonts

Load only the fonts and weights actually used.

### Third-party scripts

Every third-party script should have a clear reason to exist.

### DOM

Avoid unnecessarily huge DOM trees.

Use simpler structures wherever possible.

---

# 4. Rendering Strategy

Use the most efficient rendering approach for each section.

Prefer:

- Static generation
- Server rendering
- Server components
- Cached server data
- HTML generated ahead of time

for content that does not need client-side interaction.

Use client-side JavaScript only where interaction requires it.

Do not turn entire pages into client components unnecessarily.

Examples of content that may not need client-side rendering:

- Headings
- Marketing copy
- Service descriptions
- Pricing descriptions
- Static feature sections
- Footer
- SEO content
- Restaurant information

Use client components only for things such as:

- Interactive menus
- Filters
- Cart
- Modals
- Dashboard interactions
- Animations requiring client state
- Forms
- Dynamic controls

---

# 5. Avoid Excessive Hydration

Minimize hydration work.

Do not make the entire page interactive if only a small part needs interaction.

For example:

Bad:

```text
Entire Homepage
→ Client Component
→ Hydrate everything
````

Better:

```text
Homepage
├── Static Hero
├── Static Services
├── Static Content
├── Static Footer
└── Small interactive components
    ├── Navigation menu
    ├── CTA
    └── Demo interaction
```

---

# 6. JavaScript Optimization

Reduce unnecessary JavaScript.

Audit:

* Large libraries
* Duplicate dependencies
* Unused packages
* Heavy UI libraries
* Icon packages
* Animation libraries
* Charting libraries
* Date libraries
* Utility libraries

Replace heavy solutions with lightweight alternatives when appropriate.

Do not install a library for functionality that can be implemented with a small amount of native code.

---

# 7. Tree Shaking

Ensure unused code is removed from production bundles.

Use imports carefully.

Prefer:

```js
import { specificFunction } from "library";
```

instead of importing entire libraries where possible.

Check bundle analysis.

Identify:

* Largest modules
* Duplicate dependencies
* Unexpected dependencies
* Unused code

---

# 8. Code Splitting

Lazy-load features that are not needed immediately.

Examples:

* Dashboard charts
* Large modal content
* Advanced analytics
* Mobile app preview
* Interactive maps
* Heavy galleries
* Complex forms

Do not load the entire dashboard application when the visitor only needs the homepage.

---

# 9. Route-Level Code Splitting

Each route should load only what it needs.

For example:

```text
/
→ Homepage bundle

/services
→ Services bundle

/pricing
→ Pricing bundle

/demo
→ Demo application bundle

/contact
→ Contact bundle
```

Do not ship dashboard-only code to the marketing homepage.

This is especially important because your restaurant dashboard is significantly heavier than the public-facing site.

---

# 10. Image Optimization

Images will likely be one of the biggest performance factors.

Optimize every image.

Use modern formats:

* AVIF
* WebP

where browser support and tooling allow.

Avoid large PNG/JPEG assets unless necessary.

---

# 11. Image Dimensions

Never send a 3000px image when the browser only displays it at 600px.

Generate responsive sizes.

Provide appropriate widths for:

* Mobile
* Tablet
* Desktop
* Retina/high-density displays

Do not scale huge images down using CSS after downloading them.

---

# 12. Responsive Image Loading

Use responsive image mechanisms such as:

```html
srcset
sizes
```

or the equivalent framework image optimization system.

The browser should choose the appropriate image size.

---

# 13. Hero Image Optimization

The hero/LCP image deserves special treatment.

Determine which element is the actual LCP element.

If the hero image is LCP:

* Use an optimized format
* Preload when appropriate
* Ensure correct dimensions
* Serve the correct responsive size
* Avoid unnecessary JavaScript dependency
* Avoid lazy-loading the primary above-the-fold image

Do not lazy-load the main LCP image.

---

# 14. Below-the-Fold Images

Images below the fold should normally be lazy-loaded.

Examples:

* Gallery
* Testimonials
* Lower-page service images
* Portfolio images
* Footer visuals

Do not load all page imagery immediately.

---

# 15. Image Compression

Compress every image appropriately.

Avoid:

* Huge transparent PNGs
* Uncompressed JPEGs
* Oversized screenshots
* Duplicate assets
* Multiple versions of the same image

For screenshots, dashboards, and device mockups:

* Crop unnecessary transparent padding
* Compress
* Use appropriate dimensions
* Use AVIF/WebP where appropriate

---

# 16. Dashboard Screenshots

The restaurant dashboard screenshots shown on the homepage should be optimized aggressively because these can be large.

Create responsive versions:

```text
Desktop
Tablet
Mobile
```

Do not use a giant 5000px screenshot everywhere.

Serve only the size needed.

---

# 17. Device Showcase Optimization

If the homepage uses:

* Laptop
* Tablet
* Phone

optimize each image independently.

Avoid one giant composite image when separate responsive assets would result in significantly smaller downloads.

Where practical, use HTML/CSS composition instead of embedding unnecessary empty transparent space in an image.

---

# 18. Image Priority

Prioritize:

### Highest priority

* Logo if immediately visible
* LCP/hero visual
* Above-the-fold essential imagery

### Lower priority

* Gallery
* Portfolio images
* Decorative graphics
* Below-the-fold cards

---

# 19. SVG Optimization

Optimize SVGs.

Remove:

* Metadata
* Unnecessary groups
* Editor information
* Hidden layers
* Excessive decimal precision
* Unused attributes

Use SVGs for:

* Icons
* Simple illustrations
* Logos
* Vector graphics

Do not use giant SVG files for simple icons.

---

# 20. Icon Optimization

Avoid importing an entire icon library into the browser.

Import only the required icons.

Do not render huge inline SVG structures repeatedly when a lightweight icon component is sufficient.

---

# 21. Fonts

Fonts can significantly affect perceived performance.

Use:

* Modern web-safe fonts
* Variable fonts where appropriate
* Only required weights
* Only required styles

Avoid loading:

```text
100
200
300
400
500
600
700
800
900
```

when you only use:

```text
400
500
600
700
```

---

# 22. Font Loading

Avoid unnecessary font blocking.

Use:

```css
font-display: swap;
```

or the equivalent recommended font loading strategy.

Where appropriate:

* Preload only critical font files
* Avoid preloading every font
* Avoid excessive font families

Do not preload assets that are not immediately needed.

---

# 23. Prevent Font Layout Shift

Make sure text does not dramatically reflow when fonts load.

Use appropriate:

* Font metrics
* Fallback font choices
* Dimensions
* CSS

CLS should remain low.

---

# 24. CSS Optimization

Remove:

* Unused CSS
* Duplicate rules
* Dead classes
* Excessive selectors
* Unnecessary animations

Avoid gigantic global CSS files.

Use component-level styles or optimized CSS architecture where appropriate.

---

# 25. Avoid Excessive CSS Complexity

Do not build simple components with layers of:

```text
wrapper
container
inner
content
inner-content
box
box-inner
```

unless necessary.

Keep DOM and CSS structures simple.

---

# 26. Reduce DOM Size

Audit the DOM for large pages.

Avoid rendering hundreds of unnecessary nodes.

Particularly check:

* Navigation
* Mega menus
* Decorative backgrounds
* Dashboard tables
* Hidden modal content
* Large icon structures
* Repeated elements

Hide inactive content efficiently.

Do not render enormous hidden structures unnecessarily.

---

# 27. Animation Performance

Animations should use GPU-friendly properties where possible.

Prefer:

```text
transform
opacity
```

Avoid animating expensive properties unnecessarily:

```text
width
height
top
left
margin
padding
box-shadow
filter
```

where they cause repeated layout or paint work.

---

# 28. Reduce Excessive Animations

Avoid:

* Continuous decorative animation
* Large parallax systems
* Scroll-driven effects everywhere
* Excessive blur
* Heavy gradients
* Constant background animation

The site should feel premium without becoming computationally expensive.

---

# 29. Respect Reduced Motion

Support:

```css
prefers-reduced-motion
```

Reduce or disable nonessential motion for users who request reduced motion.

---

# 30. Hover Effects

Hover effects should remain lightweight.

Avoid expensive combinations of:

* Blur
* Backdrop filters
* Large shadows
* Filters
* Continuous transitions

Use:

* opacity
* transform
* subtle background changes
* simple borders

---

# 31. Header Performance

The header is visible immediately.

Keep it lightweight.

Do not load unnecessary:

* animations
* large images
* client-side logic
* tracking
* menus

Only interactive behavior should require client JavaScript.

---

# 32. Mobile Navigation

Mobile navigation should open instantly.

Do not load a heavy navigation system.

Use a lightweight:

* Menu button
* Drawer
* Overlay

with minimal JavaScript.

---

# 33. Third-Party Scripts

Audit every third-party script.

Potential examples:

* Google Analytics
* Meta Pixel
* Google Maps
* Chat widgets
* WhatsApp integrations
* Social widgets
* Review widgets
* Calendars

Ask:

> Does this script directly contribute to a business goal?

If not, remove it.

---

# 34. Delay Non-Critical Third-Party Scripts

Load nonessential scripts:

* after initial rendering
* after interaction
* after consent where applicable
* when the relevant section becomes visible

Examples:

Do not load Google Maps on initial page load if the map is far below the fold.

Load it when the user approaches/interacts with the map.

---

# 35. Analytics

Analytics should not significantly delay page rendering.

Use appropriate loading strategies.

Do not block the critical rendering path with analytics scripts.

---

# 36. Chat / AI Widgets

AI/chat widgets can be heavy.

Do not load the full AI assistant application immediately unless necessary.

Instead:

* Render a lightweight trigger
* Load the chat system when opened
* Lazy-load the full interface

This can significantly reduce initial JavaScript.

---

# 37. Google Maps

Do not immediately load interactive Google Maps libraries on every page.

For pages where a map is below the fold:

* Render a static preview or lightweight placeholder
* Load the interactive map on demand

---

# 38. Reviews & Social Widgets

Avoid third-party review widgets that inject large scripts if a simple server-rendered/static representation is sufficient.

For example:

Instead of loading a huge review platform script just to display:

> ★★★★★ 4.8/5

consider rendering the relevant information directly when appropriate.

---

# 39. Network Requests

Minimize initial requests.

Audit:

* Requests per page
* Request size
* Request priority
* Cache headers
* Duplicate requests
* Unnecessary API calls

Avoid requesting the same data multiple times.

---

# 40. Preconnect

For genuinely critical external origins, use appropriate preconnect strategies.

Do not add preconnect for every external domain.

Only use it when the resource is genuinely required early.

---

# 41. Preload

Preload only critical assets.

Good candidates may include:

* Actual LCP image
* Critical font where justified

Do not preload:

* Every image
* Every font
* Non-critical scripts
* Below-the-fold resources

Incorrect preloading can hurt performance.

---

# 42. Prefetching

Use route prefetching carefully.

Do not aggressively prefetch huge routes simply because they might be visited.

For a lightweight marketing site, normal intelligent route prefetching may be sufficient.

For the large demo dashboard, be more conservative.

---

# 43. Caching

Use appropriate caching for:

* Static assets
* Images
* Fonts
* Public content
* API responses
* CMS data

Set long-lived immutable caching for versioned static assets.

Avoid repeatedly downloading identical resources.

---

# 44. CDN

Serve static assets through a CDN where appropriate.

Use CDN delivery for:

* Images
* Fonts
* CSS
* JavaScript
* Other static assets

Make sure caching is configured properly.

---

# 45. Compression

Enable:

* Brotli
* Gzip fallback where appropriate

Compress:

* JavaScript
* CSS
* HTML
* SVG
* JSON

Do not compress already compressed image formats unnecessarily.

---

# 46. HTTP Protocol

Use modern HTTP infrastructure where available:

* HTTP/2
* HTTP/3

Ensure assets can be delivered efficiently.

---

# 47. TTFB

Investigate slow server responses.

If TTFB is high:

* Check hosting
* Check server execution
* Check database calls
* Check API requests
* Check unnecessary middleware
* Check redirects
* Check cold starts

Target a fast response from the server.

---

# 48. Avoid Redirect Chains

Do not create:

```text
page A
→ redirect B
→ redirect C
→ redirect D
```

Use direct URLs.

---

# 49. Backend/API Optimization

For dynamic pages:

* Minimize API calls
* Combine related requests when appropriate
* Cache repeated queries
* Avoid serial requests
* Avoid fetching unnecessary fields

Bad:

```text
Request 1
↓
Request 2
↓
Request 3
↓
Request 4
```

Prefer parallel requests where possible:

```text
Request 1 ─┐
Request 2 ─┼→ Render
Request 3 ─┘
```

---

# 50. Avoid Waterfall Fetching

Audit the network waterfall.

Look for:

```text
HTML
 ↓
JS
 ↓
API 1
 ↓
API 2
 ↓
Image
 ↓
Image
```

Replace unnecessary waterfalls with:

* server-side fetching
* parallel fetching
* static generation
* preloaded critical assets
* cached responses

---

# 51. Dashboard Performance

Your restaurant dashboard is a separate performance challenge from the marketing website.

Do not load every dashboard module at once.

Only load:

* Current route
* Current data
* Current charts

Lazy-load:

* Analytics
* Advanced reports
* Large tables
* Maps
* KDS-specific components
* Heavy charts

---

# 52. Dashboard Tables

Large tables can become expensive.

Use:

* Pagination
* Virtualization where needed
* Server-side filtering where applicable
* Efficient rendering

Do not render 5,000 rows just because the database has them.

---

# 53. Dashboard Charts

Charts can be expensive.

Only render charts that are actually visible.

Use:

* Lazy rendering
* Memoization when appropriate
* Efficient chart libraries
* Simplified datasets

Do not recreate charts unnecessarily whenever unrelated state changes.

---

# 54. Dashboard State Management

Avoid global state updates that cause the entire dashboard to re-render.

Keep state as local as practical.

For example:

Changing:

> Order status

should not unnecessarily rerender:

* Entire sidebar
* Every chart
* Every table
* Every customer card

---

# 55. React Performance

Where using React:

Use:

* Server Components where appropriate
* `memo` only where it provides measurable benefit
* `useMemo` / `useCallback` only when justified
* Stable keys
* Proper list rendering
* Lazy loading
* Suspense

Do not blindly memoize everything.

Optimize actual bottlenecks.

---

# 56. Avoid Unnecessary Re-Renders

Check:

* Parent state
* Context providers
* Global stores
* Inline object creation
* Inline callbacks
* Derived calculations

Keep frequently changing state close to where it is used.

---

# 57. Search & Filtering

For large datasets:

Do not filter thousands of rows by repeatedly executing expensive calculations on every keystroke.

Use:

* Debouncing
* Efficient selectors
* Server-side search for very large data
* Memoized derived data where justified

---

# 58. Mobile-Specific Performance

Mobile deserves separate optimization.

Prioritize:

* Smaller images
* Less JavaScript
* Fewer animations
* Fewer third-party scripts
* Smaller DOM
* Lower CPU usage
* Fast initial render

Do not assume desktop optimizations automatically solve mobile performance.

---

# 59. Cellular Networks

Test using throttled mobile connections.

Test at least:

* Fast 4G
* Slow 4G
* High latency

The page should remain usable even when bandwidth is limited.

---

# 60. Mobile CPU

Simulate mid-range/low-end devices.

Look for:

* Long scripting tasks
* Heavy animations
* Slow menu opening
* Scroll jank
* Delayed button response
* Slow modal opening

Avoid relying only on a powerful development machine.

---

# 61. Desktop Optimization

Desktop should also remain efficient.

Large monitors should not cause:

* huge images to download
* unnecessarily large DOM
* excessive dashboard rendering

Serve appropriate image sizes.

---

# 62. Above-the-Fold Strategy

The initial viewport should be extremely lightweight.

Prioritize:

* Header
* Hero
* Main CTA
* Critical visual
* Essential trust indicators

Defer everything else.

---

# 63. Critical Rendering Path

Keep the critical path small.

Avoid unnecessary dependencies between:

* HTML
* CSS
* JS
* fonts
* hero assets
* external scripts

The browser should be able to paint useful content quickly.

---

# 64. CLS Prevention

Every image/video/iframe should have known dimensions.

Reserve space before loading.

Do not inject content above already-rendered content.

Avoid layout jumps from:

* images
* fonts
* banners
* cookie notices
* dynamic widgets
* delayed content

---

# 65. Video Optimization

If the website contains video:

* Do not autoplay large videos unnecessarily
* Use poster images
* Compress video
* Lazy-load video
* Consider click-to-play
* Avoid loading video on mobile unless necessary

A large hero video can destroy mobile performance.

---

# 66. Gallery Optimization

Your restaurant website includes food galleries.

Use:

* Thumbnail images
* Lazy loading
* Responsive image sizes
* Lightweight preview
* Full-resolution image only after opening lightbox

Do not load full-resolution gallery assets immediately.

---

# 67. Lightbox Performance

Load the full lightbox system only when needed.

Do not load a heavy gallery library just because a gallery exists below the fold.

---

# 68. Customer-Facing Ordering Experience

The ordering interface must remain fast.

Prioritize:

* Menu loading
* Category switching
* Product selection
* Cart updates
* Checkout

Avoid expensive animations every time a customer adds an item.

Cart interactions should feel instantaneous.

---

# 69. Product Images in Menu

Use small optimized thumbnails.

Only load larger product imagery when appropriate.

Use:

* Responsive sizing
* Lazy loading
* Proper aspect ratios

---

# 70. Mobile Menu Performance

Restaurants will likely receive significant mobile traffic.

Optimize:

* Category navigation
* Product list
* Search
* Filters
* Cart
* Checkout

Do not render hundreds of hidden menu items simultaneously if the menu is extremely large.

---

# 71. Pricing Page Performance

Pricing pages should remain lightweight.

Do not load huge product/dashboard bundles just to show pricing cards.

Pricing interactions should use lightweight components.

---

# 72. Services Page Performance

The Services page may contain many cards.

Do not load every heavy asset immediately.

Use:

* Lightweight icons
* Minimal JavaScript
* Lazy-loaded imagery
* Efficient card structures

---

# 73. About Demo Modal Performance

The About Demo modal should be lightweight.

Do not load a complete secondary application just because the modal exists.

Use static text and lightweight components.

Load additional content only when required.

---

# 74. Demo Dashboard Performance

Because the restaurant dashboard is large:

Use route-level lazy loading.

For example:

```text
Dashboard
→ Overview bundle

Orders
→ Orders bundle

POS
→ POS bundle

Kitchen
→ KDS bundle

Analytics
→ Analytics bundle

Inventory
→ Inventory bundle
```

Do not load all of these on initial dashboard startup.

---

# 75. Reduce Third-Party Dependency in the Demo

The demo should use simulated data whenever real APIs are not needed.

Do not call:

* real maps
* real analytics
* real payment systems
* real AI
* real messaging APIs

just to make the demo look functional.

Simulation can dramatically reduce complexity and improve performance.

---

# 76. Prefetching Dashboard Routes

If a user is highly likely to move from Dashboard → Orders, selective prefetching may be appropriate.

Do not prefetch every route.

Prioritize likely next actions.

---

# 77. Error Handling & Performance

Errors should not cause giant fallback UIs.

Use lightweight error states.

Make sure failed optional resources do not prevent the page from rendering.

---

# 78. Accessibility & Performance

Do not sacrifice accessibility for speed.

Maintain:

* Semantic HTML
* Keyboard navigation
* Focus states
* Accessible labels
* Proper contrast
* Screen-reader support

A fast inaccessible website is not a successful optimization.

---

# 79. SEO & Performance

Ensure optimization does not break:

* metadata
* structured data
* canonical URLs
* headings
* crawlable content
* sitemap
* robots
* Open Graph
* Twitter cards

Keep important textual content available to search engines.

---

# 80. Structured Data

Restaurant structured data should remain lightweight.

Do not load unnecessary client JavaScript just to provide schema.

Generate structured data server-side/static wherever appropriate.

---

# 81. Avoid Performance Tricks That Hurt UX

Do not:

* hide content until JS loads
* delay useful content artificially
* remove accessible text
* manipulate the page specifically to inflate Lighthouse
* defer essential functionality
* replace readable content with canvas
* block interaction for benchmark purposes

Optimize the real experience.

---

# 82. Browser Compatibility

Test major modern browsers:

* Chrome
* Edge
* Safari
* Firefox

Pay particular attention to:

* Mobile Safari
* Chrome Android

---

# 83. Mobile Safari

Test:

* viewport behavior
* fixed elements
* bottom navigation
* sticky headers
* modal height
* touch interactions
* image rendering
* safe areas

Avoid performance-heavy effects that behave poorly on mobile Safari.

---

# 84. Device Pixel Ratio

Ensure high-DPI devices do not automatically receive unnecessarily huge assets.

Serve appropriate responsive dimensions.

---

# 85. Optimize Background Images

Background images often become performance problems.

Where possible:

* use `<img>`/optimized image components for important imagery
* use CSS backgrounds only when semantically appropriate
* optimize background sizes
* avoid huge background images

Do not use a massive image as a CSS background if it is the primary LCP element.

---

# 86. Lazy-Load Sections

For very heavy sections, use lazy rendering when appropriate.

Potential examples:

* Advanced dashboard charts
* Maps
* Testimonials with external widgets
* Large galleries
* Video
* Complex animations

Do not lazy-load content so aggressively that users see blank gaps.

---

# 87. Skeletons

Use lightweight skeletons where necessary.

Do not make the skeleton itself heavier than the content.

Skeletons should preserve layout dimensions and prevent CLS.

---

# 88. Interaction Responsiveness

Important buttons should respond quickly.

For example:

```text
Add to cart
→ immediate visual feedback

Open mobile menu
→ immediate

Open About Demo
→ immediate

Change order status
→ immediate UI update
```

Do not wait unnecessarily for server responses before showing obvious local state changes.

Use optimistic UI where appropriate and safe.

---

# 89. Debounce Expensive Events

Use debouncing for:

* Search
* Window resize calculations
* API-driven filters
* Auto-save
* Analytics events

Do not fire expensive operations on every keystroke.

---

# 90. Scroll Performance

Avoid heavy scroll listeners.

Prefer:

* IntersectionObserver
* CSS
* passive event listeners where appropriate

Do not continuously calculate complex layout information on every scroll event.

---

# 91. IntersectionObserver

Use it for:

* lazy-loading sections
* triggering animations
* loading maps
* loading galleries
* starting noncritical content

This is generally more efficient than manual scroll calculations.

---

# 92. LocalStorage / SessionStorage

Do not constantly read/write storage during rendering.

Use storage selectively.

Avoid storing huge datasets in browser storage.

---

# 93. Service Worker / PWA

Only introduce a service worker if it provides a meaningful benefit.

Do not add PWA complexity simply for marketing.

If used:

* Cache carefully
* Avoid stale business data
* Do not cache sensitive information improperly

---

# 94. Security and Performance

Avoid performance optimizations that weaken security.

Maintain:

* HTTPS
* Secure headers
* Safe caching rules
* Correct API authorization
* Secure cookies
* CSP where appropriate

---

# 95. Monitoring

After optimization, establish real performance monitoring.

Monitor:

* LCP
* INP
* CLS
* TTFB
* Errors
* Slow pages
* Device categories
* Connection types

Separate:

* Mobile
* Desktop

This will show whether improvements work for actual users.

---

# 96. Test Real User Performance

Do not rely exclusively on Lighthouse.

Use:

* PageSpeed Insights
* Chrome DevTools
* WebPageTest where appropriate
* Real-device testing
* Real-world throttling
* Real User Monitoring when available

Test repeatedly.

---

# 97. Test Before and After

Create a before/after table:

```text
Metric                 Before       After
LCP
INP
CLS
TTFB
JS transferred
Image bytes
Total requests
FCP
Speed Index
```

Do not claim success without evidence.

---

# 98. Performance Regression Prevention

After optimization, establish rules so future development doesn't undo the gains.

Examples:

* Image size checks
* Bundle size checks
* Lighthouse CI
* Performance budgets
* Dependency review
* Asset optimization workflow

Every major feature should consider performance impact.

---

# 99. Priority Order

Optimize in this order:

## Priority 1 — Critical

1. LCP
2. Largest images
3. Excessive JavaScript
4. Slow server response
5. Render-blocking resources
6. Layout shifts
7. Main-thread blocking

## Priority 2 — High

8. Third-party scripts
9. Fonts
10. Large DOM
11. Heavy animations
12. Excessive API calls
13. Dashboard rendering

## Priority 3 — Medium

14. Below-the-fold images
15. Gallery
16. Maps
17. Advanced interactions
18. Noncritical widgets

## Priority 4 — Fine Tuning

19. Micro-optimizations
20. Minor bundle reductions
21. Small animation improvements

Do not spend hours optimizing tiny details while the hero image is 4 MB.

---

# 100. Mobile-First Performance Priority

When choosing between two equivalent approaches:

> Prefer the implementation that is cheaper for mobile.

Mobile should be the strictest performance constraint.

The website should still feel fast on:

* Mid-range Android
* Average 4G
* High-latency cellular network

---

# 101. Desktop Performance Priority

Desktop should benefit from:

* wider layouts
* richer imagery
* more advanced dashboard interactions

but should not become bloated.

Use responsive asset delivery so desktop gets appropriate resources without forcing mobile to download them.

---

# 102. Final Acceptance Criteria

The website is only considered successfully optimized when:

* Homepage loads quickly on mobile.
* Homepage loads quickly on desktop.
* Hero/LCP asset is optimized.
* No unnecessary large assets are downloaded.
* JavaScript is minimized.
* Client-side hydration is limited.
* Third-party scripts are controlled.
* Fonts are optimized.
* Images use responsive delivery.
* Below-the-fold content is lazy-loaded appropriately.
* CLS remains low.
* Interactions remain responsive.
* No obvious scroll jank exists.
* Dashboard routes load independently.
* Large dashboard datasets are paginated/virtualized where needed.
* Charts do not cause unnecessary re-renders.
* Mobile navigation opens instantly.
* About Demo opens instantly.
* The ordering interface remains responsive.
* Animations are lightweight.
* Reduced-motion support exists.
* SEO remains intact.
* Accessibility remains intact.
* No horizontal overflow exists.
* No performance feature breaks visual quality.
* Real-device tests confirm improvements.

---

# 103. Final Instruction to the Agent

Do not perform a superficial "Lighthouse optimization."

First audit the application.

Identify the largest performance bottlenecks.

Then fix the highest-impact problems first.

Prioritize:

```text
Real User Speed
↓
Mobile Performance
↓
Core Web Vitals
↓
Image Optimization
↓
JavaScript Reduction
↓
Rendering Strategy
↓
Network Efficiency
↓
Third-Party Control
↓
Dashboard Performance
↓
Micro-optimizations
```

After each major optimization, retest the affected route.

Do not rewrite working architecture without evidence that it is a performance bottleneck.

Do not sacrifice functionality, design quality, accessibility, or SEO simply to increase a benchmark score.

The final result should be a **fast, responsive, premium website that feels instant on mobile and desktop while retaining the complete visual experience and functionality.**

```
```
