const fs = require('fs');
const CleanCSS = require('clean-css');
const terser = require('terser');

const cssSource = 'assets/css/style.bundle.css';
const cssTarget = 'assets/css/style.bundle.min.css';
const jsBundles = ['script.bundle', 'loader'];

async function build() {
  const css = fs.readFileSync(cssSource, 'utf8');
  const cssResult = new CleanCSS({
    level: { 1: { all: true }, 2: false },
    format: false,
  }).minify(css);

  if (cssResult.errors.length) {
    throw new Error(cssResult.errors.join('\n'));
  }
  fs.writeFileSync(cssTarget, cssResult.styles);

  for (const bundle of jsBundles) {
    const source = fs.readFileSync(`assets/js/${bundle}.js`, 'utf8');
    const result = await terser.minify(source, {
      ecma: 2020,
      compress: { passes: 2 },
      mangle: { toplevel: false },
      format: { comments: false },
    });

    if (result.error) throw result.error;
    fs.writeFileSync(`assets/js/${bundle}.min.js`, result.code);
  }

  console.log('Production CSS and JavaScript bundles minified successfully.');
}

build().catch((error) => {
  console.error(error);
  process.exit(1);
});
