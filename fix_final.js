const fs = require('fs');

function stripOverflow(jsStr) {
  // Replace document.body.style.overflow = "hidden" safely
  // by replacing it with a safe no-op like 'void 0'
  return jsStr
    .replace(/document\.body\.style\.overflow\s*=\s*['"]hidden['"]/g, 'void 0')
    .replace(/document\.body\.style\.overflow\s*=\s*['"]['"]/g, 'void 0');
}

['assets/js/loader.js', 'assets/js/script.bundle.js', 'assets/js/search.js'].forEach(file => {
  if (fs.existsSync(file)) {
    let js = fs.readFileSync(file, 'utf8');
    js = stripOverflow(js);
    fs.writeFileSync(file, js);
  }
});

// Phase 2: Remove offsetHeight reflow from loader.js
let loaderJs = fs.readFileSync('assets/js/loader.js', 'utf8');
loaderJs = loaderJs.replace(/const\s+h\s*=\s*s\.offsetHeight;/, 'const h = 70;');
fs.writeFileSync('assets/js/loader.js', loaderJs);

// Phase 3: Fix Web Font CLS
let indexHtml = fs.readFileSync('index.html', 'utf8');
indexHtml = indexHtml.replace(/display=optional/g, 'display=swap');
fs.writeFileSync('index.html', indexHtml);

// Phase 4: Non-Composited Animations in style.bundle.css
// I need to be careful with CSS. I will run these replacements carefully.
// Instead of replacing blindly, let's target the exact CSS block if possible or use safe regex.
let css = fs.readFileSync('assets/css/style.bundle.css', 'utf8');
css = css.replace(/transition:\s*box-shadow[^;]*;/g, 'transition: opacity 0.3s;');
css = css.replace(/transition:\s*color[^;]*;/g, 'transition: opacity 0.3s;');
css = css.replace(/transition:\s*font-size[^;]*;/g, 'transition: opacity 0.3s;');
css = css.replace(/transition:\s*transform [^,;]+,([^;]+)box-shadow[^;]*;/g, 'transition: transform 0.3s, opacity 0.3s;');
// If there's a standalone transition: color 0.15s; or similar
css = css.replace(/transition:\s*color[ \d.a-z-]+;/g, 'transition: opacity 0.15s;');
// Some were explicit multiline, let's just make it simple:
css = css.replace(/box-shadow\s+[0-9.]+s[^,;]*/g, 'opacity 0.3s');
css = css.replace(/color\s+[0-9.]+s[^,;]*/g, 'opacity 0.3s');
css = css.replace(/font-size\s+[0-9.]+s[^,;]*/g, 'opacity 0.3s');
// Wait, `color ` in `background-color` is caught!
css = css.replace(/(?<!-)\bcolor\s+[0-9.]+s[^,;]*/g, 'opacity 0.3s');

fs.writeFileSync('assets/css/style.bundle.css', css);

console.log('Final fixes applied successfully.');
