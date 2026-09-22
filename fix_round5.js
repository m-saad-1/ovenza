const fs = require('fs');

let css = fs.readFileSync('assets/css/style.bundle.css', 'utf8');

// Phase 0 & 1 CSS append
css += `
/* --- ROUND 5 FIXES --- */
html, body {
  scrollbar-gutter: stable !important;
}
.menu-grid {
  display: grid !important;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)) !important;
  align-items: stretch !important;
}
.product-card {
  display: flex !important;
  flex-direction: column !important;
  height: 100% !important;
}
`;

// Phase 3: Aggressive Transition cleanup
// Find transition: <anything except var(--transition), transform, opacity>; and replace it
// Since regex can be tricky with multiline, we will replace specific known layout animations
css = css.replace(/transition:\s*width[^;]+;/g, '/* transition removed for perf */');
css = css.replace(/transition:\s*gap[^;]+;/g, '/* transition removed for perf */');
css = css.replace(/transition:\s*background[^;]+;/g, '/* transition removed for perf */');
css = css.replace(/transition:\s*color[^;]+;/g, '/* transition removed for perf */');
css = css.replace(/transition:\s*border-color[^;]+;/g, '/* transition removed for perf */');
css = css.replace(/transition:\s*0\.\ds[^;]+;/g, '/* implicit all removed for perf */');
// also replace any "background-color" inside a transition
css = css.replace(/background-color\s+[0-9.]+s[^,;]*(,|;)/g, '$1');
css = css.replace(/,\s*;/g, ';');

fs.writeFileSync('assets/css/style.bundle.css', css);
console.log('CSS updated');

// Phase 2: Refactor updateUI in script.bundle.js
let js = fs.readFileSync('assets/js/script.bundle.js', 'utf8');

// Replace innerWidth reads with matchMedia
js = js.replace(/let\s+e\s*=\s*window\.innerWidth/g, "let e = window.matchMedia('(max-width: 768px)').matches ? 768 : 1024");
js = js.replace(/window\.innerWidth\s*<=\s*768/g, "window.matchMedia('(max-width: 768px)').matches");

fs.writeFileSync('assets/js/script.bundle.js', js);
console.log('JS updated');

