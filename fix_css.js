const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'assets', 'css', 'style.bundle.css');
if (!fs.existsSync(cssPath)) return;

let content = fs.readFileSync(cssPath, 'utf8');

// Phase 4a Accessibility Overrides
const accessibilityCSS = `

/* --- Phase 4 Accessibility Fixes --- */
:not(html.dark-mode) .product-card .card-desc {
  color: #4a4a4a !important; /* improved contrast */
}
:not(html.dark-mode) #loc-status-dot {
  color: #c84b09 !important; /* using the darker primary color */
}
:not(html.dark-mode) .review-timestamp {
  color: #555555 !important;
}
:not(html.dark-mode) #btn-use-location,
:not(html.dark-mode) #loc-delivery-trigger-text,
:not(html.dark-mode) .loc-trigger-bar {
  color: #444444 !important;
}
:not(html.dark-mode) .btn.btn-outline {
  color: #444444 !important;
  border-color: #444444 !important;
}

/* Ensure focus outlines are visible for keyboard navigation */
*:focus-visible {
  outline: 2px solid var(--clr-primary, #c84b09) !important;
  outline-offset: 2px !important;
}
`;

content += accessibilityCSS;

fs.writeFileSync(cssPath, content, 'utf8');
console.log('Appended accessibility overrides to style.bundle.css');
