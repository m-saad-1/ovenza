78
Performance
95
Accessibility
96
Best Practices
100
SEO
1/2
Agentic Browsing
78
FCP
+10
LCP
+25
TBT
+30
CLS
+4
SI
+9
Performance
Values are estimated and may vary. The performance score is calculated directly from these metrics.See calculator.
0–49
50–89
90–100
Final Screenshot

Metrics
Expand view
First Contentful Paint
0.8 s
Largest Contentful Paint
1.5 s
Total Blocking Time
80 ms
Cumulative Layout Shift
0.516
Speed Index
3.1 s
Captured at Sep 22, 2026, 3:30 PM GMT+5
Emulated Moto G Power with Lighthouse 13.5.0
Single page session
Initial page load
Slow 4G throttling
Using HeadlessChromium 153.0.8010.36 with lr
View Treemap
Screenshot
Screenshot
Screenshot
Screenshot
Screenshot
Screenshot
Screenshot
Screenshot
Show audits relevant to:

All

FCP

LCP

TBT

CLS
Insights
Layout shift culprits
Layout shifts occur when elements move absent any user interaction. Investigate the causes of layout shifts, such as elements being added, removed, or their fonts changing as the page loads.CLSUnscored
Element
Layout shift score
Total
0.516
Combos Burgers Pizzas Rolls Fries Drinks Top Picks View All › Combo 1 1x Class…
<main>
0.516
Forced reflow
A forced reflow occurs when JavaScript queries geometric properties (such as offsetWidth) after styles have been invalidated by a change to the DOM state. This can result in poor performance. Learn more about forced reflows and possible mitigations.Unscored
Top function call
Total reflow time
…js/script.bundle.min.js?v=20:2:3716(crustpk.vercel.app)
42 ms
Source
Total reflow time
[unattributed]
83 ms
…js/script.bundle.min.js?v=20:1:1294(crustpk.vercel.app)
42 ms
…js/loader.min.js?v=20:1:67091(crustpk.vercel.app)
3 ms
Improve image delivery Est savings of 19 KiB
Reducing the download time of images can improve the perceived load time of the page and LCP. Learn more about optimizing image sizeLCPFCPUnscored
URL
Resource Size
Est Savings
vercel.app 1st party
21.0 KiB	18.7 KiB
div#category-circles-home > a.category-circle-btn > div.circle-img > img.is-loaded
<img alt="" decoding="async" loading="lazy" height="228" src="https://crustpk.vercel.app/assets/images/cheese-fries-600.avif" srcset="./assets/images/cheese-fries-300.avif 300w, ./assets/images/cheese-fries-6…" sizes="(max-width: 640px) 319px, 298px" width="228" class="is-loaded">
…images/cheese-fries-600.avif(crustpk.vercel.app)
13.7 KiB
13.2 KiB
This image file is larger than it needs to be (600x600) for its displayed dimensions (116x116). Use responsive images to reduce the image download size.
13.2 KiB
WhatsApp
<img src="./assets/images/whatsapp.png" alt="WhatsApp" style="width: 100%; height: 100%; object-fit: contain;" class="is-loaded">
…images/whatsapp.png(crustpk.vercel.app)
7.4 KiB
5.6 KiB
Using a modern image format (WebP, AVIF) or increasing the image compression could improve this image's download size.
5.0 KiB
Optimize DOM size
LCP breakdown
3rd parties
These insights are also available in the Chrome DevTools Performance Panel - record a trace to view more detailed information.
Diagnostics
Reduce unused CSS Est savings of 11 KiB
Avoid long main-thread tasks 3 long tasks found
Avoid non-composited animations 112 animated elements found
More information about the performance of your application. These numbers don't directly affect the Performance score.
Passed audits (18)
Show
95
Accessibility
These checks highlight opportunities to improve the accessibility of your web app. Automatic detection can only detect a subset of issues and does not guarantee the accessibility of your web app, so manual testing is also encouraged.
Contrast
Background and foreground colors do not have a sufficient contrast ratio.
Low-contrast text is difficult or impossible for many users to read. Learn how to provide sufficient color contrast.
Failing Elements
● Closed
<span id="loc-status-dot" style="font-size: 0.6rem; font-weight: 700; line-height: 1.2; display: block;">
Your Location ● Closed
<header class="navbar">
1x Classic Beef Burger, 1x Crispy Chicken Burger, 4x Fried Chicken Pieces, 1x F…
<p class="card-desc">
Combo 1 1x Classic Beef Burger, 1x Crispy Chicken Burger, 4x Fried Chicken Pie…
<div class="product-card" data-category="Combos">
Add
<button class="btn btn-primary" style="padding: 0.4rem 1rem; border-radius: 50px; font-size: 0.85rem;">
1x Chicken Pizza, 8x Chicken Wings, 1x 7UP, 2x Dips
<p class="card-desc">
Combo 2 1x Chicken Pizza, 8x Chicken Wings, 1x 7UP, 2x Dips Rs 1799 Add
<div class="product-card" data-category="Combos">
Add
<button class="btn btn-primary" style="padding: 0.4rem 1rem; border-radius: 50px; font-size: 0.85rem;">
Crispy chicken breast with cheese and sauce.
<p class="card-desc">
Tower Burger Crispy chicken breast with cheese and sauce. Rs 649 Add
<div class="product-card" data-category="Burgers">
Add
<button class="btn btn-primary" style="padding: 0.4rem 1rem; border-radius: 50px; font-size: 0.85rem;">
Thin smashed beef patty with pickles & sauce.
<p class="card-desc">
Smash Burger Thin smashed beef patty with pickles & sauce. Rs 700 Add
<div class="product-card" data-category="Burgers">
Add
<button class="btn btn-primary" style="padding: 0.4rem 1rem; border-radius: 50px; font-size: 0.85rem;">
Smoky BBQ sauce with caramelized onions.
<p class="card-desc">
BBQ Burger Smoky BBQ sauce with caramelized onions. Rs 800 Add
<div class="product-card" data-category="Burgers">
Add
<button class="btn btn-primary" style="padding: 0.4rem 1rem; border-radius: 50px; font-size: 0.85rem;">
Grilled chicken with golden cheese topping.
<p class="card-desc">
Chicken Pizza Grilled chicken with golden cheese topping. Rs 1400 Add
<div class="product-card" data-category="Pizzas">
Add
<button class="btn btn-primary" style="padding: 0.4rem 1rem; border-radius: 50px; font-size: 0.85rem;">
Signature crown crust loaded with cheese.
<p class="card-desc">
Crown crust Pizza Signature crown crust loaded with cheese. Rs 1600 Add
<div class="product-card" data-category="Pizzas">
Add
<button class="btn btn-primary" style="padding: 0.4rem 1rem; border-radius: 50px; font-size: 0.85rem;">
Loaded with pepperoni, chicken, and extra cheese.
<p class="card-desc">
Special Pizza Loaded with pepperoni, chicken, and extra cheese. Rs 1500 Add
<div class="product-card" data-category="Pizzas">
Add
<button class="btn btn-primary" style="padding: 0.4rem 1rem; border-radius: 50px; font-size: 0.85rem;">
View Full Menu
<a href="pages/menu.html" class="btn btn-primary" style="border-radius: 50px; padding: 0.75rem 2.5rem; font-size: 1rem;">
All Reviews
<a href="./pages/reviews.html" class="btn btn-outline" style="font-size: 0.8rem; padding: 0.4rem 0.8rem;">
2 weeks ago
<div class="review-timestamp">
A Ahmed R. ★★★★★ The burgers here are absolutely amazing! Juicy patties, fresh…
<div class="review-card" style="min-width: 280px; max-width: 280px; background: white;">
1 month ago
<div class="review-timestamp">
S Sara K. ★★★★★ Best pizza in town! We ordered the BBQ Chicken Pizza and it wa…
<div class="review-card" style="min-width: 280px; max-width: 280px; background: white;">
Delivery
<button id="loc-tab-delivery" onclick="window._locSetMode('delivery')" class="loc-tab-active">
Detect My Location
<button id="btn-use-location">
Select delivery area...
<span id="loc-delivery-trigger-text">
Select delivery area...
<button class="loc-trigger-bar" id="loc-delivery-trigger" aria-label="Select delivery location">
These are opportunities to improve the legibility of your content.
Navigation
Heading elements are not in a sequentially-descending order
Properly ordered headings that do not skip levels convey the semantic structure of the page, making it easier to navigate and understand when using assistive technologies. Learn more about heading order.
Failing Elements
Customized For Your Restaurant
<h4 class="adm-customize-title">
These are opportunities to improve keyboard navigation in your application.