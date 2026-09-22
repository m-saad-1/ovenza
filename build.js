const fs = require('fs');
const path = require('path');
const { PurgeCSS } = require('purgecss');
const CleanCSS = require('clean-css');
const { minify } = require('terser');

async function build() {
  const cssPath = path.join(__dirname, 'assets', 'css', 'style.bundle.css');
  const loaderPath = path.join(__dirname, 'assets', 'js', 'loader.js');
  const scriptPath = path.join(__dirname, 'assets', 'js', 'script.bundle.js');
  
  // 1. Purge and Minify CSS
  console.log('Purging CSS...');
  const purgeResult = await new PurgeCSS().purge({
    content: ['d:/WEB_DEVELOPMENT/crust/index.html', 'd:/WEB_DEVELOPMENT/crust/pages/**/*.html', 'd:/WEB_DEVELOPMENT/crust/assets/js/**/*.js'],
    css: ['d:/WEB_DEVELOPMENT/crust/assets/css/style.bundle.css'],
    safelist: ['html', 'body', /^is-loaded$/, /^active$/, /^show$/, /^open$/, /^mobile-force-show$/, /^dark-mode$/, /bounce/, /spinner-mode/, /complete/, /fade-out/, /loaded/, /visible/, /menu-grid/, /product-card/]
  });
  
  if (!purgeResult || purgeResult.length === 0) {
    console.error('PurgeResult is empty');
    return;
  }
  let purgedCss = purgeResult[0].css;
  console.log(`Purged CSS. Minifying...`);
  let minifiedCss = new CleanCSS({}).minify(purgedCss).styles;
  minifiedCss += "\nhtml { scrollbar-gutter: stable !important; }\n";
  fs.writeFileSync(path.join(__dirname, 'assets', 'css', 'style.bundle.min.css'), minifiedCss);
  console.log(`CSS minified: ${minifiedCss.length} bytes`);
  
  // 2. Minify JS
  console.log('Minifying JS...');
  const loaderCode = fs.readFileSync(loaderPath, 'utf8');
  const loaderMin = await minify(loaderCode);
  fs.writeFileSync(path.join(__dirname, 'assets', 'js', 'loader.min.js'), loaderMin.code);
  
  const scriptCode = fs.readFileSync(scriptPath, 'utf8');
  const scriptMin = await minify(scriptCode);
  fs.writeFileSync(path.join(__dirname, 'assets', 'js', 'script.bundle.min.js'), scriptMin.code);
  
  console.log('Build complete.');
}

build().catch(console.error);
